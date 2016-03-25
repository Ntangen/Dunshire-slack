// Coneshire bot!

// KEY PLAYER VARIABLES

var reply, reply2, input, userid, msg;
var user = {
    user_id: "userid",
    username: "something",
    email: "user.email",
    knownPlayer: false
}

//////////////////////////////////////

// boring stuff

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

// initialization

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

controller.on('rtm_open', function (bot) {
    console.log('** The RTM api just connected!');
});

controller.on('rtm_close', function (bot) {
    console.log('** The RTM api just closed');
    // you may want to attempt to re-open
});

// here's where the magic happens

controller.on('bot_channel_join', function (bot, message) {
    bot.reply(message, "I'm here!")
});

controller.hears(
    ['hello','hi','howdy'], 
    ['direct_message','mention'], function (bot, message) {
    userid = message.user;
    team = message.team;
    bot.startConversation(message, welcome);
    // get user collection; check knownPlayer flag; if none, set basic info
    controller.storage.users.get(userid, function(err,user_data){
        var temp = user_data;
        if (temp===undefined){
            user.knownPlayer = false
            console.log("this is not a known player");
            // grab some deets real quick, saves to user var
            bot.api.users.info({'user':userid},function(err,res){
                user.username = res.user.name;
                user.email = res.user.profile.email;
                controller.storage.users.save({id: userid, user:user});
            });
        } else {
            console.log("this IS a known player!");
            user = temp.user
            console.log("the user's name is: " + user.username);
        }
    });
});

// grab some deets real quick
// bot.api.users.info({'user':userid},function(err,res){
// user.name = res.user.name;
// user.email = res.user.profile.email;
// controller.storage.users.save({id: userid, user});

welcome = function(res,convo){
    convo.ask("Welcome! Would you like to play a game?", function(res,convo){
        if (res.text==="yes" || res.text==="y" || res.text==="sure") {
            enter(res,convo);
            convo.next();
        } else {
            convo.say ("Okay then!")
        }
    }),

// [
//     { 
//         pattern: bot.utterances.yes,
//         callback: function(res,convo){
//             enter(res,convo);
//             convo.next();
//        }
//     },
//     { 
//         pattern: bot.utterances.no,
//             callback: function(res,convo){
//             convo.say("Okay then!");
//        }
//     },
//     { 
//         default: true,
//         callback: function(res,convo){
//             convo.repeat();
//             convo.next();
//        }
//     }
// ]); 

    convo.on('end', function(convo){
        if (convo.status==='completed'){
            console.log("Looks like we're done here. Cheers! 🍺");
        } else if (convo.status==='stopped'){
            console.log("looks like the convo stopped");
        }
    });
}

enter = function(res, convo){
    convo.say("Great! Let's go! 🐲");
    convo.say("You're walking down a dirt path. It's nighttime, and cool out. The crickets are chirping around you. There's a soft light up ahead. As you get a little closer, the yellow light of a small country inn beckons. You open the small metal gate and walk into the inn's yard. There are torches about lighting the way, and the sound of voices talking and laughing inside.");
    convo.say("As you enter, The Innkeeper looks up from where he's clearing a table.");
    console.log("user.knownPlayer is set to " + user.knownPlayer);
    if (!user.knownPlayer){
        convo.ask("The Innkeeper grunts. \"Well met, " + user.username + ". Haven't seen you around here before. You mean to introduce yourself, and begin your adventure in Coneshire?\"", function(response,convo){
        newplayer(response,convo);
        convo.next();
        });
    } else {
        // known user continuing their quest
        convo.ask("Would you care to hear some `instructions`? Or just continue on to `town`?", function(response,convo){
        enter2(response,convo);
        convo.next();
        });
    }
}

newplayer = function(res,convo){
    var temp = res.text;
    if (temp==="yes" || temp==="y" || temp==="sure") {
        // starts a new player
        convo.say("The Innkeeper smacks the long bench with his palm. \"Excellent!\"");
        // set up the new player with charms and shit

        convo.ask("Say anything here.", function(res, convo){
            saving(res,convo);
            convo.next();
        });
    } else {
        // default
        convo.say("The Innkeeper's face falls. \"Sorry to hear that, stranger. Maybe another time.\"");
        console.log("END");
    }
}

enter2 = function(res,convo){
    // instructions or town
    var temp = res.text;
    if (temp==="instructions"){
        convo.say("The Innkeeper nods his head. \"Okay then. You may have many questions. What topic would you like explained? Let me pour you some ale, and I'll explain concepts like `Fighting`, Buying/using `merchandise`, `Interacting` with villagers, Interacting with other `wanderers`, `Magick` or General `Concepts`. Or you can just `continue` on to the Village of Coneshire.\"", function(res, convo){
        instructions(res,convo);
        convo.next();
    });
    } else if (temp==="town"){
        // go on to town
        convo.say("\"Good luck, wanderer. You'll need it.\"");
        convo.say("You exit the inn. Leaving its warm light behind, you continue down the dirt path, the first shoots of sunlight beginning to break through the trees. Soon, you come upon the Village of Coneshire.");
        townsquare(res, convo);
    } else {
        convo.repeat();
    }
}

townsquare = function(res,convo){
    convo.say("You're in the town square!");
}

// this is how you save shit:
// controller.storage.users.save({id: userid, res1: res.text });
    