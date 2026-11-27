/**
 * MUHAMMED RAIHAN O.A - PORTFOLIO INTERACTIVITY ENGINE
 * Clean Vector & Standard ASCII Architecture
 * Zero Broken Unicode / Zero [OBJ] Replacement Symbols
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initParticles();
  initTypewriter();
  initThemeSwitcher();
  initAudioEffects();
  initTerminal();
  initProjectFilters();
  initSqlLab();
  initModals();
  initContactActions();
});

/* ==========================================================================
   RESPONSIVE NAVIGATION
   ========================================================================== */
function initNavigation() {
  const menuButton = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav-container');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!menuButton || !nav) return;

  function closeMenu() {
    nav.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
  }

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    nav.classList.toggle('menu-open', !isOpen);
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
  });

  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1100) closeMenu();
  });
}

/* ==========================================================================
   1. CANVAS PARTICLES / CONSTELLATION BACKGROUND
   ========================================================================== */
function initParticles() {
  const canvas = document.getElementById('canvas-particles');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const numParticles = Math.min(Math.floor(window.innerWidth / 18), 70);
  const particles = [];
  const mouse = { x: null, y: null, maxDist: 140 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 1.8 + 0.8,
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    const accentColor = getComputedStyle(document.body).getPropertyValue('--accent-primary').trim() || '#10b981';

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      // Connect to mouse cursor
      if (mouse.x !== null && mouse.y !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.maxDist) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `${accentColor}${Math.floor((1 - dist / mouse.maxDist) * 120).toString(16).padStart(2, '0')}`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(render);
  }
  render();
}

/* ==========================================================================
   2. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const roles = [
    'Database-Driven System Architect',
    'Full-Cycle Python & Java Developer',
    'Relational SQL Modeling Specialist',
    'MCA Scholar @ Marian College',
    'Backend Logic & Clean Code Builder'
  ];

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = roles[0];
    return;
  }

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let speed = 90;

  function type() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      el.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      speed = 40;
    } else {
      el.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      speed = 90;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      speed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  type();
}

/* ==========================================================================
   3. THEME SWITCHER
   ========================================================================== */
function initThemeSwitcher() {
  const dots = document.querySelectorAll('.theme-dot');
  const savedTheme = localStorage.getItem('raihan-theme') || 'emerald';

  setTheme(savedTheme);

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const theme = dot.dataset.theme;
      setTheme(theme);
      playSound('beep');
    });
  });

  function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('raihan-theme', theme);

    dots.forEach(d => {
      if (d.dataset.theme === theme) {
        d.classList.add('active');
      } else {
        d.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   4. SYNTHESIZER AUDIO EFFECTS (WEB AUDIO API)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = false;

const iconSoundOn = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
const iconSoundOff = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;

function initAudioEffects() {
  const soundBtn = document.getElementById('sound-toggle');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    soundEnabled = !soundEnabled;
    soundBtn.innerHTML = soundEnabled ? iconSoundOn : iconSoundOff;
    soundBtn.title = soundEnabled ? 'Mute SFX' : 'Enable SFX';
    showToast(soundEnabled ? 'Audio SFX Activated' : 'Audio SFX Muted');
    if (soundEnabled) playSound('success');
  });

  document.querySelectorAll('.btn, .term-pill, .filter-btn, .sql-tab-btn, .modal-close-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => playSound('hover'));
    btn.addEventListener('click', () => playSound('click'));
  });
}

function playSound(type) {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(650, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'beep') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(780, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  } catch (err) {
    console.error(err);
  }
}

/* ==========================================================================
   5. INTERACTIVE DEVELOPER TERMINAL ("RAIHAN SHELL")
   ========================================================================== */
