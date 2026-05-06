/* ==========================================================
   Nakul Karthikeyan. Portfolio v3
   Editorial · Field Notes
   ========================================================== */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const isCoarse = window.matchMedia('(pointer: coarse)').matches;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Update this URL once you have a public Drive PDF link ("Anyone with link can view")
const RESUME_URL = 'https://drive.google.com/uc?export=download&id=1U1iN45LWJYj6nfuCNnkPfYhopU_fQVm5';

/* ============================================================
   1.  MAGNETIC HOVERS (subtle pull on CTAs)
   ============================================================ */
$$('[data-magnetic]').forEach(el => {
  if (isCoarse) return;
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * 0.18;
    const dy = (e.clientY - (r.top + r.height / 2)) * 0.18;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

/* ============================================================
   2.  COUNT-UP STATS
   ============================================================ */
(function counters() {
  const els = $$('[data-count]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting || e.target.dataset.done) return;
      e.target.dataset.done = '1';
      const target = parseFloat(e.target.dataset.count);
      const decimals = parseInt(e.target.dataset.decimals || '0');
      const prefix = e.target.dataset.prefix || '';
      const suffix = e.target.dataset.suffix || '';
      const dur = 1500;
      const start = performance.now();
      function frame(now) {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = target * eased;
        e.target.textContent = prefix + val.toFixed(decimals) + suffix;
        if (t < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
  }, { threshold: 0.4 });
  els.forEach(el => obs.observe(el));
})();

/* ============================================================
   3.  REVEAL ON SCROLL
   ============================================================ */
(function reveal() {
  const els = $$('.in-view');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('shown'), i * 50);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
})();

/* ============================================================
   4.  SCROLL PROGRESS + NAV STATE
   ============================================================ */
(function scrollFx() {
  const nav = $('#masthead');
  const bar = $('#scrollProgress');
  const btt = $('#btt');
  const navLinks = $$('.nav-links a');
  const sections = $$('section[id]');

  function tick() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    nav.classList.toggle('compact', y > 30);
    btt.classList.toggle('show', y > 600);

    let current = 'home';
    sections.forEach(s => { if (y >= s.offsetTop - 200) current = s.id; });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  }
  window.addEventListener('scroll', tick, { passive: true });
  tick();
})();

/* ============================================================
   5.  COMMAND PALETTE  (⌘K / Ctrl+K)
   ============================================================ */
(function cmdk() {
  const root = $('#cmdk');
  const input = $('#cmdkInput');
  const list = $('#cmdkList');
  const trigger = $('#navCmd');

  const items = [
    { label: 'Top of page', meta: '00', href: '#home' },
    { label: 'The Pitch · who Nakul is', meta: '01', href: '#about' },
    { label: 'Featured Work · Re-Mind, Curio, Spotify', meta: '02', href: '#featured' },
    { label: 'The Lab · interactive process map', meta: '03', href: '#lab' },
    { label: 'The Engine · ML, CV, robotics', meta: '04', href: '#engine' },
    { label: 'The Toolkit · grouped skills', meta: '05', href: '#skills' },
    { label: 'The Career · work history', meta: '06', href: '#experience' },
    { label: 'The Journey · Mumbai → Boston', meta: '07', href: '#journey' },
    { label: 'Background · research, education, credentials', meta: '08', href: '#background' },
    { label: 'Contact · drop me a line', meta: '09', href: '#contact' },
    { label: 'Re-Mind · Alzheimer\'s care platform', meta: 'PROJ', modalId: 'remind' },
    { label: 'Curio Coffee · process optimization', meta: 'PROJ', modalId: 'curio' },
    { label: 'Spotify Walk · borrow musical identities', meta: 'PROJ', modalId: 'spotify' },
    { label: 'IXL · defending against AI tutors', meta: 'PROJ', modalId: 'ixl' },
    { label: 'Walmart · customer growth engine', meta: 'PROJ', modalId: 'walmart' },
    { label: 'Credita · P2P credit-building app', meta: 'PROJ', modalId: 'credita' },
    { label: 'Heart Disease ML research', meta: 'PROJ', modalId: 'heart' },
    { label: 'Air Gesture Recognition CV', meta: 'PROJ', modalId: 'gesture' },
    { label: 'Bluetooth Floor Cleaner robot', meta: 'PROJ', modalId: 'robot' },
    { label: 'Hand Gesture Robotic Arm', meta: 'PROJ', modalId: 'arm' },
    { label: 'Download résumé ↗', meta: 'PDF', href: RESUME_URL, ext: 1 },
    { label: 'Open LinkedIn ↗', meta: 'EXT', href: 'https://www.linkedin.com/in/shriman-nakul', ext: 1 },
    { label: 'Email Nakul ↗', meta: 'EXT', href: 'mailto:Karthikeyan.na@northeastern.edu', ext: 1 },
    { label: 'Call +1 617-202-8549', meta: 'EXT', href: 'tel:+16172028549', ext: 1 }
  ];

  let active = 0;
  let filtered = [...items];

  function render() {
    list.innerHTML = filtered.map((it, i) =>
      `<div class="cmdk-item ${i === active ? 'active' : ''}" data-i="${i}">
        <span class="num">${it.meta}</span>
        <span>${it.label}</span>
        <span class="meta">↵</span>
      </div>`
    ).join('') || '<div class="cmdk-item" style="opacity:.5">No matches</div>';
  }

  function open() {
    root.classList.add('open');
    input.value = '';
    filtered = [...items];
    active = 0;
    render();
    setTimeout(() => input.focus(), 30);
  }
  function close() { root.classList.remove('open'); }

  function go(it) {
    if (!it) return;
    if (it.ext) window.open(it.href, '_blank', 'noopener');
    else if (it.modalId) { close(); openModalById(it.modalId); return; }
    else window.location.hash = it.href;
    close();
  }

  trigger.addEventListener('click', open);

  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      root.classList.contains('open') ? close() : open();
    } else if (e.key === 'Escape' && root.classList.contains('open')) {
      close();
    } else if (root.classList.contains('open')) {
      if (e.key === 'ArrowDown') { e.preventDefault(); active = (active + 1) % filtered.length; render(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); active = (active - 1 + filtered.length) % filtered.length; render(); }
      else if (e.key === 'Enter') { e.preventDefault(); go(filtered[active]); }
    }
  });

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    filtered = q
      ? items.filter(it => it.label.toLowerCase().includes(q) || it.meta.toLowerCase().includes(q))
      : [...items];
    active = 0;
    render();
  });

  list.addEventListener('click', e => {
    const it = e.target.closest('.cmdk-item');
    if (!it || it.dataset.i === undefined) return;
    go(filtered[parseInt(it.dataset.i)]);
  });

  root.addEventListener('click', e => { if (e.target === root) close(); });
})();

/* ============================================================
   6.  MOBILE MENU
   ============================================================ */
(function mobile() {
  const menu = $('#mobileMenu');
  $('#burger').addEventListener('click', () => menu.classList.add('open'));
  $('#mobileX').addEventListener('click', () => menu.classList.remove('open'));
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
})();

/* ============================================================
   7.  PROCESS LAB
   ============================================================ */
(function processLab() {
  const flow = $('#labFlow');
  if (!flow) return;
  const totalEl = $('#labTotal');
  const bottleEl = $('#labBottle');
  const deltaEl = $('#labDelta');
  const resultEl = $('#labResult');

  const baseline = [
    { name: 'Order',    time: 45,  bottle: false },
    { name: 'Grind',    time: 90,  bottle: true  },
    { name: 'Brew',     time: 120, bottle: false },
    { name: 'Steam',    time: 60,  bottle: true  },
    { name: 'Assemble', time: 30,  bottle: false },
    { name: 'Handoff',  time: 45,  bottle: true  }
  ];
  const optimized = [
    { name: 'Order',    time: 30,  bottle: false },
    { name: 'Grind+Steam', time: 90, bottle: false },
    { name: 'Brew',     time: 90,  bottle: false },
    { name: 'Assemble', time: 18,  bottle: false },
    { name: 'Handoff',  time: 18,  bottle: false }
  ];
  const BASE_TOTAL = baseline.reduce((a, s) => a + s.time, 0);
  let steps = JSON.parse(JSON.stringify(baseline));

  function render() {
    flow.innerHTML = '';
    steps.forEach((s, i) => {
      const el = document.createElement('div');
      el.className = 'lab-step' + (s.bottle ? ' bottleneck' : '');
      el.draggable = true;
      el.dataset.i = i;
      el.innerHTML = `<div class="step-name">${s.name}</div><div class="step-time">${s.time}s</div>`;
      flow.appendChild(el);
      if (i < steps.length - 1) {
        const arr = document.createElement('div');
        arr.className = 'lab-arrow';
        arr.textContent = '→';
        flow.appendChild(arr);
      }
    });
    update();
  }

  function update() {
    const total = steps.reduce((a, s) => a + s.time, 0);
    const bottles = steps.filter(s => s.bottle).length;
    const delta = Math.round(((BASE_TOTAL - total) / BASE_TOTAL) * 100);
    totalEl.textContent = total + 's';
    bottleEl.textContent = bottles;
    deltaEl.textContent = (delta >= 0 ? '−' : '+') + Math.abs(delta) + '%';
    deltaEl.className = 'val' + (delta > 0 ? ' accent' : '');
  }

  flow.addEventListener('click', e => {
    const step = e.target.closest('.lab-step');
    if (!step || step.classList.contains('dragging')) return;
    const i = parseInt(step.dataset.i);
    if (steps[i].bottle) {
      steps[i].bottle = false;
      steps[i].time = Math.round(steps[i].time * 0.55);
    } else {
      const orig = baseline[baseline.findIndex(b => b.name === steps[i].name)];
      if (orig && orig.bottle) {
        steps[i].bottle = true;
        steps[i].time = orig.time;
      }
    }
    render();
  });

  let dragSrc = null;
  flow.addEventListener('dragstart', e => {
    const step = e.target.closest('.lab-step');
    if (!step) return;
    dragSrc = parseInt(step.dataset.i);
    step.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  });
  flow.addEventListener('dragover', e => {
    e.preventDefault();
    const step = e.target.closest('.lab-step');
    if (!step || dragSrc === null) return;
    const i = parseInt(step.dataset.i);
    if (i === dragSrc) return;
    const moved = steps.splice(dragSrc, 1)[0];
    steps.splice(i, 0, moved);
    dragSrc = i;
    render();
    flow.querySelector(`.lab-step[data-i="${i}"]`)?.classList.add('dragging');
  });
  flow.addEventListener('dragend', () => {
    dragSrc = null;
    $$('.lab-step').forEach(el => el.classList.remove('dragging'));
  });

  $('#labReset').addEventListener('click', () => {
    steps = JSON.parse(JSON.stringify(baseline));
    resultEl.classList.remove('show');
    render();
  });
  $('#labOptimize').addEventListener('click', () => {
    steps = JSON.parse(JSON.stringify(optimized));
    render();
    const total = steps.reduce((a, s) => a + s.time, 0);
    const cut = Math.round(((BASE_TOTAL - total) / BASE_TOTAL) * 100);
    resultEl.innerHTML = `<strong>Result.</strong> ${BASE_TOTAL}s → ${total}s · ${cut}% cycle reduction · 6 bottlenecks → 0 · matches the real Curio Coffee outcome.`;
    resultEl.classList.add('show');
  });

  render();
})();

