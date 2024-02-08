const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';
const STORAGE_TOKEN = 'UU4RB7BRPN2YSGRZ06XDWN8DMCNIQREQNQAJ6DYF';

/**
 * Asynchronously sets an item in the storage.
 *
 * @param {string} key - The key of the item to be set
 * @param {any} value - The value of the item to be set
 * @return {Promise<any>} A Promise that resolves to the JSON representation of the response
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };

    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

/**
 * Asynchronously retrieves an item from the storage using the provided key.
 *
 * @param {string} key - The key used to retrieve the item from the storage.
 * @return {Promise} A promise that resolves to the value of the retrieved item.
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) {
            return res.data.value;
        }
        else {
            console.log("error");
        }
    });
}

/**
 * Asynchronously retrieves user data from the session storage.
 */
async function getUserDataFromSessionStorage() {
    loggedInUser = JSON.parse(sessionStorage.getItem('user'));
}

/**
 * Asynchronously loads user tasks from the backend and filters them based on the logged in user.
 */
async function loadUserTasks() {
    userTasks = [];
    await loadTasksFromBackend();
    tasks.forEach(task => {
        if (task.autor == loggedInUser.id) {
            let fetchTasks = new Task;
            fetchTasks.taskId = task.taskId;
            fetchTasks.autor = loggedInUser.id;
            fetchTasks.title = task.title;
            fetchTasks.description = task.description;
            fetchTasks.assigned_to = task.assigned_to;
            fetchTasks.date = task.date;
            fetchTasks.prio = task.prio;
            fetchTasks.category = task.category;
            fetchTasks.subtasks = task.subtasks;
            fetchTasks.task = task.task;
            userTasks.push(fetchTasks);
        }
    });
    tasks = [];
}

/**
 * Save tasks to backend after loading tasks, setting task ID, and updating the tasks list.
 *
 * @param {Object} taskToSave - the task to save to the backend
 */
async function saveTasksToBackend(taskToSave) {
    await loadTasksFromBackend();
    taskToSave.taskId = setTaskId();
    tasks.push(taskToSave);
    await setItem('tasks', tasks);
    tasks = [];
}

/**
 * Asynchronously loads tasks from the backend.
 */
async function loadTasksFromBackend() {
    tasks = JSON.parse(await getItem('tasks'));
}

/**
 * Generates a new task ID based on the existing tasks.
 *
 * @return {number} The new task ID
 */
function setTaskId() {
    if (tasks.length > 0) {
        return Number(tasks[tasks.length - 1].taskId) + 1;
    }
    else {
        return 1;
    }
}

/**
 * Save changes to a task and update its position.
 *
 * @param {string} taskIdFromChangedTask - The ID of the task to be changed
 * @param {object} taskPosition - The position of the task
 */
async function saveChangesTaskChanges(taskIdFromChangedTask, taskPosition){
    await loadTasksFromBackend();
    tasks.forEach(function (task,i) {
        if(task.taskId == taskIdFromChangedTask){
            tasks.splice(i,1,taskPosition);
        }
    });
    await setItem('tasks', tasks);
}

/**
 * Deletes a task from the backend based on the provided taskId.
 *
 * @param {string} taskId - The ID of the task to be deleted.
 */
async function deleteTaskFromBackend(taskId){
    await loadTasksFromBackend();
    tasks.forEach(function(task, i) {
        if(task.taskId == taskId){
            tasks.splice(i,1);
        }
    });
    await setItem('tasks', tasks);
}

/**
 * Asynchronously loads contacts from the backend.
 */
async function loadContactsFromBackend() {
    allContacts = JSON.parse(await getItem('contacts'));
}

/**
 * Asynchronously creates a contact to save.
 *
 * @param {Object} contact - the contact to be created and saved
 */
async function createContactToSave(contact) {
    await loadContactsFromBackend();
    contact.id = allContacts.length;
    allContacts.push(contact);
    await saveContactsToBackend();
    allContacts = [];
}

/**
 * Asynchronously loads the user's contacts from the backend and filters them based on the logged in user's ID.
 */
async function loadUsersContacts() {
    userContacts = [];
    await loadContactsFromBackend();

    allContacts.forEach(uc => {
        if (uc.assignedTo == loggedInUser.id) {
            let fetchContacts = new Contact;
            fetchContacts.id = uc.id;
            fetchContacts.firstName = uc.firstName
            fetchContacts.lastName = uc.lastName;
            fetchContacts.eMail = uc.eMail;
            fetchContacts.phone = uc.phone;
            fetchContacts.assignedTo = uc.assignedTo;
            fetchContacts.color = uc.color;
            fetchContacts.inizials = uc.inizials;
            userContacts.push(fetchContacts);
        }
    });
    allContacts = [];
}

/**
 * Saves the contacts to the backend asynchronously.
 *
 */
async function saveContactsToBackend(){
    await setItem('contacts', allContacts);
}