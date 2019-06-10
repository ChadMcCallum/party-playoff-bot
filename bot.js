// var Discord = require("discord.io");
var winston = require("winston");
var emitter = require("events").EventEmitter;
var util = require("util");

var logger = winston.createLogger({
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ]
});

// var bot = new Discord.Client({
//     token: process.env.token,
//     autorun: true
// });
// bot.on('ready', (event) => {
//     logger.info('Connected');
//     logger.info(`Logged in as: ${bot.username} - (${bot.id})`);
// });

var game = require('./game.js');

var ConsoleServer = function() {
    var me = this;
    me.sendUser = (user, message) => {
        logger.info(`Sending message ${message} to ${user}`);
    }
    setTimeout(() => {
        me.emit('message', 'Chad', 'pick', [1]);
    }, 2000);
    return me;
}
util.inherits(ConsoleServer, emitter);

game.addServer(new ConsoleServer());

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
