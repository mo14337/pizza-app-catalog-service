import mongoose, { AggregatePaginateModel } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { Topping } from "./topping-types";

const ToppingSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        tenantId: {
            type: String,
            required: true,
        },
        isPublish: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

ToppingSchema.plugin(mongooseAggregatePaginate);

export default mongoose.model<Topping, AggregatePaginateModel<Topping>>(
    "Topping",
    ToppingSchema,
);
