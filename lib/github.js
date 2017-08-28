const axios = require('axios')
const config = require('./config').github

const authParams = `?client_id=${config.id}&client_secret=${config.secret}`

module.exports = {
    getRepositories: async (username = `${config.username}`) => {
        try {
            const endpoint = `${config.url}users/${username}/repos${authParams}`
            const repositories = await axios(endpoint)
            return repositories.data
        } catch (error) {
            console.log(error)
            return error
        }
    },
    getLanguages: async (repositoryName = '', username = `${config.username}`) => {
        try {
            const endpoint = `${config.url}repos/${username}/${repositoryName}/languages${authParams}`
            const languages = await axios(endpoint)
            return languages.data
        } catch (error) {
            console.log(error)
            return error
        }
    }
}
