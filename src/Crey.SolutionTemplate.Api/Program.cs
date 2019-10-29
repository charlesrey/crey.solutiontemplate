namespace Crey.SolutionTemplate.Api
{
    using System.Threading.Tasks;
    using System;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Logging;
    using NLog.Web;
    using Microsoft.Extensions.Hosting;

    public class Program
    {
        public static async Task Main(string[] args)
        {
            // NLog: setup the logger first to catch all errors
            var logger = NLog.Web.NLogBuilder.ConfigureNLog("nlog.config").GetCurrentClassLogger();
            try
            {
                logger.Debug("init main");
                var host = Program.CreateHostBuilder(args).Build();
                await host.InitAsync();
                host.Run();
            }
            catch (Exception ex)
            {
                //NLog: catch setup errors
                logger.Error(ex, "Stopped program because of exception");
                throw;
            }
            finally
            {
                // Ensure to flush and stop internal timers/threads before application-exit (Avoid segmentation fault on Linux)
                NLog.LogManager.Shutdown();
            }
        }

        /// <summary>
        /// Creation of the API Host
        /// </summary>
        /// <param name="args">Arguments passed at startup</param>
        /// <returns>A <see cref="IWebHostBuilder"/> based on the <see cref="Startup"/></returns>
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host
                .CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                })
                .ConfigureLogging(logging =>
                {
                    logging.ClearProviders();
                    logging.SetMinimumLevel(Microsoft.Extensions.Logging.LogLevel.Trace);
                })
                .UseNLog();
    }
}
