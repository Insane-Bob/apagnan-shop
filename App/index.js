import express from 'express'
import { Router } from './Core/Router.js'
const app = express()
const router = new Router(app)

globalThis.__dirname = process.cwd()

router.init(app)

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
