import Koa from 'koa';
import Router from 'koa-router';
import axios from 'axios';

const port = 5590;
const app = new Koa();
const router = new Router();

const INVENTORY_URL = 'http://localhost:9040/inventory';
const PAYMENT_URL = 'http://localhost:9080/payment';
const DELIVERY_URL = 'http://localhost:9090/delivery';

// This is a simple solution

const orders = [];

router
  .get('/item', async (ctx, next) => {
    // Get items from InventoryService
    const response = await axios.get(INVENTORY_URL);
    ctx.body = response.data;
  })
  .post('/create-order', async (ctx, next) => {
    const order = { amount: 1234 };

    console.log(`Create order`);
    orders.push(order);

    // Create payment to PaymentProvider
    const payload = { amount: order.amount };
    const response = await axios.post(PAYMENT_URL + '/create-payment', payload);
    // Return Created to frontend with id
    order.paymentId = response.data.id;
    ctx.body = { paymentId: order.paymentId };
  })
  .post('/handle-payment', async (ctx, next) => {
    const paymentId = '1234';

    console.log(`Handling payment`, { paymentId });

    const stored = orders.filter((o) => o.paymentId === paymentId);

    if (stored) {
      ctx.status = 404;
      return;
    }

    // Validate payment state is 1 from PaymentProvider
    const payment = await axios.get(PAYMENT_URL + `/${paymentId}`);
    if (payment.data.state !== 1) {
      ctx.status = 400;
      return;
    }

    // Send delivery request to DeliveryCompany
    const payload = {
      senderNotificationUrl: 'http://host.docker.internal:80/delivery-notify/' + paymentId,
      address: 'test',
      sms: 'tt',
      referenceId: paymentId,
    };
    const deliveryRequest = await axios.post(DELIVERY_URL, payload);
    // Return Delivery id to customer
    ctx.body = { deliveryId: deliveryRequest.data.id };

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

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => console.log(`Server running on port ${port}`));
