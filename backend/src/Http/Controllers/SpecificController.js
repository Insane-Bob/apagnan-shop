import { Controller } from '../../Core/Controller.js'
import { Database } from '../../Models/index.js'

export class SpecificController extends Controller {
    product /** @provide by ProductProvider */
    specific /** @provide by SpecificProvider */
    async getSpecifics() {
        this.res.json({
            specifics: await this.product.getSpecifics(),
        })
    }

    async getSpecific() {
        const specific = this.specific
        this.res.json({
            specific: specific,
        })
    }

    async createSpecific() {
        const specific = await Database.getInstance().models.Specific.create(
            this.req.body,
        )
        this.res.json({
            specific: specific,
        })
    }

    async updateSpecific() {
        const specific = this.specific
        await specific.update(this.req.body)
        this.res.json({
            specific: specific,
        })
    }

    async deleteSpecific() {
        const specific = this.specific
        await specific.destroy()
        this.res.json({
            specific: specific,
        })
    }
}
