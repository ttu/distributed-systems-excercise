import amq from 'amqplib';

const URL = 'amqp://localhost';
const openConnection = amq.connect(URL);

let channel;
let queue;

export const createPublisher = async (queue_name = 'default_tasks') => {
  queue = queue_name;
  return openConnection
    .then(async (conn) => {
      channel = await conn.createChannel();
      await channel.assertQueue(queue);
      return true;
    })
    .catch((err) => false);
};

export const sendMessage = (msg) => {
  if (!channel) return false;
  console.log('Sending', { msg });
  return channel.sendToQueue(queue, Buffer.from(msg));
};
