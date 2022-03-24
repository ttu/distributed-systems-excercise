import axios from 'axios';

const INVENTORY_URL = 'http://localhost:9040/inventory';
const PAYMENT_BASE_URL = 'http://localhost:9080';
const PAYMENT_URL = `${PAYMENT_BASE_URL}/payment`;
const DELIVERY_URL = 'http://localhost:9090/delivery';

const USE_DOCKER = true;
const CALLBACK_URL = USE_DOCKER ? 'http://host.docker.internal:5590' : 'http://localhost:5590';

const ORDER_DB = [];

const addOrder = (order) => ORDER_DB.push(order);

const getOrderWithPaymentId = (paymentId) => {
  const orders = ORDER_DB.filter((o) => o.paymentId === paymentId);
  return orders.length > 0 ? orders[0] : undefined;
};

const getFromInventory = async (id) => {
  const response = await axios.get(`${INVENTORY_URL}/${id}`);
  return response.data;
};

const reserveFromInventory = async (id, amount) => {
  const payload = { id, changeAmount: amount * -1 };
  try {
    const response = await axios.post(`${INVENTORY_URL}/inventory-change`, payload);
    return response.status === 204;
  } catch {
    return false;
  }
};

const createPayment = async (order) => {
  const payload = { amount: order.amount };
  const response = await axios.post(`${PAYMENT_URL}/create-payment`, payload);
  return response.data;
};

const getPayment = async (paymentId) => {
  const payment = await axios.get(`${PAYMENT_URL}/${paymentId}`);
  return payment.data;
};

const sendDeliveryRequest = async (paymentId) => {
  const payload = {
    senderNotificationUrl: `${CALLBACK_URL}/delivery-notify`,
    address: 'test',
    sms: 'tt',
    referenceId: paymentId,
  };
  const deliveryRequest = await axios.post(DELIVERY_URL, payload);
  return deliveryRequest.data;
};

export default {
  addOrder,
  getOrderWithPaymentId,
  getFromInventory,
  reserveFromInventory,
  createPayment,
  getPayment,
  sendDeliveryRequest,
  PAYMENT_BASE_URL,
};
