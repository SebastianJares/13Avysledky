/* =============================================================
   VÝSLEDKY ÚNIKOVÉ HRY – DATA TÝMŮ
   -------------------------------------------------------------
   Tady přidáváš / upravuješ jednotlivé týmy.
   Stránka má TŘI kategorie hodnocení:

     1) S PENALIZACÍ ZA NÁPOVĚDY  →  podle "timeWithHints"   (+ trest. min.)
     2) BEZ PENALIZACE             →  podle "timeWithoutHints" (+ trest. min.)
     3) PODLE NÁPOVĚD              →  podle počtu nápověd; při shodě
                                      lepší čas s penalizací = vyšší příčka

   FORMÁT JEDNOHO TÝMU:
   {
     name: "Název týmu",
     photo: "pokus.webp",          // soubor obrázku, nebo "" → iniciály

     timeWithoutHints: "2:15:00",  // čistý čas úniku (HH:MM:SS nebo MM:SS)
     timeWithHints:    "3:05:00",  // čas + penalizace za nápovědy
     hints: 10,                    // počet použitých nápověd
     roomSkipped: false,           // true → +15 trestných minut

     // ČASOVÉ MEZNÍKY (zobrazí se po kliknutí na fotku týmu).
     // Pokud něco nevyplníš, v detailu se ukáže "—".
     startTime:   "",              // čas začátku hry
     entry50Time: "",              // čas vstupu do místnosti 50
     entry10Time: "",              // čas vstupu do místnosti 10
     endTime:     ""               // čas konce
   }

   POZNÁMKY:
   - Při rovnosti časů má lepší pořadí tým s MÉNĚ použitými nápovědami.
   - Trestné minuty (+15 min) se přičítají k oběma časům pro řazení.
   - Pořadí v žebříčku se přepočítá automaticky po obnovení stránky.
   ============================================================= */

const TEAMS = [
  {
    name: "Modletice Devils",
    photo: "modle.jpg",
    timeWithoutHints: "2:15:00",
    timeWithHints:    "3:05:00",
    hints: 10,
    roomSkipped: false,
    startTime:   "8:13",
    entry50Time: "9:05",
    entry10Time: "10:06",
    endTime:     "10:28"
  },
  {
    name: "DreamTeam",
    photo: "pokus.webp",
    timeWithoutHints: "2:10:00",
    timeWithHints:    "2:35:00",
    hints: 5,
    roomSkipped: true,
    startTime:   "8:15",
    entry50Time: "9:02",
    entry10Time: "10:25",
    endTime:     "10:30"
  },
  {
    name: "Lepší Modletice Devils",
    photo: "Lepsimodle.jpg",
    timeWithoutHints: "2:12:00",
    timeWithHints:    "2:47:00",
    hints: 9,
    roomSkipped: true,
    startTime:   "12:06",
    entry50Time: "12:50",
    entry10Time: "14:07",
    endTime:     "14:18"
  },
   {
    name: "O Můj Bože",
    photo: "IMG_2528.jpeg",
    timeWithoutHints: "2:38:00",
    timeWithHints:    "2:38:00",
    hints: 0,
    roomSkipped: false,
    startTime:   "8:19",
    entry50Time: "9:15",
    entry10Time: "10:43",
    endTime:     "10:57"
  },
   {
    name: "East",
    photo: "IMG_2961.jpeg",
    timeWithoutHints: "2:04:00",
    timeWithHints:    "2:19:00",
    hints: 3,
    roomSkipped: false,
    startTime:   "10:17",
    entry50Time: "10:51",
    entry10Time: "12:06",
    endTime:     "12:21"
  },
    {
    name: "Kolibříci",
    photo: "kolibrici.JPEG",
    timeWithoutHints: "2:31:00",
    timeWithHints:    "3:06:00",
    hints: 7,
    roomSkipped: false,
    startTime:   "8:17",
    entry50Time: "9:21",
    entry10Time: "10:30",
    endTime:     "10:48"
  },
    {
    name: "Drivers Stars",
    photo: "drivers.JPEG",
    timeWithoutHints: "2:31:00",
    timeWithHints:    "2:51:00",
    hints: 4,
    roomSkipped: false,
    startTime:   "8:19",
    entry50Time: "9:17",
    entry10Time: "10:45",
    endTime:     "10:50"
  },
    {
    name: "Mlejnkův tým",
    photo: "mlejnek.JPEG",
    timeWithoutHints: "2:32:00",
    timeWithHints:    "2:57:00",
    hints: 5,
    roomSkipped: false,
    startTime:   "12:40",
    entry50Time: "13:40",
    entry10Time: "14:55",
    endTime:     "15:12"
  },
    {
    name: "Blondýny z HUBU",
    photo: "",
    timeWithoutHints: "2:57:00",
    timeWithHints:    "3:27:00",
    hints: 6,
    roomSkipped: false,
    startTime:   "8:16",
    entry50Time: "9:20",
    entry10Time: "10:50",
    endTime:     "11:13"
  },
    {
    name: "Lepší COOL název (Ústav)",
    photo: "ustav.JPEG",
    timeWithoutHints: "2:00:00",
    timeWithHints:    "2:20:00",
    hints: 4,
    roomSkipped: false,
    startTime:   "9:43",
    entry50Time: "10:23",
    entry10Time: "11:28",
    endTime:     "11:43"
  },
    {
    name: "MDPM",
    photo: "IMG_2550.jpeg",
    timeWithoutHints: "2:25:00",
    timeWithHints:    "2:40:00",
    hints: 3,
    roomSkipped: false,
    startTime:   "8:25",
    entry50Time: "9:13",
    entry10Time: "10:23",
    endTime:     "10:50"
  },
    {
    name: "HRr",
    photo: "IMG_2961.jpeg",
    timeWithoutHints: "2:45:00",
    timeWithHints:    "3:10:00",
    hints: 5,
    roomSkipped: false,
    startTime:   "09:30",
    entry50Time: "10:36",
    entry10Time: "11:51",
    endTime:     "12:15"
  },
    {
    name: "Poslední Mohykáni",
    photo: "IMG_2961.jpeg",
    timeWithoutHints: "4:06:00",
    timeWithHints:    "4:21:00",
    hints: 3,
    roomSkipped: false,
    startTime:   "09:26",
    entry50Time: "10:46",
    entry10Time: "13:02",
    endTime:     "13:32"
  },
    {
    name: "Šampioni",
    photo: "IMG_2961.jpeg",
    timeWithoutHints: "1:51:00",
    timeWithHints:    "2:01:00",
    hints: 2,
    roomSkipped: false,
    startTime:   "09:27",
    entry50Time: "09:56",
    entry10Time: "11:03",
    endTime:     "11:18"
  },
  {
    name: "Opozdilci",
    photo: "opoydilci.jpg",
    timeWithoutHints: "2:20:00",
    timeWithHints:    "3:35:00",
    hints: 15,
    roomSkipped: false,
    startTime:   "9:28",
    entry50Time: "10:25",
    entry10Time: "11:27",
    endTime:     "11:48"
  }
  // <<< Další tým přidej sem (nezapomeň čárku za předchozí složenou závorkou)
];
