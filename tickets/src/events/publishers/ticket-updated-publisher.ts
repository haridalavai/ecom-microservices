import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@ticketing-test/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
