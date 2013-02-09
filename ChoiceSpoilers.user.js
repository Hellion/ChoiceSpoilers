// Tard's KoL Scripts
// Copyright (c) 2006, Byung Kim
// New releases Copyright (c) 2009-2013 by Hellion
// Released under the GPL license
// http://www.gnu.org/copyleft/gpl.html
// autoUpdater used under Creative Commons License 3.0.
//
// ==UserScript==
// @name           Tard's Kol Scripts - Choice Adventure Rewards
// @version        3.10
// @namespace      http://kol.dashida.com
// @author		   Tard
// @author         Hellion
// @author         Aelsa
// @author	Buzzy (autoupdate function; see http://userscripts.org/scripts/show/52251 )
// @include    *kingdomofloathing.com/choice.php*
// @include    *kingdomofloathing.com/basement.php
// @include	   *kingdomofloathing.com/friars.php*
// @include	   *kingdomofloathing.com/bigisland.php*
// @include	   *kingdomofloathing.com/postwarisland.php*
// @include    *kingdomofloathing.com/palinshelves.php
// @include    *kingdomofloathing.com/clan_viplounge.php*
// @include	   *kingdomofloathing.com/clan_rumpus.php*
// @include	*kingdomofloathing.com/campground.php*
// @include	   *kingdomofloathing.com/main.php
// @include    *127.0.0.1:*/clan_viplounge.php*
// @include	   *127.0.0.1:*/clan_rumpus.php*
// @include    *127.0.0.1:*/main.php
// @include    *127.0.0.1:*/choice.php*
// @include    *127.0.0.1:*/basement.php
// @include	   *127.0.0.1:*/friars.php*
// @include	   *127.0.0.1:*/bigisland.php*
// @include	   *127.0.0.1:*/postwarisland.php*
// @include    *127.0.0.1:*/palinshelves.php
// @include	*127.0.0.1:*/campground.php*
// @include	*127.0.0.1:*/main.php
// @include    *localhost:*/clan_viplounge.php*
// @include	   *localhost:*/clan_rumpus.php*
// @include    *localhost:*/main.php
// @include    *localhost:*/choice.php*
// @include    *localhost:*/basement.php
// @include	   *localhost:*/friars.php*
// @include	   *localhost:*/bigisland.php*
// @include	   *localhost:*/postwarisland.php*
// @include    *localhost:*/palinshelves.php
// @include	*localhost:*/campground.php*
// @include	*localhost:*/main.php
// @grant	GM_log
// @history 3.10 refactor the actual addition of spoiler text to eliminate code duplication; add campground spoilers.
// @history 3.09 updated for new level-9 quest stuff, bugbears/zombies, skeleton usage, etc.
// @history 3.08 updated include list for new choice URL standard, added clan VIP swimming pool
// @history 3.07 added Kloop, new spooky temple
// @history 3.06 added Haunted Sorority house
// @history 3.05 added safety maps
// @history 3.04 added autoupdater
// @history 3.03 added all choices through new knob
// @history 3.02 added all antique maps through August 2010, and new Spooky Forest choice.
// @history 3.01 added Billiards room SR, new > sign choice, Reflection of a map, nemesis map choice.
// @history 3.00 major rewrite of detection logic.
// ==/UserScript==

var inputs = document.getElementsByTagName('input');
var adventureChoiceNumber = 0, SpoilerSet, imageName;
var n = 0, sp_list = "";

if (window.location.pathname == "/main.php") {	// just logged in, do certain stuff once.
	autoUpdate(68727,"3.10");
}

if (window.name == "mainpane") {
	if (inputs.length === 0) {return;}	//not in a place where we need to do anything.

	//get the adventure choice number.  Could probably do this without the for-loop.
	for (n=0; n < inputs.length; n++) {
		if (inputs[n].name === "whichchoice") {
			adventureChoiceNumber = inputs[n].value;
			break;
		}
	}
//	GM_log("found choice " + adventureChoiceNumber);
	SpoilerSet = GetSpoilersForAdvNumber(adventureChoiceNumber);
	if (SpoilerSet === undefined || SpoilerSet === null) {
		//find the adventure's image.  (in some cases this will not be the first image, e.g. when you lose the Stone Wool effect when starting a Hidden Temple choice.)
		var imageName = "";
		var images = document.getElementsByTagName('img');
		for (var foo = 0; foo < images.length; foo++) {
			if (images[foo].src.indexOf('adventureimages') != -1) {
				imageName = images[foo].src.split('/')[4]; break;
			}
		}
		if (imageName != "") SpoilerSet = GetSpoilersForImageName(adventureChoiceNumber, imageName);
		if (SpoilerSet === undefined || SpoilerSet === null) {
			var bodyText = document.getElementsByTagName('body')[0].innerHTML; //textContent;
			var URL = window.location.pathname; 
			SpoilerSet = GetSpoilersForBodyText(adventureChoiceNumber, URL, imageName, bodyText);
		}
	 }
	 if (SpoilerSet !== undefined && SpoilerSet !== null) { 
		for (n in SpoilerSet) { sp_list = sp_list + "(" + n + ") " + SpoilerSet[n] + ";\n"; }
//		GM_log("found spoiler:\n " + sp_list);
		DisplaySpoilers(inputs, SpoilerSet);
	}
}
return;

//all choice.php buttons have an "option=" setting in their form definition;
//usually a number from 1-6, which corresponds to our array of spoiler text strings.
//this allows us to handle choices where some buttons go missing depending on your game circumstance.
//Buff areas, on the other hand, have no such values and must simply be updated in order.
function DisplaySpoilers(inputs, SpoilerSet) {
	var cval = -1, n;
//	GM_log("in DisplaySpoilers");
	for (n=0; n<inputs.length;n++)	{
		if (inputs[n].name==="option") {		// identify button!
			cval = inputs[n].value;
		} else if (inputs[n].type === "submit" && (cval > 0)) {	// modify button!
			inputs[n].value += " -- " + SpoilerSet[cval] + "";
//			GM_log("adding text "+SpoilerSet[cval]);
		}
	}
	if (cval === -1) {			// got here without setting a button value? not a Choice.php button set.
		cval = 1;			// just run through all submit text and put in our info in sequence.
		for (n=0; n<inputs.length; n++) {
			if (inputs[n].type === "submit") {
//				GM_log("adding buff text " +SpoilerSet[cval]);
				inputs[n].value += " -- " + SpoilerSet[cval++] + "";
			}
		}
	}
}

