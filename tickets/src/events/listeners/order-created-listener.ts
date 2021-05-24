import { Listener, OrderCreatedEvent, Subjects } from '@rwtix/common'
import { queueGroupName} from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher} from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      console.error('Ticket not found');
    } else {
      // Mark the ticket by seting the orderId
      ticket.set({ orderId: data.id });

      // Save ticket
      await ticket.save();
      await new TicketUpdatedPublisher(this.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        orderId: ticket.orderId,
        version: ticket.version
      });

      // ack the message
      msg.ack();
    }
  }

};