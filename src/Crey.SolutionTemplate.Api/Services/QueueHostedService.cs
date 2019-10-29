namespace Crey.SolutionTemplate.Api.Services
{
    using System.Threading.Tasks;
    using System.Threading;
    using System;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Extensions.Logging;
    using Crey.SolutionTemplate.Utils.Threading;

    public class QueueHostedService<TBackgroundTask, TParam> : BackgroundService
        where TBackgroundTask: IBackgroundTask<TParam>
        where TParam: struct
    {
        private readonly IBackgroundTaskQueue<TParam> taskQueue;

        private readonly ILogger logger;

        public QueueHostedService(IBackgroundTaskQueue<TParam> taskQueue, ILogger<QueueHostedService<TBackgroundTask, TParam>> logger)
        {
            this.taskQueue = taskQueue;
            this.logger = logger;
        }

        protected async override Task ExecuteAsync(CancellationToken cancellationToken)
        {
            this.logger.LogInformation($"Starting QueueHostedService");
            while (!cancellationToken.IsCancellationRequested)
            {
                var workItem = await this.taskQueue.DequeueAsync(cancellationToken);

                this.logger.LogInformation($"Starting workitem {workItem.Item1.Name}");
                try
                {
                    await workItem.Item1.ExecuteAsync(workItem.Item2, cancellationToken);
                }
                catch (Exception ex)
                {
                    this.logger.LogError(ex, $"Error occured executing {workItem.Item1.Name}");
                    throw;
                }
                this.logger.LogInformation($"Workitem {workItem.Item1.Name} is finished");
            }
            this.logger.LogInformation($"Stopping QueueHostedService");
        }
    }
}
