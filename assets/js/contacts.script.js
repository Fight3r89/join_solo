let toggleSingleContact = 0;
let currentSelectedUser;

async function init() {
    await getUserDataFromSessionStorage();
    if (await checkLoggedIn()) {
        await includeHTML();
        navChangeColor();
        await loadUsersContacts();
        renderContactHtml();
        renderUserMenueInizials();
    }
    else {
        location.href = 'index.html';
    }
}

/**
 * Function to change the color and behavior of the navigation links.
 */
function navChangeColor() {
    document.getElementById('nav-contacts').classList.add('link-active');
    document.getElementById('nav-contacts').onclick = null;
    document.getElementById('mobile-nav-contacts').classList.add('link-active');
    document.getElementById('mobile-nav-contacts').onclick = null;
}

/**
 * Function to slide in a container and perform add or edit operations on a user's contact.
 *
 * @param {string} container - the container to slide in
 * @param {string} addOrEdit - specifies whether to add or edit the user contact
 * @param {string} userToEdit - the user to edit
 */
function slideIn(container, addOrEdit, userToEdit) {
    clearInputFields();
    document.getElementById(container + '-container').classList.remove('d-none');
    document.getElementById(container).style.right = '0';
    document.getElementById(container).style.animation = 'slide_in 0.3s ease-out';
    if (addOrEdit == 'edit') {
        document.getElementById('contact-add-edit-img').innerHTML = `
        <div class="contact-edit-inizials" style="background-color: ${userContacts[userToEdit].color}">
        ${userContacts[userToEdit].inizials}
        </div>`;
        document.getElementById('contact_action').value = userToEdit;
        document.getElementById('contact-add-edit-title').innerHTML = `
         <p class="title-edit-add">Edit Contact</p>
         <div class="seperator-vertical"></div>`;
        document.getElementById('contact_name').value = userContacts[userToEdit].firstName + ' ' + userContacts[userToEdit].lastName;
        document.getElementById('contact_email').value = userContacts[userToEdit].eMail;
        document.getElementById('contact_phone').value = userContacts[userToEdit].phone;
        document.getElementById('div-contacts-add-form').innerHTML = `
        <div class="button-bordered" onclick="deleteContact(${userContacts[userToEdit].id})">Delete<img src="assets/icons/close.png"></div>
        <button class="btn-save-contact">Save<img src="assets/icons/check.png"></button>`;
    }
    else {
        document.getElementById('contact-add-edit-img').innerHTML = '<img src="./assets/icons/contacts-default.png">';
        document.getElementById('contact_action').value = 'add';
        document.getElementById('contact-add-edit-title').innerHTML = `
            <p class="title-edit-add">Add contact</p>
            <p class="title-sub">Tasks are better with a team</p>
            <div class="seperator-vertical"></div>`;
        document.getElementById('div-contacts-add-form').innerHTML = `
            <div class="button-bordered" onclick="clearInputFields()">Clear<img src="assets/icons/close.png"></div>
            <button>Create contact<img src="assets/icons/check.png"></button>`;
    }
}

/**
 * Clears the input fields for contact name, email, and phone, as well as the title, contact form, and image elements.
 *
 */
function clearInputFields() {
    document.getElementById('contact_name').value = '';
    document.getElementById('contact_email').value = '';
    document.getElementById('contact_phone').value = '';
    document.getElementById('contact-add-edit-title').innerHTML = '';
    document.getElementById('div-contacts-add-form').innerHTML = '';
    document.getElementById('contact-add-edit-img').innerHTML = '';
}

/**
 * Slides out the specified container element.
 *
 * @param {string} container - The id of the container element to slide out
 */
function slideOut(container) {
    document.getElementById(container).style.animation = 'slide_out 0.3s ease-out';
    setTimeout(function () {
        document.getElementById(container + '-container').classList.add('d-none');
        document.getElementById(container).style.right = '-150%';
    }, 280);
}

/**
 * Asynchronously adds a new contact using the input values from the document elements.
 */
async function addContact() {
    let nameInput = document.getElementById('contact_name').value.split(" ");
    let contact = new Contact;
    let firstName = nameInput[0];
    let lastName;
    let inizials = nameInput[0][0] + nameInput[nameInput.length - 1][0];
    (nameInput.length > 1) ? lastName = nameInput[nameInput.length - 1] : lastName = '';

    contact.firstName = firstName;
    contact.lastName = lastName;
    contact.eMail = document.getElementById('contact_email').value;
    contact.phone = document.getElementById('contact_phone').value;
    contact.assignedTo = loggedInUser.id;
    contact.color = generateColor();
    contact.inizials = inizials;
    await createContactToSave(contact);
    clearInputFields();
    slideOut('contacts-add-card');
    await loadUsersContacts();
    renderContactHtml();
}

