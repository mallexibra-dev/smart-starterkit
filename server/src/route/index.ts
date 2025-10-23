import { OpenAPIHono } from "@hono/zod-openapi";
import productRoute from "./product.route";
import categoryRoute from "./category.route";

const app = new OpenAPIHono();

app.route("/products", productRoute);
app.route("/categories", categoryRoute);

export default app;
