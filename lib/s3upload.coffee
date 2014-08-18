aws = require 'aws-sdk'
aws.config = new aws.Config
  accessKeyId: process.env.AWS_ACCESS_KEY
  secretAccessKey: process.env.AWS_SECRET_KEY
  region: 'us-west-2'
s3 = new aws.S3 apiVersion: '2006-03-01'
module.exports = s3.putObject.bind s3