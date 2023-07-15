import dayjs from 'dayjs';
// import {Setting} from './../../database/db';


const standupViewCallback = async ({ ack, body, view, context }) => {
  await ack();

  const MAX_TEXT_SIZE = 3000;
  const teamId = view.team_id;
  const workspace = await Workspace.read(teamId);
  const tzOffset = workspace.tzOffset || 0;
  const postDate = dayjs().add(tzOffset, 'second').startOf('day').toJSON();

  const values = view['state']['values'];
  const status =
    values['standup_status']['select'].selected_option?.value ?? '';
  const lastTimeTodo = values['standup_last_time_todo']['input'].value ?? '';
  const todayTodo = values['standup_today_todo']['input'].value ?? '';
  const trouble = values['standup_trouble']['input'].value ?? null;
  const goodPoint = values['standup_good_point']['input'].value ?? null;
  const workPlace =
    values['standup_work_place']['select'].selected_option?.value ?? null;
  const information = values['standup_information']['input'].value ?? null;
  const userId = body.user.id;
  const userName = body.user.name;
  const isUpdate = view.submit.text === 'Update';

  const setting = await Setting.read(teamId);
  if (!setting) {
    try {
      await app.client.chat.postEphemeral({
        token: context.botToken,
        user: userId,
        channel: userId,
        text: 'setting not found. please input "/standup-setting" in advance',
      });
    } catch (error) {
      console.error(JSON.stringify(error));
    }
    return;
  }

  const userProfile = (await app.client.users.profile.get({
    token: context.botToken,
    user: userId,
  }));

  const blockTexts = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: ['*Status？*', `${status}\n`].join('\n'),
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: ['*Yesterday？*', `${lastTimeTodo}\n`]
          .join('\n')
          .substring(0, MAX_TEXT_SIZE),
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: ['*Today ？*', `${todayTodo}\n`]
          .join('\n')
          .substring(0, MAX_TEXT_SIZE),
      },
    },
  ];
  if (trouble) {
    blockTexts.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: ['*Blocker？*', `${trouble}\n`]
          .join('\n')
          .substring(0, MAX_TEXT_SIZE),
      },
    });
  }

  }


  let messageArguments = {
    token: context.botToken,
    channel: setting.broadcastChannel,
    text: '',
    blocks: [
      {
        type: 'divider',
      },
      {
        type: 'context',
        elements: [
          {
            type: 'image',
            image_url: userProfile.profile.image_192,
            alt_text: userName,
          },
          {
            type: 'mrkdwn',
            text: `${userName}'s daily standup`,
          },
        ],
      },
      ...blockTexts,
    ],
  };

  try {
    let result;
    if (isUpdate) {
      //const latestStandup = await Standup.read(teamId, userId);
      const updateMessageArguments = {
        ...messageArguments,
        ...{ ts: latestStandup.ts },
      };

      //result = (await app.client.chat.update(
        updateMessageArguments
      ));
    } else {
      result = (await app.client.chat.postMessage(
        messageArguments
      ));
    }

    const { ts } = result;
    // TODO: stock standupInfo
    const standupInfo = {
      postDate,
      status,
      lastTimeTodo,
      todayTodo,
      trouble,
      goodPoint,
      workPlace,
      information,
      ts,
    };
    await Standup.add({
      teamId,
      userId,
      userName,
      standupInfo,
    });
  } catch (error) {
    await app.client.chat
      .postEphemeral({
        token: context.botToken,
        user: userId,
        channel: userId,
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
});

app.view('standup_setting', async ({ ack, body, view, context }) => {
  await ack();

  const teamId: string = view.team_id;
  const broadcastChannel =
    view['state']['values']['setting_broadcast_channel_input']['channel']
      .selected_channel ?? '';
  const reminderText =
    view['state']['values']['setting_reminder_input']['reminder_input'].value ??
    '';

  const settingInfo = {
    broadcastChannel,
    reminderText,
  };
  const user = body.user.id;

  const results = await Setting.add({ teamId, settingInfo });

  let msg = '';
  if (results) {
    msg = 'Setting was updated';
  } else {
    msg = 'There was an error with your submission';
  }

  try {
    await app.client.chat.postMessage({
      token: context.botToken,
      channel: user,
      text: msg,
    });
  } catch (error) {
    console.error(JSON.stringify(error));
  }
});


