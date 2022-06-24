var http = require('http');
var parser = require('xml2json');

module.exports = function (msg, args) {
    var user = args[0];
    var pass = args[1];
    var newTing = args[2];
    var apiurl = `http://api.xgenstudios.com/?method=xgen.users.changePassword&username=${user}&password=${pass}&new_password=${newTing}`;
    var respType = "password";

    if(args[0] === 'name') {
        user = args[1];
        pass = args[2];
        newTing = args[3];
        apiurl = `http://api.xgenstudios.com/?method=xgen.users.changeName&username=${user}&password=${pass}&new_username=${newTing}`;
        respType = "name";
    }

    if(respType === 'password' && (args.length < 3 || args.length > 3)) {
        msg.channel.send("Wrong command usage. Provide 3 arguments: user, old password and new password");
    } else if (respType === 'name' && (args.length < 4|| args.length > 4)) {
        msg.channel.send("Wrong command usage. Namechanging format: ```.change name {old user} {pass} {new user}```");
    } else {
        var req = http.get(apiurl, function(res) {
            var xml = '';
                
            res.on('data', function(chunk) {
                xml += chunk;
            });
            
            res.on('error', function(e) {
                msg.channel.send("API ERROR");
            }); 
            
            res.on('timeout', function(e) {
                msg.channel.send(`Your ${respType} change request failed (timeout)`);
            }); 
            
            res.on('end', function() {
                var parsed = parser.toJson(xml);
                parsed = JSON.parse(parsed);
                let apiResp = parsed.rsp.stat;
                if(apiResp === 'ok') {
                    msg.channel.send(`Changed ${user}'s ${respType} to ${newTing}`);
                } else {
                    if(pass === newTing) {
                        msg.channel.send(`Can't change your ${respType} to the same ${respType} again dummy`);
                    } else {
                        msg.channel.send(parsed.rsp.err.msg);
                    }
                }
            });
        });
    }
}
