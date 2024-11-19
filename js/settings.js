function setting_name(node, setting){return node.nodeName + "#" + node.id + "___" + setting}

function load_settings()
{
    document.body.querySelectorAll('*').forEach(function(node) {
        if(node.id == "" || node.getAttribute("settings") == null) return;

        node.getAttribute("settings").split(",").forEach((setting)=>{
            var val = localStorage.getItem(setting_name(node, setting));
            if(val == null) return;

            if(val == 'null')
                node.removeAttribute(setting);
            else
                node.setAttribute(setting, val);
        });
    });
}

function save_settings()
{
    document.body.querySelectorAll('*').forEach(function(node) {
        if(node.id == "" || node.getAttribute("settings") == null) return;

        node.getAttribute("settings").split(",").forEach((setting)=>{
            var val = node.getAttribute(setting);

            // if(val == null)
            //     localStorage.removeItem(setting_name(node, setting));
            // else
            localStorage.setItem(setting_name(node, setting), val);
        });
    });
}

window.addEventListener("DOMContentLoaded", load_settings);
window.addEventListener("beforeunload", save_settings);