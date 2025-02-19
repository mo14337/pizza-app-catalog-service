import productModal from "./product-modal";
import { Product } from "./product-types";

export class ProductService {
    async create(product: Product) {
        //create product
        return await productModal.create(product);
    }
}
