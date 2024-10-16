const urlParams = new URLSearchParams(window.location.search);
const planeName = urlParams.get('id');
const pnameInput = document.getElementById('pname');
const ppassengersInput = document.getElementById('ppassengers');
const poilInput = document.getElementById('poil');
const submitEditButton = document.getElementById('submitEdit');

async function fetchPlane() {
    try {
        const response = await fetch(`/planes/${planeName}`);
        if (response.ok) {
            const plane = await response.json();

            pnameInput.value = plane.name;
            ppassengersInput.value = plane.passengers;
            poilInput.value = plane.fuelCapacity;
        } else {
            alert('Не вдалося завантажити дані про літак');
        }
    } catch (error) {
        console.error('Error fetching plane:', error);
    }
}

async function updatePlane(event) {
    event.preventDefault(); 

    const updatedPlane = {
        name: pnameInput.value.trim(),
        passengers: parseInt(ppassengersInput.value),
        fuelCapacity: parseInt(poilInput.value)
    };

    if (!updatedPlane.name || updatedPlane.passengers < 0 || updatedPlane.fuelCapacity < 0 || isNaN(updatedPlane.passengers) || isNaN(updatedPlane.fuelCapacity)) {
        alert('Будь ласка, заповніть всі поля коректно. Кількість пасажирів і об\'єм пального не можуть бути від\'ємними!');
        return;
    }

    try {
        const response = await fetch(`/planes/${planeName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedPlane)
        });

        if (response.ok) {
            alert('Параметри літака успішно змінені');
            window.location.href = '/index.html';
        } else {
            alert('Не вдалося оновити літак');
        }
    } catch (error) {
        console.error('Error updating plane:', error);
    }
}

submitEditButton.addEventListener('click', updatePlane);

fetchPlane();