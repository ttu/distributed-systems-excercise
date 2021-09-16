import amq from 'amqplib';

var QUEUE_NAME = 'tasks';

var open = amq.connect('amqp://localhost');

// Publisher
open
  .then((conn) => conn.createChannel())
  .then((ch) => [ch, ch.assertQueue(QUEUE_NAME)])
  .then(([ch, queueInfo]) => ch.sendToQueue(QUEUE_NAME, Buffer.from('something to do')))
  .catch(console.warn);

// Consumer
open
  .then((conn) => conn.createChannel())
  .then((ch) => [ch, ch.assertQueue(QUEUE_NAME)])
  .then(([ch, ok]) =>
    ch.consume(QUEUE_NAME, (msg) => {
      if (msg !== null) {
        console.log(msg.content.toString());
        ch.ack(msg);
      }
    }),
  )
  .catch(console.warn);
