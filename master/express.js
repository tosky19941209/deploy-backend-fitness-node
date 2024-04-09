module.exports = () => {
    const express = require('express')
    const cors = require('cors')
    const morgan = require('morgan')
    // const bodyParser = require('bodyparser')
    const routers = require('./routers')
    const app = express()

    app.use(cors({
        methods:['GET', 'POST', 'PUT', 'DELETE'],
        origin:'*'
    }))
    app.use(express.json());
    // app.use(bodyParser.json());
    // app.use(bodyParser.urlencoded({ limit: "1mb", extended: true }));
    // app.use(morgan("dev_morgan"))

    routers.map(router => {
        // console.log("1: ", router)
        app.use(`/api/${router}`, require(`../routers/${router}`))
        // app.use(`/api/${router}`, require("../routers"))
    })

    return app

}