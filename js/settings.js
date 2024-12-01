settings = {
    items: {},

    storage_name(node, attr){
        return "___store_" + node.nodeName + "#" + node.id + "___" + attr;
    },

    setting_storage_name(node){
        return "___setting_" + node.name + "___value";
    },
    
    //Loop through all elements and load attributes (declared in store="...") from localStorage, if available
    load_from_storage()
    {
        document.body.querySelectorAll('*').forEach(function(node) {
            if(nes(node.id) && nes(node.getAttribute("store"))){
                node.getAttribute("store").split(",").forEach((prop)=>{
                    var val = localStorage.getItem(settings.storage_name(node, prop));
                    
                    //null if it never got saved, "null" if it was null when saved.
                    if(val == null) return;
                    node[prop] = val;
                });
            }

            if(nes(node.name) && node.hasAttribute("setting")){
                //load value from storage if available
                var val = localStorage.getItem(settings.setting_storage_name(node));
                if(val != null){node.value = val;}
             
                //store a reference in settings.items
                Object.defineProperty(settings.items, node.name, {
                    get() { return node.value; },
                    set() { this.node.value = val; }
                });

                //broadcast change event
                node.addEventListener("change", ()=>{
                    window.dispatchEvent(new CustomEvent("setting_changed", {
                        bubbles: false,
                        detail: { id: node.id, val: node.value, setting: settings.items[node.id] }
                    }))
                })

                node.addEventListener("input", ()=>{
                    window.dispatchEvent(new CustomEvent("setting_input", {
                        bubbles: false,
                        detail: { id: node.id, val: node.value, setting: settings.items[node.id] }
                    }))
                })
            }
        });

        window.dispatchEvent(new CustomEvent("after_settings_loaded", { bubbles: false }))
    },

    //Loop through all elements and save attributes (declared in store="...") to localStorage
    save_to_storage()
    {
        document.body.querySelectorAll('*').forEach(function(node) {
            if(!nes(node.id)) return;

            if(nes(node.getAttribute("store"))){
                node.getAttribute("store").split(",").forEach((prop)=>{
                    // var val = node.getAttribute(setting);
                    var val = node[prop];

                    localStorage.setItem(settings.storage_name(node, prop), val);
                });
            }

            if(node.hasAttribute("setting")){
                localStorage.setItem(settings.setting_storage_name(node), node.value);
            }
        });
    }
}

window.addEventListener("DOMContentLoaded", settings.load_from_storage);
window.addEventListener("beforeunload", settings.save_to_storage);