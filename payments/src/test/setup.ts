import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { app } from "../app";

declare global {
  var signin: (id?: string) => string[];
}
let mongo: any;

jest.mock("../nats-wrapper");

process.env.STRIPE_KEY =
  "sk_test_51Jk8DoSBgTW9fgXIOJ3GLwDTaBR8jO0nfKmJrpWFvsZp9fwD03G2RA0GZyYvMIAsLf9paPbal7N6xfeIzLlfiPI1008qHx94c9";
beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

globalThis.signin = (id?: string) => {
  // Build a JWT payload.  { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`];
};
