import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('api/weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}
  
  // --- NEU: GPS-Schnittstelle zur Standorterkennung ---
  @Get('gps')
  async detectCityByGPS(@Query('lat') lat: string, @Query('lon') lon: string) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    // Koordinaten-Datenbank für eure Projekt-Städte
    // Bochum: ca. 51.48, 7.21 | Essen: ca. 51.45, 7.01 | Bocholt: ca. 51.83, 6.61
    let erkannteStadt = 'Bochum'; // Standard-Fallback

    if (!isNaN(latitude) && !isNaN(longitude)) {
      // Berechne die Nähe zu Essen (vereinfachte Distanzprüfung)
      const distEssen = Math.sqrt(Math.pow(latitude - 51.4556, 2) + Math.pow(longitude - 7.0116, 2));
      // Berechne die Nähe zu Bocholt
      const distBocholt = Math.sqrt(Math.pow(latitude - 51.8373, 2) + Math.pow(longitude - 6.6171, 2));
      // Berechne die Nähe zu Bochum
      const distBochum = Math.sqrt(Math.pow(latitude - 51.4818, 2) + Math.pow(longitude - 7.2162, 2));

      if (distBocholt < distEssen && distBocholt < distBochum) {
        erkannteStadt = 'Bocholt';
      } else if (distEssen < distBochum && distEssen < distBocholt) {
        erkannteStadt = 'Essen';
      } else {
        erkannteStadt = 'Bochum';
      }
    }

    return { stadt: erkannteStadt };
  }

  @Get()
  async getWeather(
    @Query('stadt') stadt: string,
    @Query('coldSensitive') coldSensitive: string,
    @Query('sporty') sporty: string
  ) {
    const gesuchteStadt = stadt || 'Bochum';
    const dbDaten = await this.weatherService.getWeatherData(gesuchteStadt);

    const tempZahl = parseInt(dbDaten.temperatur) || 15;
    const zustand = dbDaten.wetter;

    let empfehlung = dbDaten.hinweis || 'Das Wetter ist angenehm. Genieße den Tag!';
    const istKaelteEmpfindlich = coldSensitive === 'true';
    const istSportlich = sporty === 'true';

    if (tempZahl < 15) {
      if (istKaelteEmpfindlich) {
        empfehlung = `Es sind nur ${dbDaten.temperatur} in ${dbDaten.stadt}. Da du schnell frierst, pack dir UNBEDINGT eine dicke Jacke ein! 🧥`;
      } else {
        empfehlung = `Es ist frisch (${dbDaten.temperatur}). Eine leichte Jacke schadet heute nicht.`;
      }
    } else {
      if (istSportlich) {
        empfehlung = `Perfektes Jogging-Wetter in ${dbDaten.stadt}! Pack die Laufschuhe aus. 🏃‍♂️`;
      } else {
        empfehlung = `Schönes warmes Wetter! Du kannst heute problemlos im T-Shirt rausgehen. ☀️`;
      }
    }

    return {
      stadt: dbDaten.stadt,
      temperatur: dbDaten.temperatur,
      wetter: zustand,
      hinweis: empfehlung
    };
  }

  @Post('chat')
  async askWeatherAI(@Body() body: { frage: string; stadt: string; coldSensitive: boolean; sporty: boolean }) {
    const { frage, stadt, coldSensitive, sporty } = body;
    const text = frage.toLowerCase();
    const gesuchteStadt = stadt || 'Bochum';

    const dbDaten = await this.weatherService.getWeatherData(gesuchteStadt);
    const tempZahl = parseInt(dbDaten.temperatur) || 15;
    const zustand = dbDaten.wetter;

    let antwort = `Hallo! Du hast gefragt: "${frage}". Aktuell ist es in ${dbDaten.stadt} ${dbDaten.temperatur} und ${zustand}.`;

    if (text.includes('zusammenfassung') || text.includes('tag') || text.includes('übersicht') || text.includes('heute')) {
      let outfit = 'einem T-Shirt';
      
      if (tempZahl < 12) {
        outfit = coldSensitive ? 'einer dicken Winterjacke und Schal 🧣' : 'einer warmen Jacke 🧥';
      } else if (tempZahl >= 12 && tempZahl < 18) {
        outfit = 'einem gemütlichen Hoodie 🧥';
      } else if (tempZahl >= 18 && zustand.toLowerCase().includes('sonnig')) {
        outfit = 'einem T-Shirt und deiner Sonnenbrille 😎';
      }

      let wetterZusatz = 'Es bleibt trocken.';
      if (zustand.toLowerCase().includes('regen') || zustand.toLowerCase().includes('regnerisch')) {
        wetterZusatz = 'Zudem zieht Regen auf – denk an den Regenschirm! ☔';
      }

      antwort = `🌅 **Dein WetterWise Morning Report für ${dbDaten.stadt}:** Heute ist es mit ${dbDaten.temperatur} recht ${zustand.toLowerCase()}. ${wetterZusatz} Basierend auf deinem Profil empfiehlt sich heute ein Outfit mit **${outfit}**. Hab einen erfolgreichen Tag!`;
    } 
    else if (text.includes('jacke')) {
      if (tempZahl < 15) {
        antwort = coldSensitive 
          ? `Definitiv ja! In ${dbDaten.stadt} sind es nur ${dbDaten.temperatur}. Da du kälteempfindlich bist, wirst du ohne Jacke frieren! 🧥`
          : `Ja, es ist mit ${dbDaten.temperatur} recht kühl in ${dbDaten.stadt}. Eine leichte Jacke ist ratsam.`;
      } else {
        antwort = `Nein, bei ${dbDaten.temperatur} und ${zustand} in ${dbDaten.stadt} brauchst du heute wirklich keine Jacke! 😎`;
      }
    } 
    else if (text.includes('sport') || text.includes('joggen') || text.includes('fahrrad')) {
      if (zustand.toLowerCase().includes('regen') || zustand.toLowerCase().includes('regnerisch')) {
        antwort = `Ich würde dir heute von Outdoor-Sport abraten. In ${dbDaten.stadt} ist es aktuell ${zustand}. Bleib lieber drinnen! 🏠🏃‍♂️`;
      } else if (sporty) {
        antwort = `Absolut! Da du sportlich aktiv bist: Die Bedingungen in ${dbDaten.stadt} (${dbDaten.temperatur}, ${zustand}) sind perfekt für ein Workout! 🔥`;
      } else {
        antwort = `Das Wetter in ${dbDaten.stadt} lädt mit ${dbDaten.temperatur} durchaus zu einer lockeren Runde Bewegung ein!`;
      }
    }
    else if (text.includes('regenschirm') || text.includes('regen')) {
      if (zustand.toLowerCase().includes('regen') || zustand.toLowerCase().includes('regnerisch')) {
        antwort = `Ja, nimm unbedingt einen Regenschirm mit! In ${dbDaten.stadt} ist es gerade ${zustand}. ☔`;
      } else {
        antwort = `Nein, für ${dbDaten.stadt} ist aktuell kein Regen gemeldet (${zustand}). Den Regenschirm kannst du zu Hause lassen! ☀️`;
      }
    }
    else {
      antwort = `Interessante Frage! Bezogen auf ${dbDaten.stadt} (${dbDaten.temperatur}, ${zustand}) empfehle ich dir, dich dem Wetter entsprechend zu kleiden.`;
    }

    return { antwort };
  }
}