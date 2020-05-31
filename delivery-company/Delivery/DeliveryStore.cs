using System;
using System.Collections.Generic;
using System.Linq;

namespace DeliveryCompany
{
    public interface IDeliveryStore
    {
        event EventHandler<Delivery>? newDelivery;
    }

    public class DeliveryStore : IDeliveryStore
    {
        private readonly List<Delivery> _database = new List<Delivery>();

        public event EventHandler<Delivery>? newDelivery;

        public DeliveryStore()
        {
            // CreateDelivery();
            // CreateDelivery();
        }

        public Delivery? GetDelivery(string id) => _database.FirstOrDefault(p => p.Id == id);

        public IEnumerable<Delivery> GetDeliveries(DeliveryStatus status) => _database.Where(p => p.CurrentStatus == status);

        public Delivery CreateDelivery(NewDelivery newData)
        {
            var delivery = new Delivery
            {
                Id = Guid.NewGuid().ToString().Substring(0, 5),
                SenderNotificationUrl = newData.SenderNotificationUrl,
                ReferenceId = newData.ReferenceId,
                ReceiverInfo = new ReceiverInfo
                {
                    Address = newData.Address,
                    Sms = newData.Sms
                }
            };

            _database.Add(delivery);
            Console.WriteLine(delivery.Id);

            return delivery;
        }

        public void UpdateDelivery(Delivery delivery)
        {
            var old = GetDelivery(delivery.Id);

            if (old != null)
                _database.Remove(old);

            _database.Add(delivery);

            if (delivery.CurrentStatus == DeliveryStatus.Picked)
                newDelivery?.Invoke(this, delivery);
        }
    }
}