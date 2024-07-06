import { SpecificController } from '../../Http/Controllers/SpecificController.js'
import { SpecificProvider } from '../../Http/Providers/SpecificProvider.js'

/**
 * Auth routes
 * @param {Router} router
 */

export default function (router) {
    router
        .group('/api/specifics', function () {
            this.get('/', SpecificController, 'getSpecifics')
            this.get('/:specific', SpecificController, 'getSpecific')
            this.post('/', SpecificController, 'createSpecific')
            this.patch('/:specific', SpecificController, 'updateSpecific')
            this.delete('/:specific', SpecificController, 'deleteSpecific')
        })
        .provide(SpecificProvider)
}
