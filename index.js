// Coneshire bot!

// get those modules
var Store = require('jfs');
user = require('./lib/user');
var town = require('./town');
var tavern = require('./tavern');
var arms = require('./lib/armaments');
var levs = require('./lib/levels');

// KEY PLAYER VARIABLES

var reply, reply2, input, userid, msg;


// user stuff here

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

    // welcome function
    welcome = function(res,convo){
        convo.ask("Welcome! Do you wish to venture on to Coneshire?", [
        {
            pattern: bot.utterances.yes,
            callback: function(res,convo){
                enter(res,convo);
                convo.next();
           }
        },
        { 
            pattern: bot.utterances.no,
            callback: function(res,convo){
                convo.say("Okay then!");
                convo.next();
           }
        },
        { 
            default: true,
            callback: function(res,convo){
                convo.repeat();
                convo.next();
           }
        }
        ]); 
        convo.on('end', function(convo){
            if (convo.status==='completed'){
                console.log("Looks like we're done here. Cheers! 🍺");
            } else if (convo.status==='stopped'){
                console.log("looks like the convo stopped");
            }
        });
    };

    // get user collection; check knownPlayer flag; if none, set basic info
    controller.storage.users.get(userid, function(err,user_data){
        var temp = user_data;
        if (temp===undefined){
            // no record for this user, so we'll set one up
            user.knownPlayer = false
            console.log("this is not a known player");
            // grab some deets real quick, saves to user var
            bot.api.users.info({'user':userid},function(err,res){
                user.username = res.user.name;
                user.email = res.user.profile.email;
                controller.storage.users.save({id: userid, user:user});
            });
        } else {
            // found a record for user
            user = temp.user
            console.log("user.username: " + user.username);
        }
    });

    bot.startConversation(message, welcome);

});

// grab some deets real quick
// bot.api.users.info({'user':userid},function(err,res){
// user.name = res.user.name;
// user.email = res.user.profile.email;
// controller.storage.users.save({id: userid, user});

enter = function(res, convo){
    convo.say("Great! Let's go! 🐲");
    convo.say("You're walking down a dirt path. It's nighttime, and cool out. The crickets are chirping around you. There's a soft light up ahead. As you get a little closer, the yellow light of a small country inn beckons. You open the small metal gate and walk into the inn's yard. There are torches about lighting the way, and the sound of voices talking and laughing inside.");
    convo.say("As you enter, The Innkeeper looks up from where he's clearing a table.");
    console.log("user.knownPlayer is set to " + user.knownPlayer);
    if (!user.knownPlayer){
        convo.ask("The Innkeeper grunts. \n>Well met, " + user.username + ". Haven't seen you around here before. You mean to introduce yourself, and begin your adventure in Coneshire?", [
        {
            pattern: convo.task.bot.utterances.yes,
            callback: function(res,convo){
                newplayer(res,convo);
                convo.next();
           }
        },
        { 
            pattern: convo.task.bot.utterances.no,
                callback: function(res,convo){
                convo.say("The Innkeeper's face falls. \"Sorry to hear that, stranger. Maybe another time.\"");
                console.log("END");
                convo.next();
           }
        },
        { 
            default: true,
            callback: function(res,convo){
                convo.repeat();
                convo.next();
           }
        }
        ]);
    } else {
        // known user continuing their quest
        convo.ask(">*Well met, " + user.username + "!* Good to see you again. Would you care to hear some `instructions`? Or just continue on to `town`?", function(response,convo){
        enter2(response,convo);
        convo.next();
        });
    }
}

newplayer = function(res,convo){
    convo.say("The Innkeeper smacks the long bench with his palm. \"Excellent!\"");
    // set up the new player with charms and shit
    // convo.ask("TBA.", function(res, convo){
    //     saving(res,convo);
    //     convo.next();
    // });
    user.knownPlayer = true;
    controller.storage.users.save({id: userid, user:user});
    convo.next();
}

