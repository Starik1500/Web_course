let planes = JSON.parse(localStorage.getItem('planes')) || [
  { name: "Boeing 787", passengers: 242, fuelCapacity: 126206, image: '/images/boeing_787.png' },
  { name: "Airbus A380", passengers: 555, fuelCapacity: 320000, image: '/images/airbus_a380.png' },
  { name: "Concorde", passengers: 100, fuelCapacity: 119500, image: '/images/concorde.png' }
];

const planeContainer = document.getElementById('plane_container');
const passengerCountSpan = document.getElementById('passenger_count');
const summaryVolumeTanks = document.getElementById('summary_volumetanks');
const findInput = document.getElementById('find_input');
const findButton = document.getElementById('find_button');
const cancelButton = document.getElementById('cancel_button');
const sortSelect = document.getElementById('sort_select');

let filteredPlanes = [...planes];

function displayPlanes(planeList) {
  planeContainer.innerHTML = ''; 
  planeList.forEach(plane => {
      let planeItem = document.createElement('li');
      planeItem.classList.add('item-card');
      let image = plane.image ? plane.image : '/images/boeing_747.png';
      planeItem.innerHTML = `
          <img src="${image}" class="item-card__image" alt="${plane.name}">
          <div class="item-card__body">
              <h3 class="item-card__title">${plane.name}</h3>
              <p class="item-card__text">Кількість пасажирів: ${plane.passengers}</p>
              <p class="item-card__text">Об'єм палива: ${plane.fuelCapacity} літрів</p>
              <button class="item-card__edit-button">
              <a href="html/edit_plane.html?id=${plane.name}&passengers=${plane.passengers}&fuel=${plane.fuelCapacity}">Змінити</a>
              </button>
              <button class="item-card__delete-button">Видалити</button>
          </div>
      `;
      const deleteButton = planeItem.querySelector('.item-card__delete-button');
      deleteButton.addEventListener('click', () => deletePlane(plane.name));
      
      planeContainer.appendChild(planeItem);
  });
}

function deletePlane(name) {
  planes = planes.filter(plane => plane.name !== name);
  filteredPlanes = planes;
  localStorage.setItem('planes', JSON.stringify(planes));
  displayPlanes(filteredPlanes);
  calculateSummary(filteredPlanes); 
  console.log(`Літак ${name} видалено`);
}

function calculateSummary(planeList) {
  let totalPassengers = planeList.reduce((acc, plane) => acc + plane.passengers, 0);
  let totalFuelCapacity = planeList.reduce((acc, plane) => acc + plane.fuelCapacity, 0);

  passengerCountSpan.textContent = totalPassengers;
  summaryVolumeTanks.textContent = `Загальний обсяг баків: ${totalFuelCapacity} літрів`;
}

function searchPlanes() {
  let query = findInput.value.trim().toLowerCase();
  filteredPlanes = planes.filter(plane => plane.name.toLowerCase().includes(query));
  displayPlanes(filteredPlanes);
  calculateSummary(filteredPlanes);
}

function clearSearch() {
  findInput.value = '';
  filteredPlanes = [...planes];
  displayPlanes(filteredPlanes); 
  calculateSummary(filteredPlanes); 
}

function sortPlanes() {
  let selectedValue = sortSelect.value;

  let sortedPlanes = [...filteredPlanes];

  if (selectedValue === 'name') {
      sortedPlanes.sort((a, b) => a.name.localeCompare(b.name));
  } else if (selectedValue === 'fuel') {
      sortedPlanes.sort((a, b) => a.fuelCapacity - b.fuelCapacity);
  }

  displayPlanes(sortedPlanes); 
}

findButton.addEventListener('click', searchPlanes);
cancelButton.addEventListener('click', clearSearch);
sortSelect.addEventListener('change', sortPlanes); 

displayPlanes(planes);
calculateSummary(planes);
