import { QueryTypes } from 'sequelize'
import { Database } from '../Models/index.js'
import mongoose from 'mongoose'

export class CalculateStockByDate {
    get name() {
        return this.constructor.name
    }

    static schema = new mongoose.Schema({
        productId: String,
        date: Date,
        quantityOfDay: Number,
    })

    async execute() {
        let SQL = `
            with s as (
                select quantity,"productId", date_trunc('day', "createdAt")::date as date, SUM(quantity) over (partition by "productId" order by "createdAt") as "quantityOfDay",
                row_number() over (partition by ("productId",date_trunc('day', "createdAt")::date) order by "createdAt" desc) as "n"
            from "StockTransactions"
            order by "productId", date
                )
            select "productId", "date", "quantityOfDay" from s where n = 1
        `

        let result = await Database.getInstance().sequelize.query(SQL, {
            type: QueryTypes.SELECT,
        })

        let collection = Database.getInstance().mongoModel(
            'stocks',
            CalculateStockByDate.schema,
        )

        await collection.deleteMany({})
        await collection.insertMany(result)
    }
}
