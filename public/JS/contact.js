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
});

function loadCountries() {
    var select = document.getElementById("countries");

    // Utilizando a API RestCountries para obter a lista de países
    fetch("https://restcountries.com/v3.1/all")
        .then(response => response.json())
        .then(data => {
            // Ordena os países em ordem alfabética
            data.sort((a, b) => a.name.common.localeCompare(b.name.common));

            // Adiciona os países à lista de seleção
            data.forEach(country => {
                var option = document.createElement("option");
                // option.value = country.cca2;
                option.text = country.name.common;
                select.appendChild(option);
            });
        })
        .catch(error => console.error("Erro ao carregar países:", error));
}

// Chama a função para carregar os países quando a página carregar
window.onload = loadCountries;