const co          = require("co");
const get         = require("co-request");
const path        = require("path");
const util        = require("util");
const write       = require("co-fs").writeFile;
const thunkify    = require("thunkify");
const parseString = require("xml2js").parseString;

const parse = thunkify(parseString);

const xmlPath             = "http://www.buzzsprout.com/7866.rss";
const rawDataWritePath    = path.join(__dirname, "output-log.json");
const parsedDataWritePath = path.join(__dirname, "parsed-output.json");

module.exports = co(function*() {
  // get xml data
  const response = yield get(xmlPath);

  // parse xml to json
  const data = yield parse(response.body);

  // write raw json to disk
  yield write(rawDataWritePath, JSON.stringify(data));
  console.log('Raw JSON written to disk at location:', rawDataWritePath);

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
  const reporterText = JSON.stringify(reporter);

  // write formatted data to disk
  yield write(parsedDataWritePath, reporterText);
  console.log('Formatted JSON written to disk at location:', parsedDataWritePath);

  return reporterText;
});

function log(obj) {
	console.log(util.inspect(obj, false, null));
};