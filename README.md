# Wetter-App
KI-gestützte Wetter-App, die aktuelle Wetterdaten mit persönlichen Vorlieben wie Temperatur- und Pollenempfinden kombiniert. Beantwortet individuelle Fragen wie „Brauche ich heute Abend eine Jacke?“ basierend auf deinem Profil und der aktuellen Wetterlage.

# Ausführung der code

 Stellen Sie sich sicher, dass Node Js auf Ihrem PC installiert wird, bevor Sie foldende Fehle ausführen :


kannst du den neuen Endpunkt so testen:
- cd backend 
- npm run start:dev

✅ Richtige Anfragen:

Ohne KI (nur Wetter):
- http://localhost:3000/weather?city=berlin
- http://localhost:3000/weather?city=münchen
- http://localhost:3000/weather?city=hamburg

Mit KI:
- http://localhost:3000/ai/advice?city=berlin&question=Brauche ich einen Regenschirm?
- http://localhost:3000/ai/advice?city=münchen&question=Soll ich Fahrrad fahren?
- http://localhost:3000/ai/advice?city=hamburg&question=Was soll ich anziehen?


❌ Falsche Anfragen:

Ohne KI:
- http://localhost:3000/weather?city=paris
- http://localhost:3000/weather?city=
- http://localhost:3000/weather

Mit KI:
- http://localhost:3000/ai/advice?city=tokio&question=Wie ist das Wetter?
- http://localhost:3000/ai/advice?city=berlin
- http://localhost:3000/ai/advice
