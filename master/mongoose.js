function mongoose() {
    const mongoose = require('mongoose')
    const config = require('../config/env/config')

    mongoose.connect(config.mongodb, {})
        .then(() => {
            console.log("mongoose is connected")
        })
        .catch((err) => {
            console.log("Error is ", err)
        })
}

module.exports = mongoose