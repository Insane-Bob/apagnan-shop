export interface PromotionCodeStripe {
    id: string
    object: string
    active: boolean
    code: string
    coupon: {
        id: string
        object: string
        amount_off: null
        created: 1678040164
        currency: null
        duration: string
        duration_in_months: 3
        livemode: false
        max_redemptions: null
        metadata: {}
        name: null
        percent_off: 25.5
        redeem_by: null
        times_redeemed: 0
        valid: true
    }
    created: 1678040164
    customer: null
    expires_at: null
    livemode: false
    max_redemptions: null
    metadata: {}
    restrictions: {
        first_time_transaction: false
        minimum_amount: null
        minimum_amount_currency: null
    }
    times_redeemed: 0
}
