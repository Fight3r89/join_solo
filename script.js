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
let colors = ['#FF7A00', '#00BEE8', '#1FD7C1', '#462F8A', '#6E52FF', '#9327FF', '#9747FF', '#FC71FF', '#FF4646', '#FFBB2B'];


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

function choosePrio(prio, edit) {
    if (!selected) {
        addSelection(prio, edit);
        selected = prio;
    }
    else if (prio === selected) {
        removeSelection(selected, edit);
        selected = null;
    }
    else {
        removeSelection(selected, edit);
        addSelection(prio, edit);
        selected = prio;
    }
}

function removeSelection(selected, edit) {
    if (selected) {
        if (edit) {
            document.getElementById('edit_prio_' + selected).classList.remove('bg-color-' + selected);
            document.getElementById('edit_prio_' + selected).classList.remove('prio-selected');
        }
        else {
            document.getElementById('prio_' + selected).classList.remove('bg-color-' + selected);
            document.getElementById('prio_' + selected).classList.remove('prio-selected');
        }
    }
}


function addSelection(prio, edit) {
    if (edit) {
        document.getElementById('edit_prio_' + prio).classList.add('bg-color-' + prio);
        document.getElementById('edit_prio_' + prio).classList.add('prio-selected');
    }
    else {
        document.getElementById('prio_' + prio).classList.add('bg-color-' + prio);
        document.getElementById('prio_' + prio).classList.add('prio-selected');
    }
}

function changeSubtasksAddImage() {
    const subtasksInput = document.getElementById('subtasks');
    const editSubtasksInput = document.getElementById('editSubtasks');

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
    if (editSubtasksInput) {
        editSubtasksInput.addEventListener('input', function () {
            if (editSubtasksInput.value) {
                document.getElementById('editSubtasks-plus').classList.add('d-none');
                document.getElementById('editSubtasks-add-delete').classList.remove('d-none');
            }
            else if (!editSubtasksInput.value) {
                document.getElementById('editSubtasks-plus').classList.remove('d-none');
                document.getElementById('editSubtasks-add-delete').classList.add('d-none');
            }
        });
    }
}

function showSubtasks(edit) {
    let container;
    if (edit) {
        container = 'editShowSubtasks';
    }
    else {
        container = 'showSubtasks';
    }
    document.getElementById(container).innerHTML = '';
    addSubtask.forEach(function (ast, i) {
        document.getElementById(container).innerHTML += `
        <div class="subtasks-hover">
            <li>${ast.task}</li>
            <div style="display:flex; gap:8px">
                <img src="assets/icons/delete.png" onclick="deleteSubtask(${i}, ${edit})">
                <div style="width: 1px; background: #d1d1d1;">
                </div>
                <img src="assets/icons/edit.png">
            </div>
        </div>`;
    });

}

async function addContactsToAssignedTo(edit) {
    let container;
    if (edit) {
        container = document.getElementById('editContactsAssignedTo');
    }
    else {
        container = document.getElementById('contactsAssignedTo');
    }
    if (userContacts.length == 0) {
        await loadUsersContacts();
        if (userContacts.length == 0) container.innerHTML += 'No Contacts Avalable';
    }

    for (let i = 0; i < userContacts.length; i++) {
        if (!userContacts[i].assign) {
            userContacts[i].assign = false;
        }
        container.innerHTML += `
        <div class="assignedToContactsListItemContainer" id="contact${i}" onclick="selectContactForAssign(${i},${edit})">
            <div class="assignedToContactsListItemContainerLeft">
                <div class="assignedToContactsListInizials" id="assignedToContactsListInizials${i}">
                ${userContacts[i].firstName.charAt(0)}${userContacts[i].lastName.charAt(0)}
                </div>
                ${userContacts[i].firstName} ${userContacts[i].lastName}
            </div>
            <img id="checkbox${i}" src="assets/icons/check_box.png">
        </div>`;
        if (userContacts[i].assign) {
            contactCBackgroundColor(i);
        }
        document.getElementById('assignedToContactsListInizials'+i).style.backgroundColor = userContacts[i].color;
    }
}

async function openContactsAssignedTo(edit) {
    let inputAssignedTo;
    let container;
    if (edit) {
        inputAssignedTo = document.getElementById('editContactsAssignedTo');
        container = document.getElementById('editAddTaskAssignedToSelectDefault');
    }
    else {
        inputAssignedTo = document.getElementById('contactsAssignedTo');
        container = document.getElementById('addTaskAssignedToSelectDefault');
    }
    (container.classList.contains('mb-0')) ? container.classList.remove('mb-0') : container.classList.add('mb-0')
    inputAssignedTo.innerHTML = '';
    if (!toggleShowAssignedTo) {
        await addContactsToAssignedTo(edit);
        inputAssignedTo.classList.remove('d-none');
    } else {
        inputAssignedTo.classList.add('d-none');
    }
    toggleShowAssignedTo = !toggleShowAssignedTo;
}

