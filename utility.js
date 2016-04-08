// utility funcs

var items = require('./lib/items');

module.exports = {

	items: function(x){
		var temp2;
		if (x === "Healing elixir"){
			if (user.hp + items.heals.basic.potency > user.level.maxhp){
				user.hp = user.level.maxhp;
			} else {
				user.hp += items.heals.basic.potency;
			}
			var temp = user.items.other.splice(i,1);
			return "You uncork Morgan's " + items.heals.basic.name + " and swill it all. You feel stronger already!";
		} else if (x === "Extra potent healing elixir"){
			if (user.hp + items.heals.potent.potency > user.level.maxhp){
				user.hp = user.level.maxhp;
			} else {
				user.hp += items.heals.potent.potency;
			}
			// user.items.other.splice(x,1);
			return "You uncork Morgan's " + items.heals.potent.name + " and swill it all. You feel stronger already!";
		} else if (x === "Antifester"){
			flag = undefined;
			return "You uncork Morgan's " + items.heals.antibiotic.name + " and swill it all. Your battle wounds regain a healthy pink color!";
		} else if (x === "Precious rubies"){
			user.items.other.push(items.stuff.gems.rubies)
			return "You can't use that here.";
			// var temp = user.items.other.splice(i,1);
		} else if (x === "Innoculated kola nuts"){
			user.turnsToday += 5;
			user.drugs += 1;
			return "You take a handful of Morgan's special kola nuts and crunch down on them. The bitterness almost makes you gag. \nYou are energized! Five turns are added to your daily limit!";
		} else if (x === "Berserker infusion"){
			batpoints = 5;
			user.drugs += 2; 
			return "Steadying yourself, you gulp down the vial of Morgan's Berserker infusion. It burns going down. \nYou feel the strength of ten men, and crave battle!";
		}
	}

}