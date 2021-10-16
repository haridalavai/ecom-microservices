import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@ticketing-test/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
