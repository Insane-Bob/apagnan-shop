import { Controller } from "../../Core/Controller.js";
import { Database } from "../../Models/index.js";

export class ProductController extends Controller {
  async getProducts() {
    const products = await Database.getInstance().models.Product.findAll();
    this.res.json({
      products: products,
    });
  }

  async getProduct() {
    const product = this.product;
    const specifics = await Database.getInstance().models.Specific.findAll({
      where: {
        productId: product.id,
      },
    });
    this.res.json({
      product: product,
      specifics: specifics,
    });
  }

  async createProduct() {
    const product = await Database.getInstance().models.Product.create(
      this.req.body
    );
    this.res.json({
      product: product,
    });
  }

  async updateProduct() {
    const product = this.product;
    await product.update(this.req.body);
    this.res.json({
      product: product,
    });
  }

  async deleteProduct() {
    const product = this.product;
    await product.destroy();
    this.res.json({
      product: product,
    });
  }
}
