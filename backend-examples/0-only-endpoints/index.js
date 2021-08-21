/*
 * This could be a start for backend and contain only the example endoints
*/

import Koa from 'koa';
import Router from 'koa-router';
import BodyParser from 'koa-bodyparser';

import axios from 'axios';

const port = 5590;
const app = new Koa();
const router = new Router();

// This is a example solution

const orders = {
  1: {
    name: 'Test',
  },
};

const getOrder = async (id) => {
  await delay(1000);
  return orders[id];
};

const updateOrder = async (id, order) => {
  await delay(1000);
  return (orders[id] = order);
};

const delay = async (delayInMs) => {
  const p = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, delayInMs);
  });
  return p;
};

router
  .get('/item/:id', async (ctx, next) => {
    // Get items from InventoryService
    const id = ctx.params.id;
    const current = await getOrder(id);
    ctx.body = { order: current };
  })
  .post('/create-order', async (ctx, next) => {
    console.log(`Create order`);

    const id = ctx.body.id;
    const current = getOrder(id);

    // Create payment to PaymentProvider
    const cretePaymentResult = await paymentService(order);
    order.paymentId = cretePaymentResult.id;

    // Return Created to frontend with id
    ctx.body = { order: current };
  })
  .post('/handle-payment', async (ctx, next) => {
    const paymentId = '1234';

    console.log(`Handling payment`, { paymentId });

    const stored = orders.filter((o) => o.paymentId === paymentId);
    if (!stored) ctx.throw(404);

    // Validate payment state is 1 from PaymentProvider
    const isPaid = await isPaymentPaid(paymentId);
    if (!isPaid) ctx.throw(400, 'Order is not paid');

    // Send delivery request to DeliveryCompany
    const deliveryRequest = sendDeliveryRequest(payload);
    // Return Delivery id to customer
    ctx.body = { deliveryId: deliveryRequest.id };

    // Packaging will process new orders in 10-30sec
  })
  // DeliveryCompany will notify Backend on pickup to url defined in senderNotificationUrl. (POST)
  // DeliveryComapny will notify SMS Client after X seconds.
  .post('/delivery-notify', (ctx, next) => {
    // Backend endpoint must return Ok to Delivery Company
    const deliveryId = ctx.body.referenceId;
    console.log(`Delivery will be picked up soon`, { deliveryId });
    ctx.status = 200;
  });

app.use(BodyParser());
app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => console.log(`Server running on port ${port}`));

const getInventory = async () => {
  const response = await axios.get(INVENTORY_URL);
  return response.data;
};
