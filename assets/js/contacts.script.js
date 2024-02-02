let toggleSingleContact = 0;

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

function navChangeColor() {
    document.getElementById('nav-contacts').classList.add('link-active');
    document.getElementById('nav-contacts').onclick = null;
    document.getElementById('mobile-nav-contacts').classList.add('link-active');
    document.getElementById('mobile-nav-contacts').onclick = null;
}

function slideIn(container, addOrEdit, userToEdit) {
    if (container == 'single-contact' && !document.getElementById('single-contact-container').classList.contains('d-none')) {
        setTimeout(function () {
            document.getElementById('single-contact-container').classList.add('d-none');
        }, 20);

    }
    document.getElementById('contact_name').value = '';
    document.getElementById('contact_email').value = '';
    document.getElementById('contact_phone').value = '';
    document.getElementById('contact-add-edit-title').innerHTML = '';
    document.getElementById('div-contacts-add-form').innerHTML = '';
    document.getElementById('contact-add-edit-img').innerHTML = '';

    document.getElementById(container + '-container').classList.remove('d-none');
    document.getElementById(container).style.right = '0';
    document.getElementById(container).style.animation = 'slide_in 0.3s ease-out';
    if (addOrEdit == 'edit') {
        document.getElementById('contact-add-edit-img').innerHTML = `
        <div class="contact-edit-inizials" style="background-color: ${userContacts[userToEdit].color}">
        ${userContacts[userToEdit].firstName.charAt(0)}${userContacts[userToEdit].lastName.charAt(0)}
        </div>`;
        document.getElementById('contact_action').value = userToEdit;
        document.getElementById('contact-add-edit-title').innerHTML = `
         <p>Edit Contact</p>
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
            <p>Add contact</p>
            <p class="title-sub">Tasks are better with a team</p>
            <div class="seperator-vertical"></div>`;
        document.getElementById('div-contacts-add-form').innerHTML = `
            <div class="button-bordered" onclick="clearInputFields()">Clear<img src="assets/icons/close.png"></div>
            <button>Create contact<img src="assets/icons/check.png"></button>`;

    }
}

function slideOut(container) {
    document.getElementById(container).style.animation = 'slide_out 0.3s ease-out';
    setTimeout(function () {
        document.getElementById(container + '-container').classList.add('d-none');
        document.getElementById(container).style.right = '-150%';
    }, 280);
}

async function addContact() {
    let nameInput = document.getElementById('contact_name').value;
    let contact = new Contact;
    let firstName;
    let lastName;

    if (nameInput.split(" ").length > 1) {
        firstName = nameInput.split(" ")[0];
        lastName = nameInput.split(" ")[1];
    }
    else {
        firstName = nameInput[0];
        lastName = '';
    }

    contact.firstName = firstName;
    contact.lastName = lastName;
    contact.eMail = document.getElementById('contact_email').value;
    contact.phone = document.getElementById('contact_phone').value;
    contact.assignedTo = loggedInUser.id;
    contact.color = generateColor();
    await createContactToSave(contact);
    clearInputFields();
    slideOut('contacts-add-card');
    await loadUsersContacts();
    renderContactHtml();
}

function clearInputFields() {
    document.getElementById('contact_name').value = '';
    document.getElementById('contact_email').value = '';
    document.getElementById('contact_phone').value = '';
}

function renderContactHtml() {
    clearContactList();
    sortContacts();
    ContactsSortHeadline();
    renderContactsHtmlCard();
}

function clearContactList() {
    document.getElementById('div-contacts-list').innerHTML = '';
}

function renderContactsHtmlCard() {
    for (let i = 0; i < userContacts.length; i++) {
        let inizials = userContacts[i].firstName[0] + userContacts[i].lastName[0];
        document.getElementById('contactFirstLetter' + userContacts[i].firstName[0].toUpperCase()).innerHTML += `
        <div class="div-contacts-list-card" onclick="openSingleContact('single-contact', ${i})">
            <div class="div-contacts-list-logo" style="background-color: ${userContacts[i].color}">${inizials}</div>
            <div class="div-contacts-list-data">
                <p>${userContacts[i].firstName} ${userContacts[i].lastName}</p>
                <p>${userContacts[i].eMail}</p>
            </div>
        </div>`;
    };

}

async function renderSingleContact(arrayPosotion) {
    clearSingleContactContainer();
    renderSingleContactContainerHtml(arrayPosotion);
}

function clearSingleContactContainer() {
    document.getElementById('single-contact-logo').innerHTML = '';
    document.getElementById('single-contact-name').innerHTML = '';
    document.getElementById('single-contact-data-mail').innerHTML = '';
    document.getElementById('single-contact-data-phone').innerHTML = '';
}

function renderSingleContactContainerHtml(arrayPosotion) {
    let inizials = userContacts[arrayPosotion].firstName[0] + userContacts[arrayPosotion].lastName[0];
    document.getElementById('single-contact-logo').innerHTML = inizials;
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

async function openSingleContact(target, arrayPosotion) {
    await renderSingleContact(arrayPosotion);
    slideIn(target);
}

async function deleteContact(contactId) {
    await loadContactsFromBackend();
    for (let i = 0; i < allContacts.length; i++) {
        if (allContacts[i].id == contactId) {
            allContacts.splice(i, 1);
        }
    }
    await saveContactsToBackend();
    allContacts = [];
    await loadUsersContacts();
    slideOut('single-contact');
    slideOut('contacts-add-card');
    renderContactHtml();
}

function sortContacts() {
    userContacts.sort(function (a, b) {
        let firstNameA = a.firstName.toLowerCase();
        let firstNameB = b.firstName.toLowerCase();
        if (firstNameA < firstNameB) return -1;
        if (firstNameA > firstNameB) return 1;
        return 0;
    });
}

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

function renderContactsSortHeadlineHtml(firstLetter) {
    document.getElementById('div-contacts-list').innerHTML += `
    <div class="div contacts-list-letter">
        ${firstLetter}
    </div>
    <div class="seperator-contacts-list"></div>
    <div id="contactFirstLetter${firstLetter}"></div>`;
}

function editContact(userToEdit) {
    slideIn('contacts-add-card', 'edit', userToEdit);
}

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

async function saveContactEdit(contactArrayPosition) {
    await loadContactsFromBackend();
    allContacts.forEach(function (ac, i) {
        if (ac.id == userContacts[contactArrayPosition].id) {
            allContacts.splice(i, 1, userContacts[contactArrayPosition])
        }
    });
    await saveContactsToBackend();
    await loadUsersContacts();
    slideOut('single-contact');
    slideOut('contacts-add-card');
    renderContactHtml();
}