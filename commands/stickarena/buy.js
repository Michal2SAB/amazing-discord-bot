const sabot = require('../../tools/sabot.js');

let Spinners = {'oldskool': '100', 'spiral': '101', 'neon': '102', 'radioactive': '103',
'skulls': '104',  'minimalist': '105', 'retro':  '106', 'buttercup': '107', 'thehex': '108', 'yinyang': '109',
'revolution': '110', 'wrongway': '111', 'vinyl': '112', 'razorblades': '113', 'hollywood': '114', 'rebel': '115', 
'chance': '116', 'thepro': '117', 'omega': '118', 'biohazard': '119', 'triskelion': '120', '1337': '121', 'glint': '122', 
'theplague': '123', 'roflmao': '124', 'brainwash': '125', 'shuriken': '126', '4thdimensions': '127', 'affluenza': '128', 
'dabomb': '129', 'the8bit': '130', 'flux': '131', 'theofficer': '132', 'solar': '133', 'ouroboros': '134', 'stealth': '135',
'bullettime': '136', 'baller': '137', 'wakkawakka': '138', 'gearsofgore': '139', 'pyro': '140', 'assassin': '141', 'globe': '142',
'galaxy': '143', 'teabag': '144', 'canttouchthis': '145', 'fireworks': '146', 'jaws': '147', 'plop': '148', 'dimspinner1': '149',
'dimspinner2': '150', 'fakeassassin': '151'}

let SpinnersCost = {'oldskool': '120', 'spiral': '130', 'neon': '370', 'radioactive': '990',
'skulls': '350',  'minimalist': '420', 'retro': '500', 'buttercup': '540', 'thehex': '660', 'yinyang': '710',
'revolution': '775', 'wrongway': '850', 'vinyl': '980', 'razorblades': '1500', 'hollywood': '3300', 'rebel': '4100', 
'chance': '6500', 'thepro': '9001', 'omega': '2500', 'biohazard': '5200', 'triskelion': '2700', '1337': '1337', 'glint': '5350', 
'theplague': '6800', 'roflmao': '1700', 'brainwash': '910', 'shuriken': '2350', '4thdimensions': '1259', 'affluenza': '15000', 
'dabomb': '1850', 'the8bit': '2925', 'flux': '3900', 'theofficer': '625', 'solar': '3450', 'ouroboros': '4600', 'stealth': '12000',
'bullettime': '4000', 'baller': '2600', 'wakkawakka': '4800', 'gearsofgore': '3200', 'pyro': '6000', 'assassin': '24000', 'globe': '880',
'galaxy': '3400', 'teabag': '4600', 'canttouchthis': '5800', 'fireworks': '3750', 'jaws': '3330', 'plop': '1450', 'dimspinner1': '8800',
'dimspinner2': '7600', 'fakeassassin': '2200'}

module.exports = async function (msg, args) {
    if(args.length < 2) {
        msg.channel.send("Wrong usage, provide user and pass");
    } else {
        let user = args[0];
        let pw = args[1];
        let shelp = "oldskool | spiral | neon | radioactive\n\nskulls | minimalist | retro | buttercup\n\nthehex | yinyang | revolution | wrongway\n\nvinyl | razorblades | hollywood | rebel\n\nchance | thepro | omega | biohazard\n\ntriskelion | 1337 | glint | theplague\n\nroflmao | brainwash | shuriken | 4thdimensions\n\naffluenza | dabomb | the8bit | flux\n\ntheofficer | solar | ouroboros | stealth\n\nbullettime | baller | wakkawakka | gearsofgore\n\npyro | assassin | globe | galaxy\n\nteabag | canttouchthis | fireworks | jaws\n\nplop | dimspinner1 | dimspinner2 | fakeassassin";
        var choice = "";
        let filter = m => m.author.id === msg.author.id
        msg.channel.send("Which spinner? These are you choices: ").then(() => {
        const Discord = require('discord.js');
        embed = new Discord.MessageEmbed();
        embed.setColor('#24262B')
        embed.setTitle(`Spinner Help`)
        embed.setDescription(shelp);

        msg.channel.send(embed);
        msg.channel.awaitMessages(filter, {
            max: 1,
            time: 30000,
            errors: ['time']
            })
            .then(message => {
            message = message.first()
            if (message.content in Spinners) {
                choice = message.content;
                msg.channel.send("What color? Give inner and outer (RGB RGB)").then(() => {
                    msg.channel.awaitMessages(filter, {
                        max: 1,
                        time: 30000,
                        errors: ['time']
                        })
                        .then(async function(message) {
                        message = message.first()
                        message.content = message.content.split(" ");
                        if(message.content.length != 2) {
                            console.log(message.content)
                            msg.channel.send("Wrong color format, RGB RGB is correct.");
                        } else {                
                            let illegal = verify(message.content[0], message.content[1]);
                            if(illegal) {
                                msg.channel.send(illegal);
                            } else {
                                const a = new sabot();
                                await a.connectToServer(user, pw, 'ballistick6.xgenstudios.com', 1138);
                                if (a.banned) {
                                    msg.channel.send(user + " is currently banned, can't purchase item.");
                                } else if (a.incorrect) {
                                    msg.channel.send("Wrong password for " + user);
                                } else {
                                    if (SpinnersCost[choice] > a.creds) {
                                        msg.channel.send("Can't purchase your item, not enough creds.");
                                    } else {
                                        a.sendPacket("0b" + Spinners[choice] + message.content[0] + message.content[1]);
                                        msg.channel.send("Successfully purchased " + choice + " for " + user);
                                    }
                                }
                                a.socketConn.destroy();
                            }
                        }
                    })
                    .catch(collected => {
                        msg.reply('Your buy request timed out, try again.');
                    })
                })
                .catch(collected => {
                    msg.reply('Your buy request timed out, try again.');
                })
            } else {
                msg.channel.send(message.content + " doesn't exist, try again.");
            }
            })
            .catch(collected => {
                msg.reply('Your buy request timed out, try again.');
            });
        })
    }
}

function verify(color1, color2) {
    let R1 = Number(color1.substr(0, 3));
    let G1 = Number(color1.substr(3, 3));
    let B1 = Number(color1.substr(6, 3));

    let R2 = Number(color2.substr(0, 3));
    let G2 = Number(color2.substr(3, 3));
    let B2 = Number(color2.substr(6, 3));

    let RGB1 = [R1, G1, B1];
    let RGB2 = [R2, G2, B2];

    if(R1 + G1 + B1 > 522) {
        return "The color code given for name color won't work. The total value exceeds 522."
    } else if (R1 + G2 + B1 < 248) {
        return "The color code given for name color won't work. The total value is lesser than 248."
    } else if(R2 + G2 + B2 > 522) {
        return "The secondary color code won't work. The total value exceeds 522."
    } else if (R2 + G2 + B2 < 248) {
        return "The secondary color code won't work. The total value is lesser than 248."
    } else if (!RGB1.some(nr => nr >= 128)) {
        return "The color code given for name color won't work. Atleast 1 out of the RED, GREEN or BLUE values has to be 128 or bigger."
    } else if (!RGB2.some(nr => nr >= 128)) {
        return "The color code given for name color won't work. Atleast 1 out of the RED, GREEN or BLUE values has to be 128 or bigger."
    } else if (RGB1.every(val => val === RGB1[0])) {
        return "The color code given for name color won't work. R, G and B values can't be all the same."
    } else if (RGB2.every(val => val === RGB2[0])) {
        return "The color code given for name color won't work. R, G and B values can't be all the same."
    } else {
        return false
    }
}
