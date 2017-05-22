'use strict'

let data = require('../lib/data.json')

data.cdn = require('./cdn')

const sortSkills = (skills) => {
    let skillSet = []

    for(let n in skills) {
        let skill = skills[n]

        skillSet[skill.typeShort] ? skillSet[skill.typeShort].push(skill) : skillSet[skill.typeShort] = [skill]
    }

    let newSet = []

    for(let set in skillSet) {
        skillSet[set].sort()

        let skill = {
          list: skillSet[set],
          category: set
        }

        newSet.push(skill)
    }

    return newSet
}

module.exports = {
                    index: (request, response, io) => {
                        response.setHeader('Content-Type', 'text/html; charset=utf-8')
                        data.selected = 'home'
                        data.theme = 'forest'
                        const template = require('../ui/layouts/base')
                        io.emit('dataLoaded', data)
                        template.render(data, response)
                    },
                    page: (request, response, io) => {
                        const page = request.originalUrl.replace('/', '')
                        response.setHeader('Content-Type', 'text/html; charset=utf-8')
                        data.skills = sortSkills(require('../lib/skills.json'))
                        data.app.abbreviateLogo = true
                        data.selected = page
                        data.theme = 'forest'
                        const template = require(`../ui/pages/${page}/`)
                        io.on('connection', (socket) => {
                            socket.on('pageLoaded', () => {
                                io.emit('dataLoaded', data)
                            })
                        })
                        template.render(data, response)
                    }
                }
