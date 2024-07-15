export class DenormalizerExecption extends Error {
    constructor(Task, from, error) {
        console.error(error)
        let message = `Denormalizer task ${Task.constructor.name} failed to denormalize from ${from.constructor.name} : ${error.message}`
        super(message)
    }
}
