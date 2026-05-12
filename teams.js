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
    photo: "modle.png",
    timeWithoutHints: "32:15",
    timeWithHints:    "35:15",
    hints: 2
  },
  {
    name: "DreamTeam",
    photo: "pokus.webp",
    timeWithoutHints: "29:50",
    timeWithHints:    "30:50",
    hints: 1
  },
  {
    name: "Lepší Modletice Devils",
    photo: "lepsimodle.png",
    timeWithoutHints: "2:13:00",
    timeWithHints:    "2:47:00",
    hints: 0
  },
  {
    name: "Tým Vyšetřovatelé",
    photo: "pokus.webp",
    timeWithoutHints: "38:20",
    timeWithHints:    "42:20",
    hints: 3
  },
  {
    name: "Tým Inspektoři",
    photo: "pokus.webp",
    timeWithoutHints: "41:00",
    timeWithHints:    "45:00",
    hints: 3
  }
  // <<< Další tým přidej sem (nezapomeň čárku za předchozí složenou závorkou)
];
