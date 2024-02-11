/**
 * Asynchronously includes HTML content into elements with the 'w3-include-html' attribute.
 */
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

/**
 * Executes the initial setup and event listeners after a delay of 500 milliseconds.
 */
function firstLoad() {
    includeHTML();
    setTimeout(function () {
        document.getElementById('content-login').classList.remove('d-none');
        document.getElementById('div-index-register').classList.remove('d-none');
        document.getElementById('footer').classList.remove('d-none');
        eventListeners();
    }, 500);
}

/**
 * Opens the sign-up form and hides the login form.
 */
function openSignUp() {
    document.getElementById('div-index-signup').classList.add('d-none');
    document.getElementById('content-login').classList.add('d-none');
    document.getElementById('content-register').classList.remove('d-none');
}

/**
 * Closes the sign-up form and shows the login content.
 *
 */
function closeSignUp() {
    document.getElementById('div-index-signup').classList.remove('d-none');
    document.getElementById('content-login').classList.remove('d-none');
    document.getElementById('content-register').classList.add('d-none');
    clearRegistration();
}

/**
 * Opens the specified site by updating the window location to the provided site URL appended with '.html'.
 *
 * @param {string} site - The URL of the site to be opened.
 */
function openSite(site) {
    window.location.href = site + '.html';
}

/**
 * Asynchronously loads users from storage and populates the users array with the parsed JSON data.
 */
async function loadUsers() {
    users = [];
    usersFromBackend = [];
    usersFromBackend = JSON.parse(await getItem('users'));
    usersFromBackend.forEach(e => {
        let loadUser = new User();
        loadUser.id = e.id;
        loadUser.firstName = e.firstName;
        loadUser.lastName = e.lastName;
        loadUser.eMail = e.eMail;
        loadUser.password = e.password;
        loadUser.inizials = e.inizials;
        users.push(loadUser);
    });
    usersFromBackend = [];
}

/**
 * Asynchronous function to check if a user is logged in.
 *
 * @return {boolean} true if the user is logged in, false otherwise
 */
async function checkLoggedIn() {
    if (loggedInUser) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * Asynchronously creates a new task by gathering input from the user interface, constructing a Task object, and saving it to the backend. 
 */
async function createNewTask() {
    let newTask = new Task;
    if (selected == null) {
        selected = 'medium';
    }
    let urlParam = new URLSearchParams(window.location.search);
    (urlParam.get('cat')) ? task = urlParam.get('cat') : null;
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

/**
 * Clear all input fields for the add tasks and reset variables.
 */
function clearInputFields() {
    addSubtask = [];
    addAssignedTo = [];
    userContacts = [];
    toggleShowAssignedTo = false;
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').value = '';
    document.getElementById('addTaskAssignedTo').innerHTML = `
    <div class="addTaskAssignedToSelectDefault" id="addTaskAssignedToSelectDefault"
    onclick="openContactsAssignedTo()">Select contacts to assign</div>`;
    document.getElementById('contactsAssignedTo').classList.add('d-none');
    document.getElementById('addTaskAssignedTo').classList.remove('mb-0');
    document.getElementById('category').value = '';
    document.getElementById('subtasks').value = '';
    document.getElementById('showSubtasks').innerHTML = '';
    if (selected != 'medium') { choosePrio('medium') };
}

/**
 * Sets the amounts of different task statuses and priorities based on the userTasks array.
 */
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

/**
 * Function to choose priority and perform corresponding actions.
 *
 * @param {string} prio - the priority to choose
 *@param {boolean} edit - Indicates if the element is in edit mode
 */
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

/**
 * Removes the selection styling from the specified element.
 *
 * @param {string} selected - The ID of the selected element
 * @param {boolean} edit - Indicates if the element is in edit mode
 */
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


/**
 * Function to add selection to a priority element.
 *
 * @param {string} prio - The priority 
 * @param {boolean} edit - Indicates if the element is in edit mode
 */
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

/**
 * Change subtasks and add image functionality.
 */
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

/**
 * Show subtasks in the specified container and allow editing if specified.
 *
 * @param {boolean} edit - Indicates if the element is in edit mode
 */
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

/**
 * Function to add contacts to the assigned section.
 *
 * @param {boolean} edit - Indicates if the element is in edit mode
 * @param {number} taskArrayPosition - The position of the task in the array.
 */
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
            contactCBackgroundColor(i, edit);
        }
        document.getElementById('assignedToContactsListInizials' + i).style.backgroundColor = userContacts[i].color;
    }
}
/**
 * Set up event listeners for password input fields and call the changeLockIcon function.
 */
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
    document.getElementById('passIcon').addEventListener('click', function () {
        changeLockIconOnClick('pass');
    });
    document.getElementById('passwrdIcon').addEventListener('click', function () {
        changeLockIconOnClick('passwrd');
    });
    document.getElementById('passwrdConfIcon').addEventListener('click', function () {
        changeLockIconOnClick('passwrdConf');
    });
}

