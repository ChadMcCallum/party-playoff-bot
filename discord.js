var emitter = require('events').EventEmitter;
var util = require('util');
var Discord = require('discord.io');
// Initialize Discord Bot

const MessageDelay = 1000;

function DiscordServer(token) {
    var me = this;
    console.log("Token: " + token);
    this.bot = new Discord.Client({
        token: token,
        autorun: true
    });
    this.messageQueue = [];
    this.bot.on('log', function(level, message) {
        console.log(`${level}: ${message}`);
    });
    this.bot.on('ready', function (evt) {
        console.log('Connected');
        console.log('Logged in as: ');
        console.log(me.bot.username + ' - (' + me.bot.id + ')');
    });
    this.bot.on('message', function (user, userID, channelID, message, evt) {
        if (message.substring(0, 1) == '!') {
            var args = message.substring(1).split(' ');
            var cmd = args[0];           
            args = args.splice(1);
            console.log(`Received message from ${userID} with command ${cmd} and args ${JSON.stringify(args)}`);
            me.emit('message', userID, cmd, args);
        }    
    });
    setInterval(() => {
        if(me.messageQueue.length > 0) {
            var nextMessage = me.messageQueue.splice(0, 1)[0];
            me.bot.sendMessage({
                to: nextMessage.user,
                message: nextMessage.message
            });
        }
    }, MessageDelay);
}
util.inherits(DiscordServer, emitter);

DiscordServer.prototype.sendUser = function sendUser(user, message) {
    this.messageQueue.push({
        "user": user,
        "message": message
    });    
};

module.exports = DiscordServer;