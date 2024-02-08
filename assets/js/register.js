/**
 * Asynchronously registers a new user, performs validation, and updates the user list accordingly.
 */
async function register() {
    await loadUsers();
    let email = document.getElementById('email');
    if (await checkUserExist(email.value)) {
        console.log('user existiert');
        email.classList.add('error-border');
        document.getElementById('passwrd').value = '';
        document.getElementById('passwrdConf').value = '';
    }
    else {
        let newUser = new User();
        let userInputName = document.getElementById('name').value.split(" ");
        let firstName = userInputName[0];
        let lastName;
        let inizials = userInputName[0][0]+userInputName[userInputName.length-1][0];
        console.log(inizials);
        (userInputName.length = 2) ? lastName = userInputName[1] : lastName = ' ';

        newUser.id = users.length;
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.eMail = email.value;
        newUser.password = document.getElementById('passwrd').value;
        newUser.inizials = inizials;
        users.push(newUser);
        saveUser();
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('passwrd').value = '';
        document.getElementById('passwrdConf').value = '';

        document.getElementById('content-register').classList.add('d-none');
        document.getElementById('content-login').classList.remove('d-none');
        document.getElementById('div-index-register').classList.remove('d-none');
        document.getElementById('register-successfully').classList.add('reg-animation');
       
    }
    users = [];
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
    imagePath = imagePath.join('/');
    if (imagePath == 'assets/icons/check_box.png') {
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