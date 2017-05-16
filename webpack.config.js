'use strict'

const dotenv = require('dotenv')
dotenv.config()

const webpack = require('webpack')
const path = require('path')
const S3 = require('webpack-s3-plugin')
const ExtractText = require("extract-text-webpack-plugin")
const extractSass = new ExtractText({
                      publicPath: `https://${process.env.BUCKETEER_BUCKET_NAME}.s3.amazonaws.com/public/`,
                      filename: "public/[name].css"
                    })
const SpriteLoader = require('svg-sprite-loader/plugin')
const PrepackWebpack = require('prepack-webpack-plugin')

const prePackConfiguration = {} // Todo: do this

module.exports = {
    entry: "./client.js",
    output: {
        publicPath: `https://${process.env.BUCKETEER_BUCKET_NAME}.s3.amazonaws.com/`,
        filename: "public/client.js"
    },
    resolve: {
        extensions: ['.js', '.marko']
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg)$/,
                loader: 'file-loader?name=public/[name].[ext]'
            },
            {
                test: /\.svg$/,
                use: [
                  { loader: 'svg-sprite-loader',
                    options: {
                      extract: true,
                      publicPath: `https://${process.env.BUCKETEER_BUCKET_NAME}.s3.amazonaws.com/public/`,
                      spriteFilename: 'public/sprite.svg'
                    }
                  },
                  'svg-fill-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [
                        "css-loader", "svg-fill-loader/encodeSharp","sass-loader"
                    ],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                test: /\.marko$/,
                loader: 'marko-loader'
            }
        ]
    },
    plugins: [
        new S3({
            include: /.*\.(css|js|svg|png|jpg)/,
            s3Options: {
              accessKeyId: process.env.BUCKETEER_AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY,
              region: 'us-east-1'
            },
            s3UploadOptions: {
              Bucket: `${process.env.BUCKETEER_BUCKET_NAME}`
            }
        }),
        extractSass,
        new SpriteLoader(),
        new PrepackWebpackPlugin(prePackConfiguration)
    ]
}
