let tasks = [];


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
        //document.getElementById('footer').classList.remove('d-none');
    }, 500);
}


function openSite(site) {
    window.location.href = site+'.html';
}

function createNewTask() {
    let newTask = new Task();
    /*document.getElementById('title').value;
    document.getElementById('description').value;
    document.getElementById('assigned-to').value;
    document.getElementById('date').value;
    //document.getElementById('prio').value;
    document.getElementById('category').value;
    document.getElementById('subtasks').value;*/

    newTask.title = document.getElementById('title').value;
    newTask.description = document.getElementById('description').value;
    newTask.assigned_to = document.getElementById('assigned-to').value;
    newTask.date = document.getElementById('date').value;
    //newTask.prio = document.getElementById('prio').value;
    newTask.category = document.getElementById('category').value;
    newTask.subtasks = document.getElementById('subtasks').value;
    
    tasks.push(newTask); 
    //console.log(tasks);
}

function loadTasks(){}

function saveTasks(){}