function initTerminal() {
  const termBody = document.getElementById('terminal-body');
  const termInput = document.getElementById('terminal-input');
  if (!termBody || !termInput) return;

  const commandHistory = [];
  let historyIdx = -1;

  const commands = {
    help: () => `
<span class="text-gradient">Available CLI Commands:</span>
  > <span style="color:#10b981">about</span>       - Brief overview & professional philosophy
  > <span style="color:#10b981">skills</span>      - Technical competency & programming languages
  > <span style="color:#10b981">projects</span>    - Featured applications and production systems
  > <span style="color:#10b981">schema</span>      - Visual ASCII Relational Database schemas
  > <span style="color:#10b981">education</span>   - Academic credentials (MCA / BCA)
  > <span style="color:#10b981">contact</span>     - Direct contact links & details
  > <span style="color:#10b981">matrix</span>      - Stream matrix data rain
  > <span style="color:#10b981">clear</span>       - Clear current console output
`,
    about: () => `
<strong style="color:#fff">MUHAMMED RAIHAN O.A</strong> - Software Developer
Location: Kerala, India | Open to Relocation & Remote Roles

"Detail-oriented MCA student and aspiring Software Developer with a strong foundation in programming,
databases, and structured problem-solving. Proficient in Python, Java, C++, and SQL, with hands-on
experience designing and building complete, database-driven applications from requirement analysis
through to working implementation."
`,
    skills: () => `
<span style="color:#38bdf8">LANGUAGES:</span>
  Python    [==================  ] 90% (Backend, Scripting, Django)
  SQL       [=================== ] 92% (Schema Modeling, Queries, Indexing)
  Java      [================    ] 80% (OOP, Enterprise Architecture)
  C++       [==============      ] 75% (Data Structures & Algorithms)

<span style="color:#38bdf8">PLATFORMS & TOOLS:</span>
  Linux CLI, Power BI, Relational DBMS (SQLite, PostgreSQL, MySQL), Git
`,
    projects: () => `
<span style="color:#f59e0b">1. Agro Equipment Rental System</span> (02/2025 - 04/2025)
   - Connecting farmers with machine owners, rental calendars & transparent rates.
   - Core Stack: Python, SQL Data Layer, Relational Architecture.

<span style="color:#f59e0b">2. E-Auction of Cardamom</span> (Personal Project)
   - Real-time commodity auction engine with dynamic bidding logic & trade settlement.
   - Core Stack: Python, SQL Data Layer, Real-time Pricing Logic.

<span style="color:#f59e0b">3. Buy & Sell Hub - OLX Clone</span> (Personal Project)
   - Full-featured classifieds marketplace with multi-image listings & direct chat.
   - Core Stack: Django, Python, SQLite/SQL, Messaging Engine.
`,
    schema: () => `
<span style="color:#10b981">Relational Schema Architecture (Buy & Sell Hub):</span>
+--------------+       +----------------------+       +---------------------+
|   Category   | 1---* |       Product        | 1---* |    ProductImage     |
+--------------+       +----------------------+       +---------------------+
| id (PK)      |       | id (PK)              |       | id (PK)             |
| name         |       | seller_id (FK->User) |       | product_id (FK)     |
| slug (UQ)    |       | category_id (FK)     |       | image (file)        |
| icon         |       | title, slug, price   |       +---------------------+
+--------------+       | location, condition  |
                       | status (active/sold) |       +---------------------+
                       +-----------+----------+       |       Message       |
                                   |                  +---------------------+
                                   +----------------* | id (PK)             |
                                                      | sender_id (FK)      |
                                                      | recipient_id (FK)   |
                                                      | product_id (FK)     |
                                                      | content, is_read    |
                                                      +---------------------+
`,
    education: () => `
[MCA] <strong style="color:#fff">Master of Computer Applications</strong> - In Progress
      Marian College Kuttikkanam (Autonomous)

[BCA] <strong style="color:#fff">Bachelor of Computer Applications</strong> - 06/2022 to 05/2025
      M.E.S College, Erumely

[HSS] <strong style="color:#fff">Plus Two, Computer Science</strong> - 06/2020 to 03/2022
      J.J Murphy HSS, Yendayar
`,
    contact: () => `
Email:    <a href="mailto:muhammedraihan6001@gmail.com" style="color:#10b981">muhammedraihan6001@gmail.com</a>
Phone:    <a href="tel:+916282727399" style="color:#10b981">+91 6282727399</a>
LinkedIn: <a href="https://linkedin.com/in/muhammed-raihan-oa-1a0810368" target="_blank" style="color:#38bdf8">linkedin.com/in/muhammed-raihan-oa-1a0810368</a>
Location: Kerala, India
`,
    matrix: () => {
      runMatrixEffect();
      return `<span style="color:#10b981">Entering Matrix stream... Click anywhere or press ESC to exit.</span>`;
    },
    clear: () => {
      termBody.innerHTML = '';
      return '';
    }
  };

  function executeCommand(rawInput) {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    commandHistory.push(trimmed);
    historyIdx = commandHistory.length;

    const promptEcho = document.createElement('div');
    promptEcho.className = 'term-output-line';
    promptEcho.innerHTML = `<span class="term-user">visitor@raihan</span>:<span class="term-path">~$</span> ${escapeHtml(trimmed)}`;
    termBody.appendChild(promptEcho);

    const cmdLower = trimmed.toLowerCase();
    const resultDiv = document.createElement('div');
    resultDiv.className = 'term-output-line';

    if (commands[cmdLower]) {
      const output = commands[cmdLower]();
      if (cmdLower !== 'clear') {
        resultDiv.innerHTML = output;
        termBody.appendChild(resultDiv);
      }
    } else {
      resultDiv.innerHTML = `<span style="color:#ef4444">Command not recognized: '${escapeHtml(trimmed)}'. Type <span style="color:#10b981;cursor:pointer" onclick="document.getElementById('terminal-input').value='help';document.getElementById('terminal-input').dispatchEvent(new KeyboardEvent('keydown',{'key':'Enter'}))">'help'</span> for instructions.</span>`;
      termBody.appendChild(resultDiv);
    }

    termBody.scrollTop = termBody.scrollHeight;
    termInput.value = '';
    playSound('beep');
  }

  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCommand(termInput.value);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIdx > 0) {
        historyIdx--;
        termInput.value = commandHistory[historyIdx] || '';
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx < commandHistory.length - 1) {
        historyIdx++;
        termInput.value = commandHistory[historyIdx] || '';
      } else {
        historyIdx = commandHistory.length;
        termInput.value = '';
      }
    }
  });

  document.querySelectorAll('.term-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const cmd = pill.dataset.cmd;
      termInput.value = cmd;
      executeCommand(cmd);
      termInput.focus();
    });
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/* Matrix Effect Easter Egg */
function runMatrixEffect() {
  const existing = document.getElementById('matrix-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'matrix-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.background = 'rgba(0, 0, 0, 0.95)';
  overlay.style.zIndex = '99999';
  overlay.style.cursor = 'pointer';

  const mCanvas = document.createElement('canvas');
  mCanvas.width = window.innerWidth;
  mCanvas.height = window.innerHeight;
  overlay.appendChild(mCanvas);
  document.body.appendChild(overlay);

  const mCtx = mCanvas.getContext('2d');
  const chars = '01MUHAMMEDRAIHAN0101PYTHONSQLJAVA';
  const fontSize = 16;
  const columns = Math.floor(mCanvas.width / fontSize);
  const drops = Array(columns).fill(1);

  const interval = setInterval(() => {
    mCtx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    mCtx.fillRect(0, 0, mCanvas.width, mCanvas.height);

    mCtx.fillStyle = '#10b981';
    mCtx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = chars.charAt(Math.floor(Math.random() * chars.length));
      mCtx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > mCanvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }, 33);

  function closeMatrix() {
    clearInterval(interval);
    overlay.remove();
  }

  overlay.addEventListener('click', closeMatrix);
  window.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      closeMatrix();
      window.removeEventListener('keydown', escHandler);
    }
  });
}

