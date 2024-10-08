const urlParams = new URLSearchParams(window.location.search);
const planeName = urlParams.get('id');

let planes = JSON.parse(localStorage.getItem('planes')) || [];

const planeToEdit = planes.find(plane => plane.name === planeName);

if (planeToEdit) {
    document.getElementById('pname').value = planeToEdit.name;
    document.getElementById('ppassengers').value = planeToEdit.passengers;
    document.getElementById('poil').value = planeToEdit.fuelCapacity;
}

document.getElementById('submitEdit').addEventListener('click', function() {
    const newName = document.getElementById('pname').value.trim();
    const newPassengers = parseInt(document.getElementById('ppassengers').value);
    const newFuelCapacity = parseInt(document.getElementById('poil').value);

    if (planes.some(plane => plane.name.toLowerCase() === newName.toLowerCase() && plane.name !== planeName)) {
        alert('Літак з такою назвою вже існує!');
        return;
    }

    if (!newName || newPassengers < 0 || newFuelCapacity < 0 || isNaN(newPassengers) || isNaN(newFuelCapacity)) {
        alert('Будь ласка, заповніть всі поля коректно. Кількість пасажирів і об\'єм пального не можуть бути від\'ємними!');
        return;
    }

    planeToEdit.name = newName;
    planeToEdit.passengers = newPassengers;
    planeToEdit.fuelCapacity = newFuelCapacity;

    localStorage.setItem('planes', JSON.stringify(planes));

    alert('Параметри літачка успішно змінені');

    window.location.href = '/index.html';
});

document.querySelector('button[type="button"]').addEventListener('click', function() {
});
