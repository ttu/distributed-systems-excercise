import axios from 'axios';

const INVENTORY_URL = 'http://localhost:9040/inventory';
const PAYMENT_URL = 'http://localhost:9080/payment';
const DELIVERY_URL = 'http://localhost:9090/delivery';

const orders = [];

const getFromInventory = async (id) => {
  const response = await axios.get(`${INVENTORY_URL}/${id}`);
  console.log('respoonse from inv', resposen.data);
  return response.data;
};

const createOrder = async (itemId, count) => {
  const item = await getFromInventory(itemId);

  if (item.quantity < count) return { err: 400, value: 'Not enough items in inventory' };

  const order = { itemId: itemId, count: count, amount: item.price * count };
  orders.push(order);

  // Create payment to PaymentProvider
  const cretePaymentResult = await createPayment(order);
  order.paymentId = cretePaymentResult.id;
  console.log(`Payment created`, { paymentId: cretePaymentResult.id });

  const callbackUrl = `http://localhost:5590/handle-payment-callback/${order.paymentId}`;

  return {
    ok: true,
    value: {
      paymentId: order.paymentId,
      paymentUrl: `http://localhost:9080/?callbackUrl=${callbackUrl}&paymentId=${order.paymentId}`,
    },
  };
};


const createDeliveryRequest = async (paymentId) => {
  console.log(`Handling payment`, { paymentId });

  const stored = orders.filter((o) => o.paymentId === paymentId);
  if (!stored) return { err: 404, value: 'No order for payment' };

  // Validate payment state is 1 from PaymentProvider
  const isPaid = await isPaymentPaid(paymentId);
  if (!isPaid) return { err: 400, value: 'Order is not paid' };

  // Send delivery request to DeliveryCompany
  const deliveryRequest = await sendDeliveryRequest(paymentId);
  console.log(`Delivery request sent`, { deliveryId: deliveryRequest.id });

  // Return Delivery id to customer
  return { ok: true, value: deliveryRequest };
};

const createPayment = async (order) => {
  const payload = { amount: order.amount };
  const response = await axios.post(`${PAYMENT_URL}/create-payment`, payload);
  return response.data;
};

const isPaymentPaid = async (paymentId) => {
  const payment = await axios.get(`${PAYMENT_URL}/${paymentId}`);
  return payment.data.state === 1;
};

const sendDeliveryRequest = async (paymentId) => {
  const payload = {
    senderNotificationUrl: `http://host.docker.internal:5590/delivery-notify`,
    //senderNotificationUrl: `http://localhost:5590/delivery-notify`,
    address: 'test',
    sms: 'tt',
    referenceId: paymentId,
  };
  const deliveryRequest = await axios.post(DELIVERY_URL, payload);
  return deliveryRequest.data;
};

export default {
  createOrder,
  createDeliveryRequest,
  getFromInventory,
};
