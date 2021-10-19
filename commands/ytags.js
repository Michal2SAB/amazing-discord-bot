// command to copy/paste all tags from any youtube video out there.

const ytags = require('youtube-tags');

module.exports = async function (msg, link) {
    const code = link[0].split("?v=")[1];
    const tags = await ytags.getYoutubeTags(code);

    const Discord = require('discord.js');
    const embed = new Discord.MessageEmbed()
    .setTitle("Your Youtube Tags")
    .setURL(link[0])
    .setAuthor("Michal2SAB", "https://avatars.githubusercontent.com/u/38110165", "https://github.com/michal2sab")
    .setColor("#FF0000")
    .setDescription(tags.toString());

    msg.channel.send(embed);
};
