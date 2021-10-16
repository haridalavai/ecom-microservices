import request from "supertest";
import { app } from "../../app";

it("returns 201 on successful signup", () => {
  process.env.JWT_KEY = "kjdfkjdfh";
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("returns 400 for wwrong password", () => {
  process.env.JWT_KEY = "kjdfkjdfh";
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "pa",
    })
    .expect(400);
});

it("returns 400 with invalid email and password", async () => {
  process.env.JWT_KEY = "kjdfkjdfh";
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
    })
    .expect(400);
  return request(app)
    .post("/api/users/signup")
    .send({
      password: "password",
    })
    .expect(400);
});

it("disallows to signup with same username more than once", async () => {
  process.env.JWT_KEY = "kjdfkjdfh";
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("sets cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
