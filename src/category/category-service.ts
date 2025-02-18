import createHttpError from "http-errors";
import CategoryModel from "./category-model";
import { ICategory } from "./category-types";
import { Types } from "mongoose";
import categoryModel from "./category-model";

export class CategoryService {
    async create(category: ICategory) {
        const newCategory = new CategoryModel(category);
        return newCategory.save();
    }

    async update(id: string, category: ICategory) {
        if (!Types.ObjectId.isValid(id)) {
            throw createHttpError(400, "Invalid object id");
        }
        const updatedData = CategoryModel.findByIdAndUpdate(id, category, {
            new: true,
        });
        return updatedData;
    }

    async getCategoryById(id: string) {
        return categoryModel.findById(id);
    }

    async getAllCatgeory() {
        return categoryModel.find();
    }
    async deleteCategory(id: string) {
        return categoryModel.findByIdAndDelete(id, { new: true });
    }
}
