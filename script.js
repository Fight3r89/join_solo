
async function includeHTML() {
    let elements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        file = element.getAttribute("w3-include-html");
        let response = await fetch(file);
        if (response.ok) {
            element.innerHTML = await response.text();
        }
        else {
            element.innerHTML = 'Page not found';
        }
    }
}


function openSite(site) {
    window.location.href = site+'.html';
}