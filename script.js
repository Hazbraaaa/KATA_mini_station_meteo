// init variables

const searchButton = document.querySelector("#search-button");
const cityInput = document.querySelector("#cityInput");
const city = document.querySelector("#city");
const gps = document.querySelector("#gps");


// init functions

async function fetchCoordinates(cityName) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${cityName}&format=json&addressdetails=1&limit=1`);
        const data = await response.json();

        city.innerText = data[0].address.city;
        gps.innerText = `Coordonnées GPS: ${data[0].lat}, ${data[0].lon}`;
    } catch (error) {
        console.error(error);
        city.innerText = "Ville non trouvée";
        gps.innerText = "-";
    }
}


// execute code

searchButton.addEventListener('click', () => {
    let cityName = cityInput.value;

    fetchCoordinates(cityName);
})