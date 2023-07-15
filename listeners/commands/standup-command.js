import { showStandupModal, showSettingModal } from './../../ui/modals';
import {
  sendStandupRequestMessage,
  sendListWorkPlaceMessage,
} from './../../ui/messages';

const standupCommandCallback = async ({ ack, payload, context }) => {
  await ack();

  await showStandupModal(
    {
      userId: payload.user_id,
      teamId: payload.team_id,
      triggerId: payload.trigger_id,
    },
    context
  );
};

const standupSettingCommandCallback =  async ({ ack, payload, context, say }) => {
  await ack();

  await showSettingModal(
    {
      userId: payload.user_id,
      teamId: payload.team_id,
      triggerId: payload.trigger_id,
      say,
    },
    context
  );
};

const standupRequestCommandCallback = async ({ ack, payload, context }) => {
  await ack();

  await sendStandupRequestMessage(
    {
      channelId: payload.channel_id,
      userId: payload.user_id,
    },
    context
  );
};

const standupListWorkPlaceCommandCallback =  async ({ ack, payload, context, say }) => {
    await ack();

    await sendListWorkPlaceMessage(
      {
        userId: payload.user_id,
        teamId: payload.team_id,
        say,
      },
      context
    );
  };

  module.exports = { standupCommandCallback, standupSettingCommandCallback, standupRequestCommandCallback, standupListWorkPlaceCommandCallback };
