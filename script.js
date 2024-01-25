let tasks = [];
let users = [];
let addSubtask = [];
let loggedInUser = [];
let userTasks = [];
let amountOfTasks = 0;
let tasksTodo = 0;
let tasksDone = 0;
let tasksInProgress = 0;
let tasksAwaitFeedback = 0;
let tasksUrgent = 0;
let selected = 'med';

async function includeHTML() {
    let elements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        file = element.getAttribute("w3-include-html");
        let response = await fetch(file);
        if (response.ok) {
            element.innerHTML = await response.text();
        }
        else {
            element.innerHTML = 'Page not found';
        }
    }
}

function firstLoad() {
    includeHTML();
    setTimeout(function () {
        document.getElementById('content-login').classList.remove('d-none');
        document.getElementById('div-index-register').classList.remove('d-none');
        //document.getElementById('footer').classList.remove('d-none');
    }, 500);
}

function openSignUp() {
    document.getElementById('div-index-register').classList.add('d-none');
    document.getElementById('content-login').classList.add('d-none');
    document.getElementById('content-register').classList.remove('d-none');
}

function closeSignUp() {
    document.getElementById('div-index-register').classList.remove('d-none');
    document.getElementById('content-login').classList.remove('d-none');
    document.getElementById('content-register').classList.add('d-none');
}

function openSite(site) {
    window.location.href = site + '.html';
}

async function loadUsers(){
    let user = [];
    user = JSON.parse(await getItem('users'));
    user.forEach(e => {
        let loadUser = new User();
        loadUser.id = e.id;
        loadUser.firstName = e.firstName;
        loadUser.lastName = e.lastName;
        loadUser.eMail = e.eMail;
        loadUser.password = e.password;
        users.push(loadUser);
    });
}

async function checkLoggedIn(){
    if(loggedInUser){
        return true;
    }
    else {
        return false;
    }
}

async function createNewTask(){
    //debugger;
    let newTask = new Task;
    newTask.autor = loggedInUser.id;
    newTask.title = document.getElementById('title').value;
    newTask.description = document.getElementById('description').value;
    newTask.assigned_to.push(document.getElementById('assigned-to').value);
    newTask.date = document.getElementById('date').value;
    newTask.prio = selected;
    newTask.category = document.getElementById('category').value;
    newTask.subtasks = [...addSubtask];
    await saveTasksToBackend(newTask);
    clearInputFields();
    location.href = 'board.html';
}

function clearInputFields(){
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').value = '';
    //document.getElementById('assigned-to').value = '';
    //document.getElementById('category').value = '';
    document.getElementById('subtasks').value = '';
    document.getElementById('showSubtasks').innerHTML = '';
    addSubtask = [];
}

function setAmounts() {
    amountOfTasks = userTasks.length;
    for (let i = 0; i < userTasks.length; i++) {
        switch (userTasks[i].task) {
            case 'todo':
                tasksTodo += 1;
                break;
            case 'inprogress':
                tasksInProgress += 1;
                break;
            case 'awaitfeedback':
                tasksAwaitFeedback += 1;
                break;
            case 'done':
                tasksDone += 1;
                break;
            default:
                break;
        }
        if (userTasks[i].prio == 'urgent') tasksUrgent += 1;
        //console.log(tasks[i].prio);
    }
}

function choosePrio(prio) {
    if (!selected) {
        addSelection(prio);
        selected = prio;
    }
    else if (prio === selected) {
        removeSelection(selected);
        selected = null;
    }
    else {
        removeSelection(selected);
        addSelection(prio);
        selected = prio;
    }
}

function removeSelection(selected) {
    if (selected) {
        document.getElementById('prio_' + selected).classList.remove('bg-color-' + selected);
        document.getElementById('prio_' + selected).classList.remove('prio-selected');
    }
}


function addSelection(prio) {
    document.getElementById('prio_' + prio).classList.add('bg-color-' + prio);
    document.getElementById('prio_' + prio).classList.add('prio-selected');
}