const sabot = require('../../tools/sabot.js');
const creator = require('../../tools/create.js');

const ServerNames = {'2dc': 'ballistick5.xgenstudios.com:1138', 'ptc': 'ballistick4.xgenstudios.com:1138', 'fli':  'ballistick1.xgenstudios.com:1138', 'uofsa':  'ballistick3.xgenstudios.com:1138',
'eu':  'game08.xgenstudios.com:1138',  'mobius':  'ballistick2.xgenstudios.com:1138', 'cartesian':  'balistick1.xgenstudios.com:1139', 'squaresville': '45.32.193.38:1031', 'lp': 'ballistick6.xgenstudios.com:1138'}

const NameServer = {'2dc': '2-Dimensional Central', 'ptc': 'Paper Thin City (RP)', 'fli': 'Fine Line Island / Flat World',
'uofsa': 'U of SA / Sticktopia', 'mobius': 'Mobius Metropolis / Planar Outpost', 'eu': '{Europe} Amsterdam', 
'cartesian': 'Cartesian Republic', 'squaresville': 'Squaresville (BoxHead)', 'lp': '{LABPASS} The SS Lineage'}

const CustomMaps = {'V': '0', 'W': '1', 'X': '2', 'Y': '3', 'Z': '4'}

module.exports = async function (msg, args) {
    if(args.length < 2) {
        msg.channel.send("Wrong command usage. Format: ```.gameinfo {server} {game name}```")
    } else {
        let server = args[0];
        let game = args.slice(1).join(' ');

        if(!ServerNames[server]) {
            msg.channel.send("Wrong server specified! Type .servers command for help.");
        } else {
            let serverport = ServerNames[server].split(":");
            let BotServer = serverport[0];
            let BotPort = serverport[1];
            var BotUser = null;
            var BotPassword = null;
            var generated = false;

            while(!generated) {
                BotUser = await creator.create_php()
                BotPassword = BotUser;
                if (BotUser != false) generated = true;
            }

            const a = new sabot();

            await a.connectToServer(BotUser, BotPassword, BotServer, BotPort);

            var players = null;
            var TimeLeft = null;
            var GameCreator = null;
            var GameMap = null;
            var GameMode = null;

            if (a.banned) {
                console.log(BotUser + " is currently banned, use other bot.");
            } else if (!a.incorrect) {
                let gameData = await a.sendPacket('04' + game, true, 5000, '04');
                
                if(!gameData) {
                    msg.channel.send(`Game '${game}' doesn't exist in ${NameServer[server]}`);
                } else {
                    GameCreator = await a.sendPacket('06' + game + ';rc', true, 5000, '06')
                    GameCreator = GameCreator.slice(5);

                    players = gameData[4] + "/6";
                    let TimeSeconds = gameData.slice(5);
                    TimeLeft = calculate_time(TimeSeconds);
                    let myMap = gameData[2];

                    if (a.normalMaps.includes(myMap)) {
                        GameMap = a.Maps[myMap];
                    } else {
                        GameMap = await loadCustomMap(myMap, GameCreator);
                    }
                    GameMode = a.gameModes[gameData[3]];

                    const Discord = require('discord.js');
                    embed = new Discord.MessageEmbed();
                    embed.setColor('#24262B')
                    embed.setTitle(`. : : Game Info for '${game}' in ${server.toUpperCase()} : : .`)
                    embed.setDescription(`**Players:** ${players}\n**Time Left:** ${TimeLeft}\n**Map:** ${GameMap}\n**Mode:** ${GameMode}\n**Creator:** ${GameCreator}`);

                    msg.channel.send(embed);
                }
            }
            a.socketConn.destroy();
        }
    }
}

function calculate_time(seconds) {
    var mins = Math.floor(seconds / 60);
    var secs = seconds - mins * 60;

    return `${mins}:${secs}`;
}

async function loadCustomMap(MapCode, gameCreator) {
    const http = require('http');
    const cheerio = require('cheerio');

    let mapSlot = CustomMaps[MapCode];
    APIURL = `http://api.xgenstudios.com/?method=xgen.stickarena.maps.get&username=${gameCreator}&slot_id=${mapSlot}`;

    return promiseCustom(5000, (resolve, reject) => {
        http.get(APIURL, function(res){
            res.setEncoding('utf8');
            res.on('data', function(chunk){
                $ = cheerio.load(chunk);
                let customMapName = $('name').text();
                var mapSlotConvert = parseInt(mapSlot) + 1;
                resolve(`${customMapName} (${gameCreator}, slot ${mapSlotConvert})`);
            });
        });
    });
}

function promiseCustom(timeout, callback) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            resolve("");
        }, timeout);

        callback(
            (value) => {
                clearTimeout(timer);
                resolve(value);
            },
            (error) => {
                clearTimeout(timer);
                reject(error);
            }
        );
    });
}
