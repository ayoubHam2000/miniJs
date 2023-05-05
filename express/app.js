const express = require('express')
const path = require('path')

const app = express()

//controllers


const PORT = 3000

//express view engine
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))


app.use((req, res, next) => {
    const start = Date.now()
    console.log("Middleware")
    next()
    const end = Date.now()
    const diff = end - start
    console.log(`${req.method} ${req.baseUrl}${req.url} ${diff}ms`)
})

app.use('/staticSite', express.static('public'))
app.use(express.json())

//express view
app.get('/view', (req, res) => {
    res.render('index', {
        title: "My Title",
        content: "Content!"
    })
})

//Friends
const friendRouter = require('./Routes/friends.router')
app.use('/friends', friendRouter)

//Messages
const messagesRouter = require('./Routes/messages.router')
app.use("/messages", messagesRouter)

//Listen
app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`)
})
