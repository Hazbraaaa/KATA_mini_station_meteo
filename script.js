// init variables

const searchButton = document.querySelector("#search-button");
const cityInput = document.querySelector("#cityInput");
const city = document.querySelector("#city");
const gps = document.querySelector("#gps");
const temperature = document.querySelector("#temperature");
const details = document.querySelector("#details");
const humidity = document.querySelector("#humidity");
const precipitation = document.querySelector("#precipitation");


// init functions

async function fetchCoordinates(cityName) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${cityName}&format=json&addressdetails=1&limit=1`);
        const data = await response.json();

        if (data[0].addresstype === "city") {
            city.innerText = data[0].address.city;
        }
        else if (data[0].addresstype === "town") {
            city.innerText = data[0].address.town;
        }
        else if (data[0].addresstype === "village") {
            city.innerText = data[0].address.village;
        }
        gps.innerText = `Coordonnées GPS: ${data[0].lat}, ${data[0].lon}`;
        fetchWeather(data[0].lat, data[0].lon);
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


// execute code

searchButton.addEventListener('click', () => {
    let cityName = cityInput.value;

    fetchCoordinates(cityName);
})