

async function init() {
    await includeHTML();
    navChangeColor();
    await getUserDataFromLocalStorage();
    addSelection(selected);
}

function navChangeColor() {
    document.getElementById('nav-addtask').classList.add('link-active');
    document.getElementById('nav-addtask').onclick = null;
    document.getElementById('mobile-nav-addtask').classList.add('link-active');
    document.getElementById('mobile-nav-addtask').onclick = null;
}