export class ParametersBag extends Map {
    constructor(object) {
        super()
        this._patch(object)
    }
    _patch(object) {
        for (let key in object) {
            this.set(key, object[key])
        }
    }

    get(key, defaultValue = null) {
        return this.has(key) ? super.get(key) : defaultValue
    }

    all() {
        let all = {}
        for (let [key, value] of this.entries()) {
            all[key] = value
        }
        return all
    }
}
