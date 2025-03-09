import express from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import categoryRouter from "./category/catgeory-router";
import productRouter from "./product/product-router";
import cookieParser from "cookie-parser";
import toppingRouter from "./toppings/topping-router";
import cors from "cors";

const app = express();
app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:3000"],
        credentials: true,
    }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/topping", toppingRouter);

app.use(globalErrorHandler);

export default app;
