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
    startTime:   "",
    entry50Time: "",
    entry10Time: "",
    endTime:     ""
  },
  {
    name: "DreamTeam",
    photo: "pokus.webp",
    timeWithoutHints: "2:15:00",
    timeWithHints:    "2:40:00",
    hints: 5,
    roomSkipped: true,
    startTime:   "",
    entry50Time: "",
    entry10Time: "",
    endTime:     ""
  },
  {
    name: "Lepší Modletice Devils",
    photo: "Lepsimodle.jpg",
    timeWithoutHints: "2:12:00",
    timeWithHints:    "2:47:00",
    hints: 9,
    roomSkipped: true,
    startTime:   "",
    entry50Time: "",
    entry10Time: "",
    endTime:     ""
  },
   {
    name: "O Můj Bože",
    photo: "omujboze.jpg",
    timeWithoutHints: "2:37:00",
    timeWithHints:    "2:37:00",
    hints: 0,
    roomSkipped: false,
    startTime:   "",
    entry50Time: "",
    entry10Time: "",
    endTime:     ""
  },
  {
    name: "Opozdilci",
    photo: "",
    timeWithoutHints: "2:20:00",
    timeWithHints:    "3:35:00",
    hints: 15,
    roomSkipped: false,
    startTime:   "",
    entry50Time: "",
    entry10Time: "",
    endTime:     ""
  }
  // <<< Další tým přidej sem (nezapomeň čárku za předchozí složenou závorkou)
];
