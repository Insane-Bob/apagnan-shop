import { Factory } from './Factory.js'
import { faker } from '@faker-js/faker'
export class UserWidgetFactory extends Factory {
    static model = 'UserWidget'
    static instanciate() {
        return {
            data: '[{"id":"stock-evolution","active":true,"gs":{"x":6,"y":3,"width":6,"height":3}},{"id":"reviews","active":true,"gs":{"x":10,"y":1,"width":2,"height":0}},{"id":"incomes","active":true,"gs":{"x":10,"y":2,"width":2,"height":0}},{"id":"orders-count","active":true,"gs":{"x":10,"y":0,"width":2,"height":0}},{"id":"recent-review","active":true,"gs":{"x":6,"y":0,"width":4,"height":3}},{"id":"orders-taken","active":true,"gs":{"x":0,"y":0,"width":6,"height":3}},{"id":"income-evolution","active":true,"gs":{"x":0,"y":0,"width":6,"height":3}}]',
        }
    }
}
