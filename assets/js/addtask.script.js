
async function init() {
    await includeHTML();
    navChangeColor();
    await getUserDataFromLocalStorage();
}

function navChangeColor() {
    document.getElementById('nav-addtask').classList.add('link-active');
    document.getElementById('nav-addtask').onclick = null;
}