import setUpApp from "./app.js";
setUpApp().then(app => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000')
    })
})