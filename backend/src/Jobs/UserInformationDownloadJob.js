import { Database } from '../Models/index.js'
import { File } from '../lib/File.js'
import { NotificationsServices } from '../Services/NotificationsServices.js'
import { AccessLinkServices } from '../Services/AccessLinkServices.js'
import { URLUtils } from '../utils/url.js'
export class UserInformationDownloadJob {
    static start(...args) {
        return new this().execute(...args)
    }
    get name() {
        return this.constructor.name
    }

    async execute(userId) {
        let models = Database.getInstance().models
        const userInfos = await models.User.unscoped().findOne({
            attributes: { exclude: ['password', 'id'] },
            where: {
                id: userId,
            },
            include: [
                {
                    model: models.Customer.unscoped(),
                    attributes: { exclude: ['userId', 'stripeId', 'id'] },
                    include: [
                        {
                            attributes: { exclude: ['customerId'] },
                            model: models.Address.unscoped(),
                        },
                        {
                            attributes: {
                                exclude: ['id', 'customerId', 'promoId'],
                            },
                            model: models.Order.unscoped(),
                            include: [
                                {
                                    model: models.OrderStatus.unscoped(),
                                    as: 'statusHistory',
                                    attributes: {
                                        exclude: ['id', 'orderId'],
                                    },
                                },
                                {
                                    model: models.OrderDetail.unscoped(),
                                    attributes: {
                                        exclude: ['id', 'orderId', 'productId'],
                                    },
                                    include: [
                                        {
                                            model: models.Product.unscoped(),
                                            attributes: ['slug', 'name'],
                                        },
                                    ],
                                },
                                {
                                    model: models.Payment.unscoped(),
                                    attributes: ['status', 'createdAt'],
                                },
                                {
                                    model: models.RefundRequestOrder.unscoped(),
                                    attributes: [
                                        'approved',
                                        'reason',
                                        'createdAt',
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    model: models.UserConnectionAttempt.unscoped(),
                    attributes: ['success', 'createdAt'],
                },
                {
                    model: models.Review.unscoped(),
                    attributes: ['id', 'rate', 'content', 'createdAt'],
                    include: {
                        model: models.Product.unscoped(),
                        attributes: ['slug', 'name'],
                    },
                },
            ],
        })
        const keyTranslate = {
            Customer: 'Compte client',
            firstName: 'Prénom',
            lastName: 'Nom',
            phone: 'Téléphone',
            emailVerifiedAt: 'Email vérifié le',
            role: 'Rôle',
            createdAt: 'Créé le',
            updatedAt: 'Mis à jour le',
            Addresses: 'Adresses',
            street: 'Rue',
            city: 'Ville',
            region: 'Région',
            postalCode: 'Code postal',
            country: 'Pays',
            total: 'Prix total',
            nbProducts: 'Nombre de produits',
            status: 'Statut',
            paid: 'Payé',
            pending: 'En attente',
            refunded: 'Remboursé',
            shipped: 'Expédié',
            delivered: 'Livré',
            canceled: 'Annulé',
            shippingAddressId: 'Adresse de livraison',
            billingAddressId: 'Adresse de facturation',
            statusHistory: 'Historique des statuts',
            OrderDetails: 'Détails de la commande',
            quantity: 'Quantité',
            unitPrice: 'Prix unitaire',
            Product: 'Produit',
            slug: 'Slug',
            name: 'Nom',
            Payments: 'Paiements',
            succeeded: 'Réussi',
            failed: 'Échoué',
            RefundRequestOrders: 'Demandes de remboursement',
            approved: 'Approuvé',
            reason: 'Raison',
            Reviews: 'Avis',
            rate: 'Note',
            content: 'Contenu',
            UserConnectionAttempts: 'Tentatives de connexion',
            success: 'Succès',
        }

        function recursiveTranslateObject(obj) {
            if (Array.isArray(obj)) {
                return obj.map((item) => recursiveTranslateObject(item))
            } else if (typeof obj === 'object' && obj !== null) {
                const translatedObj = {}
                for (const [key, value] of Object.entries(obj)) {
                    const translatedKey = keyTranslate[key] || key
                    translatedObj[translatedKey] =
                        recursiveTranslateObject(value)
                }
                return translatedObj
            } else if (typeof obj === 'string') {
                return keyTranslate[obj] ?? obj
            } else {
                return obj
            }
        }

        const translatedUserInfos = recursiveTranslateObject(
            JSON.parse(JSON.stringify(userInfos)),
        )

        const file = new File()
        file.setData(JSON.stringify(translatedUserInfos))
        file.encryptFor(userId)
        file.save('uploads')
        let name = file.name

        const accessLink = await AccessLinkServices.createAccessLink(
            userId,
            AccessLinkServices.getDate(0),
            AccessLinkServices.getDate(0, 0, 5),
            -1,
        )
        const url = `${URLUtils.removeLastSlash(process.env.APP_URL)}/api/uploads/${name}?a=${accessLink.identifier}`
        await NotificationsServices.notifyUserPersonalDataJobEnd(userInfos, url)
    }
}
