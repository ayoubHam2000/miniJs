const { getPlanet } = require('../models/planet.model')


function httpGetAllPlanets(req, res) {
    return res.status(200).json(getPlanet())
}

module.exports = {
    httpGetAllPlanets
}