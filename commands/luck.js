// Command to generate 10 random bitcoin wallets & their private keys, in hope of finding one that has a balance.

const CoinKey = require('coinkey');
const fetch2 = require('node-fetch');

var i = 0;
const wallets = {};

module.exports = function(msg) {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    const settings = { method: "Get" };
    const url = 'https://blockchain.info/balance?active='
    setTimeout(async function() { 
        const ck = new CoinKey(Buffer.from(r(64), 'hex'));
        ck.compressed = false;

        const pub = ck.publicAddress;
        const priv = ck.privateWif;

        await fetch2(url + pub.toString(), settings)
        .then(res => res.json())
        .then(json => {
            const balance = json[pub]['final_balance'];
            wallets[pub] = priv + "," + balance;
        })
        .catch(error => {
            console.log("error");
        });
        i++;
        if (i < 10) {
            module.exports(msg);
        } else {
            var finalWallets = "";
            for (const [key, value] of Object.entries(wallets)) {
                const vSeparated = value.split(",");
                finalWallets = finalWallets + `[${vSeparated[0]}](https://www.blockchain.com/btc/address/${key}) ($${vSeparated[1]})\n\n`;
            }
            const Discord = require('discord.js');
            const embed = new Discord.MessageEmbed()
            .setColor('#f7941a')
            .setTitle('Random Seeds')
            .setAuthor('Bitcoin', 'https://bitmarket.pl/wp-content/uploads/2020/10/Bitcoin.svg_.png')
            .setDescription(finalWallets);

            msg.reply(embed);
            i = 0;
            for (const [key, value] of Object.entries(wallets)) {
                delete wallets[key];
            }
        }
    }, 200)
};

function r(l) {
    let randomChars = 'ABCDF0123456789';
    let result = '';
    for ( var i = 0; i < l; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
};
