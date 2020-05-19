const Twit = require('twit');

require('dotenv').config();
const config = require('./controllers/config'); //api access
const videos = require('./controllers/data'); //video database

const bot = new Twit(config);

const stream = bot.stream('statuses/filter', {
  track: ['@KnucklesReview'], //check mentions
});

stream.on('tweet', tweetEvent); //trigger event

function tweetEvent(tweet) {
  const filePath = videos.source;

  //chunked media upload function
  bot.postMediaChunked({ file_path: filePath }, function (err, data, response) {
    const idString = data.media_id_string;
    const name = tweet.user.screen_name;
    const replyID = tweet.id_str;

    //reply params
    const params = {
      status: `@${name}`,
      media_ids: [idString], //chunked video id
      in_reply_to_status_id: replyID,
    };

    //reply
    bot.post('statuses/update', params, function (err, data, response) {
      console.log(data);
    });
  });
}

console.log('✅ bot running... ');
