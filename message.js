/*
A script that allows for messages to be interpreted as macros, so have fun with it :P!
*/

var MESSAGECAST = {};
var runOption = false;
var useWhitelist = false;
var mesWhitelist = [];
var NotificationsEnabled = true;
var deleteKeyword = '${DELETETHIS="";}';

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
                label: "Hide Message",
                onclick: (e)=>{addMessage("Delete");}
            }
        ],
        "Simple": [
            {
                label: "A",
                onclick: (e)=>{openDropdown(e,"Test",1);}
            },
            {
                label: "B",
                onclick: (e)=>{alert(2);}
            }
        ],
        "Advanced": [
            {
                label: "B",
                onclick: (e)=>{alert(2);}
            }
        ],
        "Test": [
            {
                label: "Test",
                onclick: (e)=>{openDropdown(e,"Test",1);}
            }
        ]
    };

    var _messageList = {
        "Delete": `${deleteKeyword}`
    }

    var _dropdownLayer = 0;

    function load() {
        if(insertHelperMacros()) {
            if(!addedAlready()) {
                let oldNotification = NOTIFICATION.PrivateMessage;
                NOTIFICATION.PrivateMessage = async function (params) {
                    if(!MENU.Messages.active) {
                        MESSAGECAST.cast(params);
                    }
                    let deleteNotif = await deleteNotification(params);
                    if(!deleteNotif) {
                        oldNotification(params);
                    }
                };
                //Changing append messages too cause if you have the page in focus with the person that sent you a message you don't get notified
                let oldAppendMessage = MENU.Messages.AppendMessage;
                MENU.Messages.AppendMessage = async (message) => {
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
            }
            ACTION_BAR.TriggerMacro("","/run MesWhitelist");
            ACTION_BAR.TriggerMacro("","/run MessageCast Settings");
        }
    }

    function openSettings() {
        let settingsMenu = document.createElement("div");
        settingsMenu.id = "messageCastSettingsMenu";
        settingsMenuHTML = `
        <div id="messageCastCloseButton" class="button close"></div>
        <div id="messageCastSettingsStart">
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
        GUI.instance.DisplayMessage(`${mesUser} is not whitelisted`);
        return false;
    }

    function cast(params) {
        if(checkIfcastPossible(params)) {
            ACTION_BAR.TriggerMacro("",`${mes}`);
        }
    }

    function getCurrentView() {
        return MENU.Messages.elm.classList.contains("sent") ? 1 : MENU.Messages.elm.classList.contains("new") ? 2 : 0;
    }

    function checkIfcastPossible(params) {
        mes = params.message;
        mesUser = params.sender.username.toLowerCase();
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
        return NOTIFICATION.PrivateMessage.toString().includes("MESSAGECAST");
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

    }

    function openDropdown(e,name,position) {
        //creating the dropdown container
        let dropId = name + "DropdownContainer";

        let parent = e.target;
        let rect = parent.getBoundingClientRect();

        let layer = Number(parent.parentElement.className.match(/messageCastLayer(\d+)/)[1])+1;
        let newHighestLayer = Math.max(_dropdownLayer,layer);
        let deleteLayersFrom = Math.min(_dropdownLayer,layer);
        if(deleteLayersFrom <= 0) {
            deleteLayersFrom = 1;
        }
        console.log(newHighestLayer);
        console.log(deleteLayersFrom);
        for(curLayer = deleteLayersFrom+1; curLayer<=newHighestLayer; curLayer++) {
            console.log(`currently:${curLayer}`);
            if(document.getElementsByClassName(`messageCastLayer${curLayer}`).length!=0) {
                document.getElementsByClassName(`messageCastLayer${curLayer}`)[0].remove();
            }
        }
        _dropdownLayer = layer;
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
		switch (position) {
            case 0:
                dropContainer.style.top = rect.bottom+"px";
                dropContainer.style.left = rect.left+"px";
                break;
            case 1:
                dropContainer.style.top = rect.top+"px";
                dropContainer.style.left = rect.right+"px";
                break;
            default:
                console.log("Uh, that's not bottom or right");
		};

        //filling the dropdown container
        for(i in _helperList[name]) {
            let curItem = document.createElement("div");
            curItem.id = "messageCastDropdownItem"+name+i;
            curItem.className = "messageCastDropdownItem";
            curItem.innerHTML = _helperList[name][i].label;
            curItem.onclick = _helperList[name][i].onclick;

            dropContainer.appendChild(curItem);
        }
        document.body.appendChild(dropContainer);
        //DROPDOWN.instance.Open(e,_helperList[name]);
    }

    function addMessage(indexLabel) {
        let curMes = MENU.Messages.elm.getElementsByClassName("editable format")[0];
        let addedMes = _messageList[indexLabel];
        /*if(curMes.firstChild.innerHTML.endsWith("<br>")) {
            curMes.firstChild.innerHTML = curMes.firstChild.innerHTML.replace(/(.*)<br>$/g,"$1");
        }*/
        curMes.insertAdjacentText("beforeend",addedMes);
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

    MESSAGECAST.cast = cast;
    //MESSAGECAST.displayBrowserNotification = displayBrowserNotification;
    MESSAGECAST.toggle$ = toggle$;
    MESSAGECAST.toggleWhitelist = toggleWhitelist;
    MESSAGECAST.openSettings = openSettings;
    MESSAGECAST.updateMacroSettings = updateMacroSettings;

    load();

    let scriptCss=document.createElement('link');
    scriptCss.href='https://cdn.jsdelivr.net/gh/AccountForBmr/BmrMessageCast@v0.3.4/message.css';
    scriptCss.rel="stylesheet";
    document.body.appendChild(scriptCss);
    scriptCss.onload = () => {
      GUI.instance.DisplayMessage("Css Loaded");
    }

    GUI.instance.DisplayMessage("Loaded, Hopefully!");
}

MESSAGECAST.load = messageCast;

/*
AsyncFunction = (async function() {}).constructor;
pmF=NOTIFICATION.PrivateMessage.toString().substring(26,562);
npmF="castMes(params);"+pmF;
NOTIFICATION.PrivateMessage=new AsyncFunction("params",npmF);

_options={badge: `${window.location.origin}/assets/favicon/favicon.ico`,icon: `${window.location.origin}/game/assets/gui/default_icon.png`};

check=()=>{return (!document.hasFocus()&&NOTIFICATION.browserSupport&&Notification.permission==="granted"&&SETTINGS.Get("browser_notifications",false));}

displayBrowserNotification=function(title,options,onclick){if(check()){notif=new Notification(title,{... _options,...options});notif.onclick=()=>{window.focus();onclick && onclick();notif.close();};return notif;}return false;};

checkWhiteList=(mesUser)=>{
    if(mesWhitelist.includes(mesUser)) {
        return true;
    }
    GUI.instance.DisplayMessage("user is not whitelisted");
    return false;
}

runOption=false;
GUI.instance.DisplayMessage("Macro Loaded Correctly, Probably :D");
castMes=(params)=>{
    mes = params.message;
    mesUser = params.sender.username.toLowerCase();
    if((runOption||mes.match(/\${.*}/)==null)&&(mes.startsWith("/")||mes.startsWith("${"))&&checkWhiteList(mesUser)){
        ACTION_BAR.TriggerMacro("",`${mes}`);
    }
}
*/

//APPENDED MEssages, TODO?
/*
MENU.Messages.AppendMessage = (message)=>{
	console.log("appending");
	if(MENU.Messages.active) {
		let currentView = getCurrentView();
    switch (currentView) {
    	case 0:
            console.log("In inbox, close show");	    
            MENU.Messages.ShowSent();
            MENU.Messages.ShowInbox();
            break;
    	case 1:
            console.log("In sent, never here I think");
            MENU.Messages.ShowInbox();
            MENU.Messages.ShowSent();
        break;
   	 default:
		console.log("In chat!");
		let mesDiv = document.getElementsByClassName("editable format")[0].firstChild;
		if(message.sender.username == GAME_MANAGER.instance.username) {
			mesDiv.textContent = "";
		}
		if(window.getSelection()!=undefined) {
			console.log("I was writing here");
			let selection = window.getSelection();
			range = document.createRange();
			range.setStart(selection.anchorNode, selection.anchorOffset);
			range.setEnd(selection.anchorNode, selection.anchorOffset);
			window.getSelection().addRange(range);
		}
        	MENU.Messages.ShowInbox();
        	MENU.Messages.Open(MENU.Messages.receiver);
  		}
	}
};

function getCurrentView() {
        return MENU.Messages.elm.classList.contains("sent") ? 1 : MENU.Messages.elm.classList.contains("new") ? 2 : 0;
    }

*/

/*
If I feel like making my own dropdown

drop1 = document.getElementById("messageCastDropdown1");
drop1.addEventListener("mouseover",(e)=>{
	console.log("hovering on red");
	if(!document.getElementById("abc")) {
		menuRect = document.getElementById("menu_messages").getBoundingClientRect();
		abc = document.createElement("div");
		abc.id = "abc";
		abc.style = `position:fixed;left:${e.clientX-menuRect.left}px;top:${e.clientY-menuRect.top}px;width:20%;height:10%;background-color:red;`;
		drop1.appendChild(abc);
		abc.addEventListener("mouseover",(e)=>{
			console.log("hovering on blue");
			if(!document.getElementById("abc1")) {
				menuRect1 = document.getElementById("menu_messages").getBoundingClientRect();
				abc1 = document.createElement("div");
				abc1.id = "abc1";
				abc1.style = `position:fixed;left:${e.clientX-menuRect1.left}px;top:${e.clientY-menuRect1.top}px;width:20%;height:10%;background-color:blue;`;
				drop1.appendChild(abc1);
			}
			e.stopPropagation();
		},false);
	} else {
		menuRect = document.getElementById("menu_messages").getBoundingClientRect();
		document.getElementById("abc").top = e.clientY-menuRect.top+"px";
		document.getElementById("abc").left = e.clientX-menuRect.left+"px";
	}
	e.stopPropagation();
},false);

*/