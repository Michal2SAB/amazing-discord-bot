const client = require("../start.js").client;
const config = require('../config.json');

module.exports = function (msg, title) {
    if(msg.author.id === process.env.admin_id) {
        client.user.setActivity(title.toString().replace(',', ' '), { type: config.activityType });
    } else {
        msg.channel.send("Only Michal can use this command, cry.");
    }
};
