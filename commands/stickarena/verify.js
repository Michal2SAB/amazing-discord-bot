var http = require('http');
var parser = require('xml2json');

module.exports = async function (msg, args) {
    if(args.length < 1 || args.length > 3) {
        msg.channel.send("Wrong command usage. Provide user, pass and email");
    } else if (!args[2].includes("@")){
        msg.channel.send("Provide correct email address.");
    } else {
        let user = args[0];
        let pass = args[1];
        let email = args[2];

        var req = http.get(`http://api.xgenstudios.com/?method=xgen.users.addEmail&username=${user}&password=${pass}&email=${email}`, function(res) {
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
                    msg.channel.send(`Sent email to ${email}`);
                } else {
                    msg.channel.send(parsed.rsp.err.msg);
                }
            });
        });
    }
}
