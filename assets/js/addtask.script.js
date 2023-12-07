let tasks = [];

async function init() {
    await includeHTML();
    navChangeColor();
}

function navChangeColor() {
    document.getElementById('nav-addtask').classList.add('link-active');
    document.getElementById('nav-addtask').onclick = null;
}

function createNewTask() {
    let newTask = new Task();
    /*document.getElementById('title').value;
    document.getElementById('description').value;
    document.getElementById('assigned-to').value;
    document.getElementById('date').value;
    //document.getElementById('prio').value;
    document.getElementById('category').value;
    document.getElementById('subtasks').value;*/

    newTask.title = document.getElementById('title').value;
    newTask.description = document.getElementById('description').value;
    newTask.assigned_to = document.getElementById('assigned-to').value;
    newTask.date = document.getElementById('date').value;
    //newTask.prio = document.getElementById('prio').value;
    newTask.category = document.getElementById('category').value;
    newTask.subtasks = document.getElementById('subtasks').value;
    
    tasks.push(newTask);  
}