namespace Crey.SolutionTemplate.Api.Middlewares.WebSockets
{
    using System.Net.WebSockets;
    using System.Threading.Tasks;
    using System.Threading;
    using System;
    using Microsoft.AspNetCore.Http;

    public class ManagerMiddleware
    {
        private readonly RequestDelegate next;
        private BaseHandler handler { get; set; }

        public ManagerMiddleware(
            RequestDelegate next,
            BaseHandler handler)
        {
            this.next = next;
            this.handler = handler;
        }

        public async Task Invoke(HttpContext context)
        {
            if (!context.WebSockets.IsWebSocketRequest)
                return;

            var socket = await context.WebSockets.AcceptWebSocketAsync();
            this.handler.OnConnected(socket, context.Request.Path);

            await this.Receive(
                socket,
                async (result, buffer) =>
                {
                    if (result.MessageType == WebSocketMessageType.Text)
                    {
                        await this.handler.ReceiveAsync(socket, result, buffer);
                    }
                    else if (result.MessageType == WebSocketMessageType.Close)
                    {
                        await this.handler.OnDisconnected(socket, context.Request.Path);
                    }

                });

            //TODO - investigate the Kestrel exception thrown when this is the last middleware
            //await _next.Invoke(context);
        }

        private async Task Receive(WebSocket socket, Action<WebSocketReceiveResult, byte[]> handleMessage)
        {
            var buffer = new byte[1024 * 4];

            while (socket.State == WebSocketState.Open)
            {
                var result = await socket.ReceiveAsync(
                    buffer: new ArraySegment<byte>(buffer),
                    cancellationToken: CancellationToken.None);
                handleMessage(result, buffer);
            }
        }
    }
}
