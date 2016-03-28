// tavern

var tavern = require('./tavern');
var drinks = require('./lib/drinks');
var barlines = require('./lib/barlines');
var drink=false, tempdrink=undefined, stew = false, minst = false, list="";

module.exports = {

tavern: function(res,convo){
 	convo.say("*-------------------------------------T H E  T A V E R N-------------------------------------*");
	convo.say("The heavy oaken tavern door swings open with a low squeal. The crowded tavern's patrons nurse their drinks and carry on while a Minstrel plays in the back. A man with a large, scratchy beard stands behind the bar with a towel.");
	convo.say(">Well met, " + user.username + "!");
	convo.ask("What to do? You can `talk` with Dean the barkeep, order a `drink`, sit and `listen` to the bar's goings-on, ask the minstrel to play a `song`, look `around` at the wanderers in the Tavern, `inquire` casually about someone's whereabouts, `send` a drink to another player, or return to the `street`.", function(res,convo){
            tavernrouter(res,convo);
            convo.next();
        });
	}
}

// generalrouter = function(res, convo){
// 	convo.say("The heavy oaken tavern door swings open with a low squeal. The crowded tavern's patrons nurse their drinks and carry on while a Minstrel plays in the back. A man with a large, scratchy beard stands behind the bar with a towel.");
// 	convo.say(">Well met, " + user.username + "!");
// 	convo.ask("What to do? You can `talk` with Dean the barkeep, order a `drink`, sit and `listen` to the bar's goings-on, ask the minstrel to play a `song`, look `around` at the wanderers in the Tavern, `inquire` casually about someone's whereabouts, `send` a drink to another player, or return to the `street`.", function(res,convo){
//             tavernrouter(res,convo);
//             convo.next();
// 	});
// }

///////////////

tavernrouter = function(res,convo){
	var temp = res.text;
    if (temp.includes('talk')){
        talk(res,convo);
    } else if (temp.includes('drink')){
        drink(res,convo);
    } else if (temp.includes('listen')){
    	convo.say("You find a quiet seat out of the way, and take snippets of conversations from around the bar.");
        listen(res,convo);
    } else if (temp.includes('song')){
        minstrel(res,convo);
    } else if (temp.includes('around')){
        around(res,convo);
    } else if (temp.includes('inquire')){
        inquire(res,convo);
    } else if (temp.includes('send')){
        send(res,convo);
    } else if (temp.includes('reminder')){
        convo.ask("You can `talk` with Dean the barkeep, order a `drink`, sit and `listen` to the bar's goings-on, ask the minstrel to play a `song`, look `around` at the wanderers in the Tavern, `inquire` casually about someone's whereabouts, `send` a drink to another player, or return to the `street`.", function(res,convo){
            tavernrouter(res,convo);
            convo.next();
        });
    } else {
        convo.repeat();
    }
}

talk = function(res,convo){
	if (user.level.level===1){
		convo.say("You sidle up to the bar, catching Dean the Barkeep's eye. He saunters over to your end.")
		convo.say(">Great to see you, " + user.username + "! As a newcomer, you should explore town a bit. Understand what's here. Venturing into the Dark Forest will help you gain valuable skills, but be prepared to fight. After you have learned to use your " + user.items.weapon.name + " in combat, and gained some experience, I would recommend going to visit the Abbey. It's a terrible shame about the robbery there...");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
            tavernrouter(res,convo);
            convo.next();
        });
	} else if(user.level.level===2){
		convo.say("You sidle up to the bar, catching Dean the Barkeep's eye. He saunters over to your end.")
		convo.say(">If you hope to reach the level of Challenger, you'll have to arm yourself with something powerful. You should go see the Smithy about that. \nSome awful strange stories coming out of the goat farm east of town. Grannon, the farmer there, might be losing his mind. You should go and get to the bottom of it.</span>");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
            tavernrouter(res,convo);
            convo.next();
        });
	} else if(user.level.level===3){
		// tipz
	}
}

