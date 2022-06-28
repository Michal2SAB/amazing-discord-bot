const sabot = require('../../tools/sabot.js');
const creator = require('../../tools/create.js');

const ServerNames = {'2dc': 'ballistick5.xgenstudios.com:1138', 'ptc': 'ballistick4.xgenstudios.com:1138', 'fli': 'ballistick1.xgenstudios.com:1138', 'uofsa': 'ballistick3.xgenstudios.com:1138',
'eu': 'game08.xgenstudios.com:1138', 'mobius': 'ballistick2.xgenstudios.com:1138', 'cartesian': 'ballistick1.xgenstudios.com:1139', 'squaresville': '45.32.193.38:1031', 'lp': 'ballistick6.xgenstudios.com:1138'}

const NameServer = {'2dc': '2-Dimensional Central', 'ptc': 'Paper Thin City (RP)', 'fli': 'Fine Line Island / Flat World',
'uofsa': 'U of SA / Sticktopia', 'mobius': 'Mobius Metropolis / Planar Outpost', 'eu': '{Europe} Amsterdam', 
'cartesian': 'Cartesian Republic', 'squaresville': 'Squaresville (BoxHead)', 'lp': '{LABPASS} The SS Lineage'}

module.exports = async function (msg, user) {
    if(user < 1) {
        msg.channel.send("Wrong command usage. Give user to search for");
    } else {
        var BotUser = null;
        var BotPassword = null;
        var generated = false;

        while(!generated) {
            BotUser = await creator.create_php()
            BotPassword = BotUser;
            if (BotUser != false) generated = true;
        }

        const a = new sabot();

        for (server in ServerNames) {
            let sv = ServerNames[server].split(":")[0];
            let pt = ServerNames[server].split(":")[1];

            await a.connectToServer(BotUser, BotPassword, sv, pt);

            var resp = await a.sendPacket("0h" + user, true, 500, '0h');

            if (a.banned) {
                msg.channel.send("Something went wrong, check logs.");

            } else if (a.incorrect) {
                msg.channel.send("Something went wrong, check logs.");

            } else {
                if(resp.includes("located")) {
                    msg.channel.send(`**${NameServer[server]}**: ${resp.slice(2)}`);
                    a.socketConn.destroy();
                    break
                } else {
                    a.socketConn.destroy();
                    if (server === 'lp') msg.channel.send("Couldn't find " + user);
                }
            }
        }
    }
}
