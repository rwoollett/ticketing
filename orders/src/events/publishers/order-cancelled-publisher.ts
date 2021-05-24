import { Publisher, OrderCancelledEvent, Subjects} from '@rwtix/common';;

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
