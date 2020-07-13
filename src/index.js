const Twit = require('twit');
require('dotenv').config();

const config = require('./controllers/config'); //api access keys config
const videos = require('./controllers/data'); //video path database
const bot = new Twit(config);

const stream = bot.stream('statuses/filter', {
  track: ['@KnucklesReview'], //check mentions
});

stream.on('tweet', tweetEvent); //trigger event

function tweetEvent(mention) {
  const tweet = mention.text;
  const name = mention.user.screen_name;
  const replyID = mention.id_str;

  console.log(`${name} mentioned Knuckles`);

  for (let video in videos) {
    if (tweet === videos[video].code) {
      //search videos in path database based on the "code" property
      const filePath = videos[video].source;

      //chunked upload
      bot.postMediaChunked({ file_path: filePath }, (err, data, response) => {
        const idString = data.media_id_string;

        //reply params
        const params = {
          status: `@${name}`,
          media_ids: [idString], //chunked video id
          in_reply_to_status_id: replyID,
        };

        //reply
        bot.post('statuses/update', params, function (err, data, response) {
          if (err !== undefined) {
            console.log(err);
          } else {
            console.log(`Replied ${name} successfully`);
          }
        });
      });
    }
  }
}

console.log('✅ bot running... ');
