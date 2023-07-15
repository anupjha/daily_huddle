const { sampleShortcutCallback } = require('./sample-shortcut');
const { messageNewTaskCallback } = require('./message-new-task');
const { globalNewTaskCallback } = require('./global-new-task');

module.exports.register = (app) => {
  app.shortcut('sample_shortcut_id', sampleShortcutCallback);
  app.shortcut('message_new_task', messageNewTaskCallback);
  app.shortcut('global_new_task', globalNewTaskCallback);
};
