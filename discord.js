var emitter = require('events').EventEmitter;
var util = require('util');
var Discord = require('discord.js');
// Initialize Discord Bot

const MessageDelay = 1000;

function DiscordServer(token) {
    var me = this;
    console.log("Token: " + token);
    this.bot = new Discord.Client();
    this.messageQueue = [];
    this.bot.on('ready', function (evt) {
        console.log('Connected');
        console.log('Logged in as: ');
        console.log(me.bot.username + ' - (' + me.bot.id + ')');
    });
    this.bot.on('message', function (message) {
        if (message.content.substring(0, 1) == '!') {
            var args = message.content.substring(1).split(' ');
            var cmd = args[0];           
            args = args.splice(1);
            console.log(`Received message from ${message.author.id} with command ${cmd} and args ${JSON.stringify(args)}`);
            me.emit('message', message.author.id, cmd, args);
        }    
    });
    this.bot.login(token);
    setInterval(() => {
        if(me.messageQueue.length > 0) {
            var nextMessage = me.messageQueue.splice(0, 1)[0];
            me.bot.fetchUser(nextMessage.user).then(user => {
                user.createDM().then(channel => {
                    channel.sendMessage(nextMessage.message);
                });
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