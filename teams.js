/* =============================================================
   VÝSLEDKY ÚNIKOVÉ HRY – DATA TÝMŮ
   -------------------------------------------------------------
   Tady přidáváš / upravuješ jednotlivé týmy.
   Stránka má dvě kategorie hodnocení (stejné týmy, jiné řazení):

     1) S PENALIZACÍ ZA NÁPOVĚDY  →  řazeno podle "timeWithHints"
     2) BEZ PENALIZACE             →  řazeno podle "timeWithoutHints"

   FORMÁT JEDNOHO TÝMU:
   {
     name: "Název týmu",
     photo: "pokus.webp",        // soubor obrázku ve stejné složce
                                 //   nebo "obrazky/tym1.jpg" pro podsložku
                                 //   nebo prázdné ""  → iniciály
     timeWithoutHints: "2:15:00",// čistý čas úniku (HH:MM:SS nebo MM:SS)
     timeWithHints:    "3:05:00",// čas + penalizace za nápovědy
     hints: 10,                  // počet použitých nápověd
     roomSkipped: false          // true = přeskočili místnost (+15 trestných minut)
                                 // false = bez trestných minut
   }

   POZNÁMKY:
   - Při rovnosti časů má lepší pořadí tým s MÉNĚ použitými nápovědami.
   - Trestné minuty (+15 min) se přičítají k oběma časům pro účely řazení.
   - Pořadí v žebříčku se přepočítá automaticky po obnovení stránky.
   ============================================================= */

const TEAMS = [
  {
    name: "Modletice Devils",
    photo: "modle.jpg",
    timeWithoutHints: "2:15:00",
    timeWithHints:    "3:05:00",
    hints: 10,
    roomSkipped: false
  },
  {
    name: "DreamTeam",
    photo: "pokus.webp",
    timeWithoutHints: "2:15:00",
    timeWithHints:    "2:40:00",
    hints: 5,
    roomSkipped: false
  },
  {
    name: "Lepší Modletice Devils",
    photo: "Lepsimodle.jpg",
    timeWithoutHints: "2:12:00",
    timeWithHints:    "2:47:00",
    hints: 9,
    roomSkipped: false
  },
  {
    name: "Opozdilci",
    photo: "",
    timeWithoutHints: "2:20:00",
    timeWithHints:    "3:35:00",
    hints: 15,
    roomSkipped: false
  }
  // <<< Další tým přidej sem (nezapomeň čárku za předchozí složenou závorkou)
];
