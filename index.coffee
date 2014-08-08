express = require "express"
app = express()
app.get "/update-instagram-feed", require "./lib/upload"

port = process.env.PORT
app.listen port
console.log "Web Server up.  Listening on port #{port}", (new Date()).toString()
