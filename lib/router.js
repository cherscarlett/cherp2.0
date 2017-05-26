'use strict'

const dataStore = require('./data-store')

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

const setData = (data) => {
    dataStore.data = data
}

const getData = () => {
    return dataStore.data
}

module.exports = {
                    page: (request, response) => {
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
                            data.skills = sortSkills(require('../lib/skills.json'))
                        }
                        setData(data)
                        template.render(data, response)
                    },
                    resolveData: (socket, data = dataStore.data) => {
                        console.log(`${Date.now()}: resolve data called`)
                        data !== dataStore.data ? setData(data) : socket.emit('dataResolved', getData())
                    }
                }
