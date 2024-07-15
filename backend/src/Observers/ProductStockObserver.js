import { Observer } from '../Core/Observer.js'

export class ProductStockObserver extends Observer {
    static instance = null

    /**
     * @returns {ProductStockObserver}
     */
    static getInstance() {
        if (this.instance === null) {
            this.instance = new ProductStockObserver()
        }
        return this.instance
    }
    constructor() {
        super()
    }
}
