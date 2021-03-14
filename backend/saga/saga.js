
const orders = [];

const start = async (payload) => {
    const order = { id: 'aaa', amount: payload.amount };
    orders.push(order);

    const response = await paymentService(order);

}
  
 
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
  