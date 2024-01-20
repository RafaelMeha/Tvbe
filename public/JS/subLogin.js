const standardButton = document.getElementById('standard-button');
const duoButton = document.getElementById('duo-button');
const familyButton = document.getElementById('family-button');

standardButton.addEventListener('click', function () {
    this.textContent = '✓ Standard Premium';
});

duoButton.addEventListener('click', function () {
    this.textContent = '✓ Duo premium';
});

familyButton.addEventListener('click', function () {
    this.textContent = '✓ Family premium';
});