enter2 = function(res,convo){
    // instructions or town
    var temp = res.text;
    if (temp==="instructions"){
        convo.ask("The Innkeeper nods his head. \n>Okay then. You probably lots of questions. What topic would you like explained? Let me pour you some ale, and I'll explain concepts like the `village` of Coneshire, `fighting`, Buying/using `merchandise`, interacting with `townsfolk` or other `wanderers`, `magick` or general `concepts`. Or you can just `continue` on to the Village of Coneshire.\"", function(res, convo){
            instructions(res,convo);
            convo.next();
    });
    } else if (temp==="town"){
        // go on to town
        convo.say(">Good luck, wanderer. You'll need it.\"");
        convo.say("You exit the inn. Leaving its warm light behind, you continue down the dirt path, the first shoots of sunlight beginning to break through the trees. Soon, you come upon the Village of Coneshire.");
        town.townsquare(res, convo);
    } else {
        convo.repeat();
    }
}

instructions = function(res,convo){
    var temp = res.text;
    if (temp.includes('village')){
        convo.say(">The Village of Dunshire is a peaceful place - mostly. There are several small merchants in town for you to meet, as well as places to explore. As you become more experienced, you will discover some that you hadn't noticed at first. The Village is surrounded by the Dark Woods. The Woods are inhabited by a fearsome variety of beasts - from the [insert beast name] to the [other beast name] and many more. You will need to acquire better weapons, armor and more to defeat them all as time goes on. \nThere are other towns beyond the Dark Woods, of course. But you needn't worry about them for now.\n");
        convo.ask("What can I answer next? (Want a `reminder`?)", function(res,convo){
            instructions(res,convo);
            convo.next();
        });
    } else if (temp.includes('fighting')) {
        convo.say(">As you make your way through the Village, the Dark Woods and elsewhere, you may be called upon to defend yourself. Fighting - whether it be with beasts in the Dark Woods or anywhere else - is straightforward. If you are lucky and/or skilled, you may have an opportunity to make the first strike - or not. You may be able to run away in the middle of a battle if your health runs low (but there's no guarantee you'll succeed). You cannot use your extra gear in the middle of a battle - doing so would require dropping your guard! Defeating opponents will earn you gold and experience. The more formidable the opponent, the more gold and experience. You may run around the Dark Woods slaying as many squirrels as you like, but it will not make you rich.\n");
        convo.ask("What can I answer next? (Want a `reminder`?)", function(res,convo){
            instructions(res,convo);
            convo.next();
        });
    } else if (temp.includes('merchandise')) {
        convo.say("There is a wide array of merchandise available to buy, both in the Village and... elsewhere. Weapons, armor, healing medications, food and drink, and much more. For merchandise that is not consumed immediately, they are available in your supplies, which are accessible whenever you are not actively in battle. If you die, your supplies remain with you when you recover the next day. See Game Concepts for more on... death.\n");
        convo.ask("What can I answer next? (Want a `reminder`?)", function(res,convo){
            instructions(res,convo);
            convo.next();
        });
    } else if (temp.includes('townsfolk')) {
        convo.say("There are many inhabitants of the Village for you to meet. Some are very friendly - like my brother Dean! Others... ahem, may not be. Every person in the village may be able to help - or harm - you, often in ways you may not expect. Look for clues as time goes on. In some cases, their responses may change, depending on your level of experience or actions elsewhere. Here's a free tip: ask my big brother, Dean, up in the Tavern for a cup of his famous *Brunswick Stew*.\n");
        convo.ask("What can I answer next? (Want a `reminder`?)", function(res,convo){
            instructions(res,convo);
            convo.next();
        });
    } else if (temp.includes('wanderers')) {
        convo.say("You are not the only wanderer to arrive here, " + user.username + ". There are others like you here. You can find out who else is wandering about the Village by asking at the Tavern. If you wish, you can send your fellow wanderer a drink. Or, if you're so inclined, you can attempt to go stalk another fighter in the fields where most strangers make camp, and murder them in their sleep. You will need to attain at least the rank of Apprentice (Level 2) to do this, however. We don't need a bloodbath on our hands. \nWhen one fighter defeats another in hand-to-hand combat, *half* of the defeated's gold goes to the victor. The victor also receives 20% of the defeated's experience points, though the latter *does not* lose any points.\n");
        convo.ask("What can I answer next? (Want a `reminder`?)", function(res,convo){
            instructions(res,convo);
            convo.next();
        });
    } else if (temp.includes('magick')) {
        convo.say("There is magick here. \nA person's aptitude for invoking magick is determined by their Mysticism (see Game concepts for more on attributes). Some magicks can only be invoked by a person powerful in Mysticism, while others are easier. Some magicks are defensive. Others are offensive. Some are neither. You may invoke magick during battles, except while challenging (or ambushing?) other players in the camps. Magick is taxing on the humours, and diminishes your stamina. Invoking magick in battle will cost a certain number of your daily turns - the exact amount depends on the magick. Because magick is so demanding, a requisite level of Mysticism is required for each one.\n");
        convo.ask("What can I answer next? (Want a `reminder`?)", function(res,convo){
            instructions(res,convo);
            convo.next();
        });
    } else if (temp.includes('concepts')) {
        convo.say("Should you die here, don't panic. You will recover the next day. While you will not lose any of your supplies, you may lose some gold that is on your person, and not stored at the Bank. Gold stored at the Bank is safe... for the most part. \nIn Coneshire, as anywhere, the ultimate metric of progress is time. You begin with 20 turns in battle each day, which can be used in the Dark Woods, fighting other adventurers or in other places. Just spending time in the Village (for example, at the Tavern or in the Abbey) does not incur turns.If you run out of turns, don't worry - they reset each day. \nYou advance in rank by completing missions, which you qualify for by gaining experience (usually in the Dark Woods). As you gain experience, the weaker creatures in the Woods will flee, and the more powerful ones will be attracted to you. Beware. \nEvery adventurer has certain attributes that they can develop over the course of their time in Dunshire. They are Strength, Luck, Charisma and Mysticism. Strength is useful during combat. Luck makes you more likely to encounter good fortune. Charisma can trigger more favorable encounters with other characters. Mysticism increases a person's aptitude and stamina in magick.\n");
        convo.ask("What can I answer next? (Want a `reminder`?)", function(res,convo){
            instructions(res,convo);
            convo.next();
        });
    } else if (temp.includes('instructions')) {
        convo.say("I can explain concepts like the `village` of Coneshire, `Fighting`, Buying/using `merchandise`, `Interacting` with villagers, Interacting with other `wanderers`, `Magick` or General `Concepts`. Or you can just `continue` on to the Village of Coneshire.\"", function(res,convo){
            instructions(res,convo);
            convo.next();
        });
    } else if (temp.includes('continue')) {
        // go on to town
        convo.say("\"Good luck, wanderer. You'll need it.\"");
        convo.say("You exit the inn. Leaving its warm light behind, you continue down the dirt path, the first shoots of sunlight beginning to break through the trees. Soon, you come upon the Village of Coneshire.");
        town.townsquare(res, convo);
    } else if (temp.includes('reminder')) {
        // reminder of topics
        convo.ask("Sure. Have some more ale. I can explain concepts like the `village` of Coneshire, `fighting`, Buying/using `merchandise`, interacting with `townsfolk` or other `wanderers`, `magick` or general `concepts`. Or you can just `continue` on to the Village of Coneshire.\"", function(res,convo){
            instructions(res,convo);
            convo.next();
        });
    } else {
        convo.repeat();
    }
}

// townsquare = function(res,convo){
//     convo.say("You're in the town square!");
// }



