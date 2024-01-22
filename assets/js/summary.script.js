let amountOfTasks = 0;
let tasksTodo = 0;
let tasksDone = 0;
let tasksInProgress = 0;
let tasksAwaitFeedback = 0;
let tasksUrgent = 0;

async function init() {
    await getUserDataFromLocalStorage();
    if (await checkLoggedIn()) {
        await includeHTML();
        await loadUserTasks();
        navChangeColor();
        renderHtml();
    }
    else {
       location.href = 'index.html';
    }
}

function navChangeColor() {
    document.getElementById('nav-summary').classList.add('link-active');
    document.getElementById('nav-summary').onclick = null;
}

function renderHtml() {
    renderGreeting();
    renderAmounts();

}

function renderGreeting() {
    document.getElementById('greeting-user-name').innerHTML = '';
    document.getElementById('greeting-user-name').innerHTML = loggedInUser.firstName + ' ' + loggedInUser.lastName;
}

function renderAmounts() {
    setAmounts();
    clearHtmlCards();
    setHtmlCards();
}

function setAmounts() {
    amountOfTasks = userTasks.length;
    for (let i = 0; i < userTasks.length; i++) {
        switch (userTasks[i].task) {
            case 'todo':
                tasksTodo += 1;
                break;
            case 'inprogress':
                tasksInProgress += 1;
                break;
            case 'awaitfeedback':
                tasksAwaitFeedback += 1;
                break;
            case 'done':
                tasksDone += 1;
                break;
            default:
                break;
        }
        if (userTasks[i].prio == 'urgent') tasksUrgent += 1;
        //console.log(tasks[i].prio);
    }
}

function clearHtmlCards() {
    document.getElementById('amount-to-do').innerHTML = '';
    document.getElementById('amount-done').innerHTML = '';
    document.getElementById('amount-urgent').innerHTML = '';
    document.getElementById('amount-number-of-tasks').innerHTML = '';
    document.getElementById('amount-in-progress').innerHTML = '';
    document.getElementById('amount-feedback').innerHTML = '';
}

function setHtmlCards() {
    document.getElementById('amount-to-do').innerHTML = tasksTodo;
    document.getElementById('amount-done').innerHTML = tasksDone;
    document.getElementById('amount-urgent').innerHTML = tasksUrgent;
    document.getElementById('amount-number-of-tasks').innerHTML = amountOfTasks;
    document.getElementById('amount-in-progress').innerHTML = tasksInProgress;
    document.getElementById('amount-feedback').innerHTML = tasksAwaitFeedback;
}