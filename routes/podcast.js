const updatePodcast = require("../lib/podcast");

const podcast = function(req, res, next) {
    updatePodcast(function(err, result) {
        if (err) console.error(err);
        res.render("index.jade", {data: result});
    });
};

module.exports = podcast;