function GetSpoilersForAdvNumber(advNumber) {
	//data format: advOption[adventureNumber] = array of strings.
	//array element 0 = dummy value, since buttons are numbered 1-N; 
	//for historical reasons, many of these dummy values are the names of the adventures.
	//elements 1-N are spoiler text for the respective buttons.
	var advOptions = {
		// The Dungeons of Doom
		"3":["The Oracle Will See You Now","nothing","nothing","enable reading of plus sign"],
		"25":["Ouch! You bump into a door","magic lamp","Monster: mimic","nothing (no adv loss)"],

		// South of the Border
		"4":["Finger-Lickin'... Death.","+500 meat or -500 meat","-500 meat; chance of poultrygeist","nothing"],

		// Spooky Gravy Barrow
		"5":["Heart of Very, Very Dark Darkness","without inexplicably glowing rock: proceed to choice of (lose all HP/nothing)\n with rock: proceed to choice of (Continue to Felonia/nothing)","nothing",""],
		"6":["Darker Than Dark","-all HP","nothing",""],
		"7":["How Depressing","with spooky glove equipped: proceed to Continue to Felonia\n without glove equipped: nothing","nothing",""],
		"8":["On the Verge of a Dirge","proceed to Queen Felonia","proceed to Queen Felonia","proceed to Queen Felonia"],

		// Castle (Wheel)
		"9":["cwheel1","Pay the Bills (Mysticality Bonus)","Feed the Cat (Moxie Bonus)","Take out the Garbage (Muscle Bonus)"],
		"10":["cwheel2","Guard the Back Door","Take out the Garbage (Muscle Bonus)","Pay the Bills (Mysticality Bonus)"],
		"11":["cwheel3","Feed the Cat (Moxie Bonus)","Pay the Bills (Mysticality Bonus)","Guard the Back Door"],
		"12":["cwheel4","Take out the Garbage (Muscle Bonus)","Guard the Back Door","Feed the Cat (Moxie Bonus)"],

		// Knob Harem
		"14":["A Bard Day's Night","Knob Goblin harem veil","Knob Goblin harem pants","+90-110 meat"],
		
		// The eXtreme Slope
		"15":["Yeti Nother Hippy","eXtreme mittens","eXtreme scarf","+200 meat"],
		"16":["Saint Beernard","snowboarder pants","eXtreme scarf","+200 meat"],
		"17":["Generic Teen Comedy Snowboarding Adventure","eXtreme mittens","snowboarder pants","+200 meat"],
		
		// Itznotyerzitz Mine
		"18":["A Flat Miner","miner's pants","7-Foot Dwarven mattock","+100 meat"],
		"19":["100% Legal","miner's helmet","miner's pants","+100 meat"],
		"20":["See You Next Fall","miner's helmet","7-Foot Dwarven mattock","+100 meat"],

		// Pirate's Cove
		"22":["The Arrrbitrator","eyepatch","swashbuckling pants","+100 meat"],
		"23":["Barrie Me at Sea","stuffed shoulder parrot, -5 meat","swashbuckling pants","+100 meat"],
		"24":["Amatearrr Night","stuffed shoulder parrot, -3 HP","+100 meat","eyepatch"],

		// Spooky Forest
		"26":["A Three-Tined Fork","Proceed to choice of SC/TT starter items","Proceed to choice of PM/S starter items","Proceed to choice of DB/AT starter items"],
		"27":["Footprints","seal-skull helmet, seal-clubbing club","helmet turtle, turtle totem"],
		"28":["A Pair of Craters","pasta spoon, ravioli hat","saucepan, spices"],
		"29":["The Road Less Visible","disco ball, disco mask","mariachi pants, stolen accordion"],
		"45":["Maps and Legends","Spooky Temple map","nothing (no adv loss)","nothing (no adv loss)"],
		"46":["An Interesting Choice","+5-10 Mox","+5-10 Mus","Monster: spooky vampire"],
		"47":["Have a Heart","bottle(s) of used blood","nothing (no adv loss)"],
		"502":["Arboreal Respite","\nProceed to choice of meat/vampire hearts/barskin&Sapling","\nProceed to choice of (spooky mushrooms or larva)/(Meat & coin)/(mox/mus/vampire)","\nProceed to choice of \n(choice of class starter items)/Spooky-Gro Fertilizer/Spooky Temple Map"],
		"503":["The Road Less Traveled","Gain (some) Meat","Talk to Vampire Hunter:\nreceive wooden stakes (1st time only)\nOR Trade in hearts/nothing","talk to Hunter\n(Sell bar skins/buy sapling)"],
		"504":["Tree's Last Stand","\nSell 1 skin","\nSell all skins","\nacquire Spooky Sapling","nothing"],
		"505":["Consciousness of a Stream","\nMosquito larva (first time after quest) OR 3 spooky mushrooms","\n300 meat and tree-holed coin (first time) OR nothing","Proceed to choice of Mox/Mus/Fight a Vampire"],
		"506":["Through Thicket and Thinnet","\nProceed to choice of class starting items","\nAcquire spooky-gro fertilizer","\nProceed to choice of Spooky Temple Map/nothing/nothing"],
		"507":["O Lith, Mon","acquire Spooky Temple Map","nothing (no turn loss)","nothing (no turn loss)"],
		
		//48-71 are the Violet Fog; can't really label those.
		
		// Cola Battlefield
		"40":["The Effervescent Fray","Cloaca-Cola fatigues","Dyspepsi-Cola shield","+15 Mys"],
		"41":["Smells Like Team Spirit","Dyspepsi-Cola fatigues","Cloaca-Cola helmet","+15 Mus"],
		"42":["What is it Good For?","Dyspepsi-Cola helmet","Cloaca-Cola shield","+15 Mox"],

		// Whitey's Grove
		"73":["Don't Fence Me In","+20-30 Mus","white picket fence","piece of wedding cake (always)\n also white rice (first 3 or 5 times/day)"],
		"74":["The Only Thing About Him is the Way That He Walks","+20-30 Mox","3 boxes of wine","mullet wig"],
		"75":["Rapido!","+20-30 Mys","3 jars of white lightning","white collar"],

		// Knob Shaft
		"76":["Junction in the Trunction","3 chunks of cardboard ore","3 chunks of styrofoam ore","3 chunks of bubblewrap ore"],

		// Haunted Billiards Room
		"77":["Minnesota Incorporeals","+(mainstat) Mox (max 50)","Proceed to choice of (Mys/key/nothing)/Mus/nothing","Leave (no adventure loss)"],
		"78":["Broken","Proceed to choice of +Mys, Spookyraven library key, or nothing","+(mainstat) Mus (max 50)","Leave (no adventure loss)"],
		"79":["A Hustle Here, a Hustle There","\n with Chalky Hand effect: Acquire Spookyraven library key (one time drop)\nwithout Chalky Hand effect: No Reward (lose an adventure)","+(mainstat) Mys (max 50)","Leave (no adventure loss)"],
		"330":["A Shark's Chum","\n+10 Mus, +10 Mys, +10 Mox, improve VIP Pool table skill","Monster: hustled spectre"],

		// The Haunted Bedroom
		"82":["nightstand","old leather wallet","+(mainstat) Mus (max 200)","Monster: animated nightstand"],
		"83":["darkstand","old coin purse","Monster: animated nightstand","\ntattered wolf standard (SC)\ntattered snake standard (TT)\nEnglish to A. F. U. E. Dictionary (PM or S)\nbizarre illegible sheet music (DB or AT)\n All can only be found with Lord Spookyraven's spectacles equipped\n(all are one time drops)"],
		"84":["carvestand","400-600 meat","+(mainstat) Mys (max 200)","Lord Spookyraven's spectacles (one time drop)"],
		"85":["woodstand","+(mainstat) Mox (max 200)","Spookyraven ballroom key \n(only after choosing top drawer; one time drop)","Monster: remains of a jilted mistress"],

		// The Haunted Gallery
		"89":["Out in the Garden","\nwithout tattered wolf standard: Monster: Knight (wolf)\nwith tattered wolf standard and SC class: Gain Snarl of the Timberwolf skill (one time)","without tattered snake standard: Monster: Knight (snake)\nwith tattered snake standard and TT class: gain Spectral Snapper skill (one time)","without Dreams and Lights effect: Effect: Dreams and Lights;\nwith Dreams and Lights effect: lose 24-30 HP"],

		// The Haunted Library (Take A Look, It's In A Book")
		"80":["Rise of the House","\nproceed to choice of nothing/nothing/nothing","\nLearn a random cooking recipe","\nProceed to choice of Mox/Mys/Skill for Myst classes","nothing (no adv loss)"],
		"81":["Fall of the House","\nproceed to choice of unlock gallery-key adventure/nothing/nothing","\nLearn a random cocktailcrafting recipe","\n+(mainstat) Mus (max 75) and lose 10-15 HP (Spooky)","nothing (no adv loss)"],
		"86":["Read Chapter 1: The Arrival","nothing","nothing","nothing"],
		"87":["Chapter 2: Stephen and Elizabeth","nothing","\nunlock Gallery Key adventure in Conservatory","nothing"],
		"88":["Naughty, Naughty...","\n+(mainstat) Mys (max 75)","\n+(mainstat) Mox (max 75)","\nwithout English to A. F. U. E. Dictionary: -10-15 HP (Spooky), \nwith Dictionary and P/SR class: gain new Skill (one time)"],
		"163":["Melvil Dewey Would Be Ashamed","\nNecrotelicomnicon (spooky cookbook)","\nCookbook of the Damned (stinky cookbook)","\nSinful Desires (sleazy cookbook)","nothing (no adventure loss)"],

		// The Haunted Ballroom
		"90":["Curtains","\nwith bizarre illegible sheet music as DB: unlock Tango of Terror\nwith sheet music as AT: unlock Dirge of Dreadfulness\notherwise: Monster: Ghastly Organist","+(mainstat) Mox (max 150)","nothing (no adventure loss)"],
		//91-105 are the Louvre... can't really label those.
		"106":["Strung-Up Quartet","+5 ML","+5% Noncombat","+5% item drops","turn song off"],

		// The Haunted Bathroom
		"105":["Having a Medicine Ball","with antique hand mirror, +(mainstat*1.2) Mys (max 300)\notherwise +(mainstat) Mys (max 200)","Proceed to choice of Mus/Mys/Mox spleen items","(every five times until defeat) Monster: Guy Made of Bees"],
		"107":["Bad Medicine is What You Need","antique bottle of cough syrup (Mys spleen item)","tube of hair oil (Mox spleen item)","bottle of ultravitamins (Mus spleen item)","nothing (no adventure loss)"],
		"402":["Don't Hold a Grudge","+(2x mainstat?) Mus (max 125)","+(2-2.5x mainstat) myst (max 250)","+(2x mainstat?) Mox (max 125)"],

		// Sleazy Back Alley
		"21":["Under the Knife","Change gender of character","nothing",""],
		"108":["Aww, Craps","+4-5 Mox","randomly +31-40 meat and +6-8 Mox or -2 HP","randomly +41-49 meat. +6-8 Mox and Effect: Smugness or -ALL HP","nothing (no adv loss)"],
		"109":["Dumpster Diving","Monster: drunken half-orc hobo","+4-5 Mox and +3-4 meat","Mad Train wine"],
		"110":["The Entertainer","+4-5 Mox","+2-4 Mox and +2-4 Mus","+15 meat and sometimes +6-8 Mys","nothing (no adv loss)"],
		"112":["Please, Hammer","Harold's hammer head and Harold's hammer handle (start miniquest)","nothing (no adv loss)","+5-6 Mus"],
		
		// Outskirts of Cobb's Knob
		"111":["Malice in Chains","+4-5 Mus","randomly +6-8 Mus or -1-? HP","Monster: sleeping Knob Goblin Guard"],
		"113":["Knob Goblin BBQ","\nwithout unlit birthday cake: -2 HP\nwith unlit birthday cake: light cake and -2 HP", "Monster: Knob Goblin Barbecue Team", "randomly one of: bowl of cottage cheese,\nKnob Goblin pants, Knob Goblin tongs, or Kiss the Knob apron", ""],
		"118":["When Rocks Attack", "+30 meat", "nothing (no adv loss)", "", ""],
		"120":["Ennui is Wasted on the Young", "randomly +4-5 Mus and -2 HP \nor +7-8 Mus and Effect: Pumped Up", "\nice-cold Sir Schlitz", "\n+2-3 Mox and a lemon", "\nnothing (no adv loss)"],
		
		//Inside Cobb's Knob
		"522":["Welcome To The Foot Locker","\nacquire a missing piece of the Elite Guard outfit\nor a Jelly Donut, if outfit is complete","nothing (no adv loss)"],
		
		// The Haunted Pantry
		"114":["The Baker's Dilemma", "unlit birthday cake (start miniquest)", "nothing (no adv loss)", "+4-5 Mox and +16-19 meat"],
		"115":["Oh No, Hobo","Monster: drunken half-orc hobo","\nwithout at least 6 meat: nothing\nwith at least 6 meat, -5 meat and Effect: Good Karma","+3-4 Mys, +3-4 Mox, and +5-10 meat",""],
		"116":["The Singing Tree", "\nwith at least 1 meat: +4-5 Mys and -1 meat\nwith no meat: nothing", "\nwith at least 1 meat: +4-5 Mox and -1 meat\nwith 0 meat: nothing", "with at least 1 meat, -1 meat and randomly one of:\nwhiskey and soda or +4-5 Mys and -2 HP or +7-8 Mys\nwith no meat: nothing", "nothing (no adv loss)"],
		"117":["Trespasser", "Monster: Knob Goblin Assistant Chef", "+6-8 Mys or +4 Mys and -2 HP", "Get 1-4 of:\nasparagus knife, chef's hat,\nmagicalness-in-a-can, razor-sharp can lid,\nor stalk of asparagus"],

		// The Hidden Temple
		"123":["At Least It's Not Full Of Trash","lose all HP","unlock Dvorak's Revenge adventure","lose all HP"],
		"125":["No Visible Means of Support","lose all HP","lose all HP","unlock the Hidden City"],

		// The Palindome
		"2":["Denim Axes Examined","with rubber axe: trade for denim axe \nwithout: nothing","nothing",""],
		"126":["Sun at Noon, Tan Us","+(mainstat) Mox (max 250)","+(1.5*mainstat) Mox (max 350) OR Effect: Sunburned","Effect: Sunburned"],
		"127":["No sir, away!","3 papayas","\nwith at least 3 papayas: +(mainstat) all stats (max 300), lose 3 papayas \nwithout: lose 60-68 HP","+(mainstat) all stats (max 100)"],
		"129":["Do Geese See God?","get photograph of God","nothing (no adv loss?)"],
		"130":["Rod Nevada, Vendor","get hard rock candy","nothing (no adv loss?)"],
		"131":["Dr. Awkward","Monster: Dr. Awkward","Monster: Dr. Awkward","Monster: Dr. Awkward"],
		"180":["A Pre-War Dresser Drawer, Pa!","with Torso Awaregness: Ye Olde Navy Fleece \nwithout: +200-300 meat","nothing (no adv loss)"],

		// The Arid, Extra-Dry Desert
		"132":["Let's Make a Deal!","broken carburetor","unlock An Oasis"],
		
		// Pyramid
		"134":["Wheel in the Pyramid,","move lower chamber","nothing (no adv loss)"],
		"135":["Wheel in the Pyramid,","move lower chamber","nothing (no adv loss)"],

		// The Hippy Camp
		"136":["Peace Wants Love","filthy corduroys","filthy knitted dread sack","+210-300 meat"],
		"137":["An Inconvenient Truth","filthy knitted dread sack","filthy corduroys","+207-296 meat"],
		"139":["Bait and Switch","+50 Mus","2-5 handfuls of ferret bait","Monster: War Hippy (space) cadet"],
		"140":["The Thin Tie-Dyed Line","2-5 water pipe bombs","+50 Mox","Monster: War Hippy drill sergeant"],
		"141":["Blockin' Out the Scenery","+50 Myst"," 2 of: \ncruelty-free wine, handful of walnuts, Genalen Bottle, mixed wildflower greens, thistle wine","nothing (put on your Frat Warrior outfit, doofus!)"],
		"142":["Blockin' Out the Scenery","+50 Myst"," 2 of: \ncruelty-free wine, handful of walnuts, Genalen Bottle, mixed wildflower greens, thistle wine","start the war"],

		// The Orcish Frat House
		"72":["Lording Over The Flies","trade flies for around the worlds","nothing",""],
		"138":["Purple Hazers","Orcish cargo shorts","Orcish baseball cap","homoerotic frat-paddle"],
		"143":["Catching Some Zetas","+50 Mus","6-7 sake bombers","Monster: War Pledge"],
		"144":["One Less Room Than In That Movie","+50 Mus","2-5 beer bombs","Monster: Frat Warrior drill sergeant"],
		"145":["Fratacombs","+50 Mus","2 of: brain-meltingly-hot chicken wings, frat brats, \nknob ka-bobs, can of Swiller, melted Jell-o shot","nothing (put on your War Hippy Outfit, doofus!)"],
		"146":["Fratacombs","+50 Mus","2 of: brain-meltingly-hot chicken wings, frat brats, \nknob ka-bobs, can of Swiller, melted Jell-o shot","start the war"],
		"181":["Chieftain of the Flies","trade flies for around the worlds","nothing"],

		// The Barn
		"147":["Cornered!","send ducks to the Granary (no element)","send ducks to the Bog (stench; weak vs cold, sleaze)","send ducks to the Pond (cold; weak vs. hot, spooky)\n(step 1 of the shortcut--USE CHAOS BUTTERFLY IN COMBAT)"],
		"148":["Cornered Again!","send ducks to the Back 40 (hot; weak vs. stench, sleaze)\n(step 2 of the shortcut--USE CHAOS BUTTERFLY IN COMBAT)","send ducks to the Family Plot (spooky; weak vs. hot, stench)"],
		"149":["How Many Corners Does this Stupid Barn Have!?","send ducks to the Shady Thicket (no element)","send ducks to the Other Back 40 (sleaze; weak vs cold, spooky)\nIf you've used a chaos butterfly in combat and done steps 1 and 2: \nhalve number of ducks in each area "],

		//The Fun House
		"151":["Adventurer, $1.99","\nwith at least 4 Clownosity: continue towards Beelzebozo \notherwise: take damage","nothing (no adventure loss)"],
		"152":["Lurking at the Threshold","Monster: Beelzebozo","nothing"],

		// The Defiled Alcove
		"153":["Turn Your Head and Coffin","+40-60 Mus","+200-300 meat","half-rotten brain","nothing (no adv loss)"],
		"154":["Doublewide","Monster: conjoined zmombie","nothing"],

		// The Defiled Nook
		"155":["Skull, Skull, Skull","+40-60 Mox","+200-300 meat","rusty bonesaw","nothing (no adv loss)"],
		"156":["Pileup","Monster: giant skeelton","nothing"],

		// The Defiled Niche
		"157":["Urning Your Keep","+40-70 Mys","plus-sized phylactery (first time only)","+200-300 meat","nothing (no adv loss)"],
		"158":["Lich in the Niche","Monster: gargantulihc","nothing"],

		// The Defiled Cranny
		"159":["Go Slow Past the Drawers","+200-300 meat","+40-50 HP/MP, +20-30 Mus, Mys and Mox","can of Ghuol-B-Gone","nothing (no adv loss)"],
		"160":["Lunchtime","Monster: huge ghuol","nothing"],
		"523":["Death Rattlin'","+200-300 meat","+40-50 HP/MP, +20-30 Mus, Mys and Mox","can of Ghuol-B-Gone","Monster: swarm of ghuol whelps","nothing (no adv loss)"],
		
		// The Haert
		"527":["The Haert of darkness","Monster: Bonerdagon","nothing (no adv loss)"],

		// The Deep Fat Friars' Gate
		"161":["Bureaucracy of the Damned","\nwith Azazel's 3 items, gain Steel reward \nwithout: nothing","\nwith Azazel's three items, gain Steel reward \nwithout: nothing","\nwith Azazel's three items, gain Steel reward \nwithout: nothing","\nnothing (no adv loss)"],

		// The Goatlet
		"162":["Between a Rock and Some Other Rocks","in Mining gear: allow access to the Goatlet \notherwise, nothing","nothing (no adv loss)"],

		// The Stately Pleasure Dome
		"164":["Down by the Riverside",
			 "\n+(mainstat) Mus (max 150)",
			 "\n+80-100 MP and Effect: Spirit of Alph\n(step 1 of not-a-pipe (go to Mansion) or fancy ball mask (go to Windmill))",
			 "\nMonster: Roller-skating Muse"],
		"165":["Beyond Any Measure",
			 "\nwith Rat-Faced, Effect: Night Vision (step 2 of flask of amontillado (go to Mansion))\nwithout, nothing",
			 "\nwith Bats in the Belfry, Effect: Good with the Ladies (step 2 of Can-Can skirt (go to Windmill))\nwithout, nothing",
			 "\n+(mainstat) Myst (max 150)","nothing (no adventure loss)"],
		"166":["Death is a Boat",
			 "\nwith No Vertigo: S.T.L.T \nwithout: nothing",
			 "\n+(mainstat) Mox (max 150)",
			 "\nwith Unusual Fashion Sense: albatross necklace \nwithout: nothing"],
		
		// The Mouldering Mansion
		"167":["It's a Fixer-Upper",
			 "\nMonster: raven",
			 "\n+(mainstat) Myst (max 150)",
			 "\n+40-49 HP and MP, Effect: Bats in the Belfry\n(step 1 of S.T.L.T. (go to Windmill) or Can-Can skirt (go to Dome))"],
		"168":["Midst the Pallor of the Parlor",
			 "\n+(mainstat) Mox (max 150)",
			 "\nwith Spirit of Alph, Effect: Feelin' Philosophical (step 2 of not-a-pipe (go to Windmill)\nwithout, Monster: Black Cat",
			 "\nwith Rat-Faced, Effect: Unusual Fashion Sense (step 2 of albatross necklace (go to Dome))\nwithout, nothing"],
		"169":["A Few Chintz Curtains, Some Throw Pillows...",
			 "\nwith Night Vision: flask of Amontillado \nwithout: nothing",
			 "\n+(mainstat) Mus (max 150)",
			 "\nwith Dancing Prowess: fancy ball mask \nwithout: nothing"],

		// The Rogue Windmill
		"170":["La Vie Boheme",
			 "\n+80-100 HP and Effect: Rat-Faced\n(step 1 of flask of Amontillado (go to Dome) or albatross necklace (go to Mansion))",
			 "\nMonster: Sensitive poet-type",
			 "\n+(mainstat) Mox (max 150)"],
		"171":["Backstage at the Rogue Windmill",
			 "\nwith Bats in the Belfry, Effect: No Vertigo (step 2 of S.T.L.T (go to Dome))\nwithout, nothing",
			 "\n+(mainstat) Mus (max 150)",
			 "\nwith Spirit of Alph, Effect: Dancing Prowess (Step 2 of fancy ball mask (go to Mansion))\nwithout, nothing"],
		"172":["Up in the Hippo Room",
			 "\nwith Good with the Ladies, acquire Can-Can skirt \nwithout, Monster: Can-can dancer",
			 "\nwith Feelin' Philosophical, acquire not-a-pipe \nwithout, nothing",
			 "\n+(mainstat) Myst (max 150)"],

		//The Penultimate Fantasy Airship
		"178":["Hammering the Armory","get bronze breastplate","nothing (no adv loss)"],
		"182":["Random Lack of an Encounter","with +20 ML or more: Monster: MagiMechTech MechaMech\notherwise: Monster: (a random airship monster that is not the Mech)","Penultimate Fantasy chest","+18-39 to all stats, lose 40-50 HP"],

		// Barrrney's Bar
		"184":["That Explains All The Eyepatches","\nMyst class: +(1-2x Myst) offstats (max 300), +(2-3x Myst) Myst (max 400), gain 3 drunkenness \notherwise: Monster: tipsy pirate","\nMoxie class: +(1-2x Mox) offstats (max 300), +(2-3x Mox) Mox (max 400), gain 3 drunkenness \notherwise, acquire shot of rotgut","\nMuscle class: +(1-2x Mus) offstats (max 300), +(2-3x Mus) Mus (max 400), gain 3 drunkenness \notherwise, acquire shot of rotgut"],
		"185":["Yes, You're a Rock Starrr","\n2-5 bottles of gin, rum, vodka, and/or whiskey","\n2-3 of grog, monkey wrench, redrum, rum and cola, spiced rum, strawberry daiquiri","\n+50-100 to each stat (scales with drunkenness) OR Monster: tetchy pirate (if at exactly 1 drunkenness)"],
		"186":["A Test of Testarrrsterone","\nMyst class: +(some) all stats (max 100)\notherwise: +(some) Mus and Mox (max 100)","+(some) all stats (max 300), gain 3 drunkenness","+(2x mainstat) Mox (max 150)"],
		"187":["Arrr You Man Enough?","Play Insult Beer Pong","nothing (no adv loss)"],
		"188":["The Infiltrationist","\nin frat outfit: Cap'm Caronch's dentures \notherwise -95-105 HP","\nin mullet wig and with briefcase: Cap'm Caronch's dentures \notherwise -95-105 HP","\nin frilly skirt and with 3 hot wings: Cap'm Caronch's dentures \notherwise -90-100 HP"],
		
		// The F'c'le
		"189":["O Cap'm, My Cap'm","gain stats or items from the Sea","nothing (no adv loss)","open Nemesis Lair area"],
		"191":["Chatterboxing","+~110 Mox","\nwith valuable trinket:\nbanish Chatty Pirate for 20 adventures (no adv loss)\nwithout: lose ~14 HP ","+~110 Mus","+~110 Myst, lose ~15 HP"],
		
		// Sewers
		"197":["Somewhat Higher and Mostly Dry","gain sewer exploration points","fight a sewer monster","increase sewer noncombat rate"],
		"198":["Disgustin' Junction","gain sewer exploration points","fight a sewer monster","improve sewer exploration point gain"],
		"199":["The Former or the Ladder","gain sewer exploration points","fight a sewer monster","with someone in cage: free them \nwith nobody in cage: waste a turn"],
		
		// Hobopolis
		"200":["Enter The Hoboverlord","Monster: Hodgman","nothing (no adv loss)"],
		"201":["Home in the Range","Monster: Ol' Scratch","nothing (no adv loss)"],
		"202":["Bumpity Bump Bump","Monster: Frosty","nothing (no adv loss)"],
		"203":["","Monster: Oscus","nothing (no adv loss)"],
		"204":["","Monster: Zombo","nothing (no adv loss)"],
		"205":["","Monster: Chester","nothing (no adv loss)"],
		"206":["Getting Tired","cause Tirevalanche (multikills hot hobos)","increase size of impending Tirevalanche","nothing (no adv loss)"],
		"207":["Hot Dog!","9000-11000 meat to your clan coffers OR a lot of hot damage","nothing (no adv loss)"],
		"208":["Ah, So That's Where They've All Gone","decrease stench level of the Heap","nothing (no adv loss)"],
		"213":["Piping Hot","decrease heat level of Burnbarrel Blvd","nothing (no adv loss)"],
		"214":["You vs. The Volcano","increase stench level of the Heap","nothing (no adv loss)"],
		"215":["Piping Cold","decrease heat level of Burnbarrel Blvd","reduce crowd size in PLD\n(makes it easier to get into the club)","increase cold level in Exposure Esplanade"],
		"216":["The Compostal Service","decrease spook level of the Burial Ground","nothing (no adv loss)"],
		"217":["There Goes Fritz!","multikill frozen hobos (repeatable)","multikill frozen hobos (repeatable)","multikill as many frozen hobos as possible (1 time only)"],
		"218":["I Refuse!","acquire 3 random items and set stench level to 0","set stench level to 0 (no adv loss?)"],
		"219":["The Furtivity of My City","monster: sleaze hobo","increase stench level of the Heap","4000-6000 meat to your clan coffers"],
		"220":["Returning to the Tomb","9000-11000 meat to your clan coffers","nothing (no adv loss)"],
		"221":["A Chiller Night","learn some dance moves","waste a turn","nothing (no adv loss)"],
		"222":["A Chiller Night","multikill zombie hobos","nothing (no adv loss)"],
		"223":["Getting Clubbed","if crowd level is low enough, Proceed to Exclusive! (fight, multikill, or stats) \notherwise: nothing","lower the crowd level","enable dancing in the Burial Ground"],
		"224":["Exclusive!","Monster: Sleaze Hobo","multikill 10% of remaining sleazy hobos","+(3x mainstat) all stats (max 1000)"],
		"225":["Attention -- A Tent!","with instrument and no other same-class player already there, get on stage to perform\n otherwise, nothing (no adv loss)","Proceed to Working the Crowd (view performance, multikill, or collect nickels)","nothing (no adv loss)"],
		"226":["Here You Are, Up On Stage","gauge the size of the crowd and assist with the multikill","screw up the run"],
		"227":["Working the Crowd","gauge the size of the crowd","multikill normal hobos","farm nickels","nothing (no adv loss)"],
		"231":["The Hobo Marketplace","Proceed to choice of (food/booze/a mugging)","Proceed to choice of ((hats/pants/accessories), (combat items/muggers/entertainment), or (valuable trinkets))","Proceed to choice of buffs/tattoo/muggers/MP restore"],
		"233":["Food Went A-Courtin'","Proceed to choice of Mus/Mys/Mox foods","Proceed to choice of Mus/Mys/Mox boozes","Monster: gang of hobo muggers"],
		"235":["Food, Glorious Food","Proceed to buy Muscle food","Proceed to buy Mysticality food","Proceed to buy Moxie food"],
		"240":["Booze, Glorious Booze","Proceed to buy Muscle booze","Proceed to buy Mysticality booze","Proceed to buy Moxie food"],
		"245":["Math Is Hard","Proceed to choice of (hats/pants/accessories)","Proceed to choice of (combat items/muggers/entertainment)","Proceed to choice of (valuable trinkets/nothing)"],
		"248":["Garment District","Proceed to choice of (fedora/tophat/wide-brimmed hat)","Proceed to choice of (leggings/dungarees/suit-pants)","Proceed to choice of (shoes/stogie/soap)"],
		"253":["Housewares","Proceed to choice of (hubcap/caltrop/6-pack of pain)","Monster: gang of hobo muggers","Proceed to choice of (music/pets/muggers)"],
		"256":["Entertainment","Proceed to buy instrument","Proceed to try for a hobo monkey","Monster: gang of hobo muggers"],
		"259":["We'll Make Great...","hobo monkey OR +200 to each stat OR Monster: muggers","hobo monkey OR +200 to each stat OR Monster: muggers","hobo monkey OR +200 to each stat OR Monster: muggers"],
		"262":["Salud","+50% spell damage, +50 spell damage, lose 30-50MP per combat (20 turns)","Proceed to choice of (tanning/paling)","Proceed to choice of (buffs/other buffs/tattoos etc.)"],
		"264":["Tanning Salon","+50% Moxie (20 turns)","+50% Mysticality (20 turns)"],
		"265":["Another Part of the Market","Proceed to choice of (spooky resistance/sleaze resistance)","Proceed to choice of (stench resistance/+50% Muscle)","Proceed to choice of (tattoo/muggers/MP restore)"],
		"267":["Let's All Go To The Movies","Superhuman Spooky Resistance (20 adv)","Superhuman Sleaze Resistance (20 adv)","nothing"],
		"268":["It's fun to stay there","Superhuman Stench resistance (20 adv)","+50% Muscle (20 adv)","nothing"],
		"269":["Body Modifications","Proceed to choice of (tattoo/nothing)","Monster: gang of hobo muggers","refill all MP and Buff: -100% Moxie, gain MP during combat (20 adv)"],
		"273":["The Frigid Air","frozen banquet","8000-12000 meat to your clan coffers","nothing (no adv loss)"],
		"276":["The Gong Has Been Bung","spend 3 turns at Roachform","spend 12 turns at Mt. Molehill","Form of...Bird! (15 adv)"],

		// Roachform
		"278":["Enter the Roach","+(mainstat) Mus (max 200)\n leads to choice of Mox/Mus/MP, then to Mus/allstat/itemdrop/ML buffs", "+(mainstat) myst (max 200)\n leads to choice of Mys/Mus/MP, then to Myst/allstat/itemdrop/ML buffs","+(mainstat) Mox (max 200)\n leads to choice of Mox/Mys/MP, then to Mox/allstat/itemdrop/ML buffs"],
		"279":["It's Nukyuhlur - the 'S' is Silent.","+(mainstat) Mox (max 200)\n leads to choice of +30% Mus/+10% all stats/+30 ML","+(mainstat) Mus (max 200)\n leads to choice of +30% Mus/+10% all stats/+50% item drops","+(mainstat) MP (max 200)\n leads to choice of +30% Mus/+50% item drops/+30 ML"],
		"280":["Eek!  Eek!","+(mainstat) myst (max 200)\n leads to choice of +30% Myst/+30 ML/+10% all stats","+(mainstat) Mus (max 200)\n leads to choice of +50% item drops/+10% all stats/+30% Myst","+(mainstat) MP (max 200)\n leads to choice of +30 ML/+30% Myst/+50% item drops"],
		"281":["A Meta-Metamorphosis","+(mainstat) Mox (max 200)\n leads to choice of +30 ML/+30% Mox/+10% all stats","+(mainstat) myst (max 200)\n leads to choice of +30 ML/+30% Mox/+50% item drops","+(mainstat) MP (max 200)\n leads to choice of +30% Mox/+10% all stats/+50% item drops"],
		"282":["You've Got Wings, But No Wingman","+30% Muscle (20 turns)","+10% all stats (20 turns)","+30 ML (20 turns)"],
		"283":["Time Enough At Last!","+30% Muscle (20 turns)","+10% all stats (20 turns)","+50% item drops (20 turns)"],
		"284":["Scavenger is your Middle Name","+30% Muscle (20 turns)","+50% item drops (20 turns)","+30 ML (20 turns)"],
		"285":["Bugging Out","+30% myst (20 turns)","+30 ML (20 turns)","+10% all stats (20 turns)"],
		"286":["A Sweeping Generalization","+50% item drops (20 turns)","+10% all stats (20 turns)","+30% myst (20 turns)"],
		"287":["In the Frigid Aire","+30 ML (20 turns)","+30% myst (20 turns)","+50% item drops (20 turns)"],
		"288":["Our House","+30 ML (20 turns)","+30% Moxie (20 turns)","+10% all stats (20 turns)"],	
		"289":["Workin' For the Man","+30 ML (20 turns)","+30% Moxie (20 turns)","+50% item drops (20 turns)"],	
		"290":["The World's Not Fair","+30% Moxie (20 turns)","+10% all stats (20 turns)","+50% item drops (20 turns)"],
		
		//Haiku Dungeon
		"297":["Gravy Fairy Ring","2-3 of Knob, Knoll, and/or spooky mushroom","fairy gravy boat","nothing (no adv loss)"],
		
		//underwater
		"298":["In the Shade","with soggy seed packet and glob of green slime: acquire 1 sea fruit \nwithout: nothing","nothing (no adv loss?"],
		"299":["Down at the Hatch","first time: free Big Brother\nafterward: upgrade monsters in the Wreck for 20 turns","nothing (no adv loss)"],
		"304":["A Vent Horizon","first 3 times: summon bubbling tempura batter","nothing (no adv loss)"],
		"305":["There is Sauce at the Bottom of the Ocean","with Mer-kin pressureglobe, first 3 times: acquire globe of Deep Sauce\n without: nothing (no adv loss)","nothing (no adv loss)"],
		"309":["Barback","first 3 times: acquire Seaode","nothing (no adv loss)"],
		"311":["Heavily Invested in Pun Futures","Proceed to trade dull/rough fish scales","nothing (no adv loss)"],
		"403":["Picking Sides","skate blade (allows fighting ice skates)","brand new key (allows fighting roller skates)"],
		
		//slimetube
		"326":["Showdown","Monster: Mother Slime","nothing (no adv loss)"],
		"337":["Engulfed!","\nfirst time: enable an equipment-sliming\nafterward: nothing (no adv loss)","\nfirst time (and only 5 times per tube, total): increase tube ML by 20\nafterward: nothing (no adv loss)","nothing (no adv loss)"],
		
		//agua bottle
		"349":["The Primordial Directive","after using memory of some delicious amino acids: progress to fight monsters\nbefore: nothing","+10 Mox","without memory of some delicious amino acids: acquire memory of some delicious etc.\nwith: nothing"],
		"350":["Soupercharged","Monster: Cyrus","nothing"],
		"352":["Savior Faire","+25 Mox","+25 Mus","+25 Myst"],
		"353":["Bad Reception Down Here","Indigo Party Invitation (leads to Moxie choices)","Violet Hunt Invitation (leads to stat/fam wt choices)"],
		"354":["","+some Mox (max 200?)","+15% Moxie (20 turns)"],
		"355":["","+some mus, myst, and mox (max ???)","+4 lb familiar weight (20 turns)"],
		"356":["A Diseased Procurer","Blue Milk Club Card (leads to stats/item drop buff)","Mecha Mayhem Club Card (leads to Muscle choices)"],
		"357":["Painful, Circuitous Logic","+some Mus (max 200?)","+15% Muscle (20 turns)"],
		"358":["Brings All the Boys to the Blue Yard","+some Mus, Myst, Mox (max 200 each)","+20% item drops (20 turns)"],
		"361":["Give it a Shot","'Smuggler Shot First' button (leads to Myst choices)","Spacefleet Communicator Badge (leads to stats/meat drop buff)"],
		"362":["A Bridge Too Far","+some mus, myst, and mox (max 200?)","+35% meat drops (20 turns)"],
		"363":["","+some Myst (max 200?)","+15% Myst (20 turns)"],
		"364":["","+some Mox (max 200?)","Supreme Being Glossary (advance quest state)","+some Mus (max 200?)"],
		"365":["None Shall Pass","-30 meat, +50 Mus","-60 meat, multi-pass (advance quest state)","nothing (no adv loss??)"],
		"392":["The Elements of Surprise...","\nCorrect order is: Sleaze/Spooky/Stench/Cold/Hot"],
		//Krakrox
//		"366":["Entrance","Proceed to City Center","nothing"],
//		"367":["Ancient Temple","Proceed to Northern gate","?","\nwith memories of stone half-circle and half stone circle: unlock Ancient Temple\nwithout: nothing","Leave"],
//		"368":["City Center","To North Side","To East Side","To West Side","","To Well","nothing"],
//		"369":["North Side","To Northern Gate","To Ancient Tower","To City Center","nothing"],
//		"370":["East Side","To North Abandoned Building","To City Center","To South Abandoned Building","nothing"],
//		"371":["West Side","To Ancient Tower","To City Center","To Storehouse","nothing"],
//		"372":["Ancient Well","To City Center","\nwithout grappling hook: nothing\nwith grappling hook: Monster: giant octopus\nafter fighting octopus: retrieve grappling hook","nothing (continue choices)","nothing"],
//		"373":["Northern Gate",
//			"To North Side",
//			"do something in the catacombs",
//			"enable northern gate lever",
//			"\nafter manipulating Catacomb Machinery: open Ancient Temple through this gate\notherwise nothing",
//			"proceed to Ancient Temple",
//			"enable ?",
//			"enable northern gate lever",
//			"open ?",
//			"nothing (continue choices)",
//			"nothing (leave city)"],
//		"374":["Ancient Tower","To North Side","To West Side","\nwith grappling hook: Monster: giant bird-creature\nfirst time after fighting bird: acquire memory of half a stone circle\nwithout: nothing (leave city)","nothing (leave city)"],
//		"375":["Northern Abandoned Building","To East Side","\nfirst time: acquire iron key\nsubsequent: nothing","to Basement","nothing (leave city)"],
//		"376":["Ancient Temple",
//			"\nwithout glowing crystal: nothing\nwithout having created supervirus: Monster: ancient temple guardian\nwithout wearing cultist's robe: Monster: group of cultists\nwith all of the above: Monster: High Priest of Ki'rhuss","nothing (leave city)"],
//		"377":["Southern abandoned building","To East Side","To Upstairs","to Basement","nothing (leave city)"],
//		"378":["Storehouse","To West Side","\nfirst time: acquire grappling hook\nsubsequent: nothing (leave city)","nothing (leave city)"],
//		"379":["Northern Basement","to North Abandoned Building","\nfirst time: fight giant spider\nwith iron key: acquire small stone block\notherwise: nothing (leave city)","\nacquire small stone block","nothing (leave city)"],
//		"380":["Southern Building Upstairs","To Southern Building Downstairs","first time: Monster: giant jungle python","?","\nfirst time: acquire little stone block","nothing (leave city)"],
//		"381":["Southern Building Basement","to Southern Building Downstairs","to Catacombs Entrance","nothing (leave city)"],
//		"382":["Catacombs Entrance","To Southern Building Basement","To Junction","nothing (leave city)"],
//		"383":["Catacombs Junction","To Lake","To Catacombs Entrance","To Dead-End","nothing (leave city)"],
//		"384":["Catacombs Dead-End","To Junction","enable chest-smashing","acquire stone half-circle","nothing (leave city)"],
//		"385":["Shore of Underground Lake","To Junction","","","before killing octopus: nothing\nafter: To Machinery","nothing (leave city)"],
//		"386":["Catacombs Machinery","To Lake","\nwith grappling hook and with lever pulled: collapse machinery, enable opening of northern gate\notherwise nothing","nothing (leave city)"],
	
		
		//marbles
		"393":["The Collector","lose 1 of each marble, gain 32768 meat, qualify for trophy","nothing"],
		
		//Down the rabbit hole
		"441":["The Mad Tea Party","\nacquire a buff based on your hat name","nothing"],
		"442":["A Moment of Reflection",
			"\nas Seal Clubber: Walrus Ice Cream or yellow matter custard\nas Pastamancer: eggman noodles or yellow matter custard\notherwise: yellow matter custard",
			"\nas Sauceror: vial of jus de larmes or delicious comfit\nas Accordion Thief: missing wine or delicious comfit\notherwise: delicious comfit",
			"\nas Disco Bandit: Lobster qua Grill or monster: croqueteer\nas Turtle Tamer: beautiful soup or monster: croqueteer\notherwise: monster: croqueteer",
			"\nwith beautiful soup, lobster qua grill, missing wine, walrus ice cream, and humpty dumplings:\nacquire ittah bittah hookah\n(if you already have an ittah bittah hookah: 20 turns of a random effect)\nwithout all 5 courses: nothing",
			"\nplay a chess puzzle",
			"\nnothing"],
			//Seal Clubber
		"444":["The Field of Strawberries","walrus ice cream","yellow matter custard"],
			//Pastamancer
		"445":["The Field of Strawberries","eggman noodles","yellow matter custard"],
			//Accordion Thief
		"446":["A Caucus Racetrack","missing wine","delicious comfit"],
			//Sauceror
		"447":["A Caucus Racetrack","vial of jus de larmes","delicious comfit"],
			//Turtle Tamer
		"448":["The Croquet Grounds","beautiful soup","monster: croqueteer"],
			//Disco Bandit
		"449":["The Croquet Grounds","Lobster qua Grill","monster: croqueteer"],
		"450":["The Duchess' Cottage",
			"\nwith beautiful soup, lobster qua grill, missing wine, walrus ice cream, and humpty dumplings: \nacquire ittah bittah hookah\n(if you already have an ittah bittah hookah: 20 turns of a random effect)\nwithout all 5 courses: nothing",
			"nothing"],
			
		//Enormous > sign
		"451":["Typographical Clutter","acquire (","lose 30 meat, +10-15 Mox\nOR\ngain 500 meat, +10-15 Mox","acquire + (first time) or +10-15 Mus","+10-15 myst, +100 MP","teleportitis (5 turns)"],
			
		//Professor Jacking
		"452":["Leave a message and I'll call you back","\nwith raisin in machine: kill spider\nwithout: lose (all?) HP",
													  "\nif spider alive: tiny fly glasses\nif spider dead: Flyest of Shirts (if torso-aware)/nothing",
													  "\nif fruit in machine: 3 fruit\notherwise nothing"],
		"453":["Getting a leg up","Monster: jungle scabie","gain 30-40 mus, mys, and mox","acquire hair of the calf"],
		"454":["Just Like the Ocean Under the Moon","Monster: smooth jazz scabie","gain 90-100 HP and 90-100 MP"],
		"455":["Double Trouble in the Stubble","gain 50-60 mus, mys, and mox","\nwith can-you-dig-it:acquire legendary beat\nwithout: lose (lots of) HP"],
		"456":["Made it, Ma!  Top of the world!","Monster: The Whole Kingdom","effect: Hurricane Force","acquire a dance upon the palate (first time only)","gain 31-40 mus, mys, and mox"],
		
											
		//Kegger in the woods
		"457":["Oh no!  Five-Oh!","\nClose area and receive reward:\n<10 numbers: Bronze Handcuffs\n10-19: cuffs, Silver Keg\n20+:cuffs, keg, bottle of GoldSchnockered","nothing (keep area open)"],
		
		//New tavern
		"496":["Crate Expectations","acquire 3 base boozes","clear square (no adv loss)"],
		"511":["If it's tiny, is it still a mansion?","Monster: Baron von Ratsworth","nothing (no adv loss)"],
		"512":["Hot and Cold Running Rats","monster: drunken rat","nothing (no adv loss)"],
		"513":["Staring Down the Barrel","3-5 ice-cold willers","clear square (no adv loss)"],
		"514":["1984 Had Nothing On This Cellar","3-5 rat whiskers or smiling rat familiar","clear square (no adv loss)"],
		"515":["A Rat's Home...","3 bottles of tequila","clear square (no adv loss)"],
		
		//Lab
		"516":["Mr. Alarm, I Presarm","unlock Whitey's Grove, continue quest"],
		//Neckback Crick
		"497":["SHAFT!","Monster: unearthed monstrosity","nothing"],
		
		// vamp out
		"546":["Interview with You","","","","nothing (no turn loss)"],
		
		// haunted sorority house
		"548":["Necbromancer","monster: Necbromancer","nothing (no adventure loss)"],
		"549":["Dark in the attic",
				"\n3 haunted house sorority staff guides (first time only)\notherwise no turn loss",
				"\nGhost trap",
				"\nIncrease ML",
				"\nDecrease ML",
				"\nWith silver shotgun shell: clear many werewolves\nwithout: nothing"],
		"550":["The Unliving room",
				"\nIncrease ML",
				"\nDecrease ML",
				"\nWith chainsaw chain:clear many zombies\nwithout: nothing",
				"\nWith funhouse mirror:clear many skeletons\nwithout: nothing",
				"\nitem of haunted sorority makeup"],
		"551":["Debasement",
				"\nProceed to choice of chainsaw chain/silver shotgun shell/funhouse mirror",
				"\nWith plastic vampire fangs:clear many vampires (one time only)\nwithout:nothing",
				"\nIncrease ML",
				"\nDecrease ML"],
		"552":["Prop Deportment",
				"Chainsaw chain",
				"Proceed to Reloading Bench (silver shotgun shell)",
				"Funhouse mirror"],
		"553":["Relocked and reloaded",
				"Silver shotgun shell",
				"Silver shotgun shell",
				"Silver shotgun shell",		
				"Silver shotgun shell",
				"Silver shotgun shell",
				"Nothing"],
		"554":["Behind the spooky curtain",
				"\nProceed to choice of staff guides/ghost trap/ML/werewolf-slaying",
				"\nProceed to choice of ML/zombie-slaying/skeleton-slaying/random make-up item",
				"\nProceed to choice of (chainsaw chain/shotgun shell/funhouse mirror)/vampire-slaying/ML"],
		
		// Kloop:
		"560":["Foreshadowing Demon!","\nEnables choice of Thorax/Bat-in-Spats adventure","nothing (no adv loss)"],
		"561":["You must choose your destruction!","\nEnable fight with Thorax","\nEnable fight with Bat-in-Spats"],
		"563":["A test of your mettle","\nProceed to choice of Thorax or Bat-in-Spats","\nnothing (no adv loss)"],
		"564":["A maelstrom of trouble","\nEnable option to fight boss demons (Pinch or Thugs)","\nnothing (no adv loss)"],
		"565":["To get groped or get mugged?","\nMonster: The Terrible Pinch","\nMonster: Thug 1 and Thug 2"],
		"566":["A choice to be made","\nProceed to choice of The Terrible Pinch or Thugs 1 and 2","\nnothing (no adv loss)"],
		"567":["You may be on thin ice","\nenable option to fight boss demons (Mammon or Snitch)","nothing (no adv loss)"],
		"568":["Some Sounds Most Unnerving","\nMonster: Mammon the Elephant","\nMonster: The Large-Bellied Snitch"],
		"569":["One More demon to slay","\nProceed to choice of Mammon or Snitch","\nnothing (no turn loss)"],
			
		// New hidden temple!
		"581":["Such Great Depths","acquire glowing fungus","effect: Hidden Power (+15 all stats)","Monster: clan of cave bars"],
		"582":["Fitting In","\nProceed to choice of Mys gain/Hidden City Unlock item/buff extension + 3 turns",
				"\nProceed to Hidden Heart of the Hidden Temple\n(Hidden City unlock path)",
				"\nProceed to choice of (glowing fungus/buff/fight clan of cave bars)"],
		"579":["Such Great Heights",
				"\n+(some) Mys","acquire The Nostril of the Serpent\n(first time only)","+3 Adv, +3 turns of effects (first time only)"],
//		can't do 580 directly, it's a multi-part choice.  bah.
//		"580":["Hidden Heart (pikachu)",
//				"unlock hidden city",
//				"\nwith Nostril of the Serpent: Unconfusing buttons\nwithout: Confusing buttons",
//				"+(some) Moxie, effect: somewhat poisoned"],
		"584":["Unconfusing Buttons",
				"set Hidden Heart adv to Stone (mus/buttons/moxie",
				"set Hidden Heart adv to sun (calendar fragment/buttons/moxie",
				"set hidden heart adv to gargoyle (+MP/buttons/moxie",
				"set hidden heart adv to Pikachulotl (hidden city unlock/buttons/moxie"],

		//Twin Peak
		"605":["Welcome to the Great Overlook Lodge","/nstart the quest process"],
		"606":["Lost in the Great Overlook Lodge",
			"\nproceed to Room 237 (need at least 4 levels of stench resistance)",
			"\nproceed to Go Check It Out! (need at least +50% item drop (not including your familiar)",
			"\nproceed to There's Always Music In the Air (need jar of oil (made from drops at Oil Peak)",
			"\nproceed to To Catch a Killer (need at least +40% combat initiative)",
			"\nnothing (no turn loss?)"],
		"607":["Room 237","\n with 4 or more levels of stench resistance: advance quest status\nwithout: nothing",
			"\nnothing"],
		"608":["Go Check It Out!","\nwith at least +50% item drop: advance quest status\nwithout: nothing",
			"\nnothing"],
		"609":["There's Always Music in the Air","\nwith jar of oil: advance quest status\nwithout: nothing",
			"\nnothing"],
		"610":["To Catch a Killer","\nwith at least +40% combat init: complete this zone\nwithout: nothing",
			"\nnothing"],
		"616":["He Is the Arm, and He Sounds Like This","\nadvance quest status"],
		"617":["Now It's Dark","\ncomplete the zone"],

		//A-Boo Peak:
		"611":["The Horror...","take increasing Cold & spooky damage, advance zone completion percentage",
			"\nleave (no damage, no advancement)"],
		
		//multi-using skeletons
		"603":["Skeletons and The Closet",
			"\nacquire effect: Skeletal Warrior, 30 turns (delevel, physical damage)",
			"\nacquire effect: Skeletal Cleric, 30 turns (hot damage, restore HP)",
			"\nacquire effect: Skeletal Wizard, 30 turns (cold damage, restore MP)",
			"\nacquire effect: Skeletal Rogue, 30 turns (first-round physical damage, bonus meat drop)",
			"\nacquire effect: Skeletal Buddy, 30 turns (+2 stats/fight, delevel enemy defense each round)",
			"\ndo nothing (cancel using the skeleton)\n\nnote that acquiring multiple effects simultanously gives additional bonuses\n"
			],

		//mimes?
		"612":["Behind the world there is a door...","\nProceed to Behind The Door There is a Fog","\nleave (no adv loss)"],
		"613":["Behind the door there is a fog",
			"\nsee part of a message",
			"\nMonster: 4-shadowed mime",
			"\nproceed to anvil (choice of soul fragment smithings)",
			"\nwith soul coin: acquire class-based skill recording\nwithout: nothing (turn is lost)"],
		"614":["Near the fog there is an... anvil?",
			"soul doorbell",
			"soul mask",
			"soul knife",
			"soul coin",
			"nothing",
			"nothing"],

		//Camp scouts
		"595":["Fire!  I... have made... Fire!",
			"+3 PvP fights (if hippy stone is already broken)",
			"regenerate 3-5 MP and 3-5 HP per combat"],

		//Gnome at Susie:
		"597":["",
			"\ngnome breathes underwater; reduce pressure penalty by 10%",
			"\ngnome blocks attacks",
			"\ngnome attacks in combat",
			"\ngnome grants adventures like a riftlet",
			"\ngnome delevels like a barrrnacle"],
	
		//Bugbear path
		"588":["Machines!",
			"\n(should be set to 2)",
			"\n(should be set to 4)",
			"\n(should be set to 8)"],
		"589":["Autopsy Auturvy",
			"\nwith tweezers: advance zone\nwithout: nothing",		
			"\nwith tweezers: advance zone\nwithout: nothing",		
			"\nwith tweezers: advance zone\nwithout: nothing",		
			"\nwith tweezers: advance zone\nwithout: nothing",		
			"\nwith tweezers: advance zone\nwithout: nothing",		
			"\nnothing"],
		"590":["Not Alone in the Dark",
			"\nfight Black Ops Bugbear, or nothing",
			"\nincrease fight chance when looking for a fight",
			"\nnothing (no adv loss)"],
		//Old Man's Bathtub
		"637":["First Mate set 1",
			"\nadd Bristled Man-o-War to available monsters",
			"\nblock the Deadly Hydra's crew-stealing (lose 3 crayons)",
			"\nlose 1 crew, gain 20-23 bubbles",
			"\nblock the giant man-eating shark's crew-stealing (lose 14-16 bubbles)"],
		"638":["First Mate set 2",
			"\nadd Deadly Hydra to available monsters",
			"\ngain 13-19 bubbles",
			"\nlose 1 crew, gain 4 bubbles",
			"\nblock the Fearsome Giant Squid's crew-stealing (lose 13-20 bubbles)"],
		"639":["First Mate set 3",
			"\nincrease frequency of log NCs from 1/5 to 1/4 (lose 8 crew, 2-3 crayons, 17-20 bubbles)",
			"\ngain 3 crayons",
			"\ngain 3 crayons and 16 bubbles (lose 2 crew)",
			"\ngain 5 crew (lose 6-16 bubbles, lose 2 crayons)"],
		"636":["First Mate set 4",
			"\nadd Cray-Kin to available monsters",
			"\ngain 3 crew (lose 8-10 bubbles)",
			"\ngain 2 crayons, 8-11 bubbles",
			"\nblock the Ferocious Roc's crew-stealing (lose 2 crayons)"]
	};
//	GM_log("in GetSpoilersForAdvNumber");
	if (advOptions[advNumber] !== undefined) { return advOptions[advNumber]; }
	else { return null; }
}

