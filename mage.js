// Mage

module.exports = {

	mage: function(res,convo){
		convo.say("*-------------------------------------T H E  M A G E ' S  C A V E-------------------------------------*");
		convo.say("The dark cave is barely lit by a torch deep inside..." +
			"\nFollowing the torchlight, you soon come to a small hovel built into the cave wall. A low hum emanates from inside. As you peer in, a shrouded figure emerges from the shadows. It speaks with a gravelly rattle.");
		convo.say(">What brings you here? I wish no contact with your people!");
		convo.ask("Ask the Mage about its `sorcery` or `return` to the Dark Woods.", function(res,convo){
			magerouter(res,convo);
			convo.next();
		});
	}
}

magerouter = function(res,convo){
	var temp = res.text.toLowerCase();
	if (temp.includes("sorcery")){
		convo.say("The creature whispers." +
			"\n>Ah... yes... What sorcery I can teach you is limited only by your capacity to learn! Well... that, and how many shiny things you have brought me." +
			"\n>As your mind becomes stronger, and you gain in your Mysticism, I can teach you new curses to lance upon your enemies - or yourself. Each lesson will cost you in gold, plus one *precious gem.*" +
			"\n>Here's what you I'm willing to share with you for now...\n" + spellist());
		convo.say("Your current sorcery: " + showspells());
		convo.ask("Select your merchandise, or decide `none` of them interest you.", function(res,convo){
			mageconfirm(res,convo,1);
			convo.next();
		});

		convo.say();
		output(4, "<span id=menu>Select a curse, or press <span id=letter>B</span> if none interests you.</span><br>");
		thread = 7.1;
	} else if (temp.includes("return")){
		convo.say("Wanting no more part of this place, you return to the Dark Woods.");
		woods.woodsstart(res,convo);
	} else {
		convo.say("Come again?");
		convo.repeat();
	}
}

mageconfirm = function(x){
	if (checkCunning(x)) {
		output(4, "\"You lack the Mysticism required for such advanced sorcery. Come back when you are more... mystical.\"<br>");
		output(5, "<span id=menu>Press <span id=enter>Any</span> key to continue.</span>");
		thread = 7.7;
		return;
	} else if (x==="1"){
		output(4, "Are you sure you want to learn the " + spellz.clap.name + " curse?<br>" +
			"<span id=menu>Press <span id=letter>Any</span> key to confirm, or <span id=letter>N</span> to change your mind.</span><br>" + "------------------------------------------------<br>");
		currentmerch = spellz.clap;
		thread = 7.2;
	} else if (x==="2"){
		output(4, "Are you sure you want to learn the " + spellz.shield.name + " spell?<br>" +
			"<span id=menu>Press <span id=letter>Any</span> key to confirm, or <span id=letter>N</span> to change your mind.</span><br>" + "------------------------------------------------<br>");
		currentmerch = spellz.shield;
		thread = 7.2;
	} else if (x==="3"){
		output(4, "Are you sure you want to learn the " + spellz.heal.name + " incantation?<br>" +
			"<span id=menu>Press <span id=letter>Any</span> key to confirm, or <span id=letter>N</span> to change your mind.</span><br>" + "------------------------------------------------<br>");
		currentmerch = spellz.heal;
		thread = 7.2;
	} else { output(4, "Come again?"); setTimeout(function(){ magerouter() }, 1000) }
}

mpurch = function(x){
	function findspell(x,y,z){
		if (x.name===currentmerch.name){
			return true
			}
	}
	if (x==="n"){
			// no
		output(4, "The Mage sighs. <span id=quote>\"Do not dawdle with me, " + userInfo.level.name + "...\"</span><br>");
		output(5, "<span id=menu>Press <span id=enter>Any</span> key to continue.</span>");
		thread = 7.7;
	} else if (userInfo.items.magic.find(findspell)) {
		output(4, "The Mage sighs. <span id=quote>\"I have already taught you this sorcery, " + userInfo.username + "... have you forgotten so soon?\"</span><br>");
		output(5, "<span id=menu>Press <span id=enter>Any</span> key to continue.</span>");
		thread = 7.7;
	} else {
		var temp;
		clear();
		if (userInfo.gold >= currentmerch.gold) {
			if (findgems()) {
				// successful buy
				Meteor.call("acts",x,"events","mage buy");
				userInfo.gold -= currentmerch.gold;
				userInfo.items.other.splice(temp,1);
				userInfo.items.magic.push(currentmerch);
				console.log("post assign: " + userInfo.items.magic);
				output(1, "The Mage nods solumnly, its shouded head dipping as you hear foreign-sounding chants too low for you to hear. Soon, you feel a spark of inspiration, and the " + currentmerch.name + " magick is suddenly familiar to you!<br>");
				output(2, "<span id=quote>\"Wield this magick wisely, young one...\"</span> says the Mage.<br>");
				output(3, "Your gold pouch feels mysteriously lighter.<br>");
				output(4, "<span id=menu>Press <span id=enter>Any</span> key to continue.</span>");
				thread = 7.7;
			} else {
				output(1, "The Mage's head shakes inside his cloak. <span id=quote>\"You lack any precious gems. Try again when you find one.\"</span><br>");
				output(2, "<span id=menu>Press <span id=enter>Any</span> key to continue.</span>");
				thread = 7.7;
			}
		} else {
			// not enough simoleons
			output(1, "The Mage sighs. <span id=quote>\"Knowledge is free, but education is not. Come back when you have gold equal to my enchantments.\"<span><br>");
			output(2, "<span id=menu>Press <span id=enter>Any</span> key to continue.</span>");
			thread = 7.7;
		}
	}
}

checkCunning = function(x){
	x = Number(x);
	if (x===1){
		if (userInfo.attributes.myst<spellz.clap.cunningreq){
			return true
		}
	} else if (x===2){
		if (userInfo.attributes.myst<spellz.shield.cunningreq){
			return true
		}
	} else if (x===3){
		if (userInfo.attributes.myst<spellz.heal.cunningreq){
			return true
		}
	} else return false;
}

spellist = function(){
	var temp = "`1` - " + spellz.clap.name + " (" + spellz.clap.gold + " Gold\n`2` - " + spellz.shield.name + " (" + spellz.shield.gold + " Gold\n`3` - " + spellz.heal.name +" (" + spellz.heal.gold + " Gold";
	if (user.level.level>=3){
		temp += "\n`4` - "+ spellz.sword.name +" (" + spellz.sword.gold + " Gold";
	}
	if (user.level.level>=4){
		// temp += "\n`5` - "+ items.weapons.oldsword.name +" (" + items.weapons.oldsword.gold + " Gold";
	}
	// horizontal line here?
	return temp;
}

showspells = function(){
	if (user.items.magic.length===0){
		return "None!"
	} else {
		var returnvar = "";
		for (i=0;i<user.items.magic.length;i++){
	            returnvar += user.items.magic[i].name + ", ";
	        }
	    returnvar += "and some card tricks.";
	    return returnvar;
	}
}