// townsquare

// var user = require('./lib/user');
var tavern = require('./tavern');
var arms = require('./lib/armaments');

module.exports = {

townsquare: function(res, convo){
	convo.say("*-------------------------------------T H E  T O W N  S Q U A R E-------------------------------------*");
	convo.ask("The town square is calm. Merchants hawk their goods, neighbors greet each other, and a few children go chasing each other through the streets. \nYou may `hear` the town crier's news of the day, visit the `Tavern`, the `Smither` Shop, the `Apothecary` Cabin, the `Bank` of Doworth, the village `Abbey`, Old Grannon's `farm`, or venture into the Dark `Woods`. \n\nYou can also check your `status`, review your `supplies`, or `quit` to your campsite.", function(res,convo){
            townrouter(res,convo);
            convo.next();
        });
	}
}


/////////////////////


townrouter = function(res,convo){
	var temp = res.text;
    if (temp.includes('hear')){
    	convo.say("This will do things.");
        // hear(res.convo);
    } else if (temp.includes('tavern')){
        tavern.tavern(res,convo);
    } else if (temp.includes('smither')){
    	convo.say("This will do things.");
        smither(res.convo);
    } else if (temp.includes('apothecary')){
    	convo.say("This will do things.");
        apoth(res.convo);
    } else if (temp.includes('bank')){
        bank(res.convo);
    } else if (temp.includes('abbey')){
        abbey(res.convo);
    } else if (temp.includes('farm')){
        farm(res.convo);
    } else if (temp.includes('woods')){
    	// convo.say("You follow the dirt track that leads out of town and into the dark forest that surrounds the town.");
        woods.woodsstart(res,convo);
    } else if (temp.includes('status')){
        status(res.convo);
    } else if (temp.includes('supplies')){
        supplies(res.convo);
    } else if (temp.includes('quit')){
        quit(res.convo);
    } else {
        convo.repeat();
    }
}

///////////////


woods = function(x){
	clear();
	output(1, "You follow the dirt track that leads out of town and into the dark forest that surrounds the town.")
	setTimeout(function(){ woodsstart() }, 1000);
}

townstatus = function(){
	woodsstatus();
	thread = 1.9;
}

towngear = function(){
	clear();
	var temp = showgear();
	if (temp === 0){
		output(2, "You have no items!<br>");
		output(3, "<span id=menu>Press <span id=enter>Any</span> key to continue.</span>");
		thread = 1.9;
	} else {
		output (2, temp);
		thread = 1.251;
	}
}

townusegear = function(x){
	if (typeof(parseInt(x))==="number"){
		var temp = Number(x)-1;
		var temp2 = usegear(temp)
		if (temp2==="na"){
			townsquare();
			return;
		}
		output(3, temp2);
		output(4, "<span id=menu>Press <span id=enter>Any</span> key to continue.</span>");
		thread = 1.9;
	} else {
		townsquare();
	}
}

duelflagger = function(){
	if (flag2==="duel"){
		if (ghost.length=1){
			flag2=undefined;
			if (ghost[0].result==="w"){
				Meteor.call("userduel",user.username,x,"notify");
					return "<span id=victory>You were attacked in the night by <span id=menu>" + ghost[0].opp + "</span>, but successfully fought them off, and looted their defeated corpse!</span> You shall remember this transgression...";
			} else {
				Meteor.call("userduel",user.username,x,"notify");
					return "<span id=defeat>You were attacked in the night by <span id=menu>" + ghost[0].opp + "</span>, and they defeated you, looting you of some gold!</span> You shall remember this transgression...";
			}
		} else {
			var temp="";
			for (i=0;i<ghost.length;i++){
				if (ghost[i].result==="w"){
					temp += "<span id=victory>You were attacked in the night by <span id=menu>" + ghost[i].opp + "</span>, but successfully fought them off, and looted their defeated corpse!</span><br><br>You shall remember this transgression...";
				} else{
					temp += "<span id=defeat>You were attacked in the night by <span id=menu>" + ghost[i].opp + "</span>, and they defeated you, looting you of some gold!</span> You shall remember this transgression...";
				}
			}
			Meteor.call("userduel",user.username,x,"notify");
			ghost=undefined;
			return temp;
		}
	}
}

crier = function(){
	var temp = monthday.split("-");
	var yesterday = temp[1]-1
	var lastdate = month + "-" + yesterday;
	Meteor.call("activitylog",lastdate,monthday, function(err,res){
		output(2, res.today);
		output(3, "<span id=menu>Press <span id=enter>Any</span> key to continue.</span>");
		thread=1.9;
		// add yesterday's news
	})
}



///////////////

