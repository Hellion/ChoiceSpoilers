// Tard's KoL Scripts
// Copyright (c) 2006, Byung Kim
// New releases Copyright (c) 2009, 2010 by Hellion
// Released under the GPL license
// http://www.gnu.org/copyleft/gpl.html
//
// ==UserScript==
// @name           Tard's Kol Scripts - Choice Adventure Rewards
// @namespace      http://kol.dashida.com
// @author		   Tard
// @author         Hellion
// @author         Aelsa
// @require http://userscripts.org/scripts/source/57756.user.js
// @include        *kingdomofloathing.com/choice.php
// @include        *kingdomofloathing.com/basement.php
// @include	       *kingdomofloathing.com/friars.php*
// @include	       *kingdomofloathing.com/bigisland.php*
// @include	       *kingdomofloathing.com/postwarisland.php*
// @include        *kingdomofloathing.com/palinshelves.php
// @include        *kingdomofloathing.com/clan_viplounge.php*
// @include		   *kingdomofloathing.com/clan_rumpus.php*
// @include			*kingdomofloathing.com/game.php
// @include        *127.0.0.1:*/clan_viplounge.php*
// @include		   *127.0.0.1:*/clan_rumpus.php*
// @include        *127.0.0.1:*/main_c.html
// @include        *127.0.0.1:*/main.html
// @include        *127.0.0.1:*/choice.php
// @include        *127.0.0.1:*/basement.php
// @include	       *127.0.0.1:*/friars.php*
// @include	       *127.0.0.1:*/bigisland.php*
// @include	       *127.0.0.1:*/postwarisland.php*
// @include        *127.0.0.1:*/palinshelves.php
// @include			*127.0.0.1:*/game.php
// @include        *localhost:*/clan_viplounge.php*
// @include		   *localhost:*/clan_rumpus.php*
// @include        *localhost:*/main_c.html
// @include        *localhost:*/main.html
// @include        *localhost:*/choice.php
// @include        *localhost:*/basement.php
// @include	       *localhost:*/friars.php*
// @include	       *localhost:*/bigisland.php*
// @include	       *localhost:*/postwarisland.php*
// @include        *localhost:*/palinshelves.php
// @include			*localhost:*/game.php
// @description    Version 3.02
// @history			3.02 added all antique maps through August 2010, and new Spooky Forest choice.
// ==/UserScript==

// version history:
// 3.0 major rewrite of detection logic.
// 3.01 add:
//		Billiard room SR
//		new "Enormous > sign" choice
//		reflection of a map choices
//		add 3rd choice to "O Cap'm, My Cap'm" in the FCle when nemesis quest secret volcano island lair map is available
// 3.02 add:
// 		Dr. Jacking's map
//		Kegger in the Woods map
//		Neckback crick map
//		new spooky forest choice

