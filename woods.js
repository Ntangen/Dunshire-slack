// woods

var town = require('./town');

monster=undefined;
mhp = 0;
turns=0;

module.exports = {
	woodsstart: function(res,convo){
		convo.say("*-------------------------------------T H E  D A R K  W O O D S-------------------------------------*");
		convo.say("The wind rustles through the trees. A darkness settles over the forest as you make your way through...");
		woodsmenu(res,convo);	
	}
}

woodsmenu = function(res,convo){
	if (user.level.level<3){
		if (user.mission==="abbey"){
			if (missioncomplete){
				convo.say("Don't forget to return the Cleric's censer at the Abbey!")
			} else {
				convo.say("Search for the `bandits` who stole the Cleric's censer.")
			}
		} else if (user.mission==="grannon"){
			convo.say("Follow Grannon's directions to the `Mage`'s Cave.")
		}
	convo.ask("`Hunt` for beasts, check your `status`, review your `supplies`, or `return` to town.", function(res,convo){
		woodsrouter(res,convo);
		convo.next();
	});
	} else {
		// user level is >=3
		convo.ask("`Hunt` for beasts, check your `status`, review your `supplies`, seek out the `Mage`'s Cave, or `return` to town.", function (res, convo){
			woodsrouter(res,convo);
			convo.next();
		});
	}
}

woodsrouter = function(res, convo){
	quicksave();
	var temp = res.text;
    if (temp.includes('hunt')){
        hunt(res,convo);
    } else if (temp.includes('status')){
        woodsstatus(res,convo);
    } else if (temp.includes('supplies')){
        supplies(res,convo);
    } else if (temp.includes('mage') && user.level.level>=3 || user.mission==="grannon"){
    	// you only have access to the mage's cave in the grannon level 2 mission or at level 3 or above
        mage(res,convo);
    } else if (temp.includes('return')){
    	convo.say("Tiring of these forbidden woods, you head back towards the distant lights of town.");
        town.townsquare(res,convo);
    } else if (temp.includes('reminder')){
    	woodsmenu();
    } else {
        convo.repeat();
    }
}

hunt = function(res,convo){

}

woodsstatus = function(res,convo){
	convo.say(status());
	convo.ask("What next? (Want a `reminder`?)", function(res,convo){
	    woodsrouter(res,convo);
	    convo.next();
	});
}

woodssupplies = function(res,convo){
	convo.say(showgear());
	convo.ask("Enter the name of any item you wish to use, or `none` if you have changed your mind.", function(res,convo){
		woodssuppliesrouter(res,convo)
		convo.next();
	});
}

mage = function(res,convo){
	
}


