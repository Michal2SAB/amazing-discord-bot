const net = require('net');

class SABot {
    constructor() {
        global.Username = '';
        global.Password = '';
        global.BotServer = '';
        global.Port = '';
        this.socketConn = null;
        this.NullByte = '\0';
        this.OnlineUsers = {}
        this.OnlineUserMap = {}
        this.RoomList = []
        this.NewRoomList = []
        this.InLobby = false
        this.banned = false
        this.incorrect = false
        this.labpass = false
        this.creds = ""

        this.NameToIP = {'2DC': 'ballistick5.xgenstudios.com:1138', 'Paper': 'ballistick4.xgenstudios.com:1138', 'fineline':  'ballistick1.xgenstudios.com:1138', 'U of SA':  'ballistick3.xgenstudios.com:1138',
        'europe':  'game08.xgenstudios.com:1138',  'Mobius':  'ballistick2.xgenstudios.com:1138', 'Cartesian':  'balistick1.xgenstudios.com:1139', 'Squaresville': '45.32.193.38:1031', 'LP Server': 'ballistick6.xgenstudios.com:1138'}

        this.IPToName = {'ballistick5.xgenstudios.com:1138': '2DC', 'ballistick4.xgenstudios.com:1138': 'Paper', 'ballistick1.xgenstudios.com:1138': 'Fineline', 'ballistick3.xgenstudios.com:1138': 'U of SA',
        'game08.xgenstudios.com:1138': 'europe', 'ballistick2.xgenstudios.com:1138': 'Mobius', 'ballistick1.xgenstudios.com:1139': 'Cartesian', '45.32.193.38:1031': 'Squaresville', 'ballistick6.xgenstudios.com:1138': 'LP Server'}

        this.Maps = {'0': 'XGen Hq', '1': 'Sunnyvale Trailer Park', '2': 'Toxic Spillway', '3': 'Workplace Anxiety', '4': 'Storage Yard', '5': 'Green Labirynth',
        '6': 'Floor Thirteen', '7': 'The Pit', '8': 'Industrial Drainage', '9': 'Globalmegacorp LTD', 'A': 'Concrete Jungle', 'B': 'Nuclear Underground', 
        'C': 'Unstable Terrace', 'D': 'Office Space', 'E': 'The Foundation', 'F': 'Brawlers Burrow', 'G': 'Trench Run', 'H': 'Corporate Wasteland', 
        'I': 'Sewage Treatment', 'J': 'Storm Drain', 'K': '{B} Stick Federation HQ', 'L': '{B} Transgalactic Com Station', 'M': '{B} Space Elevator Control', 
        'N': '{B} Automated Discovery Pod', 'O': '{B} The SF Vengeance', 'P': '{B} Gemini Control Station', 'Q': '{B} Outpost', 'R': '{B} Space Mountain', 'S': '{B} Barge', 
        'T': '{B} Cliffside', 'U': '{B} Orbit', 'a': '{F} Abandoned City (by Sk1)', 'b': '{F} Anarchy Streets (by Bloodsyn)', 'c': '{F} Cruelity (by Jzuo)', 'd': '{F} Desert Laboratory (by Crocodile)',
        'e': '{F} Exploration (by Difficult)', 'f': '{F} Facility (by Shadowcasterx4ffc', 'g': '{F} Failcorp (by Enclave)', 'h': '{F} Fortmoon (by Hanktankerous)', 'i': '{F} Island Hopping (by Infal)',
        'j': '{F} Lost Facility (by Volt)', 'k': '{F} Lowzone (by Springbranch, Stickslayer138)', 'l': '{F} Marked Territory (by Coldhot)', 'm': '{F} My pet glock (by Joe7777777)', 'n': '{F} Space Excavations (by 718)', 
        'o': '{F} Venice Streets (by Jaguar)', 'p': '{F} Office Pod (by Vegeta,rock)', 'q': '{F} Space Bridge (by Bullet.girl.)', 'r': '{F} Elite Base (by Jzuo)', 's': '{F} D Day (by Shot..to..kill...)', 't': '{F} Cliffs (by Masterchuf)',
        'u': '{F} Last Map (by ,.Smokez.,)', 'v': '{F} Ship dock (by Bridgeofstraw)', 'w': '{F} Radiation (by Jzuo)', 'x': '{F} Shelter (by Jzuo)', 'y': '{F} Sewer Tunnel (by Ghecko)', 'z': '{F} Trench Space (by Jzuo, Dr.wolfe)'}

        this.normalMaps = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
        'U', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

        this.gameModes = {"0": "Cycle", "1": "Random", "2": "Repeat"}

        this.credTickets = {'0a0': '20', '0a1': '25', '0a2': '30', '0a3': '35', '0a4': '40', '0a5': '55', '0a6': '60', '0a7': '75', '0a8': '100', '0a9': '250', 
        '0a10': '500', '0a11': '999', '0a12': '1500', '0a13': '5000'}

        global.BotServer = null;
    } 

