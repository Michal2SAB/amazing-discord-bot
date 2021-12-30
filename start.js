// this is the main code that will get the bot logged in, setup, etc.

const { Client } = require('discord.js');
const client = new Client();

module.exports = {
    client: client
};

const config = require('./config.json');
const CMDHandler = require('./cmdhandler.js');

client.on('ready', () => {
    client.user.setActivity(config.activity, { type: config.activityType });
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', CMDHandler);

client.login(process.env.bot_token); // or config.token if running locally.
