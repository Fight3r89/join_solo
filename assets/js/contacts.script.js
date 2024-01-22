let toggleSingleContact = 0;

async function init() {
    await includeHTML();
    navChangeColor();
    await getUserDataFromLocalStorage();

}

function navChangeColor(){
    document.getElementById('nav-contacts').classList.add('link-active');
    document.getElementById('nav-contacts').onclick = null;
}

function slideIn(container){
    if(container == 'single-contact' && !document.getElementById('single-contact-container').classList.contains('d-none')){
        setTimeout (function(){
            document.getElementById('single-contact-container').classList.add('d-none');
        },20);
        
    }
    document.getElementById(container+'-container').classList.remove('d-none');
    document.getElementById(container).style.right = '0';
    document.getElementById(container).style.animation = 'slide_in 0.3s ease-out';
}

function slideOut(container){
    document.getElementById(container).style.animation = 'slide_out 0.3s ease-out';
    setTimeout (function(){
        document.getElementById(container+'-container').classList.add('d-none');
        document.getElementById(container).style.right = '-150%';
    },280);
    
    
    
}
