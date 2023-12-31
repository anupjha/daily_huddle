const { App, LogLevel } = require('@slack/bolt');
const { registerListeners } = require('./listeners');
const {saveInstallation,findInstallation, deleteInstallation} = require('./database/db');
const customRoutes = require('./utils/custom_routes');

const app = new App({
  logLevel: LogLevel.DEBUG,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: 'horea-is-a-human',
  customRoutes: customRoutes.customRoutes,
  installerOptions: {
    stateVerification: false,
  },
  installationStore: {
    storeInstallation: async (installation) => {
      if (
        installation.isEnterpriseInstall
        && installation.enterprise !== undefined
      ) {
        return saveInstallation(installation);
      }
      if (installation.team !== undefined) {
        return saveInstallation(installation);
      }
      throw new Error('Failed saving installation data to installationStore');
    },
    fetchInstallation: async (installQuery) => {
      if (
        installQuery.isEnterpriseInstall
        && installQuery.enterpriseId !== undefined
      ) {
        return findInstallation(installQuery.enterpriseId);
      }
      if (installQuery.teamId !== undefined) {
        return findInstallation(installQuery.teamId);
      }
      throw new Error('Failed fetching installation');
    },
    deleteInstallation: async (installQuery) => {
      // Bolt will pass your handler  an installQuery object
      // Change the lines below so they delete from your database
      if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
        // org wide app installation deletion
        return deleteInstallation(installQuery.enterpriseId);
      }
      if (installQuery.teamId !== undefined) {
        // single team app installation deletion
        return deleteInstallation(installQuery.teamId);
      }
      throw new Error('Failed to delete installation');
    },
  },
});

/** Register Listeners */
registerListeners(app);

/** Start Bolt App */
(async () => {
  try {
    await app.start(process.env.PORT || 3000);
    console.log('⚡️ Bolt app is running! ⚡️');
  } catch (error) {
    console.error('Unable to start App', error);
  }
})();