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

function navChangeColor() {
    document.getElementById('nav-board').classList.add('link-active');
    document.getElementById('nav-board').onclick = null;
    document.getElementById('mobile-nav-board').classList.add('link-active');
    document.getElementById('mobile-nav-board').onclick = null;
}

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
}

function renderHtml() {
    clearTaskCardContainer();
    noTasksToDo();
    renderTaskCards();
    addSelection(selected);
}

function clearTaskCardContainer() {
    document.getElementById('div-tasks-to-do').innerHTML = '';
    document.getElementById('div-tasks-in-progress').innerHTML = '';
    document.getElementById('div-tasks-await-feedback').innerHTML = '';
    document.getElementById('div-tasks-done').innerHTML = '';
}

function noTasksToDo() {
    if (tasksTodo == 0) document.getElementById('div-tasks-to-do').innerHTML = noTasksToDoHtml();
    if (tasksInProgress == 0) document.getElementById('div-tasks-in-progress').innerHTML = noTasksToDoHtml();
    if (tasksAwaitFeedback == 0) document.getElementById('div-tasks-await-feedback').innerHTML = noTasksToDoHtml();
    if (tasksDone == 0) document.getElementById('div-tasks-done').innerHTML = noTasksToDoHtml();
}

function noTasksToDoHtml() {
    return '<div class="no-tasks">No tasks To do</div>';
}

function renderTaskCards(inputSearch) {
    if (inputSearch) {
        inputSearch.forEach(tasks => {
            renderTasksInCategory(tasks)
        });
    }
    else {
        userTasks.forEach(tasks => {
            renderTasksInCategory(tasks)
        });
    }
}

function renderTasksInCategory(tasks){
    if (tasks.task == 'todo') { document.getElementById('div-tasks-to-do').innerHTML += renderTaskCardHtml(tasks) };
    if (tasks.task == 'inprogress') { document.getElementById('div-tasks-in-progress').innerHTML += renderTaskCardHtml(tasks) };
    if (tasks.task == 'awaitfeedback') { document.getElementById('div-tasks-await-feedback').innerHTML += renderTaskCardHtml(tasks) };
    if (tasks.task == 'done') { document.getElementById('div-tasks-done').innerHTML += renderTaskCardHtml(tasks) };
}

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

function renderTaskCardHtml(task) {
    let backgroundColor;
    (task.category == 'User Story')? backgroundColor = '#0038ff' : backgroundColor = '#1FD7C1';
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

function getAssignTo(task) {
    let output = '';
    task.assigned_to.forEach(at => {
        output += ` <div class="task-card-footer-assigned" style="background-color:${at.color};">
                        ${at.inizials}
                    </div>`;
    });
    return output;

}



function renderSingleTaskCard(taskId) {
    clearSingleTaskCard();
    setSingleTasCardContent(taskId);

}

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

function setSingleTasCardContent(taskId) {
    for (let i = 0; i < userTasks.length; i++) {
        if (userTasks[i].taskId == taskId) {
            let dateSplit = userTasks[i].date.split('-');
            let dateOutput = dateSplit[2] + "/" + dateSplit[1] + "/" + dateSplit[0];
            let backgroundColor;
            (userTasks[i].category == 'User Story')? backgroundColor = '#0038ff' : backgroundColor = '#1FD7C1';
            console.log(backgroundColor);

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

function changeSubtaskDone(taskPosition, subTaskPosition) {
    userTasks[taskPosition].subtasks[subTaskPosition].done = !userTasks[taskPosition].subtasks[subTaskPosition].done
    renderSingleTaskCard(userTasks[taskPosition].taskId);
    saveChangesTaskChanges(userTasks[taskPosition].taskId, userTasks[taskPosition]);
    renderHtml();
}

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

function deleteTask(i) {
    deleteTaskFromBackend(userTasks[i].taskId);
    userTasks.splice(i, 1);
    slideOut('task-card-slide');
    setAmounts();
    renderHtml();
}

function moveTo(taskId) {
    currentDraggedElement = taskId;
}

function allowDrop(ev) {
    ev.preventDefault();
}

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

function showDropArea(section) {
    document.getElementById(section).classList.add('drag-area-shown');
}

function hideDropArea(section) {
    document.getElementById(section).classList.remove('drag-area-shown');
}

function seachEventListener() {
    document.getElementById('input-boad-search').addEventListener('input', function () {
        clearTaskCardContainer();
        let inputSearch = document.getElementById('input-boad-search').value.toLowerCase();
        let filteredTasks = filterTasksByTitle(inputSearch);
        renderTaskCards(filteredTasks);
    });
}

function filterTasksByTitle(inputSearch) {
    return userTasks.filter(userTasks => userTasks.title.toLowerCase().includes(inputSearch));
}

function editTask(taskPositionInArray){
    document.getElementById('editShowSubtasks').innerHTML = '';
    slideOut('task-card-slide');
    slideIn('task-card-slide-edit');
    userTasks[taskPositionInArray].subtasks.forEach(subtask => {
        addSubtask.push(subtask);
    });
    userTasks[taskPositionInArray].assigned_to.forEach(function(assignedTo,i) {
        addAssignedTo.push(assignedTo);
    });
    document.getElementById('editTaskDate').min = new Date().toISOString().split('T')[0];
    document.getElementById('editTaskDate').value = userTasks[taskPositionInArray].date;
    document.getElementById('editAddTaskAsignedTo').innerHTML = `
    <div class="addTaskAssignedToSelectDefault" id="editAddTaskAssignedToSelectDefault"
    onclick="openContactsAssignedTo(true,${taskPositionInArray})">Select contacts to assign</div>`;
    changeDefaultAssignedTo(true);
    removeSelection(selected, true);
    selected = userTasks[taskPositionInArray].prio;
    addSelection(userTasks[taskPositionInArray].prio, true);
    document.getElementById('editTaskTitle').value = userTasks[taskPositionInArray].title;
    document.getElementById('editTaskDescription').value = userTasks[taskPositionInArray].description;
    showSubtasks(true);
    document.getElementById('editTaskOkButton').innerHTML = `<button onclick="saveEditTask(${taskPositionInArray})" class="btn-edit-ok">OK<img src="./assets/icons/check.png"></button>`;
    
}

async function saveEditTask(taskArrayPosition) {
    let uploadTask = userTasks[taskArrayPosition];
    uploadTask.title = document.getElementById('editTaskTitle').value;
    uploadTask.description = document.getElementById('editTaskDescription').value;
    uploadTask.prio = selected;
    uploadTask.date = document.getElementById('editTaskDate').value;
    uploadTask.assigned_to = [...addAssignedTo];
    uploadTask.subtasks = [...addSubtask];
    await loadTasksFromBackend();
    tasks.forEach(function(task,i) {
        if(task.taskId == uploadTask.taskId) {
            tasks.splice(i,1,uploadTask);
        }
    });
    await setItem('tasks', tasks);
    addAssignedTo = [];
    selected = 'medium';
    tasks = [];
    slideOut('task-card-slide-edit');
    renderHtml();
}