/* ============================================================
   8.  EXPERIENCE TIMELINE
   ============================================================ */
const EXPERIENCE = [
  {
    role: 'Athletic Facilities Ops Assistant',
    co: 'Northeastern University · Boston',
    date: 'Jul 2024 – May 2025',
    hint: 'Ran day-to-day operations for one of the biggest athletics programs in the CAA conference.',
    bullets: [
      'Orchestrated 50+ weekly initiatives across athletics, facilities, and security, eliminating 25% of scheduling conflicts through structured Excel trackers and standardized workflows.',
      'Slashed event turnaround from 3–4 hours to 2 hours by redesigning setup/teardown sequences and building proactive risk-mitigation checklists.',
      'Engineered KPI dashboards and Excel performance reports that gave supervisors real-time visibility into service metrics and staffing efficiency.',
      'Authored and standardized SOPs, safety protocols, and onboarding documentation, cutting new-hire ramp-up time by 30%.',
      'Supported a 5–7-member cross-functional ops team, building the data infrastructure that enabled evidence-based resource allocation.'
    ],
    metrics: [
      { num: '25%', lbl: 'Fewer conflicts' },
      { num: '50%', lbl: 'Faster turnaround' },
      { num: '30%', lbl: 'Onboarding cut' }
    ]
  },
  {
    role: 'Game Development Intern (Agile)',
    co: 'Being Digital · Mumbai',
    date: 'May – Jun 2022',
    hint: 'Shipped "The Hopper", a Unity mobile game, in a tight 6-week sprint cycle.',
    bullets: [
      'Drove Agile execution for a cloud-backed Unity app alongside a 6-member cross-functional squad (engineering, design, QA).',
      'Owned and refined 20+ Jira user stories, tracking sprint velocity, resolving dependencies, and driving a 35% reduction in open defects.',
      'Authored functional requirements and acceptance criteria in Confluence, reducing clarification cycles by 40% and eliminating rework loops.',
      'Coordinated user testing cycles across Android builds, triaging and prioritizing defects to ensure release-ready quality.'
    ],
    metrics: [
      { num: '35%', lbl: 'Defect reduction' },
      { num: '40%', lbl: 'Less rework' },
      { num: '6 wk', lbl: 'Ship cycle' }
    ]
  },
  {
    role: 'Associate Editor Intern (Ops)',
    co: 'FinBits · Mumbai',
    date: 'Feb – Jun 2022',
    hint: 'Ran content operations for a fintech platform, connecting editorial workflows to product strategy.',
    bullets: [
      'Directed a 40+ item/month content pipeline, prioritizing deliverables against business requirements and product roadmap milestones.',
      'Engineered a Kanban workflow system (Jira/Trello) that compressed average cycle time by 20–25% and improved cross-team visibility.',
      'Partnered with Product, Marketing, and Design to analyze engagement metrics, delivering optimizations that boosted page engagement by 30%.',
      'Benchmarked 5+ fintech competitors, translating findings into standardized governance frameworks and scalable content templates.',
      'Crafted 20+ biweekly articles, maintaining editorial quality standards that drove measurable app engagement increases.'
    ],
    metrics: [
      { num: '20–25%', lbl: 'Cycle time cut' },
      { num: '30%', lbl: 'Engagement up' },
      { num: '40+', lbl: 'Items/month' }
    ]
  }
];