if (window.location.pathname == "game.php") {	// just logged in, do certain stuff exactly once.
	ScriptUpdater.check(68727,"3.0");
}
if (window.name == "mainpane") {
//	var place = location.pathname.replace(/\/|\.(php|html)$/gi, "").toLowerCase();

	if (window.location.pathname == "/choice.php") {	// for regular choices, we use the standardized whichchoice value.
		// format, if it wasn't already painfully obvious:
		// whichchoiceID:["adventure name","choice 1 hints","choice 2 hints","choice 3 hints","choice 4 hints"]
		// n.b. the "adventure name" value is optional for these choices.
		var advOptions = {
		// The Dungeons of Doom
		3:["The Oracle Will See You Now","nothing","nothing","enable reading of plus sign"],
		25:["Ouch! You bump into a door","magic lamp","Monster: mimic","nothing (no adv loss)"],

		// South of the Border
		4:["Finger-Lickin'... Death.","+500 meat or -500 meat","-500 meat; chance of poultrygeist","nothing"],

		// Spooky Gravy Barrow
		5:["Heart of Very, Very Dark Darkness","without inexplicably glowing rock: proceed to choice of (lose all HP/nothing)\n with rock: proceed to choice of (Continue to Felonia/nothing)","nothing",""],
		6:["Darker Than Dark","-all HP","nothing",""],
		7:["How Depressing","with spooky glove equipped: proceed to Continue to Felonia\n without glove equipped: nothing","nothing",""],
		8:["On the Verge of a Dirge","proceed to Queen Felonia","proceed to Queen Felonia","proceed to Queen Felonia"],

		// Castle (Wheel)
		9:["cwheel1","Pay the Bills (Mysticality Bonus)","Feed the Cat (Moxie Bonus)","Take out the Garbage (Muscle Bonus)"],
		10:["cwheel2","Guard the Back Door","Take out the Garbage (Muscle Bonus)","Pay the Bills (Mysticality Bonus)"],
		11:["cwheel3","Feed the Cat (Moxie Bonus)","Pay the Bills (Mysticality Bonus)","Guard the Back Door"],
		12:["cwheel4","Take out the Garbage (Muscle Bonus)","Guard the Back Door","Feed the Cat (Moxie Bonus)"],

		// Knob Harem
		14:["A Bard Day's Night","Knob Goblin harem veil","Knob Goblin harem pants","+90-110 meat"],
		
		// The eXtreme Slope
		15:["Yeti Nother Hippy","eXtreme mittens","eXtreme scarf","+200 meat"],
		16:["Saint Beernard","snowboarder pants","eXtreme scarf","+200 meat"],
		17:["Generic Teen Comedy Snowboarding Adventure","eXtreme mittens","snowboarder pants","+200 meat"],
		
		// Itznotyerzitz Mine
		18:["A Flat Miner","miner's pants","7-Foot Dwarven mattock","+100 meat"],
		19:["100% Legal","miner's helmet","miner's pants","+100 meat"],
		20:["See You Next Fall","miner's helmet","7-Foot Dwarven mattock","+100 meat"],

		// Pirate's Cove
		22:["The Arrrbitrator","eyepatch","swashbuckling pants","+100 meat"],
		23:["Barrie Me at Sea","stuffed shoulder parrot, -5 meat","swashbuckling pants","+100 meat"],
		24:["Amatearrr Night","stuffed shoulder parrot, -3 HP","+100 meat","eyepatch"],

		// Spooky Forest
		26:["A Three-Tined Fork","Proceed to choice of SC/TT starter items","Proceed to choice of PM/S starter items","Proceed to choice of DB/AT starter items"],
		27:["Footprints","seal-skull helmet, seal-clubbing club","helmet turtle, turtle totem"],
		28:["A Pair of Craters","pasta spoon, ravioli hat","saucepan, spices"],
		29:["The Road Less Visible","disco ball, disco mask","mariachi pants, stolen accordion"],
		45:["Maps and Legends","Spooky Temple map","nothing (no adv loss)","nothing (no adv loss)"],
		46:["An Interesting Choice","+5-10 Mox","+5-10 Mus","Monster: spooky vampire"],
		47:["Have a Heart","bottle(s) of used blood","nothing (no adv loss)"],
		502:["Arboreal Respite","\nProceed to choice of meat/vampire hearts/barskin&Sapling","\nProceed to choice of (spooky mushrooms or larva)/(Meat & coin)/(mox/mus/vampire)","\nProceed to choice of \n(choice of class starter items)/Spooky-Gro Fertilizer/Spooky Temple Map"],
		503:["The Road Less Traveled","Gain (some) Meat","Talk to Vampire Hunter:\nreceive wooden stakes (1st time only)\nOR Trade in hearts/nothing","talk to Hunter\n(Sell bar skins/buy sapling)"],
		504:["Tree's Last Stand","\nSell 1 skin","\nSell all skins","\nacquire Spooky Sapling","nothing"],
		505:["Consciousness of a Stream","\nMosquito larva (first time after quest) OR 3 spooky mushrooms","\n300 meat and tree-holed coin (first time) OR nothing","Proceed to choice of Mox/Mus/Fight a Vampire"],
		506:["Through Thicket and Thinnet","\nProceed to choice of class starting items","\nAcquire spooky-gro fertilizer","\nProceed to choice of Spooky Temple Map/nothing/nothing"],
		507:["O Olith, Mon","acquire Spooky Temple Map","nothing (no turn loss)","nothing (no turn loss)"],
		
		//48-71 are the Violet Fog; can't really label those.
		
		// Cola Battlefield
		40:["The Effervescent Fray","Cloaca-Cola fatigues","Dyspepsi-Cola shield","+15 Mys"],
		41:["Smells Like Team Spirit","Dyspepsi-Cola fatigues","Cloaca-Cola helmet","+15 Mus"],
		42:["What is it Good For?","Dyspepsi-Cola helmet","Cloaca-Cola shield","+15 Mox"],

		// Whitey's Grove
		73:["Don't Fence Me In","+20-30 Mus","white picket fence","piece of wedding cake (always)\n also white rice (first 3 or 5 times/day)"],
		74:["The Only Thing About Him is the Way That He Walks","+20-30 Mox","3 boxes of wine","mullet wig"],
		75:["Rapido!","+20-30 Mys","3 jars of white lightning","white collar"],

		// Knob Shaft
		76:["Junction in the Trunction","3 chunks of cardboard ore","3 chunks of styrofoam ore","3 chunks of bubblewrap ore"],

		// Haunted Billiards Room
		77:["Minnesota Incorporeals","+(mainstat) Mox (max 50)","Proceed to choice of (Mys/key/nothing)/Mus/nothing","Leave (no adventure loss)"],
		78:["Broken","Proceed to choice of +Mys, Spookyraven library key, or nothing","+(mainstat) Mus (max 50)","Leave (no adventure loss)"],
		79:["A Hustle Here, a Hustle There","\n with Chalky Hand effect: Acquire Spookyraven library key (one time drop)\nwithout Chalky Hand effect: No Reward (lose an adventure)","+(mainstat) Mys (max 50)","Leave (no adventure loss)"],
		330:["A Shark's Chum","\n+10 Mus, +10 Mys, +10 Mox, improve VIP Pool table skill","Monster: hustled spectre"],

		// The Haunted Bedroom
		82:["nightstand","old leather wallet","+(mainstat) Mus (max 200)","Monster: animated nightstand"],
		83:["darkstand","old coin purse","Monster: animated nightstand","\ntattered wolf standard (SC)\ntattered snake standard (TT)\nEnglish to A. F. U. E. Dictionary (PM or S)\nbizarre illegible sheet music (DB or AT)\n All can only be found with Lord Spookyraven's spectacles equipped\n(all are one time drops)"],
		84:["carvestand","400-600 meat","+(mainstat) Mys (max 200)","Lord Spookyraven's spectacles (one time drop)"],
		85:["woodstand","+(mainstat) Mox (max 200)","Spookyraven ballroom key \n(only after choosing top drawer; one time drop)","Monster: remains of a jilted mistress"],

		// The Haunted Gallery
		89:["Out in the Garden","\nwithout tattered wolf standard: Monster: Knight (wolf)\nwith tattered wolf standard and SC class: Gain Snarl of the Timberwolf skill (one time)","without tattered snake standard: Monster: Knight (snake)\nwith tattered snake standard and TT class: gain Spectral Snapper skill (one time)","without Dreams and Lights effect: Effect: Dreams and Lights;\nwith Dreams and Lights effect: lose 24-30 HP"],

		// The Haunted Library (Take A Look, It's In A Book")
		80:["Rise of the House","\nproceed to choice of nothing/nothing/nothing","\nLearn a random cooking recipe","\nProceed to choice of Mox/Mys/Skill for Myst classes","nothing (no adv loss)"],
		81:["Fall of the House","\nproceed to choice of unlock gallery-key adventure/nothing/nothing","\nLearn a random cocktailcrafting recipe","\n+(mainstat) Mus (max 75) and lose 10-15 HP (Spooky)","nothing (no adv loss)"],
		86:["Read Chapter 1: The Arrival","nothing","nothing","nothing"],
		87:["Chapter 2: Stephen and Elizabeth","nothing","\nunlock Gallery Key adventure in Conservatory","nothing"],
		88:["Naughty, Naughty...","\n+(mainstat) Mys (max 75)","\n+(mainstat) Mox (max 75)","\nwithout English to A. F. U. E. Dictionary: -10-15 HP (Spooky), \nwith Dictionary and P/SR class: gain new Skill (one time)"],
		163:["Melvil Dewey Would Be Ashamed","\nNecrotelicomnicon (spooky cookbook)","\nCookbook of the Damned (stinky cookbook)","\nSinful Desires (sleazy cookbook)","nothing (no adventure loss)"],

		// The Haunted Ballroom
		90:["Curtains","\nwith bizarre illegible sheet music as DB: unlock Tango of Terror\nwith sheet music as AT: unlock Dirge of Dreadfulness\notherwise: Monster: Ghastly Organist","+(mainstat) Mox (max 150)","nothing (no adventure loss)"],
		//91-105 are the Louvre... can't really label those.
		106:["Strung-Up Quartet","+5 ML","+5% Noncombat","+5% item drops","turn song off"],

		// The Haunted Bathroom
		105:["Having a Medicine Ball","with antique hand mirror, +(mainstat*1.2) Mys (max 300)\notherwise +(mainstat) Mys (max 200)","Proceed to choice of Mus/Mys/Mox spleen items","(every five times until defeat) Monster: Guy Made of Bees"],
		107:["Bad Medicine is What You Need","antique bottle of cough syrup (Mys spleen item)","tube of hair oil (Mox spleen item)","bottle of ultravitamins (Mus spleen item)","nothing (no adventure loss)"],
		402:["Don't Hold a Grudge","+(2x mainstat?) Mus (max 125)","+(2-2.5x mainstat) myst (max 250)","+(2x mainstat?) Mox (max 125)"],

		// Sleazy Back Alley
		21:["Under the Knife","Change gender of character","nothing",""],
		108:["Aww, Craps","+4-5 Mox","randomly +31-40 meat and +6-8 Mox or -2 HP","randomly +41-49 meat. +6-8 Mox and Effect: Smugness or -ALL HP","nothing (no adv loss)"],
		109:["Dumpster Diving","Monster: drunken half-orc hobo","+4-5 Mox and +3-4 meat","Mad Train wine"],
		110:["The Entertainer","+4-5 Mox","+2-4 Mox and +2-4 Mus","+15 meat and sometimes +6-8 Mys","nothing (no adv loss)"],
		112:["Please, Hammer","Harold's hammer head and Harold's hammer handle (start miniquest)","nothing (no adv loss)","+5-6 Mus"],
		
		// Outskirts of Cobb's Knob
		111:["Malice in Chains","+4-5 Mus","randomly +6-8 Mus or -1-? HP","Monster: sleeping Knob Goblin Guard"],
		113:["Knob Goblin BBQ","\nwithout unlit birthday cake: -2 HP\nwith unlit birthday cake: light cake and -2 HP", "Monster: Knob Goblin Barbecue Team", "randomly one of: bowl of cottage cheese,\nKnob Goblin pants, Knob Goblin tongs, or Kiss the Knob apron", ""],
		118:["When Rocks Attack", "+30 meat", "nothing (no adv loss)", "", ""],
		120:["Ennui is Wasted on the Young", "randomly +4-5 Mus and -2 HP \nor +7-8 Mus and Effect: Pumped Up", "\nice-cold Sir Schlitz", "\n+2-3 Mox and a lemon", "\nnothing (no adv loss)"],
		
		// The Haunted Pantry
		114:["The Baker's Dilemma", "unlit birthday cake (start miniquest)", "nothing (no adv loss)", "+4-5 Mox and +16-19 meat"],
		115:["Oh No, Hobo","Monster: drunken half-orc hobo","\nwithout at least 6 meat: nothing\nwith at least 6 meat, -5 meat and Effect: Good Karma","+3-4 Mys, +3-4 Mox, and +5-10 meat",""],
		116:["The Singing Tree", "\nwith at least 1 meat: +4-5 Mys and -1 meat\nwith no meat: nothing", "\nwith at least 1 meat: +4-5 Mox and -1 meat\nwith 0 meat: nothing", "with at least 1 meat, -1 meat and randomly one of:\nwhiskey and soda or +4-5 Mys and -2 HP or +7-8 Mys\nwith no meat: nothing", "nothing (no adv loss)"],
		117:["Trespasser", "Monster: Knob Goblin Assistant Chef", "+6-8 Mys or +4 Mys and -2 HP", "Get 1-4 of:\nasparagus knife, chef's hat,\nmagicalness-in-a-can, razor-sharp can lid,\nor stalk of asparagus"],

		// The Hidden Temple
		123:["At Least It's Not Full Of Trash","lose all HP","unlock Dvorak's Revenge adventure","lose all HP"],
		125:["No Visible Means of Support","lose all HP","lose all HP","unlock the Hidden City"],

		// The Palindome
		2:["Denim Axes Examined","with rubber axe: trade for denim axe \nwithout: nothing","nothing",""],
		126:["Sun at Noon, Tan Us","+(mainstat) Mox (max 250)","+(1.5*mainstat) Mox (max 350) OR Effect: Sunburned","Effect: Sunburned"],
		127:["No sir, away!","3 papayas","\nwith at least 3 papayas: +(mainstat) all stats (max 300), lose 3 papayas \nwithout: lose 60-68 HP","+(mainstat) all stats (max 100)"],
		129:["Do Geese See God?","get photograph of God","nothing (no adv loss?)"],
		130:["Rod Nevada, Vendor","get hard rock candy","nothing (no adv loss?)"],
		131:["Dr. Awkward","Monster: Dr. Awkward","Monster: Dr. Awkward","Monster: Dr. Awkward"],
		180:["A Pre-War Dresser Drawer, Pa!","with Torso Awaregness: Ye Olde Navy Fleece \nwithout: +200-300 meat","nothing (no adv loss)"],

		// The Arid, Extra-Dry Desert
		132:["Let's Make a Deal!","broken carburetor","unlock An Oasis"],
		
		// Pyramid
		134:["Wheel in the Pyramid,","move lower chamber","nothing (no adv loss)"],
		135:["Wheel in the Pyramid,","move lower chamber","nothing (no adv loss)"],

		// The Hippy Camp
		136:["Peace Wants Love","filthy corduroys","filthy knitted dread sack","+210-300 meat"],
		137:["An Inconvenient Truth","filthy knitted dread sack","filthy corduroys","+207-296 meat"],
		139:["Bait and Switch","+50 Mus","2-5 handfuls of ferret bait","Monster: War Hippy (space) cadet"],
		140:["The Thin Tie-Dyed Line","2-5 water pipe bombs","+50 Mox","Monster: War Hippy drill sergeant"],
		141:["Blockin' Out the Scenery","+50 Myst"," 2 of: \ncruelty-free wine, handful of walnuts, Genalen Bottle, mixed wildflower greens, thistle wine","nothing (put on your Frat Warrior outfit, doofus!)"],
		142:["Blockin' Out the Scenery","+50 Myst"," 2 of: \ncruelty-free wine, handful of walnuts, Genalen Bottle, mixed wildflower greens, thistle wine","start the war"],

		// The Orcish Frat House
		72:["Lording Over The Flies","trade flies for around the worlds","nothing",""],
		138:["Purple Hazers","Orcish cargo shorts","Orcish baseball cap","homoerotic frat-paddle"],
		143:["Catching Some Zetas","+50 Mus","6-7 sake bombers","Monster: War Pledge"],
		144:["One Less Room Than In That Movie","+50 Mus","2-5 beer bombs","Monster: Frat Warrior drill sergeant"],
		145:["Fratacombs","+50 Mus","2 of: brain-meltingly-hot chicken wings, frat brats, \nknob ka-bobs, can of Swiller, melted Jell-o shot","nothing (put on your War Hippy Outfit, doofus!)"],
		146:["Fratacombs","+50 Mus","2 of: brain-meltingly-hot chicken wings, frat brats, \nknob ka-bobs, can of Swiller, melted Jell-o shot","start the war"],
		181:["Chieftain of the Flies","trade flies for around the worlds","nothing"],

		// The Barn
		147:["Cornered!","send ducks to the Granary","send ducks to the Bog","send ducks to the Pond \n(step 1 of the shortcut--USE CHAOS BUTTERFLY IN COMBAT)"],
		148:["Cornered Again!","send ducks to the Back 40 \n(step 2 of the shortcut--USE CHAOS BUTTERFLY IN COMBAT)","send ducks to the Family Plot"],
		149:["How Many Corners Does this Stupid Barn Have!?","send ducks to the Shady Thicket","send ducks to the Other Back 40 \nIf you've used a chaos butterfly in combat and done steps 1 and 2: \nhalve number of ducks in each area "],

		//The Fun House
		151:["Adventurer, $1.99","\nwith at least 4 Clownosity: continue towards Beelzebozo \notherwise: take damage","nothing (no adventure loss)"],
		152:["Lurking at the Threshold","Monster: Beelzebozo","nothing"],

		// The Defiled Alcove
		153:["Turn Your Head and Coffin","+40-60 Mus","+200-300 meat","half-rotten brain","nothing (no adv loss)"],
		154:["Doublewide","Monster: conjoined zmombie","nothing"],

		// The Defiled Nook
		155:["Skull, Skull, Skull","+40-60 Mox","+200-300 meat","rusty bonesaw","nothing (no adv loss)"],
		156:["Pileup","Monster: giant skeelton","nothing"],

		// The Defiled Niche
		157:["Urning Your Keep","+40-70 Mys","plus-sized phylactery (first time only)","+200-300 meat","nothing (no adv loss)"],
		158:["Lich in the Niche","Monster: gargantulihc","nothing"],

		// The Defiled Cranny
		159:["Go Slow Past the Drawers","+200-300 meat","+40-50 HP/MP, +20-30 Mus, Mys and Mox","can of Ghuol-B-Gone","nothing (no adv loss)"],
		160:["Lunchtime","Monster: huge ghuol","nothing"],

		// The Deep Fat Friars' Gate
		161:["Bureaucracy of the Damned","\nwith Azazel's 3 items, gain Steel reward \nwithout: nothing","\nwith Azazel's three items, gain Steel reward \nwithout: nothing","\nwith Azazel's three items, gain Steel reward \nwithout: nothing","\nnothing (no adv loss)"],

		// The Goatlet
		162:["Between a Rock and Some Other Rocks","in Mining gear: allow access to the Goatlet \notherwise, nothing","nothing (no adv loss)"],

		// The Stately Pleasure Dome
		164:["Down by the Riverside",
			 "\n+(mainstat) Mus (max 150)",
			 "\n+80-100 MP and Effect: Spirit of Alph\n(step 1 of not-a-pipe (go to Mansion) or fancy ball mask (go to Windmill))",
			 "\nMonster: Roller-skating Muse"],
		165:["Beyond Any Measure",
			 "\nwith Rat-Faced, Effect: Night Vision (step 2 of flask of amontillado (go to Mansion))\nwithout, nothing",
			 "\nwith Bats in the Belfry, Effect: Good with the Ladies (step 2 of Can-Can skirt (go to Windmill))\nwithout, nothing",
			 "\n+(mainstat) Myst (max 150)","nothing (no adventure loss)"],
		166:["Death is a Boat",
			 "\nwith No Vertigo: S.T.L.T \nwithout: nothing",
			 "\n+(mainstat) Mox (max 150)",
			 "\nwith Unusual Fashion Sense: albatross necklace \nwithout: nothing"],
		
		// The Mouldering Mansion
		167:["It's a Fixer-Upper",
			 "\nMonster: raven",
			 "\n+(mainstat) Myst (max 150)",
			 "\n+40-49 HP and MP, Effect: Bats in the Belfry\n(step 1 of S.T.L.T. (go to Windmill) or Can-Can skirt (go to Dome))"],
		168:["Midst the Pallor of the Parlor",
			 "\n+(mainstat) Mox (max 150)",
			 "\nwith Spirit of Alph, Effect: Feelin' Philosophical (step 2 of not-a-pipe (go to Windmill)\nwithout, Monster: Black Cat",
			 "\nwith Rat-Faced, Effect: Unusual Fashion Sense (step 2 of albatross necklace (go to Dome))\nwithout, nothing"],
		169:["A Few Chintz Curtains, Some Throw Pillows...",
			 "\nwith Night Vision: flask of Amontillado \nwithout: nothing",
			 "\n+(mainstat) Mus (max 150)",
			 "\nwith Dancing Prowess: fancy ball mask \nwithout: nothing"],

		// The Rogue Windmill
		170:["La Vie Boheme",
			 "\n+80-100 HP and Effect: Rat-Faced\n(step 1 of flask of Amontillado (go to Dome) or albatross necklace (go to Mansion))",
			 "\nMonster: Sensitive poet-type",
			 "\n+(mainstat) Mox (max 150)"],
		171:["Backstage at the Rogue Windmill",
			 "\nwith Bats in the Belfry, Effect: No Vertigo (step 2 of S.T.L.T (go to Dome))\nwithout, nothing",
			 "\n+(mainstat) Mus (max 150)",
			 "\nwith Spirit of Alph, Effect: Dancing Prowess (Step 2 of fancy ball mask (go to Mansion))\nwithout, nothing"],
		172:["Up in the Hippo Room",
			 "\nwith Good with the Ladies, acquire Can-Can skirt \nwithout, Monster: Can-can dancer",
			 "\nwith Feelin' Philosophical, acquire not-a-pipe \nwithout, nothing",
			 "\n+(mainstat) Myst (max 150)"],

		//The Penultimate Fantasy Airship
		178:["Hammering the Armory","get bronze breastplate","nothing (no adv loss)"],
		182:["Random Lack of an Encounter","with +20 ML or more: Monster: MagiMechTech MechaMech\notherwise: Monster: (a random airship monster that is not the Mech)","Penultimate Fantasy chest","+18-39 to all stats, lose 40-50 HP"],

		// Barrrney's Bar
		184:["That Explains All The Eyepatches","\nMyst class: +(1-2x Myst) offstats (max 300), +(2-3x Myst) Myst (max 400), gain 3 drunkenness \notherwise: Monster: tipsy pirate","\nMoxie class: +(1-2x Mox) offstats (max 300), +(2-3x Mox) Mox (max 400), gain 3 drunkenness \notherwise, acquire shot of rotgut","\nMuscle class: +(1-2x Mus) offstats (max 300), +(2-3x Mus) Mus (max 400), gain 3 drunkenness \notherwise, acquire shot of rotgut"],
		185:["Yes, You're a Rock Starrr","\n2-5 bottles of gin, rum, vodka, and/or whiskey","\n2-3 of grog, monkey wrench, redrum, rum and cola, spiced rum, strawberry daiquiri","\n+50-100 to each stat (scales with drunkenness) OR Monster: tetchy pirate (if at exactly 1 drunkenness)"],
		186:["A Test of Testarrrsterone","\nMyst class: +(some) all stats (max 100)\notherwise: +(some) Mus and Mox (max 100)","+(some) all stats (max 300), gain 3 drunkenness","+(2x mainstat) Mox (max 150)"],
		187:["Arrr You Man Enough?","Play Insult Beer Pong","nothing (no adv loss)"],
		188:["The Infiltrationist","\nin frat outfit: Cap'm Caronch's dentures \notherwise -95-105 HP","\nin mullet wig and with briefcase: Cap'm Caronch's dentures \notherwise -95-105 HP","\nin frilly skirt and with 3 hot wings: Cap'm Caronch's dentures \notherwise -90-100 HP"],
		
		// The F'c'le
		189:["O Cap'm, My Cap'm","gain stats or items from the Sea","nothing (no adv loss)","open Nemesis Lair area"],
		191:["Chatterboxing","+~110 Mox","\nwith valuable trinket:\nbanish Chatty Pirate for 20 adventures (no adv loss)\nwithout: lose ~14 HP ","+~110 Mus","+~110 Myst, lose ~15 HP"],
		
		// Sewers
		197:["Somewhat Higher and Mostly Dry","gain sewer exploration points","fight a sewer monster","increase sewer noncombat rate"],
		198:["Disgustin' Junction","gain sewer exploration points","fight a sewer monster","improve sewer exploration point gain"],
		199:["The Former or the Ladder","gain sewer exploration points","fight a sewer monster","with someone in cage: free them \nwith nobody in cage: waste a turn"],
		
		// Hobopolis
		200:["Enter The Hoboverlord","Monster: Hodgman","nothing (no adv loss)"],
		201:["Home in the Range","Monster: Ol' Scratch","nothing (no adv loss)"],
		202:["Bumpity Bump Bump","Monster: Frosty","nothing (no adv loss)"],
		203:["","Monster: Oscus","nothing (no adv loss)"],
		204:["","Monster: Zombo","nothing (no adv loss)"],
		205:["","Monster: Chester","nothing (no adv loss)"],
		206:["Getting Tired","cause Tirevalanche (multikills hot hobos)","increase size of impending Tirevalanche","nothing (no adv loss)"],
		207:["Hot Dog!","9000-11000 meat to your clan coffers OR a lot of hot damage","nothing (no adv loss)"],
		208:["Ah, So That's Where They've All Gone","decrease stench level of the Heap","nothing (no adv loss)"],
		213:["Piping Hot","decrease heat level of Burnbarrel Blvd","nothing (no adv loss)"],
		214:["You vs. The Volcano","increase stench level of the Heap","nothing (no adv loss)"],
		215:["Piping Cold","decrease heat level of Burnbarrel Blvd","reduce crowd size in PLD\n(makes it easier to get into the club)","increase cold level in Exposure Esplanade"],
		216:["The Compostal Service","decrease spook level of the Burial Ground","nothing (no adv loss)"],
		217:["There Goes Fritz!","multikill frozen hobos (repeatable)","multikill frozen hobos (repeatable)","multikill as many frozen hobos as possible (1 time only)"],
		218:["I Refuse!","acquire 3 random items and set stench level to 0","set stench level to 0 (no adv loss?)"],
		219:["The Furtivity of My City","monster: sleaze hobo","increase stench level of the Heap","4000-6000 meat to your clan coffers"],
		220:["Returning to the Tomb","9000-11000 meat to your clan coffers","nothing (no adv loss)"],
		221:["A Chiller Night","learn some dance moves","waste a turn","nothing (no adv loss)"],
		222:["A Chiller Night","multikill zombie hobos","nothing (no adv loss)"],
		223:["Getting Clubbed","if crowd level is low enough, Proceed to Exclusive! (fight, multikill, or stats) \notherwise: nothing","lower the crowd level","enable dancing in the Burial Ground"],
		224:["Exclusive!","Monster: Sleaze Hobo","multikill 10% of remaining sleazy hobos","+(3x mainstat) all stats (max 1000)"],
		225:["Attention -- A Tent!","with instrument and no other same-class player already there, get on stage to perform\n otherwise, nothing (no adv loss)","Proceed to Working the Crowd (view performance, multikill, or collect nickels)","nothing (no adv loss)"],
		226:["Here You Are, Up On Stage","gauge the size of the crowd and assist with the multikill","screw up the run"],
		227:["Working the Crowd","gauge the size of the crowd","multikill normal hobos","farm nickels","nothing (no adv loss)"],
		231:["The Hobo Marketplace","Proceed to choice of (food/booze/a mugging)","Proceed to choice of ((hats/pants/accessories), (combat items/muggers/entertainment), or (valuable trinkets))","Proceed to choice of buffs/tattoo/muggers/MP restore"],
		233:["Food Went A-Courtin'","Proceed to choice of Mus/Mys/Mox foods","Proceed to choice of Mus/Mys/Mox boozes","Monster: gang of hobo muggers"],
		235:["Food, Glorious Food","Proceed to buy Muscle food","Proceed to buy Mysticality food","Proceed to buy Moxie food"],
		240:["Booze, Glorious Booze","Proceed to buy Muscle booze","Proceed to buy Mysticality booze","Proceed to buy Moxie food"],
		245:["Math Is Hard","Proceed to choice of (hats/pants/accessories)","Proceed to choice of (combat items/muggers/entertainment)","Proceed to choice of (valuable trinkets/nothing)"],
		248:["Garment District","Proceed to choice of (fedora/tophat/wide-brimmed hat)","Proceed to choice of (leggings/dungarees/suit-pants)","Proceed to choice of (shoes/stogie/soap)"],
		253:["Housewares","Proceed to choice of (hubcap/caltrop/6-pack of pain)","Monster: gang of hobo muggers","Proceed to choice of (music/pets/muggers)"],
		256:["Entertainment","Proceed to buy instrument","Proceed to try for a hobo monkey","Monster: gang of hobo muggers"],
		259:["We'll Make Great...","hobo monkey OR +200 to each stat OR Monster: muggers","hobo monkey OR +200 to each stat OR Monster: muggers","hobo monkey OR +200 to each stat OR Monster: muggers"],
		262:["Salud","+50% spell damage, +50 spell damage, lose 30-50MP per combat (20 turns)","Proceed to choice of (tanning/paling)","Proceed to choice of (buffs/other buffs/tattoos etc.)"],
		264:["Tanning Salon","+50% Moxie (20 turns)","+50% Mysticality (20 turns)"],
		265:["Another Part of the Market","Proceed to choice of (spooky resistance/sleaze resistance)","Proceed to choice of (stench resistance/+50% Muscle)","Proceed to choice of (tattoo/muggers/MP restore)"],
		267:["Let's All Go To The Movies","Superhuman Spooky Resistance (20 adv)","Superhuman Sleaze Resistance (20 adv)","nothing"],
		268:["It's fun to stay there","Superhuman Stench resistance (20 adv)","+50% Muscle (20 adv)","nothing"],
		269:["Body Modifications","Proceed to choice of (tattoo/nothing)","Monster: gang of hobo muggers","refill all MP and Buff: -100% Moxie, gain MP during combat (20 adv)"],
		273:["The Frigid Air","frozen banquet","8000-12000 meat to your clan coffers","nothing (no adv loss)"],
		276:["The Gong Has Been Bung","spend 3 turns at Roachform","spend 12 turns at Mt. Molehill","Form of...Bird! (15 adv)"],

		// Roachform
		278:["Enter the Roach","+(mainstat) Mus (max 200)\n leads to choice of Mox/Mus/MP, then to Mus/allstat/itemdrop/ML buffs", "+(mainstat) myst (max 200)\n leads to choice of Mys/Mus/MP, then to Myst/allstat/itemdrop/ML buffs","+(mainstat) Mox (max 200)\n leads to choice of Mox/Mys/MP, then to Mox/allstat/itemdrop/ML buffs"],
		279:["It's Nukyuhlur - the 'S' is Silent.","+(mainstat) Mox (max 200)\n leads to choice of +30% Mus/+10% all stats/+30 ML","+(mainstat) Mus (max 200)\n leads to choice of +30% Mus/+10% all stats/+50% item drops","+(mainstat) MP (max 200)\n leads to choice of +30% Mus/+50% item drops/+30 ML"],
		280:["Eek!  Eek!","+(mainstat) myst (max 200)\n leads to choice of +30% Myst/+30 ML/+10% all stats","+(mainstat) Mus (max 200)\n leads to choice of +50% item drops/+10% all stats/+30% Myst","+(mainstat) MP (max 200)\n leads to choice of +30 ML/+30% Myst/+50% item drops"],
		281:["A Meta-Metamorphosis","+(mainstat) Mox (max 200)\n leads to choice of +30 ML/+30% Mox/+10% all stats","+(mainstat) myst (max 200)\n leads to choice of +30 ML/+30% Mox/+50% item drops","+(mainstat) MP (max 200)\n leads to choice of +30% Mox/+10% all stats/+50% item drops"],
		282:["You've Got Wings, But No Wingman","+30% Muscle (20 turns)","+10% all stats (20 turns)","+30 ML (20 turns)"],
		283:["Time Enough At Last!","+30% Muscle (20 turns)","+10% all stats (20 turns)","+50% item drops (20 turns)"],
		284:["Scavenger is your Middle Name","+30% Muscle (20 turns)","+50% item drops (20 turns)","+30 ML (20 turns)"],
		285:["Bugging Out","+30% myst (20 turns)","+30 ML (20 turns)","+10% all stats (20 turns)"],
		286:["A Sweeping Generalization","+50% item drops (20 turns)","+10% all stats (20 turns)","+30% myst (20 turns)"],
		287:["In the Frigid Aire","+30 ML (20 turns)","+30% myst (20 turns)","+50% item drops (20 turns)"],
		288:["Our House","+30 ML (20 turns)","+30% Moxie (20 turns)","+10% all stats (20 turns)"],	
		289:["Workin' For the Man","+30 ML (20 turns)","+30% Moxie (20 turns)","+50% item drops (20 turns)"],	
		290:["The World's Not Fair","+30% Moxie (20 turns)","+10% all stats (20 turns)","+50% item drops (20 turns)"],
		
		//Haiku Dungeon
		297:["Gravy Fairy Ring","2-3 of Knob, Knoll, and/or spooky mushroom","fairy gravy boat","nothing (no adv loss)"],
		
		//underwater
		298:["In the Shade","with soggy seed packet and glob of green slime: acquire 1 sea fruit \nwithout: nothing","nothing (no adv loss?"],
		299:["Down at the Hatch","first time: free Big Brother\nafterward: upgrade monsters in the Wreck for 20 turns","nothing (no adv loss)"],
		304:["A Vent Horizon","first 3 times: summon bubbling tempura batter","nothing (no adv loss)"],
		305:["There is Sauce at the Bottom of the Ocean","with Mer-kin pressureglobe, first 3 times: acquire globe of Deep Sauce\n without: nothing (no adv loss)","nothing (no adv loss)"],
		309:["Barback","first 3 times: acquire Seaode","nothing (no adv loss)"],
		311:["Heavily Invested in Pun Futures","Proceed to trade dull/rough fish scales","nothing (no adv loss)"],
		403:["Picking Sides","skate blade (allows fighting ice skates)","brand new key (allows fighting roller skates)"],
		
		//slimetube
		326:["Showdown","Monster: Mother Slime","nothing (no adv loss)"],
		337:["Engulfed!","\nfirst time: enable an equipment-sliming\nafterward: nothing (no adv loss)","\nfirst time (and only 5 times per tube, total): increase tube ML by 20\nafterward: nothing (no adv loss)","nothing (no adv loss)"],
		
		//agua bottle
		349:["The Primordial Directive","after using memory of some delicious amino acids: progress to fight monsters\nbefore: nothing","+10 Mox","without memory of some delicious amino acids: acquire memory of some delicious etc.\nwith: nothing"],
		350:["Soupercharged","Monster: Cyrus","nothing"],
		352:["Savior Faire","+25 Mox","+25 Mus","+25 Myst"],
		353:["Bad Reception Down Here","Indigo Party Invitation (leads to Moxie choices)","Violet Hunt Invitation (leads to stat/fam wt choices)"],
		354:["","+some Mox (max 200?)","+15% Moxie (20 turns)"],
		355:["","+some mus, myst, and mox (max ???)","+4 lb familiar weight (20 turns)"],
		356:["A Diseased Procurer","Blue Milk Club Card (leads to stats/item drop buff)","Mecha Mayhem Club Card (leads to Muscle choices)"],
		357:["Painful, Circuitous Logic","+some Mus (max 200?)","+15% Muscle (20 turns)"],
		358:["Brings All the Boys to the Blue Yard","+some Mus, Myst, Mox (max 200 each)","+20% item drops (20 turns)"],
		361:["Give it a Shot","'Smuggler Shot First' button (leads to Myst choices)","Spacefleet Communicator Badge (leads to stats/meat drop buff)"],
		362:["A Bridge Too Far","+some mus, myst, and mox (max 200?)","+35% meat drops (20 turns)"],
		363:["","+some Myst (max 200?)","+15% Myst (20 turns)"],
		364:["","+some Mox (max 200?)","Supreme Being Glossary (advance quest state)","+some Mus (max 200?)"],
		365:["None Shall Pass","-30 meat, +50 Mus","-60 meat, multi-pass (advance quest state)","nothing (no adv loss??)"],
		
		//marbles
		393:["The Collector","lose 1 of each marble, gain 32768 meat, qualify for trophy","nothing"],
		
		//Down the rabbit hole
		441:["The Mad Tea Party","\nacquire a buff based on your hat name","nothing"],
		442:["A Moment of Reflection",
			"\nas Seal Clubber: Walrus Ice Cream or yellow matter custard\nas Pastamancer: eggman noodles or yellow matter custard\notherwise: yellow matter custard",
			"\nas Sauceror: vial of jus de larmes or delicious comfit\nas Accordion Thief: missing wine or delicious comfit\notherwise: delicious comfit",
			"\nas Disco Bandit: Lobster qua Grill or monster: croqueteer\nas Turtle Tamer: beautiful soup or monster: croqueteer\notherwise: monster: croqueteer",
			"\nwith beautiful soup, lobster qua grill, missing wine, walrus ice cream, and humpty dumplings:\nacquire ittah bittah hookah\n(if you already have an ittah bittah hookah: 20 turns of a random effect)\nwithout all 5 courses: nothing",
			"\nplay a chess puzzle",
			"\nnothing"],
			//Seal Clubber
		444:["The Field of Strawberries","walrus ice cream","yellow matter custard"],
			//Pastamancer
		445:["The Field of Strawberries","eggman noodles","yellow matter custard"],
			//Accordion Thief
		446:["A Caucus Racetrack","missing wine","delicious comfit"],
			//Sauceror
		447:["A Caucus Racetrack","vial of jus de larmes","delicious comfit"],
			//Turtle Tamer
		448:["The Croquet Grounds","beautiful soup","monster: croqueteer"],
			//Disco Bandit
		449:["The Croquet Grounds","Lobster qua Grill","monster: croqueteer"],
		450:["The Duchess' Cottage",
			"\nwith beautiful soup, lobster qua grill, missing wine, walrus ice cream, and humpty dumplings: \nacquire ittah bittah hookah\n(if you already have an ittah bittah hookah: 20 turns of a random effect)\nwithout all 5 courses: nothing",
			"nothing"],
			
		//Enormous > sign
		451:["Typographical Clutter","acquire (","lose 30 meat, +10-15 Mox\nOR\ngain 500 meat, +10-15 Mox","acquire + (first time) or +10-15 Mus","+10-15 myst, +100 MP","teleportitis (5 turns)"],
			
		//Professor Jacking
		452:["Leave a message and I'll call you back","\nwith raisin in machine: kill spider\nwithout: lose (all?) HP",
													  "\nif spider alive: tiny fly glasses\nif spider dead: Flyest of Shirts (if torso-aware)/nothing",
													  "\nif fruit in machine: 3 fruit\notherwise nothing"],
		453:["Getting a leg up","fight jungle scabie","gain 30-40 mus, mys, and mox","acquire hair of the calf"],
		454:["Just Like the Ocean Under the Moon","fight smooth jazz scabie","gain 90-100 HP and 90-100 MP"],
		455:["Double Trouble in the Stubble","gain 50-60 mus, mys, and mox","\mwith can-you-dig-it:acquire legendary beat\nwithout: lose (lots of) HP"],
		456:["Made it, Ma!  Top of the world!","Fight The Whole Kingdom","effect: Hurricane Force","acquire a dance upon the palate (first time only)","gain 31-40 mus, mys, and mox"],
		
											
		//Kegger in the woods
		457:["Oh no!  Five-Oh!","\nClose area and receive reward:\n<10 numbers: Bronze Handcuffs\n10-19: cuffs, Silver Keg\n20+:cuffs, keg, bottle of GoldSchnockered","nothing (keep area open)"],
		
		//Neckback Crick
		497:["SHAFT!","Fight unearthed monstrosity","nothing"]
		};
		
		var inputs = document.getElementsByTagName('input');
		var choicenumber = 0;
		var cval = -1;
		var thisopt;
		if (inputs) {
			for (var n=0; n<inputs.length;n++)	{
				if (inputs[n].name=="whichchoice" && choicenumber == 0) {		// identify adventure!
					choicenumber = inputs[n].value;
					thisopt = advOptions[choicenumber];
				} else if (inputs[n].name=="option") {							// identify button!
					cval = inputs[n].value;
				} else if (choicenumber != 0 && inputs[n].type == "submit") {	// modify button!
					inputs[n].value += " -- " + thisopt[cval] + "";
				}
			}
		}
	} else 	if (window.location.pathname == "/basement.php") {	// for the basement, we use the image name to figure out the choice.
		var basementOptions = {
		"twojackets.gif":["twojackets","+(mainstat) Mox","+(mainstat) Mus"],
		"twopills.gif":["twopills","+(mainstat) Mus","+(mainstat) Myst"],
		"figurecard.gif":["figurecard","+(mainstat) Myst","+(mainstat) Mox"]
		};
		// pick off "filename.gif" from "http://images.kingdomofloathing.com/adventureimages/filename.gif"
		var imgfile = document.getElementsByTagName('img')[0].src.split('/')[4];
		var inputs = document.getElementsByTagName('input');
		var choicenumber = 1;
		var thisopt = basementOptions[imgfile];
		if (inputs.length && thisopt) {
			for (var n=0; n<inputs.length; n++) {
				if (inputs[n] && inputs[n].type == "submit") inputs[n].value += " -- " + thisopt[choicenumber++];
			}
		}
	} else {	// for other stuff, we brute-force a string search since the buff areas aren't standardized.
		// Buff areas
		var otherOptions = {
			// The Friars
			0:["Brother Flying Burrito, the Deep Fat Friar","+30% food drops (20 adv)"],
			1:["Brother Corsican, the Deep Fat Friar","+2 familiar experience per combat (20 adv)"],
			2:["Brother Smothers, the Deep Fat Friar","+30% booze drops (20 adv)"],
			// The Nuns
			3:["Get Healed","+1,000 HP"],
			4:["Get a Massage","+1,000 HP, +1,000 MP"],
			// The Arena
			5:["Party with the free spirits","+5 stats per combat (20 adv)","+~20% item drops (20 adv)","+5lb familiar weight (20 adv)"],
			6:["Try to get into the music","+10% all stats (20 adv)","+40% meat drops (20 adv)","+50% initiative (20 adv)"],
			// Clan VIP Pool Table
			7:["You approach the pool table.","+5 lb familiar weight/+50% weapon damage (10 adv)","+10 MP/turn, +50% spell damage (10 adv)","+10% item drops, +50% initiative (10 adv)"],
			// funky choice in the palindome--apparently the listboxes make this use its own palinshelves.php page instead of choice.php.
			8:["Drawn Onward","\nwith photo of God, hard rock candy, ketchup hound and ostrich egg on the shelves: \nmeet Dr. Awkward and get beaten up \nwithout: nothing (no adv loss)","nothing (no adv loss)"],
			// Rumpus Room: jukebox, ballpit, chips
			9:["This jukebox has a staggering","+10% meat drops (10 turns)","+3 stats per combat (10 turns)","+10% item drops (10 turns)","+20% initiative (10 turns)"],
			10:["There's a ball pit here with","+(balls/100)% to all stats (20 turns)"],
			11:["Unfortunately for you, only the three least popular flavors","an item giving +30 Mox (10 turns)","an item giving +30 Mus (10 turns)","an item giving +30 Mysticality (10 turns)"]
		};
//		GM_log("checking for buff areas");
		bodyHTML = document.getElementsByTagName('body')[0].innerHTML;
		for (var i in otherOptions) {
			if (bodyHTML.indexOf(otherOptions[i][0]) != -1) {
				var inputs = document.getElementsByTagName('input');
				n = 1;
				for (var j=0;j<inputs.length;j++) {
					if (inputs[j] && inputs[j].type == "submit") {
						inputs[j].value += " -- " + otherOptions[i][n++];
					}
				}
				break;
			}
		}
	}
}

