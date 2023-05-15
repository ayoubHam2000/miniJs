const http = require("http")

const app = require("./app")

const mongoose = require("mongoose")

const server = http.createServer(app)

const PORT = process.env.PORT | 8080

const { loadHabitablePlanet } = require('./models/planet.model')

mongoose.connection.once('open', () => {
    console.log("Connecte to data base done")
})

mongoose.connection.on('error', (err) => {
    console.log(err)
})

async function startServer() {
    const uri = 'mongodb+srv://nasa-api:VCKDBe6fv6rOSWhh@nasaclaster.hxzo8.mongodb.net/?retryWrites=true&w=majority';
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    await loadHabitablePlanet()

    server.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`)
    })
}

startServer()
