const Bot = require('slackbots');
const settings = {
    token: process.env.SLACK_TOKEN,
    name: process.env.SLACK_NAME,
    channel: process.env.SLACK_CHANNEL
};
const { terminate } = require('./utils');

if (!settings.token) {
    terminate('Please add your slack token as \'SLACK_TOKEN\' environment variable.');
}
if (!settings.name) {
    terminate('Please add your slack name as \'SLACK_NAME\' environment variable.');
}
if (!settings.channel) {
    terminate('Please specify the channel that you want to broadcast to as \'SLACK_CHANNEL\' environment variable.');
}

const bot = new Bot(settings);
bot.on('start', function () {
    console.log('Started Slack Bot Server!'.bgMagenta);
});

module.exports = {
    bot: bot
};
