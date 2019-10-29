namespace Crey.SolutionTemplate.Api.Middlewares.WebSockets
{
    using System.Net.WebSockets;
    using System.Text;
    using System.Threading;
    using System.Threading.Tasks;
    using System.Threading.Tasks.Dataflow;
    using ArqueBus.Abstractions;
    using Crey.SolutionTemplate.Api.Dtos;
    using Newtonsoft.Json;

    public class ProgressHandler : BaseHandler
    {
        private readonly IEventBus<string, Progress> eventBus;

        public ProgressHandler(
            ConnectionManager connectionManager,
            IEventBus<string, Progress> eventBus) : base(connectionManager)
        {
            this.eventBus = eventBus;
        }

        public override async Task ReceiveAsync(WebSocket socket, WebSocketReceiveResult result, byte[] buffer)
        {
            var cancellationTokenSource = new CancellationTokenSource();
            var options = new DataflowBlockOptions
            {
                CancellationToken = cancellationTokenSource.Token
            };
            var buildProgress = JsonConvert.DeserializeObject<Progress>(
                Encoding.UTF8.GetString(buffer, 0, result.Count));
            var tasks = this.eventBus.ListenAsync<Progress>(buildProgress.TaskId.ToString(), options);
            this.eventBus.Subscribe(
                buildProgress.TaskId.ToString(),
                async data =>
                {
                    if (socket.State == WebSocketState.Open)
                    {
                        buildProgress.Percentage = data.Percentage;
                        await this.SendMessageAsync(socket, JsonConvert.SerializeObject(buildProgress));
                        if (data.Percentage == -1)
                        {
                            cancellationTokenSource.Cancel();
                        }
                        else
                        {
                            // Still waiting for the end.
                        }
                    }
                    else
                    {
                        cancellationTokenSource.Cancel();
                    }
                }
            );
            await tasks;
        }
    }
}
