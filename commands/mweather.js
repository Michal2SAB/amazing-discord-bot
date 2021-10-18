// Command for getting latest Mars Weather update from NASA's new Perseverence Rover.

latestTweets = require('latest-tweets');

module.exports = function (msg) {
    latestTweets('marswxreport', function (err, tweets) {
        if(!tweets[0].content.includes("high")) {
            if(!tweets[1].content.includes("high")) {
                replyMessage(msg, tweets[2].content);
            } else {
                replyMessage(msg, tweets[1].content);
            }
        } else {
            replyMessage(msg, tweets[0].content);
        }
    });

    function replyMessage(msg, content) {
        if(!content.includes("high")) {
            msg.reply("No recent weather updates.");
        } else {
            var parts = content.split(',');
            var title = parts[0] + "," + parts[1];
            var hTemp = parts[2].substring(5);
            var lTemp = parts[3].substring(5);
            var pressure = parts[4].substring(9);
            var daylight = parts[5].substring(9, 27);
            var daylight1 = daylight.replace("-", " - ");
            var imgLink = parts[5].substring(27);
            
            const Discord = require('discord.js');
            const embed = new Discord.MessageEmbed()
            .setTitle('Latest Weather Report From The Perseverance Rover')
            .setURL('https://' + imgLink)
            .setAuthor('MarsWxReport', 'https://pbs.twimg.com/profile_images/2552209293/220px-Mars_atmosphere_400x400.jpg', 'https://twitter.com/MarsWxReport')
            .setDescription(title)
            .addFields(
                { name: 'Highest Temperature', value: hTemp, inline: true },
                { name: 'Lowest Temperature', value: lTemp, inline: true },
                { name: 'Pressure', value: pressure, inline: false },
                { name: 'Daylight Time', value: daylight1, inline: false }
            );

            msg.reply(embed);
        }
    };
};
