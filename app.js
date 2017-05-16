'use strict'

import 'babel-polyfill'
import http from 'http'
import path from 'path'
import connect from 'connect'
import favicon from 'serve-favicon'
import compression from 'compression'
import marko from 'marko/node-require'
import markoComponents from 'marko/components'
import router from './lib/router'

const port = process.env.PORT || '9001' // It's over 9000

const app = connect()

marko.install()

app
    .use(favicon(path.join(__dirname, 'public', 'favicon.png')))
    .use(compression())
    .use('/', (request, response) => router.index(request, response))

app.listen(port, (err) => {
    if (err) {
        return console.error(`There was an error: ${err}`)
    }
    console.log(`Listening on port: ${port}`)
})

module.exports = app
