const { sampleActionCallback } = require('./sample-action');
const { appHomeNavCompletedCallback } = require('./block_app-home-nav-completed');
const { appHomeNavCreateATaskCallback } = require('./block_app-home-nav-create-a-task');
const { appHomeNavOpenCallback } = require('./block_app-home-nav-open');
const { buttonMarkAsDoneCallback } = require('./block_button-mark-as-done');
const { reopenTaskCallback } = require('./block_reopen-task');
// const {inputStandupCallback, showStandupCallback} = require('./standup-action')

const { openTaskCheckboxClickedCallback } = require('./block_open_task_list_home');

module.exports.register = (app) => {
  app.action('sample_action_id', sampleActionCallback);
  app.action(
    { action_id: 'app-home-nav-completed', type: 'block_actions' },
    appHomeNavCompletedCallback,
  );
  app.action('app-home-nav-create-a-task', appHomeNavCreateATaskCallback);
  app.action(
    { action_id: 'app-home-nav-open', type: 'block_actions' },
    appHomeNavOpenCallback,
  );
  app.action(
    { action_id: 'button-mark-as-done', type: 'block_actions' },
    buttonMarkAsDoneCallback,
  );
  app.action(
    { action_id: 'reopen-task', type: 'block_actions' },
    reopenTaskCallback,
  );
  app.action(
    {
      action_id: 'blockOpenTaskCheckboxClicked',
      type: 'block_actions',
    },
    openTaskCheckboxClickedCallback,
  );
  // app.action(
  //   { callback_id: 'input_standup' , type: 'block_actions' },
  //   inputStandupCallback,
  // );
  // app.action(
  //   { action_id: 'show_standup_modal', type: 'block_actions' },
  //   showStandupCallback,
  // );
};
