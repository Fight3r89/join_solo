async function init() {
    await getUserDataFromLocalStorage();
    if (await checkLoggedIn()) {
        await includeHTML();
        await loadUserTasks();
        navChangeColor();
        renderHtml();
        renderUserMenueInizials();
    }
    else {
        location.href = 'index.html';
    }
}

function navChangeColor() {
    document.getElementById('nav-summary').classList.add('link-active');
    document.getElementById('nav-summary').onclick = null;
    document.getElementById('mobile-nav-summary').classList.add('link-active');
    document.getElementById('mobile-nav-summary').onclick = null;
}

function renderHtml() {
    renderGreeting();
    renderAmounts();

}

function renderGreeting() {
    document.getElementById('greeting-user-name').innerHTML = '';
    document.getElementById('greeting-time').innerHTML = '';
    document.getElementById('greeting-time').innerHTML = greetingTime();
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
    document.getElementById('upcoming-deadline-date').innerHTML = '';
}

function setHtmlCards() {
    document.getElementById('amount-to-do').innerHTML = tasksTodo;
    document.getElementById('amount-done').innerHTML = tasksDone;
    document.getElementById('amount-urgent').innerHTML = tasksUrgent;
    document.getElementById('amount-number-of-tasks').innerHTML = amountOfTasks;
    document.getElementById('amount-in-progress').innerHTML = tasksInProgress;
    document.getElementById('amount-feedback').innerHTML = tasksAwaitFeedback;
    document.getElementById('upcoming-deadline-date').innerHTML = upcoomingDeadLine();
}

function greetingTime() {
    let currentTime = new Date();
    let currentHour = currentTime.getHours();

    if (currentHour >= 5 && currentHour < 12) {
        return 'Good morning';
    }
    else if (currentHour >= 12 && currentHour < 18) {
        return 'Good day';
    }
    else return 'Good evening';
}

function upcoomingDeadLine() {
    const heute = new Date();
    let nextDate;
    heute.setHours(0, 0, 0, 0);
    userTasks.forEach(userTask => {
        const taskDate = new Date(userTask.date);
        if (userTask.prio == 'urgent') {
            if (taskDate > heute && (!nextDate || taskDate < nextDate)) {
                nextDate = taskDate;
            }
        }
    });

    if (nextDate) return formateDeadlineDate(nextDate);
    else return 'No upcoming Deadline';

}

function formateDeadlineDate(nextDate) {
    const unformatedDate = new Date(nextDate);
    const option = { month: 'long', day: 'numeric', year: 'numeric' };
    let formatedDate = unformatedDate.toLocaleDateString('de-DE', option);
    const [day, month, year] = formatedDate.split(' ');
    return `${month} ${day.replace('.', '')}, ${year}`;
}