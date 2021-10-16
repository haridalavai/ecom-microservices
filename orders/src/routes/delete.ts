import {
  NotAuthorisedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@ticketing-test/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";
import { natsWrapper } from "../nats-wrapper";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const orderId = req.params.orderId;

    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId != req.currentUser!.id) {
      throw new NotAuthorisedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();
    res.status(204).send(order);

    // Publish an event

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
  }
);

export { router as deleteOrderRouter };
