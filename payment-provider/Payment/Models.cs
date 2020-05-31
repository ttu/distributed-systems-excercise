using System;

namespace PaymentProvider
{
    public class Payment
    {
        public Payment(double amount) => Amount = amount;

        public string Id { get; } = Guid.NewGuid().ToString().Substring(0, 4);
        public double Amount { get; }
        public DateTimeOffset CreationTime { get; } = DateTimeOffset.UtcNow;
        public DateTimeOffset? UpdateTime { get; set; }
        public PaymentState State { get; set; } = PaymentState.Created;
    }

    public enum PaymentState
    {
        Created,
        Paid,
        Cancelled
    }

    public class NewPayment
    {
        public double? Amount { get; set; }

    }

    public class NewPaymentState
    {
        public string? Id { get; set; }
        public PaymentState State { get; set; }
    }
}