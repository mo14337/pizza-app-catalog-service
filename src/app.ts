import express from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import categoryRouter from "./category/catgeory-router";

const app = express();

app.use(express.json());

app.use("/category", categoryRouter);

app.use(globalErrorHandler);

export default app;
