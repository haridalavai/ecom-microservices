import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { body } from "express-validator";
import {
  requireAuth,
  requestValidator,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from "@ticketing-test/common";
import { Ticket } from "../models/tickets";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided"),
  ],
  requestValidator,

  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to purchase

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }
    // Make sure the ticket is not reserved

    const isReserved = await ticket.isReserved();
    console.log(isReserved);

    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    // Calculate an expiration date for the order

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order ans save it to the database

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();

    // Publish an event saying an order was created

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
