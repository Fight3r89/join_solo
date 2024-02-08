async function init() {
    await getUserDataFromSessionStorage();
    if (await checkLoggedIn()) {
        await includeHTML();
        navChangeColor();
        addSelection(selected);
        changeSubtasksAddImage();
        renderUserMenueInizials();
        getMinDate();
    }
    else {
        location.href = 'index.html';
    }
}

/**
 * Changes the color of the navigation elements and disables their click events.
 *
 */
function navChangeColor() {
    document.getElementById('nav-addtask').classList.add('link-active');
    document.getElementById('mobile-nav-addtask').classList.add('link-active');
    document.getElementById('nav-addtask').onclick = null;
    document.getElementById('mobile-nav-addtask').onclick = null;
}