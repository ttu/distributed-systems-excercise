using System;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;

namespace DeliveryCompany
{
    public class NotifyBackgroundService : BackgroundService
    {
        private IHttpClientFactory _httpClient;
        private readonly DeliveryStore _store;

        public NotifyBackgroundService(IHttpClientFactory httpClient, DeliveryStore store)
        {
            _httpClient = httpClient;
            _store = store;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var notified = _store.GetDeliveries(DeliveryStatus.Notified);

                notified.ToList().ForEach(c =>
                {
                    // Fire picked event 30 sec after state has been notified
                    var duration = DateTimeOffset.UtcNow - c.Events.Last().UpdateTime;
                    if (duration.TotalSeconds > 30)
                    {
                        Console.WriteLine($"Delivery state to Picked: {c.Id}");
                        c.Events.Add(new DeliveryEvent(DeliveryStatus.Picked));
                        _store.UpdateDelivery(c);
                    }
                });

                var created = _store.GetDeliveries(DeliveryStatus.Created);

                var notifyTasks = created.Select(async c =>
                {
                    Console.WriteLine($"Changing state to notified: {c.Id}");

                    var content = new StringContent(
                        JsonConvert.SerializeObject(new { c.Id, c.ReferenceId, PickUpTime = DateTimeOffset.UtcNow.AddSeconds(30) }),
                        Encoding.UTF8, "application/json");

                    var response = await _httpClient.CreateClient().PostAsync(c.SenderNotificationUrl, content);
                    if (response.IsSuccessStatusCode)
                    {
                        Console.WriteLine($"Delivery state to Notified: {c.Id}");
                        c.Events.Add(new DeliveryEvent(DeliveryStatus.Notified));
                        _store.UpdateDelivery(c);
                    }
                    else
                    {
                        Console.WriteLine($"Failed to change state to Notified: {c.Id}");
                    }
                });

                await Task.WhenAll(notifyTasks);

                await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
            }
        }
    }

    // Copyright (c) .NET Foundation. Licensed under the Apache License, Version 2.0.
    /// <summary>
    /// Base class for implementing a long running <see cref="IHostedService"/>.
    /// </summary>
    public abstract class BackgroundService : IHostedService, IDisposable
    {
        private Task _executingTask;
        private readonly CancellationTokenSource _stoppingCts = new CancellationTokenSource();

        protected abstract Task ExecuteAsync(CancellationToken stoppingToken);

        public virtual Task StartAsync(CancellationToken cancellationToken)
        {
            // Store the task we're executing
            _executingTask = ExecuteAsync(_stoppingCts.Token);

            // If the task is completed then return it,
            // this will bubble cancellation and failure to the caller
            if (_executingTask.IsCompleted)
            {
                return _executingTask;
            }

            // Otherwise it's running
            return Task.CompletedTask;
        }

        public virtual async Task StopAsync(CancellationToken cancellationToken)
        {
            // Stop called without start
            if (_executingTask == null)
                return;

            try
            {
                // Signal cancellation to the executing method
                _stoppingCts.Cancel();
            }
            finally
            {
                // Wait until the task completes or the stop token triggers
                await Task.WhenAny(_executingTask, Task.Delay(Timeout.Infinite,
                                                              cancellationToken));
            }
        }

        public virtual void Dispose()
        {
            _stoppingCts.Cancel();
        }
    }
}