drink = function(res, convo){
	convo.say("Dean nods slowly, not looking up from the glass he's polishing. \n>Here's what we've got... \n1 - " + drinks.grog.name + " (" + drinks.grog.gold + " Gold)\n2 - " + drinks.ale.name + " (" + drinks.ale.gold + " Gold)\n3 - " + drinks.beer.name + " (" + drinks.beer.gold + " Gold)\n4 - " + drinks.whiskey.name + " (" + drinks.whiskey.gold + " Gold)\n5 - `None` of these?");
	convo.ask(">What'll you have, " + user.username + "?", function(res,convo){
		drinkrouter(res,convo);
		convo.next();
	});
}

drinkrouter = function(res,convo){
	var temp = res.text;
	if (temp.includes("1")) {
		if (user.gold < 5){ insufficientfunds() }
		else {		
			user.gold = user.gold - 5;
			convo.say("Dean grimaces. \n>That kind of day, eh friend? Well... cup of Greb's Grog... if you insist... coming right up. \nHe slides a small glass of lukewarm, putrid green liquid towards you. \nIt scorches your throat going down.");
			convo.ask("What next? (Want a `reminder`?)", function(res,convo){
	            tavernrouter(res,convo);
	            convo.next();
	        });
		}
	} else if (temp.includes("2")) {
		if (user.gold < 10){ insufficientfunds() }
		else {		
			user.gold = user.gold - 10;
			convo.say("Dean nods. \n>Pint of Aemon's Ale, coming up! Important part of any day's honest work. There you go. \nHe slides a glass of opaque brown ale towards you. \nIt tastes wholesome.");
			convo.ask("What next? (Want a `reminder`?)", function(res,convo){
	            tavernrouter(res,convo);
	            convo.next();
	        });
		}
	} else if (temp.includes("3")) {
		if (user.gold < 15){ insufficientfunds() }
		else {		
			user.gold = user.gold - 15;
			convo.say("Dean nods. \n>Tankard of Burt's Beer, coming up! Very tasty stuff, y'ask me. Enjoy. \nHe slides a glass of frothy cold beer towards you. \nYou feel refreshed.");
			convo.ask("What next? (Want a `reminder`?)", function(res,convo){
	            tavernrouter(res,convo);
	            convo.next();
	        });
		}
	} else if (temp.includes("4")) {
		if (user.gold < 25){ insufficientfunds() }
		else {		
			user.gold = user.gold - 25;
			convo.say("Dean smiles. \n>Glass of our finest Top's White Whiskey, coming up! Great choice, that one. \nHe slides a glass of smooth, golden liquid towards you. \nIt tastes mysterious, yet inviting.");
			convo.ask("What next? (Want a `reminder`?)", function(res,convo){
	            tavernrouter(res,convo);
	            convo.next();
	        });
		}
	} else if (temp.includes("none")) {
		convo.say("Dean shrugs. \n>Suit yourself.");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
	        tavernrouter(res,convo);
	        convo.next();
	    });
	} else {
		convo.say("Come again?");
		convo.repeat();
	}
}

insufficientfunds = function(){
	convo.say("Dean looks at you askance. \n>Afraid this is a cash-only establishment, friend. And you don't seem to have it.");
	convo.repeat();
}

listen = function(res,convo){
	convo.say(barlines.line());
	convo.say(barlines.line());
	convo.say(barlines.line());
	convo.ask("What next? (Want a `reminder`?)", function(res,convo){
	    tavernrouter(res,convo);
	    convo.next();
	});
}

minstrel = function(res,convo){
	console.log("minst var: " + minst);
	convo.say("A jolly, bearded Minstrel strums his gittern near the tavern's corner fireplace. He bows deeply to you as you approach. \n>Sit, friend, and hear a song of adventure and woe...");
	convo.ask("You can `request` a song, give him a `tip` of precious stones, or `return` to the bar.", function(res,convo){
	        minstrelrouter(res,convo);
	        convo.next();
	    });
}

