var emitter = require('events').EventEmitter;
var util = require('util');
var Discord = require('discord.io');
// Initialize Discord Bot

var DiscordServer = function() {
    var me = this;

    var userChannels = {};

    var bot = new Discord.Client({
        token: process.env.token,
        autorun: true
    });
    bot.on('ready', function (evt) {
        console.log('Connected');
        console.log('Logged in as: ');
        console.log(bot.username + ' - (' + bot.id + ')');
    });
    bot.on('message', function (user, userID, channelID, message, evt) {
        if (message.substring(0, 1) == '!') {
            var args = message.substring(1).split(' ');
            var cmd = args[0];           
            args = args.splice(1);
            me.emit('message', userID, cmd, args);
        }    
    });
    me.sendUser = (user, message) => {
        setTimeout(() => {
            bot.sendMessage({
                to: user,
                message: message
            });
        }, 100);
    };

    return me;
}

module.exports = DiscordServer;

util.inherits(DiscordServer, emitter);