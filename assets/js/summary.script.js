async function init() {
    await includeHTML();
    navChangeColor();
}

function navChangeColor(){
    document.getElementById('nav-summary').classList.add('link-active');
    document.getElementById('nav-summary').onclick = null;
}