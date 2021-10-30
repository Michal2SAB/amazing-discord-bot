const puppeteer = require('puppeteer');
const fs = require('fs');

module.exports = async function (msg) {
    const url = "https://mars.nasa.gov/news/";

    try {
      
        msg.channel.send("Loading NASA's content..")
      
        const browser = await puppeteer.launch({
            args: ["--proxy-server='direct://'", '--proxy-bypass-list=*'],
            headless: true
        });
        const [page] = await browser.pages();

        await page.goto(url, { waitUntil: 'networkidle0' });
        let data = await page.$eval("ul.item_list > li.slide", li => li.innerText);
        data = data.split("\n");

        const date = data[0];
        const title = data[1];
        const info = data[2];
        const link = await page.$eval("ul.item_list > li.slide > div > a", a => a.href);
        const nasaLogo = "https://github.com/Michal2SAB/DISCORD-NASA-BOT/blob/main/nlogo.png?raw=true";

        const Discord = require('discord.js');
        const embed = new Discord.MessageEmbed()
        embed.setTitle(title)
        embed.setURL(link)
        embed.setAuthor("NASA", nasaLogo, url)
        embed.setThumbnail(nasaLogo)
        embed.setDescription(info)
        embed.addFields(
            { name: 'Date', value: date },
        );

        msg.channel.send(embed);
        await browser.close();
      
    } catch (err) {
        console.error(err);
    }
};
