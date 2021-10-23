import amq from 'amqplib';

const URL = 'amqp://localhost';

const openConnection = amq.connect(URL);

let consumerId;
let channel;

export const createConsumer = async (id, queue_name = 'default_tasks') => {
  consumerId = id;

  return openConnection
    .then(async (conn) => {
      channel = await conn.createChannel();
      const queueInfo = await channel.assertQueue(queue_name);
      return channel.consume(queueInfo.queue, handleMessage);
    })
    .catch((err) => false);
};

const handleMessage = (msg) => {
  if (msg === null) return;
  console.log(`${consumerId} received`, { msg: msg.content.toString() });
  channel.ack(msg);
};
