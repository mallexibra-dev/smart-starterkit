import { OpenAPIHono } from "@hono/zod-openapi";
import userRoute from "./user.route";
import productRoute from "./product.route";
import transactionRoute from "./transaction.route";

const app = new OpenAPIHono();

app.route("/users", userRoute);
app.route("/products", productRoute);
app.route("/transactions", transactionRoute);

export default app;
