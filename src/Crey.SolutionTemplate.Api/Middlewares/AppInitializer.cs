namespace Crey.SolutionTemplate.Api.Middlewares
{
    using System.Threading.Tasks;
    using Microsoft.Extensions.Options;
    using Crey.SolutionTemplate.BusinessLogic;
    using Crey.SolutionTemplate.Api.Security;
    using Extensions.Hosting.AsyncInitialization;

    public class AppInitializer : IAsyncInitializer
    {

        private readonly UserService userService;

        private readonly IAdminCredentials adminCredentials;

        public AppInitializer(UserService userService, IOptions<AdminCredentials> adminCredentials)
        {
            this.userService = userService;
            this.adminCredentials = adminCredentials.Value;
        }

        public async Task InitializeAsync()
        {
            if (this.adminCredentials != null)
            {
                await this.userService.Initialize(this.adminCredentials.Mail, this.adminCredentials.Password);
            }
            else
            {
                // No admin defined in configuration.
            }
        }
    }
}
