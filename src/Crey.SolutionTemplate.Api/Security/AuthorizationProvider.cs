namespace Crey.SolutionTemplate.Api.Security
{
    using System.Security.Claims;
    using System.Threading.Tasks;
    using AspNet.Security.OpenIdConnect.Extensions;
    using AspNet.Security.OpenIdConnect.Primitives;
    using AspNet.Security.OpenIdConnect.Server;
    using Crey.SolutionTemplate.BusinessLogic;
    using Microsoft.AspNetCore.Authentication;
    using System.Collections.Generic;
    using System;

    public sealed class AuthorizationProvider : OpenIdConnectServerProvider
    {
        private readonly UserService userService;
        public AuthorizationProvider(UserService userService)
        {
            this.userService = userService;
        }
        public override Task ValidateTokenRequest(ValidateTokenRequestContext context)
        {
            if (!context.Request.IsPasswordGrantType() && !context.Request.IsRefreshTokenGrantType())
            {
                context.Reject(
                    error: OpenIdConnectConstants.Errors.UnsupportedGrantType,
                    description: "Only resource owner password credentials and refresh token are accepted by this authorization server");
            }
            else
            {
                context.Skip();
            }
            return Task.FromResult(0);
        }

        public override async Task HandleTokenRequest(HandleTokenRequestContext context)
        {
            if (context.Request.IsPasswordGrantType())
            {
                try
                {
                    var user = await this.userService.AuthenticateAsync(context.Request.Username, context.Request.Password);
                    var identity = new ClaimsIdentity(context.Scheme.Name);
                    identity.AddClaim(OpenIdConnectConstants.Claims.Subject, user.Email);
                    identity.AddClaim(
                        "username",
                        $"{user.Email}",
                        OpenIdConnectConstants.Destinations.AccessToken,
                        OpenIdConnectConstants.Destinations.IdentityToken);
                    identity.AddClaim(
                        OpenIdConnectConstants.Claims.Role,
                        user.Role.ToString(),
                        new List<string> {
                            OpenIdConnectConstants.Destinations.AccessToken,
                            OpenIdConnectConstants.Destinations.IdentityToken});
                    // Create a new authentication ticket holding the user identity.
                    var ticket = new AuthenticationTicket(
                        new ClaimsPrincipal(identity),
                        new AuthenticationProperties(),
                        context.Scheme.Name);
                    // Set the list of scopes granted to the client application.
                    ticket.SetScopes(
                        OpenIdConnectConstants.Scopes.OpenId,
                        OpenIdConnectConstants.Scopes.Email,
                        OpenIdConnectConstants.Scopes.Profile,
                        OpenIdConnectConstants.Scopes.OfflineAccess);
                    context.Validate(ticket);
                }
                catch
                {
                    context.Reject(
                        error: OpenIdConnectConstants.Errors.InvalidGrant,
                        description: "Utilisateur et/ou mot de passe incorrect");
                }
            }
            else
            {
                // Cas du refresh_token ASOS gère tout seul
            }
        }

        public override async Task ApplyTokenResponse(ApplyTokenResponseContext context)
        {
            context.HttpContext.Response.Headers.Add("Access-Control-Allow-Origin", "http://localhost:7844");
            context.HttpContext.Response.Headers.Add("Access-Control-Allow-Method", "*");
            context.HttpContext.Response.Headers.Add("Access-Control-Allow-Header", "*");
            context.HttpContext.Response.Headers.Add("Access-Control-Allow-Credentials", "true");
            await Task.FromResult(0);
        }
    }
}
