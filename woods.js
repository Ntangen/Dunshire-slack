// woods

monster=undefined;
mhp = 0;
turns=0;

module.exports = {
	woodsstart: function(res,convo){
		if (user.turnsToday<=0){
			convo.say("You are fatigued! You must keep inside town until tomorrow.");
			town.townsquare(res,convo);
		} else {
			convo.say("*-------------------------------------T H E  D A R K  W O O D S-------------------------------------*");
			convo.say("The wind rustles through the trees. A darkness settles over the dense forest as you make your way through...");
			woodsmenu(res,convo);	
		}
	},
	gohunt: function(res,convo){
		hunt(res,convo);
	}
}
	

woodsmenu = function(res,convo){
	if (user.turnsToday<=0){
		convo.say("You are fatigued! You must keep inside town until tomorrow.");
		town.townsquare(res,convo);
	} else {
		var temp = "";
		if (user.mission==="abbey"){
			if (missioncomplete){
				convo.say("*Don't forget to return the Cleric's censer at the Abbey!*")
			} else {
				temp +="Search for the `bandits` who stole the Cleric's censer, ";
			}
		} else if (user.mission==="grannon"){
			temp +="Follow Grannon's directions to the Cave of the `Mage`, ";
		} else if (user.mission==="morgan"){
			temp +="Search for Morgan's Quercus `tree`, ";
		}
		temp += "`Hunt` for beasts, check your `status`, review your `supplies`, or return to `town`.";
		convo.ask(temp, function(res,convo){
			woodsrouter(res,convo);
			convo.next();
		});
	}
}

woodsrouter = function(res, convo){
	quicksave();
	var temp = res.text.toLowerCase();
    if (temp.includes('hunt')){
        hunt(res,convo);
    } else if (temp.includes('status')){
        woodsstatus(res,convo);
    } else if (temp.includes('bandits') && user.mission==='abbey'){
        hunt(res,convo,1);
    } else if (temp.includes('supplies')){
        woodssupplies(res,convo);
    } else if (temp.includes('mage') && user.level.level>=3 || user.mission==="grannon"){
    	// you only have access to the mage's cave in the grannon level 2 mission or at level 3 or above
        mage.mage(res,convo);
    } else if (temp.includes('town')){
    	convo.say("Tiring of these forbidden woods, you head back towards the distant lights of town.");
        town.townsquare(res,convo);
    } else if (temp.includes('tree') && user.mission==='morgan'){
    	apot.quercuswoodsturns(res,convo);
    } else if (temp.includes('reminder')){
    	woodsmenu(res,convo);
    } else {
        convo.repeat();
    }
}

hunt = function(res,convo,x){
	if (x===1){
		// abbey mission - hunting bandits
		if (aturns===0){
			convo.say("Following the Cleric's tip, you head east in the woods, hoping to find some sign of the thieves who stole the Abbey's censer.");
			hunt(res,convo);
		} else if (aturns===1){
			convo.say("You're tracking the thieves' trail! Their camp can't be too far away...");
			hunt(res,convo);
		} else if (aturns===2){
			convo.say("You round a corner, and there they are! The two common-looking thieves have been expecting you - and their shortswords are already unsheathed. You see the Cleric's censer behind them in a bag! \nThe bandits rush towards you!");
			monster = beasts.beasts.lev1b;
			console.log("(" + user.username + ") boss lev1b: " + beasts.beasts.lev1b);
			console.log("(" + user.username + ") bossmonster: " + monster);
			mhp = monster.hp;
			if (Math.random() < 0.7){
				// player gets first shot
				convo.say("You ready your " + user.items.weapon.name + " in time to strike first!");
				woodsfight(res,convo,1)
			} else {
				// monster gets first shot
				convo.say("The " + monster.name + " are too fast for you, and manage to strike first!");
				woodsfight(res,convo,2)
			}
		}
	} else if (x===2){
		// (user.mission==="grannon" && Math.random()>0.9){
		granfight();
		// return here?
	} else {
		// your typical fight
		monster = beasts.chooseBeastLevel();
		mhp = monster.hp;
		console.log("(" + user.username + ") monster choice: " + monster.name);
		convo.say("You hear a rustling nearby. Something draws near. You make ready as you turn your head and see...\n" +
			"*A " + monster.name + " approaches!* _What do you do?_\n" +
			"```Your hitpoints: " + user.hp + "\n" +
			monster.name +"'s hitpoints: " + mhp + "```"
			);
		convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
			woodsfightrouter(res,convo);
			convo.next();
		});
	}
}

