// APOTHECARY

module.exports = {

	apothecary: function(res,convo){
		convo.say("*-------------------------------------M O R G A N ' S  A P O T H E C A R Y-------------------------------------*");
		convo.say("Beakers of queer liquid overflowing with vapor surround you. \nMorgan the Apothecary decants her latest concoction into a beaker.");
		if (user.level.level===4){
			if (user.mission==="morgan" && !missioncomplete){
				// intra-mission menu
				convo.say(">I do look forward to that Quercus root, " + user.username + "!");
				convo.ask(">Now, dear... what do you seek today?" + "\nPeruse Morgan's `heal`ing potions, browse her `medicines` list, `ask` what she's working on now, or return to the `street`.", function(res,convo){
					apotrouter(res,convo);
					convo.next();
				});
			} else if (user.mission==="morgan" && missioncomplete){
				// finished mission - raise to level 5
				convo.say("Walking into the cabin, you meet Morgan's inquiring look by tossing the small bag containing the Quercus root down on her work table. Morgan removes the root, examining it in her hands with a specialist's eye.");
				convo.say(">This is remarkable... I've never seen such a specimen so well preserved! So fresh! You've done well, " + user.username + " - my thanks to you!" + "\n>And... as promised... you shall have your reward. Have a seat for just a moment.");
				// more
			} else {
				// before you've accepted mission
				convo.say("Sitting listlessly at her work bench, Morgan hardly looks up at you, her brow furrowed as she stares into the shimmering liquid before her. Bags hang under her eyes, and her hair is unkempt.");
				convo.ask("You may peruse Morgan's `heal`ing potions, browse her `medicines` list, `ask` what she's working on now, or return to the `street`.", function(res,convo){
					apotrouter(res,convo);
					convo.next();
				});
			}
		} else {
		// if (flag==="drugs"){
		// 	output(3, "<span id=quote>\"Step carefully, fr...</span> she says, before looking up and seeing your tell-tale shaking and pale complexion. A thin, cruel smile spreads across her face. <span id=quote>Been taking a few too many of my remedies, have you?</span> she asks, knowingly.<br>" + 
		// 		"<span id=quote>The addiction you're experiencing now will only get worse. I promise you. And to beat it, you will require my help. Just let me know when.</span>");
		// 	output(4, "<span id=quote>Now, dear... what do you seek today?</span><br><br>" +
		// 		"<span id=menu>Press (<span id=letter>H</span>) to peruse Morgan's healing potions, (<span id=letter>M</span>) to browse her medicine list, (<span id=letter>A</span>) to ask what she's working on now, (<span id=letter>D</span>) to inquire about curing your addiction, or (<span id=letter>L</span>) to leave.</span><br>");
		// } else {
			convo.ask(">Step carefully, friend... We don't need an explosion in here. Unless, that is... uh... well, my dear, what is it you seek? \nPeruse Morgan's `heal`ing potions, browse her `medicines` list, `ask` what she's working on now, or return to the `street`.", function(res,convo){
				apotrouter(res,convo);
				convo.next();
			});
		}
	}
}

