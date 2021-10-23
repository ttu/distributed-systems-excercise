import amq from 'amqplib';

const URL = 'amqp://localhost';
const openConnection = amq.connect(URL);

let channel;
let exchange;

export const createPublisher = async (exchange_name = 'default_tasks') => {
  exchange = exchange_name;
  return openConnection
    .then(async (conn) => {
      channel = await conn.createChannel();
      await channel.assertExchange(exchange_name, 'fanout', { durable: false });
      return true;
    })
    .catch((err) => false);
};

export const sendMessage = (msg) => {
  if (!channel) return false;
  console.log('Sending', { msg });
  return channel.publish(exchange, '', Buffer.from(msg));
};
