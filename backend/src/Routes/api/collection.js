import { CollectionController } from "../../Http/Controllers/CollectionController.js";
import { CollectionProvider } from "../../Http/Providers/CollectionProvider.js";

/**
 * Auth routes
 * @param {Router} router
 */

export default function (router) {
  router
    .group("/api/collections", function () {
      this.get("/", CollectionController, "getCollections");
      this.get("/:collection", CollectionController, "getCollection");
      this.post("/", CollectionController, "createCollection");
      this.put("/:collection", CollectionController, "updateCollection");
      this.delete("/:collection", CollectionController, "deleteCollection");
    })
    .provide(CollectionProvider);
}
