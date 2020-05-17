const Twit = require('twit');

require('dotenv').config();
const config = require('./config');
const video = require('./vid');

const bot = new Twit(config);

const stream = bot.stream('statuses/filter', {
  track: ['@KnucklesReview'], //check mentions
});

stream.on('tweet', tweetEvent); //trigger event

function tweetEvent(tweet) {
  const filePath = video.source;

  bot.postMediaChunked({ file_path: filePath }, function (err, data, response) {
    const idString = data.media_id_string;
    const name = tweet.user.screen_name;
    const replyID = tweet.id_str;

    const params = {
      status: `@${name}`,
      media_ids: [idString],
      in_reply_to_status_id: replyID,
    };

    bot.post('statuses/update', params, function (err, data, response) {
      console.log(data);
    });
  });
}

console.log('bot running... ✅');
