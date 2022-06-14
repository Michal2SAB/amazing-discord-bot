const fetch2 = require("node-fetch");

module.exports = {
    create_php: async function () {
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
        let url = 'http://www.xgenstudios.com/stickarena/stick_arena.php';
        let randUser = this.randomUser(20);
        let color = this.getLegitColor();

        var params = new URLSearchParams();
        params.append('username', randUser);
        params.append('userpass', randUser);
        params.append('usercol', color);
        params.append('action', 'create');
        
        let post_options = {
            method: 'POST',
            body: params
        };

        return fetch2(url, post_options, randUser)
        .then(res => res.text())
        .then(text => {
            if(text.includes("success")){
                return randUser;
            } else {
                return false
            }
        })
        .catch(error => {
            console.log(error)//`ERROR: Failed to create '${randUser}'`);
        })
    },

    randomUser: function (length) {
        var result = '';
        var characters = 'abcdefghijklmnopqrstuvwxyz0123456789.,';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * 
        charactersLength));
        }
        return result;
    },

    getLegitColor: function () {
        var legit = false;
        var R = null;
        var G = null;
        var B = null;
        var RGB = null;
        var finalRGB = '';
        while (!legit) {
            R = Math.floor(Math.random() * (255 - 0));
            G = Math.floor(Math.random() * (255 - 0));
            B = Math.floor(Math.random() * (255 - 0));
            RGB = [R, G, B];

            if(R + G + B <= 522 && R + G + B >= 248 && RGB.some(nr => nr >= 128) && !RGB.every(val => val === RGB[0])) {
                if (this.validate(R, G, B)) {
                    legit = true;
                }
            }
        }
        for (c of RGB) {
            if (c.toString().length < 3) {
                finalRGB += "0" + c.toString();
            } else {
                finalRGB += c.toString();
            }
        }
        return finalRGB
    },

    validate: function (R, G, B) {
        R += 100;
        G += 100;
        B += 100;

        if(R > 255) R = 255;
        if(G > 255) G = 255;
        if(B > 255) B = 255;

        let RGB2INT = R << 16 ^ G << 8 ^ B;

        if (RGB2INT < 6582527 || RGB2INT > 16777158) {
            return false;
        } else {
            return true;
        }
    }
}
