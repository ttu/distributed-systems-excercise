import services from './services.js';

const orders = [];

export const addEcomRoutes = (router) => {
  router
    // TODO: How to define optional parameters in Koa?
    .get('/item', async (ctx, next) => {
      // Get items from InventoryService
      ctx.body = await services.getFromInventory('');
    })
    .get('/item/:id', async (ctx, next) => {
      // Get item from InventoryService
      ctx.body = await services.getFromInventory(ctx.params.id);
    })
    .post('/create-order', async (ctx, next) => {
      const itemId = ctx.request.body.itemId;
      const count = ctx.request.body.count;

      const item = await services.getFromInventory(itemId);

      if (item.quantity < count) ctx.throw(400, 'Not enough items in inventory');

      const order = { itemId: itemId, count: count, amount: item.price * count };
      orders.push(order);

      // Create payment to PaymentProvider
      const cretePaymentResult = await services.createPayment(order);
      order.paymentId = cretePaymentResult.id;
      console.log(`Payment created`, { paymentId: cretePaymentResult.id });

      const callbackUrl = `http://localhost:5590/handle-payment-callback/${order.paymentId}`;

      // Return Created to frontend with id
      ctx.status = 201;
      ctx.body = {
        paymentId: order.paymentId,
        paymentUrl: `http://localhost:9080/?callbackUrl=${callbackUrl}&paymentId=${order.paymentId}`,
      };
    })
    .get('/handle-payment-callback/:id', async (ctx, next) => {
      const paymentId = ctx.params.id;

      console.log(`Handling payment`, { paymentId });

      const stored = orders.filter((o) => o.paymentId === paymentId);
      if (!stored) ctx.throw(404);

      // Validate payment state is 1 from PaymentProvider
      const isPaid = await services.isPaymentPaid(paymentId);
      if (!isPaid) ctx.throw(400, 'Order is not paid');

      // Send delivery request to DeliveryCompany
      const deliveryRequest = await services.sendDeliveryRequest(paymentId);
      console.log(`Delivery request sent`, { deliveryId: deliveryRequest.id });

      // Return Delivery id to customer
      ctx.body = { deliveryRequest };

      // TODO: Packaging will process new orders in 10-30sec
      // TODO: Capture order from psp
    })
    // DeliveryCompany will notify Backend on pickup to url defined in senderNotificationUrl. (POST)
    // DeliveryComapny will notify SMS Client after X seconds.
    .post('/delivery-notify', (ctx, next) => {
      // Backend endpoint must return Seccess code to Delivery Company
      // TODO: Configure body middleware. Now properties might be in upper or lower case
      const paymentId = ctx.request.body.ReferenceId;
      console.log(`Delivery will be picked up soon`, { paymentId });
      ctx.status = 204;
    });
};
