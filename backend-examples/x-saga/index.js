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
    ctx.body = await getInventory();
  })
  .post('/create-order', async (ctx, next) => {
    console.log(`Create order`);
    

    // Create payment to PaymentProvider
    const cretePaymentResult = await paymentService(order);
    order.paymentId = cretePaymentResult.id;

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

const getInventory = async () => {
    const response = await axios.get(INVENTORY_URL);
    return response.data;
  };