const express = require('express')

const friendsRouter = express.Router()

const friendsController = require('../Controllers/friends.controllers')

friendsRouter.get("/", friendsController.getAll)
friendsRouter.get("/:friendId", friendsController.getById)
friendsRouter.post("/", friendsController.post)

module.exports = friendsRouter