function GetSpoilersForImageName(advNumber, imageName) {
	//data format: advOptions[adventureNumber][imageName] = array of strings.
	//array element 0 = optional ID text; 1-n = spoiler text.
	var advOptions = {
		"580":{
			"door_stone.gif":["",
				"+100 (?) Mus",
				"\nwith Nostril of the Serpent: choose door setting\nwithout: Confusing Buttons",
				"+(some) Moxie, effect: somewhat poisoned"],
			"door_sun.gif":["",
				"ancient calendar fragment",
				"\nwith Nostril of the Serpent: choose door setting\nwithout: Confusing Buttons",
				"+(some) Moxie, effect: somewhat poisoned"],
			"door_gargoyle.gif":["",
				"+(some) MP",
				"\nwith Nostril of the Serpent: choose door setting\nwithout: Confusing Buttons",
				"+(some) Moxie, effect: somewhat poisoned"],
			"door_pikachu.gif":["",
				"\nto Hidden City unlock (must have 3 turns left)",
				"\nwith Nostril of the Serpent: choose door setting\nwithout: Confusing Buttons",
				"+(some) Moxie, effect: somewhat poisoned"]
		},
		"535":{ 
			"rs_3doors.gif":["Anyway, somebody went through a lot",
				"to Pool (toward EMU parts or +mys buff or elfpacks)",
				"To Armory (toward EMU joystick/elfpacks or +mus/mox buffs)",
				"to Mess (toward effects or EMU rocket)"],
			"rs_junction.gif":["A blond-haired disembodied head",
				"to EMU joystick",
				"to elven packs",
				"back to Lobby"],
			"elf_headcrab.gif":["vast bank of television screens",
				"to EMU rocket thrusters",
				"effect: +5 myst substat/fight"],
			"elfscientist.gif":["could sure use those thrusters",
				"EMU rocket thrusters"],
			"elfdonfreeman.gif":["There are two joysticks on it",
				"EMU joystick"],
			"rs_portal.gif":["through into the shaft",
				"medi-pack and magi-pack"],
			"surv_overarmed.gif":["down the hallway to the armory",
				"to Lobby",
				"to Keycard",
				"to Romance (choice of buffs)"],
			"rs_2doors.gif":["sliding towards the male elf",
				"effect: +5 mus substat/fight",
				"effect: +5 mox substat/fight"],
			"surv_unlikely.gif":["You follow the signs to the Mess",
				"to Lobby",
				"to Romance (choice of buffs)",
				"to Headcrab (effect or EMU rocket thrusters)"],
			"rs_door.gif":["You follow the map to the secret bunker",
				"to Lobby"],
			"elfordbrimley.gif":["doesn't look swimmable",
				"to Lobby",
				"to Headcrab (Effect or EMU rocket thrusters)",
				"to Keycard"]
		}
	};
//	GM_log("in GetSpoilersForImageName");
	if ((advOptions[advNumber] !== undefined) && (advOptions[advNumber][imageName] !== undefined)) {
		 return advOptions[advNumber][imageName]; 
	}
	else { return null; }
}

