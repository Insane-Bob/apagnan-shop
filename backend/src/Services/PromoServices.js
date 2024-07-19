import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_KEY)

export class PromoServices {
    static async createCoupon(props) {
        return await stripe.coupons.create(props)
    }

    static async createpromotionCodes(props) {
        return await stripe.promotionCodes.create(props)
    }

    static async listPromotionCodes(props = {}) {
        return await stripe.promotionCodes.list(props)
    }

    static async deletePromotionCode(promotionCodeId) {
        return await stripe.promotionCodes.del(promotionCodeId)
    }
}
