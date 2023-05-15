const mongoose = require('mongoose')

const launchSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
    },
    launchDate: {
        type: Date,
        required: true
    },
    mission: {
        type: String,
        required: true
    },
    rocket: {
        type: String,
        required: true
    },
    target: {
        type: mongoose.ObjectId,
        ref: 'Planet'
    },
    customer: [String],
    upcoming: {
        type: Boolean,
        required: true
    },
    sucess: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('launches', launchSchema)
