// user

var arms = require('./armaments');
var levs = require('./levels');

module.exports = {

    user_id: "userid",
    username: "something",
    email: "user.email",
    knownPlayer: false,
    ///////
    level: levs.levels.naif,
    hp: 25,
    gold: 25,
    xp: 0,
    items: { 
        weapon: arms.weapons.start.hands,
        armor: arms.armor.start.shirt,
        magic: [],
        other: [],
        rubies:0
    },
    turnsToday: 20,
    lastPlayed: 0,
    attributes: {
        luck: 0,
        strength: 0,
        charisma: 0,
        myst: 0
    },
    mission: "noob",
    bank:{
        deposit:0
    }
}