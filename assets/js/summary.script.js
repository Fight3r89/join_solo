async function init() {
    await getUserDataFromSessionStorage();
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

/**
 * Changes the color and behavior of the navigation elements.
 */
function navChangeColor() {
    document.getElementById('nav-summary').classList.add('link-active');
    document.getElementById('nav-summary').onclick = null;
    document.getElementById('mobile-nav-summary').classList.add('link-active');
    document.getElementById('mobile-nav-summary').onclick = null;
}

/**
 * Renders the HTML content by calling the renderGreeting and renderAmounts functions.
 *
 */
function renderHtml() {
    renderGreeting();
    renderAmounts();

}

/**
 * Renders the greeting message for the logged in user.
 */
function renderGreeting() {
    let lastName = '';
    if (loggedInUser.lastName){lastName = loggedInUser.lastName;};
    document.getElementById('greeting-user-name').innerHTML = '';
    document.getElementById('greeting-time').innerHTML = '';
    document.getElementById('greeting-time').innerHTML = greetingTime();
    document.getElementById('greeting-user-name').innerHTML = loggedInUser.firstName + ' ' + lastName;
}

/**
 * Renders the amounts by setting the amounts, clearing the HTML cards, and then setting the HTML cards.
 */
function renderAmounts() {
    setAmounts();
    clearHtmlCards();
    setHtmlCards();
}

/**
 * Clear all HTML cards by setting their innerHTML to an empty string.
 */
function clearHtmlCards() {
    document.getElementById('amount-to-do').innerHTML = '';
    document.getElementById('amount-done').innerHTML = '';
    document.getElementById('amount-urgent').innerHTML = '';
    document.getElementById('amount-number-of-tasks').innerHTML = '';
    document.getElementById('amount-in-progress').innerHTML = '';
    document.getElementById('amount-feedback').innerHTML = '';
    document.getElementById('upcoming-deadline-date').innerHTML = '';
}

/**
 * Sets the innerHTML of various elements in the HTML document based on the values of different task-related variables.
 *
 */
function setHtmlCards() {
    document.getElementById('amount-to-do').innerHTML = tasksTodo;
    document.getElementById('amount-done').innerHTML = tasksDone;
    document.getElementById('amount-urgent').innerHTML = tasksUrgent;
    document.getElementById('amount-number-of-tasks').innerHTML = amountOfTasks;
    document.getElementById('amount-in-progress').innerHTML = tasksInProgress;
    document.getElementById('amount-feedback').innerHTML = tasksAwaitFeedback;
    document.getElementById('upcoming-deadline-date').innerHTML = upcoomingDeadLine();
}

/**
 * Returns a greeting based on the current time of day.
 *
 * @return {string} The greeting message.
 */
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

/**
 * Finds the next upcoming deadline based on the user tasks with 'urgent' priority.
 *
 * @return {string} The formatted deadline date or 'No upcoming Deadline' if there is no upcoming deadline.
 */
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

/**
 * Formats the given deadline date into a specific string format.
 *
 * @param {Date} nextDate - the date to be formatted
 * @return {string} the formatted date string
 */
function formateDeadlineDate(nextDate) {
    const unformatedDate = new Date(nextDate);
    const option = { month: 'long', day: 'numeric', year: 'numeric' };
    let formatedDate = unformatedDate.toLocaleDateString('de-DE', option);
    const [day, month, year] = formatedDate.split(' ');
    return `${month} ${day.replace('.', '')}, ${year}`;
}