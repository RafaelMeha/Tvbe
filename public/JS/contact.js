function validarNumero(input){
    //Remove qualquer caractere que não seja um número
    input.value = input.value.replace(/[^0-9]/g, '');
}

function validarLetras(input){
    //Remove qualquer caractere que não seja uma letra (maiúscula ou minúscula)
    input.value = input.value.replace(/[^A-Za-z]/g, '');
}

document.getElementById('send').addEventListener('click', () => {
    var form = document.getElementById("myForm");
    var elements = form.elements;
    var hasEmptyField = false;

    for (var i = 0; i < elements.length; i++) {
        if (elements[i].value === '') {
            elements[i].classList.add('error');
            hasEmptyField = true;
        }else{
            elements[i].classList.add('filled');
        }
    }

    // if (hasEmptyField) {
    //     alert("Please enter all mandatory data!");
    // }
});
