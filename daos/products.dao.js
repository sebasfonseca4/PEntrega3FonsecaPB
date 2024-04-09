import Products from "../schemas/product.schema.js";

class ProductDAO {

    static async getAll() {
        return Products.find().lean();
    }

    static async getById(id) {
        return Products.findOne({ _id: id }).lean();
    }

    static async addCart(name, price, category, description) {
        return new Products({name, price, category, description}).save();
    }

}

export default ProductDAO;
