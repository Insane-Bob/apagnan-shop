import { Controller } from '../../Core/Controller.js'
import { Database } from '../../Models/index.js'

export class SpecificController extends Controller {
    product /** @provide by ProductProvider */
    async getSpecifics() {
        if (this.product) {
            this.res.json({
                specifics: await this.product.getSpecifics(),
            })
        } else {
            this.res.json({
                specifics:
                    await Database.getInstance().models.Specific.findAll(),
            })
        }
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
