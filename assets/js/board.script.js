async function init() {
    await getUserDataFromLocalStorage();
    await includeHTML();
    await loadUserTasks();
    navChangeColor();
}

function navChangeColor(){
    document.getElementById('nav-board').classList.add('link-active');
    document.getElementById('nav-board').onclick = null;
}

function slideIn(container){
    document.getElementById(container+'-container').classList.remove('d-none');
    document.getElementById(container).style.right = '16px';
    document.getElementById(container).style.animation = 'slide_in 0.3s ease-out';
}

function slideOut(container){
    document.getElementById(container).style.animation = 'slide_out 0.3s ease-out';
    setTimeout (function(){
        document.getElementById(container+'-container').classList.add('d-none');
        document.getElementById(container).style.right = '-150%';
    },280);
}