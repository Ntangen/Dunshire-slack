// here there be monsters

module.exports = {

	chooseBeastLevel: function(){
		var level = user.level.level;
		if (level === 1) return beasts.beasts.lev1[Math.round(Math.random()*10)];
		else if (level === 2) return beasts.beasts.lev2[Math.round(Math.random()*10)];
		else if (level === 3) return beasts.beasts.lev3[Math.round(Math.random()*10)];
		// else if (level === 4) return beasts.lev4[Math.round(Math.random()*11)];
	},
	beasts: {
		lev1: [
		{	name: "Screeching Squirrel",
			hp: 7,
			attack: 2,
			defense: 1,
			speed: 4,
			strike1: "jumps at you with a bloodcurdling scream and scratches your arms",
			xp: 11,
			gold: 14
			},
		{	name: "Berzerk Bunny",
			hp: 8,
			attack: 2,
			defense: 1,
			speed: 4,
			strike1: "leaps at your face and bites your nose",
			xp: 12,
			gold: 15
			},
		{	name: "Bloody Groundhog",
			hp: 9,
			attack: 3,
			defense: 1,
			speed: 3,
			strike1: "grabs your ankles and bites",
			xp: 13,
			gold: 16
			},		
		{ 	name: "Wizened Grumpus",
			hp: 10,
			attack: 3,
			defense: 1,
			speed: 1,
			strike1: "flings feces at you, stinging your eyes",
			xp: 14,
			gold: 17
			},
		{	name: "Rabid Deer",
			hp: 11,
			attack: 4,
			defense: 1,
			speed: 3,
			strike1: "rears back and kicks you with its front legs",
			xp: 15,
			gold: 18
			},
		{	name: "Young Tree Goblin",
			hp: 12,
			attack: 4,
			defense: 1,
			speed: 2,
			strike1: "flings sharpened sticks at you",
			xp: 16,
			gold: 19
			},
		{	name: "Brute",
			hp: 13,
			attack: 5,
			defense: 1,
			speed: 1,
			strike1: "throws rocks at you",
			xp: 17,
			gold: 20
			},
		{	name: "Jalum Kok",
			hp: 14,
			attack: 5,
			defense: 1,
			speed: 2,
			strike1: "whips its tail around and slams your head",
			xp: 18,
			gold: 21
			},
		{	name: "Landshark",
			hp: 15,
			attack: 5,
			defense: 2,
			speed: 1,
			strike1: "cruises over and bites your arm",
			xp: 19,
			gold: 22
			},		
		{	name: "Highwayman",
			hp: 16,
			attack: 5,
			defense: 2,
			speed: 1,
			strike1: "flips open his blade and lunges at your chest",
			xp: 20,
			gold: 23
			},		
		{	name: "Bloody Bruce",
			hp: 16,
			attack: 6,
			defense: 2,
			speed: 2,
			strike1: "takes a swing at you with his nailed bat",
			xp: 21,
			gold: 24
			}
		],
		lev1b: {
			name:"Twin Robbers",
			hp: 18,
			attack: 6,
			defense: 3,
			strike1: "strike at you with two pairs of swords",
			xp:100,
			gold:100
		},
		lev2: [
		{	name: "Young Tree Goblin",
			hp: 11,
			attack: 5,
			defense: 1,
			speed: 4,
			strike1: "flings sharpened sticks at you",
			xp: 16,
			gold: 21
		},
		{	name: "Brute",
			hp: 12,
			attack: 5,
			defense: 2,
			speed: 4,
			strike1: "throws rocks at you",
			xp: 22,
			gold: 17
		},
		{	name: "Jalum Kok",
			hp: 12,
			attack: 6,
			defense: 2,
			speed: 4,
			strike1: "whips its tail around and slams your head",
			xp: 23,
			gold: 18
		},
		{	name: "Landshark",
			hp: 13,
			attack: 6,
			defense: 2,
			speed: 4,
			strike1: "cruises over and bites your arm",
			xp: 24,
			gold: 19
		},	
		{	name: "Highwayman",
			hp: 14,
			attack: 6,
			defense: 2,
			speed: 4,
			strike1: "flips open his blade and lunges at your chest",
			xp: 20,
			gold: 25
		},
		{	name: "Bloody Bruce",
			hp: 15,
			attack: 7,
			defense: 3,
			speed: 4,
			strike1: "takes a swing at you with his nailed bat",
			xp: 21,
			gold: 26
		},
		{	name: "Rude Boy",
			hp: 16,
			attack: 7,
			defense: 3,
			speed: 4,
			strike1: "runs up and doesn't say please",
			xp: 27,
			gold: 22
		},
		{	name: "Slobbering Wolf",
			hp: 17,
			attack: 7,
			defense: 3,
			speed: 4,
			strike1: "snarls and snaps at your leg",
			xp: 23,
			gold: 28
		},
		{	name: "Harron",
			hp: 18,
			attack: 8,
			defense: 3,
			speed: 4,
			strike1: "rears back and slashes you with his nails",
			xp: 24,
			gold: 29
		},
		{	name: "Local Politician",
			hp: 19,
			attack: 8,
			defense: 4,
			speed: 4,
			strike1: "turns his back and sells you out",
			xp: 25,
			gold: 30
		},
		{	name: "Mean Girl",
			hp: 20,
			attack: 10,
			defense: 4,
			speed: 4,
			strike1: "smiles sweetly and stabs you in the back",
			xp: 26,
			gold: 31
		}
		],
		lev2b: {
			name:"Geist",
			hp: 30,
			attack: 8,
			defense: 4,
			strike1: "envelops you in darkness and curdles your mortal soul",
			xp:150,
			gold:175
		},
		lev3: [
		{	name: "Rude Boy",
			hp: 14,
			attack: 6,
			defense: 3,
			speed: 4,
			strike1: "runs up and doesn't say please",
			xp: 18,
			gold: 28
		},
		{	name: "Slobbering Wolf",
			hp: 15,
			attack: 7,
			defense: 4,
			speed: 4,
			strike1: "snarls and snaps at your leg",
			xp: 21,
			gold: 30
		},
		{	name: "Harron",
			hp: 16,
			attack: 7,
			defense: 3,
			speed: 4,
			strike1: "rears back and slashes you with his nails",
			xp: 23,
			gold: 32
			},
		{	name: "Local Politician",
			hp: 16,
			attack: 8,
			defense: 3,
			speed: 4,
			strike1: "turns his back and sells you out",
			xp: 25,
			gold: 34
		},
		{	name: "Mean Girl",
			hp: 17,
			attack: 8,
			defense: 4,
			speed: 4,
			strike1: "smiles sweetly and stabs you in the back",
			xp: 25,
			gold: 34
		},	
		{ 	name: "Nimrod",
			hp: 19,
			attack: 9,
			defense: 4,
			speed: 1,
			strike1: "lifts his spear and stabs at you",
			xp: 26,
			gold: 35
			},
		{	name: "Juggernaut",
			hp: 35,
			attack: 5,
			defense: 6,
			speed: 3,
			strike1: "lets out a bellowing howl, ducks his head and charges you",
			xp: 28,
			gold: 37
			},
		{	name: "Horned Gremlin",
			hp: 21,
			attack: 9,
			defense: 4,
			speed: 2,
			strike1: "belches in your general direction",
			xp: 29,
			gold: 38
			},
		{	name: "Feral Cat",
			hp: 22,
			attack: 10,
			defense: 4,
			speed: 1,
			strike1: "hisses and swipes at you with its diseased claws",
			xp: 29,
			gold: 38
			},
		{	name: "Small Bear",
			hp: 23,
			attack: 10,
			defense: 4,
			speed: 2,
			strike1: "roars adorably and then swipes at your face",
			xp: 29,
			gold: 38
			},
		{	name: "Shady Drifter",
			hp: 24,
			attack: 11,
			defense: 4,
			speed: 1,
			strike1: "flicks open double switchblades and lunges at you",
			xp: 31,
			gold: 40
			}
		],
		lev3bs: [
			{ 	name:"Brezlev",
				hp: 30,
				attack: 10,
				defense: 2,
				strike1: "hurls a sharpened javelin at you"
				},
			{	name:"the Dagger Fighter",
				hp: 30,
				attack: 13,
				defense: 4,
				strike1: "stalks you around the pit before leaping at you with bared daggers"
				},
			{	name:"the Magus",
				hp: 45,
				attack: 15,
				defense: 1,
				strike1: "stands motionless, hands hidden within the sleeves of his cloak. Suddenly, you feel a wave of crushing, ineffable agony descend upon you",
				xp:150,
				gold:275
			}
		]
	}
}

