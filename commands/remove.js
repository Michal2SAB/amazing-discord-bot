const axios = require('axios');
const fs = require('fs');

module.exports = function (msg, url) {
    axios({
        method: 'post',
        url: 'https://api.remove.bg/v1.0/removebg',
        data: {'image_url': url.toString()},
        responseType: 'arraybuffer',
        headers: {
          'X-Api-Key': process.env.remove_api_key,
        },
        encoding: null
    })
    .then((response) => {
        if(response.status != 200) return console.error('Error:', response.status, response.statusText);
        fs.writeFileSync("no-bg.png", response.data);
        msg.channel.send("Removed background from your image:", {files: ["no-bg.png"]});
    })
    .catch((error) => {
        return msg.reply('Request failed! Try a different url or try again.');
    });
};
