const http = require("http")

const app = require("./app")

const server = http.createServer(app)

const PORT = process.env.PORT | 8080

const { loadHabitablePlanet } = require('./models/planet.model')

async function startServer() {
    await loadHabitablePlanet()

    server.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`)
    })
}

startServer()
