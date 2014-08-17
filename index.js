// Allow inclusion of coffeescript modules
require("coffee-script/register");

// Require express and create app singleton
const app = require("express")();

// Set View engine to render jade views
app.engine('jade', require('jade').__express);

// Require routes to update content
app.get("/update-instagram-feed", require("./lib/instagram"));
app.get("/update-podcast-feed", require("./routes/podcast"));

// Render the root to show content update options
app.get("/", function(req, res) {
	res.render("index.jade", {data: 'Click a link to update one of the feeds'});
});

// Listen on port provided by Heroku
const port = process.env.PORT;
app.listen(port);

// Log server up
console.log("Web Server up.  Listening on port " + port, (new Date()).toString());
