using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace DeliveryCompany
{
    public class WebSocketMiddleware
    {
        private readonly ConcurrentDictionary<string, WebSocket> _sockets = new ConcurrentDictionary<string, WebSocket>();

        private readonly JsonSerializerSettings _camelCaseSettings = new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };

        private readonly RequestDelegate _next;
        private readonly CancellationToken _token = CancellationToken.None;

        public WebSocketMiddleware(RequestDelegate next, DeliveryStore store)
        {
            _next = next;
            store.newDelivery += (_, delivery) =>
            {
                _sockets.Values
                    .Where(socket => socket.State == WebSocketState.Open)
                    .ToList()
                    .ForEach(async socket =>
                    {
                        var message = new 
                        {
                             Sms = delivery.ReceiverInfo.Sms,
                             Address = delivery.ReceiverInfo.Address,
                             OrderId = delivery.ReferenceId
                        };
                        var text = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(message, _camelCaseSettings));
                        var buffer = new ArraySegment<byte>(text);
                        await socket.SendAsync(buffer, WebSocketMessageType.Text, true, _token);
                    });
            };
        }

        public async Task Invoke(HttpContext context)
        {
            if (!context.WebSockets.IsWebSocketRequest)
            {
                await _next(context);
                return;
            }

            var webSocket = await context.WebSockets.AcceptWebSocketAsync();

            _sockets.TryAdd(webSocket.GetHashCode().ToString(), webSocket);

            while (webSocket.State == WebSocketState.Open)
            {
                var buffer = new ArraySegment<Byte>(new Byte[1024]);
                var received = await webSocket.ReceiveAsync(buffer, _token);

                switch (received.MessageType)
                {
                    case WebSocketMessageType.Close:
                        await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, string.Empty, _token);
                        _sockets.TryRemove(webSocket.GetHashCode().ToString(), out WebSocket? toRemove);
                        return;
                    default:
                        return;
                }
            }
        }
    }
}