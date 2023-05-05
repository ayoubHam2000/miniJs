const express = require('express')

const messagesRouter = express.Router()

const messageController = require('../Controllers/messages.controllers')

messagesRouter.get("/", messageController.get)

module.exports = messagesRouter
