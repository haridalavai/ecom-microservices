import { Listener, OrderCreatedEvent, Subjects } from "@ticketing-test/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    //   Find the ticket the order is reserving

    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket, throw error

    if (!ticket) {
      throw new Error("ticket not found");
    }

    // Mark the ticker as being reserved by setting iits orderId property

    ticket.set({ orderId: data.id });
    // Save the ticket
    await ticket.save();

    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    msg.ack();
  }
}
