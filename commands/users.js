const sabot = require('../tools/sabot.js');
const creator = require('../tools/create.js');

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

        let EntryPackets = ["03_", "02Z900_"];
        var onlineUsers = null;

        for (p of EntryPackets) {
            var resp = await a.sendPacket(p, true, 500, 'U');
            if(resp.includes('U')) onlineUsers = resp;
        }

        if (a.banned) {
            console.log(BotUser + " is currently banned, use other bot.");
        } else if (!a.incorrect) {
            if(!onlineUsers) {
                msg.channel.send(`There is nobody online in ${NameServer[server]}`);
            } else {
                var UserList = [];

                if (server === 'squaresville') {
                    for (user of onlineUser) {
                        UserList.push(user);
                    }

                } else {
                    for(user of onlineUsers.split(a.NullByte)) {
                        if(user.startsWith('U')) {
                            let parsedUser = await a.parseUserInfo(user);
                            UserList.push(parsedUser);
                        }
                    }
                }
            
                var grammar = " user";

                if (UserList.length > 1) grammar = " users";

                const Discord = require('discord.js');
                embed = new Discord.MessageEmbed();
                embed.setColor('#24262B')
                embed.setTitle(`${NameServer[server]} | ${UserList.length + grammar} in the lobby.`)
                embed.setDescription(`**${UserList.join('\n')}**`);

                msg.channel.send(embed);
            }
        }
        delete a.socketConn.destroy();
    }
}
