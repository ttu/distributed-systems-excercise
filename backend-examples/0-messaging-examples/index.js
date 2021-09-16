import { createPublisher, sendMessage } from './publisher.js';
import { createConsumer } from './consumer.js';

const myArgs = process.argv.slice(2);
const type = myArgs[0] ?? 'p';
const id = myArgs[1] ?? 'A';
const queue_name = myArgs[2];

// node index.js type queue_name
const main = async () => {
  if (type === 'c') {
    await createConsumer(id, queue_name);
    return;
  }

  await createPublisher(queue_name);
  sendMessage('1');
  sendMessage('2');
  sendMessage('3');
  sendMessage('4');
};

main();
