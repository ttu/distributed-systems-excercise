import API from './api.js';

const ORDER_DB = [];

const getFromInventory = async (id) => {
  const response = await API.getFromInventory(id);
  console.log('respoonse from inv', resposen.data);
  return response.data;
};

const createOrder = async (itemId, count) => {
  const item = await API.getFromInventory(itemId);

  if (item.quantity < count) return { err: 400, value: 'Not enough items in inventory' };

  const order = { itemId: itemId, count: count, amount: item.price * count };
  ORDER_DB.push(order);

  // Create payment to PaymentProvider
  const cretePaymentResult = await API.createPayment(order);
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

  const stored = ORDER_DB.filter((o) => o.paymentId === paymentId);
  if (!stored) return { err: 404, value: 'No order for payment' };

  // Validate payment state is 1 from PaymentProvider
  const payment = await API.getPayment(paymentId);
  if (!payment) return { err: 404, value: 'Payment not found' };

  const isPaid = isPaymentPaid(payment);
  if (!isPaid) return { err: 400, value: 'Order is not paid' };

  // Send delivery request to DeliveryCompany
  const deliveryRequest = await API.sendDeliveryRequest(paymentId);
  console.log(`Delivery request sent`, { deliveryId: deliveryRequest.id });

  // Return Delivery id to customer
  return { ok: true, value: deliveryRequest };
};

const isPaymentPaid = (payment) => payment.state === 1;

export default {
  createOrder,
  createDeliveryRequest,
  getFromInventory,
};
