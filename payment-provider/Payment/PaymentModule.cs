using Carter;
using Carter.Request;
using Carter.Response;
using Carter.ModelBinding;
using System.Net;
using System;

namespace PaymentProvider
{
    public class PaymentModule : CarterModule
    {
        public PaymentModule(PaymentStore store)
        {
            Get("/payment/{id}", async (req, res) =>
            {
                var payment = store.GetPayment(req.RouteValues.As<string>("id"));

                if (payment == null) res.StatusCode = (int)HttpStatusCode.NotFound;

                await res.Negotiate(payment);
            });

            Post("/payment/create-payment", async (req, res) =>
            {
                var result = await req.Bind<NewPayment>();

                if (result == null || result.Amount == null)
                {
                    res.StatusCode = (int)HttpStatusCode.BadRequest;
                    await res.Negotiate("Data not valid");
                    return;
                }

                var payment = store.CreatePayment(result.Amount.Value);
                res.StatusCode = (int)HttpStatusCode.Created;
                await res.Negotiate(payment);
            });

            Post("/payment/private/update-payment-state", async (req, res) =>
            {
                // NOTE: Do not use this endpoint in your own implementations
                // Only allowed to use from payment-site (should have CORS)
                // Api Key implementation is here to help in testing / developement

                if (!req.Headers.TryGetValue("X-Api-Key", out var value) || value.ToString() != "secret-key")
                {
                    res.StatusCode = (int)HttpStatusCode.Unauthorized;
                    return;
                }

                var result = await req.Bind<NewPaymentState>();

                if (result == null || result.Id == null)
                {
                    res.StatusCode = (int)HttpStatusCode.BadRequest;
                    await res.Negotiate("Update data not valid");
                    return;
                }

                var payment = store.GetPayment(result.Id);

                if (payment == null)
                {
                    res.StatusCode = (int)HttpStatusCode.NotFound;
                    await res.Negotiate("Payment not found");
                    return;
                }

                if (payment.State == result.State)
                {
                    res.StatusCode = (int)HttpStatusCode.BadRequest;
                    await res.Negotiate("Update state not valid");
                    return;
                }

                payment.State = result.State;
                payment.UpdateTime = DateTimeOffset.UtcNow;
                store.UpdatePayment(payment);

                res.StatusCode = (int)HttpStatusCode.NoContent;
                await res.Negotiate(null);
            });
        }
    }
}