var emitter = require("events").EventEmitter;
var util = require("util");

var game = require('./game.js');
var DiscordServer = require("./discord.js");

var ConsoleServer = function() {
    var me = this;
    me.sendUser = (user, message) => {
        console.log(`Sending message ${message} to ${user}`);
    }
    return me;
}
util.inherits(ConsoleServer, emitter);

game.addServer(new ConsoleServer());

var discordServer = new DiscordServer(process.env.token);

game.addServer(discordServer);