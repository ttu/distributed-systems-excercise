import data from './data_access.js';

const LOCAL_URL = `http://localhost:5590`;

const getFromInventory = async (id) => {
  const itemResponse = await data.getFromInventory(id);
  return itemResponse;
};

const createOrder = async (itemId, count) => {
  const item = await data.getFromInventory(itemId);
  if (item.quantity < count) return { err: 422, value: 'Not enough items in inventory' };

  const reserve = await data.reserveFromInventory(itemId, count);
  if (!reserve) return { err: 400, value: 'Not enough items in inventory' };

  const order = { itemId: itemId, count: count, amount: item.price * count };
  data.addOrder(order);

  // Create payment to PaymentProvider
  const cretePaymentResult = await data.createPayment(order);
  order.paymentId = cretePaymentResult.id;
  console.log(`Payment created`, { paymentId: cretePaymentResult.id });

  const callbackUrl = `${LOCAL_URL}/handle-payment-callback/${order.paymentId}`;

  return {
    ok: true,
    value: {
      paymentId: order.paymentId,
      paymentUrl: `${data.PAYMENT_BASE_URL}/?callbackUrl=${callbackUrl}&paymentId=${order.paymentId}`,
    },
  };
};

const handlePaidOrder = async (paymentId) => {
  console.log(`Handling payment`, { paymentId });

  const order = data.getOrderWithPaymentId(paymentId);
  if (!order) return { err: 404, value: 'No order for payment' };

  // Validate payment state is 1 from PaymentProvider
  const payment = await data.getPayment(paymentId);
  if (!payment) return { err: 404, value: 'Payment not found' };

  const isPaid = isPaymentPaid(payment);
  if (!isPaid) return { err: 422, value: 'Order is not paid' };

  // Send delivery request to DeliveryCompany
  const deliveryRequest = await data.sendDeliveryRequest(paymentId);
  console.log(`Delivery request sent`, { deliveryId: deliveryRequest.id });

  // Return Delivery id to customer
  return { ok: true, value: deliveryRequest };
};

const isPaymentPaid = (payment) => payment.state === 1;

export default {
  createOrder,
  handlePaidOrder,
  getFromInventory,
};