function selectContactForAssign(i, edit) {
    let path = document.getElementById('checkbox' + i).src;
    let imagePath = new URL(path).pathname.split('/');
    imagePath.shift();
    imagePath = imagePath.join('/');
    if (imagePath == 'assets/icons/check_box.png') {
        addContactsToAssignedToArray(i);
        changeAssignToContacts(i, edit);
        userContacts[i].assign = true;
    }
    else {
        deleteContactsToAssignedToArray(userContacts[i].id);
        changeAssignToContacts(i, edit);
        userContacts[i].assign = false;
    }
}

function changeAssignToContacts(i, edit) {
    contactCBackgroundColor(i, edit);
    changeDefaultAssignedTo(edit);
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

function contactCBackgroundColor(i, edit) {
    if (document.getElementById('contact' + i).classList.contains('contactSelected')) {
        document.getElementById('contact' + i).classList.remove('contactSelected');
        document.getElementById('checkbox' + i).src = 'assets/icons/check_box.png';

    }
    else {
        document.getElementById('contact' + i).classList.add('contactSelected');
        document.getElementById('checkbox' + i).src = 'assets/icons/check_box_checked.png';
    }
}

function changeDefaultAssignedTo(edit) {
    let container;
    if (edit) {
        container = document.getElementById('editAddTaskAssignedToSelectDefault');
    }
    else {
        container = document.getElementById('addTaskAssignedToSelectDefault');
    }
    container.innerHTML = '';
    let i = 1;
    if (addAssignedTo.length > 0) {
        addAssignedTo.forEach(ucid => {
            container.innerHTML += `
                ${ucid.firstName} ${ucid.lastName}`;
            if (addAssignedTo.length > 1 && i < addAssignedTo.length) {
                container.innerHTML += `,`;
            }
            i++;
        });
    }
    else {
        container.innerHTML = 'Select contacts to assign';
    }
}

function deleteSubtask(arrayPosition, edit) {
    addSubtask.splice([arrayPosition], 1);
    showSubtasks(edit);
}

function subtaskInputDelete(edit) {
    let container;
    if (edit) {
        container = 'editSubtasks'
    }
    else {
        container = 'subtasks';
    }
    document.getElementById(container).value = '';
    document.getElementById(container + '-plus').classList.remove('d-none');
    document.getElementById(container + '-add-delete').classList.add('d-none');
}

function addSubtaskToArray(edit) {
    let container;
    if (edit) {
        container = 'editSubtasks'
    }
    else {
        container = 'subtasks';
    }
    addSubtask.push({ task: document.getElementById(container).value, done: false });
    document.getElementById(container).value = '';
    document.getElementById(container + '-plus').classList.remove('d-none');
    document.getElementById(container + '-add-delete').classList.add('d-none');
    showSubtasks(edit);
}

function renderUserMenueInizials() {
    document.getElementById('header-user-menu').innerHTML = loggedInUser.firstName.charAt(0) + '' + loggedInUser.lastName.charAt(0);
}

function openUserMenue() {
    document.getElementById('header-user-menu-dropdown').classList.toggle('d-none');
}

function logout() {
    sessionStorage.removeItem('user');
    window.location.href = 'index.html';
}

function generateColor() {
    return colors[colorArrayPosition = Math.floor(Math.random() * 10)];
}

async function completeBackendReset() {
    userContacts = [];
    userTasks = [];
    users = [];

    await setItem('tasks', tasks);
    await setItem('contacts', contacts);
    await setItem('users', users);

    await setItem('users', { "id": 0, "firstName": "Guest", "eMail": "guest@test.de", "password": "" });
    //await setItem('tasks', [{"taskId": 1, "task": "inprogress", "autor": 0, "title": "Kochwelt Page & Recipe Recommander", "description": "Build start page with recipe recommendation.", "assigned_to": [], "date": "2023-05-10", "prio": "medium", "category": "User Story", "subtasks": [{"task": "Implement Recipe Recommendation", "done": true}, {"task": "Start Page Layout", "done": false}]}]);
    //await setItem('contacts', [{"id": 0, "firstName": "Benedikt", "lastName": "Ziegler", "eMail": "benedikt@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#9747FF"}, {"id": 1, "firstName": "David", "lastName": "Eisenberg", "eMail": "davidberg@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#1FD7C1"}, {"id": 2, "firstName": "Eva", "lastName": "Fischer", "eMail": "eva@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#6E52FF"}, {"id": 3, "firstName": "Emmanuel", "lastName": "Mauer", "eMail": "emmanuelma@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#9747FF"}, {"id": 4, "firstName": "Marcel", "lastName": "Bauer", "eMail": "bauer@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#FF4646"}, {"id": 5, "firstName": "Tanja", "lastName": "Wolf", "eMail": "wolf@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#FF4646"}, {"id": 6, "firstName": "Anton", "lastName": "Mayer", "eMail": "antonm@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#00BEE8"}, {"id": 7, "firstName": "Anja", "lastName": "Schulz", "eMail": "schulz@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#6E52FF"}]);
}
    
