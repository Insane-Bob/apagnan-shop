import { Controller } from "../../Core/Controller.js";
import { Database } from "../../Models/index.js";

export class CollectionController extends Controller {
  async getCollections() {
    const collections =
      await Database.getInstance().models.Collection.findAll();
    this.res.json({
      collections: collections,
    });
  }

  async getCollection() {
    const collection = this.collection;
    this.res.json({
      collection: collection,
    });
  }

  async createCollection() {
    const collection = await Database.getInstance().models.Collection.create(
      this.req.body
    );
    this.res.json({
      collection: collection,
    });
  }

  async updateCollection() {
    const collection = this.collection;
    await collection.update(this.req.body);
    this.res.json({
      collection: collection,
    });
  }

  async deleteCollection() {
    const collection = this.collection;
    await collection.destroy();
    this.res.json({
      collection: collection,
    });
  }
}
