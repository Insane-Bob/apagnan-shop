import { Controller } from '../../Core/Controller.js'
import { Database } from '../../Models/index.js'
import { NewsletterValidator } from '../../Validator/NewsletterValidator.js'
import {
    NotFoundException,
    UnprocessableEntity,
} from '../../Exceptions/HTTPException.js'
import { NotificationsServices } from '../../Services/NotificationsServices.js'
import { AccessLinkServices } from '../../Services/AccessLinkServices.js'

export class NewsletterController extends Controller {
    async subscribe() {
        const { email } = this.validate(NewsletterValidator)
        const exists =
            await Database.getInstance().models.NewsletterEmail.findOne({
                where: {
                    email,
                },
            })

        UnprocessableEntity.abortIf(exists, 'Email already subscribed')
        const transaction = await Database.transaction()
        try {
            await Database.getInstance().models.NewsletterEmail.create(
                {
                    email,
                },
                { transaction },
            )

            const user = this.req.user
            const accessLink = await AccessLinkServices.createAccessLink(
                user.id,
                AccessLinkServices.getDate(),
                AccessLinkServices.getDate(20),
                1,
            )

            await NotificationsServices.notifyNewsletterSubscribe(
                email,
                accessLink,
            )
            await transaction.commit()
            this.res.sendStatus(200)
        } catch (e) {
            transaction.rollback()
            throw e
        }
    }

    async unsubscribe() {
        const { email } = this.validate(NewsletterValidator)
        const exists =
            await Database.getInstance().models.NewsletterEmail.findOne({
                where: {
                    email,
                },
            })
        NotFoundException.abortIf(!exists, 'Email not found')
        const transaction = await Database.transaction()
        try {
            await Database.getInstance().models.NewsletterEmail.destroy({
                where: {
                    email,
                },
                transaction,
            })

            await NotificationsServices.notifyNewsletterUnsubscribe(email)
            await transaction.commit()
            this.res.sendStatus(200)
        } catch (e) {
            transaction.rollback()
            throw e
        }
    }
}
