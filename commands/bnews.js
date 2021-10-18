// Command to get the newest post from the bitcoin subreddit.

const fetch2 = require("node-fetch");

module.exports = async function (msg) {
    let url = "http://www.reddit.com/r/bitcoin/new/.json?limit=1";
    let settings = { method: "Get" };
    const Discord = require('discord.js');
    embed = new Discord.MessageEmbed();
    let author = "";
    let link = "";
    let moreText = "";
    let text = "";

    await fetch2(url, settings)
    .then(res => res.json())
    .then(json => {
        let data = json['data']['children'][0]['data'];
        let title = data['title'];
        text = data['selftext'];
        
        if (text.length > 2048) {
            text = text.substring(0, 2048);
            moreText = text.substring(2048);
        }
        link = data['url'];
        author = data['author'];
        let permaLink = data['permalink'];

        if(text === '') {
            text = data['url'];
        }

        embed.setColor('#ff5500')
        embed.setTitle(title)
        embed.setDescription(text)
        embed.setURL('https://www.reddit.com' + permaLink);
    })
    .catch(error => {
        console.log("error");
    })
    getAuthorImg(embed, author, msg, moreText, link, text);
};

async function getAuthorImg(embed, name, message, moreText, link, text) {
    let url = `https://www.reddit.com/user/${name}/about.json`;
    let settings = { method: "Get" };

    await fetch2(url, settings)
    .then(res => res.json())
    .then(json => {
        let img = json['data']['subreddit']['icon_img'].split("?width")[0];
        embed.setAuthor(name, img);
    })
    .catch(error => {
        console.log(error);
    })
    if (moreText != '') {
        newEmbed = new Discord.MessageEmbed()
        .setColor('#ff5500')
        .setDescription(moreText);

        if( link != '' && !link.includes('reddit.com/r/Bitcoin/comments/') && link != text ) {
            newEmbed.addField("Attached Link", link)
            message.reply(embed);
            message.reply(newEmbed);
        }
    } else {
        if( link != '' && !link.includes('reddit.com/r/Bitcoin/comments/') && link != text ) {
            embed.addField("Attached Link", link)
        }
        message.reply(embed);
    }
};
