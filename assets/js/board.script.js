let currentDraggedElement;

async function init() {
    await getUserDataFromSessionStorage();
    if (await checkLoggedIn()) {
        await includeHTML();
        await loadUserTasks();
        navChangeColor();
        setAmounts();
        renderHtml();
        changeSubtasksAddImage();
        renderUserMenueInizials();
        seachEventListener();
        getMinDate();
    }
    else {
        location.href = 'index.html';
    }
}

/**
 * Change the color of the navigation elements and disable their onclick event.
 *
 * No parameters
 * No return value
 */
function navChangeColor() {
    document.getElementById('nav-board').classList.add('link-active');
    document.getElementById('nav-board').onclick = null;
    document.getElementById('mobile-nav-board').classList.add('link-active');
    document.getElementById('mobile-nav-board').onclick = null;
}

/**
 * Slide in the specified container with the given task ID or task.
 *
 * @param {string} container - The ID of the container to slide in
 * @param {number|object} taskIdOrTask - The ID of the task or the task object
 */
function slideIn(container, taskIdOrTask) {
    document.getElementById(container + '-container').classList.remove('d-none');
    document.getElementById(container).style.right = '16px';
    document.getElementById(container).style.animation = 'slide_in 0.3s ease-out';
    if (taskIdOrTask) {
        if (typeof taskIdOrTask === 'number') renderSingleTaskCard(taskIdOrTask);
        else {
            task = taskIdOrTask;
        }
    }
}

/**
 * Slides out the specified container element and performs additional tasks.
 *
 * @param {string} container - The id of the container element to slide out
 */
function slideOut(container) {
    document.getElementById(container).style.animation = 'slide_out 0.3s ease-out';
    setTimeout(function () {
        document.getElementById(container + '-container').classList.add('d-none');
        document.getElementById(container).style.right = '-150%';
    }, 280);
    addSubtask = [];
    addAssignedTo = [];
    toggleShowAssignedTo = false;
    userContacts = [];
    document.getElementById('editContactsAssignedTo').classList.add('d-none');
    document.getElementById('contactsAssignedTo').classList.add('d-none');
    document.getElementById('addTaskAssignedToSelectDefault').innerHTML = '<span>Select contacts to assign</span><img src="assets/icons/arrow_drop_down.png" alt="">';
}

/**
 * Renders the HTML by clearing the task card container, checking for tasks to do, rendering task cards, and adding the selected task.
 */
function renderHtml() {
    clearTaskCardContainer();
    noTasksToDo();
    renderTaskCards();
    addSelection(selected);
}

/**
 * Clear the task card container by setting the innerHTML of each task container to an empty string.
 */
function clearTaskCardContainer() {
    document.getElementById('div-tasks-to-do').innerHTML = '';
    document.getElementById('div-tasks-in-progress').innerHTML = '';
    document.getElementById('div-tasks-await-feedback').innerHTML = '';
    document.getElementById('div-tasks-done').innerHTML = '';
}

/**
 * Updates the HTML content of task divs if there are no tasks to do, in order to display a message.
 */
function noTasksToDo() {
    if (tasksTodo == 0) document.getElementById('div-tasks-to-do').innerHTML = noTasksToDoHtml();
    if (tasksInProgress == 0) document.getElementById('div-tasks-in-progress').innerHTML = noTasksToDoHtml();
    if (tasksAwaitFeedback == 0) document.getElementById('div-tasks-await-feedback').innerHTML = noTasksToDoHtml();
    if (tasksDone == 0) document.getElementById('div-tasks-done').innerHTML = noTasksToDoHtml();
}

/**
 * Returns an HTML string representing a message for when there are no tasks to do.
 *
 * @return {string} HTML message for no tasks
 */
function noTasksToDoHtml() {
    return '<div class="no-tasks">No tasks To do</div>';
}

/**
 * Renders task cards based on the input search. If no input search is provided, it renders all user tasks.
 *
 * @param {array} inputSearch - The input search for filtering tasks
 */
function renderTaskCards(inputSearch) {
    if (inputSearch) {
        inputSearch.forEach(tasks => {
            renderTasksInCategory(tasks);
        });
    }
    else {
        userTasks.forEach(tasks => {
            renderTasksInCategory(tasks);
        });
    }
}

/**
 * Render tasks in the specified category.
 *
 * @param {object} tasks - The tasks to be rendered
 */
