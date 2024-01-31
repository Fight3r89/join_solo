async function init() {
    await getUserDataFromLocalStorage();
    if (await checkLoggedIn()) {
        await includeHTML();
        navChangeColor();
        addSelection(selected);
        changeSubtasksAddImage();
        renderUserMenueInizials();
    }
    else {
        location.href = 'index.html';
    }
}

function navChangeColor() {
    document.getElementById('nav-addtask').classList.add('link-active');
    document.getElementById('mobile-nav-addtask').classList.add('link-active');
    document.getElementById('nav-addtask').onclick = null;
    document.getElementById('mobile-nav-addtask').onclick = null;
}

/*function subtaskInputDelete() {
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

}*/