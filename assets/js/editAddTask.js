/**
 * Opens the contacts assigned to the specified task for editing or viewing, and toggles the visibility of the input field.
 *
 * @param {boolean} edit - Indicates if the element is in edit mode
 * @param {number} taskArrayPosition - The position of the task in the array.
 */
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

document.addEventListener('click',(event) => {
    if (!document.getElementById('contactsAssignedTo').contains(event.target) && !document.getElementById('addTaskAssignedToSelectDefault').contains(event.target) && toggleShowAssignedTo == true) {
        console.log("test");
        openContactsAssignedTo();
    }
});

/**
 * Function to select a contact for assignment.
 *
 * @param {number} i - The index of the contact
 * @param {boolean} edit - Indicates if the element is in edit mode
 */
function selectContactForAssign(i, edit) {
    let addon = '';
    if (edit) {
        addon = 'edit';
    }
    let path = document.getElementById(addon + 'checkbox' + i).src;
    let imagePath = new URL(path).pathname.split('/');
    imagePath.shift();
    if (imagePath[imagePath.length - 1] == 'check_box.png') {
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

/**
 * This function changes the assigned contacts.
 *
 * @param {number} i - index of the contact
 * @param {boolean} edit - Indicates if the element is in edit mode
 */
function changeAssignToContacts(i, edit) {
    contactCBackgroundColor(i, edit);
    changeDefaultAssignedTo(edit);
}

/**
 * Adds contacts to the assignedToArray at the specified position in the array.
 *
 * @param {number} arrayPosition - The position in the user in the userContacts array
 */
function addContactsToAssignedToArray(arrayPosition) {
    addAssignedTo.push(userContacts[arrayPosition]);
}

/**
 * Deletes contacts from the addAssignedTo array based on the provided userId.
 *
 * @param {number} userId - The id of the user whose contacts need to be deleted
 */
function deleteContactsToAssignedToArray(userId) {
    for (let i = 0; i < addAssignedTo.length; i++) {
        if (addAssignedTo[i].id == userId) {
            addAssignedTo.splice(i, 1);
        }
    }
}

/**
 * Function to toggle the background color of a contact item based on the provided index and edit mode.
 *
 * @param {number} i - The index of the contact
 * @param {boolean} edit - Indicates if the element is in edit mode
 */
function contactCBackgroundColor(i, edit) {
    let addon = '';
    if (edit) {
        addon = 'edit';
    }
    if (document.getElementById(addon + 'contact' + i).classList.contains('contactSelected')) {
        document.getElementById(addon + 'contact' + i).classList.remove('contactSelected');
        document.getElementById(addon + 'checkbox' + i).src = 'assets/icons/check_box.png';

    }
    else {
        document.getElementById(addon + 'contact' + i).classList.add('contactSelected');
        document.getElementById(addon + 'checkbox' + i).src = 'assets/icons/check_box_checked.png';
    }
}

/**
 * Function to change the default assigned person for a task edit or addition.
 *
 * @param {boolean} edit - Indicates if the element is in edit mode
 */
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
        container.innerHTML = '<span>Select contacts to assign</span><img src="assets/icons/arrow_drop_down.png" alt="">';
    }
}

/**
 * Deletes a subtask from the specified position in the array and then shows the updated subtasks.
 *
 * @param {number} arrayPosition - The position of the subtask in the array to be deleted
 *@param {boolean} edit - Indicates if the element is in edit mode
 */
function deleteSubtask(arrayPosition, edit) {
    addSubtask.splice([arrayPosition], 1);
    showSubtasks(edit);
}

/**
 * Deletes the input for a subtask, and shows the add button in the specified container.
 *
 * @param {boolean} edit - Indicates if the element is in edit mode
 */
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

/**
 * Adds a subtask to an array based on the edit parameter, updates the DOM, and clears the input field.
 *
 * @param {boolean} edit - Indicates if the element is in edit mode
 */
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

/**
 * Renders the user menu initials in the header.
 */
function renderUserMenueInizials() {
    document.getElementById('header-user-menu').innerHTML = loggedInUser.inizials;
}

/**
 * Function to open the user menu by toggling the visibility of the dropdown element.
 *
 */
function openUserMenue() {
    document.getElementById('header-user-menu-dropdown').classList.toggle('d-none');
}

/**
 * Logs out the user by removing user data from session storage and redirecting to the index page.
 *
 */
function logout() {
    sessionStorage.removeItem('user');
    window.location.href = 'index.html';
}

/**
 * Generate a random color from the color array.
 *
 * @return {string} The randomly selected color from the color array.
 */
function generateColor() {
    return colors[colorArrayPosition = Math.floor(Math.random() * 10)];
}

/**
 * Function to set the minimum date for the element with id 'date' to the current date.
 */
function getMinDate() {
    document.getElementById('date').min = new Date().toISOString().split('T')[0];
}