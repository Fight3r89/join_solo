let toggleSingleContact = 0;

async function init() {
    await includeHTML();
    navChangeColor();
    await getUserDataFromLocalStorage();
    await loadUsersContacts();
    renderContactHtml();
}

function navChangeColor(){
    document.getElementById('nav-contacts').classList.add('link-active');
    document.getElementById('nav-contacts').onclick = null;
    document.getElementById('mobile-nav-contacts').classList.add('link-active');
    document.getElementById('mobile-nav-contacts').onclick = null;
}

function slideIn(container){
    if(container == 'single-contact' && !document.getElementById('single-contact-container').classList.contains('d-none')){
        setTimeout (function(){
            document.getElementById('single-contact-container').classList.add('d-none');
        },20);
        
    }
    document.getElementById(container+'-container').classList.remove('d-none');
    document.getElementById(container).style.right = '0';
    document.getElementById(container).style.animation = 'slide_in 0.3s ease-out';
}

function slideOut(container){
    document.getElementById(container).style.animation = 'slide_out 0.3s ease-out';
    setTimeout (function(){
        document.getElementById(container+'-container').classList.add('d-none');
        document.getElementById(container).style.right = '-150%';
    },280); 
}

async function addContact() {
    let nameInput = document.getElementById('contact_name').value;
    let contact = new Contact;
    let firstName;
    let lastName;

    if(nameInput.split(" ").length > 1 ) {
        firstName = nameInput.split(" ")[0];
        lastName = nameInput.split(" ")[1];
    }
    else{
        firstName = nameInput[0];
        lastName = '';
    }

    contact.firstName = firstName;
    contact.lastName = lastName;
    contact.eMail = document.getElementById('contact_email').value;
    contact.phone = document.getElementById('contact_phone').value;
    contact.assignedTo = loggedInUser.id;
    await saveContactsToBackend(contact);
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

function renderContactHtml(){
    clearContactList();
    renderContactsHtmlCard();
}

function clearContactList() {
    document.getElementById('div-contacts-list').innerHTML = '';
}

function renderContactsHtmlCard(){
    for (let i = 0; i < userContacts.length; i++) {
        
        let inizials = userContacts[i].firstName[0] + userContacts[i].lastName[0];
        document.getElementById('div-contacts-list').innerHTML += `
        <div class="div-contacts-list-card" onclick="openSingleContact('single-contact', ${i})">
            <div class="div-contacts-list-logo">${inizials}</div>
            <div class="div-contacts-list-data">
                <p>${userContacts[i].firstName} ${userContacts[i].lastName}</p>
                <p>${userContacts[i].eMail}</p>
            </div>
        </div>`;
    };
    
}

async function renderSingleContact(arrayPosotion){
    clearSingleContactContainer();
    renderSingleContactContainerHtml(arrayPosotion);
}

function clearSingleContactContainer(){
    document.getElementById('single-contact-logo').innerHTML = '';
    document.getElementById('single-contact-name').innerHTML = '';
    document.getElementById('single-contact-data-mail').innerHTML = '';
    document.getElementById('single-contact-data-phone').innerHTML = '';
}

function renderSingleContactContainerHtml(arrayPosotion){
    let inizials = userContacts[arrayPosotion].firstName[0] + userContacts[arrayPosotion].lastName[0]; 
    document.getElementById('single-contact-logo').innerHTML = inizials;
    document.getElementById('single-contact-name').innerHTML = userContacts[arrayPosotion].firstName +' '+ userContacts[arrayPosotion].lastName;
    document.getElementById('single-contact-data-mail').innerHTML = userContacts[arrayPosotion].eMail;
    document.getElementById('single-contact-data-phone').innerHTML = userContacts[arrayPosotion].phone;
}

async function openSingleContact(target, arrayPosotion){
    await renderSingleContact(arrayPosotion);
    slideIn(target);
}