
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