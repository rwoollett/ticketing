import { Publisher, Subjects, TicketUpdatedEvent } from '@rwtix/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;

}