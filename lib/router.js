'use strict'

const dataStore = require('./data-store')
const pages = require('../node-app/pages/')

// todo: replace this with functional grab from db to avoid state management
const setData = (data) => {
    dataStore.data = data
}

const getData = () => {
    return dataStore.data
}

module.exports = {
    page: async (request, response) => {
        const page = request.originalUrl.replace('/', '')
        let template = require('../ui/layouts/base')
        response.setHeader('Content-Type', 'text/html; charset=utf-8')
        let data = require('../lib/data.json')
        data.cdn = require('./cdn')
        data.selected = page || 'home'
        data.theme = 'forest'
        data.app.abbreviateLogo = false
        if (page) {
            template = require(`../ui/pages/${page}/`)
            data.app.abbreviateLogo = true
            data.app[page] = await pages[page].init()
        }
        setData(data)
        template.render(data, response)
    },
    resolveData: (socket, data = dataStore.data) => {
        console.log(`${Date.now()}: resolve data called`)
        data !== dataStore.data ? setData(data) : socket.emit('dataResolved', getData())
    }
}
