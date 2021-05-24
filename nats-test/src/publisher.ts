import nats from 'node-nats-streaming';
import { TicketCreatedPublisher} from './events/ticket-created-publisher';

// kubectl port-forward nats-depl-78df5f74c-rdcwq 4222:4222

console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20
    });

  } catch (err) {
    console.log(err);
  }

});