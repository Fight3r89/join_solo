
async function init() {
    await includeHTML();
    navChangeColor();
    await getUserDataFromLocalStorage();
}

function navChangeColor() {
    document.getElementById('nav-addtask').classList.add('link-active');
    document.getElementById('nav-addtask').onclick = null;
}

function clearInputFields(){
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').value = '';
    //document.getElementById('assigned-to').value = '';
    //document.getElementById('category').value = '';
    document.getElementById('subtasks').value = '';
}