import { Controller } from '../../Core/Controller.js'
import { Database } from '../../Models/index.js'
import { NotFoundException } from '../../Exceptions/HTTPException.js'
import { SpecificPolicy } from '../Policies/SpecificPolicy.js'
import { SpecificValidator } from '../../Validator/SpecificValidator.js'

export class SpecificController extends Controller {
    product /** @provide by ProductProvider */
    async getSpecifics() {
        if (this.product) {
            this.res.status(200).json({
                specifics: await this.product.getSpecifics(),
            })
        } else {
            this.res.status(200).json({
                specifics:
                    await Database.getInstance().models.Specific.findAll(),
            })
        }
    }

    async getSpecific() {
        const specific = this.specific
        NotFoundException.abortIf(!specific)
        this.res.status(200).json({
            specific: specific,
        })
    }

    async createSpecific() {
        this.can(SpecificPolicy.update)
        const payload = this.validate(SpecificValidator)
        const specific =
            await Database.getInstance().models.Specific.create(payload)
        if (specific) {
            this.res.status(201).json({
                specific: specific,
            })
        }
    }

    async updateSpecific() {
        this.can(SpecificPolicy.update)
        const payload = this.validate(SpecificValidator)
        const rowsEdited = await this.specific.update(payload)
        NotFoundException.abortIf(!rowsEdited)
        this.res.status(200).json({
            specific: this.specific,
        })
    }

    async deleteSpecific() {
        this.can(SpecificPolicy.delete)
        const deleted = await this.specific.destroy()
        NotFoundException.abortIf(!deleted)
        this.res.sendStatus(204)
    }
}
