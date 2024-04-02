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
}
