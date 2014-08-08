ig = require('instagram-node').instagram()
aws = require 'aws-sdk'
aws.config = new aws.Config
  accessKeyId: process.env.AWS_ACCESS_KEY
  secretAccessKey: process.env.AWS_SECRET_KEY
  region: 'us-west-2'

s3 = new aws.S3({apiVersion: '2006-03-01'});

client_id = process.env.EB_IG_CLIENT_ID
ig.use client_id: client_id, client_secret: process.env.EB_IG_SECRET_KEY

user_id = "431839531"
options = count: 100

module.exports = (req, res) ->
  sendMedia = (media) ->
    images = (item.images.low_resolution.url for item in media)

    data =
      api_version: "1.0.0"
      length: images.length
      images: images

    dataStream = new Buffer JSON.stringify data
    params =
      Bucket: "com.adamcmiel.energiesbalanced"
      Key: "eb_instagram_feed.json"
      ACL: "public-read"
      Body: dataStream

    s3.putObject params, (err, data) ->
      unless err
        console.log "S3 upload successful!", "Date: #{new Date()}", data
        res.send data
      else
        console.error "Error uploading to S3:", "Date: #{new Date()}", "Error Message: #{err.message}"
        res.status 500
           .send err.message

  console.log "Fetching user: #{user_id} data"
  ig.user_media_recent user_id, options, (err, media, pagination, limit) ->
    unless err
      console.log "Successfully fetched user media.", "Date: #{new Date()}"
      sendMedia media
    else console.error "Error fetching IG data:", "Date: #{new Date()}", "Error Message: #{err.message}"
