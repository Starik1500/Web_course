const planeForm = document.getElementById('planeForm');
const pnameInput = document.getElementById('pname');
const ppassengersInput = document.getElementById('ppassengers');
const poilInput = document.getElementById('poil');
const submitButton = document.getElementById('submitPlane');

async function createPlane(event) {
    event.preventDefault();

    const newPlane = {
        name: pnameInput.value, 
        passengers: parseInt(ppassengersInput.value), 
        fuelCapacity: parseInt(poilInput.value), 
        image: '/images/boeing_747.png' 
    };

    try {
        const response = await fetch('/planes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPlane)
        });

        if (response.ok) {
            alert('Літак успішно створено!');
            planeForm.reset();
        } else {
            alert('Виникла помилка при створенні літака');
        }
    } catch (error) {
        console.error('Error creating plane:', error);
    }
}

submitButton.addEventListener('click', createPlane);
