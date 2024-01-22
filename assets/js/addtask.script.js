
async function init() {
    await includeHTML();
    navChangeColor();
    await getUserDataFromLocalStorage();
}

function navChangeColor() {
    document.getElementById('nav-addtask').classList.add('link-active');
    document.getElementById('nav-addtask').onclick = null;
}

function createNewTask(){
    let newTask = new Task;
    newTask.autor = loggedInUser.id;
    newTask.title = document.getElementById('title').value;
    newTask.description = document.getElementById('description').value;
    newTask.assigned_to.push(document.getElementById('assigned-to').value);
    newTask.date = document.getElementById('date').value;
    newTask.prio = 'urgent';
    newTask.category = document.getElementById('category').value;
    newTask.subtasks.push(document.getElementById('subtasks').value);
    saveTasksToBackend(newTask);
    clearInputFields();
}

function clearInputFields(){
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').value = '';
    //document.getElementById('assigned-to').value = '';
    //document.getElementById('category').value = '';
    document.getElementById('subtasks').value = '';
}