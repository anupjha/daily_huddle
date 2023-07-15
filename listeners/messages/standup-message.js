import { sendStandupRequestMessage } from './../../ui/messages';

const standupRequestMessageCallback = async (args) => {
  const { context } = args;
  const message = args.message;

  switch (message.text) {
    case '/standup-request':
      await sendStandupRequestMessage(
        {
          channelId: message.channel,
          userId: message.bot_id,
        },
        context
      );
      break;
  }
};

module.exports = { standupRequestMessageCallback };