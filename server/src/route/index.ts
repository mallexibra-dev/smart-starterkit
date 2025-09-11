import { Hono } from "hono";
import exampleRoute from "./users.route";

const app = new Hono()

app.route("/users", exampleRoute)

export default app