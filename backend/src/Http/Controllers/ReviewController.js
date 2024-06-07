import { Controller } from "../../Core/Controller.js";

export class ReviewController extends Controller {
  async getReviews() {
    const reviews = await Database.getInstance().models.Review.findAll();
    this.res.json({
      reviews: reviews,
    });
  }

  async getReview() {
    const review = this.review;
    this.res.json({
      review: review,
    });
  }

  async createReview() {
    const review = await Database.getInstance().models.Review.create(
      this.req.body
    );
    this.res.json({
      review: review,
    });
  }

  async updateReview() {
    const review = this.review;
    await review.update(this.req.body);
    this.res.json({
      review: review,
    });
  }

  async deleteReview() {
    const review = this.review;
    await review.destroy();
    this.res.json({
      review: review,
    });
  }
}
