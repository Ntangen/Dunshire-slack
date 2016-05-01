// events

module.exports = {

	minor : {
		// town, tavern, smither, smithbuy, apot, bank, abbey, farm, asking
		town: "**" + user.username + "** was seen about Town...\n ",
		tavern: "**" + user.username + "** was spotted nursing a drink in the Tavern.\n ",
		smither: "**" + user.username + "** was last seen slipping into the Smither's shop.\n ",
		smithbuy: "**" + user.username + "** was seen sporting impressive new merchandise from the Smither...\n ",
		apot: "**" + user.username + "** visited Morgan's Apothecary for reasons unknown...\n ",
		bank: "**" + user.username + "** was seen smiling as they left the Bank...\n ",
		abbey: "**" + user.username + "** visited the Abbey.\n ",
		farm: "**" + user.username + "** was seen in the direction of Grannon's Farm.\n ",
		asking: "**" + user.username + "** was heard asking around about the location of other wanderers at the Tavern...\n ",
		place0: "Strange winds come out of the north, and the countryside is uneasy.\n ",
		place1: "That idiot Barzek tripped over his own feet and slept in the horse trough!\n ",
		place2: "Frank the Gremlin stole Seth's lunch again.\n ",
		place3: "This season's spoons competition will be held in the Fields on the next market day.\n "
	},

	major : {
		// lev2, magic, newplayer, death
		lev2: "**" + user.username + "** cut down adversaries of great strength to advance to the level of Apprentice!\n ",
		magic: "Somehow, magic has occurred at the Bank.\n ",
		newplayer: "A new wanderer, **" + user.username + "**, was seen entering Town.\n ",
		death: "**" + user.username + "** was cut down in battle with monstrous foes!\n "
	}

}

