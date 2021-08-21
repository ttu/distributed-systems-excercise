import Koa from 'koa';
import Router from 'koa-router';
import axios from 'axios';

// This is a simple solution

const port = 5590;
const app = new Koa();
const router = new Router();

const orders = [];

router
  .get('/item', async (ctx, next) => {
    // Get items from InventoryService
    ctx.body = await getInventory();
  })
  .post('/create-order', async (ctx, next) => {
    console.log(`Create order`);
    const order = { amount: 1234 };
    orders.push(order);

    // Create payment to PaymentProvider
    const cretePaymentResult = await createPayment(order);
    order.paymentId = cretePaymentResult.id;
    console.log(`Payment cerated`, { paymentId: cretePaymentResult.id });

    // Return Created to frontend with id
    ctx.body = { paymentId: order.paymentId };
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
    console.log(`Delivery request sent`, { deliveryId: deliveryRequest.id });

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

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => console.log(`Server running on port ${port}`));

const INVENTORY_URL = 'http://localhost:9040/inventory';
const PAYMENT_URL = 'http://localhost:9080/payment';
const DELIVERY_URL = 'http://localhost:9090/delivery';

const getInventory = async () => {
  const response = await axios.get(INVENTORY_URL);
  return response.data;
};

const createPayment = async (order) => {
  const payload = { amount: order.amount };
  const response = await axios.post(PAYMENT_URL + '/create-payment', payload);
  return response.data;
};

const isPaymentPaid = async (paymentId) => {
  const payment = await axios.get(PAYMENT_URL + `/${paymentId}`);
  return payment.data.state !== 1;
};

const sendDeliveryRequest = async (paymentId) => {
  const payload = {
    senderNotificationUrl: 'http://host.docker.internal:80/delivery-notify/' + paymentId,
    address: 'test',
    sms: 'tt',
    referenceId: paymentId,
  };
  const deliveryRequest = await axios.post(DELIVERY_URL, payload);
  return deliveryRequest.data;
};
