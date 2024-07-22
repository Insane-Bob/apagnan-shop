export class Money{
    static format(value) {
        if(typeof value !== 'number') {
            return value
        }
        return value.toFixed(2) + '€'
    }
}