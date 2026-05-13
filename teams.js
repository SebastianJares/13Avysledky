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
     photo: "pokus.webp",        // název souboru ve stejné složce
                                 //   nebo "obrazky/tym1.jpg" pro podsložku
                                 //   nebo prázdné ""  → iniciály
     timeWithoutHints: "32:15",  // čistý čas úniku (MM:SS)
     timeWithHints:    "35:15",  // čas + penalizace za nápovědy (MM:SS)
     hints: 2                    // počet použitých nápověd
   }

   POZNÁMKY:
   - Obrázek dej do stejné složky jako index.html a do "photo" napiš
     jen název souboru (např. "tym1.jpg").
   - Pokud tým nedostal žádnou nápovědu, "timeWithHints" = "timeWithoutHints",
     "hints" = 0.
   - Pořadí v žebříčku se přepočítá automaticky po obnovení stránky.
   ============================================================= */

const TEAMS = [
  {
    name: "Modletice Devils",
    photo: "modle.jpg",
    timeWithoutHints: "2:15:00",
    timeWithHints:    "3:05:00",
    hints: 10
  },
  {
    name: "DreamTeam",
    photo: "pokus.webp",
    timeWithoutHints: "2:15:00",
    timeWithHints:    "2:40:00",
    hints: 5
  },
  {
    name: "Lepší Modletice Devils",
    photo: "Lepsimodle.jpg",
    timeWithoutHints: "2:12:00",
    timeWithHints:    "2:47:00",
    hints: 9
  },
    {
    name: "Opozdilci",
    photo: "",
    timeWithoutHints: "2:20:00",
    timeWithHints:    "3:35:00",
    hints: 15
  },
  // <<< Další tým přidej sem (nezapomeň čárku za předchozí složenou závorkou)
];
