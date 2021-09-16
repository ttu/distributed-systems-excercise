import amq from 'amqplib';

const QUEUE_NAME = 'tasks';

const open = amq.connect('amqp://localhost');

// Publisher
open
  .then(async (conn) => {
    const ch = await conn.createChannel();
    await ch.assertQueue(QUEUE_NAME);
    return ch.sendToQueue(QUEUE_NAME, Buffer.from('something to do'));
  })
  .catch(console.warn);

// Consumer
open
  .then(async (conn) => {
    const ch = await conn.createChannel();
    await ch.assertQueue(QUEUE_NAME);
    return ch.consume(QUEUE_NAME, (msg) => {
      if (msg === undefined) return;
      console.log('Received:', msg.content.toString());
      ch.ack(msg);
    });
  })
  .catch(console.warn);
