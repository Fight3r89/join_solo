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

function addSubtaskToArray() {
        addSubtask.push({task:document.getElementById('subtasks').value,done:false});
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

function showSubtasks() {
    document.getElementById('showSubtasks').innerHTML = '';
    addSubtask.forEach(ast => {
        document.getElementById('showSubtasks').innerHTML += `<div class="subtasks-hover"><li>${ast.task}</li><div style="display:flex; gap:8px"><img src="assets/icons/delete.png"><div style="width: 1px; background: #d1d1d1;"></div><img src="assets/icons/edit.png"></div></div>`;
    });

}

setTimeout(() =>{
    document.getElementById('subtasks').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Verhindert das Absenden des Formulars
            addSubtaskToArray(); // Führt die gewünschte Aktion aus
        }
    });
},50);