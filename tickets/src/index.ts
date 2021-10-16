import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledEvent, OrderStatus } from "@ticketing-test/common";

import { app } from "./app";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.CLUSTER_ID) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.CLIENT_ID) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("MONGO_URI must be defined");
  }
  try {
    await natsWrapper.connect(
      process.env.CLUSTER_ID,
      process.env.CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);

    console.log("connected to mongodb");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!!!!!!!!");
  });
};

start();
