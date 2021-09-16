# Basic Tutorial for Messaging

NOTE: We use term messages instead of events

This is a good guide. Read this: https://www.rabbitmq.com/getstarted.html

## Messaging

1. Producer sends messages
2. Consumer receives and processes messages

TODO: Image

## Worker Queue / Distributed tasks

We can add more consumers to have more processing power

TODO: Image
1. Producer sends messages
2. Consumers receive messages (usually distributed with round robin)

## Publish Subscribe / Event driven

1. Producer sends message (evnt)
2. Instead of going to predifined queue it is sent to exchange
3. Messge bus routers events from topic to queues that are attached to it
4. Consumers will receive every message

## Request Reply Pattern

Remote Procedure Call / Replies to sender

We need to have own queue for replies. Producer is also Consumer and Consumer is a Producer...

1. 


## Code examples

Star RabbitMQ server with Management UI

```
$ docker run -d --name example-rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

Port 5672 is for rabbitmq client communication

Port 15672 is for Management UI


Open xxx to check management (guest/guest):

http://localhost:15672/


### Write some code

https://github.com/squaremo/amqp.node

`example_github.js` is async version of https://github.com/squaremo/amqp.node#promise-api-example

