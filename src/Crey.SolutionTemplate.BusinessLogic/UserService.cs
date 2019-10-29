namespace Crey.SolutionTemplate.BusinessLogic
{
    using System;
    using System.IdentityModel.Tokens.Jwt;
    using System.Linq;
    using System.Net;
    using System.Security.Claims;
    using System.Text;
    using System.Threading.Tasks;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using Microsoft.IdentityModel.Tokens;
    using Crey.SolutionTemplate.BusinessLogic.Configuration;
    using Crey.SolutionTemplate.BusinessLogic.Exceptions;
    using Crey.SolutionTemplate.BusinessLogic.Resources.Translations;
    using Crey.SolutionTemplate.DataAccess.Repositories;
    using Crey.SolutionTemplate.Model;
    using Crey.SolutionTemplate.Model.Exceptions;
    using Crey.SolutionTemplate.Utils.Mail;
    using Crey.SolutionTemplate.Utils.Security;
    using Crey.SolutionTemplate.Utils.Translations;

    public class UserService : ServiceWithoutContext<User>
    {
        private readonly FrontEnd frontEndConfig;

        private readonly ResetSecurity securityConfig;

        private readonly ITranslationProvider translationProvider;

        private readonly MailSender mailSender;

        private readonly ILogger<UserService> logger;

        /// <summary>
        /// <see cref="Service{T, TContext}.Service(IRepository{T, TContext})"
        /// </summary>
        public UserService(
            IRepository<User> repo,
            IOptions<FrontEnd> frontEndConfig,
            IOptions<ResetSecurity> securityConfig,
            ITranslationProvider translationProvider,
            ILogger<UserService> logger,
            MailSender mailSender)
            : base(repo)
        {
            this.frontEndConfig = frontEndConfig.Value;
            this.securityConfig = securityConfig.Value;
            this.translationProvider = translationProvider;
            this.mailSender = mailSender;
            this.logger = logger;
        }

        public async Task Initialize(string adminEmail, string adminPassword)
        {
            var adminUser = await this.FindAsync(adminEmail);
            if (adminUser == null)
            {
                adminUser = new User
                {
                    Email = adminEmail,
                    FirstName = "Admin",
                    LastName = "Admin"
                };
                adminUser.SetPassword(adminPassword);
                await this.MainRepository.InsertAsync(adminUser);
            }
            else
            {
                if (adminUser.CheckPassword(adminPassword))
                {

                }
                else
                {
                    adminUser.SetPassword(adminPassword);
                    await this.MainRepository.UpdateAsync(adminUser);
                }
            }
        }

        public async Task<IUser> AuthenticateAsync(string email, string password)
        {
            var user = await this.FindAsync(email);
            if (user != null)
            {
                if (user.CheckPassword(password))
                {
                    return user;
                }
                else
                {
                    throw new Exception($"Invalid credentials");
                }
            }
            else
            {
                throw new Exception($"User {email} not found");
            }
        }

        public async Task<User> FindAsync(string email)
        {
            return (await this.MainRepository.QueryAsync(query => query.Where(usr => usr.Email == email)))
                .FirstOrDefault();
        }

        public override async Task<User> SaveAsync(User user)
        {
            if (user.Id != null)
            {
                var userCurrent = await this.MainRepository.FindAsync(user);
                userCurrent.Email = user.Email;
                userCurrent.FirstName = user.FirstName;
                userCurrent.LastName = user.LastName;

                // Not a new user : no password change.
                return await base.SaveAsync(userCurrent);
            }
            else
            {
                var existingUser = await this.FindAsync(user.Email);
                if (existingUser == null)
                {
                    // New user password is generated.
                    using (var pwdGenerator = new PasswordGenerator())
                    {
                        var pwd = pwdGenerator.GetRandomString(8, PasswordGenerator.AlphaNumericalCharacters);
                        user.SetPassword(pwd);
                        var savedUser = await base.SaveAsync(user);
                        await this.mailSender.SendMailAsync<BusinessLogicTranslations>(
                            savedUser.Email,
                            $"{savedUser.FirstName} {savedUser.LastName}",
                            t => t.AccountCreationMailBody(
                                $"{savedUser.FirstName} {savedUser.LastName}",
                                $"{this.frontEndConfig.Url}/ResetPassword/{this.GenerateTokenForReset(user.Email)}"),
                            t => t.AccountCreationMailSubject);
                        return savedUser;
                    }
                }
                else
                {
                    throw new InvalidEntityException($"The mail {user.Email} already exists.");
                }
            }
        }

        public async Task AskResetPassowrd(string userEmail)
        {
            var user = await this.FindAsync(userEmail);
            if (user != null)
            {

                await this.mailSender.SendMailAsync<BusinessLogicTranslations>(
                    user.Email,
                    $"{user.FirstName} {user.LastName}",
                    t => t.AccountPasswordResetEmailBody(
                        $"{user.FirstName} {user.LastName}",
                        $"{this.frontEndConfig.Url}/ResetPassword/{this.GenerateTokenForReset(userEmail)}"),
                    t => t.AccountPasswordResetEmailSubject
                );
            }
            else
            {
                await this.mailSender.SendMailAsync<BusinessLogicTranslations>(
                    userEmail,
                    string.Empty,
                    (t) => t.AccountPasswordResetEmailBodyNotFound,
                    (t) => t.AccountPasswordResetEmailSubject
                );
            }
        }

        public async Task ResetPassword(string password, string tokenString)
        {
            try
            {
                new JwtSecurityTokenHandler().ValidateToken(
                    tokenString,
                    new TokenValidationParameters
                    {
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this.securityConfig.Signing)),
                        ValidateAudience = false,
                        ValidateIssuer = false,
                        ValidateIssuerSigningKey = true
                    },
                    out var token);
                var jwtSecurityToken = token as JwtSecurityToken;
                if (jwtSecurityToken != null)
                {
                    var email = jwtSecurityToken.Claims.First(cl => cl.Type.Equals("sub")).Value;
                    var user = await this.FindAsync(email);
                    if (user != null)
                    {
                        user.SetPassword(password);
                        await this.SaveAsync(user);
                    }
                    else
                    {
                        throw new EntityNotFoundException($"The user with e-mail {email} was not found.");
                    }
                }
                else
                {
                    throw new SecurityTokenValidationException("Cannot deserialize token");
                }

            }
            catch (SecurityTokenValidationException exc)
            {
                this.logger.LogError(exception: exc, "The token is not valid.");
                throw new TokenValidationException($"The token is not valid.");
            }
        }

        private string GenerateTokenForReset(string userMail)
        {
            var claims = new[]
                {
                    new Claim("sub", userMail)
                };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(this.securityConfig.ResetLinkValidityMinutes),
                notBefore: DateTime.UtcNow,
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this.securityConfig.Signing)),
                    SecurityAlgorithms.HmacSha256)
            );
            return WebUtility.UrlEncode(new JwtSecurityTokenHandler().WriteToken(token));
        }
    }
}
