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
    photo: "omujboze.jpg",
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
    name: "MDPM",
    photo: "Lepsimodle.jpg",
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
