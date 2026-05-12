/* =============================================================
   VÝSLEDKY ÚNIKOVÉ HRY – LOGIKA
   - Načte TEAMS z teams.js
   - Stránka má dvě kategorie hodnocení:
       "withHints"    → řazení podle timeWithHints   (s penalizací)
       "withoutHints" → řazení podle timeWithoutHints (čistý čas)
   - Vykreslí podium (1.-3.) a žebříček (4.+)
   ============================================================= */

(function () {
  'use strict';

  /* ---------- POMOCNÉ FUNKCE ---------- */

  function timeToSeconds(t) {
    if (!t || typeof t !== 'string') return Infinity;
    var parts = t.trim().split(':').map(function (p) { return parseInt(p, 10); });
    if (parts.some(isNaN)) return Infinity;
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return Infinity;
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

  /* ---------- ŘAZENÍ ---------- */

  function rankedTeams(category) {
    if (typeof TEAMS === 'undefined' || !Array.isArray(TEAMS)) return [];

    var sortField = (category === 'withoutHints') ? 'timeWithoutHints' : 'timeWithHints';

    return TEAMS
      .filter(function (t) { return t && (t.timeWithHints || t.timeWithoutHints); })
      .map(function (t) {
        return {
          name: t.name || 'Bez názvu',
          photo: t.photo || '',
          timeWithHints:    t.timeWithHints    || '',
          timeWithoutHints: t.timeWithoutHints || '',
          hints:            (typeof t.hints === 'number') ? t.hints : 0,
          _sortKey:         timeToSeconds(t[sortField] || '')
        };
      })
      .sort(function (a, b) { return a._sortKey - b._sortKey; });
  }

  function timesFor(category, team) {
    if (category === 'withoutHints') {
      return {
        main:       team.timeWithoutHints || team.timeWithHints || '—',
        mainLabel:  'Čistý čas',
        otherLabel: 'S penalizací',
        otherValue: team.timeWithHints || '—'
      };
    }
    return {
      main:       team.timeWithHints || team.timeWithoutHints || '—',
      mainLabel:  'S penalizací',
      otherLabel: 'Čistý čas',
      otherValue: team.timeWithoutHints || '—'
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
    var footerEl = document.getElementById('footerLabel');

    if (footerEl) {
      footerEl.textContent = (category === 'withoutHints')
        ? 'čistého času (bez penalizace)'
        : 'času s penalizací za nápovědy';
    }

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
      });
    });
  }

  /* ---------- START ---------- */

  document.addEventListener('DOMContentLoaded', function () {
    bindCategorySwitch();
    renderCategory('withHints');
  });

})();
