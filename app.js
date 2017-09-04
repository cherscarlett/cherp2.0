'use strict'

// can I haz import soon?
const http = require('http')
const connect = require('connect')
const compression = require('compression')
const marko = require('marko/node-require')
const router = require('./lib/router')
const IO = require('socket.io')
const dotenv = require('dotenv')

if (dotenv) {
    dotenv.load()
}

const port = process.env.PORT || '9002' // It's over 9000

const app = connect()
const server = http.createServer(app)
const io = new IO(server)

marko.install()

app
    .use(compression())
    .use('/', (request, response) => router.page(request, response))

io.on('connection', (socket) => {
    console.log('connected to socket')
    socket.on('pageLoaded', () => {
        console.log(`${Date.now()}: page loaded.`)
        router.resolveData(socket)
    })
})

server.listen(port, (err) => {
    if (err) {
        return console.error(`There was an error: ${err}`)
    }
    console.log(`Listening on port: ${port}`)
})

module.exports = app
