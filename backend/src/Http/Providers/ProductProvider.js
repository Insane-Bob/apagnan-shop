import { Provider } from "../../Core/Provider.js";

export class ProductProvider extends Provider {
  static param = "product";
  static model = "Product";

  fetch(model, paramValue) {
    return model.findOne({
      where: { slug: paramValue },
    });
  }
}
