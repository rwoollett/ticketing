import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from '@rwtix/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/orders';
import { queueGroupName } from './queueGroupName';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1      
    });

    if (order) {

      order.set({status: OrderStatus.Cancelled });
      await order.save();
      msg.ack();

    } else {
       throw new Error('Order not found');
    }

  };
};