let tasks = [];
let users = [];
let loggedInUser = [];
let userTasks = [];

async function includeHTML() {
    let elements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        file = element.getAttribute("w3-include-html");
        let response = await fetch(file);
        if (response.ok) {
            element.innerHTML = await response.text();
        }
        else {
            element.innerHTML = 'Page not found';
        }
    }
}

function firstLoad() {
    includeHTML();
    setTimeout(function () {
        document.getElementById('content-login').classList.remove('d-none');
        document.getElementById('div-index-register').classList.remove('d-none');
        //document.getElementById('footer').classList.remove('d-none');
    }, 500);
}

function openSignUp() {
    document.getElementById('div-index-register').classList.add('d-none');
    document.getElementById('content-login').classList.add('d-none');
    document.getElementById('content-register').classList.remove('d-none');
}

function closeSignUp() {
    document.getElementById('div-index-register').classList.remove('d-none');
    document.getElementById('content-login').classList.remove('d-none');
    document.getElementById('content-register').classList.add('d-none');
}

function openSite(site) {
    window.location.href = site + '.html';
}

async function loadUsers(){
    let user = [];
    user = JSON.parse(await getItem('users'));
    user.forEach(e => {
        let loadUser = new User();
        loadUser.id = e.id;
        loadUser.firstName = e.firstName;
        loadUser.lastName = e.lastName;
        loadUser.eMail = e.eMail;
        loadUser.password = e.password;
        users.push(loadUser);
    });
}

async function checkLoggedIn(){
    if(loggedInUser){
        return true;
    }
    else {
        return false;
    }
}