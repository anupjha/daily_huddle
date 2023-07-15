const { findOrCreateUser, saveTask } = require('../../database/db');
const { modals } = require('../../ui');
const { reloadAppHome } = require('../../utils');

const newTaskModalCallback = async ({ ack, view, body, client }) => {
  const providedValues = view.state.values;
  const taskTitle = providedValues.taskTitle.taskTitle.value;
  const selectedDate = providedValues.taskDueDate.taskDueDate.selected_date;
  const selectedTime = providedValues.taskDueTime.taskDueTime.selected_time;
  const selectedUser = providedValues.taskAssignUser.taskAssignUser.selected_user;

  if (selectedDate) {
    if (!selectedTime) {
      await ack({
        response_action: 'errors',
        errors: {
          taskDueTime: "Please set a time for the date you've chosen",
        },
      });
      return;
    }
  }
  const task = { };
  try {
    // Grab the creating user from the DB
    const queryResult = await findOrCreateUser(body.user.id,body.team.id);
    const user = queryResult;

    // Grab the assignee user from the DB
    const querySelectedUser = await findOrCreateUser(selectedUser,body.team.id);
    const selectedUserObject = querySelectedUser;

    // Persist what we know about the task so far
    task.title = taskTitle;
    task.status = 'TODO';
    task.dueDate = new Date(`${selectedDate}T${selectedTime}`);
    task.creator = user.slackUserId;
    task.currentAssignee = selectedUserObject.slackUserId;
    // Save Task here
    saveTask(task);
    await ack({
      response_action: 'update',
      view: modals.taskCreated(taskTitle),
    });
    if (selectedUser !== body.user.id) {
      await client.chat.postMessage({
        channel: selectedUser,
        text: `<@${body.user.id}> assigned you a new task:\n- *${taskTitle}*`,
      });
      await reloadAppHome(client, selectedUser, body.team.id);
    }

    await reloadAppHome(client, body.user.id, body.team.id);
  } catch (error) {
    await ack({
      response_action: 'update',
      view: modals.taskCreationError(taskTitle),
    });
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

module.exports = { newTaskModalCallback };
