let planes = [];
fetchPlanes();
const planeContainer = document.getElementById('plane_container');
const passengerCountSpan = document.getElementById('passenger_count');
const summaryVolumeTanks = document.getElementById('summary_volumetanks');
const findInput = document.getElementById('find_input');
const findButton = document.getElementById('find_button');
const cancelButton = document.getElementById('cancel_button');
const sortSelect = document.getElementById('sort_select');

const addPlaneForm = document.getElementById('planeForm');
const planeNameInput = document.getElementById('pname');
const planePassengersInput = document.getElementById('ppassengers');
const planeFuelInput = document.getElementById('poil');

let filteredPlanes = [];

async function fetchPlanes() {
  try {
    const response = await fetch('/planes');
    const data = await response.json();
    filteredPlanes = data.planes;
    displayPlanes(filteredPlanes);
    calculateSummary(filteredPlanes);
  } catch (error) {
    console.error('Error fetching planes:', error);
  }
}

function displayPlanes(planeList) {
  planeContainer.innerHTML = ''; 
  if (planeList.length === 0) {
    planeContainer.innerHTML = '<li>Немає доступних літаків.</li>';
    return;
  }
  planeList.forEach(plane => {
      let planeItem = document.createElement('li');
      planeItem.classList.add('item-card');
      let image = plane.image ? plane.image : '/images/boeing_747.png';
      planeItem.innerHTML = `
          <img src="${image}" class="item-card__image" alt="${plane.id}">
          <div class="item-card__body">
              <h3 class="item-card__title">${plane.name}</h3>
              <p class="item-card__text">Кількість пасажирів: ${plane.passengers}</p>
              <p class="item-card__text">Об'єм палива: ${plane.fuelCapacity} літрів</p>
              <button class="item-card__edit-button">
              <a href="html/edit_plane.html?id=${plane.id}&passengers=${plane.passengers}&fuel=${plane.fuelCapacity}">Змінити</a>
              </button>
              <button class="item-card__delete-button">Видалити</button>
          </div>
      `;
      const deleteButton = planeItem.querySelector('.item-card__delete-button');
      deleteButton.addEventListener('click', () => deletePlane(plane.id));
      
      planeContainer.appendChild(planeItem);
  });
}

async function addPlane(event) {
  event.preventDefault();

  const newPlane = {
    id: planes.length ? planes[planes.length - 1].id + 1 : 1,
    name: planeNameInput.value,
    passengers: parseInt(planePassengersInput.value),
    fuelCapacity: parseInt(planeFuelInput.value),
    image: '/images/boeing_747.png'
  };
  try {
      const response = await fetch('/planes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPlane)
      });
      if (response.ok) {
        console.log('Новий літак додано!');
        fetchPlanes();
        addPlaneForm.reset();
      }
  } catch (error) {
      console.error('Помилка додавання літака:', error);
  }
}

async function updatePlane(id, updatedPlane) {
  try {
      const response = await fetch(`/planes/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPlane)
      });
      if (response.ok) {
        console.log('Літак оновлено');
        fetchPlanes();
      } else {
        console.error('Помилка оновлення літака:', response.statusText);
      }
  } catch (error) {
      console.error('Помилка оновлення літака:', error);
  }
}

async function deletePlane(id) {
  try {
    const response = await fetch(`/planes/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      console.log(`Літак з ID ${id} видалено`);
      fetchPlanes();
    } else {
      console.error(`Не вдалося видалити літак з ID ${id}`);
    }
  } catch (error) {
    console.error('Error deleting plane:', error);
  }
}


function calculateSummary(planeList) {
  let totalPassengers = planeList.reduce((acc, plane) => acc + plane.passengers, 0);
  let totalFuelCapacity = planeList.reduce((acc, plane) => acc + plane.fuelCapacity, 0);

  passengerCountSpan.textContent = totalPassengers;
  summaryVolumeTanks.textContent = `Загальний обсяг баків: ${totalFuelCapacity} літрів`;
}

async function searchPlanes() {
  let query = findInput.value.trim().toLowerCase();
  let url = `/planes?searchQuery=${encodeURIComponent(query)}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    filteredPlanes = data.planes;
    displayPlanes(filteredPlanes);
    calculateSummary(filteredPlanes);
  } catch (error) {
    console.error('Error searching planes:', error);
  }
}

function clearSearch() {
  findInput.value = '';
  fetchPlanes();
}

async function sortPlanes() {
  let selectedValue = sortSelect.value;
  let query = findInput.value.trim().toLowerCase();
  let url = `/planes?searchQuery=${encodeURIComponent(query)}&sortBy=${encodeURIComponent(selectedValue)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    filteredPlanes = data.planes;
    displayPlanes(filteredPlanes);
    calculateSummary(filteredPlanes);
  } catch (error) {
    console.error('Error sorting planes:', error);
  }
}

findButton.addEventListener('click', searchPlanes);
cancelButton.addEventListener('click', clearSearch);
sortSelect.addEventListener('change', sortPlanes); 