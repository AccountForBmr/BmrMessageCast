/*
A script that allows for messages to be interpreted as macros, so have fun with it :P!
*/

var MESSAGECAST = {};
var runOption = false;
var useWhitelist = false;
var mesWhitelist = [];
var NotificationsEnabled = true;
var deleteKeyword = 'DELETETHIS="";';

var messageCast = function() {

    const _options = {
        badge: `${window.location.origin}/assets/favicon/favicon.ico`,
        icon: `${window.location.origin}/game/assets/gui/default_icon.png`
    };

    function load() {
        if(insertHelperMacros()) {
            if(!addedAlready()) {
                /*let AsyncFunction = (async function() {}).constructor;
                let curFunc = NOTIFICATION.PrivateMessage.toString();
                let newFunc = curFunc.substring(curFunc.indexOf("{")+1,curFunc.length-1);
                newFunc = newFunc.replace(/TITLE\.Message\("New private message"\);/gm,'MESSAGECAST.cast(params);if(!MESSAGECAST.deleteNotification(params)){TITLE.Message("New private message");');
                newFunc = newFunc.replace(/displayBrowserNotification/gm,'MESSAGECAST.displayBrowserNotification');
                newFunc += "}";

                NOTIFICATION.PrivateMessage = new AsyncFunction("params",newFunc);*/
                let oldNotification = NOTIFICATION.PrivateMessage;
                console.log("I'm here loading");
                console.log(oldNotification.toString());
                NOTIFICATION.PrivateMessage = async function (params) {
                    console.log("casting...")
                    MESSAGECAST.cast(params);
                    console.log("Do I delete notif?");
                    let deleteNotif = await deleteNotification(params);
                    console.log(deleteNotif);
                    if(!deleteNotif) {
                        console.log("Nope");
                        oldNotification(params);
                        console.log("I called oldNotif with");
                        console.log(params);
                    }
                };
                console.log(oldNotification.toString());
                MESSAGECAST.test = oldNotification;
                //changing append messages too cause if you have the page in focus with the person that sent you a message you don't get notified
                let oldAppendMessage = MENU.Messages.AppendMessage;
                MENU.Messages.AppendMessage = async (message) => {
                    console.log("I'm in append Message now");
                    console.log("Do I need to cast?");

                    let checkCast = checkIfCastNeeded(message);
                    console.log(checkCast);
                    oldAppendMessage(message);
                    if (checkCast) {
                        console.log("casting from appendMessage");
                        cast(message);
                        await deleteNotificationFromAppend(message);
                    }
                };
            }
            ACTION_BAR.TriggerMacro("","/run MesWhitelist");
            ACTION_BAR.TriggerMacro("","/run MessageCast Settings");
        }
    }

    function displayBrowserNotification(title,options,onclick) {
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
    }

    function checkWhiteList(mesUser) {
        if(mesWhitelist.includes(mesUser)) {
            return true;
        }
        GUI.instance.DisplayMessage(`${mesUser} is not whitelisted`);
        return false;
    }

    function cast(params) {
        mes = params.message;
        mesUser = params.sender.username.toLowerCase();
        if((runOption||mes.match(/\${.*}/)==null)&&(mes.startsWith("/")||mes.startsWith("${"))){
            if(useWhitelist&&checkWhiteList(mesUser)==false) {
                return;
            }
            ACTION_BAR.TriggerMacro("",`${mes}`);
        }
    }

    function getCurrentView() {
        return MENU.Messages.elm.classList.contains("sent") ? 1 : MENU.Messages.elm.classList.contains("new") ? 2 : 0;
    }

    async function deleteNotification(params) {
        console.log("I'm in deleteNotification check");
        if(params.message.includes(deleteKeyword)) {
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
            redrawMessageMenu(username);
            console.log("Message deleted");
            return true;
        }
        console.log("I'm returning false");
        return false;
    }

    async function deleteNotificationFromAppend(params) {
        console.log("I'm in deleteNotification check");
        if(params.message.includes(deleteKeyword)&&checkIfCastNeeded(params)) {
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
            redrawMessageMenu(username);
            console.log("Message deleted");
            return true;
        }
        console.log("I'm returning false");
        return false;
    }

    function redrawMessageMenu(username) {
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
        if(!ACTION_BAR.GetMacroByName("Cast $ From Messages")) {
            if(ACTION_BAR.macrosCount==55) {
                GUI.instance.DisplayMessage("There isn't enough room to add the 'Cast $ From Messages' macro");
                return false;
            }
            let macro = "${MESSAGECAST.toggle$();}"
            ACTION_BAR.CreateMacro(55);
            MENU.Macros.Select(ACTION_BAR.macros.length);
            ACTION_BAR.SaveMacro(ACTION_BAR.macros.length-1, 0, "Cast $ From Messages", macro);
            MENU.Macros.Redraw();
        }
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
        if(!ACTION_BAR.GetMacroByName("Whitelist Toggle")) {
            if(ACTION_BAR.macrosCount==55) {
                GUI.instance.DisplayMessage("There isn't enough room to add the 'Whitelist Toggle' macro");
                return false;
            }
            let macro = '${MESSAGECAST.toggleWhitelist();}';
            ACTION_BAR.CreateMacro(55);
            MENU.Macros.Select(ACTION_BAR.macros.length);
            ACTION_BAR.SaveMacro(ACTION_BAR.macros.length-1, 0, "Whitelist Toggle", macro);
            MENU.Macros.Redraw();
        }
        if(!ACTION_BAR.GetMacroByName("MessageCast Settings")) {
            if(ACTION_BAR.macrosCount==55) {
                GUI.instance.DisplayMessage("There isn't enough room to add the 'MessageCast Settings' macro");
                return false;
            }
            let macro = '${runOption = false; useWhitelist = false; GUI.instance.DisplayMessage("Your settings have been updated.");}';
            ACTION_BAR.CreateMacro(55);
            MENU.Macros.Select(ACTION_BAR.macros.length);
            ACTION_BAR.SaveMacro(ACTION_BAR.macros.length-1, 0, "MessageCast Settings", macro);
            MENU.Macros.Redraw();
        }
        return true;
    }

    //for appendMessage
    function checkIfCastNeeded(message) {
        return document.hasFocus()&&getCurrentView()==2&&!compareUsernames(message.sender.username,GAME_MANAGER.instance.username)&&compareUsernames(message.sender.username,MENU.Messages.receiver);
    }

    function addedAlready() {
        return NOTIFICATION.PrivateMessage.toString().includes("MESSAGECAST");
    }

    MESSAGECAST.cast = cast;
    MESSAGECAST.displayBrowserNotification = displayBrowserNotification;
    MESSAGECAST.toggle$ = toggle$;
    MESSAGECAST.toggleWhitelist = toggleWhitelist;
    MESSAGECAST.deleteNotification = deleteNotification;

    load();

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