function changeLockIconOnClick(iconTarget) {
    let imagePath = new URL(new URL(document.getElementById(iconTarget + 'Icon').src)).pathname.split('/');
    if (imagePath[imagePath.length - 1] == 'visibility_off.png') {
        document.getElementById(iconTarget + 'Icon').src = 'assets/icons/visibility.png';
        document.getElementById(iconTarget).type = "text";
    }
    else {
        document.getElementById(iconTarget + 'Icon').src = 'assets/icons/visibility_off.png';
        document.getElementById(iconTarget).type = "password";
    }
}

/**
 * Function to change the lock icon based on the value of the input field and toggle the visibility of the text in the input field.
 *
 * @param {string} iconTarget - the ID of the input field
 */
function changeLockIcon(iconTarget) {
    if (document.getElementById(iconTarget).value != "") {
        document.getElementById(iconTarget + 'Icon').src = 'assets/icons/visibility_off.png';
        document.getElementById(iconTarget + 'Icon').classList.add('cursor-pointer');
        // document.getElementById(iconTarget + 'Icon').addEventListener('click', function () {
        //     let imagePath = new URL(new URL(document.getElementById(iconTarget + 'Icon').src)).pathname.split('/');
        //     if (imagePath[imagePath.length - 1] == 'visibility_off.png') {
        //         document.getElementById(iconTarget + 'Icon').src = 'assets/icons/visibility.png';
        //         document.getElementById(iconTarget).type = "text";
        //     }
        //     else {
        //         document.getElementById(iconTarget + 'Icon').src = 'assets/icons/visibility_off.png';
        //         document.getElementById(iconTarget).type = "password";
        //     }
        // });
    }
    else {
        document.getElementById(iconTarget + 'Icon').src = 'assets/icons/lock.png';
        document.getElementById(iconTarget + 'Icon').classList.remove('cursor-pointer');
    }
}

/**
 * Function to toggle between editing and saving a subtask in an array.
 *
 * @param {number} arrayPosition - the position of the subtask in the array
 */
function toggleEditSaveFunction(arrayPosition) {
    if (!isEditing) {
        editSubtask(arrayPosition);
        isEditing = true;
    }
    else {
        saveEditedSubtask(arrayPosition);
        isEditing = false;
    }
}

/**
 * Edit a subtask element in the array position.
 *
 * @param {number} arrayPosition - the position of the subtask in the array
 */
function editSubtask(arrayPosition) {
    let liElement = document.getElementById('subtask-' + arrayPosition);
    let inputElement = document.createElement("input");
    inputElement.classList.add('input-edit-subtask');
    inputElement.id = 'input-edit-subtask';
    inputElement.value = liElement.innerHTML;
    liElement.replaceWith(inputElement);
    document.getElementById('subtask-unterlinde' + arrayPosition).classList.add('subtask-edit-underline');
    document.getElementById('editSubtaskIcon-' + arrayPosition).src = 'assets/icons/check_blue.png';
}

/**
 * Saves the edited subtask at the specified array position.
 *
 * @param {number} arrayPosition - The position of the subtask in the array
 */
function saveEditedSubtask(arrayPosition) {
    let liElement = document.createElement("li");
    let inputElement = document.getElementById('input-edit-subtask');
    liElement.id = 'subtask-' + arrayPosition;
    liElement.innerHTML = inputElement.value;
    inputElement.replaceWith(liElement);
    document.getElementById('subtask-unterlinde' + arrayPosition).classList.remove('subtask-edit-underline');
    document.getElementById('editSubtaskIcon-' + arrayPosition).src = 'assets/icons/edit.png';
    addSubtask[arrayPosition].task = inputElement.value;
}

/**
 * Function to open and display the privacy police an the legal notice and renderts its content in the target container.
 *
 * @param {string} term - the side to be opened
 */
function openTerm(term) {
    let targetContainer = document.getElementById('flex-content-main');
    targetContainer.innerHTML = '';
    if (getDestinationSite() == 'contacts.html') {
        document.getElementById('div-contacts').remove();
    }
    targetContainer.classList.add('pr-96');
    targetContainer.classList.add('pb-32px');
    fetch('assets/templates/' + term + '.html')
        .then(response => {
            return response.text();
        })
        .then(html => {
            targetContainer.innerHTML += html;
        })
        .then(() => {
            document.getElementById('backIconTerms').onclick = closeTerm;
        });
}

/**
 * Closes the current window and redirects to the destination site.
 *
 * @return {string} The URL of the destination site.
 */
function closeTerm() {
    window.location.href = getDestinationSite();
}

/**
 * Retrieves the destination site from the current URL.
 *
 * @return {string} The destination site extracted from the URL.
 */
function getDestinationSite() {
    let url = window.location.href;
    var parts = url.split('/');
    return parts[parts.length - 1];
}

