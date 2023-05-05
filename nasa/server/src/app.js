const express = require('express')
const path = require('path')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

//Routers
const planetRouter = require('./routers/planet.rounter')
const launchRouter = require('./routers/launch.router')

//Middlewares
app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(morgan('combined'))
app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use('/planet', planetRouter)
app.use('/launch', launchRouter)

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

module.exports = app
