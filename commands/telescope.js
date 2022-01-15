// Command to get the most recent news about the new James Webb telescope about to launch to space.

const puppeteer = require('puppeteer');

module.exports = async function (msg, arg) {
    if (arg.toString() === "info") {
        try {
            const url = "https://webb.nasa.gov/content/webbLaunch/whereIsWebb.html";
            const browser = await puppeteer.launch({
                args: ["--proxy-server='direct://'", '--proxy-bypass-list=*', '--no-sandbox', '--disable-setuid-sandbox'],
                headless: true
            });
            const [page] = await browser.pages();

            await page.goto(url, { waitUntil: 'networkidle0' });

            const timeElapsed = await page.$eval("#launchElapsedTime", te => te.innerText);
            const distanceFrom = await page.$eval("#milesEarth", sp => sp.innerText + " mi");
            const distanceTo = await page.$eval("#milesToL2", sp => sp.innerText + " mi");
            const completed = await page.$eval("#percentageCompleted", sp => sp.innerText + "%");
            const speed = await page.$eval("#speedMi", sp => sp.innerText + " mi/s");
            const status = await page.$eval(".status > a", sp => sp.innerText);
            const description = await page.$eval(".description > p", sp => sp.innerText);
            
            const nasaLogo = "https://github.com/Michal2SAB/DISCORD-NASA-BOT/blob/main/nlogo.png?raw=true";

            const Discord = require('discord.js');
            const embed = new Discord.MessageEmbed()
            embed.setTitle("JWST Position and Status")
            embed.setURL("https://webb.nasa.gov/content/webbLaunch/whereIsWebb.html")
            embed.setAuthor("NASA", nasaLogo, url)
            embed.setThumbnail(nasaLogo)
            embed.setDescription(description)
            embed.addFields(
                { name: 'Time Elapsed', value: timeElapsed, inline: true },
                { name: 'Distance Completed', value: completed, inline: true},
                { name: 'Status', value: status, inline: true},
                { name: 'Distance From Earth', value: distanceFrom, inline: true},
                { name: 'Distance to L2', value: distanceTo, inline: true },
                { name: 'Cruising Speed', value: speed, inline: true },
            );

            msg.channel.send(embed);

            await browser.close();
        } catch (err) {
            console.log(err);
        }
    } else {
        const url = "https://www.jwst.nasa.gov/content/news/index.html";
        try {
            msg.channel.send("Loading NASA's content..")
            const browser = await puppeteer.launch({
                args: ["--proxy-server='direct://'", '--proxy-bypass-list=*', '--no-sandbox', '--disable-setuid-sandbox'],
                headless: true
            });
            const [page] = await browser.pages();

            await page.goto(url, { waitUntil: 'networkidle0' });

            const recentNews = ".ssdStoryLeadPanel > ul > li";

            const date = await page.$eval(recentNews + " .date", li => li.innerText);
            const title = await page.$eval(recentNews + " > h3 > a", a => a.innerText);
            const link = await page.$eval(recentNews + " > h3 > a", a => a.href);
            const content = await page.$eval(recentNews + " > p", p => p.innerText);
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
    }
};
