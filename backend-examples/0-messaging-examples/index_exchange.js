import { createPublisher, sendMessage } from './publisher_exchange.js';
import { createConsumer } from './consumer_exchange.js';

const myArgs = process.argv.slice(2);
const type = myArgs[0] ?? 'p';
const id = myArgs[1] ?? 'A';
const exchange_name = myArgs[2] ?? 'default_tasks';

// node index.js type queue_name
const main = async () => {
  if (type === 'c') {
    await createConsumer(id, exchange_name);
    return;
  }

  await createPublisher(exchange_name);
  sendMessage('1');
  sendMessage('2');
  sendMessage('3');
  sendMessage('4');
};

main();
