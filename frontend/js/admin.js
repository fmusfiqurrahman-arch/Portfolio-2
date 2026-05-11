// MRF Admin · interactions

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// ─── Section switching ───
$$('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.section;
    if (!name) return;
    $$('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    $$('.section').forEach(s => s.classList.remove('active'));
    const target = $(`.section[data-name="${name}"]`);
    if (target) target.classList.add('active');
    const crumb = $('#crumb');
    if (crumb) crumb.textContent = btn.textContent.trim().replace(/\d+$/, '').trim();
    $('#content').scrollTop = 0;
  });
});

// ─── Clock ───
function updateClock() {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const date = $('#top-date');
  const time = $('#top-time');
  if (date) date.textContent = `${days[now.getDay()]} · ${now.getDate()} ${months[now.getMonth()]}`;
  if (time) {
    let h = now.getHours(); const m = now.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    time.textContent = `${h}:${String(m).padStart(2, '0')} ${ampm}`;
  }
}
updateClock();
setInterval(updateClock, 30000);

// ─── Toast ───
function toast(title, sub) {
  const t = $('#toast');
  $('#toast-msg').innerHTML = `<b>${title}</b><em>${sub || ''}</em>`;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 2800);
}

// ─── Save buttons ───
$$('[data-save]').forEach(b => b.addEventListener('click', () => toast('Saved', 'All changes captured · just now')));

// ─── Toggles ───
$$('[data-toggle]').forEach(t => {
  t.addEventListener('click', () => {
    t.classList.toggle('on');
    toast('Updated', 'Preference saved');
  });
});

// ─── Album drawer ───
window.openDrawer = () => {
  const d = $('#album-drawer');
  d.classList.add('open');
  setTimeout(() => d.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
};
window.closeDrawer = () => $('#album-drawer').classList.remove('open');

// ─── Album filters ───
$$('.filter-pill').forEach(p => {
  p.addEventListener('click', () => {
    $$('.filter-pill').forEach(x => x.classList.remove('active'));
    p.classList.add('active');
    const f = p.dataset.filter;
    $$('#album-grid .album').forEach(a => {
      a.style.display = (f === 'all' || a.dataset.cat === f) ? '' : 'none';
    });
  });
});

// ─── Album drag reorder ───
let dragSrc = null;
$$('#album-grid .album').forEach(a => {
  a.addEventListener('dragstart', (e) => {
    dragSrc = a; a.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  });
  a.addEventListener('dragend', () => {
    $$('.album').forEach(x => x.classList.remove('dragging', 'drag-over'));
    dragSrc = null;
  });
  a.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (dragSrc && dragSrc !== a) a.classList.add('drag-over');
  });
  a.addEventListener('dragleave', () => a.classList.remove('drag-over'));
  a.addEventListener('drop', (e) => {
    e.preventDefault();
    a.classList.remove('drag-over');
    if (dragSrc && dragSrc !== a) {
      const grid = $('#album-grid');
      const rect = a.getBoundingClientRect();
      const before = (e.clientX - rect.left) < rect.width / 2;
      grid.insertBefore(dragSrc, before ? a : a.nextSibling);
      toast('Reordered', 'Album order updated');
    }
  });
});

// ─── New album ───
$('#new-album-card').addEventListener('click', () => toast('Begin a new album', 'Opening composer…'));
$('#new-album-btn').addEventListener('click', () => toast('Begin a new album', 'Opening composer…'));

// ─── Drop zones ───
['album-drop', 'feat-drop'].forEach(id => {
  const el = $('#' + id); if (!el) return;
  ['dragenter', 'dragover'].forEach(ev => el.addEventListener(ev, (e) => { e.preventDefault(); el.classList.add('active'); }));
  ['dragleave', 'drop'].forEach(ev => el.addEventListener(ev, (e) => { e.preventDefault(); el.classList.remove('active'); }));
  el.addEventListener('drop', (e) => {
    const n = e.dataTransfer?.files?.length || 1;
    toast(`Added ${n} photograph${n > 1 ? 's' : ''}`, 'Uploading in the background');
  });
  el.addEventListener('click', () => toast('Browse files', 'File picker would open here'));
});

