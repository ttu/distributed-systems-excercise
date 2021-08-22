import axios from 'axios';

const INVENTORY_URL = 'http://localhost:9040/inventory';
const PAYMENT_URL = 'http://localhost:9080/payment';
const DELIVERY_URL = 'http://localhost:9090/delivery';

const getFromInventory = async (id) => {
  const response = await axios.get(`${INVENTORY_URL}/${id}`);
  return response.data;
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
  getFromInventory,
  createPayment,
  isPaymentPaid,
  sendDeliveryRequest,
};