import { SpecificController } from '../../Http/Controllers/SpecificController.js'
import { SpecificProvider } from '../../Http/Providers/SpecificProvider.js'

/**
 * Auth routes
 * @param {Router} router
 */

export function specificRoutes(router) {
    router
        .group('/specifics', function () {
            this.get('/', SpecificController, 'getSpecifics')
            this.get('/:specific', SpecificController, 'getSpecific')
            this.post('/', SpecificController, 'createSpecific')
            this.patch('/:specific', SpecificController, 'updateSpecific')
            this.delete('/:specific', SpecificController, 'deleteSpecific')
        })
        .provide(SpecificProvider)
}