apotrouter = function(res,convo){
	var temp = res.text.toLowerCase();
	if (temp.includes("heal")){
		convo.say("Morgan looks you over quickly, and tisks her tongue. \n>Feel a wee bit peckish, eh dear? Don't worry... if you have the gold, I'll have you feeling better soon. \nHere's what I have today: \n`1` - " + items.heals.basic.name + " (" + items.heals.basic.gold + " Gold)\n`2` - " + items.heals.potent.name + " (" + items.heals.potent.gold + " Gold)");
			// future antibotic item:
			// \n`3` - " + items.heals.antibiotic.name + " (" + items.heals.antibiotic.gold + " Gold)");
		convo.ask("Select your merchandise, or decide `none` of them interest you.", function(res,convo){
			apotmerchrouter(res,convo,1);
			convo.next();
		});
	} else if (temp.includes("medicines")){
		convo.say("Morgan nods her head. \n>If you have the gold, I have the medicines you need, my dear. Here's what I have today: \n`1` - " + items.meds.sober.name + " (" + items.meds.sober.gold + " Gold)\n`2` - " + items.meds.kola.name + " (" + items.meds.kola.gold + " Gold)\n`3` - " + items.meds.berserk.name + " (" + items.meds.berserk.gold + " Gold)");
		convo.ask("Select your merchandise, or decide `none` of them interest you.", function(res,convo){
			apotmerchrouter(res,convo,2);
			convo.next();
		});
	} else if (temp.includes("ask")){
		if (user.level.level===4){
			convo.say("Morgan hesitates for a few beats, and then sighs deeply. She puts down the stirrer for the beaker before her. \n>I am working on a new potion for an idea I have, but... \nShe trails off, lost in thought.");
			convo.say("Only after you cough loudly does she startle, looking back up at you. \n>Oh! I... I'm sorry... this new project has kept me up nights. I think I may have stumbled on a new concoction that's quite... extraordinary... yet I'm missing a critical ingredient. Nothing I try acts as a proper substitute.");
			convo.say("Morgan tilts her head up to you and narrows her eyes. \n>Actually... there *is* a way you could help, if you wanted to... I could certainly make it worth your time. The ingredient I lack is a cutting of a *Quercus tree root.* I haven't seen one in a long time - they're exceedingly rare. I've heard word of a mature Quercus deep in a hollow of the Dark Woods, but... I don't dare venture there myself. You, however, might be ready.");
			convo.say(">So... are you interested?");
			convo.ask("Shall you `accept` Morgan's errand, or `decline` for now?", function(res,convo){
				apotrouter(res,convo,2);
				convo.next();
			});

		} else {
			convo.say("Ask another time, " + user.username + ". You never know what I may have for you.");
			convo.ask("What next? (Want a `reminder`?)", function(res,convo){
	            apotrouter(res,convo);
	            convo.next();
	        });
		}
	} else if (temp.includes("street")){
		convo.say("Your business concluded, you give Morgan a bow and make your way to the door.");
		town.townsquare(res,convo);
	} else if (temp.includes("reminder")){
		convo.ask("You may peruse Morgan's `heal`ing potions, browse her `medicines` list, `ask` what she's working on now, or return to the `street`.", function(res,convo){
			apotrouter(res,convo);
			convo.next();
		});
	} else if (temp.includes("accept") && user.level.level===4) {
		// accept Morgan's request
		convo.say("Morgan's eyes light up. \n>Egads! Thank you! This potion will be like nothing you've ever seen... just you wait!");
		convo.say("*You have accepted Morgan's Request!* \nMorgan draws you a crude map of the eastern quarter of the Dark Woods. You'll begin your search there.");
		user.mission = "morgan";
		convo.say("Morgan clears her throat and squints at you. \n>Just one more thing, " + user.username + " - have you ever... ahem... actually *seen* a Quercus?");
		convo.say("Seeing you shake your head, Morgan looks nervously around. \n>Ah. I see. Ah. Well... a word to the wise? Make sure you keep that " + user.items.weapon.name + " ready. I hear Quercus trees hate... strangers. Be safe, now. This one's on the house.");
		convo.say("Morgan slides a healing potion over to you!");
		user.items.other.push(items.heals.basic);
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
            apotrouter(res,convo);
            convo.next();
        });
	} else if (temp.includes("decline") && user.level.level===4){
		// decline Morgan's request for now
		convo.say("Morgan shrugs. \n>Suit yourself... maybe another time.");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
            apotrouter(res,convo);
            convo.next();
        });
	} else {
		convo.repeat();
	}
}

