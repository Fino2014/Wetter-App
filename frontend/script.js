const button = document.getElementById('wetter-btn');
const input = document.getElementById('stadt-input');
const output = document.getElementById('wetter-output');

button.addEventListener('click', () => {
    const stadt = input.value.trim();
    
    if (stadt === "") {
        output.innerHTML = "<p style='color: red;'>Bitte gib eine Stadt ein!</p>";
        return;
    }

    output.innerHTML = "Lade Wetterdaten...";

    // 1. Schritt: Wir müssen die Stadt in Koordinaten (Breitengrad/Längengrad) umwandeln (Geocoding)
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${stadt}&count=1&language=de&format=json`;

    fetch(geoUrl)
        .then(response => response.json())
        .then(geoData => {
            if (!geoData.results || geoData.results.length === 0) {
                output.innerHTML = "<p style='color: red;'>Stadt nicht gefunden!</p>";
                return;
            }

            // Koordinaten der gefundenen Stadt auslesen
            const lat = geoData.results[0].latitude;
            const lon = geoData.results[0].longitude;
            const stadtName = geoData.results[0].name;

            // 2. Schritt: Mit den Koordinaten fragen wir das echte Wetter ab
            const wetterUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

            return fetch(wetterUrl)
                .then(response => response.json())
                .then(wetterData => {
                    const temp = wetterData.current_weather.temperature;
                    const wind = wetterData.current_weather.windspeed;

                    // 3. Schritt: Die Daten schön im HTML anzeigen
                    output.innerHTML = `
                        <h2>${stadtName}</h2>
                        <p class="temp">${temp}°C</p>
                        <p>Windgeschwindigkeit: ${wind} km/h</p>
                    `;
                });
        })
        .catch(error => {
            console.error("Fehler beim Abrufen der Daten:", error);
            output.innerHTML = "<p style='color: red;'>Fehler beim Laden der Daten. Versuche es später noch einmal.</p>";
        });
});