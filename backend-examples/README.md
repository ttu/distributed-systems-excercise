# Backend examples

## Synchronous

```sh
npm i
npm start
curl http://localhost:5590/item
```

#### Sequence

![Sync sequence diagram](sync-sequence.png)

#### Processes of payment creation

![Sync processes diagram](sync-processes.png)

## Event Driven

__TODO__ 

### Definition

Event driven is a programming paradigm in which the flow of the program is determined by events.

__Event driven vs message driven__

Few different definitions, depending on the origin:

__Application level__: Event is inside application, message inter system.

__System level__: In message driven item is sent to a fixed recipient, in event driven sent item is shared with any consumer.

__Choreography vs Orchestration__

The choreography describes the interactions between multiple services, 
where as orchestration represents control from one party's perspective. 

This means that a choreography differs from an orchestration with respect 
to where the logic that controls the interactions between the services involved should reside.


### Choreography of payment creation

![Choreography diagram](event-choreography.png)

### Orchestration / Saga of payment creation

![Orchestration diagram](event-orchestration.png)