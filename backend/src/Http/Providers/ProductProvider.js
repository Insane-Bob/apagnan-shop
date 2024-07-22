import { Provider } from "../../Core/Provider.js";

export class ProductProvider extends Provider {
  static param = "product";
  static model = "Product";

  fetch(model, paramValue, request) {
    if(request.query.has('withImages'))
        model = model.scope('withImages')
    return model.findOne({
      where: { slug: paramValue },
    });
  }
}
