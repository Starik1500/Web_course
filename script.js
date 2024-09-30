let planes = [
  { name: "Boeing 747", passengers: 416, fuelCapacity: 238840, image: '/images/boeing_747.png' },
  { name: "Boeing 777", passengers: 396, fuelCapacity: 181283, image: '/images/boeing_777.png' },
  { name: "Boeing 787", passengers: 242, fuelCapacity: 126206, image: '/images/boeing_787.png' },
  { name: "Airbus A350", passengers: 350, fuelCapacity: 156000, image: '/images/airbus_a350.png' },
  { name: "Airbus A380", passengers: 555, fuelCapacity: 320000, image: '/images/airbus_a380.png' },
  { name: "Cessna 172", passengers: 4, fuelCapacity: 212, image: '/images/cessna_172.png' },
  { name: "Concorde", passengers: 100, fuelCapacity: 119500, image: '/images/concorde.png' }
];

const planeContainer = document.getElementById('plane_container');
const passengerCountSpan = document.getElementById('passenger_count');
const summaryVolumeTanks = document.getElementById('summary_volumetanks');
const findInput = document.getElementById('find_input');
const findButton = document.getElementById('find_button');
const cancelButton = document.getElementById('cancel_button');
const sortSelect = document.getElementById('sort_select');

function displayPlanes(planeList) {
  planeContainer.innerHTML = ''; 
  planeList.forEach(plane => {
      let planeItem = document.createElement('li');
      planeItem.classList.add('item-card');
      let image = plane.image ? plane.image : '/images/boeing_747.png';
      planeItem.innerHTML =  `
      <img src="${image}" class="item-card__image" alt="${plane.name}">
      <div class="item-card__body">
          <h3 class="item-card__title">${plane.name}</h3>
          <p class="item-card__text">Кількість пасажирів: ${plane.passengers}</p>
          <p class="item-card__text">Об'єм палива: ${plane.fuelCapacity} літрів</p>
      </div>
  `;
      planeContainer.appendChild(planeItem);
  });
}

function calculateSummary() {
  let totalPassengers = planes.reduce((acc, plane) => acc + plane.passengers, 0);
  let totalFuelCapacity = planes.reduce((acc, plane) => acc + plane.fuelCapacity, 0);

  passengerCountSpan.textContent = totalPassengers;
  summaryVolumeTanks.textContent = `Загальний обсяг баків: ${totalFuelCapacity} літрів`;
}

function searchPlanes() {
  let query = findInput.value.trim().toLowerCase();
  let filteredPlanes = planes.filter(plane => plane.name.toLowerCase().includes(query));
  displayPlanes(filteredPlanes);
}

function clearSearch() {
  findInput.value = '';
  displayPlanes(planes); 
}

function sortPlanes() {
  let selectedValue = sortSelect.value;
  
  let sortedPlanes = [...planes]; 

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
calculateSummary();
