const { getPlanet } = require('../models/planet.model')


async function httpGetAllPlanets(req, res) {
    return res.status(200).json(await getPlanet())
}

module.exports = {
    httpGetAllPlanets
}