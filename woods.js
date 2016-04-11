// woods

monster=undefined;
mhp = 0;
turns=0;

module.exports = {
	woodsstart: function(res,convo){
		convo.say("*-------------------------------------T H E  D A R K  W O O D S-------------------------------------*");
		convo.say("The wind rustles through the trees. A darkness settles over the dense forest as you make your way through...");
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
	convo.ask("`Hunt` for beasts, check your `status`, review your `supplies`, or return to `town`.", function(res,convo){
		woodsrouter(res,convo);
		convo.next();
		});
	} else {
		// user level is >=3
		convo.ask("`Hunt` for beasts, check your `status`, review your `supplies`, seek out the `Mage`'s Cave, or return to `town`.", function (res, convo){
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
    } else if (temp.includes('supplies')){
        woodssupplies(res,convo);
    } else if (temp.includes('mage') && user.level.level>=3 || user.mission==="grannon"){
    	// you only have access to the mage's cave in the grannon level 2 mission or at level 3 or above
        mage(res,convo);
    } else if (temp.includes('town')){
    	convo.say("Tiring of these forbidden woods, you head back towards the distant lights of town.");
        town.townsquare(res,convo);
    } else if (temp.includes('reminder')){
    	woodsmenu(res,convo);
    } else {
        convo.repeat();
    }
}

hunt = function(res,convo){
	if (user.mission==="grannon" && Math.random()>0.9){
		granfight();
	} else {
		monster = beasts.chooseBeastLevel();
		mhp = monster.hp;
		console.log("monster choice: " + monster.name);
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
		// TBA
	} else if (temp.includes("attack")){
		woodsfight(res,convo,1)
	} else if (x===3){
		// lancing magic you have from middle of a fight
	}
	else {
		convo.repeat();
	}
}

woodsfight = function(res,convo,turn){
	var temp = res.text.toLowerCase();
	if (turn===1){
		// player fight turn - haven't done this yet
		var result = userfight(monster);
		// kill the monster
		if (result === "k") {
			if (turns === 0) {
				console.log("kill single blow");
				convo.say("You vanquished the " + monster.name + " in a single blow!");
			}
			else { 
				console.log("kill");
				convo.say("You vanquished the " + monster.name + "!");
				woodsreward(res,convo);
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
			console.log("dead");
			convo.say("Oh no! The *" + monster.name + "* " + monster.strike1 + ", and it kills you!");
			// TBD
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
			var temp = showmagic();
			convo.say(temp);
			convo.ask("Enter the name of the magick you wish to lance, or use no magick at all and `attack` the old fashioned way.", function(res,convo){
				woodsfightrouter(res,convo,3);
				convo.next();
			});
		}
	}
}

woodsstatus = function(res,convo){
	convo.say(status());
	convo.ask("What next? (Want a `reminder`?)", function(res,convo){
	    woodsrouter(res,convo);
	    convo.next();
	});
}

woodssupplies = function(res,convo){
	var temp = showgear();
	if (temp === 0){
		convo.say("You have no items!");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
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
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
		    woodsrouter(res,convo);
		    convo.next();
		});
	} else {
		for (i=0;i<user.items.other.length;i++){
			if (user.items.other[i].name.includes(temp)){
				var temp = user.items.other.splice(i,1);
				var temp2 = utility.items(temp[0].name); 
				convo.say(temp2);
				// quicksave();
				convo.ask("What next? (Want a `reminder`?)", function(res,convo){
				    woodsrouter(res,convo);
				    convo.next();
				});
			} else {
				convo.say("Come again?");
				convo.repeat();
			}
		}
	}
}

woodsrun = function(res,convo){
	convo.say("You decide that discretion is the better part of valor, and turn tail in the opposite direction.");
	var rando = Math.random();
	console.log("run variable: " + rando);
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

userfight = function(monster){
	if (swordflag){
		// still working on this
		attackdamage = Math.round((user.items.weapon.attack * (Math.random()+ 1)) + user.attributes.strength - monster.defense);
	} else {
		attackdamage = Math.round((user.items.weapon.attack * (Math.random()+ 1)) + user.attributes.strength + fortune() - monster.defense);
	}
	console.log("user attack: " + attackdamage);
	turns++;
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
		damage = Math.round((monster.attack*((Math.random()+1)) - fortune() - user.items.armor.armor));
	}
	console.log("monster attack: " + damage);
	if (damage<=0){
		return "zip"
	} else {
		user.hp = user.hp - damage;
		if (user.hp <= 0) return "dead";
		else return damage;
	}
}

events = function(res,convo){
	// test to see if random events will happen
	var rando = Math.random();
	if (rando>=0.1 && rando<=0.9){
		// find magic stuff
		console.log("rubies event!");
		user.items.other.push(items.stuff.gems.rubies);
		user.items.rubies++
		convo.say("You discover precious rubies with the creature!");
		convo.next();
	}
}

fortune = function(x){
	if (x==="luck"){
		var temp = Math.random();
		if (user.attributes.luck!=0){
			temp += user.attributes.luck * 0.1;
		}
		console.log("luck var: " + temp);
		if (temp>=0.5){
			return true
		} else return false;
	} 
	else if (x==="char"){
		var temp = Math.random();
		if (user.attributes.charisma!=0){
			temp += user.attributes.charisma * 0.25;
		}
		console.log("charisma var: " + temp);
		if (temp>=0.5){
			return true
		} else return false;
	}
	else {
		// for adding variables in battle
		// spirits; berzerk; 
		var temp = Math.round(((Math.random()+1) + user.attributes.luck) + globalfortune);
		var temp2 = temp + batpoints;
		console.log("fortune points: " + temp2);
		return temp2;
	}
}

woodsreward = function(res,convo){
	// add gloating here
	convo.say("The " + monster.name + " lays dead before you. \n" +
		"You receive *" + xp() + "* experience from your feat of valor, and find *" + gold() + "* pieces of gold in the beast's innards.");
	user.turnsToday -= turns;
	events(res,convo);
	turns = 0;
	shieldflag=false;
	swordflag=false;
	woodsmenu(res,convo);
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