function GetSpoilersForBodyText(advNumber, URL, imageName, bodyText) {
//	GM_log("GSforBodyTextparams: adv=" + advNumber + ", URL="+URL+", imageName="+imageName);
	//data format:
	// advOption[adventureNumber][Url-or-imagename][sequencenumber] = array of strings.
	//array element 0 = required ID text (can be any part of HTML); 1-n = spoiler text.
	var i = 0, advOptions ={
    "0": {
        "/friars.php": {
            "0": [
                "Brother Flying Burrito, the Deep Fat Friar",
                "+30% food drops (20 adv)"
            ],
            "1": [
                "Brother Corsican, the Deep Fat Friar",
                "+2 familiar experience per combat (20 adv)"
            ],
            "2": [
                "Brother Smothers, the Deep Fat Friar",
                "+30% booze drops (20 adv)"
            ]
        },
        "/basement.php": {
            "0": [
                "twojackets",
                "+(mainstat) Mox",
                "+(mainstat) Mus"
            ],
            "1": [
                "twopills",
                "+(mainstat) Mus",
                "+(mainstat) Myst"
            ],
            "2": [
                "figurecard",
                "+(mainstat) Myst",
                "+(mainstat) Mox"
            ]
        },
        "/bigisland.php": {
            "0": [
                "Get Healed",
                "+1,000 HP"
            ],
            "1": [
                "Get a Massage",
                "+1,000 HP, +1,000 MP"
            ],
            "2": [
                "Party with the free spirits",
                "+5 stats per combat (20 adv)",
                "+20% item drops (20 adv)",
                "+5lb familiar weight (20 adv)"
            ],
            "3": [
                "Try to get into the music",
                "+10% all stats (20 adv)",
                "+40% meat drops (20 adv)",
                "+50% initiative (20 adv)"
            ]
        },
        "/postwarisland.php": {
            "0": [
                "Get Healed",
                "+1,000 HP"
            ],
            "1": [
                "Get a Massage",
                "+1,000 HP, +1,000 MP"
            ],
            "2": [
                "Party with the free spirits",
                "+5 stats per combat (20 adv)",
                "+20% item drops (20 adv)",
                "+5lb familiar weight (20 adv)"
            ],
            "3": [
                "Try to get into the music",
                "+10% all stats (20 adv)",
                "+40% meat drops (20 adv)",
                "+50% initiative (20 adv)"
            ]
        },
        "/palinshelves.php": {
            "0": [
                "Drawn Onward",
                "\nwith photo of God, hard rock candy, ketchup hound and ostrich ",
                "nothing (no adv loss)"
            ]
        },
        "/clan_viplounge.php": {
            "0": [
                "You approach the pool table.",
                "+5 lb familiar weight/+50% weapon damage (10 adv)",
                "+10 MP/turn, +50% spell damage (10 adv)",
                "+10% item drops, +50% initiative (10 adv)"
            ],
            "1": [
                "You change into your swimsuit",
                "\nGet into the pool",
                "+30 init, +25 stench damage, +20 ML (50 turns)",
                "\ndecreased chance of random PvP, +NC (50 turns)"
            ]
        },
        "/clan_rumpus.php": {
            "0": [
                "This jukebox has a staggering",
                "+10% meat drops (10 turns)",
                "+3 stats per combat (10 turns)",
                "+10% item drops (10 turns)",
                "+20% initiative (10 turns)",
                "buy a different piece of clan furniture for this spot"
            ],
            "1": [
                "There's a ball pit here with",
                "+(balls/100)% to all stats (20 turns)"
            ],
            "2": [
                "Unfortunately for you, only the three least popular flavors",
                "an item giving +30 Mox (10 turns)",
                "an item giving +30 Mus (10 turns)",
                "an item giving +30 Mysticality (10 turns)",
                "buy a different piece of clan furniture for this spot"
            ]
        },
	"/campground.php": {
		"0": [
		    "Discount Telescope Warehouse.",
		    "+(5-35)% to all stats (10 turns)",
		    "See what's in the NS tower"
		]
	}
    },
    "536": {
            "0": [
                "You walk behind the bar",
                "To Tavern",
                "To Sleeping Quarters (food/drink pills)",
                "To Warehouse (HP regen effect or EMU harness)"
            ],
            "1": [
                "You step through the door",
                "distention pill (food)",
                "synthetic dog hair pill (drink)",
                "To Tavern"
            ],
            "2": [
                "You walk through the door and into what appears to be some kind of laboratory",
                "EMU Harness"
            ],
            "3": [
                "You open the door and walk into a dark room",
                "2 elven hardtack+2 elven squeeze"
            ],
            "4": [
                "You step from the clean, bright hallway",
                "EMU helmet"
            ]
    }
};
//	GM_log("in GetSpoilersForBodyText");
//	GM_log("bodyText = " + bodyText);
	if (advNumber === 0) {
		for (i in advOptions[0][URL]) {
//			GM_log("i="+i+"; checking for text:" +advOptions[0][URL][i][0]);
			if (bodyText.indexOf(advOptions[0][URL][i][0]) !== -1) {
//				GM_log("found text "+advOptions[0][URL][i][0]);
				return advOptions[0][URL][i];
			}
		}
		return null;
	} else {
		for (i in advOptions[advNumber]) {
//			GM_log("i="+i+"; checking for text: "+advOptions[0][imageName][i][0]);
			if (bodyText.indexOf(advOptions[advNumber][i][0]) !== -1) {
//				GM_log("found text "+advOptions[advNumber][i][0]);
				return advOptions[advNumber][i];
			}
		}
	}
	return null;
}


