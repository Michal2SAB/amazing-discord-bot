// Command to get one of the most recent mars photos taken by either the new Perseverance Rover or Curiosity.

const fetch2 = require("node-fetch");

const api_key = process.env.nasa_api_key; // or config.nasa_api_key if running locally

module.exports = async function (msg) {
    const rovers = ["perseverance", "curiosity"];
    const rover = rovers[Math.floor(Math.random() * rovers.length)];

    const api_url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${api_key}`;
    const settings = { method: "Get" };

    var whatRover = "Perseverance";
    if (rover != "perseverance") whatRover = "Curiosity";

    await fetch2(api_url, settings)
    .then(res => res.json())
    .then(json => {
        const dicts = json.latest_photos;
        const latestDict = dicts[Math.floor(Math.random() * dicts.length)];

        const cameraName = latestDict.camera.full_name;
        const theImg = latestDict.img_src;
        const earthDate = latestDict.earth_date;
        const marsDay = latestDict.sol;

        const Discord = require('discord.js');
        embed = new Discord.MessageEmbed();

        embed.setColor('#fc0303')
        embed.setTitle(`Recent Mars Pic From the ${whatRover} Rover`)
        embed.setURL(theImg)
        embed.setDescription(`A recent picture of Mars taken by the ${whatRover} Rover.`)
        embed.setAuthor('NASA')
        embed.setImage(theImg)
        embed.addFields(
            { name: 'Mars Day (Sol)', value: marsDay, inline: true },
            { name: 'Earth Date', value: earthDate, inline: true }
        );

        msg.channel.send(embed);
    })
    .catch(error => {
        console.log(error);
    })
};
