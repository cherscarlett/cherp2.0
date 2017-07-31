const dotenv = require('dotenv')

dotenv.load()

module.exports = {
    github: {
        url: process.env.GITHUB_URL,
        secret: process.env.GITHUB_SECRET,
        id: process.env.GITHUB_ID,
        username: process.env.GITHUB_USERNAME
    }
}
