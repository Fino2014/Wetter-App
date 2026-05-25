// 1. Elemente aus dem HTML holen
const button = document.getElementById('wetter-btn');
const input = document.getElementById('stadt-input');
const output = document.getElementById('wetter-output');
const empfehlungOutput = document.getElementById('empfehlung-output');

// Checkboxen aus dem Benutzerprofil holen
const checkKaelte = document.getElementById('check-kaelte');
const checkHitze = document.getElementById('check-hitze');
const checkPollen = document.getElementById('check-pollen');

button.addEventListener('click', () => {
    const stadt = input.value.trim();
    
    if (stadt === "") {
        output.innerHTML = "<p style='color: red;'>Bitte gib eine Stadt ein!</p>";
        empfehlungOutput.classList.remove('active');
        return;
    }

    output.innerHTML = "Lade Wetterdaten...";
    empfehlungOutput.classList.remove('active');

    // Schritt A: Stadt in Koordinaten umwandeln
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${stadt}&count=1&language=de&format=json`;

    fetch(geoUrl)
        .then(response => response.json())
        .then(geoData => {
            if (!geoData.results || geoData.results.length === 0) {
                output.innerHTML = "<p style='color: red;'>Stadt nicht gefunden!</p>";
                return;
            }

            const lat = geoData.results[0].latitude;
            const lon = geoData.results[0].longitude;
            const stadtName = geoData.results[0].name;

            // Schritt B: Wetter abrufen (Jetzt MIT Luftfeuchtigkeit & Regenwahrscheinlichkeit!)
            // Wir nutzen 'current' für Temperatur und Luftfeuchtigkeit, und 'hourly' für die Regenwahrscheinlichkeit der nächsten Stunde
            const wetterUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&hourly=precipitation_probability&forecast_days=1`;

            return fetch(wetterUrl)
                .then(response => response.json())
                .then(wetterData => {
                    // Daten aus dem API-Ergebnis herausziehen
                    const temp = wetterData.current.temperature_2m;
                    const feuchtigkeit = wetterData.current.relative_humidity_2m;
                    // Wir nehmen die Regenwahrscheinlichkeit der aktuellen Stunde
                    const regenWahrscheinlichkeit = wetterData.hourly.precipitation_probability[0]; 

                    // Schritt C: Wetterdaten auf der Website anzeigen
                    output.innerHTML = `
                        <h2>${stadtName}</h2>
                        <p class="temp">${temp}°C</p>
                        <p>💧 Luftfeuchtigkeit: ${feuchtigkeit}%</p>
                        <p>🌧️ Regenwahrscheinlichkeit: ${regenWahrscheinlichkeit}%</p>
                    `;

                    // ==========================================
                    // SCHRITT D: PERSONIFIZIERTE EMPFEHLUNGEN (Eure Logik!)
                    // ==========================================
                    let empfehlungen = [];

                    // Regel 1: Regenschirm-Logik (unabhängig vom Profil)
                    if (regenWahrscheinlichkeit > 40) {
                        empfehlungen.push("☔ Es wird wahrscheinlich regnen. Nimm unbedingt einen Regenschirm mit!");
                    }

                    // Regel 2: Kälteempfindlich
                    if (checkKaelte.checked && temp < 18) {
                        empfehlungen.push("🥶 Da du kälteempfindlich bist: Pack dir lieber eine extra warme Jacke ein!");
                    } else if (temp < 12) {
                        empfehlungen.push("🧥 Es ist ziemlich frisch draußen. Eine Jacke ist ratsam.");
                    }

                    // Regel 3: Hitzeempfindlich
                    if (checkHitze.checked && temp > 25) {
                        empfehlungen.push("🥵 Achtung: Es wird heiß! Such dir schattige Plätze und trink genug Wasser.");
                    } else if (temp > 20 && regenWahrscheinlichkeit < 20) {
                        empfehlungen.push("🏃‍♂️ Perfektes Wetter, um draußen eine Runde Sport zu machen!");
                    }

                    // Regel 4: Pollenallergie (Simuliert basierend auf trockenem & warmem Wetter)
                    if (checkPollen.checked && temp > 15 && regenWahrscheinlichkeit < 10) {
                        empfehlungen.push("🤧 Hohes Allergierisiko! Es ist warm und trocken – nimm ggf. deine Allergietabletten mit.");
                    }

                    // Falls keine spezielle Regel anspringt, Standard-Text:
                    if (empfehlungen.length === 0) {
                        empfehlungen.push("☀️ Das Wetter ist unauffällig. Genieße deinen Tag!");
                    }

                    // Die Empfehlungen in die grüne Box schreiben und anzeigen
                    empfehlungOutput.innerHTML = `
                        <h3>💡 Deine persönliche Empfehlung:</h3>
                        <p>${empfehlungen.join('</p><p>')}</p>
                    `;
                    empfehlungOutput.classList.add('active'); // Box sichtbar machen
                });
        })
        .catch(error => {
            console.error("Fehler beim Abrufen der Daten:", error);
            output.innerHTML = "<p style='color: red;'>Fehler beim Laden der Daten.</p>";
        });
});