function autoUpdate (id, version){
	function eliminaElem(e){if(e)e.parentNode.removeChild(e)}
	function addGlobalStyle(css){var head,style;head=document.getElementsByTagName('head')[0];style=document.createElement('style');style.type='text/css';style.innerHTML=css;head.appendChild(style)}
	function trim(cad){return cad.replace(/^\s+|\s+$/g,"")}
	
	function menuCommand (){
		GM_registerMenuCommand ("Turn auto-updater on",
								function (){
									GM_setValue ("update", new Date ().getTime ().toString () + "#1");
								});
	}
	
	function showMessage (){
		addGlobalStyle (
			"#autoUpdater_capaAutopUpdate {" +
				"position: absolute;" +
				"left: 20px;" +
				"width: 280px;" +
				"background-color: #EEE;" +
				"padding: 7px;" +
				"font-family: Calibri;" +
				"font-size: 14px;" +
				"-moz-border-radius: 5px;" +
				"border: solid thin #C7C7C7;" +
				"z-index: 100" +
			"}"
		);
	
		var t;
		
		function move2 (capa){
			if (capa.style.left == "-301px"){
				clearTimeout (t);
				eliminaElem (capa);
			}else{
				capa.style.left = parseInt (capa.style.left) - 3 + "px";
				t = setTimeout (function (){ move2 (capa); }, 20);
			}
		}
		
		function move (capa){
			if (capa.style.top == "20px"){
				clearTimeout (t);
				t = setTimeout (function (){ move2 (capa); }, 5000);
			}else{
				capa.style.top = parseInt (capa.style.top) + 1 + "px";
				t = setTimeout (function (){ move (capa); }, 20);
			}
		}
		
		var capa = document.createElement ("div");
		capa.id = "autoUpdater_capaAutopUpdate";
		capa.innerHTML = "<img style='float: left; position: relative; top: 1px;' src='data:image/png;base64,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'/>" +
						 "<span style='cursor: default; text-align: center;'>You can turn the auto-updater on in the Greasemonkey Menu Command.</span>";

		document.getElementsByTagName ("body")[0].appendChild (capa);
		
		capa.style.top = "-50px";
		capa.style.left = "20px";
		move (capa);
	}
	
	var ms = new Date ().getTime ();
	
	var update = GM_getValue ("update");
	var search = false;
	var days;
	
	if (update == undefined){
		search = true;
		
		//By default it searches updates every 1 day.
		GM_setValue ("update", (24*60*60*1000 + ms).toString () + "#1");
		days = 1;
	}else{
		days = parseInt (update.split ("#")[1]);
		if (days != 0){
			var next_ms = update.split ("#")[0];
			if (ms >= parseInt (next_ms)){
				search = true;
				
				GM_setValue ("update", (days*24*60*60*1000 + ms).toString () + "#" + days);
			}
		}else{
			//Register Menu Command
			menuCommand ();
		}
	}

	if (!search) return;
	
	GM_xmlhttpRequest ({
		method: "GET",
		url: "http://userscripts.org/scripts/show/" + id,
		headers: {
					"User-agent": "Mozilla/5.0",
					"Accept": "text/html",
				 },
		onload: function (respuesta){
			var userScripts = document.implementation.createDocument ("", "", null);
			var html = document.createElement ("html");
			html.innerHTML = respuesta.responseText;
			userScripts.appendChild (html);
			
			//Get new version
			var newVersion = userScripts.getElementById ("summary").getElementsByTagName ("b")[1].nextSibling.textContent;
			
			//Get the name of the script
			var name = userScripts.getElementById("details").childNodes[1].innerHTML;
			
			if (trim(newVersion) != trim(version)){
				//There's a new version
				addGlobalStyle (
					"#autoUpdater_divVersion { text-align: left; height: 140px; position: fixed; top: 10px; left: 10px; background: #EEE; border: solid thin #C7C7C7; padding: 8px; font-family: Calibri; font-size: 14px; -moz-border-radius: 5px; cursor: default; z-Index: 100;}" +
					"#autoUpdater_imgVersion { position: relative; top: 4px; margin-right: 5px; }" +
					"#autoUpdater_install { position: absolute; top: 45px; right: 8px; width: 75px; padding: 5px; border: 1px solid #DEDEDE; background-color: #F5F5F5; color: #565656; text-decoration: none; cursor: pointer; }" +
					"#autoUpdater_install img { padding: 0; margin: 0 2px 0 2px; position: relative; top: 2px; right: 4px; }" +
					"#autoUpdater_install span { position: relative; bottom: 1px; }" +
					"#autoUpdater_cancel { position: absolute; bottom: 8px; width: 75px; right: 8px; padding: 5px; border: 1px solid #DEDEDE; background-color: #F5F5F5; color: #565656; text-decoration: none; cursor: pointer; }" +
					"#autoUpdater_cancel img { padding: 0; margin: 0 2px 0 2px; position: relative; top: 2px; right: 4px; }" +
					"#autoUpdater_cancel span { position: relative; bottom: 1px;}" +
					"#autoUpdater_currentVersion { color: #373737; width: 105px; }" +
					"#autoUpdater_newVersion { color: #373737; width: 105px; }" +
					"#autoUpdater_versionTitle { color: #373737; }" +
					"#autoUpdater_numCurrentVersion { color: #232323; }" +
					"#autoUpdater_numNewVersion { color: #232323; }" +
					"#autoUpdater_text1 { font-size: 14px; color: #373737; position: absolute; bottom: 48px; }" +
					"#autoUpdater_text2 { font-size: 11px; color: #373737; position: absolute; bottom: 34px; left: 8px; }" +
					"#autoUpdater_text3 { font-size: 14px; color: #373737; position: absolute; bottom: 8px; left: 42px; }" +
					"#autoUpdater_input { font-family: Calibri; font-size: 14px; background: #FFF; border: solid thin #232323; color: #232323; width: 23px; height: 15px; position: absolute; bottom: 8px;}" +
					"#autoUpdater_table { border-spacing: 0 0; }" +
					"#autoUpdater_table td { font-family: Calibri; font-size: 14px; }" +
					"#autoUpdater_linkScript { font-family: Calibri; font-size: 14px; color: #000099; text-decoration: none; }"
				);
				
				var capa = document.createElement("div");
				capa.setAttribute("id", "autoUpdater_divVersion");
				capa.innerHTML = "<img id='autoUpdater_imgVersion' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKcSURBVDjLpZPLa9RXHMU/d0ysZEwmMQqZiTaP0agoaKGJUiwIxU0hUjtUQaIuXHSVbRVc+R8ICj5WvrCldJquhVqalIbOohuZxjDVxDSP0RgzyST9zdzvvffrQkh8tBs9yy9fPhw45xhV5X1U8+Yhc3U0LcEdVxdOVq20OA0ooQjhpnfhzuDZTx6++m9edfDFlZGMtXKxI6HJnrZGGtauAWAhcgwVnnB/enkGo/25859l3wIcvpzP2EhuHNpWF9/dWs/UnKW4EOGDkqhbQyqxjsKzMgM/P1ymhlO5C4ezK4DeS/c7RdzQoa3x1PaWenJjJZwT9rQ1gSp/js1jYoZdyfX8M1/mp7uFaTR8mrt29FEMQILr62jQ1I5kA8OF59jIItVA78dJertTiBNs1ZKfLNG+MUHX1oaURtIHEAOw3p/Y197MWHEJEUGCxwfHj8MTZIcnsGKxzrIURYzPLnJgbxvG2hMrKdjItjbV11CYKeG8R7ygIdB3sBMFhkem0RAAQ3Fuka7UZtRHrasOqhYNilOwrkrwnhCU/ON5/q04vHV48ThxOCuoAbxnBQB+am65QnO8FqMxNCjBe14mpHhxBBGCWBLxD3iyWMaYMLUKsO7WYH6Stk1xCAGccmR/Ozs/bKJuXS39R/YgIjgROloSDA39Deit1SZWotsjD8pfp5ONqZ6uTfyWn+T7X0f59t5fqDhUA4ry0fYtjJcWeZQvTBu4/VqRuk9/l9Fy5cbnX+6Od26s58HjWWaflwkusKGxjm1bmhkvLXHvh1+WMbWncgPfZN+qcvex6xnUXkzvSiYP7EvTvH4toDxdqDD4+ygT+cKMMbH+3MCZ7H9uAaDnqytpVX8cDScJlRY0YIwpAjcNcuePgXP/P6Z30QuoP4J7WbYhuQAAAABJRU5ErkJggg=='/><span id='autoUpdater_versionTitle'>New version available for <a id='autoUpdater_linkScript' target='_blank' href='http://userscripts.org/scripts/show/" + id + "'><b><u>" + name + "</u></b></a>!</span>" +
								 "<br/><hr/>" +
								 "<table id='autoUpdater_table'>" +
									"<tr><td id='autoUpdater_currentVersion'>Current version:</td><td id='autoUpdater_numCurrentVersion'><b>" + version + "</b></td></tr>" +
									"<tr><td id='autoUpdater_newVersion'>New version:</td><td id='autoUpdater_numNewVersion'><b>" + newVersion + "</b></td></tr>" +
								 "</table>" +
								 "<a id='autoUpdater_install' title='Install script'><center><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAH+SURBVBgZBcE9i11VGAbQtc/sO0OCkqhghEREAwpWAWUg8aMVf4KFaJEqQtAipTZWViKiCGOh2Ap2gmJhlSIWFsFOxUK0EsUM3pl79n4f12qHb3z3Fh7D83gC95GOJsDe0ixLk5Qq/+xv/Lw9Xd+78/HLX3Y8fXTr2nWapy4eCFKxG7Fby97SnDlYtMbxthyfzHO//nl85fNvfvnk8MbX5xa8IHx1518Vkrj54Q+qQms2vVmWZjdiu5ZR2rT01166/NCZg/2PFjwSVMU6yjoC1oq+x6Y3VbHdlXWExPd379nf7Nmejv2Os6OC2O4KLK0RNn3RNCdr2Z5GJSpU4o+/TkhaJ30mEk5HwNuvX7Hpi76wzvjvtIwqVUSkyjqmpHS0mki8+9mPWmuWxqYvGkbFGCUAOH/+QevYI9GFSqmaHr5wkUYTAlGhqiRRiaqiNes6SOkwJwnQEqBRRRJEgkRLJGVdm6R0GLMQENE0EkmkSkQSVVMqopyuIaUTs0J455VLAAAAAODW0U/GiKT0pTWziEj44PZ1AAAAcPPqkTmH3QiJrlEVDXDt0qsAAAAAapa5BqUnyaw0Am7//gUAAAB49tEXzTmtM5KkV/y2G/X4M5fPao03n/sUAAAAwIX7y5yBv9vhjW/fT/IkuSp5gJKElKRISYoUiSRIyD1tufs/IXxui20QsKIAAAAASUVORK5CYII=' alt='Install script'/><span><b>Install</b></span></center></a>" +
								 "<a id='autoUpdater_cancel' title='Cancel'><center><img src='data:image/png;base64,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' alt='Cancel'/><span><b>Cancel</b></span></center></a>" +
								 "<span id='autoUpdater_text1'>Search updates every:</span><br/>" +
								 "<span id='autoUpdater_text2'>(0 to turn off, max. 90)</span>" +
								 "<input id='autoUpdater_input' type='text' value='" + days + "'/><span id='autoUpdater_text3'>day/s.</span>";
				
				document.getElementsByTagName("body")[0].appendChild(capa);
				
				var ok = true;
				
				function install1 (){
					var days = parseInt (document.getElementById ("autoUpdater_input").value);
					var ms = new Date ().getTime ();
					
					if (ok){
						if (days == 0){
							GM_setValue ("update", "#0");
							
							menuCommand ();
							showMessage ();
						}else{
							GM_setValue ("update", (days*24*60*60*1000 + ms).toString () + "#" + days);
						}
						
						window.open ("http://userscripts.org/scripts/source/" + id + ".user.js", "_self");
						eliminaElem (document.getElementById ("autoUpdater_divVersion"));
					}
				}
				
				function install2 (install){
					install.style.background = "#E6EFC2";
					install.style.borderColor = "#C6D880";
					install.style.color = "#529214";
				}
				
				function install3 (install){
					install.style.background = "#F5F5F5";
					install.style.borderColor = "#DEDEDE";
					install.style.color = "#565656";
				}
				
				function install4 (install){
					install.style.background = "#529214";
					install.style.borderColor = "#529214";
					install.style.color = "#FFF";
				}
				
				function cancel1 (){
					if (document.getElementById ("autoUpdater_input").value == "0"){
						GM_setValue ("update", "#0");
						
						menuCommand ();
						showMessage ();
					}
					
					GM_setValue ("update", "0#" + GM_getValue ("update").split ("#")[1]);
					eliminaElem (document.getElementById ("autoUpdater_divVersion"));
				}
				
				function cancel2 (cancel){
					cancel.style.background = "#FBE3E4";
					cancel.style.borderColor = "#FFD3D5";
					cancel.style.color = "#D12F19";
				}
				
				function cancel3 (cancel){
					cancel.style.background = "#F5F5F5";
					cancel.style.borderColor = "#DEDEDE";
					cancel.style.color = "#565656";
				}
				
				function cancel4 (cancel){
					cancel.style.background = "#D12F19";
					cancel.style.borderColor = "#D12F19";
					cancel.style.color = "#FFF";
				}
				
				function input (text){
					if (text.value == "" || isNaN (text.value) || parseInt (text.value) < 0 || parseInt (text.value) > 90){
						text.style.border = "solid thin #FFB9BB";
						text.style.backgroundColor = "#FBE3E4";
						ok = false;
					}else{
						text.style.border = "solid thin #232323";
						text.style.backgroundColor = "#FFF";
						ok = true;
					}
				}
				
				//install
				var listener = document.getElementById ("autoUpdater_install");
				listener.addEventListener ("click", install1, false);
				listener.addEventListener ("mouseover", function (){ install2 (this); }, false);
				listener.addEventListener ("mouseout", function (){ install3 (this); }, false);
				listener.addEventListener ("mousedown", function (){ install4 (this); }, false);
				listener.addEventListener ("mouseup", function (){ install2 (this); }, false);
				
				//cancel
				listener = document.getElementById ("autoUpdater_cancel");
				listener.addEventListener ("click", cancel1, false);
				listener.addEventListener ("mouseover", function (){ cancel2 (this); }, false);
				listener.addEventListener ("mouseout", function (){ cancel3 (this); }, false);
				listener.addEventListener ("mousedown", function (){ cancel4 (this); }, false);
				listener.addEventListener ("mouseup", function (){ cancel2 (this); }, false);
				
				//input
				listener = document.getElementById ("autoUpdater_input");
				listener.addEventListener ("keyup", function (){ input (this); }, false);
			}
		}
	});
}

