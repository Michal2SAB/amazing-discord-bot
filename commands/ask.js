// Silly/fun command to ask bot about anything and get a random answer.

const answers = ['Fuck no', 'Definitely', 'Are you retarded?', 'Obviously, what do you think?',
'Nice one', 'Ye', 'No..', 'Nope', 'Of course', 'Lol no', 'Absolutely.', 'Nah son', 'Yup', 'No, shush.', 
'Eh, I guess.', 'Not really.', "That's right.", 'Stop it, no.', 'Yh.', 'Never idiot', 'Mhm.', 
'Is you dum?', 'Lol you already know.', 'Ofc no', 'YE?', 'Not a slight chance.', "That's just inevitable."]

module.exports = function (msg) {
    let random = Math.floor(Math.random() * answers.length);
    msg.reply("||`" + answers[random] + "`||");
};
