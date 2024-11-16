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

    document.getElementById("btn_export_png").onclick = export_png;
    document.getElementById("btn_export_svg").onclick = export_svg;
});

async function export_png()
{
    const mathfield = document.querySelector('math-field'); // Get the MathfieldElement
    const latex = mathfield.getValue('latex'); // Retrieve the LaTeX string

    // Render LaTeX to SVG using MathJax
    const svg = await renderLatexToSVG(latex);
    if (!svg) {
        console.error("Failed to render SVG.");
    }

    var image = new Image();
    var scale = 5;
    image.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.width = image.width*scale;
        canvas.height = image.height*scale;
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
            if (blob) {
                try {
                    const clipboardItem = new ClipboardItem({ 'image/png': blob });
                    await navigator.clipboard.write([clipboardItem]);
                    console.log("Image copied to clipboard!");
                } catch (err) {
                    console.error("Failed to copy image to clipboard:", err);
                }
            }
        }, 'image/png');
    }
    image.src = 'data:image/svg+xml;base64,' + window.btoa(decodeURIComponent(encodeURIComponent(svg)));

}

async function export_svg()
{
    const mathfield = document.querySelector('math-field'); // Get the MathfieldElement
    const latex = mathfield.getValue('latex'); // Retrieve the LaTeX string

    // Render LaTeX to SVG using MathJax
    const svg = await renderLatexToSVG(latex);
    if (!svg) {
        console.error("Failed to render SVG.");
    }

    // const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    // const link = document.createElement('a');
    // link.href = URL.createObjectURL(blob);
    // link.download = 'math.svg';
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);

    // Create a Blob containing the SVG data
    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });

    try {
        // Copy the SVG blob directly to the clipboard
        const clipboardItem = new ClipboardItem({ 'image/svg+xml': svgBlob });
        await navigator.clipboard.write([clipboardItem]);
        console.log("SVG copied to clipboard!");
    } catch (err) {
        console.error("Failed to copy SVG to clipboard:", err);
    }
}

// Helper function: Render LaTeX to SVG using MathJax
async function renderLatexToSVG(latex) {
    // if (!window.MathJax) {
    //     // Dynamically load MathJax if not already loaded
    //     await new Promise((resolve, reject) => {
    //         const script = document.createElement('script');
    //         script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
    //         script.onload = resolve;
    //         script.onerror = reject;
    //         document.head.appendChild(script);
    //     });
    // }

    // Render LaTeX to SVG using MathJax
    const svg = MathJax.tex2svg(latex, { display: true });
    return svg.getElementsByTagName("svg")[0].outerHTML;
}

function get_xml(html)
{
    var doc = document.implementation.createHTMLDocument("");
    doc.write(html);

    // You must manually set the xmlns if you intend to immediately serialize the HTML
    // document to a string as opposed to appending it to a <foreignObject> in the DOM
    doc.documentElement.setAttribute("xmlns", doc.documentElement.namespaceURI);

    // Get well-formed markup
    var xml = (new XMLSerializer).serializeToString(doc);
    return xml;
}