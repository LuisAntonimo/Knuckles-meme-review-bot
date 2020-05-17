const Twit = require('twit');
const fs = require('fs');

require('dotenv').config();
const config = require('./config');

const bot = new Twit(config);

var filePath = './src/appvd.mp4';
bot.postMediaChunked({ file_path: filePath }, function (err, data, response) {
  id_string = data.media_id_string;

  return id_string;
});
