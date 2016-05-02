// events

module.exports = {

	eventReturner: function(x){
		var currentuser = user.username;
		for (var prop in alltheevents) {
			if (prop===x){
				var blerg = alltheevents[prop].replace(/currentuser/, currentuser);
				return blerg;
			}
		}
	}
}

var alltheevents = {
	// minor
	// town, tavern, smither, smithbuy, apot, bank, abbey, farm, asking
	town: "*currentuser* was seen about Town...\n",
	tavern: "*currentuser* was spotted nursing a drink in the Tavern.\n",
	smither: "*currentuser* was last seen slipping into the Smither's shop.\n",
	smithbuy: "*currentuser* was seen sporting impressive new merchandise from the Smither...\n",
	apot: "*currentuser* visited Morgan's Apothecary for reasons unknown...\n",
	bank: "*currentuser* was seen smiling as they left the Bank...\n",
	abbey: "*currentuser* visited the Abbey.\n",
	farm: "*currentuser* was seen in the direction of Grannon's Farm.\n",
	asking: "*currentuser* was heard asking around about the location of other wanderers at the Tavern...\n",
	place0: "Strange winds come out of the north, and the countryside is uneasy.\n",
	place1: "That idiot Barzek tripped over his own feet and slept in the horse trough!\n",
	place2: "Frank the Gremlin stole Seth's lunch again.\n",
	place3: "This season's spoons competition will be held in the Fields on the next market day.\n",
	// major
	// lev2, magic, newplayer, death
	lev2: "*currentuser* cut down adversaries of great strength to advance to the level of Apprentice!\n",
	magic: "Somehow, magic has occurred at the Bank.\n",
	newplayer: "A new wanderer, *currentuser*, was seen entering Town.\n",
	death: "*currentuser* was cut down in battle with monstrous foes!\n"
}