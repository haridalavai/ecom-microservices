import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from "@ticketing-test/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
