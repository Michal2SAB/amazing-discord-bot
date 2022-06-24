// I'm going to handle commands here

const btc = require('./commands/cryptocurrency.js');
const eth = btc;
const luck = require('./commands/luck.js');
const ethluck = require('./commands/ethluck.js');
const calc = require('./commands/calc.js');
const bnews = require('./commands/bnews.js');
const ask = require('./commands/ask.js');
const mweather = require('./commands/mweather.js');
const mars = require('./commands/mars.js');
const marsnews = require('./commands/marsnews.js');
const apod = require('./commands/apod.js');
const telescope = require('./commands/telescope.js');
const ytags = require('./commands/ytags.js');
const colvert = require('./commands/colvert.js');
const help = require('./commands/help.js');
const remove = require('./commands/remove.js');

// stickarena commands
const users = require('./commands/stickarena/users.js');
const games = require('./commands/stickarena/games.js');
const gameinfo = require('./commands/stickarena/gameinfo.js');
const create = require('./commands/stickarena/create.js');
const validate = require('./commands/stickarena/validate.js');
const buy = require('./commands/stickarena/buy.js');
const change = require('./commands/stickarena/change.js');
const verify = require('./commands/stickarena/verify.js');

const config = require('./config.json');
const prefix = config.prefix;

const cmds = { btc, eth, luck, ethluck, calc, bnews, ask, mweather, mars, marsnews, apod, 
              telescope, ytags, soon, colvert, help, remove, users, games, gameinfo, create, 
              validate, buy, change, verify}

module.exports = async function (msg) {
    if (msg.author.bot) return;
    if (msg.content.startsWith(prefix)) {
        try {
            const [cmd, ...args] = msg.content
                .trim()
                .substring(prefix.length)
                .split(/\s+/);
        
            cmds[cmd](msg, args, cmd);
        } catch (err) {
            if (err.name == 'TypeError') {
                msg.reply(msg.content.split(' ')[0] + " is not a command.");
            } else {
                console.log(err);
            }
        }
    }
};
