// Command to get the most recent news about the new James Webb telescope about to launch to space.

const puppeteer = require('puppeteer');

module.exports = async function (msg) {
    const url = "https://www.jwst.nasa.gov/content/news/index.html";
    try {
        msg.channel.send("Loading NASA's content..")
        const browser = await puppeteer.launch({
            args: ["--proxy-server='direct://'", '--proxy-bypass-list=*'],
            headless: true
        });
        const [page] = await browser.pages();

        await page.goto(url, { waitUntil: 'networkidle0' });

        const recentNews = ".ssdStoryLeadPanel";

        const date = await page.$eval(recentNews + " > ul > li .date", li => li.innerText);
        const title = await page.$eval(recentNews + " > ul > li > h3 > a", a => a.innerText);
        const link = await page.$eval(recentNews + "> ul > li > h3 > a", a => a.href);
        const content = await page.$eval(recentNews + " > ul > li > p", p => p.innerText);
        const nasaLogo = "https://github.com/Michal2SAB/DISCORD-NASA-BOT/blob/main/nlogo.png?raw=true";

        const Discord = require('discord.js');
        const embed = new Discord.MessageEmbed()
        embed.setTitle(title)
        embed.setURL(link)
        embed.setAuthor("NASA", nasaLogo, url)
        embed.setThumbnail(nasaLogo)
        embed.setDescription(content)
        embed.addFields(
            { name: 'Date', value: date },
        );

        msg.channel.send(embed);

        await browser.close();
    } catch (err) {
        console.error(err);
    }
};
