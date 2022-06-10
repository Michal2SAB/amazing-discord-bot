const sabot = require('../tools/sabot.js');

const ServerNames = {'2dc': 'ballistick5.xgenstudios.com:1138', 'ptc': 'ballistick4.xgenstudios.com:1138', 'fli':  'ballistick1.xgenstudios.com:1138', 'uofsa':  'ballistick3.xgenstudios.com:1138',
'eu':  'game08.xgenstudios.com:1138',  'mobius':  'ballistick2.xgenstudios.com:1138', 'cartesian':  'balistick1.xgenstudios.com:1139', 'squaresville': '45.32.193.38:1031', 'lp': 'ballistick6.xgenstudios.com:1138'}

const NameServer = {'2dc': '2-Dimensional Central', 'ptc': 'Paper Thin City (RP)', 'fli': 'Fine Line Island / Flat World',
'uofsa': 'U of SA / Sticktopia', 'mobius': 'Mobius Metropolis / Planar Outpost', 'eu': '{Europe} Amsterdam', 
'cartesian': 'Cartesian Republic', 'squaresville': 'Squaresville (BoxHead)', 'lp': '{LABPASS} The SS Lineage'}

module.exports = async function (msg, server) {
    if(!ServerNames[server]) {
        msg.channel.send("Wrong server specified! Type !servers command for help.");
    } else {
        let serverport = ServerNames[server[0]].split(":");
        let BotServer = serverport[0];
        let BotPort = serverport[1];
        let BotUser = process.env.bot_user;
        let BotPassword = process.env.bot_pass;

        const a = new sabot();

        await a.connectToServer(BotUser, BotPassword, BotServer, BotPort);

        var OpenGames = null;
        var RoomList = [];
        var NewRoomList = [];
        let games = await a.sendPacket('01', true, 5000, '01');
        if(games.startsWith("01_") || games === '01') games = null;

        if (a.banned) {
            console.log(BotUser + " is currently banned, use other bot.");
        } else if (!a.incorrect) {
            if(!games) {
                msg.channel.send(`There are currently no games in ${NameServer[server]}`);
            } else {
                for (gameData of games.split(a.NullByte)) { 
                    if (gameData.startsWith('01')) {
                        OpenGames = gameData;
                    }
                }

                var rooms = OpenGames.split(";");
                for (let room of rooms) {
                    if (room != null && room != "_0") {
                        if (room.endsWith('1')) {
                            RoomList.push("{B} " + room.slice(2, -1));
                        } else if (room.endsWith('0') && room[2] != '!') {
                            RoomList.push(room.slice(2, -1));
                        } else if (room[2] === '!') {
                            RoomList.push("Quick Start " + room.slice(3, -1));
                        }
                    }
                }
    
                var grammar = " game";

                if (RoomList.length > 1) grammar = " games";

                if(server === 'squaresville') {
                    for(game of RoomList) {
                        game = game.slice(2);
                        let gameInfo = await a.sendPacket('04' + game, true, 5000, '04');
                        var players = null;
                        if (gameInfo[5] === '0') {
                            players = gameInfo[6] + "/16";
                        } else {
                            players = gameInfo.substr(5, 2) + "/16";
                        }
                        NewRoomList.push(`${game} (${players})`);
                    }
                } else {
                    for(game of RoomList) {
                        var gameSlice = game;
                        var players = null;
                        if(game.includes("{B}")) gameSlice = game.slice(4);
                        let gameInfo = await a.sendPacket('04' + gameSlice, true, 5000, '04');
                        players = gameInfo[4] + "/6";
                        NewRoomList.push(`${game} (${players})`);
                    }
                }
                
                const Discord = require('discord.js');
                embed = new Discord.MessageEmbed();
                embed.setColor('#24262B')
                embed.setTitle(`${NameServer[server]} | ${NewRoomList.length + grammar} opened.`)
                embed.setDescription(`**${NewRoomList.join('\n')}**`);

                msg.channel.send(embed);
            }
        }
    }
}
