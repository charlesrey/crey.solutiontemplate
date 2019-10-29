namespace Crey.SolutionTemplate.Api.Middlewares.WebSockets
{
    using System.Collections.Concurrent;
    using System.Net.WebSockets;
    using System.Threading.Tasks;
    using System.Threading;

    public class ConnectionManager
    {
        private readonly ConcurrentDictionary<string, WebSocket> sockets = new ConcurrentDictionary<string, WebSocket>();

        public string Add(WebSocket socket, string key)
        {
            this.sockets.TryAdd(key, socket);
            return key;
        }

        public async Task Remove(WebSocket socket, string key)
        {
            this.sockets.TryRemove(key, out var socketTemp);
            await socket.CloseAsync(
                WebSocketCloseStatus.NormalClosure,
                "Socket closed by the connection manager",
                CancellationToken.None
            );
        }

        public WebSocket GetSocketById(string id)
        {
            return this.sockets[id];
        }
    }
}
