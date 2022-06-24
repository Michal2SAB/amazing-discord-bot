const fetch2 = require("node-fetch");

module.exports = async function (msg, args) {
    var color = getLegitColor();
    let user = args[0];
    var pw = '';
    var standard = 'with the random password ';

    if (args.length > 3 || !args[0]) {
        msg.channel.send("Wrong command usage. Give name, pw (optional) and color (optional)");
    } else {
        if(!args[1]) {
            pw = Math.random().toString(36).replace(/[^a-z]+/g, '');
        } else {
            pw = args[1];
            standard = 'with the password ';
        }

        if(args[2]){
            color = args[2];
        }
        create_php(user, pw, color, standard, msg);
    }
}

async function create_php(user, pass, color, standard, msg) {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    let url = 'http://www.xgenstudios.com/stickarena/stick_arena.php';

    var params = new URLSearchParams();
    params.append('username', user);
    params.append('userpass', pass);
    params.append('usercol', color);
    params.append('action', 'create');
    
    let post_options = {
        method: 'POST',
        body: params
    };

    await fetch2(url, post_options)
    .then(res => res.text())
    .then(text => {
        if(text.includes("success")){
            msg.channel.send(`Created "${user}" ${standard}"${pass}" and color ${color} via PHP`);
        } else {
            create_api(user, pass, standard, msg);
        }
    })
    .catch(error => {
        msg.channel.send(`PHP ERROR: Failed to create "${user}"`);
    })
}

function create_api(user, pass, standard, msg) {
    var http = require('http');
    var parser = require('xml2json');

    var req = http.get(`http://api.xgenstudios.com/?method=xgen.users.add&username=${user}&password=${pass}`, function(res) {
        var xml = '';
            
        res.on('data', function(chunk) {
        xml += chunk;
        });
        
        res.on('error', function(e) {
        console.error(e);
        }); 
        
        res.on('timeout', function(e) {
        console.error(e);
        }); 
        
        res.on('end', function() {
            var parsed = parser.toJson(xml);
            parsed = JSON.parse(parsed);
            if(parsed.rsp.stat == 'ok') {
                msg.channel.send(`Created "${user}" ${standard}"${pass}" and standard red color via the API."`);
            } else {
                msg.channel.send(`Could not create "${user}"`);
            }
        });
    });
}

function getLegitColor() {
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
            if (validate(R, G, B)) {
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
}

function validate(R, G, B) {
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
