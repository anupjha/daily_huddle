import { showStandupModal } from './../../ui/modals';

// from Interactive Components
const inputStandupCallback = async ({ ack, body, context }) => {
  await ack();

  const action = body;
  await showStandupModal(
    {
      userId: action.user.id,
      teamId: action.team?.id ?? '',
      triggerId: action.trigger_id,
    },
    context
  );
};

// from command
const showStandupCallback = async ({ ack, body, context }) => {
  await ack();

  const blockAction = body;
  await showStandupModal(
    {
      userId: blockAction.user.id,
      teamId: blockAction.team?.id ?? '',
      triggerId: blockAction.trigger_id,
    },
    context
  );
};

module.exports = {
  inputStandupCallback,
  showStandupCallback
};


