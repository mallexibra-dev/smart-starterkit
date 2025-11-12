import { Hono } from "hono";
import authRoute from "./auth.route";

const app = new Hono();

app.route("/auth", authRoute);

export default app;
