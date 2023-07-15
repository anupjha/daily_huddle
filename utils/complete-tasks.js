const { getAssignedTasks } = require('../database/db');

module.exports = async (taskIDs, slackUserID, client) => {
  // Find why?
  //Task.update({ status: 'CLOSED' }, { where: { id: taskIDs } });
  // Find all the tasks provided where we have a scheduled message ID
  const tasksFromDB = getAssignedTasks;
  // If a reminder is scheduled, cancel it and remove the ID from the datastore
  tasksFromDB.map(async (task) => {
    if (task.scheduledMessageId) {
      try {
        await client.chat.deleteScheduledMessage({
          channel: slackUserID,
          scheduled_message_id: task.scheduledMessageId,
        });
        //Task.update({ scheduledMessageId: null }, { where: { id: task.id } });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  });
};
