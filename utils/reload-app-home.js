const {
  openTasksView,
  completedTasksView,
} = require('../ui/app-home');
const { getAssignedTasks } = require('../database/db');

module.exports = async (client, slackUserID, slackWorkspaceID, navTab) => {

  try {
    const queryResult = await getAssignedTasks(slackUserID);
    const tasks = queryResult;

    if (navTab === 'completed') {
      const recentlyCompletedTasks = tasks.filter((t) => t.status == 'DONE')
      console.log("recentlyCompletedTasks", recentlyCompletedTasks);
      await client.views.publish({
        user_id: slackUserID,
        view: completedTasksView(recentlyCompletedTasks),
      });
      return;
    }

    const openTasks =  tasks.filter((t)=> t.status=='TODO');
    console.log("openTasks", openTasks);
    await client.views.publish({
      user_id: slackUserID,
      view: openTasksView(openTasks),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};
