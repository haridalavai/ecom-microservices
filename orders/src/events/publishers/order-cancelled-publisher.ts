import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
  OrderStatus,
} from "@ticketing-test/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
