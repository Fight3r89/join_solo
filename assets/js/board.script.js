async function init() {
    await includeHTML();
    navChangeColor();
}

function navChangeColor(){
    document.getElementById('nav-board').classList.add('link-active');
    document.getElementById('nav-board').onclick = null;
}