minstrelrouter = function(res,convo){
	var temp = res.text;
	if (temp.includes("request")){
		if (!minst){
			var rando = Math.random();
			console.log("rando set to: " + rando);
			if (rando <=0.33){
				convo.say("The Minstrel pauses for a moment, gazes wistfully into the distance, and strums his rendition of \"The Mummer's Lament.\"");
			} else if (rando >0.33 && rando <=0.66){
				convo.say("The Minstrel grins and excitedly launches into a rousing version of \"The Red Dragon's Tale.\" The bar goes wild and sings along!");
			} else if (rando >0.66){
				convo.say("The Minstrel thinks for a moment, and then yodles a heartfelt stanza of \"The Knight's Sweetheart.\"");
			}
			if (rando <=0.1){
				user.turnsToday += 3;
				convo.say("You receive 3 more turns today!");
			} else if (rando >=0.95) {
				var rando2 = Math.random();
				if (rando2<0.25){
					user.attributes.charisma += 1;
					convo.say("You suddenly feel witter, funnier, and more charming!");
				} else if (rando2>=0.25 && rando2<0.5){
					user.attributes.luck += 1;
					convo.say("You feel like playing the lottery...");
				} else if (rando2>=0.5 && rando2<0.75){
					user.attributes.strength += 1;
					convo.say("Your muscles bulge beneath your " +  user.items.armor.name + "!");
				} else {
					user.attributes.myst += 1;
					convo.say("You can hear the music of the spheres more clearly now...");
				}
			} else if (rando>0.1 && rando<0.15) {
				user.bank.deposit = user.bank.deposit * 2;
				convo.say("Somewhere, magic has happened!");
			} else {
				convo.say("Your spirit feels refreshed.");
			} 
			minst = true;
			console.log("convo repeat fires");
			convo.repeat();
		} else {
			// minst is true
			convo.say("The Minstrel has already played for you today, and now entertains other tavern patrons.");
			console.log("convo repeat fires");
			convo.repeat();
		}
	} else if (temp.includes("tip")){
		var temp;
		if (findgems()){
			var temp2 = Math.round((Math.random()*3));
			if (temp2===0){
				user.attributes.luck += 1;
			} else if (temp2===1){
				user.attributes.strength += 1;
			} else if (temp2===2){
				user.attributes.charisma += 1;
			} else if (temp2===3){
				user.attributes.myst += 1;
			}
			user.items.other.splice(temp,1);
			convo.say("You discreetly hand the Minstrel your small pouch of rubies. He bows deeply in receipt. \n>Why, dear Patron, you honor me. Allow me to sing this ballad in your honor! \nThe Minstrel sings a great, stirring tale of your bravery and courage!");
			convo.say("You are a patron of the arts. *1 point* has been added to one of your attributes!");
			convo.repeat();
		} else {
			convo.say("You have no gems to give him!");
			convo.repeat();
		}
	} else if (temp.includes("return")){
		convo.say("The heavy oaken tavern door swings open with a low squeal. The crowded tavern's patrons nurse their drinks and carry on while a Minstrel plays in the back. A man with a large, scratchy beard stands behind the bar with a towel.");
		convo.say(">Well met, " + user.username + "!");
		convo.ask("What to do? You can `talk` with Dean the barkeep, order a `drink`, sit and `listen` to the bar's goings-on, ask the minstrel to play a `song`, look `around` at the wanderers in the Tavern, `inquire` casually about someone's whereabouts, `send` a drink to another player, or return to the `street`.", function(res,convo){
            tavernrouter(res,convo);
            convo.next();
	    });
	} else {
		convo.say("Come again?");
		convo.repeat();
	}
}

findgems = function(){
	if (user.items.other.length === 0){
		return false
	} else {
		for (i=0; i<user.items.other.length;i++){
			if (user.items.other[i].name === "Precious rubies"){
				temp = i;
				return true;
			}
		}
	}
}