woodsfightrouter = function(res,convo,x){
	var temp = res.text.toLowerCase();
	if (temp.includes("run")){
		woodsrun(res,convo)
	} else if (temp.includes("magick")){
		if (user.items.magic.length===0){
			convo.say("You have no knowledge of magicks yet!");
			convo.repeat();
		} else {
			woodsfight(res, convo, "m");
		}
	} else if (temp.includes("attack")){
		woodsfight(res,convo,1)
	} else {
		convo.repeat();
	}
}

woodsfight = function(res,convo,turn){
	var temp = res.text.toLowerCase();
	if (turn===1){
		// player turn 
		var result = userfight(monster);
		// kill the monster
		if (result === "k") {
			if (turns === 0) {
				console.log("(" + user.username + ") kill single blow");
				convo.say("You vanquished the " + monster.name + " in a single blow!");
			}
			else { 
				console.log("(" + user.username + ") kill");
				convo.say("With a heroic blow, you vanquish the " + monster.name + "!");
				woodsreward(res,convo);
				convo.next();
			}	
		} else if (result==="zip"){
		// strike, 0 damage
			convo.say("You uselessly strike at " + monster.name + " with your " + user.items.weapon.name + " but hilariously inflict no damage!");
		}
		// strike don't kill
		else { 
			convo.say("You strike at *" + monster.name + "* with your " + user.items.weapon.name + " and inflict " + result + " damage!");
			woodsfight(res,convo,2);
			convo.next();
			}
	} else if (turn===2){
		// monster turn
		var result = monsterfight(monster)
		if (result === "dead"){
			console.log("(" + user.username + ") dead");
			convo.say("Oh no! The *" + monster.name + "* " + monster.strike1 + ", and it kills you!");
			death(res,convo);
			convo.next();
		}
		else if (result==="zip"){
			convo.say("The *" + monster.name + "* " + monster.strike1 + ", but your armor protects you! You sustain 0 damage! \n" +
				"```Your hitpoints: " + user.hp + "\n" +
				monster.name +"'s hitpoints: " + mhp + "```");
			convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
				woodsfightrouter(res,convo);
				convo.next();
			});
		} else {
			// monster strikes with damage, no kill
			if (shieldflag){
				convo.say("The *" + monster.name + "* " + monster.strike1 + ", inflicting " + result + " damage! Your Egregious Shield absorbs part of the blow.");
			} else {
				convo.say("The *" + monster.name + "* " + monster.strike1 + ", inflicting " + result + " damage!");
			}
			convo.say("```Your hitpoints: " + user.hp + "\n" +
				monster.name +"'s hitpoints: " + mhp + "```");
			convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
				woodsfightrouter(res,convo);
				convo.next();
			});
		}
	} else if (turn==="m"){
		// invoke magick
		if (user.items.magic.length===0){
			convo.say("You have no knowledge of magicks yet!");
			convo.repeat();
		} else {
			var temp = utility.showmagic();
			convo.say(temp);
			convo.ask("Enter the name of the magick you wish to lance, or use no magick at all and `attack` the old fashioned way.", function(res,convo){
				lancemagic(res,convo,"show");
				convo.next();
			});
		}
	}
}

woodsstatus = function(res,convo){
	convo.say(utility.status());
	convo.ask("The Dark Woods are quiet, but menacing. What next? (Want a `reminder`?)", function(res,convo){
	    woodsrouter(res,convo);
	    convo.next();
	});
}

woodssupplies = function(res,convo){
	var temp = utility.showgear();
	if (temp === 0){
		convo.say("You have no items!");
		convo.ask("The Dark Woods are quiet, but menacing. What next? (Want a `reminder`?)", function(res,convo){
		    woodsrouter(res,convo);
		    convo.next();
		});
	} else {
		convo.say(temp)
		convo.ask("Enter the name of any item you want to use, or `none`.", function(res,convo){
		    woodsusegear(res,convo);
		    convo.next();
		});
	}
}

