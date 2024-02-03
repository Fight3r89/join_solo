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
        (userInputName.length = 2) ? lastName = userInputName[1] : lastName = ' ';

        newUser.id = users.length;
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.eMail = email.value;
        newUser.password = document.getElementById('passwrd').value;
        users.push(newUser);
        //saveUser();
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('passwrd').value = '';
        document.getElementById('passwrdConf').value = '';

        console.log("user wird erstellt");
        location.href = 'index.html';
    }
    users = [];
}

async function checkUserExist(email) {
    let exist = false;
    for (let i = 0; i < users.length; i++) {
        if (!exist) {
            (users[i].eMail == email) ? exist = true : '';
        }
    }
    return exist;
}

async function saveUser() {
    await setItem('users', users);
}

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