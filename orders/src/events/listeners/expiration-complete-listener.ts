import { Message } from 'node-nats-streaming';
import { OrderStatus, Subjects, Listener, ExpirationCompleteEvent} from '@rwtix/common';
import { queueGroupName} from './queue-group-name';
import { Order } from '../../models/orders';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends
 Listener<ExpirationCompleteEvent> {
   queueGroupName = queueGroupName;
   readonly subject = Subjects.ExpirationComplete;

   async onMessage(
     data: ExpirationCompleteEvent['data'], 
     msg: Message
  ) {
    const order = await Order.findById(data.orderId).populate('ticket');
  
    if (order) {
      console.log("Expired..");

      if (order.status === OrderStatus.Complete) {
        console.log("Is paid and completed");
        return msg.ack();
      }
      console.log("Doing Expired..");
      
      order.set({
        status: OrderStatus.Cancelled
      })
      await order.save();

      await new OrderCancelledPublisher(this.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
          id: order.ticket.id
        }
      });
      
      msg.ack();
    }
    // } else {
    //   throw new Error('Order not found');
    // }
   };

}