woodsusegear = function(res,convo){
	var temp = res.text.toLowerCase();
	if (temp.includes('none')){
		convo.ask("The Dark Woods are quiet, but menacing. What next? (Want a `reminder`?)", function(res,convo){
		    woodsrouter(res,convo);
		    convo.next();
		});
	} else {
		var temp2=0;
		for (i=0;i<user.items.other.length;i++){
			if (user.items.other[i].name.includes(temp)){
				var temp2 = user.items.other.splice(i,1);
				break;
			}
		}
		if (temp2===0){
			convo.say("Come again?");
			convo.repeat();
		} else {
			var temp3 = utility.items(temp2[0].name);
			quicksave();
			convo.say(temp3);
			convo.ask("The Dark Woods are quiet, but menacing. What next? (Want a `reminder`?)", function(res,convo){
			    woodsrouter(res,convo);
			    convo.next();
			});
		}
	}
}

userfight = function(monster){
	if (swordflag){
		// still working on this
		attackdamage = Math.round((user.items.weapon.attack * (Math.random()+ 1)) + user.attributes.strength - monster.defense);
	} else {
		attackdamage = Math.round((user.items.weapon.attack * (Math.random()+ 1)) + user.attributes.strength + utility.fortune() - monster.defense);
	}
	console.log("(" + user.username + ") user attack: " + attackdamage);
	turns++;
	console.log("(" + user.username + ") turns: " + turns);
	if (attackdamage<=0){
		return "zip"
	} else {
		mhp = mhp - attackdamage;
		if (mhp <= 0) return "k";
		else return attackdamage;
	}
}

monsterfight = function(monster){
	if (shieldflag){
		damage = Math.round((monster.attack*((Math.random()+1)) - user.items.armor.armor)*.75);
	} else {
		damage = Math.round((monster.attack*((Math.random()+1)) - utility.fortune() - user.items.armor.armor));
	}
	console.log("(" + user.username + ") monster attack: " + damage);
	if (damage<=0){
		return "zip"
	} else {
		user.hp = user.hp - damage;
		if (user.hp <= 0) return "dead";
		else return damage;
	}
}

woodsrun = function(res,convo){
	convo.say("You decide that discretion is the better part of valor, and turn tail in the opposite direction.");
	var rando = Math.random();
	console.log("(" + user.username + ") run variable: " + rando);
	if (rando >= 0.75) {
		convo.say("Oh no! You failed to outrun the " + monster.name + ".\n");
		woodsfight(res,convo,2);
		}
	else { 
		convo.say("Whew - that was close!");
		user.turnsToday -= turns;
		turns = 0;
		woodsmenu(res,convo);
		}
}

woodsevents = function (res,convo){
	// test to see if random events will happen
	var rando = Math.random();
	if (rando>=0.1 && rando<=0.25){
		// find magic stuff
		console.log("(" + user.username + ") rubies event!");
		user.items.other.push(items.stuff.gems.rubies);
		user.items.rubies++
		convo.say("You discover precious rubies with the creature!");
		convo.next();
	}
}

woodsreward = function(res,convo){
	// add gloating here
	if (monster === beasts.beasts.lev1b){
		convo.say("You parry their thrust and make a final, skillful blow with your " + user.items.weapon.name + ", slaying the two thieves! They will never burlarize the Abbey ever again. \nYou collect their bag, feeling the Cleric's censer inside. You should return it to the *Abbey* right away!");
		missioncomplete = true;
		monster=undefined;
		user.turnsToday -= turns;
		turns = 0;
		woodsmenu(res,convo);
	} else {
		convo.say("The " + monster.name + " lays dead before you. \n" +
			"You receive *" + xp() + "* experience from your feat of valor, and find *" + gold() + "* pieces of gold in the beast's innards.");
		if (user.mission==="abbey"){
			aturns++
		}
		user.turnsToday -= turns;
		console.log("(" + user.username + ") user turns: " + user.turnsToday);
		if (user.turnsToday<0){
			user.turnsToday=0;
		}
		woodsevents(res,convo);
		monster=undefined;
		turns = 0;
		shieldflag=false;
		swordflag=false;
		woodsmenu(res,convo);
	}
}

