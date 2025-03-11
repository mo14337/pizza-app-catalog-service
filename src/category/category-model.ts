import mongoose from "mongoose";
import { Attribute, ICategory, PriceConfiguration } from "./category-types";

const priceConfiguration = new mongoose.Schema<PriceConfiguration>({
    priceType: {
        type: String,
        required: true,
        enum: ["base", "aditional"],
    },
    availableOptions: {
        type: [String],
        required: true,
    },
});

const attributeSchema = new mongoose.Schema<Attribute>({
    name: {
        type: String,
        required: true,
    },
    widgetType: {
        type: String,
        enum: ["switch", "radio"],
        required: true,
    },
    defaultValue: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    availableOptions: {
        type: [String],
        required: true,
    },
});
const CategorySchema = new mongoose.Schema<ICategory>(
    {
        name: {
            type: String,
            required: true,
        },
        priceConfiguration: {
            type: Map,
            of: priceConfiguration,
            required: true,
        },
        attributes: {
            type: [attributeSchema],
            required: true,
        },
        hasToppings: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model("Category", CategorySchema);
