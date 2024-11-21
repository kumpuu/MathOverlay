window.addEventListener("DOMContentLoaded", () => {
    const mf = document.getElementById("formula");
    const latex = document.getElementById("latex");

    mf.addEventListener("input",(ev) => latex.value = mf.value);

    latex.value = mf.value;
    latex.addEventListener("input", (ev) => 
        mf.setValue(
        ev.target.value, 
        {silenceNotifications: true}
        )
    );

    const information = document.getElementById('info');
    // information.innerText = `This app is using Chrome (v${window.versions.chrome()}), Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`

    document.getElementById("btn_copy_png").onclick = copy_png;
    document.getElementById("btn_save_png").onclick = save_png;
    document.getElementById("btn_save_svg").onclick = save_svg;
});

function feedback(text, duration=4000, color="black")
{
    var node = document.getElementById("feedback");
    node.innerText = text;
    node.style.color = color;

    const anim = [
        {offset: 300/duration,   opacity: 1},
        {offset: 1-400/duration, opacity: 1}
      ];

    node.animate(anim, duration);
}

function set_formula(latex)
{
    document.getElementById("formula").setValue(latex, {silenceNotifications: true});
    document.getElementById("latex").value = latex;
}

//https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
function b64EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded Unicode,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
}

function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}