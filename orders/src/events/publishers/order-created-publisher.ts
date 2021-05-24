import { Publisher, OrderCreatedEvent, Subjects} from '@rwtix/common';;

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
