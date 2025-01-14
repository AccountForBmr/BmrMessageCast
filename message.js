/*
A script that allows for messages to be interpreted as macros, so have fun with it :P!
*/

var MESSAGECAST = {};
var runOption = false;
var useWhitelist = false;
var mesWhitelist = [];
var NotificationEnabled=true;

var messageCast = function() {

    const _options = {
        badge: `${window.location.origin}/assets/favicon/favicon.ico`,
        icon: `${window.location.origin}/game/assets/gui/default_icon.png`
    };

    function load() {
        if(insertHelperMacros()) {
            let AsyncFunction = (async function() {}).constructor;
            let curFunc = NOTIFICATION.PrivateMessage.toString();
            let newFunc = curFunc.substring(curFunc.indexOf("{")+1,curFunc.length-1);
            newFunc = newFunc.replace(/TITLE\.Message\("New private message"\);/gm,'MESSAGECAST.cast(params);if(NotificationsEnabled){TITLE.Message("New private message");');
            newFunc = newFunc.replace(/displayBrowserNotification/gm,'MESSAGECAST.displayBrowserNotification');
            newFunc += "}";

            NOTIFICATION.PrivateMessage = new AsyncFunction("params",newFunc);
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
    }

    MESSAGECAST.displayBrowserNotification = displayBrowserNotification;
    MESSAGECAST.toggle$ = toggle$;
    MESSAGECAST.toggleWhitelist = toggleWhitelist;

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