apotmerchrouter = function(res,convo,x){
	var temp = res.text.toLowerCase();
	if (temp.includes("none")) {
		convo.say("Morgan rolls her eyes. \n>I haven't got all day, you know.");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
            apotrouter(res,convo);
            convo.next();
        });
	} else if (x===1){
		// heals 
		if (temp.includes("1")){
			currentmerch = items.heals.basic;
			convo.ask("Are you sure you want the " + items.heals.basic.name + "? \nThis is your standard-issue rejuvenating elixir. Restores up to 20 HP. \n You may `confirm` your purchase, or `change` your mind.", function(res,convo){
				apotmerchconfirm(res,convo);
				convo.next();
			});
		} else if (temp.includes("2")){
			currentmerch = items.heals.potent;
			convo.ask("Are you sure you want the " + items.heals.potent.name + "? \nA more potent rejuvenating elixir. Restores up to 40 HP. \n You may `confirm` your purchase, or `change` your mind.", function(res,convo){
				apotmerchconfirm(res,convo);
				convo.next();
			});
		// } else if (temp.includes("3")){
		// 	currentmerch = items.heals.antibiotic;
		// 	convo.ask("Are you sure you want the " + items.heals.basic.name + "? \nThis is your standard-issue rejuvenating elixir. Restores up to 20 HP. \n You may `confirm` your purchase, or `change` your mind.", function(res,convo){
		// 		apotmerchconfirm(res,convo);
		// 		convo.next();
		// 	});
		} else {
			convo.say("Come again?");
			convo.repeat();
		}
	} else if (x===2){
		// meds
		if (temp.includes("1")){
			currentmerch = items.meds.sober;
			convo.ask("Are you sure you want the " + items.meds.sober.name + "? \nHad a few too many at the Tavern? This elixir will immediately clear your mind and put you back in fighting form. \n You may `confirm` your purchase, or `change` your mind.", function(res,convo){
				apotmerchconfirm(res,convo);
				convo.next();
			});
		} else if (temp.includes("2")){
			currentmerch = items.meds.kola;
			convo.ask("Are you sure you want the " + items.meds.kola.name + "? \nHeading into the forest? Need to sharpen your senses? A few kola nuts will stimulate your senses, and give you 5 extra turns for the day. \n You may `confirm` your purchase, or `change` your mind.", function(res,convo){
				apotmerchconfirm(res,convo);
				convo.next();
			});
		} else if (temp.includes("3")){
			currentmerch = items.meds.berserk;
			convo.ask("Are you sure you want the " + items.meds.berserk.name + "? \nBe wary with this one. The berserker infusion is powerful. It will temporarily make you extra-powerful, super strong and a terrifying battle opponent - but some of its... effects... will also linger after the battle ends. \n You may `confirm` your purchase, or `change` your mind.", function(res,convo){
				apotmerchconfirm(res,convo);
				convo.next();
			});
		} else {
			convo.say("Come again?");
			convo.repeat();
		}
	} else {
		convo.say("Come again?");
		convo.repeat();
	}
}

apotmerchconfirm = function(res,convo){
	var temp = res.text.toLowerCase();
	if (temp.includes("change")){
		convo.say("Morgan rolls her eyes. \n>I haven't got all day, you know.");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
            apotrouter(res,convo);
            convo.next();
        });
	} else if (currentmerch.gold > user.gold) {
		// not enough simoleons
		convo.say("Morgan's eyebrow arches up. \n>This is not the tavern, and my medicines aren't cheap swill. Come back when you have enough gold.");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
            apotrouter(res,convo);
            convo.next();
        });
	} else if (temp.includes("confirm")) {
		user.gold -= currentmerch.gold;
		user.items.other.push(currentmerch);
		convo.say("Morgan smiles, handing you the " + currentmerch.name + " and slipping your gold into one of her robe's deep pockets. \n>Feel better soon, " + user.level.name + ".");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
            apotrouter(res,convo);
            convo.next();
        });
	} else {
		convo.repeat();
	}
}


