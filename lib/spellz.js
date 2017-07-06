// spellz

module.exports = {
	
	clap:{
		name:"Thunderous Clap",
		desc: "A calamitous din befalls your enemy's ears! (Requires 3 turns)",
		cunningreq: 0,
		turnsreq: 3,
		attack: 25,
		gold: 150
	},
	shield:{
		name:"Egregious Shield",
		desc: "A powerful, temporary shield against your enemy's attacks. (Requires 3 turns)",
		cunningreq: 1,
		turnsreq: 3,
		gold: 400
		// decreases enemy's attack by 25% - see woodsfight
	},
	heal:{
		name:"Curative Words",
		desc: "Heal yourself fully during battle. (Requires 5 turns)",
		cunningreq: 2,
		turnsreq: 5,
		attack: 0,
		gold: 650
	},
	sword:{
		name:"Glowing Sword",
		desc: "Double your weapon's attack value in the next battle. (Requires 5 turns)",
		cunningreq: 3,
		turnsreq: 8,
		attack: 0,
		gold: 1000
	}

}