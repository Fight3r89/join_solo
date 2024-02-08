/**
 * Asynchronously registers a new user, performs validation, and updates the user list accordingly.
 */
async function register() {
    await loadUsers();
    clearError();
    let email = document.getElementById('email');
    let password = document.getElementById('passwrd');
    let passwordConfirm = document.getElementById('passwrdConf');
    if (await checkUserExist(email.value)) {
        email.classList.add('error-border');
        document.getElementById('email_error').classList.remove('d-none');
        password.value = '';
        passwordConfirm.value = '';
    }
    else if(password.value != passwordConfirm.value){
        document.getElementById('password_error').classList.remove('d-none');
        document.getElementById('passwordConfirm_error').classList.remove('d-none');
        document.getElementById('divPassword').classList.add('error-border');
        document.getElementById('divPasswordConfirm').classList.add('error-border');
        password.value = '';
        passwordConfirm.value = '';
    }
    else {
        let newUser = new User();
        let userInputName = document.getElementById('name').value.split(" ");
        let firstName = userInputName[0];
        let lastName;
        let inizials = userInputName[0][0]+userInputName[userInputName.length-1][0];
        (userInputName.length = 2) ? lastName = userInputName[1] : lastName = ' ';

        newUser.id = users.length;
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.eMail = email.value;
        newUser.password = password.value;
        newUser.inizials = inizials;
        users.push(newUser);
        saveUser();
        clearRegistration();
        document.getElementById('register-successfully').classList.add('reg-animation');
    }
    users = [];
}

function clearRegistration(){
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('passwrd').value = '';
    document.getElementById('passwrdConf').value = '';
    document.getElementById('passwrd').classList.remove('error-border');
    document.getElementById('passwrdConf').classList.remove('error-border');
    document.getElementById('content-register').classList.add('d-none');
    document.getElementById('content-login').classList.remove('d-none');
    document.getElementById('div-index-register').classList.remove('d-none');
    document.getElementById('policy').src = 'assets/icons/check_box.png';
    document.getElementById('btn-signUp').disabled = true;
    document.getElementById('btn-signUp').classList.add('button_no_hover')
    clearError();
}

function clearError(){
    document.getElementById('email').classList.remove('error-border');
    document.getElementById('email_error').classList.add('d-none');
    document.getElementById('password_error').classList.add('d-none');
    document.getElementById('passwordConfirm_error').classList.add('d-none');
    document.getElementById('divPassword').classList.remove('error-border');
    document.getElementById('divPasswordConfirm').classList.remove('error-border');
}

/**
 * Asynchronously checks if a user with the given email exists in the users array.
 *
 * @param {string} email - The email to check for existence in the users array.
 * @return {boolean} Whether a user with the given email exists in the users array.
 */
async function checkUserExist(email) {
    let exist = false;
    for (let i = 0; i < users.length; i++) {
        if (!exist) {
            (users[i].eMail == email) ? exist = true : '';
        }
    }
    return exist;
}

/**
 * Asynchronously saves the user data to the 'users' storage.
 */
async function saveUser() {
    await setItem('users', users);
}

/**
 * Changes the checkbox image based on the provided path.
 *
 * @param {string} path - The path of the new checkbox image.
 */
function changeCheckboxImage(path) {
    let imagePath = new URL(path).pathname.split('/');
    imagePath.shift();
    if (imagePath[imagePath.length - 1] == 'check_box.png') {
        document.getElementById('policy').src = 'assets/icons/check_box_checked.png';
        document.getElementById('btn-signUp').disabled = false;
        document.getElementById('btn-signUp').classList.remove('button_no_hover');
    }
    else{
        document.getElementById('policy').src = 'assets/icons/check_box.png';
        document.getElementById('btn-signUp').disabled = true;
        document.getElementById('btn-signUp').classList.add('button_no_hover');
    }
}