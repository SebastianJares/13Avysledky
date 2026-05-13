/* =============================================================
   VÝSLEDKY ÚNIKOVÉ HRY – LOGIKA
   - Načte TEAMS z teams.js
   - Stránka má dvě kategorie hodnocení:
       "withHints"    → řazení podle timeWithHints   (s penalizací za nápovědy)
       "withoutHints" → řazení podle timeWithoutHints (čistý čas)
   - Trestné minuty: +15 min, pokud roomSkipped === true
   - Tie-break: stejný čas → lépe ten s menším počtem nápověd
   - Vykreslí podium (1.-3.) a žebříček (4.+)
   ============================================================= */

(function () {
  'use strict';

  var PENALTY_MIN = 15; // trestné minuty za přeskočení místnosti

  /* ---------- POMOCNÉ FUNKCE ---------- */

  function timeToSeconds(t) {
    if (!t || typeof t !== 'string') return Infinity;
    var parts = t.trim().split(':').map(function (p) { return parseInt(p, 10); });
    if (parts.some(isNaN)) return Infinity;
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return Infinity;
  }

  function secondsToTime(s) {
    if (!isFinite(s) || s < 0) return '—';
    var hh = Math.floor(s / 3600);
    var mm = Math.floor((s % 3600) / 60);
    var ss = s % 60;
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    if (hh > 0) return hh + ':' + pad(mm) + ':' + pad(ss);
    return pad(mm) + ':' + pad(ss);
  }

  function initialsFor(name) {
    if (!name) return '?';
    var clean = name.replace(/^Tým\s+/i, '').trim();
    var words = clean.split(/\s+/).filter(Boolean);
    if (words.length === 0) return '?';
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function penaltySeconds(team) {
    return team && team.roomSkipped === true ? PENALTY_MIN * 60 : 0;
  }

  /* ---------- ŘAZENÍ ---------- */

  // category: "withHints" | "withoutHints"
  function rankedTeams(category) {
    if (typeof TEAMS === 'undefined' || !Array.isArray(TEAMS)) return [];

    var sortField = (category === 'withoutHints') ? 'timeWithoutHints' : 'timeWithHints';

    return TEAMS
      .filter(function (t) { return t && (t.timeWithHints || t.timeWithoutHints); })
      .map(function (t) {
        var rawSec = timeToSeconds(t[sortField] || '');
        var pen    = penaltySeconds(t);
        return {
          name: t.name || 'Bez názvu',
          photo: t.photo || '',
          timeWithHints:    t.timeWithHints    || '',
          timeWithoutHints: t.timeWithoutHints || '',
          hints:            (typeof t.hints === 'number') ? t.hints : 0,
          roomSkipped:      t.roomSkipped === true,
          penaltyMin:       pen / 60,
          rawSeconds:       rawSec,
          totalSeconds:     rawSec + pen
        };
      })
      .sort(function (a, b) {
        // 1) celkový čas (raw + trestné minuty)
        if (a.totalSeconds !== b.totalSeconds) return a.totalSeconds - b.totalSeconds;
        // 2) stejný čas → méně nápověd = lépe
        return a.hints - b.hints;
      });
  }

  function timesFor(category, team) {
    // "Hlavní čas" v dané kategorii = raw čas + případné trestné minuty
    // (aby zobrazený čas seděl s pořadím v žebříčku)
    var pen = team.roomSkipped ? PENALTY_MIN * 60 : 0;

    if (category === 'withoutHints') {
      var mainSec  = timeToSeconds(team.timeWithoutHints) + pen;
      var otherSec = timeToSeconds(team.timeWithHints)    + pen;
      return {
        main:       secondsToTime(mainSec),
        otherLabel: 'S penalizací',
        otherValue: secondsToTime(otherSec)
      };
    }
    var mainSec  = timeToSeconds(team.timeWithHints)    + pen;
    var otherSec = timeToSeconds(team.timeWithoutHints) + pen;
    return {
      main:       secondsToTime(mainSec),
      otherLabel: 'Čistý čas',
      otherValue: secondsToTime(otherSec)
    };
  }

  /* ---------- VYKRESLOVÁNÍ ---------- */

  function photoBlock(team, sizeClass) {
    if (team.photo) {
      return '<div class="photo ' + (sizeClass || '') + '">' +
               '<img src="' + esc(team.photo) + '" alt="' + esc(team.name) + '" ' +
                    'onerror="this.outerHTML=\'<span class=\\\'placeholder\\\'>' +
                      esc(initialsFor(team.name)) + '</span>\'">' +
             '</div>';
    }
    return '<div class="photo ' + (sizeClass || '') + '">' +
             '<span class="placeholder">' + esc(initialsFor(team.name)) + '</span>' +
           '</div>';
  }

  function infoButtonHTML() {
    return '<button type="button" class="info-btn" ' +
                  'aria-label="Vysvětlení trestných minut">' +
              'i' +
            '</button>';
  }

  function penaltyValue(t) {
    return t.roomSkipped ? '+' + PENALTY_MIN + ' min' : '—';
  }

  function renderPodium(top3, category) {
    var podiumEl = document.getElementById('podium');
    if (!podiumEl) return;

    if (top3.length === 0) {
      podiumEl.innerHTML = '';
      return;
    }

    var slots = [];
    if (top3[1]) slots.push({ team: top3[1], rank: 2, cls: 'silver' });
    if (top3[0]) slots.push({ team: top3[0], rank: 1, cls: 'gold'   });
    if (top3[2]) slots.push({ team: top3[2], rank: 3, cls: 'bronze' });

    podiumEl.innerHTML = slots.map(function (s) {
      var t = s.team;
      var T = timesFor(category, t);
      return '' +
        '<article class="podium-card ' + s.cls + '">' +
          '<div class="rank-badge">' + s.rank + '</div>' +
          photoBlock(t) +
          '<h3 class="team-name">' + esc(t.name) + '</h3>' +
          '<div class="stats">' +
            '<div class="main-time">' + esc(T.main) + '</div>' +
            '<div class="row"><span class="lbl">' + esc(T.otherLabel) + '</span>' +
              '<span class="val">' + esc(T.otherValue) + '</span></div>' +
            '<div class="row"><span class="lbl">Nápovědy</span>' +
              '<span class="val">' + esc(t.hints) + '×</span></div>' +
            '<div class="row penalty-row' + (t.roomSkipped ? ' has-penalty' : '') + '">' +
              '<span class="lbl">Trestné minuty ' + infoButtonHTML() + '</span>' +
              '<span class="val">' + penaltyValue(t) + '</span>' +
            '</div>' +
          '</div>' +
        '</article>';
    }).join('');

    podiumEl.classList.remove('fade-swap');
    void podiumEl.offsetWidth;
    podiumEl.classList.add('fade-swap');
  }

  function renderLeaderboard(rest, offset, category) {
    var listEl = document.getElementById('leaderboard');
    if (!listEl) return;

    listEl.innerHTML = rest.map(function (t, i) {
      var rank = (offset || 0) + i + 1;
      var T = timesFor(category, t);
      return '' +
        '<div class="team-row">' +
          '<div class="rank">' + rank + '</div>' +
          photoBlock(t) +
          '<div class="info">' +
            '<h3 class="team-name">' + esc(t.name) + '</h3>' +
            '<div class="meta">' +
              '<span><span class="lbl">' + esc(T.otherLabel) + ':</span>' +
                '<span class="val">' + esc(T.otherValue) + '</span></span>' +
              '<span><span class="lbl">Nápovědy:</span>' +
                '<span class="val">' + esc(t.hints) + '×</span></span>' +
              '<span class="penalty' + (t.roomSkipped ? ' has-penalty' : '') + '">' +
                '<span class="lbl">Trestné min. ' + infoButtonHTML() + ':</span>' +
                '<span class="val">' + penaltyValue(t) + '</span>' +
              '</span>' +
            '</div>' +
          '</div>' +
          '<div class="main-time">' + esc(T.main) + '</div>' +
        '</div>';
    }).join('');

    listEl.classList.remove('fade-swap');
    void listEl.offsetWidth;
    listEl.classList.add('fade-swap');
  }

  function renderCategory(category) {
    var ranked = rankedTeams(category);

    var emptyEl  = document.getElementById('emptyMsg');
    var podiumEl = document.getElementById('podium');
    var listEl   = document.getElementById('leaderboard');

    if (ranked.length === 0) {
      if (podiumEl) podiumEl.innerHTML = '';
      if (listEl)   listEl.innerHTML   = '';
      if (emptyEl)  emptyEl.hidden     = false;
      return;
    }
    if (emptyEl) emptyEl.hidden = true;

    var top3 = ranked.slice(0, 3);
    var rest = ranked.slice(3);

    renderPodium(top3, category);
    renderLeaderboard(rest, top3.length, category);
  }

  /* ---------- PŘEPÍNAČ KATEGORIÍ ---------- */

  function bindCategorySwitch() {
    var buttons = document.querySelectorAll('.level-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.classList.contains('is-active')) return;
        buttons.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        var cat = btn.getAttribute('data-category') || 'withHints';
        renderCategory(cat);

        hideInfoPopover(); // při přepnutí kategorie schovat popover
      });
    });
  }

  /* ---------- INFO POPOVER (klik na "i") ---------- */

  var _popoverAnchor = null;

  function hideInfoPopover() {
    var pop = document.getElementById('infoPopover');
    if (pop) pop.hidden = true;
    _popoverAnchor = null;
  }

  function positionPopover(btn) {
    var pop = document.getElementById('infoPopover');
    if (!pop || !btn) return;
    pop.hidden = false;

    // dočasně zobraz pro změření
    var rect = btn.getBoundingClientRect();
    var popRect = pop.getBoundingClientRect();

    var top = window.scrollY + rect.bottom + 10;
    var left = window.scrollX + rect.left + rect.width / 2 - popRect.width / 2;

    // odraz od okrajů viewportu
    var margin = 12;
    if (left < window.scrollX + margin) left = window.scrollX + margin;
    var maxLeft = window.scrollX + window.innerWidth - popRect.width - margin;
    if (left > maxLeft) left = maxLeft;

    // pokud by popover přesáhl dolů, posaď ho nad tlačítko
    if (rect.bottom + popRect.height + 20 > window.innerHeight) {
      top = window.scrollY + rect.top - popRect.height - 10;
    }

    pop.style.top  = top + 'px';
    pop.style.left = left + 'px';
  }

  function bindInfoPopover() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.info-btn');
      var pop = document.getElementById('infoPopover');
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        if (_popoverAnchor === btn && pop && !pop.hidden) {
          hideInfoPopover();
        } else {
          _popoverAnchor = btn;
          positionPopover(btn);
        }
        return;
      }
      // klik mimo (i) a mimo popover → zavřít
      if (pop && !pop.hidden && !(e.target.closest && e.target.closest('#infoPopover'))) {
        hideInfoPopover();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hideInfoPopover();
    });
    window.addEventListener('resize', hideInfoPopover);
    window.addEventListener('scroll', function () {
      if (_popoverAnchor) positionPopover(_popoverAnchor);
    }, { passive: true });
  }

  /* ---------- START ---------- */

  document.addEventListener('DOMContentLoaded', function () {
    bindCategorySwitch();
    bindInfoPopover();
    renderCategory('withHints');
  });

})();
