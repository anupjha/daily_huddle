const { appHomeOpenedCallback } = require('./app_home_opened.js');

module.exports.register = (app) => {
  app.event('app_home_opened', appHomeOpenedCallback);
};
