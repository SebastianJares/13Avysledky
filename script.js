/* =============================================================
   VÝSLEDKY ÚNIKOVÉ HRY – LOGIKA
   - Načte TEAMS z teams.js
   - 3 kategorie hodnocení:
       "withHints"    → podle timeWithHints   (s penalizací za nápovědy)
       "withoutHints" → podle timeWithoutHints (čistý čas)
       "byHints"      → podle počtu nápověd; tie-break = lepší čas s penalizací
   - Trestné minuty: +15 min, pokud roomSkipped === true
   - Tie-break (time kategorie): stejný čas → lépe ten s menším počtem nápověd
   - Klik na fotku → lightbox s fotkou + tabulkou časů (Začátek/50/10/Konec)
   ============================================================= */

(function () {
  'use strict';

  var PENALTY_MIN = 15;

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

  function rankedTeams(category) {
    if (typeof TEAMS === 'undefined' || !Array.isArray(TEAMS)) return [];

    return TEAMS
      .filter(function (t) { return t && (t.timeWithHints || t.timeWithoutHints || typeof t.hints === 'number'); })
      .map(function (t) {
        var pen        = penaltySeconds(t);
        var withSec    = timeToSeconds(t.timeWithHints    || '') + pen;
        var withoutSec = timeToSeconds(t.timeWithoutHints || '') + pen;
        return {
          name: t.name || 'Bez názvu',
          photo: t.photo || '',
          timeWithHints:    t.timeWithHints    || '',
          timeWithoutHints: t.timeWithoutHints || '',
          hints:            (typeof t.hints === 'number') ? t.hints : 0,
          roomSkipped:      t.roomSkipped === true,
          startTime:        t.startTime   || '',
          entry50Time:      t.entry50Time || '',
          entry10Time:      t.entry10Time || '',
          endTime:          t.endTime     || '',
          withSec:          withSec,
          withoutSec:       withoutSec
        };
      })
      .sort(function (a, b) {
        if (category === 'byHints') {
          // 1) méně nápověd = lépe
          if (a.hints !== b.hints) return a.hints - b.hints;
          // 2) tie-break: lepší čas s penalizací
          return a.withSec - b.withSec;
        }
        var keyA = (category === 'withoutHints') ? a.withoutSec : a.withSec;
        var keyB = (category === 'withoutHints') ? b.withoutSec : b.withSec;
        if (keyA !== keyB) return keyA - keyB;
        return a.hints - b.hints;
      });
  }

  function timesFor(category, team) {
    if (category === 'byHints') {
      return {
        main:       team.hints + '×',
        otherLabel: 'S penalizací',
        otherValue: secondsToTime(team.withSec)
      };
    }
    if (category === 'withoutHints') {
      return {
        main:       secondsToTime(team.withoutSec),
        otherLabel: 'S penalizací',
        otherValue: secondsToTime(team.withSec)
      };
    }
    return {
      main:       secondsToTime(team.withSec),
      otherLabel: 'Čistý čas',
      otherValue: secondsToTime(team.withoutSec)
    };
  }

  /* ---------- VYKRESLOVÁNÍ ---------- */

  function photoBlock(team, sizeClass) {
    var ini = initialsFor(team.name);
    var inner = team.photo
      ? '<img src="' + esc(team.photo) + '" alt="' + esc(team.name) + '" ' +
             'onerror="this.outerHTML=\'<span class=\\\'placeholder\\\'>' +
               esc(ini) + '</span>\'">'
      : '<span class="placeholder">' + esc(ini) + '</span>';

    // JSON s časovými mezníky pro detail (lightbox)
    var timesObj = {
      s:   team.startTime   || '',
      e50: team.entry50Time || '',
      e10: team.entry10Time || '',
      end: team.endTime     || ''
    };
    var timesAttr = esc(JSON.stringify(timesObj));

    return '<div class="photo zoomable ' + (sizeClass || '') + '" ' +
                'data-zoom-src="' + esc(team.photo || '') + '" ' +
                'data-zoom-name="' + esc(team.name) + '" ' +
                'data-zoom-initials="' + esc(ini) + '" ' +
                'data-zoom-times="' + timesAttr + '" ' +
                'role="button" tabindex="0" ' +
                'aria-label="Zvětšit kartu týmu ' + esc(team.name) + '">' +
              inner +
              '<span class="zoom-hint" aria-hidden="true">+</span>' +
           '</div>';
  }

  function infoButtonHTML() {
    return '<button type="button" class="info-btn" ' +
                  'aria-label="Vysvětlení trestných minut">i</button>';
  }

  function penaltyValue(t) {
    return t.roomSkipped ? '+' + PENALTY_MIN + ' min' : '—';
  }

  function renderPodium(top3, category) {
    var podiumEl = document.getElementById('podium');
    if (!podiumEl) return;

    if (top3.length === 0) { podiumEl.innerHTML = ''; return; }

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
        hideInfoPopover();
      });
    });
  }

  /* ---------- INFO POPOVER ---------- */

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
    var rect = btn.getBoundingClientRect();
    var popRect = pop.getBoundingClientRect();
    var top = window.scrollY + rect.bottom + 10;
    var left = window.scrollX + rect.left + rect.width / 2 - popRect.width / 2;
    var margin = 12;
    if (left < window.scrollX + margin) left = window.scrollX + margin;
    var maxLeft = window.scrollX + window.innerWidth - popRect.width - margin;
    if (left > maxLeft) left = maxLeft;
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

  /* ---------- LIGHTBOX (zvětšení fotky + časy) ---------- */

  function setTimesRow(modal, fieldClass, value) {
    var dd = modal.querySelector('.pm-times .' + fieldClass);
    if (dd) dd.textContent = value && value.trim() ? value : '—';
  }

  function showPhotoModal(src, name, initials, timesJson) {
    var modal = document.getElementById('photoModal');
    if (!modal) return;
    var img = modal.querySelector('.pm-img');
    var ph  = modal.querySelector('.pm-placeholder');
    var cap = modal.querySelector('.pm-caption');

    if (src) {
      if (img) { img.src = src; img.alt = name || ''; img.hidden = false; }
      if (ph)  ph.hidden = true;
    } else {
      if (img) { img.removeAttribute('src'); img.hidden = true; }
      if (ph)  { ph.textContent = initials || '?'; ph.hidden = false; }
    }
    if (cap) cap.textContent = name || '';

    // časové mezníky
    var times = { s:'', e50:'', e10:'', end:'' };
    if (timesJson) {
      try { var p = JSON.parse(timesJson); if (p && typeof p === 'object') times = p; } catch(e){}
    }
    setTimesRow(modal, 't-start', times.s);
    setTimesRow(modal, 't-e50',   times.e50);
    setTimesRow(modal, 't-e10',   times.e10);
    setTimesRow(modal, 't-end',   times.end);

    modal.hidden = false;
    document.body.classList.add('no-scroll');
    hideInfoPopover();
  }

  function hidePhotoModal() {
    var modal = document.getElementById('photoModal');
    if (!modal) return;
    modal.hidden = true;
    var img = modal.querySelector('.pm-img');
    if (img) img.removeAttribute('src');
    document.body.classList.remove('no-scroll');
  }

  function bindPhotoZoom() {
    document.addEventListener('click', function (e) {
      var photo = e.target.closest && e.target.closest('.photo.zoomable');
      if (photo) {
        e.preventDefault();
        showPhotoModal(
          photo.getAttribute('data-zoom-src'),
          photo.getAttribute('data-zoom-name'),
          photo.getAttribute('data-zoom-initials'),
          photo.getAttribute('data-zoom-times')
        );
        return;
      }
      var modal = document.getElementById('photoModal');
      if (modal && !modal.hidden) {
        var inFig = e.target.closest && e.target.closest('.pm-figure');
        var onCloseBtn = e.target.closest && e.target.closest('.pm-close');
        if (onCloseBtn || !inFig) hidePhotoModal();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { hidePhotoModal(); return; }
      if (e.key === 'Enter' || e.key === ' ') {
        var el = document.activeElement;
        if (el && el.classList && el.classList.contains('zoomable')) {
          e.preventDefault();
          showPhotoModal(
            el.getAttribute('data-zoom-src'),
            el.getAttribute('data-zoom-name'),
            el.getAttribute('data-zoom-initials'),
            el.getAttribute('data-zoom-times')
          );
        }
      }
    });
  }

  /* ---------- START ---------- */

  document.addEventListener('DOMContentLoaded', function () {
    bindCategorySwitch();
    bindInfoPopover();
    bindPhotoZoom();
    renderCategory('withHints');
  });

})();
