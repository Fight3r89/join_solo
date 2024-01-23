async function init() {
    await includeHTML();
    navChangeColor();
    await getUserDataFromLocalStorage();
    addSelection(selected);
    changeSubtasksAddImage();
}

function navChangeColor() {
    document.getElementById('nav-addtask').classList.add('link-active');
    document.getElementById('mobile-nav-addtask').classList.add('link-active');
    document.getElementById('nav-addtask').onclick = null;
    document.getElementById('mobile-nav-addtask').onclick = null;
}

function subtaskInputDelete() {
    document.getElementById('subtasks').value = '';
    document.getElementById('subtasks-plus').classList.remove('d-none');
    document.getElementById('subtasks-add-delete').classList.add('d-none');
}

function addSubtaskToArray(){
    addSubtask.push(document.getElementById('subtasks').value);
    document.getElementById('subtasks').value = '';
    document.getElementById('subtasks-plus').classList.remove('d-none');
    document.getElementById('subtasks-add-delete').classList.add('d-none');
    showSubtasks();
}

function changeSubtasksAddImage() {
    const subtasksInput = document.getElementById('subtasks');

    subtasksInput.addEventListener('input', function () {
        if (subtasksInput.value) {
            document.getElementById('subtasks-plus').classList.add('d-none');
            document.getElementById('subtasks-add-delete').classList.remove('d-none');
        }
        else if (!subtasksInput.value) {
            document.getElementById('subtasks-plus').classList.remove('d-none');
            document.getElementById('subtasks-add-delete').classList.add('d-none');
        }
    });
}

function showSubtasks(){
    document.getElementById('showSubtasks').innerHTML = '';
    addSubtask.forEach(ast => {
        document.getElementById('showSubtasks').innerHTML += `<li>${ast}</li>`;
    });
    
}
