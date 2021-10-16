import { Stan } from "node-nats-streaming";
import { TicketCreatedEvent } from "@ticketing-test/common";
import { Publisher } from "@ticketing-test/common";
import { Subjects } from "@ticketing-test/common";

export class TickedCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
