import { OpenAPIHono } from "@hono/zod-openapi";
import userRoute from "./user.route";

const app = new OpenAPIHono();

app.route("/users", userRoute);

export default app;