(function renderTimeline() {
  const tl = $('#timeline');
  if (!tl) return;
  tl.innerHTML = EXPERIENCE.map((x, i) => `
    <div class="tl-item in-view">
      <div class="tl-card">
        <div class="tl-head">
          <div class="tl-num">05.${i + 1}</div>
          <div class="tl-info">
            <div class="role">${x.role}</div>
            <div class="co">${x.co}</div>
          </div>
          <div class="tl-date">${x.date}</div>
          <div class="tl-toggle">▼</div>
        </div>
        <div class="tl-body">
          <div class="tl-body-inner">
            <p class="tl-hint">${x.hint}</p>
            <ul class="tl-list">${x.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
            <div class="tl-metrics">${x.metrics.map(m => `<div class="tl-metric"><div class="num">${m.num}</div><div class="lbl">${m.lbl}</div></div>`).join('')}</div>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  tl.addEventListener('click', e => {
    const head = e.target.closest('.tl-head');
    if (!head) return;
    head.parentElement.classList.toggle('open');
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('shown'), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  $$('#timeline .in-view').forEach(el => obs.observe(el));
})();

/* ============================================================
   9.  PROJECTS, data + grid + modal
   ============================================================ */
const PROJECTS = [
  {
    id: 'spotify',
    cat: 'Product Strategy · Concept Proposal',
    title: 'Spotify Walk. Borrow Musical Identities',
    short: 'A new Spotify feature that lets you temporarily borrow someone\'s musical identity, friend, stranger, or icon, for a day, hour, or week.',
    role: 'Co-author w/ Surendra Polepalli',
    notion: 'https://coal-track-d54.notion.site/Spotify-Walk-32e4ac9c56c28079962ae754830e5366',
    quote: { text: 'You are not asking for a playlist. You are asking to hear the world the way that person hears it, their taste, their instincts, their entire musical soul.', attr: 'From the Walk product brief' },
    problem: 'Spotify knows when, why, and how your mood shifts through the day, but keeps that intelligence locked away. Music discovery is quietly breaking: the algorithm becomes a mirror, not a window.',
    approach: 'Designed a five-step Walk loop (Moment → Handshake → Experience → Memory → Social graph) anchored on a privacy-safe model that lets users temporarily borrow another listener\'s taste profile without sharing any personal data.',
    outcome: '$150M Year 1 revenue at conservative 5% Walk+ adoption · $3B+ ceiling at 10% adoption with multiple personas per user · a new fan-artist relationship Spotify alone can build.',
    gallery: [
      { src: 'images/spotify/walk-01.png', cap: 'Cover · Spotify Walk product brief' },
      { src: 'images/spotify/walk-02.png', cap: '01 · The problem, taste bubble, locked identities, regional blindness' },
      { src: 'images/spotify/walk-03.png', cap: '02 · The insight, music has always been borrowed' },
      { src: 'images/spotify/walk-04.png', cap: '03 · The product, five-step Walk loop' },
      { src: 'images/spotify/walk-05.png', cap: '04 · Premium. Celebrity Walk' },
      { src: 'images/spotify/walk-06.png', cap: 'Persona Store, individual celebrity passes' },
      { src: 'images/spotify/walk-07.png', cap: '05 · App mockup. Walk lives next to Home' },
      { src: 'images/spotify/walk-08.png', cap: '05B · Persona detail screen' },
      { src: 'images/spotify/walk-09.png', cap: '05C · Active walk session' },
      { src: 'images/spotify/walk-10.png', cap: '06 · The opportunity, by the numbers' }
    ],
    desc: 'Spotify knows your musical soul, when, why, and how your mood shifts through the day, but keeps it locked away. Meanwhile, music discovery is quietly breaking: the algorithm becomes a mirror, not a window. Walk reframes the problem: music has always been borrowed (the song in someone\'s car, at a café, in a gym), and Spotify has never built for that moment. Walk lets you temporarily borrow another user\'s taste profile, listening patterns, and algorithmic fingerprint. The premium layer. Celebrity Walk, partners with artists to package their listening identity as an experience fans can borrow (Listen like Kendrick today; Walk in Taylor\'s pre-Eras Tour world). Built around five UX moments: the request, the handshake, the experience, the memory, and the social graph.',
    bullets: [
      'Diagnosed three core failures: the taste bubble, locked identities, and regional blindness in fast-growing markets like India, Brazil, and Indonesia.',
      'Designed the five-step Walk loop. Moment → Handshake → Experience → Memory → Social graph, anchored on a privacy-safe identity model that never shares personal data.',
      'Architected a premium layer ("Walk+") with celebrity persona drops at $4.99/yr. Taylor Swift, Kendrick Lamar, Bad Bunny, AR Rahman, converting fandom into recurring revenue.',
      'Built the natural conversion funnel: free Walk with a friend → browse Persona Store → buy a single celebrity persona → upgrade to Walk+ at $17/mo for unlimited access.',
      'Designed three iOS mockup screens: the Walk tab as first-class navigation, the persona detail view (musical stats, genres bridged, avg energy), and the active walk session with live equaliser bars and auto-saved "Heard through their ears" playlists.',
      'Modeled the moat: 18 years of taste data, 600M+ active profiles, global artist relationships, taste-modeling AI, proven social features (Blend), and global catalog, assets only Spotify holds.',
      'Projected the opportunity: 600M Spotify users today, 5% conservative upgrade to Walk+, $150M Year 1 revenue (conservative), $3B+ at 10% adoption with multiple personas per user.'
    ],
    metrics: [
      { num: '$3B+', lbl: 'Revenue ceiling' },
      { num: '600M', lbl: 'Addressable users' },
      { num: '$150M', lbl: 'Y1 conservative' },
      { num: '5', lbl: 'UX moments mapped' }
    ],
    tools: ['Product strategy', 'Market sizing', 'Persona design', 'iOS UI mockups', 'Pricing strategy', 'Funnel design', 'Competitive moat analysis', 'Privacy-safe modeling']
  },
  {
    id: 'ixl',
    cat: 'EdTech Strategy · Defensive Playbook',
    title: 'How IXL Should Defend Against the Free AI Tutor Wave',
    short: 'A defensive strategy memo for IXL: how an established K-12 platform survives ChatGPT, Khanmigo, and every "free AI tutor" hitting the market.',
    role: 'Strategy Analyst',
    notion: 'https://coal-track-d54.notion.site/How-IXL-Should-Defend-Against-the-Free-AI-Tutor-Wave-3564ac9c56c280a4879ff0e0fc2e565a',
    quote: { text: '"Free" isn\'t free if it can\'t pass a district budget meeting.', attr: 'IXL strategy memo · core insight' },
    problem: 'Free LLM tutors (ChatGPT, Khanmigo, Gemini) are rewriting the unit economics of K-12 supplementary learning. IXL\'s 75M+ user base is not the moat people think it is.',
    approach: 'Mapped where IXL\'s structural advantages actually live, curriculum coverage, district trust, longitudinal student data, vs. where the AI wave commoditizes its core (Q&A, on-demand explanations).',
    outcome: 'A three-move defensive playbook: (1) reposition as system of record, (2) compete on outcomes data districts can defend, (3) embed IXL as the AI tutors\' source of truth.',
    desc: 'Free AI tutors. ChatGPT, Khanmigo, Gemini, are rewriting the unit economics of K-12 supplementary learning. IXL\'s 75M+ user base is not the moat people think it is. This memo lays out the defensive playbook: where IXL\'s structural advantages actually live (curriculum coverage, district trust, teacher workflows, longitudinal student data), where the AI wave commoditizes its core (instant Q&A, on-demand explanations), and the three strategic moves required: (1) reposition from "practice platform" to "diagnostic + adaptive system of record" that AI tutors plug into rather than replace, (2) compete on outcomes data districts can defend in budget meetings, and (3) embed IXL as the AI tutors\' source of truth, making competitors do IXL\'s top-of-funnel for free.',
    bullets: [
      'Mapped the threat landscape: free LLM tutors vs. IXL\'s $9.95/mo SKU, and where the "free" framing breaks down (curriculum alignment, teacher accountability, district contracts).',
      'Identified three durable moats: 17+ years of standards-aligned content, district-level integrations, and longitudinal performance data per student.',
      'Diagnosed three commoditization vectors AI tutors win on: instant explanations, conversational hints, and zero-marginal-cost personalization.',
      'Recommended product repositioning: shift from "where students practice" to "the system of record that proves what students learned", a moat AI chat interfaces can\'t replicate.',
      'Proposed an API/embedding strategy: license IXL\'s curriculum graph to Khanmigo, ChatGPT EDU, and tutoring agencies, turning competitors into distribution.',
      'Outlined a districts-first GTM defense: double down on superintendent-level outcomes reporting, where free AI tools have zero accountability story.',
      'Quantified the downside scenario: 30–40% practice-volume erosion if no action; flat-to-positive growth if IXL becomes the trusted measurement layer beneath the AI wave.'
    ],
    metrics: [
      { num: '75M+', lbl: 'IXL users' },
      { num: '17 yr', lbl: 'Curriculum moat' },
      { num: '3', lbl: 'Strategic moves' },
      { num: 'API', lbl: 'Embed strategy' }
    ],
    tools: ['Competitive strategy', 'Market positioning', 'EdTech analysis', 'Moat mapping', 'GTM strategy', 'Pricing analysis', 'Threat modeling']
  },
  {
    id: 'walmart',
    cat: 'Growth Strategy · Retail',
    title: 'Building Walmart\'s Next-Gen Customer Growth Engine',
    short: 'A growth engine blueprint for Walmart: how the world\'s largest retailer compounds customer LTV in the age of Amazon, TikTok Shop, and Costco.',
    role: 'Growth Strategy Analyst',
    notion: 'https://www.notion.so/Building-Walmart-s-Next-Gen-Customer-Growth-Engine-3524ac9c56c280aaab11fbda3c4284a9',
    quote: { text: 'Don\'t beat Amazon on selection. Own the lowest-cost weekly habit in America and stack margin on top.', attr: 'Walmart growth memo · thesis' },
    problem: 'Walmart serves 240M+ customers a week, yet its growth engine is still optimized for a pre-digital playbook. Amazon eats the affluent customer; TikTok Shop eats discovery; Costco eats trip frequency.',
    approach: 'Three compounding loops: acquisition via Walmart+ at sub-Prime pricing, engagement via grocery as the daily wedge, and a moat built from 4,600-store last-mile + ad network + first-party data.',
    outcome: 'Path to a $20B ad network, a financial-services wedge no bank wants, and AI-personalized weekly baskets, without chasing Amazon\'s SKU breadth.',
    desc: 'Walmart serves 240M+ customers a week, yet its growth engine is still optimized for a pre-digital playbook. This memo lays out a next-generation customer growth blueprint structured around three loops: acquisition (turning Walmart+ into the default subscription for the working family, not the premium one), engagement (using grocery as the daily wedge to compound LTV across general merchandise, pharmacy, and financial services), and moat (data + last-mile + scale that Amazon can\'t copy fast and TikTok Shop can\'t copy at all). The proposal reframes Walmart\'s growth ceiling: not by chasing Amazon\'s SKU breadth, but by owning the lowest-cost weekly habit in America and stacking margin-rich services on top.',
    bullets: [
      'Reframed the growth question from "how do we beat Amazon on selection" to "how do we own the weekly habit of 80M working-class American households."',
      'Mapped three compounding loops: acquisition via Walmart+ at sub-Amazon-Prime pricing, engagement via grocery/refill cycle, moat via store density + ad network + first-party data.',
      'Identified the underused asset: 4,600 stores within 10 miles of 90% of the US, a last-mile network that\'s 5x denser than Amazon\'s and impossible to replicate.',
      'Recommended productizing the financial services wedge. Walmart Pay, MoneyCard, BNPL, as the second compounding loop after grocery, monetizing the working-family customer base no bank wants.',
      'Modeled the ad network opportunity: $4B+ today, $20B+ trajectory if Walmart matches Amazon\'s ad-load on grocery + general merch SKUs.',
      'Argued for AI-personalized weekly basket recommendations, using Walmart\'s scanner data, not third-party signals, as the highest-leverage product investment.',
      'Laid out the 3-year sequencing: Year 1 fix Walmart+ value prop and pricing; Year 2 stack financial services; Year 3 launch the ad + AI-personalization layer at scale.'
    ],
    metrics: [
      { num: '240M', lbl: 'Weekly customers' },
      { num: '4,600', lbl: 'US stores · 10mi reach' },
      { num: '$20B', lbl: 'Ad network ceiling' },
      { num: '3', lbl: 'Compounding loops' }
    ],
    tools: ['Growth strategy', 'Retail analysis', 'Subscription economics', 'Loop design', 'Competitive positioning', 'Financial modeling', 'Last-mile logistics']
  },
  {
    id: 'curio',
    cat: 'Lean Operations · Capstone',
    title: 'Curio Coffee. Process Optimization',
    short: 'Mapped the entire order-to-delivery value stream, identified 6 bottleneck points, and unlocked $8.5K+ in annual savings.',
    role: 'Project Lead',
    quote: { text: 'We didn\'t add steps. We deleted the ones nobody noticed cost ninety seconds.', attr: 'Capstone retrospective' },
    problem: 'A real Boston coffee shop with inconsistent service times and rising costs during morning rush. Owners couldn\'t pinpoint where the lost minutes went.',
    approach: 'Physically timed every step from order to handoff during peak and off-peak hours. Built a value stream map. Redesigned around the 6 critical bottlenecks the data revealed.',
    outcome: '40% cycle-time reduction · $8.5K+ annual savings · 12 SOPs the owner still uses daily.',
    desc: 'This wasn\'t a classroom exercise, it was a real coffee operation struggling with inconsistent service times and rising costs. I led the team through a full value stream analysis, physically timing every step from order to handoff. We found 6 critical bottlenecks, redesigned the workflow, and implemented KPI tracking that the owner still uses daily. The 40% cycle time reduction translated directly into faster service and happier customers during morning rush.',
    bullets: [
      'Mapped the complete order-to-delivery value stream by observing and timing every step during peak and off-peak hours.',
      'Identified 6 critical bottleneck points including grinder queue times, milk steaming overlap, and register handoff delays.',
      'Designed and deployed KPI dashboards in Excel tracking daily throughput, waste percentage, and average service time.',
      'Implemented inventory controls that reduced over-ordering by 22% within the first month of deployment.',
      'Standardized 12 SOPs for barista workflows, from opening procedures to rush-hour line management.',
      'Presented findings and implementation plan to faculty panel as capstone deliverable.'
    ],
    metrics: [
      { num: '40%', lbl: 'Cycle time reduction' },
      { num: '$8.5K+', lbl: 'Annual savings' },
      { num: '6', lbl: 'Bottlenecks found' },
      { num: '12', lbl: 'SOPs created' }
    ],
    tools: ['Value stream mapping', 'KPI tracking', 'Excel dashboards', 'Lean methodology', 'Process mapping', 'SOP design', 'Inventory controls']
  },
  {
    id: 'remind',
    cat: 'Digital Product Design · PRD',
    title: 'Re-Mind. Alzheimer\'s Care Platform',
    short: 'Co-authored a full PRD for a digital health platform serving 6.5M+ Alzheimer\'s patients and 16M unpaid caregivers in the US.',
    role: 'Product Analyst & Co-Author',
    quote: { text: 'Designing for someone losing their memories means every interaction must be simple, compassionate, and reliable.', attr: 'Re-Mind PRD · design principles' },
    problem: '6.5M+ Alzheimer\'s patients and 16M unpaid caregivers in the US are drowning in fragmented tools. 40%+ of patients face navigation confusion daily; 60% of caregivers report health decline.',
    approach: '25 customer discovery interviews across patients, family caregivers, and pros. Translated into a structured PRD with MoSCoW-prioritized features, success metrics, and a 10-month roadmap.',
    outcome: 'A defensible product brief covering 3 core flows, medication reminders, navigation safety, and a caregiver dashboard with emergency call. Projected at $734K dev cost.',
    desc: 'Re-Mind started with a real problem: Alzheimer\'s patients and their caregivers are drowning in fragmented tools that don\'t talk to each other. Our team conducted 25 customer discovery interviews across patients, family caregivers, and professional caregivers. I helped translate those conversations into a structured PRD with prioritized features, use case flows, competitive analysis, success metrics, a 10-month development roadmap, and a $734K cost projection. We designed for people losing their memories, every interaction had to be simple, compassionate, and reliable.',
    bullets: [
      'Conducted and synthesized 25 customer discovery interviews across 3 user segments: patients, family caregivers, and professional caregivers.',
      'Mapped unmet needs including navigation confusion (40%+ of patients), medication management burden, and caregiver burnout (60% reported health decline).',
      'Benchmarked 7 existing solutions (Nymbl, MindMate, It\'s Done, Luminosity, etc.) and built a competitive feature matrix exposing critical gaps.',
      'Defined 4-tier feature prioritization (MVP through V3+) using MoSCoW framework, from medication reminders to AI-driven personalized recommendations.',
      'Architected success metrics: medication adherence rate, D1/W1/M1/M3 retention, caregiver task completion rate, and conversion funnel tracking.',
      'Developed a 10-month roadmap from team assembly through V2 launch, aligned to World Alzheimer\'s Month for marketing leverage.',
      'Projected full development costs at $734K covering an 8-person engineering team plus cloud infrastructure.'
    ],
    metrics: [
      { num: '25', lbl: 'User interviews' },
      { num: '7', lbl: 'Competitors analyzed' },
      { num: '$734K', lbl: 'Projected budget' },
      { num: '16', lbl: 'Features prioritized' }
    ],
    tools: ['Customer discovery', 'Competitive analysis', 'MoSCoW', 'Wireframing', 'Roadmap planning', 'Figma', 'Metrics design', 'HIPAA compliance']
  },
  {
    id: 'credita',
    cat: 'Product & Business Analysis',
    title: 'Credita. P2P Credit-Building App',
    short: 'Served as CTO for a P2P lending startup, led technical strategy, built financial models, and designed the product roadmap.',
    role: 'Co-founder & CTO',
    quote: { text: 'If banks won\'t underwrite trust, build a platform where users underwrite it for each other.', attr: 'Credita founding thesis' },
    problem: 'Banks lock students and young professionals out of affordable credit; existing P2P platforms lack trust and transparency.',
    approach: 'As CTO, owned technical strategy + financial models (5-year forecast, $3.6M Y1 → $100M Y5) + 20+ Jira user stories + UI mockups + the investor pitch.',
    outcome: 'Pitched for $5M at 10% equity, backed by a benchmark of 10+ fintech platforms and a guarantor-backed lending architecture.',
    desc: 'Credita was born from a simple observation: traditional banks lock out students and young professionals from affordable credit, while P2P lending platforms lack trust and transparency. As CTO, I led the technical vision, from architecture decisions to sprint planning. But this was a startup, so I also rolled up my sleeves on market research, financial modeling, and investor pitching. We benchmarked 10+ fintech platforms, interviewed 15+ potential users, built TAM/SAM projections, designed UI mockups, and pitched for $5M in funding at 10% equity.',
    bullets: [
      'Spearheaded technical strategy as CTO, defined system architecture, selected tech stack, and led sprint planning for the development team.',
      'Conducted 15+ stakeholder interviews to identify pain points: rigid lending criteria, lack of transparency, and high interest rates for underbanked users.',
      'Benchmarked 10+ fintech platforms (Upstart, Funding Circle, Prosper) and built a competitive feature matrix highlighting Credita\'s guarantor-backed lending advantage.',
      'Built Excel financial models covering TAM/SAM sizing, CAC projections, 5-year revenue forecasts ($3.6M Y1 to $100M Y5), and unit economics.',
      'Converted insights into 20+ Jira user stories with acceptance criteria, using MoSCoW prioritization for a phased 3-version roadmap.',
      'Designed UI/UX mockups for the mobile app, splash screen, registration flow, borrower dashboard, and creditor contract views.',
      'Co-presented investor pitch deck seeking $5M funding at 10% equity, covering revenue model (transaction fees, subscriptions, insurance premiums).'
    ],
    metrics: [
      { num: 'CTO', lbl: 'Role' },
      { num: '$5M', lbl: 'Funding ask' },
      { num: '10+', lbl: 'Platforms benchmarked' },
      { num: '5-yr', lbl: 'Financial forecast' }
    ],
    tools: ['Jira', 'MoSCoW', 'Excel financial models', 'TAM/SAM/CAC', 'Figma', 'Competitive analysis', 'Investor pitching', 'P2P architecture']
  },
  {
    id: 'heart',
    cat: 'Machine Learning · Published Research',
    title: 'Heart Disease Prediction using ML',
    short: 'Co-authored a published research paper comparing 5 ML algorithms on the Framingham dataset. Random Forest won at 83.96% accuracy.',
    role: 'Co-Author & ML Developer',
    quote: { text: 'Age and systolic blood pressure carried more predictive weight than every behavioral factor combined.', attr: 'Published in research paper' },
    problem: 'Heart disease kills 17.9M people annually. The Framingham dataset has the signal, but a 6:1 class imbalance destroys naive models.',
    approach: 'Boruta feature selection to isolate the most predictive variables. SMOTE to rebalance the classes. Compared 5 algorithms across accuracy, F1, and AUC.',
    outcome: 'Random Forest at 83.96% accuracy · 92.35% AUC · 79.1% F1. Paper published in a peer-reviewed journal.',
    desc: 'Heart disease kills 17.9 million people globally every year, and early prediction can save lives. For my final-year research, I worked with the Framingham Heart Study dataset (4,241 patients, 16 clinical variables) to build and compare prediction models. The key innovation was our feature selection pipeline: we used the Boruta algorithm to isolate the most predictive features and SMOTE to address a 6:1 class imbalance that would have destroyed model sensitivity. Random Forest emerged as the clear winner with 83.96% accuracy, the highest F1 score (79.1%), and best AUC (92.35%). We identified age and systolic blood pressure as the two strongest predictors. The paper was published in a peer-reviewed journal.',
    bullets: [
      'Preprocessed the Framingham dataset. 4,241 patient records with 16 clinical features including demographics, behavioral factors, and medical history.',
      'Pioneered Boruta algorithm usage for feature selection, systematically identifying the most statistically significant predictors while eliminating noise.',
      'Applied SMOTE to address severe class imbalance (6:1 negative-to-positive ratio), dramatically improving model sensitivity and precision.',
      'Implemented and compared 5 classification algorithms: Logistic Regression (66.69%), SVM (83.39%), Random Forest (83.96%), Naive Bayes (66.88%), and KNN (81.78%).',
      'Random Forest achieved the highest accuracy (83.96%), AUC (92.35%), and F1 score (79.1%) across all evaluation strategies.',
      'Applied Explainable AI (XAI) techniques to visualize feature importance, age and systolic BP emerged as the top two predictors.',
      'Co-authored the full research paper and successfully published in a peer-reviewed journal.'
    ],
    metrics: [
      { num: '83.96%', lbl: 'Best accuracy (RF)' },
      { num: '4,241', lbl: 'Patient records' },
      { num: '5', lbl: 'Algorithms compared' },
      { num: 'Pub.', lbl: 'Peer-reviewed' }
    ],
    tools: ['Python', 'scikit-learn', 'Random Forest', 'SMOTE', 'Boruta', 'Pandas', 'NumPy', 'Matplotlib', 'XAI', 'Kaggle']
  },
  {
    id: 'robot',
    cat: 'Robotics & Embedded Systems',
    title: 'Smart Floor Cleaner Robot',
    short: 'Designed and built a Bluetooth-controlled cleaning robot with dual scrub mechanisms and an Android control app.',
    role: 'Hardware Lead & Developer',
    problem: 'Build a wireless floor-cleaning robot from scratch, circuits, motors, comms, and a custom Android app to control it all.',
    approach: '8051 microcontroller as the brain, Bluetooth receiver for commands, dual rotating scrubs + water sprayer driven through L293D motor drivers. Programmed in Embedded C using Keil.',
    outcome: 'Wireless cleaning robot with full Android control across multiple floor surfaces, direction, scrub speed, and water spraying all from a phone.',
    desc: 'This was hands-on engineering at its most satisfying. We designed a wireless floor-cleaning robot from scratch, circuit design, motor control, Bluetooth communication, and a custom Android app to control it all. The robot uses an 8051 microcontroller as its brain, receives movement commands via Bluetooth from the Android app, and drives two motorized rotating cleaning scrubs plus a water sprayer.',
    bullets: [
      'Designed the complete hardware architecture: 8051 microcontroller, Bluetooth receiver module, motor driver circuits, and power regulation system.',
      'Built a custom Android application serving as the wireless transmitter, sending directional and cleaning commands over Bluetooth.',
      'Integrated dual motorized rotating cleaning scrubs with independent speed control for different floor types (tile, hardwood, concrete).',
      'Engineered a water sprayer system with a dedicated motor and spray pipes, controllable through the Android app for wet cleaning mode.',
      'Programmed the 8051 microcontroller in Embedded C using Keil compiler, handling Bluetooth command decoding, motor control, and sprayer logic.',
      'Conducted comprehensive testing across multiple floor surfaces, iterating on cleaning patterns and motor speeds for optimal performance.'
    ],
    metrics: [
      { num: '8051', lbl: 'Microcontroller' },
      { num: 'BT', lbl: 'Wireless control' },
      { num: 'Dual', lbl: 'Scrub mechanisms' },
      { num: 'And.', lbl: 'Control app' }
    ],
    tools: ['8051 Microcontroller', 'Embedded C', 'Keil compiler', 'Bluetooth', 'Android', 'Motor drivers', 'Circuit design', 'Hardware prototyping']
  },
  {
    id: 'arm',
    cat: 'Robotics & Automation',
    title: 'Hand Gesture Controlled Robotic Arm',
    short: 'Developed a multi-DOF robotic arm that mirrors human hand gestures in real-time using flex sensors and accelerometers.',
    role: 'Team Lead',
    problem: 'Build a robotic arm that moves exactly like a human hand, for industrial uses like welding paths and material handling.',
    approach: 'Flex sensors on each glove finger + accelerometers for wrist orientation. Arduino translates signals to servo motor commands per finger, in real time.',
    outcome: '5-DOF anthropomorphic arm with intuitive gesture-to-motion mapping after iterative sensor calibration.',
    desc: 'The goal was ambitious: build a robotic arm that moves exactly like a human hand. We used flex sensors strapped to a glove to capture finger bend angles and accelerometers for wrist orientation, then translated those signals into servo motor commands in real-time. The arm was designed for industrial applications, we simulated welding paths and material handling sequences to test precision.',
    bullets: [
      'Designed the mechanical architecture of a multi-DOF anthropomorphic robotic arm capable of replicating human hand movements.',
      'Integrated flex sensors on each finger and accelerometers on the wrist to capture gesture data in real-time with high fidelity.',
      'Programmed servo motor controllers to translate sensor data into precise, responsive arm movements, each finger independently actuated.',
      'Applied the system in simulated industrial contexts: welding path following and material handling pick-and-place sequences.',
      'Conducted iterative testing and calibration cycles, progressively refining gesture-to-motion accuracy through sensor threshold tuning.',
      'Achieved enhanced human-robot interaction where the arm\'s movements felt natural and responsive to the operator.'
    ],
    metrics: [
      { num: '5-DOF', lbl: 'Degrees of freedom' },
      { num: 'RT', lbl: 'Gesture tracking' },
      { num: 'Ind.', lbl: 'Apps tested' },
      { num: 'Fusion', lbl: 'Sensor' }
    ],
    tools: ['Arduino', 'Flex sensors', 'Accelerometers', 'Servo motors', 'Embedded C', '3D design', 'Robotics', 'Sensor calibration']
  },
  {
    id: 'gesture',
    cat: 'Computer Vision & AI',
    title: 'Air Gesture Recognition using CV',
    short: 'Built a webcam-based gesture recognition system using Cam-Shift, HMM, and Blob Detection for hands-free computer control.',
    role: 'Developer & Researcher',
    problem: 'Control your computer without touching anything, using just a webcam and a coloured band on your finger.',
    approach: 'OpenCV pipeline: capture → RGB→HSV → color threshold → dilation → blob detection → keystroke mapping. Compared Cam-Shift, HMM, and blob detection across lighting conditions.',
    outcome: 'Real-time gesture-to-keystroke system in Python, scrolling, navigation, all with zero touch from up to 3-4 feet away.',
    desc: 'Imagine controlling your computer without touching anything, that\'s what we built. Using just a standard laptop webcam and a red-colored band on your finger, our system tracks hand movements in real-time and translates them into keyboard commands (scrolling, navigation). The pipeline works like this: webcam captures frames, we convert RGB to HSV color space, apply color thresholding to isolate the red object, use dilation to clean up the mask, then apply a sliding window to locate the blob position.',
    bullets: [
      'Built a complete gesture recognition pipeline: webcam capture → HSV conversion → color masking → dilation → blob detection → keystroke mapping.',
      'Implemented Cam-Shift algorithm for robust real-time object tracking across varying lighting conditions and camera angles.',
      'Applied Hidden Markov Models (HMM) for gesture sequence recognition, classifying continuous motion patterns into discrete commands.',
      'Engineered Blob Detection to identify and locate the red object\'s position in each frame using contour analysis.',
      'Developed frame-to-frame comparison logic: if X(n-1) > X(n), fire right-arrow key; position delta maps to directional keyboard commands.',
      'Built the entire system in Python using OpenCV for vision processing, NumPy for computation, and Win32 API for keystroke simulation.',
      'Tested across different lighting environments and distances (up to 3–4 feet from webcam), optimizing RGB thresholds for accuracy.'
    ],
    metrics: [
      { num: 'RT', lbl: 'Detection speed' },
      { num: '4', lbl: 'Algorithms tested' },
      { num: 'Py', lbl: 'Primary language' },
      { num: 'CV2', lbl: 'Vision library' }
    ],
    tools: ['Python', 'OpenCV', 'NumPy', 'Cam-Shift', 'HMM', 'Blob detection', 'Win32 API', 'HSV color space', 'Dilation', 'Sliding window']
  }
];

// Editorial-palette SVG diagrams (cream + black + burnt orange)
const PROJECT_SVGS = {
  spotify: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="220" fill="#ece6d9"/><text x="20" y="22" font-size="8" fill="#15803d" font-family="JetBrains Mono,monospace" letter-spacing="1.5">SPOTIFY · INTERNAL BRIEF</text><circle cx="50" cy="95" r="32" fill="#141312"/><path d="M36 84 Q50 79 64 86" stroke="#15803d" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M38 95 Q50 90 62 96" stroke="#15803d" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M40 105 Q50 101 60 106" stroke="#15803d" stroke-width="1.5" fill="none" stroke-linecap="round"/><text x="100" y="62" font-size="22" fill="#141312" font-family="DM Serif Display,serif">Walk</text><text x="100" y="80" font-size="7" fill="#4a443c" font-family="Inter,sans-serif">Borrow the musical identity of</text><text x="100" y="90" font-size="7" fill="#4a443c" font-family="Inter,sans-serif">anyone, friend, stranger, icon.</text><line x1="20" y1="135" x2="380" y2="135" stroke="#141312" stroke-width="1"/><text x="20" y="148" font-size="6.5" fill="#6b6358" font-family="JetBrains Mono,monospace" letter-spacing="1">5-STEP LOOP</text><text x="20" y="160" font-size="7.5" fill="#141312" font-family="DM Serif Display,serif" font-style="italic">Moment → Handshake → Experience → Memory → Social</text><line x1="20" y1="170" x2="380" y2="170" stroke="#141312" stroke-width="1"/><text x="40" y="190" text-anchor="middle" font-size="13" fill="#15803d" font-family="DM Serif Display,serif">600M</text><text x="40" y="202" text-anchor="middle" font-size="6" fill="#6b6358" font-family="JetBrains Mono,monospace" letter-spacing="0.5">USERS</text><text x="135" y="190" text-anchor="middle" font-size="13" fill="#15803d" font-family="DM Serif Display,serif">$150M</text><text x="135" y="202" text-anchor="middle" font-size="6" fill="#6b6358" font-family="JetBrains Mono,monospace" letter-spacing="0.5">Y1 REVENUE</text><text x="240" y="190" text-anchor="middle" font-size="13" fill="#15803d" font-family="DM Serif Display,serif">$3B+</text><text x="240" y="202" text-anchor="middle" font-size="6" fill="#6b6358" font-family="JetBrains Mono,monospace" letter-spacing="0.5">CEILING @ 10%</text><text x="340" y="190" text-anchor="middle" font-size="13" fill="#15803d" font-family="DM Serif Display,serif">$17/mo</text><text x="340" y="202" text-anchor="middle" font-size="6" fill="#6b6358" font-family="JetBrains Mono,monospace" letter-spacing="0.5">WALK+</text></svg>`,

  ixl: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="220" fill="#ece6d9"/><text x="200" y="22" text-anchor="middle" font-size="8" fill="#15803d" font-family="JetBrains Mono,monospace" letter-spacing="1.5">DEFENSIVE STRATEGY · MOAT MAP</text><line x1="200" y1="40" x2="200" y2="180" stroke="#141312" stroke-width="0.5" stroke-dasharray="3 3"/><line x1="40" y1="110" x2="360" y2="110" stroke="#141312" stroke-width="0.5" stroke-dasharray="3 3"/><text x="200" y="38" text-anchor="middle" font-size="6" fill="#6b6358" font-family="JetBrains Mono,monospace">DEFENSIBLE ↑</text><text x="38" y="113" text-anchor="end" font-size="6" fill="#6b6358" font-family="JetBrains Mono,monospace">OLD</text><text x="362" y="113" font-size="6" fill="#6b6358" font-family="JetBrains Mono,monospace">NEW</text><text x="200" y="195" text-anchor="middle" font-size="6" fill="#6b6358" font-family="JetBrains Mono,monospace">COMMODITIZED ↓</text><circle cx="135" cy="68" r="22" fill="#fff" stroke="#141312" stroke-width="1.5"/><text x="135" y="66" text-anchor="middle" font-size="8" fill="#141312" font-family="DM Serif Display,serif">IXL</text><text x="135" y="78" text-anchor="middle" font-size="5.5" fill="#4a443c" font-family="Inter,sans-serif">75M users</text><circle cx="285" cy="68" r="20" fill="#15803d" stroke="#15803d" stroke-width="1.2"/><text x="285" y="66" text-anchor="middle" font-size="7.5" fill="#fff" font-family="Inter,sans-serif" font-weight="600">IXL+AI</text><text x="285" y="78" text-anchor="middle" font-size="5.5" fill="#fff" font-family="Inter,sans-serif">target</text><line x1="155" y1="68" x2="265" y2="68" stroke="#15803d" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#ax1)"/><circle cx="100" cy="155" r="14" fill="#fff" stroke="#6b6358" stroke-width="1"/><text x="100" y="158" text-anchor="middle" font-size="6" fill="#4a443c" font-family="Inter,sans-serif">Q&amp;A</text><circle cx="320" cy="155" r="18" fill="#fff" stroke="#141312" stroke-width="1.2"/><text x="320" y="153" text-anchor="middle" font-size="6.5" fill="#141312" font-family="Inter,sans-serif">ChatGPT</text><text x="320" y="161" text-anchor="middle" font-size="6.5" fill="#141312" font-family="Inter,sans-serif">EDU</text><circle cx="220" cy="150" r="13" fill="#fff" stroke="#141312" stroke-width="1"/><text x="220" y="153" text-anchor="middle" font-size="6" fill="#141312" font-family="Inter,sans-serif">Khanmigo</text><rect x="20" y="200" width="360" height="14" fill="none" stroke="#141312" stroke-width="0.8"/><text x="200" y="210" text-anchor="middle" font-size="7" fill="#15803d" font-family="JetBrains Mono,monospace" letter-spacing="0.5">3 MOVES · REPOSITION · OUTCOMES DATA · EMBED AS TRUTH-SOURCE</text><defs><marker id="ax1" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M1 1L6 4L1 7" fill="none" stroke="#15803d" stroke-width="1.5"/></marker></defs></svg>`,

  walmart: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="220" fill="#ece6d9"/><text x="200" y="22" text-anchor="middle" font-size="8" fill="#15803d" font-family="JetBrains Mono,monospace" letter-spacing="1.5">3 COMPOUNDING GROWTH LOOPS</text><circle cx="80" cy="110" r="44" fill="none" stroke="#141312" stroke-width="1.5" stroke-dasharray="4 3"/><text x="80" y="100" text-anchor="middle" font-size="6.5" fill="#15803d" font-family="JetBrains Mono,monospace" letter-spacing="0.5">LOOP 01</text><text x="80" y="115" text-anchor="middle" font-size="11" fill="#141312" font-family="DM Serif Display,serif">Acquire</text><text x="80" y="128" text-anchor="middle" font-size="6.5" fill="#4a443c" font-family="Inter,sans-serif">Walmart+ &lt; Prime</text><circle cx="200" cy="110" r="44" fill="none" stroke="#141312" stroke-width="1.5" stroke-dasharray="4 3"/><text x="200" y="100" text-anchor="middle" font-size="6.5" fill="#15803d" font-family="JetBrains Mono,monospace" letter-spacing="0.5">LOOP 02</text><text x="200" y="115" text-anchor="middle" font-size="11" fill="#141312" font-family="DM Serif Display,serif">Engage</text><text x="200" y="128" text-anchor="middle" font-size="6.5" fill="#4a443c" font-family="Inter,sans-serif">Grocery weekly</text><circle cx="320" cy="110" r="44" fill="#15803d" stroke="#15803d" stroke-width="1.5"/><text x="320" y="100" text-anchor="middle" font-size="6.5" fill="#fff" font-family="JetBrains Mono,monospace" letter-spacing="0.5">LOOP 03</text><text x="320" y="115" text-anchor="middle" font-size="11" fill="#fff" font-family="DM Serif Display,serif">Moat</text><text x="320" y="128" text-anchor="middle" font-size="6.5" fill="#fff" font-family="Inter,sans-serif">Data + ads</text><line x1="124" y1="110" x2="156" y2="110" stroke="#141312" stroke-width="1" marker-end="url(#wm1)"/><line x1="244" y1="110" x2="276" y2="110" stroke="#141312" stroke-width="1" marker-end="url(#wm1)"/><path d="M 80 154 Q 80 185 200 185 Q 320 185 320 154" stroke="#15803d" stroke-width="1" stroke-dasharray="3 2" fill="none" marker-end="url(#wm2)"/><text x="200" y="200" text-anchor="middle" font-size="6.5" fill="#6b6358" font-family="JetBrains Mono,monospace" font-style="italic">// reinvest into acquisition</text><rect x="20" y="38" width="60" height="40" rx="3" fill="none" stroke="#141312" stroke-width="0.8"/><text x="50" y="54" text-anchor="middle" font-size="13" fill="#15803d" font-family="DM Serif Display,serif">240M</text><text x="50" y="68" text-anchor="middle" font-size="5.5" fill="#6b6358" font-family="JetBrains Mono,monospace" letter-spacing="0.5">WEEKLY USERS</text><rect x="320" y="38" width="60" height="40" rx="3" fill="none" stroke="#141312" stroke-width="0.8"/><text x="350" y="54" text-anchor="middle" font-size="13" fill="#15803d" font-family="DM Serif Display,serif">4,600</text><text x="350" y="68" text-anchor="middle" font-size="5.5" fill="#6b6358" font-family="JetBrains Mono,monospace" letter-spacing="0.5">STORES · 10MI</text><defs><marker id="wm1" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M1 1L6 4L1 7" fill="none" stroke="#141312" stroke-width="1.5"/></marker><marker id="wm2" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M1 1L6 4L1 7" fill="none" stroke="#15803d" stroke-width="1"/></marker></defs></svg>`,

  curio: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="220" fill="#ece6d9"/><text x="20" y="22" font-size="8" fill="#15803d" font-family="JetBrains Mono,monospace" letter-spacing="1.5">VALUE STREAM MAP · FIG. 1</text><rect x="20" y="34" width="68" height="36" fill="#fff" stroke="#141312" stroke-width="1"/><text x="54" y="50" text-anchor="middle" font-size="8" fill="#141312" font-family="DM Serif Display,serif">Order</text><text x="54" y="62" text-anchor="middle" font-size="6.5" fill="#4a443c" font-family="JetBrains Mono,monospace">45s</text><line x1="88" y1="52" x2="108" y2="52" stroke="#141312" stroke-width="1" marker-end="url(#a1)"/><rect x="108" y="34" width="68" height="36" fill="#15803d" stroke="#15803d"/><text x="142" y="50" text-anchor="middle" font-size="8" fill="#fff" font-family="DM Serif Display,serif">Grind</text><text x="142" y="62" text-anchor="middle" font-size="6.5" fill="#fff" font-family="JetBrains Mono,monospace">90s ⚠</text><line x1="176" y1="52" x2="196" y2="52" stroke="#141312" stroke-width="1" marker-end="url(#a1)"/><rect x="196" y="34" width="68" height="36" fill="#fff" stroke="#141312" stroke-width="1"/><text x="230" y="50" text-anchor="middle" font-size="8" fill="#141312" font-family="DM Serif Display,serif">Brew</text><text x="230" y="62" text-anchor="middle" font-size="6.5" fill="#4a443c" font-family="JetBrains Mono,monospace">120s</text><line x1="264" y1="52" x2="284" y2="52" stroke="#141312" stroke-width="1" marker-end="url(#a1)"/><rect x="284" y="34" width="68" height="36" fill="#15803d" stroke="#15803d"/><text x="318" y="50" text-anchor="middle" font-size="8" fill="#fff" font-family="DM Serif Display,serif">Steam</text><text x="318" y="62" text-anchor="middle" font-size="6.5" fill="#fff" font-family="JetBrains Mono,monospace">60s ⚠</text><rect x="20" y="80" width="68" height="36" fill="#fff" stroke="#141312" stroke-width="1"/><text x="54" y="96" text-anchor="middle" font-size="8" fill="#141312" font-family="DM Serif Display,serif">Assemble</text><text x="54" y="108" text-anchor="middle" font-size="6.5" fill="#4a443c" font-family="JetBrains Mono,monospace">30s</text><line x1="88" y1="98" x2="108" y2="98" stroke="#141312" stroke-width="1" marker-end="url(#a1)"/><rect x="108" y="80" width="68" height="36" fill="#15803d" stroke="#15803d"/><text x="142" y="96" text-anchor="middle" font-size="8" fill="#fff" font-family="DM Serif Display,serif">Handoff</text><text x="142" y="108" text-anchor="middle" font-size="6.5" fill="#fff" font-family="JetBrains Mono,monospace">45s ⚠</text><line x1="20" y1="130" x2="380" y2="130" stroke="#141312" stroke-width="1"/><text x="64" y="158" text-anchor="middle" font-size="22" fill="#15803d" font-family="DM Serif Display,serif">40%</text><text x="64" y="174" text-anchor="middle" font-size="6.5" fill="#6b6358" font-family="JetBrains Mono,monospace" letter-spacing="0.5">CYCLE CUT</text><line x1="118" y1="140" x2="118" y2="180" stroke="#141312" stroke-width="0.5"/><text x="162" y="158" text-anchor="middle" font-size="22" fill="#15803d" font-family="DM Serif Display,serif">$8.5K</text><text x="162" y="174" text-anchor="middle" font-size="6.5" fill="#6b6358" font-family="JetBrains Mono,monospace" letter-spacing="0.5">SAVED · YR</text><line x1="216" y1="140" x2="216" y2="180" stroke="#141312" stroke-width="0.5"/><text x="260" y="158" text-anchor="middle" font-size="22" fill="#15803d" font-family="DM Serif Display,serif">6</text><text x="260" y="174" text-anchor="middle" font-size="6.5" fill="#6b6358" font-family="JetBrains Mono,monospace" letter-spacing="0.5">BOTTLENECKS</text><line x1="20" y1="190" x2="380" y2="190" stroke="#141312" stroke-width="1"/><text x="200" y="208" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="7" fill="#6b6358" font-style="italic">Lean Operations Capstone · Curio Coffee, Boston</text><defs><marker id="a1" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1L5 3L1 5" fill="none" stroke="#141312" stroke-width="1"/></marker></defs></svg>`,

  remind: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="220" fill="#ece6d9"/><text x="200" y="20" text-anchor="middle" font-size="8" fill="#15803d" font-family="JetBrains Mono,monospace" letter-spacing="1.5">RE-MIND · 3 CORE SCREENS</text><rect x="30" y="32" width="100" height="170" rx="8" fill="#fff" stroke="#141312" stroke-width="1.2"/><text x="80" y="50" text-anchor="middle" font-size="6.5" fill="#15803d" font-family="JetBrains Mono,monospace">MEDICATION</text><line x1="40" y1="56" x2="120" y2="56" stroke="#141312" stroke-width="0.5"/><text x="80" y="70" text-anchor="middle" font-size="8" fill="#141312" font-family="DM Serif Display,serif">Aricept 10mg</text><text x="80" y="82" text-anchor="middle" font-size="5.5" fill="#4a443c" font-family="Inter,sans-serif">8:00 AM · 1 tablet</text><rect x="48" y="92" width="64" height="18" fill="#141312"/><text x="80" y="104" text-anchor="middle" font-size="6.5" fill="#fff" font-family="Inter,sans-serif" font-weight="600">CONFIRM TAKEN</text><text x="80" y="128" text-anchor="middle" font-size="6" fill="#15803d" font-family="JetBrains Mono,monospace">NEXT</text><text x="80" y="142" text-anchor="middle" font-size="7" fill="#141312" font-family="DM Serif Display,serif">Namenda 5mg</text><text x="80" y="154" text-anchor="middle" font-size="5.5" fill="#4a443c" font-family="Inter,sans-serif">12:00 PM</text><circle cx="60" cy="178" r="6" fill="#15803d"/><circle cx="80" cy="178" r="6" fill="none" stroke="#141312" stroke-width="1"/><circle cx="100" cy="178" r="6" fill="none" stroke="#141312" stroke-width="1"/><rect x="150" y="32" width="100" height="170" rx="8" fill="#fff" stroke="#141312" stroke-width="1.2"/><text x="200" y="50" text-anchor="middle" font-size="6.5" fill="#15803d" font-family="JetBrains Mono,monospace">NAVIGATION</text><line x1="160" y1="56" x2="240" y2="56" stroke="#141312" stroke-width="0.5"/><rect x="160" y="64" width="80" height="60" fill="#ece6d9"/><path d="M175 110 L190 90 L205 100 L220 78" stroke="#15803d" stroke-width="1.5" fill="none" stroke-linecap="round"/><circle cx="175" cy="110" r="4" fill="#141312"/><circle cx="220" cy="78" r="4" fill="#15803d"/><text x="200" y="140" text-anchor="middle" font-size="6.5" fill="#141312" font-family="DM Serif Display,serif">Walk to Shawn's</text><text x="200" y="152" text-anchor="middle" font-size="5.5" fill="#15803d" font-family="Inter,sans-serif">Turn left in 50ft</text><rect x="170" y="170" width="60" height="16" fill="none" stroke="#141312" stroke-width="0.8"/><text x="200" y="181" text-anchor="middle" font-size="6" fill="#141312" font-family="Inter,sans-serif">END</text><rect x="270" y="32" width="100" height="170" rx="8" fill="#fff" stroke="#141312" stroke-width="1.2"/><text x="320" y="50" text-anchor="middle" font-size="6.5" fill="#15803d" font-family="JetBrains Mono,monospace">CAREGIVER</text><line x1="280" y1="56" x2="360" y2="56" stroke="#141312" stroke-width="0.5"/><text x="320" y="68" text-anchor="middle" font-size="5.5" fill="#4a443c" font-family="Inter,sans-serif">Hi, Rhia</text><rect x="280" y="74" width="80" height="22" fill="#ece6d9"/><text x="320" y="84" text-anchor="middle" font-size="7" fill="#141312" font-family="DM Serif Display,serif" font-style="italic">Cynthia: Stable</text><text x="320" y="92" text-anchor="middle" font-size="5" fill="#4a443c" font-family="Inter,sans-serif">All meds taken</text><rect x="280" y="100" width="36" height="20" fill="#fff" stroke="#141312" stroke-width="0.8"/><text x="298" y="113" text-anchor="middle" font-size="5.5" fill="#141312" font-family="Inter,sans-serif">Vitals</text><rect x="324" y="100" width="36" height="20" fill="#fff" stroke="#141312" stroke-width="0.8"/><text x="342" y="113" text-anchor="middle" font-size="5.5" fill="#141312" font-family="Inter,sans-serif">Location</text><rect x="280" y="126" width="80" height="22" fill="#15803d"/><text x="320" y="140" text-anchor="middle" font-size="6.5" fill="#fff" font-family="Inter,sans-serif" font-weight="600">EMERGENCY CALL</text><text x="320" y="172" text-anchor="middle" font-size="5" fill="#4a443c" font-family="Inter,sans-serif">2 appointments · this week</text></svg>`,

  credita: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="220" fill="#ece6d9"/><text x="200" y="20" text-anchor="middle" font-size="8" fill="#15803d" font-family="JetBrains Mono,monospace" letter-spacing="1.5">CREDITA · P2P APP</text><rect x="30" y="32" width="100" height="170" rx="8" fill="#fff" stroke="#141312" stroke-width="1.2"/><circle cx="80" cy="80" r="28" fill="#15803d"/><text x="80" y="92" text-anchor="middle" font-size="36" fill="#fff" font-family="DM Serif Display,serif">$</text><text x="80" y="135" text-anchor="middle" font-size="11" fill="#141312" font-family="DM Serif Display,serif" letter-spacing="2">CREDITA</text><text x="80" y="150" text-anchor="middle" font-size="5.5" fill="#4a443c" font-family="Inter,sans-serif">Lending. Borrowing. Easy.</text><line x1="50" y1="170" x2="110" y2="170" stroke="#141312" stroke-width="0.5"/><text x="80" y="184" text-anchor="middle" font-size="5.5" fill="#6b6358" font-family="JetBrains Mono,monospace" letter-spacing="0.5">SPLASH</text><rect x="150" y="32" width="100" height="170" rx="8" fill="#fff" stroke="#141312" stroke-width="1.2"/><text x="200" y="48" text-anchor="middle" font-size="5.5" fill="#15803d" font-family="JetBrains Mono,monospace">HI SAM</text><text x="200" y="62" text-anchor="middle" font-size="6.5" fill="#141312" font-family="DM Serif Display,serif" font-style="italic">What can we help with?</text><rect x="162" y="74" width="76" height="32" fill="#fff" stroke="#141312" stroke-width="1"/><text x="200" y="93" text-anchor="middle" font-size="9" fill="#141312" font-family="DM Serif Display,serif">Lending</text><rect x="162" y="112" width="76" height="32" fill="#15803d"/><text x="200" y="131" text-anchor="middle" font-size="9" fill="#fff" font-family="DM Serif Display,serif">Borrowing</text><text x="200" y="158" text-anchor="middle" font-size="5.5" fill="#6b6358" font-family="Inter,sans-serif">Recent lenders</text><circle cx="180" cy="174" r="9" fill="#ece6d9"/><circle cx="200" cy="174" r="9" fill="#ece6d9"/><circle cx="220" cy="174" r="9" fill="#ece6d9"/><text x="200" y="195" text-anchor="middle" font-size="5.5" fill="#6b6358" font-family="JetBrains Mono,monospace" letter-spacing="0.5">HOME</text><rect x="270" y="32" width="100" height="170" rx="8" fill="#fff" stroke="#141312" stroke-width="1.2"/><text x="320" y="48" text-anchor="middle" font-size="5.5" fill="#15803d" font-family="JetBrains Mono,monospace">CREDITOR #8974</text><circle cx="320" cy="68" r="14" fill="#ece6d9"/><line x1="280" y1="90" x2="360" y2="90" stroke="#141312" stroke-width="0.5"/><text x="320" y="104" text-anchor="middle" font-size="6.5" fill="#141312" font-family="DM Serif Display,serif">Contract: 2FFDDS33</text><text x="320" y="116" text-anchor="middle" font-size="5.5" fill="#4a443c" font-family="Inter,sans-serif">Recurring · 3 Month</text><rect x="282" y="122" width="76" height="14" fill="#15803d"/><text x="320" y="132" text-anchor="middle" font-size="6.5" fill="#fff" font-family="Inter,sans-serif" font-weight="600">PROCESSED ✓</text><text x="285" y="152" font-size="5.5" fill="#6b6358" font-family="JetBrains Mono,monospace">5 SEP</text><text x="357" y="152" text-anchor="end" font-size="6" fill="#141312" font-family="DM Serif Display,serif">$25</text><text x="285" y="164" font-size="5.5" fill="#6b6358" font-family="JetBrains Mono,monospace">19 SEP</text><text x="357" y="164" text-anchor="end" font-size="6" fill="#141312" font-family="DM Serif Display,serif">$25</text><text x="285" y="176" font-size="5.5" fill="#6b6358" font-family="JetBrains Mono,monospace">5 OCT</text><text x="357" y="176" text-anchor="end" font-size="6" fill="#141312" font-family="DM Serif Display,serif">$25</text><text x="320" y="195" text-anchor="middle" font-size="5.5" fill="#6b6358" font-family="JetBrains Mono,monospace" letter-spacing="0.5">CONTRACT</text></svg>`,

  heart: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="220" fill="#ece6d9"/><text x="200" y="20" text-anchor="middle" font-size="8" fill="#15803d" font-family="JetBrains Mono,monospace" letter-spacing="1.5">MODEL ACCURACY · FRAMINGHAM</text><text x="200" y="32" text-anchor="middle" font-size="6.5" fill="#6b6358" font-family="Inter,sans-serif" font-style="italic">4,241 patients · 16 features · 5 algorithms</text><line x1="20" y1="160" x2="380" y2="160" stroke="#141312" stroke-width="1"/><g transform="translate(0,40)"><rect x="40" y="${Math.round(110 - 66.69)}" width="56" height="${Math.round(66.69)}" fill="#fff" stroke="#141312" stroke-width="1"/><rect x="110" y="${Math.round(110 - 83.39)}" width="56" height="${Math.round(83.39)}" fill="#fff" stroke="#141312" stroke-width="1"/><rect x="180" y="${Math.round(110 - 83.96)}" width="56" height="${Math.round(83.96)}" fill="#15803d"/><rect x="180" y="${Math.round(110 - 83.96) - 14}" width="56" height="12" fill="#141312"/><text x="208" y="${Math.round(110 - 83.96) - 5}" text-anchor="middle" font-size="6" fill="#fff" font-family="JetBrains Mono,monospace" font-weight="600">★ BEST</text><rect x="250" y="${Math.round(110 - 66.88)}" width="56" height="${Math.round(66.88)}" fill="#fff" stroke="#141312" stroke-width="1"/><rect x="320" y="${Math.round(110 - 81.78)}" width="56" height="${Math.round(81.78)}" fill="#fff" stroke="#141312" stroke-width="1"/></g><text x="68" y="172" text-anchor="middle" font-size="6.5" fill="#6b6358" font-family="JetBrains Mono,monospace">LOGISTIC</text><text x="68" y="184" text-anchor="middle" font-size="9" fill="#141312" font-family="DM Serif Display,serif">66.69%</text><text x="138" y="172" text-anchor="middle" font-size="6.5" fill="#6b6358" font-family="JetBrains Mono,monospace">SVM</text><text x="138" y="184" text-anchor="middle" font-size="9" fill="#141312" font-family="DM Serif Display,serif">83.39%</text><text x="208" y="172" text-anchor="middle" font-size="6.5" fill="#15803d" font-family="JetBrains Mono,monospace" font-weight="600">RANDOM FOREST</text><text x="208" y="184" text-anchor="middle" font-size="9" fill="#15803d" font-family="DM Serif Display,serif">83.96%</text><text x="278" y="172" text-anchor="middle" font-size="6.5" fill="#6b6358" font-family="JetBrains Mono,monospace">NAIVE BAYES</text><text x="278" y="184" text-anchor="middle" font-size="9" fill="#141312" font-family="DM Serif Display,serif">66.88%</text><text x="348" y="172" text-anchor="middle" font-size="6.5" fill="#6b6358" font-family="JetBrains Mono,monospace">KNN</text><text x="348" y="184" text-anchor="middle" font-size="9" fill="#141312" font-family="DM Serif Display,serif">81.78%</text><text x="200" y="208" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="6" fill="#6b6358" font-style="italic">// AUC RF: 92.35% · F1 RF: 79.1% · Boruta + SMOTE</text></svg>`,

  robot: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="220" fill="#ece6d9"/><text x="200" y="20" text-anchor="middle" font-size="8" fill="#15803d" font-family="JetBrains Mono,monospace" letter-spacing="1.5">SYSTEM BLOCK DIAGRAM</text><rect x="20" y="38" width="70" height="34" fill="#fff" stroke="#141312" stroke-width="1"/><text x="55" y="54" text-anchor="middle" font-size="8" fill="#141312" font-family="DM Serif Display,serif">Android</text><text x="55" y="65" text-anchor="middle" font-size="5.5" fill="#4a443c" font-family="Inter,sans-serif">Phone App</text><line x1="90" y1="55" x2="120" y2="55" stroke="#141312" stroke-width="1" marker-end="url(#a2)"/><rect x="120" y="38" width="70" height="34" fill="#fff" stroke="#141312" stroke-width="1"/><text x="155" y="54" text-anchor="middle" font-size="8" fill="#141312" font-family="DM Serif Display,serif">Bluetooth</text><text x="155" y="65" text-anchor="middle" font-size="5.5" fill="#4a443c" font-family="Inter,sans-serif">Receiver</text><line x1="190" y1="55" x2="220" y2="55" stroke="#141312" stroke-width="1" marker-end="url(#a2)"/><rect x="220" y="32" width="80" height="46" fill="#15803d"/><text x="260" y="52" text-anchor="middle" font-size="9" fill="#fff" font-family="DM Serif Display,serif">8051 MC</text><text x="260" y="64" text-anchor="middle" font-size="5.5" fill="#fff" font-family="JetBrains Mono,monospace">Embedded C</text><rect x="320" y="34" width="60" height="30" fill="#fff" stroke="#141312" stroke-width="1"/><text x="350" y="48" text-anchor="middle" font-size="7" fill="#141312" font-family="DM Serif Display,serif">Motor Drv</text><text x="350" y="58" text-anchor="middle" font-size="5.5" fill="#4a443c" font-family="Inter,sans-serif">L293D</text><line x1="300" y1="48" x2="320" y2="48" stroke="#141312" stroke-width="1" marker-end="url(#a2)"/><rect x="20" y="100" width="80" height="30" fill="#fff" stroke="#141312" stroke-width="1"/><text x="60" y="116" text-anchor="middle" font-size="7" fill="#141312" font-family="DM Serif Display,serif">Power Supply</text><text x="60" y="124" text-anchor="middle" font-size="5.5" fill="#4a443c" font-family="Inter,sans-serif">+ Regulator</text><rect x="220" y="100" width="80" height="30" fill="#fff" stroke="#141312" stroke-width="1"/><text x="260" y="116" text-anchor="middle" font-size="7" fill="#141312" font-family="DM Serif Display,serif">Water Pump</text><text x="260" y="124" text-anchor="middle" font-size="5.5" fill="#4a443c" font-family="Inter,sans-serif">Sprayer motor</text><rect x="320" y="100" width="60" height="30" fill="#fff" stroke="#141312" stroke-width="1"/><text x="350" y="116" text-anchor="middle" font-size="7" fill="#141312" font-family="DM Serif Display,serif">Cleaning</text><text x="350" y="124" text-anchor="middle" font-size="5.5" fill="#4a443c" font-family="Inter,sans-serif">Dual scrubs</text><circle cx="350" cy="160" r="14" fill="#141312"/><circle cx="350" cy="160" r="5" fill="#fff"/><circle cx="320" cy="160" r="14" fill="#141312"/><circle cx="320" cy="160" r="5" fill="#fff"/><rect x="308" y="153" width="54" height="6" fill="#4a443c"/><text x="335" y="186" text-anchor="middle" font-size="6.5" fill="#6b6358" font-family="JetBrains Mono,monospace">VEHICLE MOTORS</text><line x1="20" y1="200" x2="380" y2="200" stroke="#141312" stroke-width="0.5"/><text x="200" y="212" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="6.5" fill="#6b6358" font-style="italic">// 8051 + BT + Motor Driver + Pump + Scrubs</text><defs><marker id="a2" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1L5 3L1 5" fill="none" stroke="#141312" stroke-width="1"/></marker></defs></svg>`,

  arm: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="220" fill="#ece6d9"/><text x="200" y="20" text-anchor="middle" font-size="8" fill="#15803d" font-family="JetBrains Mono,monospace" letter-spacing="1.5">GESTURE → MOTION PIPELINE</text><rect x="30" y="40" width="72" height="44" fill="#fff" stroke="#141312" stroke-width="1"/><text x="66" y="58" text-anchor="middle" font-size="8" fill="#141312" font-family="DM Serif Display,serif">Flex Sensors</text><text x="66" y="70" text-anchor="middle" font-size="5.5" fill="#4a443c" font-family="Inter,sans-serif">Glove fingers</text><text x="66" y="78" text-anchor="middle" font-size="5.5" fill="#4a443c" font-family="Inter,sans-serif">+ accelerometer</text><line x1="102" y1="62" x2="128" y2="62" stroke="#141312" stroke-width="1" marker-end="url(#a3)"/><rect x="128" y="40" width="72" height="44" fill="#fff" stroke="#141312" stroke-width="1"/><text x="164" y="58" text-anchor="middle" font-size="8" fill="#141312" font-family="DM Serif Display,serif">Arduino</text><text x="164" y="70" text-anchor="middle" font-size="5.5" fill="#4a443c" font-family="Inter,sans-serif">Signal proc.</text><text x="164" y="78" text-anchor="middle" font-size="5.5" fill="#4a443c" font-family="Inter,sans-serif">+ mapping</text><line x1="200" y1="62" x2="226" y2="62" stroke="#141312" stroke-width="1" marker-end="url(#a3)"/><rect x="226" y="40" width="72" height="44" fill="#15803d"/><text x="262" y="58" text-anchor="middle" font-size="8" fill="#fff" font-family="DM Serif Display,serif">Servo Motors</text><text x="262" y="70" text-anchor="middle" font-size="5.5" fill="#fff" font-family="Inter,sans-serif">5 independent</text><text x="262" y="78" text-anchor="middle" font-size="5.5" fill="#fff" font-family="Inter,sans-serif">finger control</text><line x1="298" y1="62" x2="324" y2="62" stroke="#141312" stroke-width="1" marker-end="url(#a3)"/><rect x="324" y="40" width="58" height="44" fill="#fff" stroke="#141312" stroke-width="1"/><text x="353" y="60" text-anchor="middle" font-size="8" fill="#141312" font-family="DM Serif Display,serif">Robotic</text><text x="353" y="72" text-anchor="middle" font-size="8" fill="#141312" font-family="DM Serif Display,serif">Arm</text><line x1="20" y1="105" x2="380" y2="105" stroke="#141312" stroke-width="1"/><text x="20" y="125" font-size="6.5" fill="#15803d" font-family="JetBrains Mono,monospace" letter-spacing="1">INDUSTRIAL TESTS</text><rect x="40" y="135" width="60" height="22" fill="#fff" stroke="#141312" stroke-width="0.8"/><text x="70" y="149" text-anchor="middle" font-size="7" fill="#141312" font-family="DM Serif Display,serif">Welding</text><rect x="110" y="135" width="80" height="22" fill="#fff" stroke="#141312" stroke-width="0.8"/><text x="150" y="149" text-anchor="middle" font-size="7" fill="#141312" font-family="DM Serif Display,serif">Material handling</text><text x="220" y="125" font-size="6.5" fill="#15803d" font-family="JetBrains Mono,monospace" letter-spacing="1">KEY SPECS</text><rect x="220" y="135" width="60" height="22" fill="#fff" stroke="#141312" stroke-width="0.8"/><text x="250" y="149" text-anchor="middle" font-size="7" fill="#141312" font-family="DM Serif Display,serif">5 DOF</text><rect x="290" y="135" width="80" height="22" fill="#15803d"/><text x="330" y="149" text-anchor="middle" font-size="7" fill="#fff" font-family="DM Serif Display,serif">Real-time</text><line x1="20" y1="180" x2="380" y2="180" stroke="#141312" stroke-width="0.5"/><text x="200" y="200" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="6.5" fill="#6b6358" font-style="italic">// Flex + Accelerometer → Arduino → Servos</text><defs><marker id="a3" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1L5 3L1 5" fill="none" stroke="#141312" stroke-width="1"/></marker></defs></svg>`,

  gesture: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="220" fill="#ece6d9"/><text x="200" y="20" text-anchor="middle" font-size="8" fill="#15803d" font-family="JetBrains Mono,monospace" letter-spacing="1.5">CV PROCESSING PIPELINE</text><rect x="15" y="38" width="54" height="36" fill="#fff" stroke="#141312" stroke-width="1"/><text x="42" y="54" text-anchor="middle" font-size="7" fill="#141312" font-family="DM Serif Display,serif">Webcam</text><text x="42" y="64" text-anchor="middle" font-size="5.5" fill="#4a443c" font-family="Inter,sans-serif">Capture</text><line x1="69" y1="56" x2="83" y2="56" stroke="#141312" stroke-width="1" marker-end="url(#a4)"/><rect x="83" y="38" width="54" height="36" fill="#fff" stroke="#141312" stroke-width="1"/><text x="110" y="54" text-anchor="middle" font-size="7" fill="#141312" font-family="DM Serif Display,serif">RGB→HSV</text><text x="110" y="64" text-anchor="middle" font-size="5.5" fill="#4a443c" font-family="Inter,sans-serif">Convert</text><line x1="137" y1="56" x2="151" y2="56" stroke="#141312" stroke-width="1" marker-end="url(#a4)"/><rect x="151" y="38" width="54" height="36" fill="#15803d"/><text x="178" y="54" text-anchor="middle" font-size="7" fill="#fff" font-family="DM Serif Display,serif">Color</text><text x="178" y="64" text-anchor="middle" font-size="5.5" fill="#fff" font-family="Inter,sans-serif">Threshold</text><line x1="205" y1="56" x2="219" y2="56" stroke="#141312" stroke-width="1" marker-end="url(#a4)"/><rect x="219" y="38" width="54" height="36" fill="#fff" stroke="#141312" stroke-width="1"/><text x="246" y="54" text-anchor="middle" font-size="7" fill="#141312" font-family="DM Serif Display,serif">Dilation</text><text x="246" y="64" text-anchor="middle" font-size="5.5" fill="#4a443c" font-family="Inter,sans-serif">Cleanup</text><line x1="273" y1="56" x2="287" y2="56" stroke="#141312" stroke-width="1" marker-end="url(#a4)"/><rect x="287" y="38" width="54" height="36" fill="#fff" stroke="#141312" stroke-width="1"/><text x="314" y="54" text-anchor="middle" font-size="7" fill="#141312" font-family="DM Serif Display,serif">Blob</text><text x="314" y="64" text-anchor="middle" font-size="5.5" fill="#4a443c" font-family="Inter,sans-serif">Detect</text><line x1="341" y1="56" x2="355" y2="56" stroke="#141312" stroke-width="1" marker-end="url(#a4)"/><rect x="355" y="38" width="36" height="36" fill="#141312"/><text x="373" y="54" text-anchor="middle" font-size="7" fill="#fff" font-family="DM Serif Display,serif">Key</text><text x="373" y="64" text-anchor="middle" font-size="5.5" fill="#fff" font-family="Inter,sans-serif">Press</text><line x1="20" y1="90" x2="380" y2="90" stroke="#141312" stroke-width="1"/><rect x="30" y="100" width="140" height="80" fill="#fff" stroke="#141312" stroke-width="1"/><text x="100" y="116" text-anchor="middle" font-size="6.5" fill="#15803d" font-family="JetBrains Mono,monospace">ORIGINAL</text><rect x="55" y="125" width="30" height="20" fill="#ece6d9"/><circle cx="100" cy="155" r="14" fill="#15803d"/><text x="100" y="178" text-anchor="middle" font-size="5.5" fill="#6b6358" font-family="Inter,sans-serif">Red band detected</text><rect x="200" y="100" width="140" height="80" fill="#141312"/><text x="270" y="116" text-anchor="middle" font-size="6.5" fill="#15803d" font-family="JetBrains Mono,monospace">DILATION</text><circle cx="270" cy="155" r="14" fill="#fff"/><text x="270" y="178" text-anchor="middle" font-size="5.5" fill="#fff" font-family="Inter,sans-serif">Blob isolated</text><path d="M170 145 L200 145" stroke="#15803d" stroke-width="1.5" marker-end="url(#a4)" stroke-dasharray="3 2"/><text x="200" y="200" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="6.5" fill="#6b6358" font-style="italic">// Python + OpenCV + NumPy + Win32</text><defs><marker id="a4" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1L5 3L1 5" fill="none" stroke="#141312" stroke-width="1"/></marker></defs></svg>`
};

/* --- helper: lookup project index by id --- */
function findProjectIndex(id) {
  return PROJECTS.findIndex(p => p.id === id);
}
function openModalById(id) {
  const i = findProjectIndex(id);
  if (i >= 0) openModal(i);
}

/* --- inject SVG diagrams into Featured Work cards (data-svg-id) --- */
(function injectSVGs() {
  $$('[data-svg-id]').forEach(el => {
    const id = el.dataset.svgId;
    if (PROJECT_SVGS[id]) el.innerHTML = PROJECT_SVGS[id];
  });
})();

/* --- click handlers: data-modal and data-modal-trigger open modal by id --- */
document.addEventListener('click', e => {
  const trig = e.target.closest('[data-modal-trigger]');
  if (trig) { e.preventDefault(); e.stopPropagation(); openModalById(trig.dataset.modalTrigger); return; }
  // fallback: clicking a featured-card itself (avoids triggering on internal buttons since they handle their own click)
  const card = e.target.closest('[data-modal]');
  if (card && !e.target.closest('[data-modal-trigger]') && !e.target.closest('a[href]')) {
    openModalById(card.dataset.modal);
  }
});

/* --- render Strategy Briefs subsection (IXL, Walmart, Credita) --- */
(function renderStrategyBriefs() {
  const grid = $('#briefsGrid');
  if (!grid) return;
  const briefIds = ['ixl', 'walmart', 'credita'];
  grid.innerHTML = briefIds.map(id => {
    const i = findProjectIndex(id);
    if (i < 0) return '';
    const p = PROJECTS[i];
    const num = String(i + 1).padStart(2, '0');
    return `
    <div class="proj in-view" data-modal="${p.id}">
      <div class="proj-img">${PROJECT_SVGS[p.id] || ''}</div>
      <div class="proj-body">
        <div class="proj-meta">
          <span class="filed">BRIEF №${num}</span>
          <span class="sep">/</span>
          <span>${p.cat}</span>
        </div>
        <h3>${p.title}</h3>
        <p class="proj-short">${p.short}</p>
        <span class="proj-cta">Read the brief <span class="arr">→</span></span>
      </div>
    </div>`;
  }).join('');

  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('shown'), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  $$('#briefsGrid .in-view').forEach(el => obs.observe(el));
})();

/* ============================================================
   10. PROJECT MODAL
   ============================================================ */
function openModal(i) {
  const p = PROJECTS[i];
  if (!p) return;
  $('#modalHero').innerHTML = PROJECT_SVGS[p.id] || '';
  const num = String(i + 1).padStart(2, '0');
  const triptych = (p.problem || p.approach || p.outcome) ? `
    <div class="modal-triptych">
      ${p.problem ? `<div class="modal-triptych-block"><div class="lbl">The problem</div><p>${p.problem}</p></div>` : ''}
      ${p.approach ? `<div class="modal-triptych-block"><div class="lbl">The approach</div><p>${p.approach}</p></div>` : ''}
      ${p.outcome ? `<div class="modal-triptych-block"><div class="lbl">The outcome</div><p>${p.outcome}</p></div>` : ''}
    </div>` : '';
  const quote = p.quote ? `<div class="modal-quote">${p.quote.text}<span class="attr">${p.quote.attr}</span></div>` : '';
  const tallGallery = p.id === 'spotify' ? '' : '';
  const gallery = p.gallery ? `
    <div class="modal-section">
      <h4>From the brief, visual gallery</h4>
      <div class="modal-gallery">
        ${p.gallery.map(g => `<div class="gimg" data-src="${g.src}"><img src="${g.src}" alt="${g.cap}" loading="lazy"><div class="gcap">${g.cap}</div></div>`).join('')}
      </div>
    </div>` : '';
  $('#modalContent').innerHTML = `
    <span class="modal-cat">FILE №${num} · ${p.cat}</span>
    <h2>${p.title}</h2>
    <div class="modal-role"><strong>Role:</strong> ${p.role}</div>
    ${triptych}
    ${quote}
    <div class="modal-section">
      <h4>The full story</h4>
      <p class="modal-desc">${p.desc}</p>
    </div>
    <div class="modal-section">
      <h4>By the numbers</h4>
      <div class="modal-metrics">
        ${p.metrics.map(m => `<div class="modal-metric"><div class="num">${m.num}</div><div class="lbl">${m.lbl}</div></div>`).join('')}
      </div>
    </div>
    <div class="modal-section">
      <h4>What I did</h4>
      <ul class="modal-list">${p.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
    </div>
    ${gallery}
    <div class="modal-section">
      <h4>Tools &amp; technologies</h4>
      <div class="modal-tools">${p.tools.map(t => `<span class="modal-tool">${t}</span>`).join('')}</div>
    </div>
    ${p.notion ? `<a href="${p.notion}" target="_blank" rel="noopener" class="modal-notion-btn">Read full case study on Notion ↗</a>` : ''}
  `;
  $('#modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  // wire up gallery → lightbox
  $$('.modal-gallery .gimg').forEach(g => {
    g.addEventListener('click', () => openLightbox(g.dataset.src));
  });
}
function closeModal() {
  $('#modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
$('#modalClose').addEventListener('click', closeModal);
$('#modalOverlay').addEventListener('click', e => { if (e.target.id === 'modalOverlay') closeModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeLightbox();
    closeModal();
  }
});

/* --- lightbox for gallery images --- */
function openLightbox(src) {
  const lb = $('#lightbox');
  $('#lbImg').src = src;
  lb.classList.add('open');
}
function closeLightbox() {
  $('#lightbox').classList.remove('open');
}
$('#lightbox').addEventListener('click', e => {
  if (e.target.id === 'lightbox' || e.target.id === 'lbClose' || e.target.id === 'lbImg') closeLightbox();
});

/* ============================================================
   11. FORM SUBMIT (demo)
   ============================================================ */
$('#formSend')?.addEventListener('click', () => {
  $('#formActive').style.display = 'none';
  $('#formOk').style.display = 'block';
});

console.log('%c§ Field Notes loaded', 'color:#15803d;font-family:serif;font-style:italic;font-size:13px');
console.log('%cHit ⌘K (or Ctrl+K) to summon the index.', 'color:#4a443c;font-family:monospace');
