import services from './services.js';


export const addEcomRoutes = (router) => {
  router
    // TODO: How to define optional parameters in Koa?
    .get('/item', async (ctx, next) => {
      // Get items from InventoryService
      const items = await services.getFromInventory('');
      ctx.body = items;
    })
    .get('/item/:id', async (ctx, next) => {
      // Get item from InventoryService
      const item = await services.getFromInventory(ctx.params.id);
      ctx.body = item;
    })
    .post('/create-order', async (ctx, next) => {
      const itemId = ctx.request.body.itemId;
      const count = ctx.request.body.count;

      const order = await services.createOrder(itemId, count);

      if (order.err) ctx.throw(order.err, order.value);

      // Return Created to frontend with id
      ctx.status = 201;
      ctx.body = order.value;
    })
    .get('/handle-payment-callback/:id', async (ctx, next) => {
      const paymentId = ctx.params.id;

      const deliveryRequest = await services.createDeliveryRequest(paymentId);
      
      if (deliveryRequest.err) ctx.throw(deliveryRequest.err, deliveryRequest.value);

      ctx.status = 201;
      ctx.body = { deliveryRequest: deliveryRequest.value };

      // TODO: Packaging will process new orders in 10-30sec
      // TODO: Capture order from psp
    })
    // DeliveryCompany will notify Backend on pickup to url defined in senderNotificationUrl. (POST)
    // DeliveryComapny will notify SMS Client after X seconds.
    .post('/delivery-notify', (ctx, next) => {
      // Backend endpoint must return Seccess code to Delivery Company
      // TODO: Configure body middleware. Now properties might be in upper or lower case
      const deliveryId = ctx.request.body.Id;
      const paymentId = ctx.request.body.ReferenceId;
      console.log(`Delivery will be picked up soon`, { deliveryId, paymentId });
      ctx.status = 204;
    });
};
