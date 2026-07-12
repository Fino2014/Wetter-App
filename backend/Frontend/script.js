const button = document.getElementById('wetter-btn');
const output = document.getElementById('wetter-output');

const chatButton = document.getElementById('chat-btn');
const chatInput = document.getElementById('chat-input');
const chatOutput = document.getElementById('chat-output');

// Normaler Wetter-Button
button.addEventListener('click', () => {
    const stadt = document.getElementById('stadt-input').value || 'Bochum';
    const coldSensitive = document.getElementById('cold-sensitive').checked;
    const sporty = document.getElementById('sporty').checked;

    output.innerHTML = "Lade personalisierte Empfehlung...";

    fetch(`http://localhost:3000/api/weather?stadt=${stadt}&coldSensitive=${coldSensitive}&sporty=${sporty}`)
        .then(response => response.json())
        .then(data => {
            output.innerHTML = `
                <div style="text-align: left; background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; margin-top: 15px;">
                    <strong>📍 Stadt:</strong> ${data.stadt}<br>
                    <strong>🌡️ Temperatur:</strong> ${data.temperatur}<br>
                    <strong>🌤️ Zustand:</strong> ${data.wetter}<br>
                    <hr style="border: 0; border-top: 1px solid #ccc; margin: 10px 0;">
                    <strong>💡 WetterWise Empfehlung:</strong><br>
                    <em style="color: #4a148c; font-weight: bold;">"${data.hinweis}"</em>
                </div>
            `;
        })
        .catch(error => {
            output.innerText = "Fehler beim Laden der Daten vom Backend.";
            console.error(error);
        });
});

// Chat-Frage-Button
chatButton.addEventListener('click', () => {
    const frage = chatInput.value;
    const stadt = document.getElementById('stadt-input').value || 'Bochum';
    const coldSensitive = document.getElementById('cold-sensitive').checked;
    const sporty = document.getElementById('sporty').checked;

    if (!frage) {
        chatOutput.innerText = "Bitte gib zuerst eine Frage ein!";
        return;
    }

    chatOutput.innerHTML = "🤖 WetterWise KI überlegt...";

    fetch('http://localhost:3000/api/weather/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frage, stadt, coldSensitive, sporty })
    })
    .then(response => response.json())
    .then(data => {
        chatOutput.innerHTML = `
            <div style="background: #ede7f6; padding: 12px; border-left: 5px solid #4a148c; border-radius: 4px; text-align: left; margin-top: 10px;">
                <strong>Antwort:</strong> ${data.antwort}
            </div>
        `;
    })
    .catch(error => {
        chatOutput.innerText = "Fehler bei der KI-Verarbeitung.";
        console.error(error);
    });
});

// --- NEU: Automatische Standorterkennung beim Laden der Seite (GPS) ---
window.addEventListener('DOMContentLoaded', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            try {
                // Sende die Koordinaten an das Backend, um die Stadt zu ermitteln
                const response = await fetch(`http://localhost:3000/api/weather/gps?lat=${lat}&lon=${lon}`);
                const data = await response.json();
                
                if (data.stadt) {
                    // Setze die erkannte Stadt automatisch in das Input-Feld!
                    document.getElementById('stadt-input').value = data.stadt;
                    console.log(`Standort automatisch erkannt: ${data.stadt}`);
                    
                    // Lade direkt automatisch die Wetterdaten für die erkannte Stadt
                    button.click();
                }
            } catch (error) {
                console.error("Fehler bei der GPS-Erkennung im Backend:", error);
            }
        }, (error) => {
            console.log("GPS-Freigabe vom Nutzer abgelehnt oder nicht verfügbar.");
        });
    }
});