    promiseCustom(timeout, callback) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                resolve("");
            }, timeout);

            callback(
                (value) => {
                    clearTimeout(timer);
                    resolve(value);
                },
                (error) => {
                    clearTimeout(timer);
                    reject(error);
                }
            );
        });
    }

    sendPacket(packetData, response = false, timeout = 500, required = '') {
        if (this.socketConn) {
            this.socketConn.write(packetData + this.NullByte);
            if (response) {
                return this.promiseCustom(timeout, (resolve, reject) => {
                    this.socketConn.on('data', (data) => {
                        data = data.toString();
                        data = data.split(this.NullByte);
                        for(let OneData of data) {
                            if(!OneData.startsWith(required)){
                                //pass
                            } else {
                                if (required === 'U') {
                                    if(dataReceived === '') {
                                        dataReceived = OneData
                                    } else {
                                        dataReceived = dataReceived + this.NullByte + OneData
                                    }
                                } else {
                                    resolved = true;
                                    resolve(OneData);
                                }
                            }
                        }
                        if (resolved != true) resolve(dataReceived);
                    })
                });
            }
        } else {
            console.log("sendPacket: Missing socket connection!");
        }
    }

    parseUserInfo(packet) {
        return this.promiseCustom(500, (resolve, reject) => {
            var StatsString = packet.replace('\x00', '');
            let UserID = StatsString.substr(1, 3);
            
            var User = StatsString.substr(4, 20).replace(/#/g, '');
            if (this.BotServer === 'Squaresville'){
                this.OnlineUsers[UserID] = User;
                this.OnlineUserMap[User] = UserID;
            } else {
                let LP = StatsString.split(";")[5];
                let Mod = StatsString.split(";")[6];

                var lpString = "";
                var modString = "";

                if (LP == "1") lpString = "{B} ";
                if (parseInt(Mod) > 0) modString = "[M] ";

                resolve(modString + lpString + User);
            }
        })
    }

    async connectToServer(username, password, server, port) {
        Username = username;
        Password = password;
        BotServer = this.IPToName[`${server}:${port}`];
        Port = port;

        this.socketConn = new net.Socket();
        this.socketConn.connect({ host: server, port: port });
        let Handshake = await this.sendPacket('08HxO9TdCC62Nwln1P', true, 5000);
        Handshake = Handshake.replace(this.NullByte, '');

        if (Handshake === '08') {

            let Credentials = `09${username};${password}`;

            let RawData = await this.sendPacket(Credentials, true, 5000);
            RawData = RawData.split(this.NullByte)
            
            for (let data of RawData) {
                if (data.startsWith('A')) {

                    this.InLobby = true;

                    if (this.BotServer != 'Squaresville') {

                        let credTicket = await this.sendPacket("0a", true);
                        credTicket = credTicket.replace(this.NullByte, '');

                        this.creds = data.split(";")[8];

                        var addon = "";

                        if (credTicket.startsWith('0a')) {
                            var credsNow = this.credTickets[credTicket];
                            this.creds = parseInt(this.creds + credsNow).toString();
                            addon = ` and won ${credsNow} creds`;
                        }

                        console.log(`[${BotServer}]: ${username} has been logged in${addon}`);
                    }

                } else if (data === '09') {
                    console.log("Incorrect password for " + Username);
                    this.incorrect = true;

                } else if (data === '091') {
                    this.banned = true;
                    console.log(Username + " is currently banned");

                } else if (data === '090') {
                    console.log(Username + "'s server is closed or full");
                }
            }
        } else {
            console.log("Server capacity check failed for " + Username);
        }
        this.socketConn.on('end', function () {
                console.log(Username + ' disconnected from ' + BotServer);
        });
        this.socketConn.on('error', function (error) {
            console.log(Username + ' disconnected from ' + BotServer + ' (Socket Error)');
        });
    }
}

module.exports = SABot;
