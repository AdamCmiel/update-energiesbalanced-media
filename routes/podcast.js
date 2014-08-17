const updatePodcast = require("../lib/podcast");

const podcast = function(req, res, next) {
	updatePodcast(function(err, result) {
		if (err) res.status(500).send(err);
		else res.render("index.jade", {data: result});
	});
};

module.exports = podcast;