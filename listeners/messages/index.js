// import { subtype } from '@slack/bolt';
const { sampleMessageCallback } = require('./sample-message');
// const { standupRequestMessageCallback } = require('./standup-message');

module.exports.register = (app) => {
  app.message(/^(hi|hello|hey).*/, sampleMessageCallback);
  // app.message(subtype('bot_message'),standupRequestMessageCallback )
};
