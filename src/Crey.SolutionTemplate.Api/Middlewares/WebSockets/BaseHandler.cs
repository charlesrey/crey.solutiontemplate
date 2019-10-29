namespace Crey.SolutionTemplate.Api.Middlewares.WebSockets
{
    using System.Net.WebSockets;
    using System.Text;
    using System.Threading.Tasks;
    using System.Threading;
    using System;

    public abstract class BaseHandler
    {
        protected ConnectionManager ConnectionManager { get; private set; }

        public BaseHandler(ConnectionManager connectionManager)
        {
            this.ConnectionManager = connectionManager;
        }

        public virtual void OnConnected(WebSocket socket, string key)
        {
            this.ConnectionManager.Add(socket, key);
        }

        public virtual async Task OnDisconnected(WebSocket socket, string key)
        {
            await this.ConnectionManager.Remove(socket, key);
        }

        public async Task SendMessageAsync(WebSocket socket, string message)
        {
            if (socket.State != WebSocketState.Open)
            {
                throw new InvalidOperationException("Socket is not opened");
            }
            else
            {
                await socket.SendAsync(
                    buffer: new ArraySegment<byte>(
                        array: Encoding.UTF8.GetBytes(message),
                        offset: 0,
                        count: message.Length),
                    messageType: WebSocketMessageType.Text,
                    endOfMessage: true,
                    cancellationToken: CancellationToken.None);
            }
        }

        public async Task SendMessageAsync(string socketId, string message)
        {
            await SendMessageAsync(this.ConnectionManager.GetSocketById(socketId), message);
        }

        public abstract Task ReceiveAsync(WebSocket socket, WebSocketReceiveResult result, byte[] buffer);
    }
}
