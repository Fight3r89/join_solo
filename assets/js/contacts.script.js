let toggleSingleContact = 0;

async function init() {
    await includeHTML();
    navChangeColor();
    await getUserDataFromLocalStorage();
    await loadUsersContacts();

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

function addContact() {
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
    saveContactsToBackend(contact);

}

function clearInputFields() {
    document.getElementById('contact_name').value = '';
    document.getElementById('contact_email').value = '';
    document.getElementById('contact_phone').value = '';
}
