'use strict'

const dotenv = require('dotenv')

if (dotenv) {
    dotenv.config()
}

const cdn = `https://${process.env.BUCKETEER_BUCKET_NAME}.s3.amazonaws.com/public/`

module.exports = cdn
