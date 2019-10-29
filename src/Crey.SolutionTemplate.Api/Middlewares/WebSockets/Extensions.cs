namespace Crey.SolutionTemplate.Api.Middlewares.WebSockets
{
    using System.Reflection;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.DependencyInjection;

    public static class Extensions
    {
        public static IApplicationBuilder MapWebSocketManager(
            this IApplicationBuilder app,
            PathString path,
            BaseHandler handler)
        {
            return app.Map(path, (webApp) => webApp.UseMiddleware<ManagerMiddleware>(handler));
        }

        public static IServiceCollection AddWebSocketManager(this IServiceCollection services)
        {
            services.AddTransient<ConnectionManager>();
            var assembly = Assembly.GetEntryAssembly();
            if (assembly != null)
            {
                foreach (var type in assembly.ExportedTypes)
                {
                    if (type.GetTypeInfo().BaseType == typeof(BaseHandler))
                    {
                        services.AddSingleton(type);
                    }
                }
            }

            return services;
        }
    }
}
