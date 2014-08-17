aws = require 'aws-sdk'
aws.config = new aws.Config
  accessKeyId: process.env.AWS_ACCESS_KEY
  secretAccessKey: process.env.AWS_SECRET_KEY
  region: 'us-west-2'

module.exports = aws