// ─── Photo remove ───
document.addEventListener('click', (e) => {
  const x = e.target.closest('.photo .x');
  if (x) {
    e.stopPropagation();
    x.closest('.photo').remove();
    toast('Removed', 'Photograph deleted from album');
  }
});

// ─── Packages: expand / collapse ───
window.togglePkg = (head) => head.parentElement.classList.toggle('open');

// ─── Includes: add / remove ───
document.addEventListener('click', (e) => {
  const add = e.target.closest('.add-include');
  if (add) {
    const list = add.previousElementSibling;
    const row = document.createElement('div');
    row.className = 'includes-row';
    row.innerHTML = `<span class="dot"></span><input placeholder="New inclusion…"><button>×</button>`;
    list.appendChild(row);
    row.querySelector('input').focus();
  }
  const rm = e.target.closest('.includes-row button');
  if (rm) rm.parentElement.remove();
});

// ─── Gear pills: add ───
$$('.gear-pill.add input').forEach(inp => {
  inp.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && inp.value.trim()) {
      const pill = document.createElement('span');
      pill.className = 'gear-pill';
      pill.innerHTML = `${inp.value.trim()} <button>×</button>`;
      inp.parentElement.insertAdjacentElement('beforebegin', pill);
      inp.value = '';
      toast('Added', 'Gear item added to inventory');
    }
  });
});
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.gear-pill button');
  if (btn && !btn.closest('.gear-pill.add')) btn.parentElement.remove();
});

// ─── Featured preview live update ───
$('#ip-headline')?.addEventListener('input', (e) => {
  const html = e.target.value.replace(/\*(.+?)\*/g, '<em>$1</em>');
  $('#fp-names').innerHTML = html;
});
$('#ip-place')?.addEventListener('input', (e) => {
  const date = e.target.value.includes('·') ? '' : ' · January 2025';
  $('#fp-place').textContent = e.target.value + date;
});

// ─── Command palette ───
const cmdItems = [
  { name: 'Dashboard', group: 'Navigate', section: 'dashboard' },
  { name: 'Portfolio Albums', group: 'Navigate', section: 'albums' },
  { name: 'Featured Story', group: 'Navigate', section: 'featured' },
  { name: 'Packages', group: 'Navigate', section: 'packages' },
  { name: 'Testimonials', group: 'Navigate', section: 'testimonials' },
  { name: 'About & Profile', group: 'Navigate', section: 'about' },
  { name: 'Gear & Tools', group: 'Navigate', section: 'gear' },
  { name: 'Experience', group: 'Navigate', section: 'experience' },
  { name: 'Inquiries', group: 'Navigate', section: 'inquiries' },
  { name: 'New Album', group: 'Action' },
  { name: 'New Testimonial', group: 'Action' },
  { name: 'Switch theme', group: 'Action' },
  { name: 'Toggle film grain', group: 'Action' },
];

function renderCmd(filter = '') {
  const list = $('#cmd-list');
  const f = filter.toLowerCase();
  const filtered = cmdItems.filter(c => c.name.toLowerCase().includes(f));
  list.innerHTML = filtered.map((c, i) => `
    <div class="cmd-row ${i === 0 ? 'active' : ''}" data-section="${c.section || ''}" data-name="${c.name}">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="9 18 15 12 9 6"/></svg>
      ${c.name}
      <span class="group">${c.group}</span>
    </div>
  `).join('');
}

function openCmd() {
  $('#cmd-overlay').classList.add('show');
  $('#cmd-input').value = '';
  renderCmd();
  setTimeout(() => $('#cmd-input').focus(), 50);
}
function closeCmd() { $('#cmd-overlay').classList.remove('show'); }

