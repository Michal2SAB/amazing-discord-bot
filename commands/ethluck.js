// Command to generate 10 random ethereum wallets & their private keys, in hope of finding one that has a balance.

const genEth = require('ethers');
const fetch2 = require('node-fetch');

var i = 0;
const wallets = {};

module.exports = function(msg) {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    const settings = { method: "Get" };
    setTimeout(async function() { 
        var phrase = genEth.Wallet.createRandom().mnemonic.phrase;
        var wallet = genEth.Wallet.fromMnemonic(phrase);

        const pub = wallet.address;
        const priv = wallet.privateKey;
      
        var api_key = process.env.eth_api_key;

        const url = `https://api.etherscan.io/api?module=account&action=balance&address=${pub}&tag=latest&apikey=${api_key}`;

        await fetch2(url + pub.toString(), settings)
        .then(res => res.json())
        .then(json => {
            const balance = json['result'];
            wallets[pub] = priv + "," + balance;
        })
        .catch(error => {
            console.log(error);
        });
        i++;
        if (i < 10) {
            module.exports(msg);
        } else {
            var finalWallets = "";
            for (const [key, value] of Object.entries(wallets)) {
                const vSeparated = value.split(",");
                finalWallets = finalWallets + `[${vSeparated[0]}](https://etherscan.io/address/${key}) ($${vSeparated[1]})\n\n`;
            }
            const Discord = require('discord.js');
            const embed = new Discord.MessageEmbed()
            .setColor('#696F96')
            .setTitle('Random Seeds')
            .setAuthor('Ethereum', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/1200px-Ethereum-icon-purple.svg.png')
            .setDescription(finalWallets);

            msg.reply(embed);
            i = 0;
            for (const [key, value] of Object.entries(wallets)) {
                delete wallets[key];
            }
        }
    }, 3)
};
