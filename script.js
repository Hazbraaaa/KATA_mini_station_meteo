// init variables

const searchButton = document.querySelector("#search-button");
const cityInput = document.querySelector("#cityInput");
const city = document.querySelector("#city");
const gps = document.querySelector("#gps");
const temperature = document.querySelector("#temperature");
const details = document.querySelector("#details");
const humidity = document.querySelector("#humidity");
const precipitation = document.querySelector("#precipitation");
const lastThreeDays = document.querySelector("#last-three-days");
const canvasContainer = document.querySelector(".canvas-container")
let tempChart = new Chart(lastThreeDays, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: '°C',
            data: [],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// init functions

async function fetchCoordinates(cityName) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${cityName}&format=json&addressdetails=1&limit=1`);
        const data = await response.json();

        city.innerText = data[0].name;
        gps.innerText = `Coordonnées GPS: ${data[0].lat}, ${data[0].lon}`;
        fetchWeather(data[0].lat, data[0].lon);
        fetchLastThreeTemp(data[0].lat, data[0].lon);
    } catch (error) {
        console.error(error);
        city.innerText = "Ville non trouvée";
        gps.innerText = "-";
        temperature.innerText = "-°C";
        humidity.innerText = "-%";
        precipitation.innerText = "-mm";
        details.innerText = "Vérifier le nom de la ville";
    }
}

async function fetchWeather(lat, lon) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,relative_humidity_2m`);
        const data = await response.json();

        temperature.innerText = `${data.current.temperature_2m}°C`;
        humidity.innerText = `${data.current.relative_humidity_2m}%`;
        precipitation.innerText = `${data.current.precipitation}mm`;
        details.innerText = "Température actuelle";
    } catch (error) {
        console.error(error);
        temperature.innerText = "-°C";
        humidity.innerText = "-%";
        precipitation.innerText = "-mm";
    }
}

async function fetchLastThreeTemp(lat, lon) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation&past_days=2`);
        const data = await response.json();

        canvasContainer.style = "visibility: visible;";
        tempChart.destroy();
        tempChart = new Chart(lastThreeDays, {
            type: 'bar',
            data: {
                labels: data.hourly.time,
                datasets: [{
                    label: '°C',
                    data: data.hourly.temperature_2m,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
}

// execute code

searchButton.addEventListener('click', () => {
    let cityName = cityInput.value;

    fetchCoordinates(cityName);
})