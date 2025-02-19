import mongoose from "mongoose";

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
        availableOptions: {
            type: Map,
            of: Number,
        },
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
            of: priceConfigurationSchema,
        },
        attributes: {
            type: [attributeValueSchema],
        },
        tenantId: {
            type: Number,
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

export default mongoose.model("Product", ProductSchema);