/**
 * Clears the input fields for contact name, email, and phone.
 */
function clearInputFields() {
    document.getElementById('contact_name').value = '';
    document.getElementById('contact_email').value = '';
    document.getElementById('contact_phone').value = '';
}

/**
 * Renders the contact list in the HTML by clearing the existing list, sorting the contacts, 
 * displaying the sorted headline, and rendering the contacts in HTML cards.
 *
 */
function renderContactHtml() {
    clearContactList();
    sortContacts();
    ContactsSortHeadline();
    renderContactsHtmlCard();
}

/**
 * Clears the contact list by setting the inner HTML of the 'div-contacts-list' element to an empty string.
 */
function clearContactList() {
    document.getElementById('div-contacts-list').innerHTML = '';
}

/**
 * Renders the HTML cards for each contact in the userContacts array.
 */
function renderContactsHtmlCard() {
    for (let i = 0; i < userContacts.length; i++) {
        document.getElementById('contactFirstLetter' + userContacts[i].firstName[0].toUpperCase()).innerHTML += `
        <div id="contact${i}" class="div-contacts-list-card" onclick="openSingleContact('single-contact', ${i})">
            <div class="div-contacts-list-logo" style="background-color: ${userContacts[i].color}">${userContacts[i].inizials}</div>
            <div class="div-contacts-list-data">
                <p>${userContacts[i].firstName} ${userContacts[i].lastName}</p>
                <p>${userContacts[i].eMail}</p>
            </div>
        </div>`;
    };

}

/**
 * Renders a single contact at the specified position in the array.
 *
 * @param {number} arrayPosotion - The position of the contact in the array
 */
async function renderSingleContact(arrayPosotion) {
    clearSingleContactContainer();
    renderSingleContactContainerHtml(arrayPosotion);
}

/**
 * Clears the content of the single contact container by setting the innerHTML of each element to an empty string.
 */
function clearSingleContactContainer() {
    document.getElementById('single-contact-logo').innerHTML = '';
    document.getElementById('single-contact-name').innerHTML = '';
    document.getElementById('single-contact-data-mail').innerHTML = '';
    document.getElementById('single-contact-data-phone').innerHTML = '';
}

/**
 * Renders the HTML for a single contact container based on the provided array position.
 *
 * @param {number} arrayPosition - The position of the contact in the array
 */
function renderSingleContactContainerHtml(arrayPosotion) {
    document.getElementById('single-contact-logo').innerHTML = userContacts[arrayPosotion].inizials;
    document.getElementById('single-contact-logo').style.backgroundColor = userContacts[arrayPosotion].color;
    document.getElementById('single-contact-name').innerHTML = userContacts[arrayPosotion].firstName + ' ' + userContacts[arrayPosotion].lastName;
    document.getElementById('single-contact-data-mail').innerHTML = userContacts[arrayPosotion].eMail;
    document.getElementById('single-contact-data-phone').innerHTML = userContacts[arrayPosotion].phone;
    document.getElementById('single-contact-name-edit').innerHTML = `
    <div class="single-contact-edit" id="single-contact-edit" onclick="editContact(${arrayPosotion});">
        <img src="assets/icons/edit.png"> Edit
    </div>
    <div class="single-contact-delete" onclick="deleteContact(${userContacts[arrayPosotion].id})">
        <img src="assets/icons/delete.png"> Delete
    </div>`;
}

/**
 * Opens a single contact and performs various actions such as removing a class, rendering a single contact, sliding in a target, and removing a class from an element.
 *
 * @param {type} target - the container to slide in
 * @param {type} arrayPosition - the position of the contact in the array
 */
async function openSingleContact(target, arrayPosotion) {
    
    if (document.getElementById('single-contact-test').classList.contains('d-none') || currentSelectedUser != arrayPosotion) {
        clearHighlight();
        await renderSingleContact(arrayPosotion);
        document.getElementById('div-contacts-main-placeholder').classList.add('d-none');
        document.getElementById('single-contact-test').classList.remove('d-none');
        document.getElementById('contact' + arrayPosotion).classList.add('div-contacts-list-active');
        slideIn(target);
        currentSelectedUser = arrayPosotion;
    }
    else{
        closeSingleContact();
        clearHighlight();
    }
}

function clearHighlight() {
    for (let i = 0; i < userContacts.length; i++) {
        document.getElementById('contact' + i).classList.remove('div-contacts-list-active');
    }
}

/**
 * Deletes a contact by the given contactId.
 *
 * @param {string} contactId - The id of the contact to be deleted
 */