/**
 * Reset the backend by clearing user contacts, tasks, and users, and then setting predefined items for tasks, contacts, and users.
 */
async function completeBackendReset() {
    userContacts = [];
    userTasks = [];
    users = [];

    await setItem('tasks', tasks);
    await setItem('contacts', userContacts);
    await setItem('users', users);

    await setItem('users', [{ "id": 0, "firstName": "Guest", "eMail": "guest@test.de", "password": "", "lastName": "", "inizials": "G" }]);
    await setItem('tasks', [{"taskId": 1, "task": "inprogress", "autor": 0, "title": "Kochwelt Page & Recipe Recommander", "description": "Build start page with recipe recommendation.", "assigned_to": [], "date": "2023-05-10", "prio": "medium", "category": "User Story", "subtasks": [{"task": "Implement Recipe Recommendation", "done": true}, {"task": "Start Page Layout", "done": false}]}, {"taskId": 2, "task": "todo", "autor": 0, "title": "Contact Form & Imprint", "description": "Create a contact form and imprint page", "assigned_to": [{"id": 7, "firstName": "Anja", "lastName": "Schulz", "eMail": "schulz@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#6E52FF", "inizials": "AS", "assign": true}, {"id": 1, "firstName": "David", "lastName": "Eisenberg", "eMail": "davidberg@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#1FD7C1", "inizials": "DE", "assign": true}, {"id": 2, "firstName": "Eva", "lastName": "Fischer", "eMail": "eva@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#6E52FF", "inizials": "EF", "assign": true}], "date": "2024-02-14", "prio": "urgent", "category": "User Story", "subtasks": []}, {"taskId": 3, "task": "awaitfeedback", "autor": 0, "title": "HTML Base Template Creation", "description": "Create reusable HTML base templates", "assigned_to": [{"id": 1, "firstName": "David", "lastName": "Eisenberg", "eMail": "davidberg@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#1FD7C1", "inizials": "DE", "assign": true}, {"id": 0, "firstName": "Benedikt", "lastName": "Ziegler", "eMail": "benedikt@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#9747FF", "inizials": "BZ", "assign": true}, {"id": 7, "firstName": "Anja", "lastName": "Schulz", "eMail": "schulz@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#6E52FF", "inizials": "AS", "assign": true}], "date": "2024-02-29", "prio": "low", "category": "Technical Task", "subtasks": []}, {"taskId": 4, "task": "awaitfeedback", "autor": 0, "title": "Daily Kochwelt Recipe", "description": "Implement daily recipe and potrion calculator", "assigned_to": [{"id": 2, "firstName": "Eva", "lastName": "Fischer", "eMail": "eva@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#6E52FF", "inizials": "EF", "assign": true}, {"id": 7, "firstName": "Anja", "lastName": "Schulz", "eMail": "schulz@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#6E52FF", "inizials": "AS", "assign": true}, {"id": 5, "firstName": "Tanja", "lastName": "Wolf", "eMail": "wolf@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#FF4646", "inizials": "TW", "assign": true}], "date": "2024-02-15", "prio": "medium", "category": "User Story", "subtasks": []}, {"taskId": 5, "task": "done", "autor": 0, "title": "CSS Architecture Planning", "description": "Define CSS naming conventions and structure", "assigned_to": [{"id": 0, "firstName": "Benedikt", "lastName": "Ziegler", "eMail": "benedikt@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#9747FF", "inizials": "BZ", "assign": true}], "date": "2024-02-27", "prio": "urgent", "category": "Technical Task", "subtasks": []}]);
    await setItem('contacts', [{ "id": 0, "firstName": "Benedikt", "lastName": "Ziegler", "eMail": "benedikt@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#9747FF", "inizials": "BZ" }, { "id": 1, "firstName": "David", "lastName": "Eisenberg", "eMail": "davidberg@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#1FD7C1", "inizials": "DE" }, { "id": 2, "firstName": "Eva", "lastName": "Fischer", "eMail": "eva@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#6E52FF", "inizials": "EF" }, { "id": 3, "firstName": "Emmanuel", "lastName": "Mauer", "eMail": "emmanuelma@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#9747FF", "inizials": "EM" }, { "id": 4, "firstName": "Marcel", "lastName": "Bauer", "eMail": "bauer@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#FF4646", "inizials": "MB" }, { "id": 5, "firstName": "Tanja", "lastName": "Wolf", "eMail": "wolf@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#FF4646", "inizials": "TW" }, { "id": 6, "firstName": "Anton", "lastName": "Mayer", "eMail": "antonm@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#00BEE8", "inizials": "AM" }, { "id": 7, "firstName": "Anja", "lastName": "Schulz", "eMail": "schulz@gmail.com", "phone": "1234", "assignedTo": 0, "color": "#6E52FF", "inizials": "AS" }]);
}