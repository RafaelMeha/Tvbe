function validarNumero(input){
    //Remove qualquer caractere que não seja um número
    input.value = input.value.replace(/[^0-9]/g, '');
}

function validarLetras(input){
    //Remove qualquer caractere que não seja uma letra (maiúscula ou minúscula)
    input.value = input.value.replace(/[^A-Za-z]/g, '');
}