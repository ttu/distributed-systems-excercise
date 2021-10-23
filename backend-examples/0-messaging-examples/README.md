# Basic Tutorial for Messaging

NOTE: We use term messages instead of events

This is a good guide. Read this: https://www.rabbitmq.com/getstarted.html

## Messaging

1. Producer sends messages
2. Consumer receives and processes messages

![image](https://www.rabbitmq.com/img/tutorials/python-one.png)

```sh
# start consumer
node index.js c hello_consumer hello_queue
# start publisher
node index.js p hello_publisher hello_queue
```

## Worker Queue / Distributed tasks

![image](https://www.rabbitmq.com/img/tutorials/python-two.png)

We can add more consumers to have more processing power

1. Producer sends messages
2. Message bus distributes messages evenly to Consumers (usually distributed with round robin)

```sh
# start consumer multiple consumers
node index.js c hello_consumer_first hello_queue
node index.js c hello_consumer_second hello_queue
# start publisher
node index.js p hello_publisher hello_queue
```

## Publish Subscribe / Event driven

![image](https://www.rabbitmq.com/img/tutorials/python-three.png)

1. Producer sends message (event)
2. Instead of going to predifined queue it is sent to an exchange
3. Messge bus routers events from topic to queues that are attached to it
4. Consumers will receive every message

```sh
# start consumer multiple consumers
node index_exchange.js c hello_consumer_first hello_exchange
node index_exchange.js c hello_consumer_second hello_exchange
# start publisher
node index_exchange.js p hello_publisher hello_exchange
```

## Request Reply Pattern

Remote Procedure Call / Replies to sender

We need to have own queue for replies. Producer is also Consumer and Consumer is a Producer...

1. 


## Code examples

### Star RabbitMQ server with Management UI

```
$ docker run -d --name example-rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

Port `5672` is for rabbitmq client communication

Port `15672` is for Management UI


Go to http://localhost:15672/ to open Management UI (
```
username: guest
password: guest
```

### Execute e

### Write some code

[AMQP 0-9-1 library and client for Node.JS](https://github.com/squaremo/amqp.node)

`example_github_async.js` and `example_github_promise.js` are async versions of https://github.com/squaremo/amqp.node#promise-api-example

