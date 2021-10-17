import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  console.log("exp change");

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
  } catch (err) {
    console.error(err);
  }
};

start();
