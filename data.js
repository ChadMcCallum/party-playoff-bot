let fs = require('fs');

module.exports.getGame = () => {
    //see if filesystem has a game
    if(fs.existsSync("./data/game.json")) {
        var game = require("./data/game.json");
        return game;
    } else return null;
};


module.exports.getRand = (limit) => {
    return Math.floor(Math.random() * (limit));
};

module.exports.getSubjectsByType = (type) => {
    var types = require(`./data/subjects-${type}.json`);
    return types;
};

module.exports.getQuestionsByType = (type) => {
    var types = require(`./data/questions-${type}.json`);
    return types;
};

module.exports.saveGame = (game) => {
    fs.writeFileSync("./data/game.json", JSON.stringify(game, null, '\t'));
};

module.exports.getGameTypeSubjects = (type, game) => {
    var subjects = game.brackets.filter(b => b.type == type).reduce((a, s) => a.concat([s.subject1, s.subject2]), []);
    return subjects;
}

module.exports.getTypeName = (type) => {
    switch(type)
    {
        case 1:
            return "People";
        case 2:
            return "Places";
        case 3:
            return "Actions";
        case 4:
            return "Things";
    }
};

