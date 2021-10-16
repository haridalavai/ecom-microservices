import request from "supertest";
import { app } from "../../app";

it("returns 201 with correct creds", async () => {
  process.env.JWT_KEY = "sdfasa";

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);
});

it("returns 400 with incorrect creds", async () => {
  process.env.JWT_KEY = "sdfasa";

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "pssword",
    })
    .expect(400);
});

it("returns cookie with correct creds", async () => {
  process.env.JWT_KEY = "sdfasa";

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
