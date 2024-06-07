import { ProductController } from "../../Http/Controllers/ProductController.js";
import { ProductProvider } from "../../Http/Providers/ProductProvider.js";

/**
 * Auth routes
 * @param {Router} router
 */

export default function (router) {
  router
    .group("/api/products", function () {
      this.get("/", ProductController, "getProducts");
      this.get("/:product", ProductController, "getProduct");
      this.post("/", ProductController, "createProduct");
      this.put("/:product", ProductController, "updateProduct");
      this.delete("/:product", ProductController, "deleteProduct");
    })
    .provide(ProductProvider);
}
