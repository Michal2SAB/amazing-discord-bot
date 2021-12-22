// Command to convert rgb color to hex or hex color to rgb.

module.exports = function (msg, color) {
    color = color.toString();

    var isHEX = false;
    var isRGB = false;

    if (color.includes('#')) isHEX = true; else isRGB = true;

    try {
        const Discord = require('discord.js');
        if (isRGB) {
            var r = Number(color.substring(0, 3));
            var g = Number(color.substring(3, 6));
            var b = Number(color.substring(6, 9));
            var hex = '#'+ctToHex(r)+ctToHex(g)+ctToHex(b);
            hex = hex.toUpperCase();

            const embed = new Discord.MessageEmbed()
            embed.setTitle(color+"'s HEX value")
            embed.setURL('https://www.color-hex.com/color/'+hex.substring(1))
            embed.setColor(hex)
            embed.setDescription(hex);
            
            msg.channel.send(embed);
        } else {
            var daTrick = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
            var rgb = parseInt(daTrick[1], 16).toString()+', '+parseInt(daTrick[2], 16).toString()+', '+parseInt(daTrick[3], 16).toString();

            const embed = new Discord.MessageEmbed()
            embed.setTitle(color+"'s RGB value")
            embed.setURL('https://www.color-hex.com/color/'+color.substring(1))
            embed.setColor(color)
            embed.setDescription(rgb);
            
            msg.channel.send(embed);
        }
    } catch (err) {
        if (err.name == 'TypeError') {
            msg.reply("Wrong color format. Hex: #FF0000 and RGB: 255255255");
        } else {
            console.log(err);
        }
    }
};

function ctToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
