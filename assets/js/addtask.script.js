async function init() {
    await getUserDataFromLocalStorage();
    if (await checkLoggedIn()) {
        await includeHTML();
        navChangeColor();
        addSelection(selected);
        changeSubtasksAddImage();
        renderUserMenueInizials();
    }
    else {
        location.href = 'index.html';
    }
}

function navChangeColor() {
    document.getElementById('nav-addtask').classList.add('link-active');
    document.getElementById('mobile-nav-addtask').classList.add('link-active');
    document.getElementById('nav-addtask').onclick = null;
    document.getElementById('mobile-nav-addtask').onclick = null;
}