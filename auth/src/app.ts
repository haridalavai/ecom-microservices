import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUser } from "./routes/curent-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler, NotFoundError } from "@ticketing-test/common";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
