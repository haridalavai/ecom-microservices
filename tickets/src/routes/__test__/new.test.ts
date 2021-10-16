import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";

import { natsWrapper } from "../../nats-wrapper";

it("has a router listening to /api/tickets for post request", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).toEqual(401);
});

it("does not return 401 when user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 123,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      price: 123,
    })
    .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "asad",
      price: -10,
    })
    .expect(400);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "asad",
    })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  const title = "title";
  let documentNo = await Ticket.find({});
  expect(documentNo.length).toEqual(0);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  documentNo = await Ticket.find({});
  expect(documentNo.length).toEqual(1);
  expect(documentNo[0].price).toEqual(20);
  expect(documentNo[0].title).toEqual(title);
});

it("publishes event when ticket is created", async () => {
  const title = "title";
  let documentNo = await Ticket.find({});
  expect(documentNo.length).toEqual(0);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  documentNo = await Ticket.find({});
  expect(documentNo.length).toEqual(1);
  expect(documentNo[0].price).toEqual(20);
  expect(documentNo[0].title).toEqual(title);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
