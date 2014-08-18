const co          = require("co");
const get         = require("co-request");
const util        = require("util");
const thunkify    = require("thunkify");

const upload = thunkify(require("./s3upload"));
const parse = thunkify(require("xml2js").parseString);
const xmlPath = "http://www.buzzsprout.com/7866.rss";

module.exports = co(function*() {
    // get xml data
    const response = yield get(xmlPath);

    // parse xml to json
    const data = yield parse(response.body);

    // get interesting data from rss feed
    const tracks = data.rss.channel[0].item;

    var parsedData = {};
    var item;

    //copy data to consumable format
    for (let index = 0; index < tracks.length; index++) {
        item = tracks[index];
        parsedData[index] = {
            title: item.title[0],
            description: item.description[0],
            duration: Number(item["itunes:duration"][0]),
            pubDate: new Date(item.pubDate[0]),
            src: item.guid[0]
        };
    }

    const reporter = {
        api_version: "1.0.0",
        length: parsedData.length,
        tracks: parsedData
    };

    // upload formatted data to s3
    const S3Response = yield upload({
        Bucket: "com.adamcmiel.energiesbalanced",
        Key: "eb_podcast_feed.json",
        ACL: "public-read",
        Body: new Buffer(JSON.stringify(reporter))
    });

    console.log('Formatted data uploaded to S3:', S3Response, new Date());

    return JSON.stringify(S3Response);
});

function log(obj) {
    console.log(util.inspect(obj, false, null));
};
