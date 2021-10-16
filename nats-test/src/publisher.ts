import nats from "node-nats-streaming";
import { TickedCreatedPublisher } from "./events/ticket-created-publisher";
console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("publisher connected to nats");

  const publisher = new TickedCreatedPublisher(stan);
  await publisher.publish({
    id: "abc",
    title: "title",
    price: 123,
    userId: "hari",
  });
});
