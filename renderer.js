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