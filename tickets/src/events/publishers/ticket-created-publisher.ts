import {
  Subjects,
  TicketCreatedEvent,
  Publisher,
} from "@ticketing-test/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
