/**
 * A Bot for Slack!
 */


/**
 * Define a function for initiating a conversation on installation
 * With custom integrations, we don't have a way to find out who installed us, so we can't message them :(
 */

var thread = 0;
var reply, reply2, input;

function onInstallation(bot, installer) {
    if (installer) {
        bot.startPrivateConversation({user: installer}, function (err, convo) {
            if (err) {
                console.log(err);
            } else {
                convo.say('I am a bot that has just joined your team');
                convo.say('You must now /invite me to a channel so that I can be of use!');
            }
        });
    }
}


/**
 * Configure the persistence options
 */

var Store = require('jfs');

// BREAK

var config = {};
if (process.env.MONGOLAB_URI) {
    var BotkitStorage = require('botkit-storage-mongo');
    config = {
        storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI}),
    };
} else {
    config = {
        json_file_store: ((process.env.TOKEN)?'./db_slack_bot_ci/':'./db_slack_bot_a/'), //use a different name if an app or CI
    };
}

module.exports = function(config) {

    if (!config) {
        config = {
            path: './',
        };
    }

    var teams_db = new Store(config.path + '/teams', {saveId: 'id'});
    var users_db = new Store(config.path + '/users', {saveId: 'id'});
    var channels_db = new Store(config.path + '/channels', {saveId: 'id'});

    var objectsToList = function(cb) {
        return function(err, data) {
            if (err) {
                cb(err, data);
            } else {
                cb(err, Object.keys(data).map(function(key) {
                    return data[key];
                }));
            }
        };
    };

    var storage = {
        teams: {
            get: function(team_id, cb) {
                teams_db.get(team_id, cb);
            },
            save: function(team_data, cb) {
                teams_db.save(team_data.id, team_data, cb);
            },
            all: function(cb) {
                teams_db.all(objectsToList(cb));
            }
        },
        users: {
            get: function(user_id, cb) {
                users_db.get(user_id, cb);
            },
            save: function(user, cb) {
                users_db.save(user.id, user, cb);
            },
            all: function(cb) {
                users_db.all(objectsToList(cb));
            }
        },
        channels: {
            get: function(channel_id, cb) {
                channels_db.get(channel_id, cb);
            },
            save: function(channel, cb) {
                channels_db.save(channel.id, channel, cb);
            },
            all: function(cb) {
                channels_db.all(objectsToList(cb));
            }
        }
    };

    return storage;
};


/**
 * Are being run as an app or a custom integration? The initialization will differ, depending
 */

if (process.env.TOKEN || process.env.SLACK_TOKEN) {
    //Treat this as a custom integration
    var customIntegration = require('./lib/custom_integrations');
    var token = (process.env.TOKEN) ? process.env.TOKEN : process.env.SLACK_TOKEN;
    var controller = customIntegration.configure(token, config, onInstallation);
} else if (process.env.CLIENT_ID && process.env.CLIENT_SECRET && process.env.PORT) {
    //Treat this as an app
    var app = require('./lib/apps');
    var controller = app.configure(process.env.PORT, process.env.CLIENT_ID, process.env.CLIENT_SECRET, config, onInstallation);
} else {
    console.log('Error: If this is a custom integration, please specify TOKEN in the environment. If this is an app, please specify CLIENTID, CLIENTSECRET, and PORT in the environment');
    process.exit(1);
}


/**
 * A demonstration for how to handle websocket events. In this case, just log when we have and have not
 * been disconnected from the websocket. In the future, it would be super awesome to be able to specify
 * a reconnect policy, and do reconnections automatically. In the meantime, we aren't going to attempt reconnects,
 * WHICH IS A B0RKED WAY TO HANDLE BEING DISCONNECTED. So we need to fix this.
 *
 * TODO: fixed b0rked reconnect behavior
 */
// Handle events related to the websocket connection to Slack
controller.on('rtm_open', function (bot) {
    console.log('** The RTM api just connected!');
});

controller.on('rtm_close', function (bot) {
    console.log('** The RTM api just closed');
    // you may want to attempt to re-open
});


/**
 * Core bot logic goes here!
 */
// BEGIN EDITING HERE!

controller.on('bot_channel_join', function (bot, message) {
    bot.reply(message, "I'm here!")
});

controller.hears(
    ['hello','hi','howdy'], 
    ['direct_message','mention'], function (bot, message) {
    bot.startConversation(message, enter);
    var temp = message.user;
    console.log("message.user: " + temp);
    console.log("message.team: " + message.team);
    controller.storage.teams.save({id: message.team, user:{ 
        lev1:"TEST",
        temp2:{
            lev2: "TEST2"
        }
    }}, function(err){});
    controller.storage.teams.get(message.team,function(err,team_data){
        console.log(team_data.user.temp2)
    });
});

enter = function(response, convo){
    convo.ask("Would you like to take a visit to Dunshire?", function(response,convo){
        convo.say("Good times. 😜");
        enter2(response,convo);
        convo.next();
    });
}



enter2 = function(res,convo){
    convo.say("You're walking down a dirt path. It's nighttime, and cool out. The crickets are chirping around you. There's a soft light up ahead. As you get a little closer, the yellow light of a small country inn beckons. You open the small metal gate and walk into the inn's yard. There are torches about lighting the way, and the sound of voices talking and laughing inside.");
    convo.say("As you enter, The Innkeeper looks up from where he's clearing a table.");
    convo.ask("\"Greetings! What's your name, stranger?\"", function(response,convo){
        enter3(response,convo);
        convo.next();
    });
}

enter3 = function(response,convo){
    convo.say("Good to meet you, " + response.text + ".");
    convo.ask("What do you wanna do - 1 or 2?", function(res,convo){
        console.log("response: " + res.text);
        if (res.text==="1") {
            route1(res,convo);
        }
        else if (res.text==="2") {
            route2(res,convo);
        }
        else {
            defaulty(res,convo);
        }
        convo.next();
    });
}

route1 = function(res,convo){
    convo.say("Route 1!");
}

route2 = function(res,convo){
    convo.say("Route 2!");
}

defaulty = function(res,convo){
    convo.say("This is the default route");
}

