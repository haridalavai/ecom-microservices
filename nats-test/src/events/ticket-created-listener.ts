import { Message } from "node-nats-streaming";
import { Listener } from "@ticketing-test/common";
import { Subjects } from "@ticketing-test/common";
import { TicketCreatedEvent } from "@ticketing-test/common";

export class TicketListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = "payment-service";
  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log("Event data!", data);
    console.log(data.id);

    msg.ack();
  }
}
