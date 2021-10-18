// Command for checking bitcoin and ethereum current, real time price.

const rp = require('request-promise');

const coins = {
    btc: '1',
    eth: '2'
};

const names = {
    btc: 'bitcoin',
    eth: 'ethereum'
};

module.exports = function (msg, args, type) {
    const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
        qs: {
            'start': coins[type],
            'limit': '1',
            'convert': 'USD'
        },
        headers: {
            'X-CMC_PRO_API_KEY': process.env.btc_api // or config.btc_api if running locally
        },
        json: true,
        gzip: true
    };

    rp(requestOptions).then(response => {
        const price = response['data'][0]['quote']['USD']['price'];
        const converted = parseFloat(args[0]) * price;
        const converted2 = converted.toString().split('.');
        const realNumber = converted2[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const finalNumber = realNumber + '.' + converted2[1];

        msg.reply(`${args} ${names[type]} is currently worth $${finalNumber}`);
    }).catch((err) => {
        console.log('API call error:', err.message);
    });
}
