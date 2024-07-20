export class OrderFormat{
    static formatOrderNumber(orderNumber: string | number, size : number = 6): string {
        return '#' + orderNumber.toString().padStart(size, '0')
    }
}