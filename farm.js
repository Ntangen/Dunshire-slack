// Grannon's farm

module.exports = {

	farm: function(res,convo){
		// farm output - go fight a spirit, discover mage's cave
		convo.say("*-------------------------------------G R A N N O N ' S  F A R M-------------------------------------*");
		if (user.level.level<2){
			convo.say("Thick mist sits atop the field of barley surrounding Old Grannon's Farm on the outskirts of town. \nSomewhere, a dog whimpers, as if running from something. Not you. \nThe farm is quiet. Nothing grows here...");
			convo.say("The Farm gives you cold chills. You turn and head back to town.");
			town.townsquare(res,convo);
		} else if (user.level.level===2){
			if (user.mission==="grannon"){
				farm2(res, convo);
				convo.next();
			} else {
				convo.say("Thick mist sits atop the field of barley surrounding Old Grannon's Farm on the outskirts of town. \nSomewhere, a dog whimpers, as if running from something. Not you.");
				convo.say("The farm is not as abandoned as it seems. A slight figure staggers out of the barn door, clutching a crude spear and quavering in his speech. \n>Be on guard, stranger! I won't hesitate to gut ye wheres ye stand! State yer business here!");
				convo.ask("Try to explain that you come as a `friend`, `ready` your " + user.items.weapon.name + " for battle, or `slink` away back to town.", function(res,convo){
					farmrouter(res,convo);
					convo.next();
				});
			}
		} else if (user.level.level>2){
			farm3(res, convo);
			convo.next();
		} 
	}
}

farmrouter = function(res,convo){
	var temp = res.text.toLowerCase();
	if (temp.includes("friend")){
		// TBD
	} else if (temp.includes("ready")){

	} else if (temp.includes("slink")){

	} else {
		convo.say("Come again?");
		convo.repeat();
	}
}

// Level 2 interactions
farm2 = function(res,convo){
	// make sure "shadow." is the right place to look here
	if (shadow.granflag === true){
		// grannons alive
		convo.say("Old Grannon leans on his spear, inspecting the latest sheep carcas left in his field. \n>You seen the Geist yet out there in the Dark Woods? It's a ghastly thing... black as smoke it is. No mortal form like you or me. Gives me the shivers.");
		convo.say(">Go visit the Mage in the forest. Tell him I sent you. Maybe he'll agree to help you... if he doesn't decide to kill you instead. Ha! \n " +
			"> I appreciate your help, stranger.");
		convo.say("Old Grannon tips his hat as you turn and head back to town.");
		town.townsquare(res,convo);
	} else {
		// grannons dead
		convo.say();
		output(1, "Old Grannon's corpse still lies where you slew him. The dogs - or something else - appear to have begun their work on his body.<br>");
		output(2, "You see the remains of a sheep lying in one of the nearby fields. The Geist that terrorized this farm is still active - who knows what it will attack next?<br>");
		output(3, "<span id=menu>Press (<span id=letter>Any</span>) key to return to town.</span><br>");
		thread = 1.9;
	}
}

}

// Post-level-2 interactions
farm3 = function(res,convo){

}