namespace Crey.SolutionTemplate.Api
{
    using System;
    using AspNet.Security.OpenIdConnect.Primitives;
    using AutoMapper;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc.Authorization;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using Crey.SolutionTemplate.BusinessLogic;
    using Crey.SolutionTemplate.DataAccess.RavenDb.Repositories;
    using Crey.SolutionTemplate.DataAccess.Repositories;
    using Crey.SolutionTemplate.Model;
    using Crey.SolutionTemplate.Utils.Threading;
    using Crey.SolutionTemplate.Api.Middlewares.WebSockets;
    using Crey.SolutionTemplate.Api.Middlewares;
    using Crey.SolutionTemplate.Api.Security;
    using Crey.SolutionTemplate.Api.Services;
    using Newtonsoft.Json.Serialization;
    using Newtonsoft.Json;
    using Raven.Client.Documents;
    using Crey.SolutionTemplate.Utils.Translations;
    using Crey.SolutionTemplate.BusinessLogic.Configuration;
    using Microsoft.AspNetCore.Localization;
    using System.Collections.Generic;
    using System.Globalization;
    using Crey.SolutionTemplate.Utils.Configuration;
    using Crey.SolutionTemplate.Utils.Mail;
    using Microsoft.Extensions.Hosting;
    using Microsoft.AspNetCore.Authentication.JwtBearer;

    public class Startup
    {
        /// <summary>
        /// Policy name regarding CORS
        /// </summary>
        private const string ApiCorsPolicyName = "AllowSpecificOrigin";

        public Startup(IConfiguration configuration)
        {
            this.Configuration = configuration;
        }

        public IConfiguration Configuration { get; private set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
               options.AddPolicy(
                    Startup.ApiCorsPolicyName,
                    builder => builder.WithOrigins(this.Configuration.GetSection("FrontEnd").GetValue<string>("Url"))
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()));
            services.AddHttpContextAccessor();
            services.AddScoped<AuthorizationProvider>();
            services.AddAuthentication(
                    options =>
                    {
                        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                    })
                .AddOAuthValidation()
                .AddOpenIdConnectServer(
                    options =>
                    {
                        var sectionSecurity = this.Configuration.GetSection("Security");
                        var sectionToken = sectionSecurity.Exists() ? sectionSecurity.GetSection("Tokens") : null;

                        var accessTokenLifeTime = sectionToken != null && sectionToken.Exists() ?
                            sectionToken.GetValue<int>("AccessTokenLifetime") :
                            5;
                        var refreshTokenLifeTime = sectionToken != null && sectionToken.Exists() ?
                            sectionToken.GetValue<int>("RefreshTokenLifetime") :
                            30;
                        options.ProviderType = typeof(AuthorizationProvider);
                        options.AuthorizationEndpointPath = "/connect/authorize";
                        options.TokenEndpointPath = "/connect/token";
                        options.AllowInsecureHttp = true;
                        options.AccessTokenLifetime = TimeSpan.FromMinutes(accessTokenLifeTime);
                        options.RefreshTokenLifetime = TimeSpan.FromMinutes(refreshTokenLifeTime);
                    });

            services.AddSingleton<IDocumentStore>(
                (servicesProvider) =>
                {
                    var store = new DocumentStore
                    {
                        Urls = new string[] { this.Configuration.GetConnectionString("CreySolutionTemplateDbUrl") },
                        Database = this.Configuration.GetConnectionString("CreySolutionTemplateDbName")
                    };
                    store.Initialize();
                    return store;
                });
            services.AddSingleton(typeof(IBackgroundTaskQueue<>), typeof(BackgroundTaskQueue<>));
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            services.AddScoped(typeof(IService<>), typeof(Service<>));
            services.AddScoped<UserService>();
            services.AddTransient<MailSender>();
            services.AddTransient<ITranslationProvider, TranslationProvider>();
            services.AddAutoMapper();
            services
                .AddControllers(
                    config =>
                    {
                        var policy = new AuthorizationPolicyBuilder()
                            .RequireAuthenticatedUser()
                            .RequireClaim(OpenIdConnectConstants.Claims.Role)
                            .Build();
                        config.Filters.Add(new AuthorizeFilter(policy));
                    })
                .AddNewtonsoftJson(
                    options =>
                    {
                        options.SerializerSettings.ContractResolver = new DefaultContractResolver();
                        options.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Local;
                    });
            services.AddAuthorization(
                options =>
                {
                    options.AddPolicy(
                        PolicyConstants.IsAdmin,
                        policy => policy.RequireClaim(OpenIdConnectConstants.Claims.Role, Role.Admin.ToString()));
                });
            services
                .AddAsyncInitializer<AppInitializer>()
                .Configure<AdminCredentials>(this.Configuration.GetSection("Admin"))
                .Configure<Smtp>(this.Configuration.GetSection("Mail"))
                .Configure<FrontEnd>(this.Configuration.GetSection("FrontEnd"))
                .Configure<ResetSecurity>(this.Configuration.GetSection("ResetSecurity"));
            //services.AddWebSocketManager();
            services.AddScoped<IConnectedUserProvider>((serviceProvider) =>
            {
                var httpContext = serviceProvider.GetService<IHttpContextAccessor>();
                return new ConnectedUserProvider(
                    httpContext.HttpContext.User.FindFirst("username").Value,
                    serviceProvider.GetService<UserService>());
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(
            IApplicationBuilder app,
            IHostEnvironment env,
            ILoggerFactory loggerFactory,
            IServiceProvider serviceProvider)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }
            app.UseRouting();
            app.UseCors(Startup.ApiCorsPolicyName);

            app.UseRequestLocalization(options =>
            {
                options.DefaultRequestCulture = new RequestCulture(culture: "fr-CH", uiCulture: "fr-CH");
                options.SupportedCultures = new List<CultureInfo> {
                    new CultureInfo("fr-CH"),
                    new CultureInfo("en-US")
                };
                options.SupportedUICultures = new List<CultureInfo> {
                    new CultureInfo("fr-CH"),
                    new CultureInfo("en-US")
                };
                options.RequestCultureProviders.Clear();
                options.RequestCultureProviders.Insert(0, new AcceptLanguageHeaderRequestCultureProvider());
            });

            app.UseAuthentication();
            app.UseAuthorization();
            app.UseCors("AllowSpecificOrigin");
            //app.UseWebSockets();
            app.UseStaticFiles();
            app.UseEndpoints(
                endpoints =>
                {
                    endpoints.MapControllers();
                });

            //app.MapWebSocketManager("/websocket/progress", serviceProvider.GetService<ProgressHandler>());
        }
    }
}
