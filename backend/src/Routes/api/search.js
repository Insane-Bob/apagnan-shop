import { SearchController } from '../../Http/Controllers/SearchController.js'

export default function (router) {
    router.group('/api/search', function () {
        this.get('/', SearchController, 'search')
        this.get('/products', SearchController, 'FrontProductSearch')
    })
}
