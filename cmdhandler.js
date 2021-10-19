// I'm going to handle commands here

const btc = require('./commands/cryptocurrency.js');
const eth = btc;
const luck = require('./commands/luck.js');
const calc = require('./commands/calc.js');
const bnews = require('./commands/bnews.js');
const ask = require('./commands/ask.js');
const mweather = require('./commands/mweather.js');
const apod = require('./commands/apod.js');
const ytags = require('./commands/ytags.js');

const config = require('./config.json');
const prefix = config.prefix;

const cmds = { btc, eth, luck, calc, bnews, ask, mweather, apod, ytags}

module.exports = async function (msg) {
    if (msg.author.bot) return;
    if (msg.content.startsWith(prefix)) {
        const [cmd, ...args] = msg.content
            .trim()
            .substring(prefix.length)
            .split(/\s+/);
        
        cmds[cmd](msg, args, cmd);
    }
};
