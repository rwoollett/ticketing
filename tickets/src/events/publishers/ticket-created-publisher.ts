import { Publisher, Subjects, TicketCreatedEvent } from '@rwtix/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;

}