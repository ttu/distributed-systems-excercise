export const createPayment = async (order) => {
  const payload = { amount: order.amount };
  const response = await axios.post(PAYMENT_URL + '/create-payment', payload);
  return response.data;
};