$('#open-cmd').addEventListener('click', openCmd);
$('#sidebar-search').addEventListener('focus', openCmd);
$('#cmd-input').addEventListener('input', e => renderCmd(e.target.value));
$('#cmd-overlay').addEventListener('click', (e) => { if (e.target === e.currentTarget) closeCmd(); });

document.addEventListener('click', (e) => {
  const row = e.target.closest('.cmd-row');
  if (!row) return;
  const sec = row.dataset.section;
  if (sec) {
    const navBtn = $(`.nav-item[data-section="${sec}"]`);
    if (navBtn) navBtn.click();
  } else {
    toast(row.dataset.name, 'Action triggered');
  }
  closeCmd();
});

document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    openCmd();
  }
  if (e.key === 'Escape') closeCmd();
});

// ─── Theme toggle (sidebar) ───
$('#theme-toggle')?.addEventListener('click', () => {
  const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(t);
});

function setTheme(t) {
  document.documentElement.dataset.theme = t;
  const tb = $('#theme-toggle');
  if (tb) tb.textContent = t === 'dark' ? 'Light' : 'Dark';
  // Sync segmented control
  $$('#theme-seg button').forEach(b => b.classList.toggle('active', b.dataset.themeSet === t));
}

// ─── Tweaks panel ───
const fab = $('#tweaks-fab');
const panel = $('#tweaks-panel');
fab.addEventListener('click', () => {
  panel.classList.toggle('open');
  fab.style.display = panel.classList.contains('open') ? 'none' : 'flex';
});
$('#tweaks-close').addEventListener('click', () => {
  panel.classList.remove('open');
  fab.style.display = 'flex';
});

// Accent
$$('.tweak-swatch').forEach(s => {
  s.addEventListener('click', () => {
    $$('.tweak-swatch').forEach(x => x.classList.remove('active'));
    s.classList.add('active');
    const c = s.dataset.accent;
    document.documentElement.style.setProperty('--gold', c);
    // derive light + soft
    document.documentElement.style.setProperty('--gold-light', shade(c, 12));
    document.documentElement.style.setProperty('--gold-dark', shade(c, -18));
    document.documentElement.style.setProperty('--gold-soft', hexA(c, 0.14));
    document.documentElement.style.setProperty('--gold-glow', hexA(c, 0.22));
  });
});

function hexA(hex, a) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substr(0, 2), 16);
  const g = parseInt(h.substr(2, 2), 16);
  const b = parseInt(h.substr(4, 2), 16);
  return `rgba(${r},${g},${b},${a})`;
}
function shade(hex, pct) {
  const h = hex.replace('#', '');
  const num = parseInt(h, 16);
  let r = (num >> 16) + Math.round(255 * pct / 100);
  let g = ((num >> 8) & 0xff) + Math.round(255 * pct / 100);
  let b = (num & 0xff) + Math.round(255 * pct / 100);
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

// Theme segmented
$$('#theme-seg button').forEach(b => {
  b.addEventListener('click', () => setTheme(b.dataset.themeSet));
});
// Density
$$('#density-seg button').forEach(b => {
  b.addEventListener('click', () => {
    $$('#density-seg button').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    document.documentElement.dataset.density = b.dataset.densitySet;
  });
});
// Serif
$$('#serif-seg button').forEach(b => {
  b.addEventListener('click', () => {
    $$('#serif-seg button').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    document.documentElement.dataset.serif = b.dataset.serifSet;
  });
});
// Grain
$$('#grain-seg button').forEach(b => {
  b.addEventListener('click', () => {
    $$('#grain-seg button').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    document.documentElement.dataset.grain = b.dataset.grainSet;
  });
});

// ─── Inquiries rows: click to "open" ───
document.addEventListener('click', (e) => {
  const inq = e.target.closest('.inquiry');
  if (inq && !e.target.closest('button')) toast('Opening inquiry', inq.querySelector('.inq-name')?.textContent || '');
});

// ─── Welcome toast ───
setTimeout(() => toast('Welcome back, Fahim', 'Seven inquiries await your reply'), 600);
