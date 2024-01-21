async function login() {
    let email = document.getElementById('mail');
    let pswd = document.getElementById('pass');

    await loadUsers();

    users.forEach(e => {
        if (e.eMail == email.value) {
            if (e.password == pswd.value) {
                console.log('login korrekt');
                document.getElementById('login_error').classList.add('d-none');
                email.value = '';
                pswd.value = '';
                location.href=`summary.html?id=${e.id}`;
            }
        }
        else {
            email.classList.add('error-border');
            email.value = '';
            pswd.classList.add('error-border');
            pswd.value = '';
            document.getElementById('login_error').classList.remove('d-none');
        }
    });
    users = [];
}