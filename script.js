let tasks = [];
let users = [];
let allContacts = [];
let addSubtask = [];
let addAssignedTo = [];
let loggedInUser = [];
let userTasks = [];
let userContacts = [];
let amountOfTasks = 0;
let tasksTodo;
let tasksDone;
let tasksInProgress;
let tasksAwaitFeedback;
let tasksUrgent;
let selected = 'medium';
let task = 'todo';
let toggleShowAssignedTo = false;


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

async function loadUsers() {
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

async function checkLoggedIn() {
    if (loggedInUser) {
        return true;
    }
    else {
        return false;
    }
}

async function createNewTask() {
    let newTask = new Task;
    newTask.autor = loggedInUser.id;
    newTask.title = document.getElementById('title').value;
    newTask.description = document.getElementById('description').value;
    newTask.assigned_to = [...addAssignedTo];
    newTask.date = document.getElementById('date').value;
    newTask.prio = selected;
    newTask.category = document.getElementById('category').value;
    newTask.subtasks = [...addSubtask];
    newTask.task = task;
    await saveTasksToBackend(newTask);
    clearInputFields();
    location.href = 'board.html';
}

function clearInputFields() {
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
        tasksTodo = 0;
        tasksDone = 0;
        tasksInProgress = 0;
        tasksAwaitFeedback = 0;
        tasksUrgent = 0;
    
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
    addSubtask.forEach(function (ast, i) {
        document.getElementById('showSubtasks').innerHTML += `
        <div class="subtasks-hover">
            <li>${ast.task}</li>
            <div style="display:flex; gap:8px">
                <img src="assets/icons/delete.png" onclick="deleteSubtask(${i})">
                <div style="width: 1px; background: #d1d1d1;">
                </div>
                <img src="assets/icons/edit.png">
            </div>
        </div>`;
    });

}

setTimeout(() => {
    document.getElementById('subtasks').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Verhindert das Absenden des Formulars
            addSubtaskToArray(); // Führt die gewünschte Aktion aus
        }
    });
}, 50);

async function addContactsToAssignedTo() {
    if (userContacts.length == 0) {
        await loadUsersContacts();
        if(userContacts.length == 0) document.getElementById('contactsAssignedTo').innerHTML += 'No Contacts Avalable';
    }

    for (let i = 0; i < userContacts.length; i++) {
        if (!userContacts[i].assign) {
            userContacts[i].assign = false;
        }
        document.getElementById('contactsAssignedTo').innerHTML += `
        <div class="assignedToContactsListItemContainer" id="contact${i}" onclick="selectContactForAssign(${i})">
            <div class="assignedToContactsListItemContainerLeft">
                <div class="assignedToContactsListInizials">
                    SF
                </div>
                ${userContacts[i].firstName} ${userContacts[i].lastName}
            </div>
            <img id="checkbox${i}" src="assets/icons/check_box.png">
        </div>`;
        if (userContacts[i].assign) {
            contactCBackgroundColor(i);
        }
    }
}

async function openContactsAssignedTo() {
    let inputAssignedTo = document.getElementById('contactsAssignedTo');
    (document.getElementById('addTaskAssignedToSelectDefault').classList.contains('mb-0')) ? document.getElementById('addTaskAssignedToSelectDefault').classList.remove('mb-0') : document.getElementById('addTaskAssignedToSelectDefault').classList.add('mb-0')
    inputAssignedTo.innerHTML = '';
    if (!toggleShowAssignedTo) {
        await addContactsToAssignedTo();
        inputAssignedTo.classList.remove('d-none');
    } else {
        inputAssignedTo.classList.add('d-none');
    }
    toggleShowAssignedTo = !toggleShowAssignedTo;
}

function selectContactForAssign(i) {
    let path = document.getElementById('checkbox' + i).src;
    let imagePath = new URL(path).pathname.split('/');
    imagePath.shift();
    imagePath = imagePath.join('/');
    if (imagePath == 'assets/icons/check_box.png') {
        addContactsToAssignedToArray(i);
        changeAssignToContacts(i);
        userContacts[i].assign = true;
    }
    else {       
        deleteContactsToAssignedToArray(userContacts[i].id);
        changeAssignToContacts(i);
        userContacts[i].assign = false;
    }
}

function changeAssignToContacts(i){
    contactCBackgroundColor(i);
    changeDefaultAssignedTo();
}

function addContactsToAssignedToArray(arrayPosition) {
    addAssignedTo.push(userContacts[arrayPosition]);
}

function deleteContactsToAssignedToArray(userId) {
    for (let i = 0; i < addAssignedTo.length; i++) {
        if (addAssignedTo[i].id == userId) {
            addAssignedTo.splice(i, 1);
        }
    }
}

function contactCBackgroundColor(i) {
    if (document.getElementById('contact' + i).classList.contains('contactSelected')) {
        document.getElementById('contact' + i).classList.remove('contactSelected');
        document.getElementById('checkbox' + i).src = 'assets/icons/check_box.png';
        
    }
    else {
        document.getElementById('contact' + i).classList.add('contactSelected');
        document.getElementById('checkbox' + i).src = 'assets/icons/check_box_checked.png';
    }
}

function changeDefaultAssignedTo() {
    document.getElementById('addTaskAssignedToSelectDefault').innerHTML = '';
    let i = 1;
    if (addAssignedTo.length > 0) {
            addAssignedTo.forEach(ucid => {
                document.getElementById('addTaskAssignedToSelectDefault').innerHTML += `
                ${ucid.firstName} ${ucid.lastName}`;
                if(addAssignedTo.length > 1 && i < addAssignedTo.length) {
                    document.getElementById('addTaskAssignedToSelectDefault').innerHTML += `,`;
                }
                i++;
            });
    }
    else {
        document.getElementById('addTaskAssignedToSelectDefault').innerHTML = 'Select contacts to assign';
    }
}

function deleteSubtask(arrayPosition) {
    addSubtask.splice([arrayPosition],1);
    showSubtasks();
}

function editSubtask(){

}

function subtaskInputDelete() {
    document.getElementById('subtasks').value = '';
    document.getElementById('subtasks-plus').classList.remove('d-none');
    document.getElementById('subtasks-add-delete').classList.add('d-none');
}

function addSubtaskToArray() {
    addSubtask.push({ task: document.getElementById('subtasks').value, done: false });
    document.getElementById('subtasks').value = '';
    document.getElementById('subtasks-plus').classList.remove('d-none');
    document.getElementById('subtasks-add-delete').classList.add('d-none');
    showSubtasks();
}