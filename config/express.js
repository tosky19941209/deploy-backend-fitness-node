// const { execArgv } = require('process')
module.exports = () => {
    const express = require('express')
    const cors = require('cors')
    const config = require('./env/config')
    const router = require('../router/router')
    const websocket = require('./socket.js')
    const app = express()
    const http = require('http')
    app.use(cors({
        methods:['GET','POST', 'PUT', 'DELETE'],
        origin:'*'
    }))

    app.use(express.json());
    app.use('/api/',router)

    const server = http.createServer(app)
    websocket(server)

    server.listen(config.port, ()=> {
        console.log(`server is running in ${config.port}`)
    })
}