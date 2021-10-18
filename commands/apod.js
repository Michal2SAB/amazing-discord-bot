// Command to get the Astronomy Picture of The Day, using NASA's official api and api key (free and easy to obtain)

const fetch2 = require("node-fetch");

module.exports = async function (msg, date) {
    if(date == 'random') {
        start = new Date(1995, 5, 16)
        end = new Date()

        date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        date = date.toLocaleDateString("nl", {year:"numeric", month:"2-digit", day:"2-digit"});
    }

    const api_key = process.env.nasa_api_key; // or config.nasa_api_key if running locally
    const api_url = `https://api.nasa.gov/planetary/apod?api_key=${api_key}&date=${date}&hd=True`;
    const settings = { method: "Get" };
    
    await fetch2(api_url, settings)
    .then(res => res.json())
    .then(json => {
        var theDate = json.date;
        var theDesc = json.explanation;
        var theTitle = json.title;
        var hdUrl = json.hdurl;
        var copyright = '';

        if(json.copyright) {
            copyright = json.copyright;
            copyright = copyright.replace('\n', '');
        }

        const Discord = require('discord.js');
        embed = new Discord.MessageEmbed();
        embed.setColor('#fc0303')
        embed.setTitle(theTitle)
        embed.setURL(hdUrl)
        embed.setAuthor('Copyright: ' + copyright)
        embed.setImage(hdUrl)
        embed.setDescription(theDesc)
        embed.setFooter("Astronomy Picture of The Day | " + theDate);

        msg.reply(embed);

    })
    .catch(error => {
        console.log(error);
    })
};
