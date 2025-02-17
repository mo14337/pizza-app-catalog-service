import CategoryModel from "./category-model";
import { ICategory } from "./category-types";

export class CategoryService {
    async create(category: ICategory) {
        const newCategory = new CategoryModel(category);
        return newCategory.save();
    }
}
