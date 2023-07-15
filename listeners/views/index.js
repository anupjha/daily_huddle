const { sampleViewCallback } = require('./sample-view');
const { newTaskModalCallback } = require('./new-task-modal');
// const {standupViewCallback} = require('./standup-view');

module.exports.register = (app) => {
  app.view('sample_view_id', sampleViewCallback);
  app.view('new-task-modal', newTaskModalCallback);
  // app.view('standup',standupViewCallback )
};
