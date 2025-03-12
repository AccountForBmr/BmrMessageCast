# **Message Cast**
#### For Battle Mage Royal
A macro that copies messages sent to you, checks if they start with / or ${ (if allowed), and sends the messages in chat after (if you have whitelist on, it checks if the message received comes from someone in the list).
First, here's the macro: (It's only 1, but 2 additional ones will be created the 1st time you run it)
```javascript
${script=document.createElement('script');script.src='https://cdn.jsdelivr.net/gh/AccountForBmr/BmrMessageCast@v1.0.0/message.js';document.body.appendChild(script);script.onload=()=>{MESSAGECAST.load();};}
```
## What changed from the last version
- Added a settings called MessageCast in the top-left menu. You can use it to enable macro, enable messages with $, or enable only whitelisted people. Your settings are saved in the 2 macros generated on your first use.
- Added a button on top of the messages menu. If you click on it you will find shortcuts for various macros/command/stuff in there. (This button is the main new feature)
- Fixed a bug that didn't copy the message if you were looking at the messages with the person messaging you(you didn't get a notification for that specific case)

## Settings
The settings are self-explanatory, but still:
- **Enable/Disable macro** is used to stop the messages from being copied. The effects already active won't stop working, and you can still use any method in the MESSAGECAST variable normally. It just stops the main function of the macro from working, in case you just want to use the macro as a way to just change your image or something.
- **Allow messages containing $** is used to send scripts over to the message receiver. Most of the complicated stuff done by the macro requires this setting to be on, but it is set to off by default for safety reasons. (I advise to keep it on only with whitelisted people. If you want even more safety, there is a bugged and unfinished messageDelayed version, that is the same macro as above but with messageDelayed.js instead of message.js, that let's you read the message and then you can left click to accept or right click to ignore. I stopped working on it cause it messed with the message hiding stuff that I wanted to add)
- **Use whitelist** is used in case you want a list of people that are allowed to use the macro on you. The people in the list will be the only one able to affect you.


## Features
### Sections
- **Simple**: For commands that do NOT require $.
- **Advanced 1-2**: For commands that require $.
- **Your Macros**: Your macros, literally. (Do note that if your macro has /run in it, the receiver of the message will not have the macro that you run. Probably. Might want to remove the run part, and send the macro that you /run as well)
- **Hide message**: If you add this to any message, the message will be hidden, and no notification at all will reach the receiver. (It requires $ allowed obviously) Unless the effects of the message are obvious, it will be impossible to tell that you even received a message. (You can still see it in the console log if needed).

Just click on any of them to get the effect or open more dropdown menus until you find what you need. Advanced and hide messages can be combined in 1. Simple ones you can only do 1 at a time, but you can add as many advanced or hide after(Will still only work if $ enabled)

## Simple
- **say**: talk in the say chat channel (normal one). You can just use say for all of them though. You may use it with ** and () too, just add your message after the /s.
- **\*emote\***: talk in the emote channel. Not needed unless you don't want to start and end say in **.
- **(ooc)**: talk in the ooc channel. Not needed unless you don't want to start and end say in ().
- **emotes**: All the emotes that you get by typing /emotes.
- **cast**: All the spells. (conjure  and transform have ALL the options possible, however, I can't guarantee that the receiver will have the relative option unlocked. For example, you can conjure statuette dildos through a weird interaction, that is, by wearing one you unlock the conjure until you log out, but most people won't be able to do so)
  - Most spell are self-explanatory, but:
  - In **Conjure Item**, the color and accessory are optional, you can leave them like that and it won'r create any issue, or add them after, restricted to the possible choices you have in conjuration of course.
  - **Change Height,Change Name,Enchant Item** require more input from you. You need to insert an height in cm or feet/inches for height, a name (optional surname) for change name, and the slot you'd like to cleanse in Enchant Item.
  - **Special Actions** is a bit weird. Basically, it's only use is if you are someone's item, and the opponent of your owner is mindless, then you get the possible transformation option they have for the inanimate stuff.
  -**Enchant item** requires $ enabled cause Enchant Item has no support for it at the moment. What Enchant Item does now is simply cast Cleanse Item instead. Change the [0] with the slot of the item you want to Cleanse.
- **Wear/Remove**: to wear/remove that slot.
- **Use**: to use an action on a item. I believe some of the actions on sex toys are a bit unintuitive to write though, and didn't want to check them all, but you probably will only use this to spin bottles. For examples, Pussy Fleshlight is just Fleshlight, both if capped or not, some actions have conditions, and it didn't seem worth it worrying about all of that.

## Advanced 1
- **Change Location**: change location to choice. Can set waitForEncounter to true, same for avoid, or events(classes). Stop waiting if you're waiting for an encounter and want to force a stop.
- **Show inventory**: The items in their inventory and heirlooms will be shown in a message. You can change the 0 to 1 if you also want to see the Ids of the items.
- **Private Message**: send a private message to someone(as the person you're sending this to). Replace usernameReceiver and yourMessage accordingly.
- **Custom Speech**: Similar to the custom speech macro, but slightly worse cause you now also have to worry about not writing stuff that will be messed up by the Bmr message formatting. (For example, you can't write hi|hello|abc, cause it will think |hello| is the tokenId of an item and delete it.)
  - **Toggle**: set custom speech to true or false.
  - **Examples**: Some examples. 
    - **3rd person speech**(female only, so just be a good girl if you're male): Will force you to speak in 3rd person. 
    - **Stutter**: Will make you stutter. y-you may stutter only once, or m-m-multiple times more rarely. Base chance is 5%, but the higher your lust is, the more the % increases, up to 90%.
    - **Random moans**: just adds moans,drools, or horny randomly in between spaces with a 9% chance.
    - **How to use | and {name}**: A limitation of this system. To use multiple |, do ```hell[o]|[a]bc[d]|[a]aaa```. To add {name} or the similar structures, do ```"{"+"name}"```, or you can just use $n, cause that's not formatted. 
  - **add Rule**: to add a rule. replaceThis is the regex used to match, replacedWith is what you change it to. You can change the function however you want to complicate it. For examples, if you want to use groups, you may want to replace the ```(mes)``` with ```(...arguments)```, so you can access the groups through arguments[0], arguments[1] etc.
  - **Special Rules**: Rules that ignore the ** and (), and works within them too. 
    - **Start**: for a message at the beginning of your sentence. 
    - **End**: for a message at the end of your sentence
    - **ALL** will replace it all the message. ALL will stop any other rule from triggering as well.
    - **Generic**: Like the previous speech rules, but this one can affect the stuff in ** and ()
  - **Remove rule**: removes the rule with that Id.
  - **All rules**: removes all of them.
  - **Ask for the current rules**: you get a message with the ids of the active rules, and their info (regex/function).
- **Change image**: Used to change/reset a character image on the left/right. 
  - **ImgUrl**: the link of the image
  - **Scale**: the scale of the image, can be -1,1 to flip it or whatever you want.
  - **Background size**: How will the image '''fit'''. Auto 100% is the one used in game, you can change to contain, cover, or other measurements in width% height%, though, you should just keep the base one usually.

## Advanced 2
- **Petrify**: Will petrify someone! (Note that the gray filter will only be visible by the affected person.)
  - **Petrify Part**: Will petrify a specific body part. Replace "Underpants" With the name of the slot you want to petrify, or its number. 
    - Some parts have extra effects or messages depending on male/female/lust/tail. 
      - **0** Will lock your voice (can still use ** or ())
      - **3** will lock you in place
      - **5** will force you to constantly cast Stoke Libido on yourself until you have it maxed out
      - **6** will have the Minor Spell Lock placed on you..
   - **If every part is petrified, the character will become a statue.**
  - **Petrify Reset Part**: To reset a specific part back to normal. The effect of that part will be removed too. 
  - **Petrify All**: Petrify all at once. All the effects will also be applied at once.
  - **Petrify Reset All**: Reset everything in 1.
- **Locks/Unlocks**:
  - **Lock** is to lock something about the receiver, **unlock** to remove that lock.
    - **Movement**: Will stop you from changing location on your own. To meet someone, you will have to either invite them over, or have them request an invite to you.
    - **Voice**: Anything you say will be replaced by messages of you failing to talk. (Can still use ** and ())
    - **Lust**: Constantly cast Stoke Libido on yourself until maxed. 
    - **Spells Minor**: Will stop you from casting some spells. These are the spells you're still allowed to cast:
      - **Attack, Stoke Libido, Change Name, Magic Bolt, Change Height, Enchant Item, Transform Item, Restore Self, Soul Imprint, Conjure Item.**
    - **Spells Major**: Will stop you from casting anything but **Attack** and **Stoke Libido**.
    - **Selfcast**: Will stop you from casting any spell at yourself, even Restore Self. You may still **Stoke Libido** yourself to your heart's contempt though.
- **Intervals**: Actions repeated multiple times. These are a bit complicated, and I mostly made it so you can choose options/time/name. By default, it's 0.83% every 30sec, which translates roughly to once an hour. (Minimum of 0 times, max of 120(unlikely)).
  - **Generic**: A generic interval. You can replace it with whatever you want, generally, if you keep it like that:
    - **possibleMessages** are options of what will be sent.
    - **0.0083** is the probability of it happening with each check. That one is 0.83%, the number must be between 0 and 1.
    - **30000** is how many milliseconds between each check. (That's 30 seconds)
    - You can change the **name** too if you want, it's not important. To do it, replace "Interval"+intervalId with "Your Name".
  - **Say/Cast/Lock** intervals: easy to use intervals.
    - Just replace **outcomes** with what you want (Lock is just used as an example for intervals where you want to use ${})
    - The **probability** with the probability of the event happening every check (The 0.0083, number must be between 0 and 1)
    - And **checkEvery** with how much time you want to pass before a check happens.
    - Some **probabily / time** examples may be:
      - 1 / 60000: Every minute
      - 0.5 / 30000: 50% of the time every 30seconds.
    - You may also add a **name** if you feel like it, replace the "" after name: with "nameHere".
    - **prefix** Is the only difference between the 3 interavals, and is something added at the start of every outcome. /s to talk in the say one, /cast [@player] in cast, and nothing for Lock.
   - **Ask for the current intervals**: Will display the active intervals in a message.
   - **Remove**: Removes interval with that id.
   - **Examples**: Some examples.
     - **Petrify Interval**: Every 10 minutes, advances to the next stage of petrification. The order is [3,2,5,1,4,7,6,0] and can be changed.
     - **Silly**: Basically will have them begging to be your underwear and act subby 25% of the time every 10 seconds.
     - 
    - **Tf Sequences**: Basically, another interval example. A list of actions that will be done every **timeBetweem** (900000ms = 15 min in examples). I used it to change the image on the left, add some text, and occasionally more. You may change **firstOneNow** to **false** if you want the first action to happen after **timeBetween** rather then when they get the message. The examples are:
      - **Female Bun to Shork Pooltoy**: Will assume that you start as a female bunny, and turn you into an animate pooltoy. You will cast smooth skin x3 on yourself during this, lock your lust, and get a more squeaky speech.
      - **M2F statue**: Will assume you're the average human male, and turn you into a piece of art. During this, you will have your clothes stripped **(If you get errors at the start, it's cause you weren't wearing a whole outfit, but the macro will still work fine)**, your body changed to a female one and your movement, voice, lust and selfcast will be locked.
      - **M2F succubus**: Will assume you're the average Joe, and turn you into the demonic symbol of lust. During this, you will become female, and an horny succubus.

## MESSAGECAST Variable
This variable is used to make some functions easier to access and not a complete mess.
You get access to:
- **activeCustomSpeech**: true/false. Parameter to check if custom speech active or not.
- **addInterval**: function addInterval(intervalInfo). Function to add interval. Check that section for how it works.​
- **addMultipleRules**: function addMultipleRules(allTheRules)​ To add multiple speech rules. Never used, but allTheRules should be an array of rules.
- **addSpeechRule**: function addSpeechRule(replaceRegex, replaceFunction)​ Look at the speech rule part.
- **addSpeechRuleSpecial**: function addSpeechRuleSpecial(where, replaceFunction)​ Look at the speechRule part
- **cast**: function cast(params)​ function used to cast a message.
- **changeCharacterImage**: function changeCharacterImage(position, imageUrl, additionalOptions)​ function used to change image, look in that section.
- **characterImagesBgSize**: Array [ "auto 100%", "auto 100%" ]: parameter used to remember the bg size of your images.
- **characterImagesScale**: Array [ "1,1", "1,1" ]: parameter used to remember the scale of your images.
- **characterImagesUrl**: Array [ "", "" ]: parameter used to remember the url of your images.
- **complicatedRegex**: A list of regex used for the 3rd person speech.
- **doUntil**: function doUntil(what, checkFunc)​ A function that does **what** until **checkFunc** returns true. **what** is a macro that gets triggered, for example "/s hello", checkFunc is a function like ```()=>{return GAME_MANAGER.instance.character.genitalia==2}```. When the genitalia becomes 2 (female), the what will not be triggered anymore. 
- **getMyIntervalsInAMessage**: function getMyIntervalsInAMessage(): function that returns your intervals in a string. 
- **getMyInventoryInAMessage**: function getMyInventoryInAMessage(showIds): function that returns your inventory in a string. showId can be 0 or 1. 0 to not show ids, 1 to see them.
- **getMySpeechRulesInAMessage**: function getMySpeechRulesInAMessage(): function that returns your speech rules in a string.
- **load**: function messageCast(): function to load all of this.
- **loadCustomSpeech**: function loadCustomSpeech(customSpeechOnOff): function that installs the required functions for the custom speech in Bmr.
- **lockLust**: function lockLust(): look at Locks.
- **lockMovement**: function lockMovement(): look at Locks.
- **lockSelfCast**: function lockSelfCast(): look at Locks.
- **lockSpellsMajor**: function lockSpellsMajor(): look at Locks.
- **lockSpellsMinor**: function lockSpellsMinor(): look at Locks.
- **lockVoice**: function lockVoice(): look at Locks.
- **lustLockedId**: -1: The id of the interval used to lock your lust.
- **movementLocked**: true/false: Parameter to check if movement is locked.
- **openSettings**: function openSettings(): function to open the settings menu.
- **petrifyAll**: function petrifyAll(): Look at Petrify
- **petrifyPart**: function petrifyPart(index): Look at Petrify
- **removeInterval**: function removeInterval(intervalId): Look at Intervals
- **removeSpeechRule**: function removeSpeechRule(speechId): Look at Custom Speech
- **resetCharacterImage**: function resetCharacterImage(position): Look at Change Image
- **selfCastLocked**: true/false: parameter used to check for locks.
- **spellsMajorLocked**: true/false: parameter used to check for locks.
- **spellsMinorLocked**: true/false: parameter used to check for locks.
- **"toggle$"**: function toggle$(): function to toggle the $ setting on/off
- **toggleMacro**: function toggleMacro(): function to toggle enable macro on/off
- **toggleWhitelist**: function toggleWhitelist(): function to toggle Whitelist on/off
- **unlockLust**: function unlockLust(): Look at locks.
- **unlockMovement**: function unlockMovement(): Look at locks.
- **unlockSelfCast**: function unlockSelfCast(): Look at locks.
- **unlockSpellsMajor**: function unlockSpellsMajor(): Look at locks.
- **unlockSpellsMinor**: function unlockSpellsMinor(): Look at locks.
- **unlockVoice**: function unlockVoice(): Look at locks.
- **unpetrifyAll**: function unpetrifyAll(): Look at Petrify.
- **unpetrifyPart**: function unpetrifyPart(index)Look at Petrify.
- **updateMacroSettings**: function updateMacroSettings(setting$, settingWhitelist): function to update the settings.