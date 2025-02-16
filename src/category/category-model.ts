import mongoose from "mongoose";

interface PriceConfiguration {
    [key: string]: {
        priceType: "base" | "additional";
        availableOptions: string[];
    };
}

interface Attribute {
    name: string;
    widgetType: "switch" | "radio";
    defaultValue: string;
    availableOptions: string[];
}

export interface ICategory {
    name: string;
    priceConfiguration: PriceConfiguration;
    arrtibutes: Attribute[];
}
const priceConfiguration = new mongoose.Schema<PriceConfiguration>({
    priceType: {
        type: String,
        required: true,
        enum: ["base", "additional"],
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
const CategorySchema = new mongoose.Schema<ICategory>({
    name: {
        type: String,
        required: true,
    },
    priceConfiguration: {
        type: Map,
        of: priceConfiguration,
        required: true,
    },
    arrtibutes: {
        type: [attributeSchema],
        required: true,
    },
});

export default mongoose.model("Category", CategorySchema);
