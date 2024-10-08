const pnameInput = document.getElementById('pname');
const ppassengersInput = document.getElementById('ppassengers');
const poilInput = document.getElementById('poil');

document.getElementById('submitPlane').addEventListener('click', () => {
    const name = pnameInput.value.trim();
    const passengers = parseInt(ppassengersInput.value);
    const fuelCapacity = parseInt(poilInput.value);

    let planes = JSON.parse(localStorage.getItem('planes')) || [];
    if (planes.some(plane => plane.name.toLowerCase() === name.toLowerCase())) {
        alert('Літак з такою назвою вже існує!');
        return;
    }

    if (!name || passengers < 0 || fuelCapacity < 0 || isNaN(passengers) || isNaN(fuelCapacity)) {
        alert('Будь ласка, заповніть всі поля коректно. Кількість пасажирів і об\'єм пального не можуть бути від\'ємними!');
        return;
    }

    const newPlane = { name, passengers, fuelCapacity, image: '/images/boeing_777.png' };

    planes.push(newPlane);

    localStorage.setItem('planes', JSON.stringify(planes));

    alert('Ваш літак успішно створений');

    window.location.href = '/index.html';
});