async function deleteContact(contactId) {
    await loadContactsFromBackend();
    for (let i = 0; i < allContacts.length; i++) {
        if (allContacts[i].id == contactId) {
            allContacts.splice(i, 1);
        }
    }
    deleteUserTaskFromAssignTo(contactId);
    await saveContactsToBackend();
    allContacts = [];
    await loadUsersContacts();
    slideOut('single-contact');
    slideOut('contacts-add-card');
    renderContactHtml();
}

/**
 * Sorts the userContacts array of objects by the firstName property in ascending order.
 *
 * @param {function} a - The first element to compare
 * @param {function} b - The second element to compare
 * @return {number} - Returns -1, 0, or 1 based on the comparison of the firstName properties
 */
function sortContacts() {
    userContacts.sort(function (a, b) {
        let firstNameA = a.firstName.toLowerCase();
        let firstNameB = b.firstName.toLowerCase();
        if (firstNameA < firstNameB) return -1;
        if (firstNameA > firstNameB) return 1;
        return 0;
    });
}

/**
 * Sorts user contacts and renders the headlines based on the first letter of the first name.
 *
 * @param {array} userContacts - the array of user contacts
 */
function ContactsSortHeadline() {
    let currentLetter = '';
    for (let i = 0; i < userContacts.length; i++) {
        let firstLetter = userContacts[i].firstName.charAt(0).toUpperCase();

        if (firstLetter !== currentLetter) {
            renderContactsSortHeadlineHtml(firstLetter);
            currentLetter = firstLetter;
        }
    }
}

/**
 * Renders the HTML for the contacts list headline based on the first letter.
 *
 * @param {string} firstLetter - The first letter of the contacts list.
 */
function renderContactsSortHeadlineHtml(firstLetter) {
    document.getElementById('div-contacts-list').innerHTML += `
    <div class="div contacts-list-letter">
        ${firstLetter}
    </div>
    <div class="seperator-contacts-list"></div>
    <div id="contactFirstLetter${firstLetter}"></div>`;
}

/**
 * Edit a contact for the user.
 *
 * @param {type} userToEdit - the id of the user to be edited
 * @return {type} 
 */
function editContact(userToEdit) {
    slideIn('contacts-add-card', 'edit', userToEdit);
}

/**
 * Handles the submission of the form, updating the user's contacts based on the action selected.
 */
function handleFormSubmission() {
    if (document.getElementById('contact_action').value == 'add') {
        addContact();
    }
    else {
        let contactArrayPosition = document.getElementById('contact_action').value;
        let firstName;
        let lastName;

        if (document.getElementById('contact_name').value.split(" ").length > 1) {
            firstName = document.getElementById('contact_name').value.split(" ")[0];
            lastName = document.getElementById('contact_name').value.split(" ")[1];
        }
        else {
            firstName = document.getElementById('contact_name').value[0];
            lastName = '';
        }
        userContacts[contactArrayPosition].firstName = firstName;
        userContacts[contactArrayPosition].lastName = lastName;
        userContacts[contactArrayPosition].eMail = document.getElementById('contact_email').value;
        userContacts[contactArrayPosition].phone = document.getElementById('contact_phone').value;
        saveContactEdit(document.getElementById('contact_action').value);
    }
}

/**
 * Save the contact edit at the specified position in the contact array.
 *
 * @param {number} contactArrayPosition - The position of the contact in the array
 */
async function saveContactEdit(contactArrayPosition) {
    await loadContactsFromBackend();
    allContacts.forEach(function (ac, i) {
        if (ac.id == userContacts[contactArrayPosition].id) {
            allContacts.splice(i, 1, userContacts[contactArrayPosition])
        }
    });
    await saveContactsToBackend();
    await loadUsersContacts();
    slideOut('contacts-add-card');
    renderContactHtml();
    renderSingleContact(contactArrayPosition);
}

/**
 * Deletes a user task from the 'assigned_to' field in the tasks array for a given contact ID.
 *
 * @param {string} contactId - The ID of the contact whose task is to be deleted
 */
async function deleteUserTaskFromAssignTo(contactId) {
    await loadTasksFromBackend();
    tasks.forEach(task => {
        task.assigned_to.forEach(function (taskat, i) {
            if (taskat.id == contactId) {
                task.assigned_to.splice(i, 1);
            }
        });
    });
    await setItem('tasks', tasks);
    tasks = [];
}

/**
 * Closes a single contact by sliding it out and hiding the main content and background.
 */
function closeSingleContact() {
    slideOut('single-contact');
    clearHighlight();
    document.getElementById('single-contact-test').classList.add('d-none');
    document.getElementById('div-contacts-main-placeholder').classList.remove('d-none');
}