import app from '~/slackapp/app';
import Standup from '~/models/standup';
import Setting from '~/models/setting';
import { getToday } from '~/slackapp/common/date';

export const showStandupModal = async (
  args,
  context
) => {
  try {
    const res = await app.client.views.open({
      token: context.botToken,
      trigger_id: args.triggerId,
      view: {
        type: 'modal',
        callback_id: 'standup',
        title: {
          type: 'plain_text',
          text: 'Daily Standup',
          emoji: true,
        },
        close: {
          type: 'plain_text',
          text: 'Cancel',
          emoji: true,
        },
        blocks: [
          {
            type: 'section',
            text: {
              type: 'plain_text',
              text: ':man-biking: Loading...\n\nIf the loading does not complete after 10 seconds, click the Cancel button and run /standup again.',
            },
          },
        ],
      },
    });

    if (res.error) {
      console.log(res.response_metadata);
      throw Error(res.error);
    }

    const viewId = res.view.id
    const latestStandup = await Standup.read(args.teamId, args.userId);
    const today = await getToday(args.teamId);
    const isUpdate = latestStandup && latestStandup.postDate === today.toJSON();

    await app.client.views.update({
      token: context.botToken,
      view_id: viewId,
      view: {
        type: 'modal',
        callback_id: 'standup',
        title: {
          type: 'plain_text',
          text: 'Daily Standup',
          emoji: true,
        },
        submit: {
          type: 'plain_text',
          text: isUpdate ? 'Update' : 'Submit',
          emoji: true,
        },
        close: {
          type: 'plain_text',
          text: 'Cancel',
          emoji: true,
        },
        blocks: [
          {
            type: 'section',
            text: {
              type: 'plain_text',
              text: `:wave: Hello!\n\n${today.format(
                'MM/DD'
              )} Hello :sunny:`,
              emoji: true,
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'input',
            block_id: 'standup_status',
            label: {
              type: 'plain_text',
              text: ':sunrise: What are you doing today？',
              emoji: true,
            },
            element: {
              type: 'static_select',
              action_id: 'select',
              placeholder: {
                type: 'plain_text',
                text: 'Select an item',
                emoji: true,
              },
              initial_option: isUpdate
                ? {
                    text: {
                      type: 'plain_text',
                      text: latestStandup.status,
                      emoji: true,
                    },
                    value: latestStandup.status,
                  }
                : undefined,
              options: [
                {
                  text: {
                    type: 'plain_text',
                    text: 'adhoc',
                    emoji: true,
                  },
                  value: 'adhoc',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'jira',
                    emoji: true,
                  },
                  value: 'jira',
                },
              ],
            },
          },
          {
            type: 'input',
            block_id: 'standup_last_time_todo',
            label: {
              type: 'plain_text',
              text: ':bee: What you did yesterday？',
              emoji: true,
            },
            element: {
              type: 'plain_text_input',
              action_id: 'input',
              multiline: true,
              initial_value: isUpdate ? latestStandup.lastTimeTodo : undefined,
            },
          },
          {
            type: 'input',
            block_id: 'standup_today_todo',
            label: {
              type: 'plain_text',
              text: ':books: What are you doing today？',
              emoji: true,
            },
            element: {
              type: 'plain_text_input',
              action_id: 'input',
              multiline: true,
              initial_value: isUpdate ? latestStandup.todayTodo : undefined,
            },
          },
          {
            type: 'input',
            block_id: 'standup_trouble',
            label: {
              type: 'plain_text',
              text: ':tractor: Any blocker？',
              emoji: true,
            },
            element: {
              type: 'plain_text_input',
              action_id: 'input',
              multiline: true,
              initial_value: isUpdate ? latestStandup.trouble : undefined,
            },
            optional: true,
          },
        ],
      },
    });
  } catch (error) {
    await app.client.chat
      .postEphemeral({
        token: context.botToken,
        user: args.userId,
        channel: args.userId,
        text: `Sorry, an error has occurred.\n${
          error.data.response_metadata.messages
            ? error.data.response_metadata.messages.join('\n')
            : error.data.error
        }`,
      })
      .catch((err) => {
        console.error(JSON.stringify(err));
      });
    console.error(JSON.stringify(error));
  }
};

export const showSettingModal = async (
  args,
  context
) => {
  const userInfo = (await app.client.users.info({
    token: context.botToken,
    user: args.userId,
  }));

  if (!userInfo.user.is_admin) {
    args.say(`<@${args.userId}> Sorry. This command is for admin only.`);
    return;
  }

  const setting = await Setting.read(args.teamId);
  const broadcastChannel =
    setting && setting.broadcastChannel ? setting.broadcastChannel : undefined;
  const reminderText =
    setting && setting.reminderText
      ? setting.reminderText
      : '/remind #channel @here It is time for daily stand-up(/standup) every Weekday at 10:00';

  try {
    await app.client.views.open({
      token: context.botToken,
      trigger_id: args.triggerId,
      view: {
        type: 'modal',
        callback_id: 'standup_setting',
        title: {
          type: 'plain_text',
          text: 'Standup App Settings',
          emoji: true,
        },
        submit: {
          type: 'plain_text',
          text: 'Submit',
          emoji: true,
        },
        close: {
          type: 'plain_text',
          text: 'Cancel',
          emoji: true,
        },
        blocks: [
          {
            type: 'input',
            block_id: 'setting_broadcast_channel_input',
            element: {
              type: 'channels_select',
              action_id: 'channel',
              placeholder: {
                type: 'plain_text',
                text: 'Select a channel',
                emoji: true,
              },
              initial_channel: broadcastChannel,
            },
            label: {
              type: 'plain_text',
              text: 'Broadcast Channel',
              emoji: true,
            },
          },
          {
            type: 'input',
            block_id: 'setting_invite_input',
            element: {
              type: 'plain_text_input',
              action_id: 'invite_input',
              initial_value: '/invite @standup',
            },
            label: {
              type: 'plain_text',
              text: 'Invite bot',
              emoji: true,
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: 'Please input this command in your broadcast channel.',
              },
            ],
          },
          {
            type: 'input',
            block_id: 'setting_reminder_input',
            element: {
              type: 'plain_text_input',
              action_id: 'reminder_input',
              initial_value: reminderText,
            },
            label: {
              type: 'plain_text',
              text: 'Reminder',
              emoji: true,
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: 'Please edit the above reminder settings and post to your slack team.\nRefer to the following for how to write a reminder.\nhttps://slack.com/help/articles/208423427-Set-a-reminder',
              },
            ],
          },
        ],
      },
    });
  } catch (error) {
    await app.client.chat
      .postEphemeral({
        token: context.botToken,
        user: args.userId,
        channel: args.userId,
        text: `Sorry, an error has occurred.\n${
          error.data.response_metadata.messages
            ? error.data.response_metadata.messages.join('\n')
            : error.data.error
        }`,
      })
      .catch((err) => {
        console.error(JSON.stringify(err));
      });
    console.error(JSON.stringify(error));
  }
};
