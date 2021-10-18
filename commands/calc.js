// Command to calculate something, because why not. It's always useful to have this on discord.

const doMath = require('string-math');
module.exports = function (msg, args) {
    let mathArgs = "";
    try {
        if (args.length > 1) {
            args.forEach(item => {
                mathArgs = mathArgs + item;
            });
            msg.reply(mathArgs + " = " + doMath(mathArgs.toString()));
        } else {
            msg.reply(args + " = " + doMath(args.toString()));
        }
    } catch (e) {
        msg.reply("Error: invalid equation.");
    }
};
