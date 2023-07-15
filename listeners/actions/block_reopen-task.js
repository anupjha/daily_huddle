const { Task } = require('../../database/db');
const { reloadAppHome } = require('../../utils');

const reopenTaskCallback = async ({ ack, action, client, body }) => {
  await ack();
  Task.update({ status: 'OPEN' }, { where: { id: action.value } });
  await reloadAppHome(client, body.user.id, body.team.id, 'completed');
};

module.exports = {
  reopenTaskCallback,
};
