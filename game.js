var data = require('./data.js');

var servers = [];

module.exports.addServer = (server) => {
    servers.push(server);
    server.on('message', processMessage);
};

sendUser = (user, message) => {
    servers.forEach((s) => {
        s.sendUser(user, message);
    });
}

getGame = () => {
    var game = data.getGame();
    if(game == null) {
        game = createGame();
    }
    return game;
}

createGame = () => {
    var game = {
        "brackets": [],
        "players": [],
        "started": false
    };
    for(var i = 1; i <= 4; i++) { //create bracket for each type
        var subjects = data.getSubjectsByType(i);
        //randomly pick 8
        var pickedSubjects = [];
        for(var j = 0; j < 8; j++) {
            var index = data.getRand(subjects.length);
            pickedSubjects.push(subjects[index]);
            subjects.splice(index, 1);
        }
        var questions = data.getQuestionsByType(i);
        //create brackets
        for(var j = 0; j < 8; j+=2) {
            var questionIndex = data.getRand(questions.length);
            var bracket = {
                "subject1": pickedSubjects[j],
                "subject2": pickedSubjects[j+1],
                "type": i,
                "question": questions[questionIndex],
                "votes": []
            };
            questions.splice(questionIndex, 1);
            game.brackets.push(bracket);
        }
    }
    var knockoutQuestions = data.getQuestionsByType(6);
    game.knockoutQuestion = knockoutQuestions[data.getRand(knockoutQuestions.length)];
    data.saveGame(game);
    return game;
};

joinGame = (user, game) => {
    //see if user exists yet
    var existingPlayer = game.players.filter((player) => {
        return player.Id == user;
    });
    if(existingPlayer.length == 1) {
        nextPickStep(user, game);
    } else {
        if(game.started) {
            sendUser(user, "Sorry, the game's already started - you'll have to wait for the next one!");
        } else {
            welcomePlayer(user, game);
        }
    }
};

welcomePlayer = (user, game) => {
    var player = {
        Id: user,
        picks: []
    };
    game.players.push(player);
    data.saveGame(game);
    sendUser(user, "Hey there!  So you wanna play Party Playoff, eh? Here's what it's about.\r\nWe've picked 32 random people, places, actions, and things, and they'll be pit against one another to see who rises to the top.\r\nBefore we start, however, each player must pick which subjects they think will make it to the finals of their category, and eventually take the whole thing.");
    sendUser(user, `You get to find out the last question of the game in advance - for this game, the game-deciding question will be... '${game.knockoutQuestion}'`);
    promptForCategoryChoice(user, 1, game);
};

promptForCategoryChoice = (user, type, game) => {
    var subjects = data.getGameTypeSubjects(type, game);
    sendUser(user, `The ${type == 1 ? "first": "next"} category is ${data.getTypeName(type)}.  Which of these 8 subjects do you think will win the category?`);
    var subjectString = subjects.reduce((result, subject, index) => result += `${index+1}) ${subject}, `, "");
    sendUser(user, subjectString.substring(0, subjectString.length - 2));
    sendUser(user, "(Submit your choice by typing !pick followed by the number)");
    sendUser(user, `Remember, the game-deciding question will be... '${game.knockoutQuestion}'`);
}

nextPickStep = (user, game) => {
    var player = game.players.filter(p => p.Id == user)[0];
    var unpickedTypes = [1,2,3,4,5,6,7].filter(i => !player.picks.some(p => p.type == i));
    if(unpickedTypes.length == 0) {
        if(game.started) {
            sendUser(user, "We've already started the game!  What're you doing!?");
        } else {
            sendUser(user, "Thanks, we've got all your picks recorded.  Now sit back and wait for the arguing to begin!");
        }
    } else {
        var nextUnpickedType = unpickedTypes.sort()[0];
        if(nextUnpickedType <= 4) {
            promptForCategoryChoice(user, nextUnpickedType, game);
        } else if(nextUnpickedType == 5) { //semifinal 1
            sendUser(user, "Alright, time for the semifinals - for the first matchup, who do you expect to win?");
            sendUser(user, `1) ${player.picks[0].subject} or 2) ${player.picks[1].subject}?`)
            sendUser(user, "(Submit your choice by typing !pick followed by the number)");
            sendUser(user, `Remember, the game-deciding question will be... '${game.knockoutQuestion}'`);
        } else if(nextUnpickedType == 6) { //semifinal 1
            sendUser(user, "For the second semifinal matchup, who do you expect to win?");
            sendUser(user, `1) ${player.picks[2].subject} or 2) ${player.picks[3].subject}?`)
            sendUser(user, "(Submit your choice by typing !pick followed by the number)");
            sendUser(user, `Remember, the game-deciding question will be... '${game.knockoutQuestion}'`);
        } else if(nextUnpickedType == 7) { //final
            sendUser(user, "And finally, who do you think will win the whole thing?");
            sendUser(user, `1) ${player.picks[4].subject} or 2) ${player.picks[5].subject}?`)
            sendUser(user, "(Submit your choice by typing !pick followed by the number)");
            sendUser(user, `Remember, the game-deciding question will be... '${game.knockoutQuestion}'`);
        }
    }
};

processMessage = (user, cmd, args) => {
    var game = getGame();
    if(cmd == "join") {
        joinGame(user, game);
    } else if(cmd == "pick") {
        if(!args || args.length == 0) {
            sendUser(user, "Please select a valid number");
        } else {
            var selectedValue = parseInt(args[0]);
            if(!selectedValue) {
                sendUser(user, "Please select a valid number");
            } else {
                recordChoice(user, selectedValue, game);
            }
        }
        nextPickStep(user, game);
    } else if(cmd == "reset") {
        console.log(user);
    }
};

recordChoice = (user, subjectPick, game) => {
    var player = game.players.filter(p => p.Id == user)[0];
    if(!player) {
        sendUser(user, "Hey, you haven't joined the game yet!  Start by typing !join in the channel.");
    } else {
        //see what the next unpicked type is
        var unpickedTypes = [1,2,3,4,5,6,7].filter(i => !player.picks.some(p => p.type == i));
        if(unpickedTypes.length == 0) {
            sendUser(user, "You've already picked all your winners - wait for the game to start!");
        } else {
            nextUnpickedType = unpickedTypes.sort()[0];
            var subject = null;
            if(nextUnpickedType <= 4) {
                var subjects = data.getGameTypeSubjects(nextUnpickedType, game);
                if(subjectPick-1 < subjects.length) {
                    subject = subjects[subjectPick-1];
                }
            } else if(nextUnpickedType == 5) { //semifinal 1
                if(subjectPick == 1) {
                    subject = player.picks[0].subject;
                } else if (subjectPick == 2) {
                    subject = player.picks[1].subject;
                } 
            } else if(nextUnpickedType == 6) { //semifinal 2
                if(subjectPick == 1) {
                    subject = player.picks[2].subject;
                } else if (subjectPick == 2) {
                    subject = player.picks[3].subject;
                }
            } else if(nextUnpickedType == 7) { //final
                if(subjectPick == 1) {
                    subject = player.picks[4].subject;
                } else if (subjectPick == 2) {
                    subject = player.picks[5].subject;
                }
            }
            if(subject != null) {
                player.picks.push({
                    "type": nextUnpickedType,
                    "subject": subject
                });
                data.saveGame(game);
                sendUser(user, `Alright, recorded ${subject} as your pick.`)
            } else {
                sendUser(user, "That appears to be an invalid selection - please try again");
            }
        }
    }
};
