// ABBEY

module.exports = {

	abbey: function(x){
		convo.say("*-------------------------------------T H E  V I L L A G E  A B B E Y-------------------------------------*");
		if (user.xp < 102) {
			convo.say("The Abbey's door hangs a single hinge. Inside, broken benches are strewn about in disarray. The altar in the front of the room is smashed. \nAn old man in a simple wool frock is sweeping debris on one side of the room. You can tell he has been weeping. \nHe looks up as you enter the room, but shakes his head.");
			convo.say(">You can't help us yet! No one can...");	
			town.townsquare(res,convo);
		} else if (user.xp >=102 && user.level.level<2){
			if (user.mission==="abbey" && missioncomplete){
				// post-mission/level up
				utility.levelup(2);
				user.gold += 200;
				user.xp += 50;
				convo.say("The Abbey's door hangs a single hinge. Inside, broken benches are strewn about in disarray. The altar in the front of the room is smashed. The old Cleric lights up as you enter the Abbey. \n>You did it! You really did it! Verily, you were sent to us by the Great Father!");
				convo.say(">Our order will gratefully pray for your health and vitality. But in addition, please accept these most modest of tokens of our deepest thanks. \nYou receive 200 gold and 50 experience! \n*You have returned the Cleric's censer!* \n*You have advanced to Level 2: Apprentice.*");
				convo.ask("Your maximum hitpoints have increased, and new areas of town are now open to you. \nIn addition, you may add 1 point to any one of your following attributes: `Luck`, `Strength`, `Charisma` or `Mysticism`. \nWhich attribute would you like to add this point to?", function(res,convo){
					abbeyup(res,convo);
					convo.next();
				});
			} else if (user.mission==="abbey"){
				// during mission	
				output(1, "The Abbey's door hangs a single hinge. Inside, broken benches are strewn about in disarray. The altar in the front of the room is smashed.<br>");
				output(2, "The old Cleric looks up from his cleaning as you enter the room, and his wet eyes brighten. <span id=quote>\"Greetings, wanderer. Our congregation cannot wait for the safe return of our precious censer... truly, you are most noble in taking on this dangerous task!\"</span><br>");
				output(3, "<span id=menu>Press (<span id=letter>Any</span>) key to return to town.</span><br>");
				thread = 1.9;
			} else {
				// give mission
				output(1, "The Abbey's door hangs a single hinge. Inside, broken benches are strewn about in disarray. The altar in the front of the room is smashed.<br>");
				output(2, "An old Cleric in a simple wool frock is sweeping debris on one side of the room. You can tell he has been weeping.<br>");
				output(3, "He looks up as you enter the room, and his eyes light up. <span id=quote>\"Greetings, wanderer. You... you aren't here to loot us, are you? As you can see, we have nothing else of value here...\"</span><br>");
				output(4, "<span id=menu>Press (<span id=letter>Any</span>) key to ask the old man what happened, or (<span id=letter>Q</span>) to leave.</span><br>");
				thread = 5;
			}
		} else if (user.level.level>=2){
			// beyond level 1
			output(1, "The Abbey's new oak double doors gleam in the afternoon light. The new altar at the front is spit polished and gives a warm, inviting glow.<br>");
			output(2, "The old Cleric, resplendent in soft robes, greets you with a smile. <span id=quote>\"Welcome again, child. What brings you back to our humble house?\"</span><br>");
			output(3, "<span id=menu>Press (<span id=letter>F</span>) to inquire about The Faith, (<span id=letter>R</span>) to rest and reflect in the nave, (<span id=letter>H</span>) to ask the Cleric to heal you, or (<span id=letter>Any</span>) other key to leave.</span><br>");
			thread = 5;
		}
	}
}



