const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';
const STORAGE_TOKEN = 'UU4RB7BRPN2YSGRZ06XDWN8DMCNIQREQNQAJ6DYF';

async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };

    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) {
            return res.data.value;
        }
    });
}

async function getUserDataFromLocalStorage() {
    loggedInUser = JSON.parse(localStorage.getItem('user'));
}

function saveTask() {
    localStorage.setItem('tasks', JSON.stringify(userTasks));

}

async function loadUserTasks() {
    await loadTasksFromBackend();
    tasks.forEach(task => {
        if (task.autor == loggedInUser.id) {
            let fetchTasks = new Task;
            fetchTasks.taskId = task.taskId;
            fetchTasks.autor = loggedInUser.id;
            fetchTasks.title = task.title;
            fetchTasks.description = task.description;
            fetchTasks.assigned_to.push(task.assigned_to);
            fetchTasks.date = task.date;
            fetchTasks.prio = task.prio;
            fetchTasks.category = task.category;
            fetchTasks.subtasks.push(task.subtasks);
            fetchTasks.task = task.task;
            userTasks.push(fetchTasks);
        }
    });
    tasks = [];
}

async function saveTasksToBackend(taskToSave) {
    await loadTasksFromBackend();
    taskToSave.taskId = setTaskId();
    tasks.push(taskToSave);
    setItem('tasks', tasks);
    tasks = [];
}

async function loadTasksFromBackend() {
    tasks = JSON.parse(await getItem('tasks'));
}

function setTaskId() {
    if (tasks.length > 0) {
        return Number(tasks[tasks.length - 1].taskId) + 1;
    }
    else {
        return 1;
    }
}