/* ==========================================================================
   6. PROJECT FILTERS
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. INTERACTIVE SQL LAB & LIVE QUERY SIMULATOR
   ========================================================================== */
function initSqlLab() {
  const tabs = document.querySelectorAll('.sql-tab-btn');
  const queryText = document.getElementById('sql-query-display-text');
  const runBtn = document.getElementById('sql-run-trigger');
  const tableHead = document.getElementById('sql-table-headers');
  const tableBody = document.getElementById('sql-table-rows');
  const metaTime = document.getElementById('sql-exec-time');
  const metaRows = document.getElementById('sql-exec-rows');

  if (!tabs.length || !queryText || !tableHead || !tableBody) return;

  const dataset = {
    cardamom: {
      query: `SELECT auction_id, grade, base_price, highest_bid, bidder_code, status 
FROM cardamom_lots 
WHERE status = 'LIVE' 
ORDER BY highest_bid DESC 
LIMIT 4;`,
      headers: ['AUCTION_ID', 'GRADE', 'BASE_PRICE (INR/kg)', 'CURRENT_BID (INR/kg)', 'BIDDER', 'STATUS'],
      rows: [
        ['CRD-2025-081', 'Alleppey Green Extra Bold (AGEB)', 'INR 2,450.00', 'INR 2,980.00', 'TRADER_KL_04', '<span style="color:#10b981;font-weight:600;"><span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#10b981;box-shadow:0 0 6px #10b981;margin-right:5px;"></span>LIVE</span>'],
        ['CRD-2025-082', 'Alleppey Green Bold (AGB)', 'INR 2,100.00', 'INR 2,420.00', 'EXPORTER_MUM', '<span style="color:#10b981;font-weight:600;"><span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#10b981;box-shadow:0 0 6px #10b981;margin-right:5px;"></span>LIVE</span>'],
        ['CRD-2025-083', 'Cardamom Superior (AGS)', 'INR 1,850.00', 'INR 2,050.00', 'SPICE_HUB_COK', '<span style="color:#10b981;font-weight:600;"><span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#10b981;box-shadow:0 0 6px #10b981;margin-right:5px;"></span>LIVE</span>'],
        ['CRD-2025-084', 'Cardamom Shipment (AGS-1)', 'INR 1,700.00', 'INR 1,890.00', 'TRADER_TN_12', '<span style="color:#10b981;font-weight:600;"><span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#10b981;box-shadow:0 0 6px #10b981;margin-right:5px;"></span>LIVE</span>']
      ],
      time: '0.042 ms'
    },
    agro: {
      query: `SELECT e.equipment_name, e.category, e.daily_rate, u.district, b.rental_status 
FROM agro_equipment e
JOIN owners u ON e.owner_id = u.id
JOIN rental_bookings b ON e.id = b.equipment_id
WHERE b.rental_status = 'AVAILABLE';`,
      headers: ['EQUIPMENT_NAME', 'CATEGORY', 'RATE/DAY (INR)', 'DISTRICT', 'AVAILABILITY'],
      rows: [
        ['Mahindra 575 DI Tractor', 'Tractors', 'INR 1,800.00', 'Kottayam', '<span style="color:#10b981">AVAILABLE</span>'],
        ['Kubota Combine Harvester', 'Harvesters', 'INR 3,500.00', 'Kottayam', '<span style="color:#10b981">AVAILABLE</span>'],
        ['VST Shakti Power Tiller', 'Tillers', 'INR 950.00', 'Idukki', '<span style="color:#10b981">AVAILABLE</span>'],
        ['Rotavator Heavy Multi-Speed', 'Tillage', 'INR 800.00', 'Pathanamthitta', '<span style="color:#10b981">AVAILABLE</span>']
      ],
      time: '0.061 ms'
    },
    marketplace: {
      query: `SELECT p.id, p.title, c.name AS category, p.price, p.location, p.status 
FROM products_product p
JOIN products_category c ON p.category_id = c.id
WHERE p.status = 'active'
ORDER BY p.created_at DESC;`,
      headers: ['PRODUCT_ID', 'TITLE', 'CATEGORY', 'PRICE (INR)', 'LOCATION', 'STATUS'],
      rows: [
        ['PRD-109', 'Sony Alpha A7 III (Mint Condition)', 'Electronics', 'INR 89,000.00', 'Kochi, Kerala', '<span style="color:#38bdf8">ACTIVE</span>'],
        ['PRD-108', 'Royal Enfield Hunter 350 (2023)', 'Vehicles', 'INR 1,45,000.00', 'Kottayam', '<span style="color:#38bdf8">ACTIVE</span>'],
        ['PRD-107', 'Apple MacBook Pro M2 16GB', 'Laptops', 'INR 1,12,000.00', 'Trivandrum', '<span style="color:#38bdf8">ACTIVE</span>'],
        ['PRD-106', 'Solid Teak Wood Dining 6-Seater', 'Furniture', 'INR 28,500.00', 'Erumely', '<span style="color:#38bdf8">ACTIVE</span>']
      ],
      time: '0.038 ms'
    }
  };

  let currentKey = 'cardamom';

  function renderSql(key) {
    const data = dataset[key];
    if (!data) return;
    currentKey = key;
    queryText.textContent = data.query;

    tableHead.innerHTML = `<tr>${data.headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
    tableBody.innerHTML = data.rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('');
    metaTime.textContent = `Execution: ${data.time}`;
    metaRows.textContent = `Rows Returned: ${data.rows.length}`;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderSql(tab.dataset.table);
    });
  });

  if (runBtn) {
    runBtn.addEventListener('click', () => {
      runBtn.innerHTML = `<span>Executing...</span>`;
      tableBody.style.opacity = '0.3';
      setTimeout(() => {
        renderSql(currentKey);
        tableBody.style.opacity = '1';
        runBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <span>Run Query</span>
        `;
        playSound('success');
        showToast('SQL Query Executed Successfully (0.04ms)');
      }, 250);
    });
  }

  renderSql('cardamom');
}

