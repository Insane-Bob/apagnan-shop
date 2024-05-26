import setUpApp from "./app.js";
import {Database} from "./Models/index.js";
(async()=>{
    await Database.initialize()
    setUpApp().then(app => {
        app.listen(3000, () => {
            console.log('Server is running on port 3000')
        })
    })
})()