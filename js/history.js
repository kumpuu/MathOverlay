async function history_add(latex, svg=null)
{
    if(svg == null) svg = await renderLatexToSVG(latex);

    let list = document.getElementById("history_list");

    let click = 'let latex = b64DecodeUnicode("' + b64EncodeUnicode(latex) + '");'
        + 'set_formula(latex);'
    if(list.lastChild != null && list.lastChild.getAttribute("onclick") == click) return;
    //I think it's better to compare this instead of innerHTML. It should be more constant across updates

    var li = document.createElement("div");

        var formula = document.createElement("span");
        formula.className = "history_li_formula";
        formula.innerHTML = svg;
        formula.setAttribute("onclick", click);
    li.appendChild(formula);
        
        var del = document.createElement("span");
        del.className = "btn btn_clear_small";
        del.setAttribute("onclick", "history_on_delete_li(this);");
    li.appendChild(del);

    list.appendChild(li);
}

window.addEventListener("DOMContentLoaded", ()=>{
    document.getElementById("btn_clear_history").onclick = async ()=>{
        if(await cbridge.confirm("Clear entire history?")){
            document.getElementById("history_list").innerHTML = "";
        }
    }
});

function history_on_delete_li(button_node)
{
    button_node.parentElement.remove();
}
