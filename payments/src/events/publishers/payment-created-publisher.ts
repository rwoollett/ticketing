import { Publisher, Subjects, PaymentCreatedEvent } from '@rwtix/common';

export class PaymentCreatedPublisher extends
 Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;

}