using System;
using System.Collections.Generic;
using System.Linq;

namespace PaymentProvider
{
    public class PaymentStore
    {
        private readonly List<Payment> _database = new List<Payment>();

        public PaymentStore()
        {
            CreatePayment(40);
            CreatePayment(30);
        }
        public Payment CreatePayment(double value)
        {
            var payment = new Payment(value);
            _database.Add(payment);
            Console.WriteLine(payment.Id);
            return payment;
        }

        public Payment? GetPayment(string id) => _database.FirstOrDefault(p => p.Id == id);

        public void UpdatePayment(Payment payment)
        {
            var old = GetPayment(payment.Id);

            if (old != null)
                _database.Remove(old);

            _database.Add(payment);
        }
    }
}
