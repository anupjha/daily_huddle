const { sampleCommandCallback } = require('./sample-command');
// const { standupCommandCallback, standupSettingCommandCallback,standupRequestCommandCallback, standupListWorkPlaceCommandCallback } = require('./standup-command');

module.exports.register = (app) => {
  app.command('/ping', sampleCommandCallback);
  // app.command('/standup', standupCommandCallback);
  // app.command('/standup-setting', standupSettingCommandCallback);
  // app.command('/standup-request', standupRequestCommandCallback);
  // app.command('/standup-list-work-place', standupListWorkPlaceCommandCallback);
};

