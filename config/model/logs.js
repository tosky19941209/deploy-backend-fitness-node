const mongoose = require('mongoose')

const logdb = new mongoose.Schema({
    userid: {
        type: mongoose.mongo.ObjectId,
        required: false
    },
    exerciseType: {
        type: String,
        required: false
    },
    startTime: {
        year: {
            type: String,
            required: false
        },
        month: {
            type: String,
            required: false
        },
        date: {
            type: String,
            required: false
        },
        day: {
            type: String,
            required: false
        },
        hour: {
            type: String,
            required: false
        },
        minute: {
            type: String,
            required: false
        },
        second: {
            type: String,
            required: false
        }
    },
    endTime: {
        year: {
            type: String,
            required: false
        },
        month: {
            type: String,
            required: false
        },
        date: {
            type: String,
            required: false
        },
        day: {
            type: String,
            required: false
        },
        hour: {
            type: String,
            required: false
        },
        minute: {
            type: String,
            required: false
        },
        second: {
            type: String,
            required: false
        }
    },
    counter: {
        type: String,
        required: false
    },
    accuracy: {
        type: String,
        required: false
    }
})

const fitnessexercise = mongoose.model('logexercise', logdb)
module.exports = fitnessexercise