const sampleCommandCallback = async ({ ack, respond }) => {
  try {
    await ack();
    await respond('It works! 🎉🎉🎉');
  } catch (error) {
    console.error(error);
  }
};

module.exports = { sampleCommandCallback };
