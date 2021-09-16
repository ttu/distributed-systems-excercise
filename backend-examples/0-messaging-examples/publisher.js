import amq from 'amqplib';

const URL = 'amqp://localhost';
const openConnection = amq.connect(URL);

let channel;
let queue_name;

export const createPublisher = async (queue_name = 'default_tasks') => {
  queue_name = queue_name;
  return openConnection
    .then(async (conn) => {
      channel = await conn.createChannel();
      await channel.assertQueue(queue_name);
      return true;
    })
    .catch((err) => false);
};

export const sendMessage = (msg) => {
  if (!channel) return false;
  console.log('Sending', { msg });
  return channel.sendToQueue(queue_name, Buffer.from(msg));
};
