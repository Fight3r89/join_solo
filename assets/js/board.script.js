async function init() {
    await getUserDataFromLocalStorage();
    await includeHTML();
    await loadUserTasks();
    navChangeColor();
    setAmounts();
    renderHtml();
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
    if(taskIdOrTask){
        if(typeof taskIdOrTask === 'number') renderSingleTaskCard(taskIdOrTask);
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

function renderTaskCards() {
    userTasks.forEach(tasks => {
        if (tasks.task == 'todo') { document.getElementById('div-tasks-to-do').innerHTML += renderTaskCardHtml(tasks) };
        if (tasks.task == 'inprogress') { document.getElementById('div-tasks-in-progress').innerHTML += renderTaskCardHtml(tasks) };
        if (tasks.task == 'awaitfeedback') { document.getElementById('div-tasks-await-feedback').innerHTML += renderTaskCardHtml(tasks) };
        if (tasks.task == 'done') { document.getElementById('div-tasks-done').innerHTML += renderTaskCardHtml(tasks) };
    });


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
    return `
        <div class="task-card" onclick="slideIn('task-card-slide',${task.taskId})">
            <div class="task-card-category">
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
        let inizials = at.firstName[0] + at.lastName[0];
        output += ` <div class="task-card-footer-assigned">
                        ${inizials}
                    </div>`;
    });
    return output;
    
}



function renderSingleTaskCard(taskId) {
    clearSingleTaskCard();
    setSingleTasCardContent(taskId);

}

function clearSingleTaskCard() {
    document.getElementById('ask-single-card-category').innerHTML = '';
    document.getElementById('task-single-card-headline').innerHTML = '';
    document.getElementById('task-single-card-content').innerHTML = '';
    document.getElementById('task-single-card-date').innerHTML = '';
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

            document.getElementById('ask-single-card-category').innerHTML = userTasks[i].category;
            document.getElementById('task-single-card-headline').innerHTML = userTasks[i].title;
            document.getElementById('task-single-card-content').innerHTML = userTasks[i].description;
            document.getElementById('task-single-card-date').innerHTML = dateOutput;
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
                document.getElementById('task-single-card-subtasks-list').innerHTML += `<p>No Subtasks avalable</p>`;
            }
            if(userTasks[i].assigned_to.length > 0) {
                userTasks[i].assigned_to.forEach(at => {
                    document.getElementById('task-single-card-assignedto-list').innerHTML += `
                        <div class="task-single-card-assignedto-list-card">
                            <div class="task-single-card-assignedto-list-logo">
                            ${at.firstName[0]}${at.lastName[0]}
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
    userTasks.splice(i,1);
    slideOut('task-card-slide');
    setAmounts();
    renderHtml();
}