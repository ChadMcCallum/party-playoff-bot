var emitter = require("events").EventEmitter;
var util = require("util");

var game = require('./game.js');
var DiscordServer = require("./discord.js");

var ConsoleServer = function() {
    var me = this;
    me.sendUser = (user, message) => {
        console.log(`Sending message ${message} to ${user}`);
    }
    setTimeout(() => {
        me.emit('message', 'Chad', 'pick', [1]);
    }, 2000);
    return me;
}
util.inherits(ConsoleServer, emitter);

game.addServer(new ConsoleServer());

var discordServer = new DiscordServer();
console.log(discordServer);

game.addServer(discordServer);

game.processMessage("Chad", "join");
game.processMessage("Nathan", "join");
game.processMessage("Chad", "pick", "1");
game.processMessage("Nathan", "pick", "2")
game.processMessage("Chad", "pick", "1");
game.processMessage("Nathan", "pick", "2")
game.processMessage("Chad", "pick", "1");
game.processMessage("Nathan", "pick", "2")
game.processMessage("Chad", "pick", "1");
game.processMessage("Nathan", "pick", "2")
game.processMessage("Chad", "pick", "1");
game.processMessage("Nathan", "pick", "2")
game.processMessage("Chad", "pick", "1");
game.processMessage("Nathan", "pick", "2")
game.processMessage("Chad", "pick", "1");
game.processMessage("Nathan", "pick", "2")
