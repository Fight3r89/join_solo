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
        eventListeners();
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
    users = [];
    users = JSON.parse(await getItem('users'));
    console.log(users);
    users.forEach(e => {
        let loadUser = new User();
        loadUser.id = e.id;
        loadUser.firstName = e.firstName;
        loadUser.lastName = e.lastName;
        loadUser.eMail = e.eMail;
        loadUser.password = e.password;
        loadUser.inizials = e.inizials;
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
    if(selected == null){
        selected = 'medium';
    }
    console.log(selected);
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
    addSubtask = [];
    addAssignedTo = [];
    userContacts = [];
    toggleShowAssignedTo = false;
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').value = '';
    document.getElementById('addTaskAsignedTo').innerHTML = `
    <div class="addTaskAssignedToSelectDefault" id="addTaskAssignedToSelectDefault"
    onclick="openContactsAssignedTo()">Select contacts to assign</div>`;
    document.getElementById('contactsAssignedTo').classList.add('d-none');
    document.getElementById('addTaskAsignedTo').classList.remove('mb-0');
    document.getElementById('category').value = '';
    document.getElementById('subtasks').value = '';
    document.getElementById('showSubtasks').innerHTML = '';
    if(selected != 'medium'){choosePrio('medium')};  
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
        <div id="subtask-unterlinde${i}" class="subtasks-hover">
            <li id="subtask-${i}">${ast.task}</li>
            <div style="display:flex; gap:8px">
                <img src="assets/icons/delete.png" onclick="deleteSubtask(${i}, ${edit})">
                <div style="width: 1px; background: #d1d1d1;">
                </div>
                <img id="editSubtaskIcon-${i}" src="assets/icons/edit.png" onclick="toggleEditSaveFunction(${i}, ${edit})">
            </div>
        </div>`;
    });
}

async function addContactsToAssignedTo(edit, taskArrayPosition) {
    let container;
    let addon = '';
    if (edit) {
        container = document.getElementById('editContactsAssignedTo');
        addon = 'edit';
    }
    else {
        container = document.getElementById('contactsAssignedTo');
    }
    if (userContacts.length == 0) {
        await loadUsersContacts();
        if (userContacts.length == 0) container.innerHTML += 'No Contacts Available';
    }
    for (let i = 0; i < userContacts.length; i++) {
        if (!userContacts[i].assign) {
            userContacts[i].assign = false;
        }
        if (edit) {
            userTasks[taskArrayPosition].assigned_to.forEach(element => {
                if (element.id == userContacts[i].id) userContacts[i].assign = true;
            });
        }
        container.innerHTML += `
        <div class="assignedToContactsListItemContainer" id="${addon}contact${i}" onclick="selectContactForAssign(${i},${edit})">
            <div class="assignedToContactsListItemContainerLeft">
                <div class="assignedToContactsListInizials" id="assignedToContactsListInizials${i}">
                ${userContacts[i].inizials}
                </div>
                ${userContacts[i].firstName} ${userContacts[i].lastName}
            </div>
            <img id="${addon}checkbox${i}" src="assets/icons/check_box.png">
        </div>`;
        if (userContacts[i].assign) {
            contactCBackgroundColor(i,edit);
        }
        document.getElementById('assignedToContactsListInizials' + i).style.backgroundColor = userContacts[i].color;
    }
}

async function openContactsAssignedTo(edit, taskArrayPosition) {
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
        await addContactsToAssignedTo(edit, taskArrayPosition);
        inputAssignedTo.classList.remove('d-none');
    } else {
        inputAssignedTo.classList.add('d-none');
    }
    toggleShowAssignedTo = !toggleShowAssignedTo;
}

function selectContactForAssign(i, edit) {
    let addon = '';
    if(edit){
        addon = 'edit';
    }
    let path = document.getElementById(addon+'checkbox' + i).src;
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

function contactCBackgroundColor(i,edit) {
    let addon = '';
    if(edit){
        addon = 'edit';
    }
    if (document.getElementById(addon+'contact' + i).classList.contains('contactSelected')) {
        document.getElementById(addon+'contact' + i).classList.remove('contactSelected');
        document.getElementById(addon+'checkbox' + i).src = 'assets/icons/check_box.png';

    }
    else {
        document.getElementById(addon+'contact' + i).classList.add('contactSelected');
        document.getElementById(addon+'checkbox' + i).src = 'assets/icons/check_box_checked.png';
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
    document.getElementById('header-user-menu').innerHTML = loggedInUser.inizials;
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

function getMinDate() {
    document.getElementById('date').min = new Date().toISOString().split('T')[0];
}

function eventListeners() {
    document.getElementById('passwrd').addEventListener('input', function () {
        changeLockIcon('passwrd');
        
    });
    document.getElementById('passwrdConf').addEventListener('input', function () {
        changeLockIcon('passwrdConf');
    });
    document.getElementById('pass').addEventListener('input', function () {
        changeLockIcon('pass');
    });
}

function changeLockIcon(iconTarget){
    if(document.getElementById(iconTarget).value != "") {
        document.getElementById(iconTarget+'Icon').src = 'assets/icons/visibility_off.png';
        document.getElementById(iconTarget+'Icon').classList.add('cursor-pointer');
        document.getElementById(iconTarget+'Icon').addEventListener('click', function(){
            if(new URL(document.getElementById(iconTarget+'Icon').src).pathname == '/assets/icons/visibility_off.png'){
                document.getElementById(iconTarget+'Icon').src = 'assets/icons/visibility.png';
                document.getElementById(iconTarget).type = "text";
            }
            else{
                document.getElementById(iconTarget+'Icon').src = 'assets/icons/visibility_off.png';
                document.getElementById(iconTarget).type = "password";
            }
        });
    }
    else{
        document.getElementById(iconTarget+'Icon').src = 'assets/icons/lock.png';
        document.getElementById(iconTarget+'Icon').classList.remove('cursor-pointer');
    }
}

function toggleEditSaveFunction(arrayPosition){
    if(!isEditing){
        editSubtask(arrayPosition);
        isEditing = true;
    }
    else{
        saveEditedSubtask(arrayPosition);
        isEditing = false;
    }
}

function editSubtask(arrayPosition) {
    let liElement = document.getElementById('subtask-'+arrayPosition);
    let inputElement = document.createElement("input");
    inputElement.classList.add('input-edit-subtask');
    inputElement.id = 'input-edit-subtask';
    inputElement.value = liElement.innerHTML;
    liElement.replaceWith(inputElement);
    document.getElementById('subtask-unterlinde'+arrayPosition).classList.add('subtask-edit-underline');
    document.getElementById('editSubtaskIcon-'+arrayPosition).src = 'assets/icons/check_blue.png';    
}

function saveEditedSubtask(arrayPosition) {
    let liElement = document.createElement("li");
    let inputElement = document.getElementById('input-edit-subtask');
    liElement.id = 'subtask-'+arrayPosition;
    liElement.innerHTML = inputElement.value;
    inputElement.replaceWith(liElement);
    document.getElementById('subtask-unterlinde'+arrayPosition).classList.remove('subtask-edit-underline');
    document.getElementById('editSubtaskIcon-'+arrayPosition).src = 'assets/icons/edit.png';
    addSubtask[arrayPosition].task = inputElement.value;
}

function openTerm(term){
    let targetContainer = document.getElementById('flex-content-main'); 
    targetContainer.innerHTML = '';
    if(getDestinationSite() == 'contacts.html'){
        document.getElementById('div-contacts').remove();
    }  
    targetContainer.classList.add('pr-96');
    fetch('assets/templates/'+term+'.html')
        .then (response => {
            return response.text();
        })
        .then (html =>{
            targetContainer.innerHTML += html;
        })
        .then(() => {
            document.getElementById('backIconTerms').onclick = closeTerm;
        });
}

function closeTerm(){
    let targetContainer = document.getElementById('flex-content-main');
    window.location.href = getDestinationSite();
}

function getDestinationSite(){
    let url = window.location.href;
    var parts = url.split('/');
    return parts[parts.length - 1]; 
}

async function completeBackendReset() {
    userContacts = [];
    userTasks = [];
    users = [];

    await setItem('tasks', tasks);
    await setItem('contacts', userContacts);
    await setItem('users', users);

    await setItem('users', [{ "id": 0, "firstName": "Guest", "eMail": "guest@test.de", "password": "", "lastName": "", "inizials": "G" }]);
    await setItem('tasks', [{"taskId": 1, "task": "inprogress", "autor": 0, "title": "Kochwelt Page & Recipe Recommander", "description": "Build start page with recipe recommendation.", "assigned_to": [], "date": "2023-05-10", "prio": "medium", "category": "User Story", "subtasks": [{"task": "Implement Recipe Recommendation", "done": true}, {"task": "Start Page Layout", "done": false}]}]);
    await setItem('contacts', [{"id": 0, "firstName": "Benedikt", "lastName": "Ziegler", "eMail": "benedikt@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#9747FF", "inizials": "BZ"}, {"id": 1, "firstName": "David", "lastName": "Eisenberg", "eMail": "davidberg@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#1FD7C1", "inizials": "DE"}, {"id": 2, "firstName": "Eva", "lastName": "Fischer", "eMail": "eva@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#6E52FF", "inizials": "EF"}, {"id": 3, "firstName": "Emmanuel", "lastName": "Mauer", "eMail": "emmanuelma@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#9747FF", "inizials": "EM"}, {"id": 4, "firstName": "Marcel", "lastName": "Bauer", "eMail": "bauer@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#FF4646", "inizials": "MB"}, {"id": 5, "firstName": "Tanja", "lastName": "Wolf", "eMail": "wolf@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#FF4646", "inizials": "TW"}, {"id": 6, "firstName": "Anton", "lastName": "Mayer", "eMail": "antonm@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#00BEE8", "inizials": "AM"}, {"id": 7, "firstName": "Anja", "lastName": "Schulz", "eMail": "schulz@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#6E52FF", "inizials": "AS"}]);
}