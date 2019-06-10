var emitter = require('events').EventEmitter;
var util = require('util');
var Discord = require('discord.io');
// Initialize Discord Bot

function DiscordServer(token) {
    var me = this;
    this.bot = new Discord.Client({
        token: token,
        autorun: true
    });
    this.messageQueue = [];
    console.log(`Token: ${token}`);
    this.bot.on('ready', function (evt) {
        console.log('Connected');
        console.log('Logged in as: ');
        console.log(this.bot.username + ' - (' + this.bot.id + ')');
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
        if(this.messageQueue.length > 0) {
            var nextMessage = this.messageQueue.splice(0, 1);
            this.bot.sendMessage({
                to: nextMessage.user,
                message: nextMessage.message
            });
        }
    }, 250);
}
util.inherits(DiscordServer, emitter);

DiscordServer.prototype.sendUser = function sendUser(user, message) {
    this.messageQueue.push({
        "user": user,
        "message": message
    });    
};

module.exports = DiscordServer;