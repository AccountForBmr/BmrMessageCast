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
