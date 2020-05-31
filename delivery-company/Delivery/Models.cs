using System;
using System.Collections.Generic;
using System.Linq;

namespace DeliveryCompany
{
    public enum DeliveryStatus
    {
        Created,
        Notified,
        Picked,
        Delivered
    }

    public class Delivery
    {
        public string Id { get; set; }
        public DeliveryStatus CurrentStatus => Events.Last().Status;
        public DateTimeOffset CreationDate { get; } = DateTimeOffset.Now;
        public string SenderNotificationUrl { get; set; }
        public ReceiverInfo ReceiverInfo { get; set; }
        public string ReferenceId { get; set; }
        public List<DeliveryEvent> Events { get; } = 
                new List<DeliveryEvent> 
                {
                    new DeliveryEvent(DeliveryStatus.Created)
                };
    }

    public class DeliveryEvent
    {
        public DeliveryEvent(DeliveryStatus status) => Status = status;
        public DeliveryStatus Status { get; }
        public DateTimeOffset UpdateTime { get; } = DateTimeOffset.Now;

    }

    public class ReceiverInfo
    {
        public string Address { get; set; }
        public string Sms { get; set; }
        public DateTimeOffset DeliveryDate { get; set; }

        // TODO: Endpoints for the WebSocket
        // Now will just notify all
    }

    public class NewDelivery
    {
        public string SenderNotificationUrl { get; set; }
        public string Address { get; set; }
        public string Sms { get; set; }
        public string ReferenceId { get; set; }
    }

    public class NewStatus
    {
        public string Id { get; set; }

        public DeliveryStatus Status { get; set; } = DeliveryStatus.Created;
    }
}
