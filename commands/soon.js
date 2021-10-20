// fun command to predict the price of bitcoin in a period of time (max 1 week) & earn win or loss for good or bad prediction when date comes.

const preds = require('../preds/db.json');

module.exports = function (msg, args) {
    const pred = args[0];
    const extraArg = args[1];
    const user = msg.author.username;

    if (pred != 'stats') {
        if (!preds[user]) {
            var dateObj = new Date();
            var day = dateObj.getUTCDate();
            if (extraArg - day > 7) {
                msg.reply("Fail! Your pred expiration can't be longer than 1 week (7 days).");
            } else {
                // finish this later here, write predictions to the json file, check bitcoin's real time price and add win or loss to user stats.
                msg.reply(`Success! Your prediction has been added. You will be notified of the score in ${extraArg - day} days.`);
            }
        } else {
            msg.reply("You already have a prediction!");
        }
    } else {
        var statuser = user;

        if (extraArg) statuser = extraArg;

        if (preds[statuser]) {
            const wins = preds[statuser].wins;
            const losses = preds[statuser].losses;

            const Discord = require('discord.js');
            const embed = new Discord.MessageEmbed()
            embed.setTitle(statuser + "'s pred stats")
            embed.setDescription("Bitcoin prediction score for " + statuser)
            embed.addFields(
                { name: 'Wins', value: wins, inline: true},
                { name: 'Losses', value: losses, inline: true}
            );

            msg.channel.send(embed);
        } else {
            msg.channel.send(`'${statuser}' doesn't exist in preds database.`);
        }
    }
};
