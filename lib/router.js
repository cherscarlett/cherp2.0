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
                    page: (request, response, io) => {
                        const page = request.originalUrl.replace('/', '')
                        let template = require('../ui/layouts/base')
                        response.setHeader('Content-Type', 'text/html; charset=utf-8')
                        data.selected = page || 'home'
                        data.theme = 'forest'
                        if (page) {
                            template = require(`../ui/pages/${page}/`)
                            data.app.abbreviateLogo = true
                            data.skills = sortSkills(require('../lib/skills.json'))
                        }
                        io.on('connection', (socket) => {
                            socket.on('pageLoaded', () => {
                                io.emit('dataLoaded', data)
                            })
                        })
                        template.render(data, response)
                    }
                }