function renderTasksInCategory(tasks) {
    if (tasks.task == 'todo') { document.getElementById('div-tasks-to-do').innerHTML += renderTaskCardHtml(tasks) };
    if (tasks.task == 'inprogress') { document.getElementById('div-tasks-in-progress').innerHTML += renderTaskCardHtml(tasks) };
    if (tasks.task == 'awaitfeedback') { document.getElementById('div-tasks-await-feedback').innerHTML += renderTaskCardHtml(tasks) };
    if (tasks.task == 'done') { document.getElementById('div-tasks-done').innerHTML += renderTaskCardHtml(tasks) };
    
}

/**
 * Renders the progress bar and amount of completed subtasks for a given task.
 *
 * @param {Object} task - The task object containing subtasks
 * @return {string} The HTML for the progress bar and amount of completed subtasks
 */
function renderSubtasks(task) {
    let subtsasks_done = 0;
    if (task.subtasks.length > 0) {
        task.subtasks.forEach((st) => {
            if (st.done) {
                subtsasks_done += 1;
            }
        })
        return `<div class="task-card-subtasks-progressbar-background">
                    <div class="task-card-subtasks-progressbar" style="width:${subtsasks_done / task.subtasks.length * 100}%"></div>
                </div>
                <div class="task-card-subtasks-amount">
                    ${subtsasks_done}/${task.subtasks.length} Subtasks
                </div>`;
    }
    else {
        return '';
    }
}

/**
 * Renders the HTML for a task card based on the provided task object.
 *
 * @param {Object} task - The task object containing task details.
 * @return {string} The HTML content for the task card.
 */
function renderTaskCardHtml(task) {
    let backgroundColor;
    (task.category == 'User Story') ? backgroundColor = '#0038ff' : backgroundColor = '#1FD7C1';
    return `
        <div class="task-card" id="task-card${task.taskId}" onclick="slideIn('task-card-slide',${task.taskId})" draggable="true" ondragstart="moveTo(${task.taskId})">
            <div class="task-card-category" style="background-color:${backgroundColor};">
                ${task.category}
            </div>
            <div class="task-card-headline">
                ${task.title}
            </div>
            <div class="task-card-content">
                ${task.description}
            </div>
            <div class="task-card-subtasks">
                ${renderSubtasks(task)}
            </div>
                <div class="task-card-footer">
                    <div class="task-card-footer-left">
                        ${getAssignTo(task)}
                    </div>
                    <img src="assets/icons/prio_${task.prio}.png" class="task-card-footer-prio">
                </div>
            </div>`
}

/**
 * Returns the HTML for assigned users in a task card footer.
 *
 * @param {Object} task - The task object containing assigned_to property
 * @return {string} The HTML for the assigned users
 */
function getAssignTo(task) {
    let output = '';
    task.assigned_to.forEach(at => {
        output += ` <div class="task-card-footer-assigned" style="background-color:${at.color};">
                        ${at.inizials}
                    </div>`;
    });
    return output;

}

/**
 * Renders a single task card based on the given taskId.
 *
 * @param {number} taskId - The ID of the task to render 
 */
function renderSingleTaskCard(taskId) {
    clearSingleTaskCard();
    setSingleTasCardContent(taskId);
}

/**
 * Clears all the content and resets the visibility for a single task card.
 */
function clearSingleTaskCard() {
    document.getElementById('task-single-card-category').innerHTML = '';
    document.getElementById('task-single-card-category').classList.remove('d-none');
    document.getElementById('task-single-card-headline').innerHTML = '';
    document.getElementById('task-single-card-content').innerHTML = '';
    document.getElementById('task-single-card-date-container').innerHTML = '';
    document.getElementById('task-single-card-prio-right').innerHTML = '';
    document.getElementById('task-single-card-assignedto-list').innerHTML = '';
    document.getElementById('task-single-card-subtasks-list').innerHTML = '';
    document.getElementById('task-single-card-footer').innerHTML = '';
}

/**
 * Set the content of a single task card based on the taskId provided.
 *
 * @param {number} taskId - The ID of the task to be displayed
 */