/* ==========================================================================
   8. MODALS ENGINE (ARCHITECTURE & RESUME)
   ========================================================================== */
function initModals() {
  const modalOverlay = document.getElementById('modal-overlay');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = document.getElementById('modal-close');

  if (!modalOverlay || !closeBtn) return;

  function closeModal() {
    modalOverlay.classList.remove('active');
  }

  closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  const modalData = {
    'arch-agro': {
      title: 'Agro Equipment Rental System - Technical Architecture',
      body: `
        <div style="font-size:0.95rem;line-height:1.7;color:#cbd5e1;">
          <h4 style="color:#10b981;margin-bottom:0.5rem;">System Overview & Goal</h4>
          <p>A mission-driven agricultural logistics platform connecting smallholder farmers with tractor and harvester owners in rural Kerala. Developed end-to-end to eliminate middleman margins and solve seasonal equipment shortages.</p>
          
          <h4 style="color:#38bdf8;margin:1.25rem 0 0.5rem;">Database Schema & Entities</h4>
          <ul style="padding-left:1.2rem;margin-bottom:1rem;">
            <li><strong>users_owner & users_farmer:</strong> Profiles with KYC verification, contact phone, and geolocation.</li>
            <li><strong>equipment_inventory:</strong> Machinery specs, horsepower, implement attachments, base hourly/daily rates, maintenance status.</li>
            <li><strong>rental_bookings:</strong> Date reservation calendars, conflict-prevention constraints, start/end metering, payment status.</li>
            <li><strong>pricing_rules:</strong> Transparent seasonal multiplier logic, operator fee adjustments, and mileage calculations.</li>
          </ul>

          <h4 style="color:#f59e0b;margin:1.25rem 0 0.5rem;">Engineering Highlights</h4>
          <p>- Engineered SQL data layer with strict foreign key constraints preventing double-booking of agricultural machinery across conflicting dates.<br>
          - Built requirement analysis from direct field research in Kottayam to optimize ease-of-use for non-technical users.</p>
        </div>
      `
    },
    'arch-auction': {
      title: 'E-Auction of Cardamom - High-Concurrency Trading Engine',
      body: `
        <div style="font-size:0.95rem;line-height:1.7;color:#cbd5e1;">
          <h4 style="color:#10b981;margin-bottom:0.5rem;">Commodity Trading Architecture</h4>
          <p>Engineered to bring transparency to cardamom spice auctions (Idukki / Bodinayakanur spice belts). The platform replaces opaque manual tenders with dynamic digital price discovery.</p>
          
          <h4 style="color:#38bdf8;margin:1.25rem 0 0.5rem;">Bidding State Machine & Anti-Sniping</h4>
          <div style="background:#090d15;padding:1rem;border-radius:8px;font-family:monospace;font-size:0.85rem;margin:0.75rem 0;border:1px solid rgba(255,255,255,0.08);">
            [LOT_CATALOGED] -> [AUCTION_LIVE] -> [BID_RECEIVED] -> [PRICE_INCREMENT_CHECK] -> [HIGHEST_BID_UPDATED] -> [TIMER_ZERO] -> [SETTLEMENT]
          </div>

          <h4 style="color:#f59e0b;margin:1.25rem 0 0.5rem;">Data Integrity & Consistency</h4>
          <p>- Implemented real-time incremental price calculation enforcing minimum bid increments (INR 20/kg increments).<br>
          - Relational audit trail in SQL logging every bid timestamp, IP, and authorized trader token to ensure zero dispute settlements.</p>
        </div>
      `
    },
    'arch-marketplace': {
      title: 'Buy & Sell Hub - Django OLX Classifieds Clone',
      body: `
        <div style="font-size:0.95rem;line-height:1.7;color:#cbd5e1;">
          <h4 style="color:#10b981;margin-bottom:0.5rem;">Production Django Model Architecture</h4>
          <p>Modeled on enterprise classifieds platforms, this architecture features modular apps (Products, Communications, Users, Config) with full relational normalization.</p>
          
          <h4 style="color:#38bdf8;margin:1.25rem 0 0.5rem;">Real Django Schema Implementation</h4>
          <pre style="background:#090d15;padding:1rem;border-radius:8px;font-family:monospace;font-size:0.8rem;overflow-x:auto;border:1px solid rgba(255,255,255,0.08);color:#a5f3fc;">
class Product(models.Model):
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    condition = models.CharField(max_length=10, choices=CONDITION_CHOICES, default='used')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    content = models.TextField()
    is_read = models.BooleanField(default=False)
          </pre>

          <h4 style="color:#f59e0b;margin:1.25rem 0 0.5rem;">Core Capabilities</h4>
          <p>- Multi-image uploads linked to distinct product listings with cascading deletions.<br>
          - Direct in-app buyer-to-seller messaging thread linked directly to the queried item.<br>
          - Auto-slugified canonical URLs for SEO indexing and clean routing.</p>
        </div>
      `
    },
    'resume-viewer': {
      title: 'Curriculum Vitae - Muhammed Raihan O.A',
      body: `
        <div id="resume-print-area" style="font-size:0.9rem;line-height:1.65;color:#e2e8f0;background:#0d111a;border-radius:10px;border:1px solid rgba(255,255,255,0.1);overflow:hidden;">

          <!-- RESUME HEADER -->
          <div style="background:linear-gradient(135deg,#0d2318 0%,#0f1e30 50%,#0d111a 100%);padding:2rem 2rem 1.5rem;border-bottom:2px solid rgba(16,185,129,0.3);display:flex;align-items:center;gap:1.75rem;flex-wrap:wrap;">
            <div style="flex:1;min-width:220px;">
              <h1 style="font-size:1.9rem;color:#fff;font-weight:800;letter-spacing:-0.02em;margin-bottom:0.25rem;">MUHAMMED RAIHAN O.A</h1>
              <div style="color:#10b981;font-weight:700;font-size:1.05rem;margin-bottom:0.75rem;letter-spacing:0.04em;text-transform:uppercase;">Software Developer</div>
              <div style="display:flex;flex-direction:column;gap:0.35rem;">
                <span style="color:#94a3b8;font-size:0.82rem;display:flex;align-items:center;gap:0.5rem;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  +91 6282727399
                </span>
                <span style="color:#94a3b8;font-size:0.82rem;display:flex;align-items:center;gap:0.5rem;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  muhammedraihan6001@gmail.com
                </span>
                <span style="color:#38bdf8;font-size:0.82rem;display:flex;align-items:center;gap:0.5rem;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  linkedin.com/in/muhammed-raihan-oa-1a0810368
                </span>
                <span style="color:#94a3b8;font-size:0.82rem;display:flex;align-items:center;gap:0.5rem;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  Kerala, India
                </span>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.6rem;">
              <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25);border-radius:8px;padding:0.65rem 0.9rem;text-align:center;">
                <div style="font-size:1.3rem;font-weight:800;color:#10b981;font-family:monospace;">4</div>
                <div style="font-size:0.68rem;color:#64748b;text-transform:uppercase;letter-spacing:0.04em;">Languages</div>
              </div>
              <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25);border-radius:8px;padding:0.65rem 0.9rem;text-align:center;">
                <div style="font-size:1.3rem;font-weight:800;color:#10b981;font-family:monospace;">3+</div>
                <div style="font-size:0.68rem;color:#64748b;text-transform:uppercase;letter-spacing:0.04em;">Projects</div>
              </div>
              <div style="background:rgba(56,189,248,0.1);border:1px solid rgba(56,189,248,0.25);border-radius:8px;padding:0.65rem 0.9rem;text-align:center;">
                <div style="font-size:1.3rem;font-weight:800;color:#38bdf8;font-family:monospace;">MCA</div>
                <div style="font-size:0.68rem;color:#64748b;text-transform:uppercase;letter-spacing:0.04em;">Pursuing</div>
              </div>
              <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.25);border-radius:8px;padding:0.65rem 0.9rem;text-align:center;">
                <div style="font-size:1.3rem;font-weight:800;color:#f59e0b;font-family:monospace;">5+</div>
                <div style="font-size:0.68rem;color:#64748b;text-transform:uppercase;letter-spacing:0.04em;">Years Study</div>
              </div>
            </div>
          </div>

          <!-- RESUME BODY -->
          <div style="padding:1.75rem 2rem;display:grid;grid-template-columns:1fr 1fr;gap:2rem;">

            <!-- LEFT COLUMN -->
            <div>
              <!-- Professional Summary -->
              <div style="margin-bottom:1.5rem;">
                <h3 style="font-size:0.8rem;font-weight:700;color:#10b981;text-transform:uppercase;letter-spacing:0.08em;border-bottom:1px solid rgba(16,185,129,0.3);padding-bottom:0.4rem;margin-bottom:0.75rem;">Professional Summary</h3>
                <p style="color:#cbd5e1;font-size:0.85rem;line-height:1.7;">Detail-oriented MCA student and aspiring Software Developer with a strong foundation in programming, databases, and structured problem-solving. Proficient in Python, Java, C++, and SQL, with hands-on experience designing and building complete, database-driven applications from requirement analysis through to working implementation. A quick learner committed to delivering clean, reliable software and seeking a developer role to grow within a real-world engineering team.</p>
              </div>

              <!-- Technical Skills -->
              <div style="margin-bottom:1.5rem;">
                <h3 style="font-size:0.8rem;font-weight:700;color:#10b981;text-transform:uppercase;letter-spacing:0.08em;border-bottom:1px solid rgba(16,185,129,0.3);padding-bottom:0.4rem;margin-bottom:0.75rem;">Technical Skills</h3>
                
                <div style="margin-bottom:0.75rem;">
                  <div style="font-size:0.78rem;font-weight:600;color:#f1f5f9;margin-bottom:0.3rem;">Programming Languages</div>
                  <div style="display:flex;flex-wrap:wrap;gap:0.35rem;">
                    <span style="background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);color:#10b981;padding:0.2rem 0.6rem;border-radius:4px;font-size:0.75rem;font-family:monospace;">Python</span>
                    <span style="background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);color:#10b981;padding:0.2rem 0.6rem;border-radius:4px;font-size:0.75rem;font-family:monospace;">Java</span>
                    <span style="background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);color:#10b981;padding:0.2rem 0.6rem;border-radius:4px;font-size:0.75rem;font-family:monospace;">C++</span>
                    <span style="background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);color:#10b981;padding:0.2rem 0.6rem;border-radius:4px;font-size:0.75rem;font-family:monospace;">SQL</span>
                  </div>
                </div>

                <div style="margin-bottom:0.75rem;">
                  <div style="font-size:0.78rem;font-weight:600;color:#f1f5f9;margin-bottom:0.3rem;">Frameworks & Technologies</div>
                  <div style="display:flex;flex-wrap:wrap;gap:0.35rem;">
                    <span style="background:rgba(56,189,248,0.1);border:1px solid rgba(56,189,248,0.25);color:#38bdf8;padding:0.2rem 0.6rem;border-radius:4px;font-size:0.75rem;font-family:monospace;">Django</span>
                    <span style="background:rgba(56,189,248,0.1);border:1px solid rgba(56,189,248,0.25);color:#38bdf8;padding:0.2rem 0.6rem;border-radius:4px;font-size:0.75rem;font-family:monospace;">SQLite</span>
                    <span style="background:rgba(56,189,248,0.1);border:1px solid rgba(56,189,248,0.25);color:#38bdf8;padding:0.2rem 0.6rem;border-radius:4px;font-size:0.75rem;font-family:monospace;">PostgreSQL</span>
                    <span style="background:rgba(56,189,248,0.1);border:1px solid rgba(56,189,248,0.25);color:#38bdf8;padding:0.2rem 0.6rem;border-radius:4px;font-size:0.75rem;font-family:monospace;">MySQL</span>
                    <span style="background:rgba(56,189,248,0.1);border:1px solid rgba(56,189,248,0.25);color:#38bdf8;padding:0.2rem 0.6rem;border-radius:4px;font-size:0.75rem;font-family:monospace;">HTML/CSS</span>
                  </div>
                </div>

                <div style="margin-bottom:0.75rem;">
                  <div style="font-size:0.78rem;font-weight:600;color:#f1f5f9;margin-bottom:0.3rem;">Tools & Platforms</div>
                  <div style="display:flex;flex-wrap:wrap;gap:0.35rem;">
                    <span style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.25);color:#f59e0b;padding:0.2rem 0.6rem;border-radius:4px;font-size:0.75rem;font-family:monospace;">Linux CLI</span>
                    <span style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.25);color:#f59e0b;padding:0.2rem 0.6rem;border-radius:4px;font-size:0.75rem;font-family:monospace;">Power BI</span>
                    <span style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.25);color:#f59e0b;padding:0.2rem 0.6rem;border-radius:4px;font-size:0.75rem;font-family:monospace;">MS Excel</span>
                    <span style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.25);color:#f59e0b;padding:0.2rem 0.6rem;border-radius:4px;font-size:0.75rem;font-family:monospace;">Git</span>
                    <span style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.25);color:#f59e0b;padding:0.2rem 0.6rem;border-radius:4px;font-size:0.75rem;font-family:monospace;">VS Code</span>
                  </div>
                </div>

                <div>
                  <div style="font-size:0.78rem;font-weight:600;color:#f1f5f9;margin-bottom:0.3rem;">Core Competencies</div>
                  <div style="display:flex;flex-wrap:wrap;gap:0.35rem;">
                    <span style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#94a3b8;padding:0.2rem 0.6rem;border-radius:4px;font-size:0.75rem;">Relational Schema Design</span>
                    <span style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#94a3b8;padding:0.2rem 0.6rem;border-radius:4px;font-size:0.75rem;">Back-End Development</span>
                    <span style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#94a3b8;padding:0.2rem 0.6rem;border-radius:4px;font-size:0.75rem;">Requirement Analysis</span>
                    <span style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#94a3b8;padding:0.2rem 0.6rem;border-radius:4px;font-size:0.75rem;">OOP Principles</span>
                    <span style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#94a3b8;padding:0.2rem 0.6rem;border-radius:4px;font-size:0.75rem;">Data Modeling</span>
                    <span style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#94a3b8;padding:0.2rem 0.6rem;border-radius:4px;font-size:0.75rem;">Problem Solving</span>
                  </div>
                </div>
              </div>

              <!-- Languages Spoken -->
              <div>
                <h3 style="font-size:0.8rem;font-weight:700;color:#10b981;text-transform:uppercase;letter-spacing:0.08em;border-bottom:1px solid rgba(16,185,129,0.3);padding-bottom:0.4rem;margin-bottom:0.75rem;">Languages Spoken</h3>
                <div style="display:flex;flex-direction:column;gap:0.5rem;">
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-size:0.85rem;color:#f1f5f9;font-weight:500;">English</span>
                    <div style="display:flex;gap:3px;">
                      <div style="width:10px;height:10px;border-radius:50%;background:#10b981;box-shadow:0 0 5px rgba(16,185,129,0.5);"></div>
                      <div style="width:10px;height:10px;border-radius:50%;background:#10b981;box-shadow:0 0 5px rgba(16,185,129,0.5);"></div>
                      <div style="width:10px;height:10px;border-radius:50%;background:#10b981;box-shadow:0 0 5px rgba(16,185,129,0.5);"></div>
                      <div style="width:10px;height:10px;border-radius:50%;background:#10b981;box-shadow:0 0 5px rgba(16,185,129,0.5);"></div>
                      <div style="width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.1);"></div>
                    </div>
                  </div>
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-size:0.85rem;color:#f1f5f9;font-weight:500;">Malayalam</span>
                    <div style="display:flex;gap:3px;">
                      <div style="width:10px;height:10px;border-radius:50%;background:#10b981;box-shadow:0 0 5px rgba(16,185,129,0.5);"></div>
                      <div style="width:10px;height:10px;border-radius:50%;background:#10b981;box-shadow:0 0 5px rgba(16,185,129,0.5);"></div>
                      <div style="width:10px;height:10px;border-radius:50%;background:#10b981;box-shadow:0 0 5px rgba(16,185,129,0.5);"></div>
                      <div style="width:10px;height:10px;border-radius:50%;background:#10b981;box-shadow:0 0 5px rgba(16,185,129,0.5);"></div>
                      <div style="width:10px;height:10px;border-radius:50%;background:#10b981;box-shadow:0 0 5px rgba(16,185,129,0.5);"></div>
                    </div>
                  </div>
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-size:0.85rem;color:#f1f5f9;font-weight:500;">Tamil</span>
                    <div style="display:flex;gap:3px;">
                      <div style="width:10px;height:10px;border-radius:50%;background:#10b981;box-shadow:0 0 5px rgba(16,185,129,0.5);"></div>
                      <div style="width:10px;height:10px;border-radius:50%;background:#10b981;box-shadow:0 0 5px rgba(16,185,129,0.5);"></div>
                      <div style="width:10px;height:10px;border-radius:50%;background:#10b981;box-shadow:0 0 5px rgba(16,185,129,0.5);"></div>
                      <div style="width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.1);"></div>
                      <div style="width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.1);"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- RIGHT COLUMN -->
            <div>
              <!-- Education -->
              <div style="margin-bottom:1.5rem;">
                <h3 style="font-size:0.8rem;font-weight:700;color:#10b981;text-transform:uppercase;letter-spacing:0.08em;border-bottom:1px solid rgba(16,185,129,0.3);padding-bottom:0.4rem;margin-bottom:0.75rem;">Education</h3>
                
                <div style="position:relative;padding-left:1.25rem;border-left:2px solid rgba(16,185,129,0.3);">
                  
                  <div style="margin-bottom:1.1rem;position:relative;">
                    <div style="position:absolute;left:-1.37rem;top:0.3rem;width:12px;height:12px;border-radius:50%;background:#10b981;box-shadow:0 0 8px rgba(16,185,129,0.6);"></div>
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.25rem;">
                      <span style="font-size:0.88rem;font-weight:700;color:#fff;">Master of Computer Applications (MCA)</span>
                      <span style="font-size:0.72rem;color:#10b981;font-family:monospace;background:rgba(16,185,129,0.1);padding:0.1rem 0.5rem;border-radius:4px;border:1px solid rgba(16,185,129,0.3);">In Progress</span>
                    </div>
                    <div style="font-size:0.82rem;color:#38bdf8;margin-top:0.15rem;">Marian College Kuttikkanam (Autonomous)</div>
                  </div>

                  <div style="margin-bottom:1.1rem;position:relative;">
                    <div style="position:absolute;left:-1.37rem;top:0.3rem;width:12px;height:12px;border-radius:50%;background:#38bdf8;box-shadow:0 0 8px rgba(56,189,248,0.6);"></div>
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.25rem;">
                      <span style="font-size:0.88rem;font-weight:700;color:#fff;">Bachelor of Computer Applications (BCA)</span>
                      <span style="font-size:0.72rem;color:#38bdf8;font-family:monospace;background:rgba(56,189,248,0.1);padding:0.1rem 0.5rem;border-radius:4px;border:1px solid rgba(56,189,248,0.25);">06/2022 - 05/2025</span>
                    </div>
                    <div style="font-size:0.82rem;color:#38bdf8;margin-top:0.15rem;">M.E.S College, Erumely</div>
                  </div>

                  <div style="position:relative;">
                    <div style="position:absolute;left:-1.37rem;top:0.3rem;width:12px;height:12px;border-radius:50%;background:#64748b;box-shadow:0 0 8px rgba(100,116,139,0.4);"></div>
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.25rem;">
                      <span style="font-size:0.88rem;font-weight:700;color:#fff;">Plus Two, Computer Science</span>
                      <span style="font-size:0.72rem;color:#94a3b8;font-family:monospace;background:rgba(255,255,255,0.05);padding:0.1rem 0.5rem;border-radius:4px;border:1px solid rgba(255,255,255,0.1);">06/2020 - 03/2022</span>
                    </div>
                    <div style="font-size:0.82rem;color:#64748b;margin-top:0.15rem;">J.J Murphy HSS, Yendayar</div>
                  </div>
                </div>
              </div>

              <!-- Projects -->
              <div>
                <h3 style="font-size:0.8rem;font-weight:700;color:#10b981;text-transform:uppercase;letter-spacing:0.08em;border-bottom:1px solid rgba(16,185,129,0.3);padding-bottom:0.4rem;margin-bottom:0.75rem;">Projects</h3>

                <div style="margin-bottom:1.1rem;padding:0.9rem;background:rgba(16,185,129,0.05);border:1px solid rgba(16,185,129,0.15);border-radius:8px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.25rem;margin-bottom:0.3rem;">
                    <span style="font-size:0.88rem;font-weight:700;color:#fff;">Agro Equipment Rental System</span>
                    <span style="font-size:0.7rem;color:#10b981;font-family:monospace;">02/2025 - 04/2025</span>
                  </div>
                  <div style="font-size:0.78rem;color:#64748b;margin-bottom:0.5rem;">Python | SQL Data Layer | Schema Design | Linux</div>
                  <ul style="font-size:0.8rem;color:#94a3b8;padding-left:1rem;margin:0;line-height:1.6;">
                    <li>Connecting farmers with equipment owners with rental calendars and transparent pricing</li>
                    <li>Built complete SQL data layer with conflict-prevention booking constraints</li>
                    <li>End-to-end delivery from field requirement analysis to working system</li>
                  </ul>
                </div>

                <div style="margin-bottom:1.1rem;padding:0.9rem;background:rgba(56,189,248,0.05);border:1px solid rgba(56,189,248,0.15);border-radius:8px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.25rem;margin-bottom:0.3rem;">
                    <span style="font-size:0.88rem;font-weight:700;color:#fff;">E-Auction of Cardamom</span>
                    <span style="font-size:0.7rem;color:#38bdf8;font-family:monospace;">Personal Project</span>
                  </div>
                  <div style="font-size:0.78rem;color:#64748b;margin-bottom:0.5rem;">Python | Real-Time Logic | SQL Querying | Bidding Engine</div>
                  <ul style="font-size:0.8rem;color:#94a3b8;padding-left:1rem;margin:0;line-height:1.6;">
                    <li>Real-time commodity auction with dynamic bid ladders and trade settlement</li>
                    <li>Relational audit trail tracking every bid timestamp and trader token</li>
                    <li>Anti-sniping minimum increment logic (INR 20/kg enforced)</li>
                  </ul>
                </div>

                <div style="padding:0.9rem;background:rgba(245,158,11,0.05);border:1px solid rgba(245,158,11,0.15);border-radius:8px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.25rem;margin-bottom:0.3rem;">
                    <span style="font-size:0.88rem;font-weight:700;color:#fff;">Buy & Sell Hub - OLX Clone</span>
                    <span style="font-size:0.7rem;color:#f59e0b;font-family:monospace;">Personal Project</span>
                  </div>
                  <div style="font-size:0.78rem;color:#64748b;margin-bottom:0.5rem;">Django | Python | SQLite | Direct Chat Engine</div>
                  <ul style="font-size:0.8rem;color:#94a3b8;padding-left:1rem;margin:0;line-height:1.6;">
                    <li>Full classifieds marketplace with multi-image listings and buyer-seller chat</li>
                    <li>Auto-slugified SEO routing and normalized relational schema</li>
                    <li>Optimized SQL indexing for rapid categorical and location filtering</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- PRINT ACTIONS -->
          <div style="padding:1rem 2rem 1.5rem;border-top:1px solid rgba(255,255,255,0.08);display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;">
            <button class="btn btn-primary btn-sm" onclick="window.print();" style="display:flex;align-items:center;gap:0.5rem;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              <span>Print / Save as PDF</span>
            </button>
            <a href="mailto:muhammedraihan6001@gmail.com?subject=Regarding Software Developer Role" class="btn btn-secondary btn-sm" style="display:flex;align-items:center;gap:0.5rem;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <span>Hire Me</span>
            </a>
          </div>
        </div>
      `
    }
  };

  document.querySelectorAll('[data-modal-target]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const target = trigger.dataset.modalTarget;
      if (modalData[target]) {
        modalTitle.textContent = modalData[target].title;
        modalBody.innerHTML = modalData[target].body;
        modalOverlay.classList.add('active');
        playSound('click');
      }
    });
  });
}

/* ==========================================================================
   9. CONTACT ACTIONS & TOASTS
   ========================================================================== */
function initContactActions() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const val = btn.dataset.copy;
      navigator.clipboard.writeText(val).then(() => {
        showToast(`Copied to clipboard: ${val}`);
        playSound('success');
      }).catch(() => {
        showToast(`Selected: ${val}`);
      });
    });
  });

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('sender-name')?.value || 'Recruiter / Collaborator';
      const email = document.getElementById('sender-email')?.value || '';
      const subject = document.getElementById('sender-subject')?.value || 'Developer Role Discussion';
      const message = document.getElementById('sender-message')?.value || '';

      const mailtoLink = `mailto:muhammedraihan6001@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Raihan,\n\n${message}\n\nFrom: ${name} (${email})`)}`;
      
      showToast('Opening your email client to send message...');
      playSound('success');
      setTimeout(() => {
        window.location.href = mailtoLink;
      }, 600);
    });
  }
}

function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="color:var(--accent-primary);display:inline-flex;align-items:center;">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </span>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
