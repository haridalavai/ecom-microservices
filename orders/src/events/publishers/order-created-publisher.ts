import { Publisher, OrderCreatedEvent, Subjects } from "@ticketing-test/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
