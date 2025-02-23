import mongoose, { AggregatePaginateModel } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { Product } from "./product-types";

const attributeValueSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
    },
});

const priceConfigurationSchema = new mongoose.Schema({
    priceType: {
        type: String,
        required: true,
        enum: ["base", "aditional"],
    },
    availableOptions: {
        type: Map,
        of: Number, // ✅ Correctly defining a Map of numbers
    },
});

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        priceConfiguration: {
            type: Map,
            of: priceConfigurationSchema, // ✅ This is correct
        },
        attributes: {
            type: [attributeValueSchema],
        },
        tenantId: {
            type: String,
            required: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
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

ProductSchema.plugin(mongooseAggregatePaginate);

export default mongoose.model<Product, AggregatePaginateModel<Product>>(
    "Product",
    ProductSchema,
);
