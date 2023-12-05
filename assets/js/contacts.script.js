async function init() {
    await includeHTML();
    navChangeColor();
}

function navChangeColor(){
    document.getElementById('nav-contacts').classList.add('link-active');
    document.getElementById('nav-contacts').onclick = null;
}