function setSingleTasCardContent(taskId) {
    for (let i = 0; i < userTasks.length; i++) {
        if (userTasks[i].taskId == taskId) {
            let dateSplit = userTasks[i].date.split('-');
            let dateOutput = dateSplit[2] + "/" + dateSplit[1] + "/" + dateSplit[0];
            let backgroundColor;
            (userTasks[i].category == 'User Story') ? backgroundColor = '#0038ff' : backgroundColor = '#1FD7C1';

            document.getElementById('task-single-card-category').innerHTML = userTasks[i].category;
            document.getElementById('task-single-card-category').style.backgroundColor = backgroundColor;
            document.getElementById('task-single-card-headline').innerHTML = userTasks[i].title;
            document.getElementById('task-single-card-content').innerHTML = userTasks[i].description;
            document.getElementById('task-single-card-date-container').innerHTML = dateOutput;
            document.getElementById('task-single-card-prio-right').innerHTML = `${userTasks[i].prio[0].toUpperCase() + userTasks[i].prio.slice(1)}
            <img src="assets/icons/prio_${userTasks[i].prio}.png" class="task-card-footer-prio">`;
            if (userTasks[i].subtasks.length > 0) {
                for (let j = 0; j < userTasks[i].subtasks.length; j++) {
                    let subtasDoneImg;
                    (userTasks[i].subtasks[j].done) ? subtasDoneImg = 'check_box_checked' : subtasDoneImg = 'check_box';
                    document.getElementById('task-single-card-subtasks-list').innerHTML += `
                        <div class="task-single-card-list-card">
                            <img src="assets/icons/${subtasDoneImg}.png" onclick="changeSubtaskDone(${i},${j})">
                            <p>${userTasks[i].subtasks[j].task}</p>
                        </div>`;
                };
            }
            else {
                document.getElementById('task-single-card-subtasks-list').innerHTML += `<p>No Subtasks available</p>`;
            }
            if (userTasks[i].assigned_to.length > 0) {
                userTasks[i].assigned_to.forEach(at => {
                    document.getElementById('task-single-card-assignedto-list').innerHTML += `
                        <div class="task-single-card-assignedto-list-card">
                            <div class="task-single-card-assignedto-list-logo" style="background-color:${at.color};">
                            ${at.inizials}
                            </div>
                            <p>${at.firstName} ${at.lastName}</p>
                        </div>`;
                });
            }
            else {
                document.getElementById('task-single-card-assignedto-list').innerHTML += `None`;
            }
            renderFooterHtml(i);
        }
    }
}

/**
 * Toggles the 'done' property of a subtask within a task, then renders the updated task card, saves the changes to the task, and re-renders the HTML.
 *
 * @param {number} taskPosition - The position of the task in the userTasks array.
 * @param {number} subTaskPosition - The position of the subtask within the task.
 */
function changeSubtaskDone(taskPosition, subTaskPosition) {
    userTasks[taskPosition].subtasks[subTaskPosition].done = !userTasks[taskPosition].subtasks[subTaskPosition].done
    renderSingleTaskCard(userTasks[taskPosition].taskId);
    saveChangesTaskChanges(userTasks[taskPosition].taskId, userTasks[taskPosition]);
    renderHtml();
}

/**
 * Renders the HTML for the footer of the task single card.
 *
 * @param {number} i - The index of the task
 */
function renderFooterHtml(i) {
    document.getElementById('task-single-card-footer').innerHTML =
        `<div class="task-single-card-delete" onclick="deleteTask(${i})">
    <img src="assets/icons/delete.png"> Delete
</div>
<div class="task-single-card-footer-spacer"></div>
<div class="task-single-card-edit" onclick="editTask(${i})">
    <img src="assets/icons/edit.png"> Edit
</div>`;
}

/**
 * Deletes a task from the userTasks array and from the backend, then updates the UI.
 *
 * @param {number} i - The index of the task to be deleted
 */
function deleteTask(i) {
    deleteTaskFromBackend(userTasks[i].taskId);
    userTasks.splice(i, 1);
    slideOut('task-card-slide');
    setAmounts();
    renderHtml();
}

/**
 * Moves the current dragged element to a new task with the specified ID.
 *
 * @param {type} taskId - The ID of the task to move the current dragged element to.
 */
function moveTo(taskId) {
    currentDraggedElement = taskId;
    console.log(taskId);
}

/**
 * Function to allow dropping of an element.
 *
 * @param {Event} ev - the event object
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Updates the userTasks with the given section, saves changes, updates the amounts, and renders the HTML.
 *
 * @param {type} section - contains the section where it was dropped
 */
function drop(section) {
    userTasks.forEach(ut => {
        if (ut.taskId == currentDraggedElement) {
            ut.task = section;
            saveChangesTaskChanges(ut.taskId, ut);
        }
    });
    setAmounts();
    renderHtml();
}

/**
 * Show the drop area for a given section.
 *
 * @param {string} section - The name of the section to show the drop area for
 */
