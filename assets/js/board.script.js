async function init() {
    await includeHTML();
    navChangeColor();
}

function navChangeColor(){
    document.getElementById('nav-board').classList.add('link-active');
    document.getElementById('nav-board').onclick = null;
}

function slideIn(){
    document.getElementById('addtask-card-container').classList.remove('d-none');
    document.getElementById('addtask-card').style.right = '16px';
    document.getElementById('addtask-card').style.animation = 'slide_in 0.3s ease-out';
}

function slideOut(){
    document.getElementById('addtask-card').style.animation = 'slide_out 0.3s ease-out';
    setTimeout (function(){
        document.getElementById('addtask-card-container').classList.add('d-none');
        document.getElementById('addtask-card').style.right = '-150%';
    },280);
}