xp = function(){
	if (Math.random() >= 0.5){
		var x = Math.round((Math.random()*(monster.hp / 3))) // for exp
	}
	else {
		var x = -1*(Math.round((Math.random()*(monster.hp / 3)))); // for exp
	}
	var temp = monster.xp + x;
	user.xp += temp;
	return temp;
}

gold = function(){
	if (Math.random() >= 0.5){
 		var temp = Math.round((Math.random()+1)*monster.attack); // for gold
	}
	else {
		var temp = -1*(Math.round((Math.random()+1)*monster.attack)); // for gold
	}
	var gelt = monster.gold + temp;
	user.gold += gelt;
	return gelt;
}

//////////////////////////////
//
// DOING MAGICK
//
////////////////////////////

lancemagic = function(res, convo, x){
	var temp = res.text.toLowerCase();
	if (temp.includes('attack')){
		woodsfight(res,convo,1);
	} else if (x==="show"){
		convo.ask("Which magick do you wish to invoke?" +
			"\n " + utility.showmagic() + "\nOr you can `change` your mind.", function(res,convo){
				lancemagic(res,convo);
				convo.next();
		});
	} else if (temp.includes("change")){
		convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
				woodsfightrouter(res,convo);
				convo.next();
		});
	} else if (!utility.hasmagic(temp)){
		// user does not own the spell they input
		convo.say("This magick is yet unknown to you!");
		convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
				woodsfightrouter(res,convo);
				convo.next();
			});
	} else if (temp.includes("thunderous")){
		if (user.turnsToday<=spellz.clap.turnsreq) {
			convo.say("You do not have enough turns left today to invoke this magick.")
			convo.repeat();
			// confirm that this goes back to "which magick" question
		} else {
			attackdamage = spellz.clap.attack - monster.defense
			console.log("user attack: " + attackdamage);
			turns += spellz.clap.turnsreq;
			mhp = mhp - attackdamage;
			convo.say("Summoning up the old words, you lance the Thunderous Clap upon the " + monster.name + ", bringing down a calamitous din upon its ears!" +
				"\n You inflict " + attackdamage + " damage!");
			if (mhp <= 0) {
				// damage the monster & kill
				console.log("(" + user.username + ") kill");
				convo.say("With a heroic blow, you vanquish the " + monster.name + "!");
				woodsreward(res,convo);
			} else {
				// damage the monster, don't kill
				woodsfight(res,convo,2);
			}
		}
	} else if (temp2.includes("shield")){
		if (user.turnsToday<=spellz.shield.turnsreq) {
			convo.say("You do not have enough turns left today to invoke this magick.")
			convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
				woodsfightrouter(res,convo);
				convo.next();
			});
		} else if (shieldflag){
			convo.say("You have already invoked this magick.");
			convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
				woodsfightrouter(res,convo);
				convo.next();
			});
		} else {
			shieldflag=true;
			turns += spellz.shield.turnsreq;
			convo.say("Summoning up the old words, you lance the Egregious Shield incantation, cloaking yourself in a blue protective haze of magick.");
			convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
				woodsfightrouter(res,convo);
				convo.next();
			});
		}
	} else if (temp2.includes("words")){
		if (user.turnsToday<=spellz.words.turnsreq) {
			convo.say("You do not have enough turns left today to invoke this magick.")
			convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
				woodsfightrouter(res,convo);
				convo.next();
			});
		} else {
			turns += spellz.heal.turnsreq;
			user.hp = user.level.maxhp;
			quicksave();
			convo.say("Summoning up the old words, you lance the Curative Words incantation, healing yourself fully.");
			convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
				woodsfightrouter(res,convo);
				convo.next();
			});
		}
	} else if (temp2.includes("sword")){
		// we don't have this level yet
	} else {
		convo.repeat();
	}
}

