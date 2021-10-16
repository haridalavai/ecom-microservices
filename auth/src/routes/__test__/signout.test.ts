import request from "supertest";
import { app } from "../../app";

it("returns 200 with signout", async () => {
  process.env.JWT_KEY = "sdfasa";

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  const response = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);

  console.log();
  expect(response.get("Set-Cookie")).toEqual([
    "express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly",
  ]);
});
