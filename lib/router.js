'use strict'

const cdn = require('./cdn')

module.exports = {
                    index: (request, response) => {
                        response.setHeader('Content-Type', 'text/html; charset=utf-8')
                        const template = require('../ui/layouts/base.marko')
                        let data = require('../lib/data.json')
                        data.cdn = cdn
                        data.selected = 'home'
                        template.render(data, response)
                    }
                }
