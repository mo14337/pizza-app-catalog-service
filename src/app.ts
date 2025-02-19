import express from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import categoryRouter from "./category/catgeory-router";
import productRouter from "./product/product-router";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/category", categoryRouter);
app.use("/product", productRouter);

app.use(globalErrorHandler);

export default app;
