/*
A script that allows for messages to be interpreted as macros, so have fun with it :P!
*/

var MESSAGECAST = {};
var macroEnabled = true;
var runOption = false;
var useWhitelist = false;
var mesWhitelist = [];
var NotificationsEnabled = true;
var deleteKeyword = '${DELETETHIS="";}';
var speechRules = [];
var currentIntervals = [];

var messageCast = function() {

    var _helperList = {
        "Start": [
            {
                label: "Simple >",
                onclick: (e)=>{openDropdown(e,"Simple",1);}
            },
            {
                label: "Advanced >",
                onclick: (e)=>{openDropdown(e,"Advanced",1);}
            },
            {
                label: "Advanced2 >",
                onclick: (e)=>{openDropdown(e,"Advanced2",1);}
            },
            {
                label: "Your macros >",
                onclick: (e)=>{openDropdown(e,"Macros",1);}
            },
            {
                label: "Hide Message",
                onclick: (e)=>{addMessage("Delete");}
            }
        ],
        "Simple": [
            {
                label: "Say",
                onclick: (e)=>{addMessage("Say");}
            },
            {
                label: "Cast >",
                onclick: (e)=>{openDropdown(e,"Cast",1);}
            },
            {
                label: "Emotes >",
                onclick: (e)=>{openDropdown(e,"Emotes",1);}
            },
            {
                label: "Use >",
                onclick: (e)=>{openDropdown(e,"Use",1);}
            }, 
            {
                label: "*Emote*",
                onclick: (e)=>{addMessage("Emote");}
            },      
            {
                label: "(OOC)",
                onclick: (e)=>{addMessage("OOC");}
            }, 
            {
                label: "Wear",
                onclick: (e)=>{addMessage("Wear");}
            },
            {
                label: "Remove",
                onclick: (e)=>{addMessage("Remove");}
            }    
        ],
        "Advanced": [
            {
                label: "Change Location >",
                onclick: (e)=>{openDropdown(e,"Locations",1);}
            },
            {
                label: "Show Inventory",
                onclick: (e)=>{addMessage("ShowInventory");}
            },
            {
                label: "Send a Private Message",
                onclick: (e)=>{addMessage("SendPrivateMessage");}
            },
            {
                label: "Custom Speech >",
                onclick: (e)=>{openDropdown(e,"CustomSpeech",1);}
            },
            {
                label: "Change Character Image >",
                onclick: (e)=>{openDropdown(e,"CustomCharacter",1);}
            }
        ],
        "Advanced2": [
            {
                label: "Petrify >",
                onclick: (e)=>{openDropdown(e,"Petrify",1);}
            },
            {
                label: "Locks >",
                onclick: (e)=>{openDropdown(e,"Locks",1);}
            },
            {
                label: "Unlocks >",
                onclick: (e)=>{openDropdown(e,"Unlocks",1);}
            },
            {
                label: "Intervals >",
                onclick: (e)=>{openDropdown(e,"Intervals",1);}
            }
        ],
        "Emotes": [],
        "Cast": [],
        "Transforms": [],
        "Conjures": [],
        "Macros": [],
        "Use": [
            {
                label: "Wine Bottle",
                onclick: (e)=>{addMessage("Wine Bottle");}
            },
            {
                label: "Milk Bottle",
                onclick: (e)=>{addMessage("Milk Bottle");}                
            },
            {
                label: "Crown",
                onclick: (e)=>{addMessage("Crown");}                
            },
            {
                label: "Consumable",
                onclick: (e)=>{addMessage("Consumable");}
            },
            {
                label: "Sex Toy",
                onclick: (e)=>{addMessage("UseToy");}
            }
        ],
        "Locations": [
            {
                label: "Dormitory",
                onclick: (e)=>{addMessage("GoToDormitory");}
            },
            {
                label: "Arboretum",
                onclick: (e)=>{addMessage("GoToArboretum");}
            },
            {
                label: "Auditorium",
                onclick: (e)=>{addMessage("GoToAuditorium");}
            },
            {
                label: "Workshop",
                onclick: (e)=>{addMessage("GoToWorkshop");}
            },
            {
                label: "Library",
                onclick: (e)=>{addMessage("GoToLibrary");}
            },
            {
                label: "Gym",
                onclick: (e)=>{addMessage("GoToGym");}
            },
            {
                label: "Ward",
                onclick: (e)=>{addMessage("GoToWard");}
            },
            {
                label: "Stop Waiting",
                onclick: (e)=>{addMessage("GoToStop");}
            }
        ],
        "CustomSpeech": [
            {
                label: "Speech Toggle",
                onclick: (e)=>{addMessage("SpeechToggle");}
            },
            {
                label: "Add Rule",
                onclick: (e)=>{addMessage("AddSpeechRule");}
            },
            {
                label: "Add Special Rule >",
                onclick: (e)=>{openDropdown(e,"AddSpecialRules",1);}
            },
            {
                label: "Remove Rule",
                onclick: (e)=>{addMessage("RemoveSpecificSpeechRule");}
            },
            {
                label: "Remove All Rules",
                onclick: (e)=>{addMessage("RemoveAllSpeechRules");}
            },
            {
                label: "Ask for the current rules",
                onclick: (e)=>{addMessage("ShowSpeechRules");}
            },
            {
                label: "Examples >",
                onclick: (e)=>{openDropdown(e,"SpeechExamples",1);}
            }
        ],
        "AddSpecialRules": [
            {
                label: "Replace All",
                onclick: (e)=>{addMessage("AddSpecialRuleAll");}
            },
            {
                label: "Add to Start of Message",
                onclick: (e)=>{addMessage("AddSpecialRuleStart");}
            },
            {
                label: "Add to End of Message",
                onclick: (e)=>{addMessage("AddSpecialRuleEnd");}
            },
            {
                label: "Generic Special Rule",
                onclick: (e)=>{addMessage("AddSpecialRuleTemplate");}
            }
        ],
        "SpeechExamples": [
            {
                label: "Third Person Speech",
                onclick: (e)=>{addMessage("InsertThirdPersonSpeech");}
            }
        ],
        "CustomCharacter": [
            {
                label: "Left Character",
                onclick: (e)=>{addMessage("ChangeCharacterLeft");}
            },
            {
                label: "Right Character",
                onclick: (e)=>{addMessage("ChangeCharacterRight");}
            },
            {
                label: "Left Reset",
                onclick: (e)=>{addMessage("ResetCharacterLeft");}
            },
            {
                label: "Right Reset",
                onclick: (e)=>{addMessage("ResetCharacterRight");}
            }
        ],
        "Petrify": [
            {
                label: "Petrify Specific Part",
                onclick: (e)=>{addMessage("PetrifyPart");}
            },
            {
                label: "Petrify Reset Part",
                onclick: (e)=>{addMessage("PetrifyResetPart");}
            },
            {
                label: "Petrify All",
                onclick: (e)=>{addMessage("PetrifyAll");}
            },
            {
                label: "Reset All",
                onclick: (e)=>{addMessage("PetrifyResetAll");}
            }
        ],
        "Locks": [
            {
                label: "Lock Movement",
                onclick: (e)=>{addMessage("LockMovement");}
            },
            {
                label: "Lock Voice",
                onclick: (e)=>{addMessage("LockVoice");}
            },
            {
                label: "Lock Lust",
                onclick: (e)=>{addMessage("LockLust");}
            },
            {
                label: "Lock SelfCast",
                onclick: (e)=>{addMessage("LockSelfCast");}
            },
            {
                label: "Lock Spells Minor",
                onclick: (e)=>{addMessage("LockSpellsMinor");}
            },
            {
                label: "Lock Spells Major",
                onclick: (e)=>{addMessage("LockSpellsMajor");}
            },
        ],
        "Unlocks": [
            {
                label: "Unlock Movement",
                onclick: (e)=>{addMessage("UnlockMovement");}
            },
            {
                label: "Unlock Voice",
                onclick: (e)=>{addMessage("UnlockVoice");}
            },
            {
                label: "Unlock Lust",
                onclick: (e)=>{addMessage("UnlockLust");}
            },
            {
                label: "Unlock SelfCast",
                onclick: (e)=>{addMessage("UnlockSelfCast");}
            },
            {
                label: "Unlock Spells Minor",
                onclick: (e)=>{addMessage("UnlockSpellsMinor");}
            },
            {
                label: "Unlock Spells Major",
                onclick: (e)=>{addMessage("UnlockSpellsMajor");}
            },
        ],
        "Intervals": [
            {
                label: "Generic Interval",
                onclick: (e)=>{addMessage("GenericInterval");}
            },
            {
                label: "Say Interval",
                onclick: (e)=>{addMessage("SayInterval");}
            },
            {
                label: "Cast Interval",
                onclick: (e)=>{addMessage("CastInterval");}
            },
            {
                label: "Lock Interval",
                onclick: (e)=>{addMessage("LockInterval");}
            },
            {
                label: "Silly Interval",
                onclick: (e)=>{addMessage("SillyInterval");}
            },
            {
                label: "Remove Interval",
                onclick: (e)=>{addMessage("RemoveInterval");}
            },
            {
                label: "Ask for the current intervals",
                onclick: (e)=>{addMessage("ShowIntervals");}
            }
        ]
    };

    var _messageList = {
        "Delete": `${deleteKeyword}`,
        "Say": "/s ",
        "Emote": "/e ",
        "OOC": "/o ",
        "Wear": "/wear 0 ",
        "Remove": "/remove 0 ",
        "Change Height": `/cast [@player] Change Height, 4'10" `,
        "Change Name": `/cast [@player] Change Name, NewNameHere `,
        "Enchant Item": '${GAME_MANAGER.instance.Send("Crafting",{appearance:undefined,itemId:GAME_MANAGER.instance.equipment.items[0],optionId:111,spellId:22})}',
        "Wine Bottle": "/use Wine Bottle, Spin ",
        "Milk Bottle": "/use Milk Bottle, Spin ",
        "Crown": "/use Crown, Coin Toss ",
        "Consumable": "/use consumableName ",
        "UseToy": "/use toyName, toyAction ",
        /*Location*/
        "GoToDormitory": '${GAME_MANAGER.instance.Send("Location",{nextLocation:"Dormitory",avoidEncounters:false,event:false,waitForEncounter:false})}',
        "GoToArboretum": '${GAME_MANAGER.instance.Send("Location",{nextLocation:"Arboretum",avoidEncounters:false,event:false,waitForEncounter:false})}',
        "GoToAuditorium": '${GAME_MANAGER.instance.Send("Location",{nextLocation:"Auditorium",avoidEncounters:false,event:false,waitForEncounter:false})}',
        "GoToWorkshop": '${GAME_MANAGER.instance.Send("Location",{nextLocation:"Workshop",avoidEncounters:false,event:false,waitForEncounter:false})}',
        "GoToLibrary": '${GAME_MANAGER.instance.Send("Location",{nextLocation:"Library",avoidEncounters:false,event:false,waitForEncounter:false})}',
        "GoToGym": '${GAME_MANAGER.instance.Send("Location",{nextLocation:"Gym",avoidEncounters:false,event:false,waitForEncounter:false})}',
        "GoToWard": '${GAME_MANAGER.instance.Send("Location",{nextLocation:"Ward",avoidEncounters:false,event:false,waitForEncounter:false})}',
        "GoToStop": '${GAME_MANAGER.instance.Send("Location",{nextLocation:true,avoidEncounters:false,event:false,waitForEncounter:false})}',
        "ShowInventory": `\${theMes=MESSAGECAST.getMyInventoryInAMessage(0);GAME_MANAGER.instance.WaitFor("Message",{receiver:"${GAME_MANAGER.instance.username}",message:theMes,load:true});}`,
        /*speech*/
        "SpeechToggle": "${MESSAGECAST.loadCustomSpeech();MESSAGECAST.activeCustomSpeech=true;}",
        "AddSpeechRule": '${MESSAGECAST.loadCustomSpeech();MESSAGECAST.addSpeechRule(/replaceThis/gm, (mes)=>{return "replacedWith";});}',
        /*"AddSpecialRule": '${MESSAGECAST.loadCustomSpeech();MESSAGECAST.addSpeechRuleSpecial("ALL/START/END", (mes)=>{return "replacedWith"});}',*/
        "AddSpecialRuleTemplate": '${MESSAGECAST.loadCustomSpeech();MESSAGECAST.addSpeechRuleSpecial(/replaceThis/gm, (mes)=>{return "replacedWith"});}',
        "AddSpecialRuleAll": '${MESSAGECAST.loadCustomSpeech();MESSAGECAST.addSpeechRuleSpecial("ALL", (mes)=>{return "replacedWith"});}',
        "AddSpecialRuleStart": '${MESSAGECAST.loadCustomSpeech();MESSAGECAST.addSpeechRuleSpecial("START", (mes)=>{return "replacedWith"+mes});}',
        "AddSpecialRuleEnd": '${MESSAGECAST.loadCustomSpeech();MESSAGECAST.addSpeechRuleSpecial("END", (mes)=>{return mes+"replacedWith"});}',
        "RemoveSpecificSpeechRule": "${MESSAGECAST.loadCustomSpeech();MESSAGECAST.removeSpeechRule(0);}",
        "RemoveAllSpeechRules": '${MESSAGECAST.loadCustomSpeech();MESSAGECAST.removeSpeechRule("ALL");}',
        "ShowSpeechRules": `\${theMes=MESSAGECAST.getMySpeechRulesInAMessage();GAME_MANAGER.instance.WaitFor("Message",{receiver:"${GAME_MANAGER.instance.username}",message:theMes,load:true});}`,
        "InsertThirdPersonSpeech": `\${MESSAGECAST.loadCustomSpeech();MESSAGECAST.addSpeechRule(/\\bam\\b \\bi\\b/gi,(mes)=>{return "is".concat(" {"+"name}");});MESSAGECAST.addSpeechRule(/\\bhave\\b \\bi\\b/gi,(mes)=>{return "has".concat(" {"+"name}");});MESSAGECAST.addSpeechRule(/\\bdon't\\b \\bi\\b/gi,(mes)=>{return "doesn't".concat(' {'+'name}');});MESSAGECAST.addSpeechRule(/\\bdo\\b \\bi\\b/gi,(mes)=>{return "does".concat(' {'+'name}');});MESSAGECAST.addSpeechRule(MESSAGECAST.complicatedRegex[0],(...arguments)=>{return arguments[1].concat(' {'+'name}');});MESSAGECAST.addSpeechRule(MESSAGECAST.complicatedRegex[1],(...arguments)=>{return arguments[1].concat(' {'+'name}');});MESSAGECAST.addSpeechRule(MESSAGECAST.complicatedRegex[2],(...arguments)=>{console.log(arguments);res='{'+'name}';wrongGuess=['need','feed','seed','bleed','weed','heed','proceed','speed','succeed','bed','wed','shed','shred','sled'];if(wrongGuess.includes(arguments[3])){return arguments[0];}if(arguments[1]!=undefined){res=res.concat(' ',arguments[1])}return res.concat(' ',arguments[3]);});MESSAGECAST.addSpeechRule(MESSAGECAST.complicatedRegex[3],(...arguments)=>{console.log(arguments);return arguments[1]==undefined?'{'+'name}'.concat(' has'):'{'+'name} '.concat(arguments[1],' has');});MESSAGECAST.addSpeechRule(MESSAGECAST.complicatedRegex[4],(...arguments)=>{console.log(arguments);return arguments[1]==undefined?'{'+'name}'.concat(' is'):'{'+'name} '.concat(arguments[1],' is');});MESSAGECAST.addSpeechRule(MESSAGECAST.complicatedRegex[5],(...arguments)=>{console.log(arguments);return arguments[1]==undefined?'{'+'name}'.concat(" hasn't"):'{'+'name} '.concat(arguments[1]," hasn't");});MESSAGECAST.addSpeechRule(MESSAGECAST.complicatedRegex[6],(...arguments)=>{console.log(arguments);return arguments[1]==undefined?'{'+'name}'.concat(" doesn't"):'{'+'name} '.concat(arguments[1]," doesn't");});MESSAGECAST.addSpeechRule(MESSAGECAST.complicatedRegex[7],(...arguments)=>{console.log(arguments);return arguments[1]==undefined?'{'+'name}'.concat(' ',arguments[3]):'{'+'name} '.concat(arguments[1],' ',arguments[3]);});MESSAGECAST.addSpeechRule(MESSAGECAST.complicatedRegex[8],(...arguments)=>{console.log(arguments);return arguments[1]==undefined?'{'+'name}'.concat(' ',arguments[3]):'{'+'name} '.concat(arguments[1],' ',arguments[3]);});MESSAGECAST.addSpeechRule(/\\bi'm\\b/gi,(mes)=>{return '{'+'name}'.concat("'s");});MESSAGECAST.addSpeechRule(/\\bi've\\b/gi,(mes)=>{return '{'+'name}'.concat("'s");});MESSAGECAST.addSpeechRule(MESSAGECAST.complicatedRegex[9],(...arguments)=>{console.log(arguments);return arguments[1]==undefined?'{'+'name}'.concat(' ',arguments[3].slice(0,-1),'ies'):'{'+'name} '.concat(arguments[1],' ',arguments[3].slice(0,-1),'ies');});MESSAGECAST.addSpeechRule(MESSAGECAST.complicatedRegex[10],(...arguments)=>{console.log(arguments);res='{'+'name}'; if(arguments[1]!=undefined){res=res.concat(' ',arguments[1]);}return String(arguments[4]).endsWith('y')?res.concat(' ',arguments[3].slice(0,-1),'ies'):res.concat(' ',arguments[3],'es');});MESSAGECAST.addSpeechRule(MESSAGECAST.complicatedRegex[11],(...arguments)=>{console.log(arguments);return arguments[1]==undefined?'{'+'name}'.concat(' ',arguments[3],'s'):'{'+'name} '.concat(arguments[1],' ',arguments[3],'s');});MESSAGECAST.addSpeechRule(/\\bi\\b/gi,(mes)=>{return '{'+'name}';});MESSAGECAST.addSpeechRule(/\\bme\\b/gi,(mes)=>{return '{'+'name}';});MESSAGECAST.addSpeechRule(/\\bmy\\b/gi,(mes)=>{return "{"+"name}'s";});MESSAGECAST.addSpeechRule(/\\bmyself\\b/gi,(mes)=>{return 'herself';});MESSAGECAST.addSpeechRule(/\\bmine\\b/gi,(mes)=>{return 'hers';});MESSAGECAST.addSpeechRule(MESSAGECAST.complicatedRegex[12],(...arguments)=>{console.log(arguments);console.log(arguments[1]);return arguments[1].toUpperCase();});}`,
        /*Change Character*/
        "ChangeCharacterLeft": `\${MESSAGECAST.changeCharacterImage(0,"imgUrl",{scale:"1,1",backgroundSize:"auto 100%"});}`,
        "ChangeCharacterRight": `\${MESSAGECAST.changeCharacterImage(1,"imgUrl",{scale:"1,1",backgroundSize:"auto 100%"});}`,
        "ResetCharacterLeft": `\${MESSAGECAST.resetCharacterImage(0);}`,
        "ResetCharacterRight": `\${MESSAGECAST.resetCharacterImage(1);}`,
        "SendPrivateMessage": '${GAME_MANAGER.instance.WaitFor("Message",{receiver:"usernameReceiver",message:"yourMessage",load:true});}',
        /*Petrify*/
        "PetrifyPart": '${MESSAGECAST.petrifyPart("Underpants");}',
        "PetrifyResetPart": '${MESSAGECAST.unpetrifyPart("Underpants");}',
        "PetrifyAll": '${MESSAGECAST.petrifyAll();}',
        "PetrifyResetAll": '${MESSAGECAST.unpetrifyAll();}',
        /*Lock/Unlock*/
        "LockMovement": '${MESSAGECAST.lockMovement();}',
        "UnlockMovement": '${MESSAGECAST.unlockMovement();}',
        "LockVoice": '${MESSAGECAST.lockVoice();}',
        "UnlockVoice": '${MESSAGECAST.unlockVoice();}',
        "LockLust": '${MESSAGECAST.lockLust();}',
        "UnlockLust": '${MESSAGECAST.unlockLust();}',
        "LockSelfCast": '${MESSAGECAST.lockSelfCast();}',
        "UnlockSelfCast": '${MESSAGECAST.unlockSelfCast();}',
        "LockSpellsMinor": '${MESSAGECAST.lockSpellsMinor();}',
        "UnlockSpellsMinor": '${MESSAGECAST.unlockSpellsMinor();}',
        "LockSpellsMajor": '${MESSAGECAST.lockSpellsMajor();}',
        "UnlockSpellsMajor": '${MESSAGECAST.unlockSpellsMajor();}',
        /*Intervals*/
        "GenericInterval": '${let tmpInterval={};let intervalId = setInterval(()=>{let possibleMessages=["Option1","Option2"];let mes=possibleMessages[Math.floor(Math.random()*possibleMessages.length)];if(Math.random()<0.0083) {ACTION_BAR.TriggerMacro("",mes);};},30000);tmpInterval.id = intervalId;tmpInterval.name = "Interval"+intervalId;currentIntervals.push(tmpInterval);}',
        "SayInterval": '${MESSAGECAST.addInterval({ outcomes: ["Hi","Hello"], probability: 0.0083, checkEvery: 30000, prefix: "/s ", name:""});}',
        "CastInterval": '${MESSAGECAST.addInterval({ outcomes: ["Shrink","Soft Skin"], probability: 0.0083, checkEvery: 30000, prefix: "/cast [@player] ", name:""});}',
        "LockInterval": '${MESSAGECAST.addInterval({ outcomes: ["${MESSAGECAST.lockMovement()}","${MESSAGECAST.unlockMovement()}"], probability: 0.0083, checkEvery: 30000, prefix: "", name:""});}',
        "SillyInterval": `\${MESSAGECAST.addInterval({ outcomes: ["/cast [@player] Change Name, ${GAME_MANAGER.instance.character.name}'s Underwear","/s P-Please, let me be your underwear","/s I want to hug you tightly~","/blush","/kneel","Why did you not turn me into your underwear yet?","/cast [@player] Soft Skin"], probability: 0.25, checkEvery: 10000, prefix: "", name:""});}`,
        "RemoveInterval": '${MESSAGECAST.removeInterval(id);}',
        "ShowIntervals": `\${theMes=MESSAGECAST.getMyIntervalsInAMessage();GAME_MANAGER.instance.WaitFor("Message",{receiver:"${GAME_MANAGER.instance.username}",message:theMes,load:true});}`,
    }

    var _dropdownLayerMax = 10;
    var _emotes = ["/awe ","/bark ","/bite ","/bleat ","/blowkiss ","/blush ","/bounce ","/catty ","/closeeyes ","/dance ","/drool ","/flap ","/gasp ","/gaze ","/giggle ","/glare ","/grovel ","/hiss ","/kneel ","/lick ","/meow ","/moan ","/moo ","/neigh ","/oink ","/pout ","/purr ","/shake ","/shimmy ","/shy ","/sleep ","/smile ","/smirk ","/snap ","/stand "];
    var _allSpells = ["Attack","Breast Enlargement","Breast Reduction","Change Appearance: Elven","Change Appearance: Feminine","Change Appearance: Masculine","Change Height","Change Name","Conjure Item >","Enchant Item","Enlarge","Impair Speech: Bimbo","Impair Speech: Canine","Impair Speech: Feline","Impair Speech: French Maid","Impair Speech: Milk Maiden","Impair Speech: Nekomimi","Inflate Breasts","Lactation","Magic Bolt","Mythic Form: Angel","Mythic Form: Demon","Mythic Form: Kitsune","Polymorph: Bunny","Polymorph: Canine","Polymorph: Cow","Polymorph: Feline","Polymorph: Fox","Polymorph: Sheep","Restore Self","Shrink","Smooth Skin","Soft Skin","Soul Imprint","Stoke Libido","Transform Item >","Special Actions"];
    var _parametersSpells = ["Change Height","Change Name","Enchant Item"];
    var _dropdownSpells = ["Conjure Item >","Transform Item >","Special Actions"];
    var _allTransformItems = ["Aviator Glasses","Ball Gag","Belt Collar","Bikini Bottom","Bikini Top","Body Bow","Bow Dress","Boxer Briefs","Bra","Briefs","Butt Plug","Cage Bra","Cage Panties","Catsuit","Collar","Color: Blue","Color: Cyan","Color: Dark","Color: Green","Color: Light","Color: Orange","Color: Pink","Color: Purple","Color: Red","Color: Yellow","Converse Shoes","Dotted Bra","Dotted Bralette","Dotted Panties","Dress Pants","Dress Shirt","Feathered Jacket","Feathered Masquerade Mask","Frilly Shirt","G-String","Glasses","Heels","High Neck Leather Collar","Holiday Babydoll","Jeans","Keyhole Sweater","Leather Belt","Leather Collar","Leather Cuffs","Leather Jacket","Leather Skirt","Leather Trench Coat","Leggings","Long Skirt","Long Tuxedo Shorts","Long-Sleeved Crop Top","Mary Janes","Masquerade Mask","Overbust Corset","Oxfords","Panties","Pareo","Plaid Skirt","Plaid Tie","Plain Bralette","Plain Panties","Pretty Ballerinas","Push-Up Bra","Ring","Round Glasses","Runners","School Uniform","Shirt","Short Dress","Short-Sleeved Dress Shirt","Skimpy String Bra","Skirt","Slippers","Small Butt Plug","Sorceress Dress","Steel Collar","Stockings","Striped Bra","Striped Bralette","Striped Long-Sleeved Crop Top","Striped Panties","Striped Shirt","Studded Collar","Summer Hat","Sweater","Swimming Trunks","T-Shirt","Tanga Panties","Thigh High Socks","Thong","Tie","Tights","Top Hat","Triangle Bra","Tube Top","Tuxedo Shorts","Vest","Victorian Jacket","Vinyl Leotard","Vinyl Opera Gloves","Vinyl Pencil Skirt","Vinyl Thigh High Boots","Vinyl Tube Top","Virgin Killer Sweater","Winter Hat","Witch Hat","Women's Dress Shirt","Women's Jeans","Women's T-Shirt"];
    var _allConjureItems = ["Anal Beads","Aviator Glasses","Ball Gag","Barmaid Dress","Belt Collar","Big Butt Plug","Bikini Bottom","Bikini Top","Body Bow","Bow Dress","Boxer Briefs","Bra","Briefs","Bunny Tail Plug","Butt Plug","Cage Bra","Cage Panties","Cat Tail Plug","Catsuit","Chastity Belt","Chastity Cage","Cheerleader Uniform","Cock Dildo","Collar","Converse Shoes","Dildo","Dotted Bra","Dotted Bralette","Dotted Panties","Dress Pants","Dress Shirt","Feather Duster","Feathered Jacket","Feathered Masquerade Mask","Fox Tail Plug","French Maid Dress","French Maid Headband","Frilly Shirt","G-String","Gala Dress","Glasses","Goggles","Heels","High Neck Leather Collar","Holiday Babydoll","Howie Lab Coat","Huge Butt Plug","Iron Collar","Iron Cuffs","Jeans","Keyhole Sweater","Kitsune Tails Plug","Lab Coat","Latex French Maid Dress","Leather Belt","Leather Collar","Leather Cuffs","Leather Jacket","Leather Skirt","Leather Trench Coat","Leggings","Long Skirt","Long Tuxedo Shorts","Long-Sleeved Crop Top","Mary Janes","Masquerade Mask","Massive Butt Plug","Overbust Corset","Oxfords","Panties","Pareo","Plaid Skirt","Plaid Tie","Plain Bralette","Plain Panties","Pretty Ballerinas","Protective Rubber Boots","Protective Rubber Gloves","Push-Up Bra","Ring","Round Glasses","Runners","School Uniform","Shirt","Short Dress","Short-Sleeved Dress Shirt","Silk Gloves","Silk Opera Gloves","Skimpy String Bra","Skirt","Slippers","Small Butt Plug","Sorceress Dress","Statuette Dildo","Steel Collar","Stockings","Striped Bra","Striped Bralette","Striped Long-Sleeved Crop Top","Striped Panties","Striped Shirt","Studded Collar","Suit Jacket","Suitpants","Summer Hat","Sweater","Swimming Trunks","T-Shirt","Tanga Panties","Thigh High Socks","Thong","Tie","Tights","Top Hat","Triangle Bra","Tube Top","Tuxedo Shorts","Vest","Victorian Jacket","Vinyl Leotard","Vinyl Opera Gloves","Vinyl Pencil Skirt","Vinyl Thigh High Boots","Vinyl Tube Top","Virgin Killer Sweater","Wedding Bouquette","Wedding Dress","Wedding Gloves","Wedding Ring","Wedding Veil","Winter Hat","Witch Hat","Women's Dress Shirt","Women's Jeans","Women's T-Shirt"];
    var _petrifyParts = [
        {
            message: ["{name}'s nipples have never been more hard.","{name}'s boobs feel way heavier as they are now made of stone."],
            additionalEffect: []
        },
        {
            message: ["{name} now has chiseled abs. Quite literally."],
            additionalEffect: []
        },
        {
            message: ["{name}'s cock is now rock hard.","{name}'s pussy is now rock hard."],
            additionalEffect: [lockLust]
        },
        {
            message: ["{name}'s arms are now locked in place."],
            additionalEffect: [lockSpellsMinor]
        },
        {
            message: ["{name}'s expression will not change anymore.","{name}'s expression has been locked into one of pure bliss."],
            additionalEffect: [lockVoice]
        },
        {
            message: ["{name}'s body feels more stiff as it petrifies slightly."],
            additionalEffect: []
        },
        {
            message: ["{name}'s butt can't jiggle anymore as it's now made of stone.","{name}'s butt can't jiggle anymore as it's now made of stone. Also, {name}'s tail has unfortunately lost its fluffness."],
            additionalEffect: []
        },
        {
            message: ["{name}'s feet and legs are now stuck in place. Hope they weren't in an uncomfortable position."],
            additionalEffect: [lockMovement]
        }
    ];
    var _unpetrifyParts = [
        {
            message: ["{name}'s nipples are no longer stuck in their hardened state.","{name}'s boobs are back to their wobbly self."],
            additionalEffect: []
        },
        {
            message: ["{name} tummy has reverted back to its normal self."],
            additionalEffect: []
        },
        {
            message: ["{name}'s cock is no longer rock hard.","{name}'s pussy is no longer rock hard."],
            additionalEffect: [unlockLust]
        },
        {
            message: ["{name} is now free to move their arms again."],
            additionalEffect: [unlockSpellsMinor]
        },
        {
            message: ["{name}'s able to change their facial expression once more."],
            additionalEffect: [unlockVoice]
        },
        {
            message: ["{name}'s body feels less stiff as it unpetrifies slightly."],
            additionalEffect: []
        },
        {
            message: ["{name}'s butt is free to jiggle once more as it's now back to its normal bouncy self.","{name}'s butt is free to jiggle once more as it's now back to its normal bouncy self. Also, {name}'s tail is floofy again."],
            additionalEffect: []
        },
        {
            message: ["{name}'s feet and legs are no longer stuck in place."],
            additionalEffect: [unlockMovement]
        }
    ];
    var _petrifiedParts = 0;
    var _allowedSpellsId = [1, 2, 10, 13, 14, 22, 23, 24, 25, 29];
    /*
    1 = Attack,
    2 = Stoke Libido,  
    10 = Change Name,
    13 = Magic Bolt,
    14 = Change Height,
    22 = Enchant Item
    23 = Transform Item,
    24 = Restore Self, 
    25 = Soul Imprint,
    29 = Conjure Item.
    */
   var complicatedRegex = [
    /\b((ca|must|should|may|might|wo|shall|would|did)n't)\b \bi\b/gi,
    /\b(can|must|should|may|might|will|shall|would|did)\b \bi\b/gi,
    /\bi\b\s*(\b(always|also|hardly ever|often just|often|\w+ly|never|ever|even|seldom|sometimes|once|twice|now|then|already|last|next|yesterday|today|after|afterwards|later|since|still|just|seldom|fast|hard|so|straight|well|lots|somewhat|very much|very|much|most likely|most|quite likely|quite|too|enough|almost|far)\b)* \b(arose|awoke|bore|became|began|bent|bound|bit|bled|blew|broke|bred|brought|built|burnt|bought|could|caught|chose|clung|came|crept|dealt|dug|did|drew|dreamt|drank|drove|ate|fell|fed|felt|fought|found|flew|forbade|forgot|forgave|froze|got|gave|went|ground|grew|hung|had|heard|hid|held|kept|knelt|knew|laid|led|leant|learnt|left|lent|lay|lied|lit|lost|made|might|meant|met|mowed|had|to|overtook|paid|rode|rang|rose|ran|sawed|said|saw|sold|sent|sewed|shook|should|shone|shot|showed|shrank|sang|sank|sat|slept|slid|smelt|sowed|spoke|spelt|spent|spilt|spun|spat|stood|stole|stuck|stung|stank|struck|swore|swept|swelled|swam|swung|took|taught|tore|told|thought|threw|understood|was|woke|wore|wept|would|won|wound|wrote|[\w]+ed)\b/gi,
    /\bi\b\s*(\b(always|also|hardly ever|often just|often|\w+ly|never|ever|even|seldom|sometimes|once|twice|now|then|already|last|next|yesterday|today|after|afterwards|later|since|still|just|seldom|fast|hard|so|straight|well|lots|somewhat|very much|very|much|most likely|most|quite likely|quite|too|enough|almost|far)\b)* \bhave\b/gi,
    /\bi\b\s*(\b(always|also|hardly ever|often just|often|\w+ly|never|ever|even|seldom|sometimes|once|twice|now|then|already|last|next|yesterday|today|after|afterwards|later|since|still|just|seldom|fast|hard|so|straight|well|lots|somewhat|very much|very|much|most likely|most|quite likely|quite|too|enough|almost|far)\b)* \bam\b/gi,
    /\bi\b\s*(\b(always|also|hardly ever|often just|often|\w+ly|never|ever|even|seldom|sometimes|once|twice|now|then|already|last|next|yesterday|today|after|afterwards|later|since|still|just|seldom|fast|hard|so|straight|well|lots|somewhat|very much|very|much|most likely|most|quite likely|quite|too|enough|almost|far)\b)* \bhaven't\b/gi,
    /\bi\b\s*(\b(always|also|hardly ever|often just|often|\w+ly|never|ever|even|seldom|sometimes|once|twice|now|then|already|last|next|yesterday|today|after|afterwards|later|since|still|just|seldom|fast|hard|so|straight|well|lots|somewhat|very much|very|much|most likely|most|quite likely|quite|too|enough|almost|far)\b)* \bdon't\b/gi,
    /\bi\b\s*(\b(always|also|hardly ever|often just|often|\w+ly|never|ever|even|seldom|sometimes|once|twice|now|then|already|last|next|yesterday|today|after|afterwards|later|since|still|just|seldom|fast|hard|so|straight|well|lots|somewhat|very much|very|much|most likely|most|quite likely|quite|too|enough|almost|far)\b)* \b((could|must|should|may|might|wo|shall|would|did)n't)\b/gi,
    /\bi\b\s*(\b(always|also|hardly ever|often just|often|\w+ly|never|ever|even|seldom|sometimes|once|twice|now|then|already|last|next|yesterday|today|after|afterwards|later|since|still|just|seldom|fast|hard|so|straight|well|lots|somewhat|very much|very|much|most likely|most|quite likely|quite|too|enough|almost|far)\b)* \b(can|must|should|may|might|will|shall|did)\b/gi,
    /\bi\b\s*(\b(always|also|hardly ever|often just|often|\w+ly|never|ever|even|seldom|sometimes|once|twice|now|then|already|last|next|yesterday|today|after|afterwards|later|since|still|just|seldom|fast|hard|so|straight|well|lots|somewhat|very much|very|much|most likely|most|quite likely|quite|too|enough|almost|far)\b)* \b(apply|ally|bully|belly|butterfly|comply|colly|dolly|dilly|dally|dillydally|disally|fly|gully|gally|grilly|imply|injelly|jelly|jolly|misapply|multiply|misally|medly|overfly|oversupply|outfly|overply|overmultiply|ply|reply|rally|rely|reapply|resupply|sully|sally|supply|shillyshally|skelly|tally)\b/gi,
    /\bi\b\s*(\b(always|also|hardly ever|often just|often|\w+ly|never|ever|even|seldom|sometimes|once|twice|now|then|already|last|next|yesterday|today|after|afterwards|later|since|still|just|seldom|fast|hard|so|straight|well|lots|somewhat|very much|very|much|most likely|most|quite likely|quite|too|enough|almost|far)\b)* \b((?!also)[\w]+(s|x|z|sh|ch|o|[^aeioul]y))\b/gi,
    /\bi\b\s*(\b(always|also|hardly ever|often just|often|\w+ly|never|ever|even|seldom|sometimes|once|twice|now|then|already|last|next|yesterday|today|after|afterwards|later|since|still|just|seldom|fast|hard|so|straight|well|lots|somewhat|very much|very|much|most likely|most|quite likely|quite|too|enough|almost|far)\b)* \b(\w+)\b/gi,
    /(^\w|[\.\?\!]\s*\w)/gi];
    var _speechRuleId = 0;
    
    function load() {
        if(insertHelperMacros()) {
            if(!addedAlready()) {
                let oldNotification = NOTIFICATION.PrivateMessage;
                NOTIFICATION.PrivateMessage = async function (params) {
                    if(macroEnabled) {
                        if(!MENU.Messages.active) {
                            MESSAGECAST.cast(params);
                        }
                        let deleteNotif = await deleteNotification(params);
                        if(!deleteNotif) {
                            oldNotification(params);
                        }
                    } else {
                        oldNotification(params);
                    }
                };
                //Changing append messages too cause if you have the page in focus with the person that sent you a message you don't get notified
                let oldAppendMessage = MENU.Messages.AppendMessage;
                MENU.Messages.AppendMessage = async (message) => {
                    if(macroEnabled) {
                        let checkCast = checkIfCastNeeded(message);
                        console.log(checkCast);
                        //oldAppendMessage(message);
                        if (checkCast) {
                            cast(message);
                            await deleteNotificationFromAppend(message);
                        }
                        if (checkCast && message.message.includes(deleteKeyword)) {
                            return;
                        }
                        oldAppendMessage(message);
                    } else {
                        oldAppendMessage(message);
                    }
                };
                //Adding settings to Menu
                document.getElementById("menu").getElementsByClassName("button")[0].onclick = rewrittenDropdownFunction();
                //Adding dropdown helper menu in open chat with someone
                let oldMenuMessagesOpen = MENU.Messages.Open;
                MENU.Messages.Open = (username) => {
                    oldMenuMessagesOpen(username);
                    if(!document.getElementById("messageCastDropdownContainerStart")) {
                        addMenuHelper();
                    }
                }

                let addedCheck = document.createElement("span");
                addedCheck.id = "macroAddedCheck";
                addedCheck.classList.add("MESSAGECAST");
                addedCheck.style.display = "none";
                document.body.appendChild(addedCheck);
            }
            ACTION_BAR.TriggerMacro("","/run MesWhitelist");
            ACTION_BAR.TriggerMacro("","/run MessageCast Settings");
        }
    }

    function openSettings() {
        if(document.getElementById("messageCastSettingsMenu")!=null) {
            return;
        }
        let settingsMenu = document.createElement("div");
        settingsMenu.id = "messageCastSettingsMenu";
        settingsMenuHTML = `
        <div id="messageCastCloseButton" class="button close"></div>
        <div id="messageCastSettingsStart">
            <div id="enableMessageCastContainer" class="messageCastContainer">
                <div id="enableMessageCastLabel" class="messageCastLabel">Enable/Disable macro</div>
                <div id="enableMessageCastToggleContainer" class="messageCastToggleContainer">
                    <div id="enableMessageCastToggle" class="messageCastToggle"></div>
                </div>
            </div>
            <div id="allow$Container" class="messageCastContainer">
                <div id="allow$Label" class="messageCastLabel">
                    Allow messages containing '$'? (Warning, it can be dangerous. This does allow people to run external code into your game)
                </div>
                <div id="allow$ToggleContainer" class="messageCastToggleContainer">
                    <div id="allow$Toggle" class="messageCastToggle"></div>
                </div>
            </div>
            <div id="allowWhitelistContainer" class="messageCastContainer">
                <div id="allowWhitelistLabel" class="messageCastLabel">Do you wish to use a whitelist? (Only the usernames in the whitelist will be able to affect you with their messages. Read below for how to add usernames)</div>
                <div id="allowWhitelistToggleContainer" class="messageCastToggleContainer">
                    <div id="allowWhitelistToggle" class="messageCastToggle"></div>
                </div>
            </div>
            <div id="whitelistTutorialContainer" class="messageCastContainer">
                <div id="whitelistTutorial" class="messageCastLabel">To add someone to your whitelist, go to the MesWhitelist macro (it was created when you added this), then, add an username between the two [], and the username must be between two "" and all lowercase. Then run the macro.
For example, to add a and dhmis this is how the macro would look like: </div>
            </div>
            <div id="whitelistTutorialMacro" class="messageCastLabel">\${mesWhitelist=["a","dhmis"];GUI.instance.DisplayMessage("Whitelist Updated");}</div>
        </div>
        `;
        settingsMenu.insertAdjacentHTML("beforeend",settingsMenuHTML);
        document.getElementById("menus").appendChild(settingsMenu);

        //The close button
        let messageCastCloseButton = document.getElementById("messageCastCloseButton");
        messageCastCloseButton.onclick = () => {document.getElementById("messageCastSettingsMenu").remove();}

        //making all toggles swap between red and green
        let toggles=document.getElementsByClassName("messageCastToggle");
        for(let i=0;i<toggles.length;i++) {
            toggles[i].addEventListener("click",(e)=>{
                let curToggleClass = e.target.classList;
                if(curToggleClass.contains("messageCastToggleActive")) {
                    curToggleClass.remove("messageCastToggleActive");
                    curToggleClass.add("messageCastToggleInactive");
                } else {
                    curToggleClass.add("messageCastToggleActive");
                    curToggleClass.remove("messageCastToggleInactive");
                }
            });
        }
        
        //enable macro toggle
        let enableMessageCastToggle = document.getElementById("enableMessageCastToggle");
        enableMessageCastToggle.innerHTML = macroEnabled?"Currently Enabled":"Currently Not Enabled";
        enableMessageCastToggle.classList.add(enableMessageCastToggle?"messageCastToggleActive":"messageCastToggleInactive");
        enableMessageCastToggle.addEventListener("click",(e)=>{
            toggleMacro();
            enableMessageCastToggle.innerHTML = enableMessageCastToggle?"Currently Enabled":"Currently Not Enabled";
        });

        //$ toggle
        let allow$Toggle = document.getElementById("allow$Toggle");
        allow$Toggle.innerHTML = runOption?"Currently Allowed":"Currently Not Allowed";
        allow$Toggle.classList.add(runOption?"messageCastToggleActive":"messageCastToggleInactive");
        allow$Toggle.addEventListener("click",(e)=>{
            toggle$();
            allow$Toggle.innerHTML = runOption?"Currently Allowed":"Currently Not Allowed";
            updateMacroSettings(runOption,useWhitelist);
        });

        //Whitelist toggle
        let allowWhitelistToggle = document.getElementById("allowWhitelistToggle");
        allowWhitelistToggle.innerHTML = useWhitelist?"Currently Enabled":"Currently Not Enabled";
        allowWhitelistToggle.classList.add(useWhitelist?"messageCastToggleActive":"messageCastToggleInactive");
        allowWhitelistToggle.addEventListener("click",(e)=>{
            toggleWhitelist();
            allowWhitelistToggle.innerHTML = useWhitelist?"Currently Enabled":"Currently Not Enabled";
            ACTION_BAR.TriggerMacro("","/run MesWhitelist");
            updateMacroSettings(runOption,useWhitelist);
        });

        //giving the color of your nature to the macro
        let whitelistTutorialMacro = document.getElementById("whitelistTutorialMacro");
        whitelistTutorialMacro.style.color = `var(--${GAME_MANAGER.instance.character.nature})`;

    }

    /*function displayBrowserNotification(title,options,onclick) {
        if(displayBrowserNotificationCheck()) {
            notif=new Notification(title,{... _options,...options});
            notif.onclick = () => {
                window.focus();
                onclick && onclick();
                notif.close();
            };
            return notif;
        }
        return false;
    }
    
    function displayBrowserNotificationCheck() {
        return (!document.hasFocus()&&NOTIFICATION.browserSupport&&Notification.permission==="granted"&&SETTINGS.Get("browser_notifications",false));
    }*/

    function checkWhiteList(mesUser) {
        if(mesWhitelist.includes(mesUser)) {
            return true;
        }
        //GUI.instance.DisplayMessage(`${mesUser} is not whitelisted`);
        return false;
    }

    function cast(params) {
        if(checkIfcastPossible(params)) {
            ACTION_BAR.TriggerMacro("",`${params.message}`);
            console.log(params.message);
        }
    }

    function getCurrentView() {
        return MENU.Messages.elm.classList.contains("sent") ? 1 : MENU.Messages.elm.classList.contains("new") ? 2 : 0;
    }

    function checkIfcastPossible(params) {
        let mes = params.message;
        let mesUser = params.sender.username.toLowerCase();
        if((runOption||mes.match(/\${.*}/)==null)&&(mes.startsWith("/")||mes.startsWith("${"))){
            if(useWhitelist&&checkWhiteList(mesUser)==false) {
                return false;
            }
            return true;
        }
        return false
    }

    async function deleteNotification(params) {
        console.log("I'm in deleteNotification check");
        if(params.message.includes(deleteKeyword)&&!MENU.Messages.active) {
            if(!checkIfcastPossible(params)) {
                return false;
            }
            //removing the message icon
            let unreadMes = document.getElementById("frame_top_right").getElementsByClassName("unread_messages")[0].getElementsByTagName("div")[1].textContent;
            GUI.instance.SetUnreadMessages(Number(unreadMes)-1);

            console.log("Deleting message");
            console.log("----------------");
            let username = params.sender.username;
            //let howManyUnread = Number(document.getElementById("frame_top_right").getElementsByClassName("unread_messages")[0].getElementsByTagName("div")[1].textContent);
            //GUI.instance.SetUnreadMessages(howManyUnread-1);
            //let isInbox = getCurrentView() === 0;
            let deleted = await GAME_MANAGER.instance.WaitFor("Message",{delete:true,ids:[params.id],thread:0});
            //redrawMessageMenu(username);
            console.log("Message deleted");
            return true;
        }
        if(params.message.includes(deleteKeyword)&&MENU.Messages.active) {
            if(!checkIfcastPossible(params)) {
                return false;
            }
            return true;
        }
        console.log("I'm returning false");
        return false;
    }

    async function deleteNotificationFromAppend(params) {
        console.log("I'm in deleteNotification check");
        if(params.message.includes(deleteKeyword)&&checkIfCastNeeded(params)) {
            if(!checkIfcastPossible(params)) {
                return false;
            }
            //removing the message icon
            let unreadMes = document.getElementById("frame_top_right").getElementsByClassName("unread_messages")[0].getElementsByTagName("div")[1].textContent;
            GUI.instance.SetUnreadMessages(Number(unreadMes)-1);

            console.log("Deleting message");
            console.log("----------------");
            let username = params.sender.username;
            //let howManyUnread = Number(document.getElementById("frame_top_right").getElementsByClassName("unread_messages")[0].getElementsByTagName("div")[1].textContent);
            //GUI.instance.SetUnreadMessages(howManyUnread-1);
            //let isInbox = getCurrentView() === 0;
            let deleted = await GAME_MANAGER.instance.WaitFor("Message",{delete:true,ids:[params.id],thread:0});
            //redrawMessageMenu(username);
            console.log("Message deleted");
            return true;
        }
        console.log("I'm returning false");
        return false;
    }

/*    function redrawMessageMenu(username) {
        if(!MENU.Messages.active) {
            MENU.Messages.Open(username);
            MENU.Messages.Toggle();
        } else {
            let currentView = getCurrentView();
            switch (currentView) {
                case 0:
                    MENU.Messages.ShowSent();
                    MENU.Messages.ShowInbox();
                    break;
                case 1:
                    MENU.Messages.ShowInbox();
                    MENU.Messages.ShowSent();
                    break;
                default:
                    MENU.Messages.ShowInbox();
                    MENU.Messages.Open(MENU.Messages.receiver);
            }
        }
    }*/

    function toggleMacro() {
        macroEnabled==true?macroEnabled=false:macroEnabled=true;
        let errorOption = macroEnabled==true?"enabled":"not enabled";
        GUI.instance.DisplayMessage(`The macro is now ${errorOption}`);
    }

    function toggleWhitelist() {
        useWhitelist==true?useWhitelist=false:useWhitelist=true;
        let errorOption = useWhitelist==1?"will":"will not";
        GUI.instance.DisplayMessage(`A whitelist ${errorOption} be used.${useWhitelist==true?"Be sure to fill it in MesWhitelist":""}`);
    }

    function toggle$() {
        runOption==true?runOption=false:runOption=true;
        let errorOption = runOption==1?"allowed":"not allowed";
        GUI.instance.DisplayMessage(`Messages containing '$\{\}' are now ${errorOption}`);
    }

    function insertHelperMacros() {
        if(!ACTION_BAR.GetMacroByName("MesWhitelist")) {
            if(ACTION_BAR.macrosCount==55) {
                GUI.instance.DisplayMessage("There isn't enough room to add the 'MesWhitelist' macro");
                return false;
            }
            let macro = '${mesWhitelist=[];GUI.instance.DisplayMessage("Whitelist Updated");}';
            ACTION_BAR.CreateMacro(55);
            MENU.Macros.Select(ACTION_BAR.macros.length);
            ACTION_BAR.SaveMacro(ACTION_BAR.macros.length-1, 0, "MesWhitelist", macro);
            MENU.Macros.Redraw();
        }
        if(!ACTION_BAR.GetMacroByName("MessageCast Settings")) {
            if(ACTION_BAR.macrosCount==55) {
                GUI.instance.DisplayMessage("There isn't enough room to add the 'MessageCast Settings' macro");
                return false;
            }
            let macro = '${runOption=false;useWhitelist=false;GUI.instance.DisplayMessage("Your settings have been updated.");}';
            ACTION_BAR.CreateMacro(55);
            MENU.Macros.Select(ACTION_BAR.macros.length);
            ACTION_BAR.SaveMacro(ACTION_BAR.macros.length-1, 0, "MessageCast Settings", macro);
            MENU.Macros.Redraw();
        }
        return true;
    }
    
    //To update the settings Macro
    function updateMacroSettings(setting$,settingWhitelist) {
        let macroToUpdate = ACTION_BAR.GetMacroByName('MessageCast Settings');
        let oldMacro = macroToUpdate[3];
        let updatedMacro = oldMacro.replace(/runOption\s*=\s*(true|false|1|0);/gm,`runOption=${setting$};`).replace(/useWhitelist\s*=\s*(true|false|1|0);/gm,`useWhitelist=${settingWhitelist};`);
        MENU.Macros.Select(ACTION_BAR.MacroIdToIndex(macroToUpdate[0])-1);
        ACTION_BAR.SaveMacro(ACTION_BAR.MacroIdToIndex(macroToUpdate[0]),macroToUpdate[1],macroToUpdate[2],updatedMacro);
        MENU.Macros.Redraw();

        ACTION_BAR.TriggerMacro("","/run MessageCast Settings");

        runOption = setting$;
        useWhitelist = settingWhitelist;

    }

    //for appendMessage
    function checkIfCastNeeded(message) {
        let mes = message.message;
        return MENU.Messages.active&&!compareUsernames(message.sender.username,GAME_MANAGER.instance.username)&&checkIfcastPossible(message);//((runOption||mes.match(/\${.*}/)==null)&&(mes.startsWith("/")||mes.startsWith("${")));//document.hasFocus()&&getCurrentView()==2&&!compareUsernames(message.sender.username,GAME_MANAGER.instance.username)&&compareUsernames(message.sender.username,MENU.Messages.receiver);
    }

    function addedAlready() {
        let macroAddedCheck = document.getElementById("macroAddedCheck");
        return macroAddedCheck!=null && macroAddedCheck.classList.contains("MESSAGECAST"); //document.getNOTIFICATION.PrivateMessage.toString().includes("MESSAGECAST");
    }

    function rewrittenDropdownFunction(e) {
        let _menuButton = document.getElementById("menu").getElementsByClassName("button")[0];
        let curFunc = _menuButton.onclick.toString(); 
        let newFunc = curFunc.substring(curFunc.indexOf("{")+1,curFunc.length-1);
        newFunc = newFunc.replace(/_menuButton/gm,'document.getElementById("menu").getElementsByClassName("button")[0]');
        let restOfTheFunc = 'MENU.Spells.Open({}) },\n{ label: "MessageCast", onclick: () => MESSAGECAST.openSettings()}'
        newFunc = newFunc.replace(/MENU\.Spells\.Open\({}\) }/gm,restOfTheFunc);
        newFunc = newFunc.replace(/this\.ExitAlert\(\)/gm,"GUI.instance.ExitAlert()");
        
        return new Function("e",newFunc);
    }

    //Helper stuff here
    function addMenuHelper() {
        let messageMenu = MENU.Messages.elm;
        let helperHTML = `
        <div id="messageCastDropdownContainerStart" class="messageCastLayer0">
            <div id="messageCastDropdownStart" class="messageCastLayer0">Message Cast ▼</div>
            </div>
        </div>
        `;
        messageMenu.insertAdjacentHTML("beforeend",helperHTML);

        //open dropdown on click
        let messageCastDropdownStart = document.getElementById("messageCastDropdownStart");


        messageCastDropdownStart.onclick = (e) => {
            if(getCurrentView()!=2) {
                GUI.instance.DisplayMessage("You need to be in chat with someone if you want this to work.");
                return;
            }
            //DROPDOWN.instance.Open(e,_helperList["Start"]);
            openDropdown(e,"Start",0);
        }

        //to remove the dropdowns
        document.addEventListener("click",(e) => {
            let targetId = e.target.id;
            if(MENU.Messages.active&&!targetId.includes("messageCast")) {
                clearDropdownsFrom(1);
            }
        });
        //remove the dropdown if resizing
        window.addEventListener("resize",() => {
            if(MENU.Messages.active) {
                clearDropdownsFrom(1);
            }
        });

        //loading the bigger dropdowns
        //emotes
        for(let i in _emotes) {
            let curEmo = {};  
			curEmo.label = _emotes[i];  
			curEmo.onclick = (e)=>{addMessage(_emotes[i])};
			_messageList[_emotes[i]] = _emotes[i];   
			_helperList["Emotes"].push(curEmo); 
        }
        //casts
        for(let i in _allSpells) {
            let curSpell = {};
            curSpell.label = _allSpells[i];
            if(_parametersSpells.includes(_allSpells[i])) {
                //spells that require additional inputs (name, height, and 'enchant item', that's actually just cleanse)
                curSpell.onclick = (e)=>{addMessage(_allSpells[i]);};
            } else if (_dropdownSpells.includes(_allSpells[i])) {
                //spells that require a lot more choices (conjure, transform item/opponent)
                switch(_allSpells[i]) {
                    case "Conjure Item >":
                        for(let j in _allConjureItems) {
                            let curConj = {};
                            curConj.label = _allConjureItems[j];
                            curConj.onclick = (e)=>{addMessage("Conjure"+_allConjureItems[j]);};
                            _messageList["Conjure"+_allConjureItems[j]] = `/cast [@player] Conjure Item, 0, ${_allConjureItems[j]}, Accessory, Color `;
                            _helperList["Conjures"].push(curConj);
                        }
                        curSpell.onclick = (e)=>{openDropdown(e,"Conjures",1);};
                        break;
                    case "Transform Item >":
                        for(let j in _allTransformItems) {
                            let curTran = {};
                            curTran.label = _allTransformItems[j];
                            curTran.onclick = (e)=>{addMessage("Transform"+_allTransformItems[j]);};
                            _messageList["Transform"+_allTransformItems[j]] = `/cast [@player] Transform Item, 0, ${_allTransformItems[j]} `;
                            _helperList["Transforms"].push(curTran);
                        }
                        curSpell.onclick = (e)=>{openDropdown(e,"Transforms",1);};
                        break;
                    default:
                        curSpell.onclick = (e)=>{createAndOpenSpecialDropdown(e);};
                }
            } else {
                curSpell.onclick = (e)=>{addMessage(_allSpells[i]);}
                _messageList[_allSpells[i]] = `/cast [@player] ${_allSpells[i]} `;
            }

            _helperList["Cast"].push(curSpell);
        }
        //your own macros
        for(let i=0; i< ACTION_BAR.macrosCount;i++) {
            let curMacro = {};
            let loadedMacro = ACTION_BAR.GetMacro(i);
            curMacro.label = loadedMacro[2];
            curMacro.onclick = (e)=>{addMessage(`${curMacro.label+i}`);};
            _messageList[`${curMacro.label+i}`] = loadedMacro[3];
            _helperList["Macros"].push(curMacro);
        }


    }

    function openDropdown(e,name,position) {
        //creating the dropdown container
        let dropId = name + "DropdownContainer";

        let parent = e.target;
        let rect = parent.getBoundingClientRect();

        let layer = Number(parent.parentElement.className.match(/messageCastLayer(\d+)/)[1])+1;
        //let newHighestLayer = Math.max(_dropdownLayer,layer)+1;
        //let deleteLayersFrom = Math.min(_dropdownLayer,layer);
        clearDropdownsFrom(layer);
        /*if(deleteLayersFrom <= 0) {
            deleteLayersFrom = 1;
        }
        console.log(newHighestLayer);
        console.log(deleteLayersFrom);
        for(curLayer = deleteLayersFrom; curLayer<=newHighestLayer; curLayer++) {
            console.log(`currently:${curLayer}`);
            if(document.getElementsByClassName(`messageCastLayer${curLayer}`).length!=0) {
                document.getElementsByClassName(`messageCastLayer${curLayer}`)[0].remove();
            }
        }
        _dropdownLayer = layer;
        */
        if(document.getElementById(dropId)) {
            console.log("already here");
            return;
        }

		let dropContainer = document.createElement("div");
		dropContainer.id = dropId;
        dropContainer.className = `messageCastDropdownContainer messageCastLayer${layer}`;
		dropContainer.style.width = `${rect.width}px`;
        dropContainer.style.height = `${rect.height*10}px`;
        dropContainer.style.maxHeight = `${rect.height*10}px`;
        dropContainer.style.filter = `brightness(${0.75+0.25*layer})`;
		switch (position) {
            case 0:
                dropContainer.style.top = rect.bottom+"px";
                dropContainer.style.left = rect.left+"px";
                break;
            case 1:
                let boundY = _helperList[name].length>=10?10:_helperList[name].length;
                if(rect.height*boundY+rect.top>container.getBoundingClientRect().bottom&&layer>=2) {
                    dropContainer.style.top = container.getBoundingClientRect().bottom-rect.height*boundY+"px";
                } else {
                    dropContainer.style.top = rect.top+"px";
                }
                if(rect.width+rect.right>container.getBoundingClientRect().right&&layer>=2) {
                    dropContainer.style.left = container.getBoundingClientRect().right-rect.width+"px";//document.getElementsByClassName(`messageCastLayer${layer-2}`)[0].style.left;
                } else {
                    dropContainer.style.left = rect.right+"px";
                }
                break;
            default:
                console.log("Uh, that's not bottom or right");
		};

        //filling the dropdown container
        for(let i in _helperList[name]) {
            let curItem = document.createElement("div");
            curItem.id = "messageCastDropdownItem"+name+i;
            curItem.className = "messageCastDropdownItem";
            curItem.innerHTML = _helperList[name][i].label;
            curItem.onclick = _helperList[name][i].onclick;

            dropContainer.appendChild(curItem);
        }
        document.getElementById("scaler").appendChild(dropContainer);
        //document.body.appendChild(dropContainer);
        //DROPDOWN.instance.Open(e,_helperList[name]);
    }

    function clearDropdownsFrom(layer) {
        for(let curLayer = layer; curLayer<=_dropdownLayerMax; curLayer++) {
            if(document.getElementsByClassName(`messageCastLayer${curLayer}`).length!=0) {
                document.getElementsByClassName(`messageCastLayer${curLayer}`)[0].remove();
            }
        }
    }

    function createAndOpenSpecialDropdown(e) {
        if(!LOCATION.instance.opponent) {
            GUI.instance.DisplayMessage("You need a mindless opponent for this.");
            return;
        }
        if(!LOCATION.instance.GetSpecialActions(LOCATION.instance.opponent.token)) {
            GUI.instance.DisplayMessage("Your opponent is not ready for this yet.");
            return;
        }
        let possibleAction = LOCATION.instance.GetSpecialActions(LOCATION.instance.opponent.token).options;
        _helperList["TransformOp"] = [];
        for(let i in possibleAction) {
            let curAct = {};
            curAct.label = possibleAction[i].action_name;
            curAct.onclick = (e)=>{addMessage(possibleAction[i].action_name);};
            _messageList[possibleAction[i].action_name] = `/cast [@opponent] ${possibleAction[i].action_name}(Spell) `;
            _helperList["TransformOp"].push(curAct);
        }
        openDropdown(e,"TransformOp",1);
    }

    function addMessage(indexLabel) {
        let curMes = MENU.Messages.elm.getElementsByClassName("editable format")[0];
        let addedMes = _messageList[indexLabel];
       
        /*curMes.insertAdjacentText("beforeend",addedMes);
        //to avoid the random \n at the start
        curMes.innerText = curMes.innerText.trimStart();*/

        //Using trim messes with the cursor, this version should work better 
        curMes.innerHTML = curMes.innerHTML.replace(/^(<div>.*)<br>/,"$1");
        curMes.lastChild.insertAdjacentText("beforeend",addedMes);

        clearDropdownsFrom(1);
    }

/*
    If I decide to use a custom dropdown, probably not for now

    function addMenuHelperOldCustom() {
        let messageMenu = MENU.Messages.elm;
        let helperHTML = `
        <div id="messageCastDropdownContainerStart">
            <div id="messageCastDropdownStart">Message Cast ▼</div>
            <div id="messageCastDropdownContentStart" class="messageCastDropdownContentContainer">
                <div class="messageCastDropdown" id="messageCastDropdown1">Simple ▶
                </div>
            </div>
        </div>
        `;
        messageMenu.insertAdjacentHTML("beforeend",helperHTML);

        //open dropdown on click
        let messageCastDropdownStart = document.getElementById("messageCastDropdownStart");
        let messageCastDropdownContentStart = document.getElementById("messageCastDropdownContentStart");
        messageCastDropdownContentStart.style.display = "none";

        messageCastDropdownStart.onclick = (e) => {
            messageCastDropdownContentStart.style.display = "";
        }
        document.addEventListener("click",(e) => {
            let targetId = e.target.id;
            if(MENU.Messages.active&&!targetId.includes("messageCast")) {
                messageCastDropdownContentStart.style.display = "none";
            }
        });
    }
*/
    //Functions used to help the messages here
    //For the inventory, 0 to not see ids, 1 to see
    function getMyInventoryInAMessage(showIds = 0) {
        let allInv = GAME_MANAGER.instance.GetInventoryImage();
        let filteredInv = allInv.tab.concat(allInv.heirlooms);
        filteredInv = [...new Set(filteredInv)].filter(noNull=>noNull);
        let theMes = "";
        for(let i in filteredInv) {
            let curItem = GAME_MANAGER.instance.GetItem(filteredInv[i]);
            theMes += showIds?`${curItem.id}:${itemToLinkSyntax(curItem)},`:itemToLinkSyntax(curItem);
        }
        return theMes!=""?theMes:"My inventory is empty";
    }

    function loadCustomSpeech(customSpeechOnOff = true) {
    //stuff for the custom speech
        let macroAddedCheck = document.getElementById("macroAddedCheck");
        if(macroAddedCheck!=null && !macroAddedCheck.classList.contains("MESSAGECASTCustomSpeech")) {
            let previousSend = GAME_MANAGER.instance.Send;
            GAME_MANAGER.instance.Send = (action, obj) => {
                if(action == "LocalChat" && obj.channel == 0 && MESSAGECAST.activeCustomSpeech) {
                    obj.message = applySpeech(obj.message)
                }
                previousSend(action,obj);
            };
            macroAddedCheck.classList.add("MESSAGECASTCustomSpeech");
        }
        MESSAGECAST.activeCustomSpeech = customSpeechOnOff;
    }

    function addSpeechRule(replaceRegex,replaceFunction) {
        speechRules.push({regex:replaceRegex,function:replaceFunction,id:_speechRuleId+=1});
    }

    function addSpeechRuleSpecial(where,replaceFunction) {
        speechRules.push({regex:where,function:replaceFunction,id:_speechRuleId+=1,isSpecial:true});
    }

    function addMultipleRules(allTheRules) {
        speechRules = speechRules.concat(allTheRules);
    }

    function removeSpeechRule(speechId) {
        if(speechId == "ALL") {
            speechRules = [];
            return;
        }
        for(let i = 0; i<speechRules.length; i++) {
            if(speechRules[i].id == Number(speechId)) {
                speechRules.splice(i,1);
                return;
            }
        }
    }

    function applySpeech(message) {
        let tokens = [];
        let newMes = "";
        tokens = tokenize(message,tokens);
        for(let i in tokens) {
            if((tokens[i].startsWith("*")&&tokens[i].endsWith("*"))||(tokens[i].startsWith("(")&&tokens[i].endsWith(")"))) {
                newMes += tokens[i];
            } else {
                let tmpNewMes = tokens[i];
                for(let j in speechRules) {
                    if(!speechRules[j].isSpecial) {
                        tmpNewMes = tmpNewMes.replace(speechRules[j].regex,speechRules[j].function);
                    }
                }
                newMes += tmpNewMes;
            }
        }
        for(let i in speechRules) {
            if(speechRules[i].isSpecial) {
                switch (speechRules[i].regex) {
                    case "ALL":
                        //console.log("In all");
                        //console.log(speechRules[i]);
                        newMes = newMes.replace(/(.+)/gm,speechRules[i].function);
                        return newMes;
                        break;
                    case "START":
                        //console.log("In start");
                        //console.log(speechRules[i]);
                        newMes = newMes.replace(/^(.)/gm,speechRules[i].function);
                        break;
                    case "END":
                        //console.log("In end");
                        //console.log(speechRules[i]);
                        newMes = newMes.replace(/(.)$/gm,speechRules[i].function);
                        break;
                    default:
                        //console.log("In default");
                        //console.log(speechRules[i]);
                        newMes = newMes.replace(speechRules[i].regex,speechRules[i].function);
                }
            }
        }
        return newMes;
    }

    function tokenize(message, tokens) {
        let star1 = nthIndex(message, "*", 1);
        let star2 = nthIndex(message, "*", 2);
        let par1 = nthIndex(message,"(",1);
        let par2 = par1+nthIndex(message.substring(par1), ")",1);
        //console.log(`1*: ${star1},\n2*: ${star2},\n1(: ${par1},\n2): ${par2}`);
        if(star1 != -1 && star2 != -1 && (star1 < par1||par1 == -1)) {
            //Tokenize **
            //console.log("In *, must copy");
            //console.log(message.substring(star1,star2+1));
            if(star1!=0) {
                tokens.push(message.substring(0,star1));
            }
            tokens.push(message.substring(star1,star2+1));
            message = message.substring(star2+1);
            //console.log("Remaining:");
            //console.log(message);

        } else if (par1 != -1 && par2 > par1 && (par1 < star1||star1 == -1)) {
            //Tokenize ()
            //console.log("In (), must copy");
            //console.log(message.substring(par1,par2+1));
            if(par1!=0) {
                tokens.push(message.substring(0,par1));
            }
            tokens.push(message.substring(par1,par2+1));
            message = message.substring(par2+1);
            //console.log("Remaining:");
            //console.log(message);
        } else {
            //The last one
            //console.log("Last");
            //console.log(message);
            if(message) {
                tokens.push(message);
            }
            return tokens;
        }
        return tokenize(message,tokens);
    }

    function nthIndex(str, pat, n){
        let L = str.length;
        let i = -1;
        while(n--&&i++<L) {
            i = str.indexOf(pat, i);
            if (i < 0) 
                break;
        }
        return i;
    }
    
    function getMySpeechRulesInAMessage() {
        let theMes = "";
        for(let i in speechRules) {
            theMes += `${i}) id:${speechRules[i].id}, regex: ${speechRules[i].regex}, function: ${speechRules[i].function}\n`;
        }
        return theMes!=""?theMes:"I have no rules >:3";
    }

    //stuff to change character image

    function changeCharacterImage(position, imageUrl="", additionalOptions = {}) {
        loadCharacterImageHandler();
        let ch=document.getElementById("characters").children[position];
        if(imageUrl != "") {
            MESSAGECAST.characterImagesUrl[position] = imageUrl;
        }
        if(additionalOptions.scale) {
            MESSAGECAST.characterImagesScale[position] = additionalOptions.scale;
        }
        if(additionalOptions.backgroundSize) {
            MESSAGECAST.characterImagesBgSize[position] = additionalOptions.backgroundSize;
        }
        if(MESSAGECAST.characterImagesUrl[position]!="") {
            ch.firstChild.style.backgroundImage=`url(${MESSAGECAST.characterImagesUrl[position]})`;
        }
        ch.firstChild.style.backgroundSize = MESSAGECAST.characterImagesBgSize[position];
        ch.firstChild.style.transform = `scale(${MESSAGECAST.characterImagesScale[position]})`;
    }

    function loadCharacterImageHandler() {
        let macroAddedCheck = document.getElementById("macroAddedCheck");
        if(macroAddedCheck!=null && !macroAddedCheck.classList.contains("MESSAGECASTCustomImages")) {
            let oldUpdateLocation = SCENE.instance.UpdateLocation;
            SCENE.instance.UpdateLocation = async (location) => {
                console.log(location);
                await oldUpdateLocation(location);
                MESSAGECAST.changeCharacterImage(0);
                MESSAGECAST.changeCharacterImage(1);
            }
            macroAddedCheck.classList.add("MESSAGECASTCustomImages");
        }
    }

    function resetCharacterImage(position) {
        MESSAGECAST.characterImagesUrl[position] = "";
        MESSAGECAST.characterImagesBgSize[position] = "auto 100%";
        MESSAGECAST.characterImagesScale[position] = "1,1";
        SCENE.instance.HideCharacter(position,position,false);
        SCENE.instance.ShowCharacter(position==0?LOCATION.instance.player:LOCATION.instance.opponent,position,0);
    }

    //stuff to petrify

    function petrifyPart(index) {
        let ind = parsePetrifyIndex(index);
        let myselfSlots = MENU.Myself.elm.getElementsByClassName("item_slot accessory");
        let messageToSend = 0;
        if(myselfSlots[ind].style.filter == "grayscale(1)") {
            return;
        }
        //change for noboobs/boobs/boobs with milk -noTail/tail -cock/pussy -hornyface/nothorny
        switch(index) {
            //head/horny
            case 0:
                if(STATUS.player.lust == 1) {
                    messageToSend = 1;
                }
                break;
            //butt/tail
            case 2:
                if(GAME_MANAGER.instance.character.body[2] != 0) {
                    messageToSend = 1;
                }
                break;
            //cock/pussy
            case 5:
                if(GAME_MANAGER.instance.character.genitalia == 2) {
                    messageToSend = 1;
                }
                break;   
            //noBoobs/boobs
            case 7:
                if(GAME_MANAGER.instance.character.breasts[0] > 0) {
                    messageToSend = 1;
                }
                break;
            default:
                messageToSend = 0;                
        }

        GAME_MANAGER.instance.Send("LocalChat",{message:_petrifyParts[ind].message[messageToSend],channel:2});
        //add additional stuff here
        if(_petrifyParts[ind].additionalEffect.length != 0) {
            _petrifyParts[ind].additionalEffect[0]();
        }

        //turn myself slot to stone here
        myselfSlots[ind].style.filter = "grayscale(1)";
        _petrifiedParts +=1;
        if(_petrifiedParts == 8) {
            GAME_MANAGER.instance.Send("LocalChat",{message:"{name} has been completely transformed into a stone statue.",channel:2});
            document.getElementById("characters").children[0].style.filter = "grayscale(1)";
        }
    }

    function unpetrifyPart(index) {
        let ind = parsePetrifyIndex(index);
        let myselfSlots = MENU.Myself.elm.getElementsByClassName("item_slot accessory");
        let messageToSend = 0;
        if(myselfSlots[ind].style.filter != "grayscale(1)") {
            return;
        }
        //change for noboobs/boobs/boobs with milk -noTail/tail -cock/pussy -hornyface/nothorny
        switch(index) {
            //butt/tail
            case 2:
                if(GAME_MANAGER.instance.character.body[2] != 0) {
                    messageToSend = 1;
                }
                break;
            //cock/pussy
            case 5:
                if(GAME_MANAGER.instance.character.genitalia == 2) {
                    messageToSend = 1;
                }
                break;   
            //noBoobs/boobs
            case 7:
                if(GAME_MANAGER.instance.character.breasts[0] > 0) {
                    messageToSend = 1;
                }
                break;
            default:
                messageToSend = 0;                
        }

        GAME_MANAGER.instance.Send("LocalChat",{message:_unpetrifyParts[ind].message[messageToSend],channel:2});
        //remove additional stuff here
        if(_unpetrifyParts[ind].additionalEffect.length != 0) {
            _unpetrifyParts[ind].additionalEffect[0]();
        }

        //remove myself slot stone here
        myselfSlots[ind].style.filter = "";
        _petrifiedParts -=1;
        if(_petrifiedParts == 7) {
            GAME_MANAGER.instance.Send("LocalChat",{message:"{name} is no longer a complete stone statue.",channel:2});
            document.getElementById("characters").children[0].style.filter = "";
        }
    }

    function petrifyAll() {
        let myselfSlots = MENU.Myself.elm.getElementsByClassName("item_slot accessory");
        for(let i=0;i<8;i++) {
            myselfSlots[i].style.filter = "grayscale(1)";
            if(_petrifyParts[i].additionalEffect.length!=0) {
                _petrifyParts[i].additionalEffect[0]();
            }
        }
        _petrifiedParts = 8;

        GAME_MANAGER.instance.Send("LocalChat",{message:"{name} has been completely transformed into a stone statue.",channel:2});
        document.getElementById("characters").children[0].style.filter = "grayscale(1)";
    }

    function unpetrifyAll() {
        let myselfSlots = MENU.Myself.elm.getElementsByClassName("item_slot accessory");
        for(let i=0;i<8;i++) {
            myselfSlots[i].style.filter = "";
            if(_unpetrifyParts[i].additionalEffect.length!=0) {
                _unpetrifyParts[i].additionalEffect[0]();
            }
        }
        _petrifiedParts = 0;

        GAME_MANAGER.instance.Send("LocalChat",{message:"{name} is no longer a complete stone statue.",channel:2});
        document.getElementById("characters").children[0].style.filter = "";
    }

    function parsePetrifyIndex(index) {
        let result = -1;
        if(isNaN(Number(index))) {
            switch(index.toLowerCase()) {
                case "head":
                    result = 4;
                    break;
                case "shirt":
                    result = 5;
                    break;
                case "pants":
                    result = 6;
                    break;
                case "shoes":
                    result = 7;
                    break;
                case "undershirt":
                    result = 1;
                    break;
                case "underpants":
                    result = 2;
                    break;
                case "gloves":
                    result = 3;
                    break;
                case "bra":
                    result = 0;
                    break;
                default:
                    result = -1;
            }
        } else {
            switch(Number(index)) {
                case 0:
                    result = 4;
                    break;
                case 1:
                    result = 5;
                    break;
                case 2:
                    result = 6;
                    break;
                case 3:
                    result = 7;
                    break;
                case 4:
                    result = 1;
                    break;
                case 5:
                    result = 2;
                    break;
                case 6:
                    result = 3;
                    break;
                case 7:
                    result = 0;
                    break;
                default:
                    result = -1;
            }
        }
        return result;
    }

    // locking stuff here
    function lockMovement() {
        MESSAGECAST.movementLocked = true;
        let macroAddedCheck = document.getElementById("macroAddedCheck");
        if(macroAddedCheck!=null && !macroAddedCheck.classList.contains("MESSAGECASTLockMovement")) {
            let previousSend = GAME_MANAGER.instance.Send;
            GAME_MANAGER.instance.Send = (action,obj) => {
                if(MESSAGECAST.movementLocked && action == "Invite" && obj && ((obj.request == true && !obj.response)||(!obj.request && obj.response == true))) {
                    GUI.instance.DisplayMessage("You can't move.");
                    return;
                }
                if(MESSAGECAST.movementLocked && action == "Location") {
                    GUI.instance.DisplayMessage("You can't change location.");
                    return;
                }
            previousSend(action,obj);
            } 
            macroAddedCheck.classList.add("MESSAGECASTLockMovement");
        }
        GUI.instance.DisplayMessage("Your are not allowed to change location anymore. You may still invite people over, or accept their request to reach you.");
    }

    function unlockMovement() {
        MESSAGECAST.movementLocked = false;
    }

    function lockVoice() {
        //unlocking it so the speech is removed and readded rather than added multiple times
        unlockVoice();
        MESSAGECAST.loadCustomSpeech();
        MESSAGECAST.activeCustomSpeech=true;
        MESSAGECAST.addSpeechRule(/(((.+)))/gm,(mes)=>{let mesOptions=["*{name} tried speaking, but their mouth is currently unable to move.*","*{name} tried speaking, but they can't talk.*","*...*","*You'd swear that {name} is trying to say something but, alas, no voice comes out of their mouth.*","*{name} remains silent.*"];return mesOptions[Math.floor(Math.random()*mesOptions.length)];})
        GUI.instance.DisplayMessage("Your are not allowed to speak anymore.");
    }

    function unlockVoice() {
        for(let i=0;i<speechRules.length;i++) {
            if(speechRules[i].regex.toString()=="/(((.+)))/gm") {
                removeSpeechRule(speechRules[i].id);
                return;
            }
        }
    }

    function lockLust() {
        if(MESSAGECAST.lustLockedId == -1) {
            MESSAGECAST.lustLockedId = setInterval(()=>{
                if(GAME_MANAGER.instance.actions.spells >= 1 && STATUS.player.lust < 1) {
                    ACTION_BAR.TriggerMacro("","/cast [@player] Stoke Libido");
                }
            },3100)
        }
    }

    function unlockLust() {
        clearInterval(MESSAGECAST.lustLockedId);
        MESSAGECAST.lustLockedId = -1;
    }

    function spellLockFunction() {
        let macroAddedCheck = document.getElementById("macroAddedCheck");
        if(macroAddedCheck!=null && !macroAddedCheck.classList.contains("MESSAGECASTLockSpells")) {
            let previousCast = GAME_MANAGER.instance.CastSpell;
            GAME_MANAGER.instance.CastSpell = async (spellId, isSelf, value, materialsRequired, variant) => {
                if(MESSAGECAST.selfCastLocked && isSelf && spellId != 2) {
                    GUI.instance.DisplayMessage("You are not allowed to cast spells on yourself.")
                    return;
                }
                if(MESSAGECAST.spellsMajorLocked && spellId > 2) {
                    GUI.instance.DisplayMessage("You can't cast any spell but Attack and Stoke Libido.");
                    return;
                }
                if(MESSAGECAST.spellsMinorLocked && !_allowedSpellsId.includes(spellId)) {
                    GUI.instance.DisplayMessage("You can't cast that spell.");
                    return;
                }
            previousCast(spellId, isSelf, value, materialsRequired, variant);
            } 
            macroAddedCheck.classList.add("MESSAGECASTLockSpells");
        }
    }

    function lockSpellsMinor() {
        MESSAGECAST.spellsMinorLocked = true;
        spellLockFunction();
        GUI.instance.DisplayMessage("Casting most spells is going to be hard from now on.");
    }

    function unlockSpellsMinor() {
        MESSAGECAST.spellsMinorLocked = false;
    }

    function lockSpellsMajor() {
        MESSAGECAST.spellsMajorLocked = true;
        spellLockFunction();
        GUI.instance.DisplayMessage("You can't cast any spell but Attack and Stoke Libido.");
    }

    function unlockSpellsMajor() {
        MESSAGECAST.spellsMajorLocked = false;
    }

    function lockSelfCast() {
        MESSAGECAST.selfCastLocked = true;
        spellLockFunction();
        GUI.instance.DisplayMessage("You can't cast cast spells on yourself anymore.");
    }

    function unlockSelfCast() {
        MESSAGECAST.selfCastLocked = false;
    }

    //intervals
    function getMyIntervalsInAMessage() {
        let theMes = "";
        for(let i in currentIntervals) {
            theMes += `${i}) id: ${currentIntervals[i].id}, name: ${currentIntervals[i].name}\n`;
        }
        return theMes!=""?theMes:"I have no intervals :c";
    }

    function addInterval(intervalInfo) {
        let tmpInterval={};
        let intervalId = setInterval(()=>{
            let possibleMessages=intervalInfo.outcomes;
            let mes=intervalInfo.prefix+possibleMessages[Math.floor(Math.random()*possibleMessages.length)];
            if(Math.random()<intervalInfo.probability) {
                ACTION_BAR.TriggerMacro("",mes);
            };
        },intervalInfo.checkEvery);
        tmpInterval.id = intervalId;
        tmpInterval.name = intervalInfo.name==""?"Interval"+intervalId:intervalInfo.name;
        currentIntervals.push(tmpInterval);
    } 

    function removeInterval(intervalId) {
        for(let i = 0; i<currentIntervals.length; i++) {
            if(currentIntervals[i].id == Number(intervalId)) {
                clearInterval(Number(intervalId));
                currentIntervals.splice(i,1);
            }
        }
    }

    MESSAGECAST.cast = cast;
    //MESSAGECAST.displayBrowserNotification = displayBrowserNotification;
    MESSAGECAST.toggleMacro = toggleMacro;
    MESSAGECAST.toggle$ = toggle$;
    MESSAGECAST.toggleWhitelist = toggleWhitelist;
    MESSAGECAST.openSettings = openSettings;
    MESSAGECAST.updateMacroSettings = updateMacroSettings;
    
    MESSAGECAST.getMyInventoryInAMessage = getMyInventoryInAMessage;

    MESSAGECAST.activeCustomSpeech = false;
    MESSAGECAST.loadCustomSpeech = loadCustomSpeech;
    MESSAGECAST.addSpeechRule = addSpeechRule;
    MESSAGECAST.addSpeechRuleSpecial = addSpeechRuleSpecial;
    MESSAGECAST.removeSpeechRule = removeSpeechRule;
    MESSAGECAST.getMySpeechRulesInAMessage = getMySpeechRulesInAMessage;
    MESSAGECAST.addMultipleRules = addMultipleRules;

    MESSAGECAST.characterImagesUrl = ["",""];
    MESSAGECAST.changeCharacterImage = changeCharacterImage;
    MESSAGECAST.resetCharacterImage = resetCharacterImage;
    MESSAGECAST.characterImagesBgSize = ["auto 100%","auto 100%"];
    MESSAGECAST.characterImagesScale = ["1,1","1,1"];

    MESSAGECAST.petrifyPart = petrifyPart;
    MESSAGECAST.unpetrifyPart = unpetrifyPart;
    MESSAGECAST.petrifyAll = petrifyAll;
    MESSAGECAST.unpetrifyAll = unpetrifyAll;

    MESSAGECAST.lockMovement = lockMovement;
    MESSAGECAST.unlockMovement = unlockMovement;
    MESSAGECAST.movementLocked = false;

    MESSAGECAST.lockVoice = lockVoice;
    MESSAGECAST.unlockVoice = unlockVoice;

    MESSAGECAST.lockLust = lockLust;
    MESSAGECAST.unlockLust = unlockLust;
    MESSAGECAST.lustLockedId = -1;

    MESSAGECAST.spellsMinorLocked = false;
    MESSAGECAST.spellsMajorLocked = false;
    MESSAGECAST.selfCastLocked = false;
    MESSAGECAST.lockSpellsMinor = lockSpellsMinor;
    MESSAGECAST.lockSpellsMajor = lockSpellsMajor;
    MESSAGECAST.lockSelfCast = lockSelfCast;
    MESSAGECAST.unlockSpellsMinor = unlockSpellsMinor;
    MESSAGECAST.unlockSpellsMajor = unlockSpellsMajor;
    MESSAGECAST.unlockSelfCast = unlockSelfCast;

    MESSAGECAST.getMyIntervalsInAMessage = getMyIntervalsInAMessage;
    MESSAGECAST.addInterval = addInterval;
    MESSAGECAST.removeInterval = removeInterval;

    MESSAGECAST.complicatedRegex = complicatedRegex;

    load();

    let scriptCss=document.createElement('link');
    scriptCss.href='https://cdn.jsdelivr.net/gh/AccountForBmr/BmrMessageCast@v0.6.6/message.css';
    scriptCss.rel="stylesheet";
    document.body.appendChild(scriptCss);
    scriptCss.onload = () => {
      GUI.instance.DisplayMessage("Css Loaded");
    }

    GUI.instance.DisplayMessage("Loaded, Hopefully!");
}

MESSAGECAST.load = messageCast;
