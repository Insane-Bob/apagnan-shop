import path from 'path'
import fs from 'fs'
import { Database } from '../src/Models/index.js'
import { DenormalizerModelListener } from '../src/lib/Denormalizer/DenormalizerModelListener.js'
import { DenormalizerQueue } from '../src/lib/Denormalizer/DenormalizerQueue.js'
export async function seed() {
    let seederInstance = {
        references: new Map(),
        random: (a, b) => {
            return Math.floor(Math.random() * (b - a + 1) + a)
        },
        randomIn(array) {
            return array[this.random(0, array.length - 1)]
        },
        db: null,
    }

    DenormalizerQueue.prototype.enqueue = async function (task) {
        await task.execute()
    }
    await Database.initialize()
    seederInstance.db = Database.getInstance()
    seederInstance.db.sequelize.options.logging = false

    const seedersPath = path.resolve('src/database/seeders')
    const seeders = fs.readdirSync(seedersPath)

    for (const seeder of seeders) {
        console.time('== ' + seeder + ': seeded in')
        const scriptSeed = await import(path.join(seedersPath, seeder))
        await scriptSeed.default.call(seederInstance)
        console.timeEnd('== ' + seeder + ': seeded in')
        console.log(' ')
    }

    console.log(
        `\x1b[42m\x1b[37m DONE \x1b[0m ${seeders.length} seeders executed successfully`,
    )

    Database.close()
    process.exit(0)
}

seed()
