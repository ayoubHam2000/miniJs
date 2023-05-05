const express = require('express')

const planetRouter = express.Router()

const { httpGetAllPlanets } = require('../controllers/planet.controller')

planetRouter.get('/', httpGetAllPlanets)

module.exports = planetRouter