function showDropArea(section) {
    document.getElementById(section).classList.add('drag-area-shown');
}

/**
 * Hides the drop area for the specified section.
 *
 * @param {string} section - The name of the section to hide the drop area for.
 */
function hideDropArea(section) {
    document.getElementById(section).classList.remove('drag-area-shown');
}

/**
 * Event listener for the search input field. Clears the task card container, filters tasks by title, and renders the filtered tasks.
 */
function seachEventListener() {
    document.getElementById('input-boad-search').addEventListener('input', function () {
        clearTaskCardContainer();
        let inputSearch = document.getElementById('input-boad-search').value.toLowerCase();
        let filteredTasks = filterTasksByTitle(inputSearch);
        renderTaskCards(filteredTasks);
    });
}

/**
 * Filters tasks by title.
 *
 * @param {string} inputSearch - the search keyword
 * @return {Array} filtered tasks
 */
function filterTasksByTitle(inputSearch) {
    return userTasks.filter(userTasks => userTasks.title.toLowerCase().includes(inputSearch));
}

/**
 * Edit a task and update the UI accordingly.
 *
 * @param {number} taskPositionInArray - the position of the task in the array
 */
function editTask(taskPositionInArray) {
    document.getElementById('singleTaskEditMoveTo').value = userTasks[taskPositionInArray].task;
    document.getElementById('editShowSubtasks').innerHTML = '';
    slideOut('task-card-slide');
    slideIn('task-card-slide-edit');
    userTasks[taskPositionInArray].subtasks.forEach(subtask => {
        addSubtask.push(subtask);
    });
    userTasks[taskPositionInArray].assigned_to.forEach(function (assignedTo, i) {
        addAssignedTo.push(assignedTo);
    });
    document.getElementById('editTaskDate').min = new Date().toISOString().split('T')[0];
    document.getElementById('editTaskDate').value = userTasks[taskPositionInArray].date;
    document.getElementById('editAddTaskAsignedTo').innerHTML = `
    <div class="addTaskAssignedToSelectDefault" id="editAddTaskAssignedToSelectDefault"
    onclick="openContactsAssignedTo(true,${taskPositionInArray})"><span>Select contacts to assign</span><img src="assets/icons/arrow_drop_down.png" alt=""></div>`;
    changeDefaultAssignedTo(true);
    removeSelection(selected, true);
    selected = userTasks[taskPositionInArray].prio;
    addSelection(userTasks[taskPositionInArray].prio, true);
    document.getElementById('editTaskTitle').value = userTasks[taskPositionInArray].title;
    document.getElementById('editTaskDescription').value = userTasks[taskPositionInArray].description;
    showSubtasks(true);
    document.getElementById('editTaskOkButton').innerHTML = `<button onclick="saveEditTask(${taskPositionInArray})" class="btn-edit-ok">OK<img src="./assets/icons/check.png"></button>`;

}

/**
 * Save the edited task in the user task list.
 *
 * @param {number} taskArrayPosition - The position of the task in the user task list array
 */
async function saveEditTask(taskArrayPosition) {
    if (selected == null) {
        selected = 'medium';
    }
    let uploadTask = userTasks[taskArrayPosition];
    uploadTask.title = document.getElementById('editTaskTitle').value;
    uploadTask.description = document.getElementById('editTaskDescription').value;
    uploadTask.prio = selected;
    uploadTask.date = document.getElementById('editTaskDate').value;
    uploadTask.assigned_to = [...addAssignedTo];
    uploadTask.subtasks = [...addSubtask];
    uploadTask.task = document.getElementById('singleTaskEditMoveTo').value;
    await loadTasksFromBackend();
    tasks.forEach(function (task, i) {
        if (task.taskId == uploadTask.taskId) {
            tasks.splice(i, 1, uploadTask);
        }
    });
    await setItem('tasks', tasks);
    addAssignedTo = [];
    selected = 'medium';
    tasks = [];
    slideOut('task-card-slide-edit');
    setAmounts();
    renderHtml();
}

document.addEventListener('click', function(event) {
    var container = document.getElementById('task-card-slide-container');
    var slide = document.getElementById('task-card-slide');

    // Überprüfen, ob der Klick außerhalb des Containers stattgefunden hat
    if (container.contains(event.target) && !slide.contains(event.target) && !container.classList.contains('d-none')) {
        // Verstecke den Container
        slideOut('task-card-slide');
    }
});