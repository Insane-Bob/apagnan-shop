const statusTranslate = {
    pending: 'En attente',
    processing: 'En cours de traitement',
    paid: 'Payée',
    payment_failed: 'Paiement échoué',
    cancel: 'Annulée',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    refunded: 'Remboursée',
    cancelled: 'Annulée',
}

export class OrderFormat {
    static formatOrderNumber(
        orderNumber: string | number,
        size: number = 6,
    ): string {
        return '#' + orderNumber.toString().padStart(size, '0')
    }

    static translatedStatus(status: string): string {
        return statusTranslate[status] || status
    }
}
