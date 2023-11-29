document.getElementById('menu-phone-button').addEventListener('change', () => {
    if(document.getElementById('menu-phone-button').checked){
        document.body.style.overflow = 'hidden';
    }else{
        document.body.style.overflow = 'auto';
    }
})