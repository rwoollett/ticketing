import { Message } from 'node-nats-streaming';
import { Subjects, Listener, PaymentCreatedEvent, OrderStatus} from '@rwtix/common';
import { Order } from '../../models/orders';
import { queueGroupName} from './queue-group-name';

export class PaymentCreatedListener 
extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (order) {
      order.set({
        status: OrderStatus.Complete
      });
      await order.save();
      // Order Updated for other depending services is recommended.
      // Currently order complete is not used in the context of this app.
  
      msg.ack();
  
    } else {
      throw new Error('Order not found');

    }
  };
}