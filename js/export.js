async function copy_png()
{
    const mathfield = document.querySelector('math-field'); // Get the MathfieldElement
    const latex = mathfield.getValue('latex'); // Retrieve the LaTeX string

    // Render LaTeX to SVG using MathJax
    const svg = await renderLatexToSVG(latex);
    if (!svg) {
        feedback("Failed to render SVG", 6000, "red");
    }

    var image = new Image();
    var scale = 5;
    image.onload = async function() {
        var canvas = document.createElement('canvas');
        canvas.width = image.width*scale;
        canvas.height = image.height*scale;
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        let err = await cbridge.copy_image_to_clipboard(canvas.toDataURL());

        if(err)
            feedback("Failed to copy image to clipboard: " + err, 6000, "red");
        else{
            feedback("Image copied to clipboard!");
            history_add(latex, svg);
        }
    }
    image.src = 'data:image/svg+xml;base64,' + window.btoa(decodeURIComponent(encodeURIComponent(svg)));

}

async function save_png()
{
    const mathfield = document.querySelector('math-field'); // Get the MathfieldElement
    const latex = mathfield.getValue('latex'); // Retrieve the LaTeX string

    // Render LaTeX to SVG using MathJax
    const svg = await renderLatexToSVG(latex);
    if (!svg) {
        feedback("Failed to render SVG.", 6000, "red");
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
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'formula.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                history_add(latex, svg);
            }
        }, 'image/png');
    }
    image.src = 'data:image/svg+xml;base64,' + window.btoa(decodeURIComponent(encodeURIComponent(svg)));
}

async function save_svg()
{
    const mathfield = document.querySelector('math-field'); // Get the MathfieldElement
    const latex = mathfield.getValue('latex'); // Retrieve the LaTeX string

    // Render LaTeX to SVG using MathJax
    const svg = await renderLatexToSVG(latex);
    if (!svg) {
        feedback("Failed to render SVG.", 6000, "red");
    }

    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'formula.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    history_add(latex, svg);
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