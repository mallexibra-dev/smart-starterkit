import { OpenAPIHono } from "@hono/zod-openapi";
import authRoute from "./auth.route";

const app = new OpenAPIHono();

app.route("/auth", authRoute);

export default app;
