const axios = require('axios')
const config = require('./config').github

const authParams = `?client_id=${config.id}&client_secret=${config.secret}`

module.exports = {
    getRepositories: async (username = `${config.username}`) => {
        try {
            let endpoint = `${config.url}users/${username}/repos${authParams}`
            let repositories = await axios(endpoint)
            return repositories.data
        } catch (error) {
            console.log(error)
            return error
        }
    },
    getLanguages: async (repositoryName = '', username = `${config.username}`) => {
        try {
            let endpoint = `${config.url}repos/${username}/${repositoryName}/languages${authParams}`
            let languages = await axios(endpoint)
            return languages.data
        } catch (error) {
            console.log(error)
            return error
        }
    },
    getPercentages: (projects = []) => {
        let allPercentages = projects.map((project) => {
            const values = Object.values(project)
            const languages = Object.entries(project)
            let total = values.reduce((x, y) => x + y, 0)
            let percentages = languages.map((language) => {
                return {
                    [language[0]]: language[1]/total * 100
                }
            })
            return percentages
        })
        return allPercentages
    }
}
