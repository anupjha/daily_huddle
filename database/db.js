const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
// Covert Strings to Arrays
//const animalArr = [...animalStr]
const saveInstallation = async (installation) => {
  try {
    //console.log('First time installation: ' + installation);
    const result = await prisma.installation.upsert({
      where: {
        teamId: installation.team.id,
      },
      update: {},
      create: {
        teamId: installation.team.id,
        teamName: installation.team.name,
        enterpriseId: installation.enterprise?.id || null,
        enterpriseName: installation.enterprise?.name || null,
        userId: installation.user.id,
        userToken: installation.user.token || null,
        userScopes: installation.user.scopes?.toString() || null,
        botId: installation.bot.id,
        botToken: installation.bot.token,
        botUserId: installation.bot.userId,
        botScopes: installation.bot.scopes?.toString(),
        appId: installation.appId,
        authVersion: installation.authVersion,
        isEnterpriseInstall: installation.isEnterpriseInstall,
        tokenType: installation.tokenType,
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const findInstallation = async (id) => {
  try {
    const installationObj = {};
    const result = await prisma.installation.findFirst({
      where: {
        OR: [
          { teamId: id },
          { enterpriseId: id },
        ],
      },
    });
    const team = {};
    team.id = result.teamId;
    team.name = result.teamName;
    const user = {};
    user.token = result.userToken;
    user.id = result.userId;
    user.scopes = result.userScopes;
    const bot = {};
    bot.id = result.botId;
    bot.token = result.botToken;
    bot.userId = result.botUserId;
    bot.scopes = result.botScopes;
    installationObj.team = team;
    installationObj.user = user;
    installationObj.bot = bot;
    installationObj.enterprise = result.enterprise;
    installationObj.tokenType = result.tokenType;
    installationObj.isEnterpriseInstall =result.isEnterpriseInstall ;
    installationObj.appId =result.appId ;
    installationObj.authVersion = result.authVersion;
    // console.log('Already installed: ' + installationObj);
    return installationObj;
  } catch (error) {
    console.error(error);
  }
  return false;
};

const deleteInstallation = async (id) => {
  try {
    const result = await prisma.installation.delete({
      where: {
        OR: [
          { teamId: Number(id) },
          { enterpriseId: Number(id) },
        ],
      },
    });
    return result;
  } catch (error) {
    console.error(error);
  }
  return false;
};

// Find or Create User
const findOrCreateUser = async (userId, teamId) => {
  try {
    const upsertUser = await prisma.user.upsert({
      where: {
        slackUserId: userId,
      },
      update: {},
      create: {
        slackUserId: userId,
        slackWorkspaceId: teamId,
      },
    });
    return upsertUser;
  } catch (error) {
    console.error(error);
  }
};

// Create task
const saveTask = async (task) => {
  try {
    const result = await prisma.task.create({
      data: task,
    });
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const getAssignedTasks = async (userId) => {
  try {

    const tasks = await prisma.task.findMany({
      where: { currentAssignee: userId },
    });
    return tasks;
  } catch (error) {
    console.log(error);
  }
};

const updateTask = async(taskId) => {
  try {
    const task = await prisma.task.update({
              where: { id: Number(taskId) },
              data: { scheduledMessageId: null },
          })
  } catch (error) {

  }
}

module.exports = {
  saveInstallation,
  findInstallation,
  deleteInstallation,
  findOrCreateUser,
  saveTask,
  getAssignedTasks,
  updateTask,
};

// //* 1. Fetches all released songs.
//     const songs = await prisma.song.findMany({
//         where: { released: true },
//         include: { singer: true }
//     })


// //* 2. Fetches a specific song by its ID.
//     const song = await prisma.song.findFirst({
//         where: { id: Number(id) },
//     })


// //* 3. Creates a new artist.
//     const result = await prisma.artist.create({
//         data: { ...req.body },
//     })


// //* 4. Creates (or compose) a new song (unreleased)

//     const result = await prisma.song.create({
//         data: {
//             title,
//             content,
//             released: false,
//             singer: { connect: { email: singerEmail } },
//         },
//     })

// //* 5. Sets the released field of a song to true.
//     const song = await prisma.song.update({
//         where: { id: Number(id) },
//         data: { released: true },
//     })


// //* 6. Deletes a song by its ID.
//     const song = await prisma.song.delete({
//         where: { id: Number(id) },
//     })


// //* 7. Fetches all Artist.
//     const artists = await prisma.artist.findMany()


