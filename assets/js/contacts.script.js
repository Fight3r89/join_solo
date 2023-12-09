async function init() {
    await includeHTML();
    navChangeColor();
}

function navChangeColor(){
    document.getElementById('nav-contacts').classList.add('link-active');
    document.getElementById('nav-contacts').onclick = null;
}

function slideIn(){
    document.getElementById('contacts-add-card-container').classList.remove('d-none');
    document.getElementById('contacts-add-card').style.right = '16px';
    document.getElementById('contacts-add-card').style.animation = 'slide_in 0.3s ease-out';
}

function slideOut(){
    document.getElementById('contacts-add-card').style.animation = 'slide_out 0.3s ease-out';
    setTimeout (function(){
        document.getElementById('contacts-add-card-container').classList.add('d-none');
        document.getElementById('contacts-add-card').style.right = '-150%';
    },280);
    
    
    
}
