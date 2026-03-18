import { useState, useEffect, useCallback, useRef } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const SCHOLARSHIPS = [
  { id:1, slug:"gates-millennium-scholars", title:"Gates Millennium Scholars Program", org:"Bill & Melinda Gates Foundation", orgLogo:"BG", orgColor:"#0078D4", amount:50000, currency:"USD", awardType:"Full Tuition", deadline:"2025-05-31", country:"USA", fields:["Any Field"], degrees:["Undergraduate","Graduate"], tags:["STEM","Minority","Leadership"], description:"The Gates Millennium Scholars Program selects 1,000 talented students each year to receive a good-faith scholarship. The program focuses on promoting academic excellence and providing an opportunity for outstanding minority students to reach their highest potential.", requirements:"Minimum 3.3 GPA. Demonstrated leadership and community service. Financial need required.", views:4821, status:"published", featured:true },
  { id:2, slug:"chevening-scholarship", title:"Chevening Scholarship", org:"UK Foreign Office", orgLogo:"CF", orgColor:"#C8102E", amount:45000, currency:"GBP", awardType:"Full Funding", deadline:"2025-11-05", country:"UK", fields:["Any Field"], degrees:["Masters"], tags:["International","Leadership","UK"], description:"Chevening is the UK government's international scholarships programme, funded by the Foreign, Commonwealth & Development Office. It offers full funding for a one-year master's degree at any UK university.", requirements:"Two years of work experience. Undergraduate degree. English proficiency. Must return to home country for two years after the scholarship.", views:3960, status:"published", featured:true },
  { id:3, slug:"fulbright-program", title:"Fulbright U.S. Student Program", org:"U.S. Department of State", orgLogo:"FU", orgColor:"#003F87", amount:35000, currency:"USD", awardType:"Full Funding", deadline:"2025-10-10", country:"USA", fields:["Arts","Humanities","Social Sciences","STEM"], degrees:["Graduate","Research"], tags:["International","Research","USA"], description:"The Fulbright U.S. Student Program provides grants for individually designed study/research projects or for English Teaching Assistant Programs. The program operates in more than 140 countries worldwide.", requirements:"U.S. citizenship. Bachelor's degree by start date. Language proficiency may be required depending on country.", views:5102, status:"published", featured:true },
  { id:4, slug:"rhodes-scholarship", title:"Rhodes Scholarship", org:"Rhodes Trust", orgLogo:"RT", orgColor:"#00539F", amount:60000, currency:"USD", awardType:"Full Funding", deadline:"2025-10-01", country:"UK", fields:["Any Field"], degrees:["Graduate"], tags:["Prestigious","Oxford","Leadership"], description:"The Rhodes Scholarship is the oldest and most celebrated international fellowship award in the world. Rhodes Scholars are selected from seventeen countries for postgraduate study at the University of Oxford.", requirements:"Age 18-24. Strong academic record. Leadership qualities. Commitment to public service.", views:6340, status:"published", featured:true },
  { id:5, slug:"aauw-career-development", title:"AAUW Career Development Grants", org:"AAUW Foundation", orgLogo:"AA", orgColor:"#8B2FC9", amount:12000, currency:"USD", awardType:"Partial Funding", deadline:"2025-12-15", country:"USA", fields:["Any Field"], degrees:["Certificate","Undergraduate"], tags:["Women","Career","USA"], description:"Career Development Grants provide funding to women who hold a bachelor's degree and are preparing to advance or change careers. Priority is given to AAUW members, women of color, and women pursuing their first advanced degree.", requirements:"U.S. citizen or permanent resident. Female. At least 5 years since bachelor's degree. Enrolled in accredited program.", views:1243, status:"published", featured:false },
  { id:6, slug:"knight-hennessy-scholars", title:"Knight-Hennessy Scholars Program", org:"Stanford University", orgLogo:"KH", orgColor:"#8C1515", amount:90000, currency:"USD", awardType:"Full Funding", deadline:"2025-10-09", country:"USA", fields:["Any Field"], degrees:["Graduate","MBA","JD","MD"], tags:["Stanford","Leadership","Multidisciplinary"], description:"Knight-Hennessy Scholars is one of the world's largest fully endowed graduate scholarships. The program cultivates a diverse community of future global leaders from every discipline.", requirements:"Apply within 4 years of completing undergraduate degree. Acceptance to a Stanford graduate program. Demonstrated leadership and civic commitment.", views:4100, status:"published", featured:false },
  { id:7, slug:"daad-scholarship", title:"DAAD Scholarship Program", org:"German Academic Exchange Service", orgLogo:"DA", orgColor:"#005AA0", amount:11000, currency:"EUR", awardType:"Stipend", deadline:"2025-07-20", country:"Germany", fields:["STEM","Engineering","Natural Sciences"], degrees:["Masters","PhD"], tags:["Germany","Research","STEM"], description:"DAAD scholarships enable highly-qualified graduates and postgraduates to pursue research and study programs in Germany. The scholarship covers living costs, travel expenses, and health insurance.", requirements:"Bachelor's degree with above-average results. Two academic recommendations. Language proficiency (German or English depending on program).", views:2788, status:"published", featured:false },
  { id:8, slug:"soros-fellowship", title:"Paul & Daisy Soros Fellowships for New Americans", org:"Soros Foundation", orgLogo:"SF", orgColor:"#E8401C", amount:90000, currency:"USD", awardType:"Full Funding", deadline:"2025-11-01", country:"USA", fields:["Any Field"], degrees:["Graduate"], tags:["Immigrants","USA","Leadership"], description:"The Paul & Daisy Soros Fellowships for New Americans is a merit-based program that supports immigrants and children of immigrants who are pursuing graduate school in the United States.", requirements:"New American (immigrant or child of immigrants). Under age 30. Completing undergraduate degree or already enrolled in graduate program.", views:1892, status:"published", featured:false },
  { id:9, slug:"erasmus-mundus", title:"Erasmus Mundus Joint Master Degrees", org:"European Commission", orgLogo:"EM", orgColor:"#003399", amount:24000, currency:"EUR", awardType:"Full Funding", deadline:"2026-01-15", country:"Europe", fields:["Any Field"], degrees:["Masters"], tags:["Europe","International","Multi-Country"], description:"Erasmus Mundus Joint Master Degrees are prestigious, integrated, international study programmes, jointly delivered by an international consortium of universities. Students study in at least two different European countries.", requirements:"Bachelor's degree. English proficiency. Depends on specific program requirements.", views:3210, status:"published", featured:false },
  { id:10, slug:"aga-khan-scholarship", title:"Aga Khan Foundation International Scholarship", org:"Aga Khan Foundation", orgLogo:"AK", orgColor:"#006633", amount:20000, currency:"USD", awardType:"Full Funding", deadline:"2025-03-31", country:"International", fields:["Development","Public Health","Architecture"], degrees:["Masters"], tags:["Developing Countries","Need-Based","International"], description:"The Aga Khan Foundation offers a limited number of scholarships each year for postgraduate studies to outstanding students from select developing countries who have no other means of financing their studies.", requirements:"Citizen of a developing country. Demonstrated academic excellence. Financial need. Return commitment to home country.", views:1654, status:"published", featured:false },
  { id:11, slug:"microsoft-scholarship", title:"Microsoft Scholarship Program", org:"Microsoft Corporation", orgLogo:"MS", orgColor:"#00A4EF", amount:5000, currency:"USD", awardType:"Partial Funding", deadline:"2026-02-01", country:"USA", fields:["Computer Science","Engineering","Technology"], degrees:["Undergraduate"], tags:["Tech","STEM","Corporate"], description:"Microsoft Scholarships are awarded to students who demonstrate a passion for technology, academic excellence, and a commitment to creating a more accessible and inclusive world.", requirements:"Enrolled full-time at a 4-year university. Pursuing degree in CS or related field. Minimum 3.0 GPA. Financial need may be considered.", views:2980, status:"published", featured:false },
  { id:12, slug:"schwarzman-scholars", title:"Schwarzman Scholars Program", org:"Schwarzman College, Tsinghua", orgLogo:"SC", orgColor:"#8B0000", amount:45000, currency:"USD", awardType:"Full Funding", deadline:"2025-09-20", country:"China", fields:["Public Policy","Business","Technology","International Relations"], degrees:["Masters"], tags:["China","Leadership","Global","Tsinghua"], description:"Schwarzman Scholars is a highly selective, one-year master's program at Tsinghua University in Beijing. The program aims to prepare future leaders to understand China's role in global trends.", requirements:"Age 18-28. Bachelor's degree. English language required. Leadership and professional achievement.", views:2470, status:"published", featured:false },
];

const CATEGORIES = [
  { id:1, name:"STEM", icon:"🔬", count:142, color:"#3B82F6" },
  { id:2, name:"Arts & Humanities", icon:"🎨", count:87, color:"#8B5CF6" },
  { id:3, name:"Business", icon:"💼", count:95, color:"#F59E0B" },
  { id:4, name:"Medicine", icon:"⚕️", count:63, color:"#EF4444" },
  { id:5, name:"Law", icon:"⚖️", count:41, color:"#6366F1" },
  { id:6, name:"Social Sciences", icon:"🌍", count:78, color:"#10B981" },
  { id:7, name:"Engineering", icon:"⚙️", count:119, color:"#F97316" },
  { id:8, name:"Education", icon:"📚", count:55, color:"#06B6D4" },
];

const ORGS = [
  { id:1, name:"Bill & Melinda Gates Foundation", logo:"BG", color:"#0078D4", verified:true, country:"USA", scholarships:3, description:"Driven by the belief that every life has equal value, the Bill & Melinda Gates Foundation works to help all people lead healthy, productive lives." },
  { id:2, name:"Rhodes Trust", logo:"RT", color:"#00539F", verified:true, country:"UK", scholarships:1, description:"The Rhodes Trust awards the Rhodes Scholarship, the oldest and most celebrated international fellowship award in the world." },
  { id:3, name:"Stanford University", logo:"KH", color:"#8C1515", verified:true, country:"USA", scholarships:2, description:"Stanford University is one of the world's leading research and teaching institutions, committed to finding solutions to big challenges." },
];

// ─── UTILITIES ────────────────────────────────────────────────────────────────
function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
function formatAmount(amount, currency) {
  return new Intl.NumberFormat("en-US", { style:"currency", currency, maximumFractionDigits:0 }).format(amount);
}
function useDebounce(value, delay) {
  const [deb, setDeb] = useState(value);
  useEffect(() => { const t = setTimeout(() => setDeb(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return deb;
}

// ─── GLOBAL STATE (simple store) ──────────────────────────────────────────────
const store = {
  user: null,
  bookmarks: new Set([1, 3]),
  applications: [
    { id:1, scholarshipId:2, status:"submitted", appliedAt:"2025-03-01" },
    { id:2, scholarshipId:4, status:"pending", appliedAt:"2025-03-10" },
  ],
  listeners: new Set(),
  notify() { this.listeners.forEach(fn => fn()); },
  login(u) { this.user = u; this.notify(); },
  logout() { this.user = null; this.notify(); },
  toggleBookmark(id) { this.bookmarks.has(id) ? this.bookmarks.delete(id) : this.bookmarks.add(id); this.notify(); },
  addApplication(scholarshipId) {
    if (!this.applications.find(a => a.scholarshipId === scholarshipId)) {
      this.applications.push({ id: Date.now(), scholarshipId, status:"pending", appliedAt: new Date().toISOString().slice(0,10) });
      this.notify();
    }
  },
  updateAppStatus(id, status) { const a = this.applications.find(a => a.id === id); if(a) { a.status = status; this.notify(); } },
};
function useStore() {
  const [, tick] = useState(0);
  useEffect(() => { const fn = () => tick(n => n+1); store.listeners.add(fn); return () => store.listeners.delete(fn); }, []);
  return store;
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
:root {
  --bg: #F7F8FC;
  --surface: #FFFFFF;
  --surface2: #EEF1F8;
  --border: #DDE2EF;
  --text: #0F1D4A;
  --text2: #4A5480;
  --text3: #8891B0;
  --accent: #1B2D6B;
  --accent2: #C9921A;
  --accent-bg: #EEF1F8;
  --gold-bg: #FEF6E4;
  --danger: #C0392B;
  --info: #1B2D6B;
  --radius: 12px;
  --shadow: 0 1px 3px rgba(27,45,107,0.08), 0 4px 16px rgba(27,45,107,0.06);
  --shadow-lg: 0 8px 32px rgba(27,45,107,0.13);
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
h1,h2,h3,h4 { font-family: 'Playfair Display', serif; }
a { text-decoration: none; color: inherit; cursor: pointer; }
button { cursor: pointer; font-family: 'DM Sans', sans-serif; }
input, select, textarea { font-family: 'DM Sans', sans-serif; }
.app { min-height: 100vh; display: flex; flex-direction: column; }

/* NAV */
.nav { background: var(--surface); border-bottom: 1px solid var(--border); position: sticky; top:0; z-index:100; }
.nav-inner { max-width: 1280px; margin: 0 auto; padding: 0 24px; height: 64px; display: flex; align-items: center; gap: 32px; }
.nav-logo { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 900; color: var(--accent); letter-spacing: -0.5px; }
.nav-logo span { color: var(--accent2); }
.nav-links { display: flex; gap: 4px; margin-left: auto; }
.nav-link { padding: 8px 14px; border-radius: 8px; font-size: 14px; font-weight: 500; color: var(--text2); transition: all 0.15s; border: none; background: none; }
.nav-link:hover { background: var(--surface2); color: var(--text); }
.nav-link.active { background: var(--accent-bg); color: var(--accent); }
.nav-actions { display: flex; gap: 8px; align-items: center; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 9px 18px; border-radius: var(--radius); font-size: 14px; font-weight: 500; border: none; transition: all 0.15s; white-space: nowrap; }
.btn-primary { background: var(--accent); color: white; }
.btn-primary:hover { background: #145a3c; transform: translateY(-1px); }
.btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
.btn-secondary:hover { background: var(--border); }
.btn-ghost { background: none; color: var(--text2); }
.btn-ghost:hover { background: var(--surface2); color: var(--text); }
.btn-sm { padding: 6px 12px; font-size: 13px; }
.btn-lg { padding: 13px 28px; font-size: 16px; border-radius: 14px; }
.btn-danger { background: #FEF2F2; color: var(--danger); border: 1px solid #FECACA; }
.btn-danger:hover { background: #FEE2E2; }
.btn-gold { background: var(--accent2); color: white; }
.btn-gold:hover { background: #b8922f; }

/* HERO */
.hero { background: linear-gradient(135deg, #0D1A47 0%, #1B2D6B 50%, #0D1A47 100%); color: white; padding: 80px 24px 100px; position: relative; overflow: hidden; }
.hero::before { content:''; position:absolute; inset:0; background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
.hero-inner { max-width: 1280px; margin: 0 auto; position: relative; }
.hero h1 { font-size: clamp(36px, 5vw, 64px); font-weight: 900; line-height: 1.1; margin-bottom: 16px; }
.hero h1 em { font-style: italic; color: var(--accent2); }
.hero p { font-size: 18px; opacity: 0.85; margin-bottom: 40px; max-width: 560px; font-weight: 300; }
.hero-search { display: flex; gap: 0; max-width: 640px; background: white; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 40px rgba(0,0,0,0.2); }
.hero-search input { flex:1; padding: 16px 20px; border: none; outline: none; font-size: 16px; color: var(--text); }
.hero-search button { padding: 16px 28px; background: var(--accent2); color: white; border: none; font-weight: 600; font-size: 15px; }
.hero-stats { display: flex; gap: 48px; margin-top: 56px; flex-wrap: wrap; }
.hero-stat .num { font-size: 36px; font-weight: 700; font-family: 'Playfair Display', serif; }
.hero-stat .lbl { font-size: 13px; opacity: 0.7; margin-top: 2px; }

/* SECTIONS */
.section { padding: 72px 24px; }
.section-inner { max-width: 1280px; margin: 0 auto; }
.section-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 32px; flex-wrap: wrap; gap: 12px; }
.section-title { font-size: 32px; font-weight: 700; }
.section-title span { color: var(--accent); }

/* CARDS */
.cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; box-shadow: var(--shadow); transition: all 0.2s; position: relative; }
.card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); border-color: #D5D3CC; }
.card-logo { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 14px; margin-bottom: 12px; flex-shrink: 0; }
.card-row { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
.card-org { font-size: 12px; color: var(--text3); font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
.card-title { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; margin: 4px 0 12px; line-height: 1.3; }
.card-amount { font-size: 22px; font-weight: 700; color: var(--accent); font-family: 'Playfair Display', serif; }
.card-amount-type { font-size: 12px; color: var(--text3); font-weight: 400; }
.card-meta { display: flex; gap: 16px; margin: 12px 0; font-size: 13px; color: var(--text2); flex-wrap: wrap; }
.card-meta span { display: flex; align-items: center; gap: 4px; }
.tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
.tag { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; background: var(--surface2); color: var(--text2); border: 1px solid var(--border); letter-spacing: 0.3px; }
.tag.green { background: #EEF1F8; color: #1B2D6B; border-color: #BCC5E8; }
.deadline-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.deadline-badge.urgent { background: #FEF2F2; color: #B91C1C; border: 1px solid #FECACA; }
.deadline-badge.soon { background: #FFFBEB; color: #92400E; border: 1px solid #FDE68A; }
.deadline-badge.ok { background: #FEF6E4; color: #7A5210; border: 1px solid #F5D48A; }
.deadline-badge.closed { background: var(--surface2); color: var(--text3); border: 1px solid var(--border); }
.bookmark-btn { position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); display: flex; align-items: center; justify-content: center; font-size: 16px; transition: all 0.15s; }
.bookmark-btn:hover { background: var(--surface2); transform: scale(1.1); }
.bookmark-btn.active { background: #FFFBEB; border-color: #FDE68A; }

/* FILTERS SIDEBAR */
.browse-layout { display: grid; grid-template-columns: 260px 1fr; gap: 28px; }
.filters-panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; height: fit-content; position: sticky; top: 80px; }
.filter-group { margin-bottom: 20px; }
.filter-group-title { font-size: 12px; font-weight: 600; color: var(--text3); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; }
.filter-option { display: flex; align-items: center; gap: 8px; padding: 5px 0; font-size: 14px; color: var(--text2); cursor: pointer; }
.filter-option input { accent-color: var(--accent); }
.filter-option:hover { color: var(--text); }

/* BROWSE HEADER */
.browse-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
.search-input { flex: 1; min-width: 200px; padding: 10px 16px; border: 1px solid var(--border); border-radius: 10px; font-size: 14px; outline: none; background: var(--surface); }
.search-input:focus { border-color: var(--accent); }
.sort-select { padding: 10px 14px; border: 1px solid var(--border); border-radius: 10px; font-size: 14px; outline: none; background: var(--surface); }
.active-filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
.filter-pill { display: flex; align-items: center; gap: 4px; padding: 4px 10px; background: var(--accent-bg); color: var(--accent); border-radius: 20px; font-size: 12px; font-weight: 500; }
.results-count { font-size: 14px; color: var(--text3); margin-bottom: 16px; }

/* DETAIL PAGE */
.detail-layout { display: grid; grid-template-columns: 1fr 320px; gap: 32px; max-width: 1280px; margin: 0 auto; padding: 40px 24px; }
.detail-header { background: linear-gradient(135deg, #0D1A47 0%, #1B2D6B 100%); color: white; padding: 48px 24px; }
.detail-header-inner { max-width: 1280px; margin: 0 auto; display: flex; gap: 24px; align-items: flex-start; flex-wrap: wrap; }
.detail-logo { width: 72px; height: 72px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 22px; flex-shrink: 0; border: 3px solid rgba(255,255,255,0.2); }
.detail-title { font-size: clamp(24px, 3vw, 36px); font-weight: 900; margin: 4px 0 8px; }
.detail-org { opacity: 0.8; font-size: 16px; }
.detail-amount { font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 900; color: var(--accent2); }
.sidebar-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow); }
.sidebar-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 14px; }
.sidebar-row:last-child { border-bottom: none; }
.sidebar-row .label { color: var(--text3); }
.sidebar-row .value { font-weight: 500; color: var(--text); text-align: right; }
.tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--border); margin-bottom: 24px; }
.tab { padding: 10px 16px; font-size: 14px; font-weight: 500; color: var(--text3); border: none; background: none; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.15s; }
.tab.active { color: var(--accent); border-bottom-color: var(--accent); }
.tab:hover { color: var(--text); }
.prose p { margin-bottom: 16px; font-size: 15px; line-height: 1.75; color: var(--text2); }
.prose h4 { margin: 20px 0 8px; font-size: 16px; }

/* DASHBOARD */
.dashboard-layout { display: grid; grid-template-columns: 220px 1fr; min-height: calc(100vh - 64px); }
.sidebar { background: var(--surface); border-right: 1px solid var(--border); padding: 24px 12px; }
.sidebar-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; font-size: 14px; font-weight: 500; color: var(--text2); cursor: pointer; border: none; background: none; width: 100%; text-align: left; margin-bottom: 2px; transition: all 0.15s; }
.sidebar-nav-item:hover { background: var(--surface2); color: var(--text); }
.sidebar-nav-item.active { background: var(--accent-bg); color: var(--accent); }
.sidebar-section { font-size: 11px; color: var(--text3); font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; padding: 16px 12px 8px; }
.dashboard-content { padding: 32px; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; margin-bottom: 32px; }
.stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; }
.stat-num { font-size: 32px; font-weight: 700; font-family: 'Playfair Display', serif; color: var(--text); }
.stat-label { font-size: 13px; color: var(--text3); margin-top: 4px; }
.stat-card.accent { background: var(--accent); border-color: var(--accent); }
.stat-card.accent .stat-num, .stat-card.accent .stat-label { color: white; }

/* TABLE */
.table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
table { width: 100%; border-collapse: collapse; }
th { padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; background: var(--surface2); border-bottom: 1px solid var(--border); }
td { padding: 14px 16px; font-size: 14px; color: var(--text2); border-bottom: 1px solid var(--border); vertical-align: middle; }
tr:last-child td { border-bottom: none; }
tr:hover td { background: var(--surface2); }

/* STATUS BADGES */
.status { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.status::before { content:''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; opacity: 0.7; }
.status.pending { background: #FFFBEB; color: #92400E; }
.status.submitted { background: #EFF6FF; color: #1D4ED8; }
.status.accepted { background: #F0FDF4; color: #166534; }
.status.rejected { background: #FEF2F2; color: #991B1B; }
.status.published { background: #F0FDF4; color: #166534; }
.status.draft { background: var(--surface2); color: var(--text3); }
.status.closed { background: #FEF2F2; color: #991B1B; }

/* AUTH */
.auth-page { min-height: calc(100vh - 64px); display: flex; align-items: center; justify-content: center; padding: 24px; background: var(--surface2); }
.auth-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 40px; width: 100%; max-width: 440px; box-shadow: var(--shadow-lg); }
.auth-title { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
.auth-sub { color: var(--text3); font-size: 14px; margin-bottom: 28px; }
.form-group { margin-bottom: 16px; }
.form-label { display: block; font-size: 13px; font-weight: 500; color: var(--text2); margin-bottom: 6px; }
.form-input { width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: 10px; font-size: 14px; outline: none; transition: border-color 0.15s; background: var(--bg); }
.form-input:focus { border-color: var(--accent); background: white; }
.role-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 0; background: var(--surface2); border-radius: 10px; padding: 4px; margin-bottom: 24px; }
.role-btn { padding: 8px; border-radius: 8px; font-size: 14px; font-weight: 500; border: none; background: none; color: var(--text2); transition: all 0.15s; }
.role-btn.active { background: var(--surface); color: var(--text); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; color: var(--text3); font-size: 13px; }
.divider::before, .divider::after { content:''; flex:1; height: 1px; background: var(--border); }

/* CATEGORY GRID */
.cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
.cat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px 16px; text-align: center; transition: all 0.2s; cursor: pointer; }
.cat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
.cat-icon { font-size: 28px; margin-bottom: 8px; }
.cat-name { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 2px; }
.cat-count { font-size: 12px; color: var(--text3); }

/* TOAST */
.toast-wrap { position: fixed; bottom: 24px; right: 24px; z-index: 999; display: flex; flex-direction: column; gap: 8px; }
.toast { background: var(--text); color: white; padding: 12px 18px; border-radius: 10px; font-size: 14px; font-weight: 500; box-shadow: var(--shadow-lg); animation: toastIn 0.3s ease; }
.toast.success { background: var(--accent); }
.toast.error { background: var(--danger); }
@keyframes toastIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }

/* MISC */
.badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
.badge.verified { background: #EFF6FF; color: #1D4ED8; }
.badge.gold { background: #FFFBEB; color: #92400E; }
.empty-state { text-align: center; padding: 60px 24px; color: var(--text3); }
.empty-state .icon { font-size: 48px; margin-bottom: 12px; }
.empty-state h3 { font-size: 20px; color: var(--text2); margin-bottom: 8px; font-family: 'Playfair Display', serif; }
.pagination { display: flex; align-items: center; gap: 8px; margin-top: 32px; justify-content: center; }
.page-btn { width: 36px; height: 36px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); font-size: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.page-btn:hover, .page-btn.active { background: var(--accent); color: white; border-color: var(--accent); }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.view-counter { display: flex; align-items: center; gap: 4px; font-size: 13px; color: var(--text3); }

/* Kanban */
.kanban { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.kanban-col { background: var(--surface2); border-radius: var(--radius); padding: 12px; }
.kanban-col-title { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.6px; color: var(--text3); margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; }
.kanban-count { background: var(--border); color: var(--text3); border-radius: 12px; padding: 1px 8px; font-size: 11px; }
.kanban-item { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 14px; margin-bottom: 10px; font-size: 14px; }
.kanban-item-title { font-weight: 600; color: var(--text); margin-bottom: 4px; line-height: 1.3; font-size: 13px; }
.kanban-item-org { font-size: 12px; color: var(--text3); }

/* CREATE FORM */
.form-steps { display: flex; gap: 0; margin-bottom: 32px; }
.form-step { flex: 1; padding: 12px; text-align: center; font-size: 13px; font-weight: 500; color: var(--text3); border-bottom: 2px solid var(--border); position: relative; }
.form-step.active { color: var(--accent); border-bottom-color: var(--accent); }
.form-step.done { color: var(--text2); border-bottom-color: #F5D48A; }
.form-step-num { width: 24px; height: 24px; border-radius: 50%; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 12px; margin: 0 auto 4px; }
.form-step.active .form-step-num { background: var(--accent); color: white; }
.form-step.done .form-step-num { background: #F5D48A; color: #7A5210; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-textarea { width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: 10px; font-size: 14px; outline: none; min-height: 120px; resize: vertical; transition: border-color 0.15s; background: var(--bg); }
.form-textarea:focus { border-color: var(--accent); background: white; }
.form-select { width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: 10px; font-size: 14px; outline: none; background: var(--bg); appearance: none; }
.form-select:focus { border-color: var(--accent); }

@media (max-width: 768px) {
  .browse-layout { grid-template-columns: 1fr; }
  .filters-panel { position: static; }
  .detail-layout { grid-template-columns: 1fr; }
  .dashboard-layout { grid-template-columns: 1fr; }
  .sidebar { display: none; }
  .kanban { grid-template-columns: 1fr 1fr; }
  .hero-stats { gap: 24px; }
  .form-row { grid-template-columns: 1fr; }
}
`;

// ─── TOAST ─────────────────────────────────────────────────────────────────
const toastStore = { toasts: [], listeners: new Set(), notify() { this.listeners.forEach(fn => fn()); },
  show(msg, type="success") { const id = Date.now(); this.toasts.push({id, msg, type}); this.notify(); setTimeout(() => { this.toasts = this.toasts.filter(t => t.id !== id); this.notify(); }, 3000); }
};
function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => { const fn = () => setToasts([...toastStore.toasts]); toastStore.listeners.add(fn); return () => toastStore.listeners.delete(fn); }, []);
  return <div className="toast-wrap">{toasts.map(t => <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>)}</div>;
}

// ─── DEADLINE BADGE ────────────────────────────────────────────────────────
function DeadlineBadge({ deadline }) {
  const days = daysUntil(deadline);
  if (days < 0) return <span className="deadline-badge closed">⊘ Closed</span>;
  if (days <= 7) return <span className="deadline-badge urgent">⚠ {days}d left</span>;
  if (days <= 30) return <span className="deadline-badge soon">◷ {days}d left</span>;
  return <span className="deadline-badge ok">◷ {days}d left</span>;
}

// ─── SCHOLARSHIP CARD ──────────────────────────────────────────────────────
function ScholarCard({ s, onNavigate }) {
  const { bookmarks, toggleBookmark, user } = useStore();
  const isBookmarked = bookmarks.has(s.id);
  return (
    <div className="card" onClick={() => onNavigate("detail", s.slug)} style={{cursor:"pointer"}}>
      <button className={`bookmark-btn ${isBookmarked ? "active" : ""}`} onClick={e => { e.stopPropagation(); if(!user) { toastStore.show("Please login to bookmark","error"); return; } toggleBookmark(s.id); toastStore.show(isBookmarked ? "Removed bookmark" : "Bookmarked!"); }}>
        {isBookmarked ? "★" : "☆"}
      </button>
      <div className="card-row">
        <div className="card-logo" style={{background: s.orgColor}}>{s.orgLogo}</div>
        <div>
          <div className="card-org">{s.org}</div>
          <h3 className="card-title" style={{margin:0}}>{s.title}</h3>
        </div>
      </div>
      <div className="card-amount">{formatAmount(s.amount, s.currency)} <span className="card-amount-type">/ {s.awardType}</span></div>
      <div className="card-meta">
        <span>🌍 {s.country}</span>
        <span>🎓 {s.degrees[0]}{s.degrees.length > 1 ? ` +${s.degrees.length-1}` : ""}</span>
        <span><DeadlineBadge deadline={s.deadline} /></span>
      </div>
      <div className="tags">
        {s.fields[0] !== "Any Field" && <span className="tag green">{s.fields[0]}</span>}
        {s.tags.slice(0,3).map(t => <span key={t} className="tag">{t}</span>)}
      </div>
      <div className="view-counter" style={{marginTop:12}}>👁 {s.views.toLocaleString()} views</div>
    </div>
  );
}

// ─── NAVBAR ────────────────────────────────────────────────────────────────
function Nav({ page, onNavigate }) {
  const { user, logout } = useStore();
  return (
    <nav className="nav">
      <div className="nav-inner">
        <div onClick={() => onNavigate("home")} style={{cursor:"pointer", display:"flex", alignItems:"center", gap:10}}>
          <svg width="38" height="38" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Open book */}
            <path d="M10 80 Q60 65 110 80 L110 95 Q60 80 10 95 Z" fill="#1B2D6B"/>
            <path d="M10 80 Q60 65 110 80" stroke="#C9921A" strokeWidth="3" fill="none"/>
            <path d="M60 65 L60 95" stroke="#C9921A" strokeWidth="2"/>
            {/* Left page */}
            <path d="M10 80 Q35 68 60 65 L60 95 Q35 93 10 95 Z" fill="#1B2D6B" opacity="0.85"/>
            {/* Right page */}
            <path d="M60 65 Q85 68 110 80 L110 95 Q85 93 60 95 Z" fill="#1B2D6B"/>
            {/* Gold page edges */}
            <path d="M10 80 Q35 70 60 67" stroke="#C9921A" strokeWidth="2.5" fill="none"/>
            <path d="M60 67 Q85 70 110 80" stroke="#C9921A" strokeWidth="2.5" fill="none"/>
            {/* Globe */}
            <circle cx="60" cy="52" r="22" fill="#1B2D6B" stroke="#2A45A0" strokeWidth="1.5"/>
            <ellipse cx="60" cy="52" rx="10" ry="22" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <line x1="38" y1="52" x2="82" y2="52" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <line x1="41" y1="42" x2="79" y2="42" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <line x1="41" y1="62" x2="79" y2="62" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <path d="M48 32 Q55 38 55 52 Q55 66 48 72" stroke="white" strokeWidth="1" fill="none" opacity="0.5"/>
            <path d="M72 32 Q65 38 65 52 Q65 66 72 72" stroke="white" strokeWidth="1" fill="none" opacity="0.5"/>
            {/* Graduation cap */}
            <rect x="38" y="26" width="44" height="6" rx="2" fill="#1A1A1A"/>
            <polygon points="60,14 38,26 82,26" fill="#1A1A1A"/>
            {/* Tassel */}
            <line x1="82" y1="26" x2="88" y2="34" stroke="#C9921A" strokeWidth="2.5"/>
            <circle cx="88" cy="36" r="3" fill="#C9921A"/>
          </svg>
          <div style={{lineHeight:1.1}}>
            <div style={{fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:900, color:"#1B2D6B", letterSpacing:"-0.3px"}}>Dani</div>
            <div style={{fontFamily:"'Playfair Display',serif", fontSize:11, fontWeight:700, color:"#C9921A", letterSpacing:"0.5px", textTransform:"uppercase"}}>Global Academy</div>
          </div>
        </div>
        <div className="nav-links">
          <button className={`nav-link ${page==="home"?"active":""}`} onClick={() => onNavigate("home")}>Home</button>
          <button className={`nav-link ${page==="browse"?"active":""}`} onClick={() => onNavigate("browse")}>Browse</button>
          {user && <button className={`nav-link ${page==="dashboard"?"active":""}`} onClick={() => onNavigate("dashboard")}>Dashboard</button>}
          {user?.role === "org" && <button className={`nav-link ${page==="create"?"active":""}`} onClick={() => onNavigate("create")}>Post Scholarship</button>}
        </div>
        <div className="nav-actions">
          {!user ? <>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate("login")}>Login</button>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate("register")}>Sign Up</button>
          </> : <>
            <span style={{fontSize:13, color:"var(--text2)"}}>👋 {user.name.split(" ")[0]}</span>
            <button className="btn btn-secondary btn-sm" onClick={() => { logout(); toastStore.show("Logged out"); onNavigate("home"); }}>Logout</button>
          </>}
        </div>
      </div>
    </nav>
  );
}

// ─── HOMEPAGE ──────────────────────────────────────────────────────────────
function HomePage({ onNavigate }) {
  const [search, setSearch] = useState("");
  const featured = SCHOLARSHIPS.filter(s => s.featured);
  const expiring = SCHOLARSHIPS.filter(s => { const d = daysUntil(s.deadline); return d > 0 && d <= 30; }).slice(0, 3);
  function doSearch() { if(search.trim()) onNavigate("browse", null, search); }
  return (
    <div>
      {/* HERO */}
      <div className="hero">
        <div className="hero-inner">
          <h1>Find Your <em>Dream</em><br/>Scholarship</h1>
          <p>Discover thousands of scholarships from leading organizations around the world. Your future starts here.</p>
          <div className="hero-search">
            <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key==="Enter" && doSearch()} placeholder="Search by keyword, field, or country..." />
            <button onClick={doSearch}>Search →</button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><div className="num">2,400+</div><div className="lbl">Active Scholarships</div></div>
            <div className="hero-stat"><div className="num">$180M+</div><div className="lbl">Total Award Value</div></div>
            <div className="hero-stat"><div className="num">140</div><div className="lbl">Countries Covered</div></div>
            <div className="hero-stat"><div className="num">85K+</div><div className="lbl">Students Helped</div></div>
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="section" style={{background:"var(--surface2)"}}>
        <div className="section-inner">
          <div className="section-header">
            <h2 className="section-title">Browse by <span>Category</span></h2>
          </div>
          <div className="cat-grid">
            {CATEGORIES.map(c => (
              <div key={c.id} className="cat-card" onClick={() => onNavigate("browse")}>
                <div className="cat-icon">{c.icon}</div>
                <div className="cat-name">{c.name}</div>
                <div className="cat-count">{c.count} scholarships</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURED */}
      <div className="section">
        <div className="section-inner">
          <div className="section-header">
            <h2 className="section-title">Featured <span>Scholarships</span></h2>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate("browse")}>View All →</button>
          </div>
          <div className="cards-grid">
            {featured.map(s => <ScholarCard key={s.id} s={s} onNavigate={onNavigate} />)}
          </div>
        </div>
      </div>

      {/* EXPIRING SOON */}
      {expiring.length > 0 && (
        <div className="section" style={{background:"var(--surface2)"}}>
          <div className="section-inner">
            <div className="section-header">
              <h2 className="section-title">⚠ Closing <span>Soon</span></h2>
              <span style={{fontSize:13,color:"var(--text3)"}}>Don't miss these opportunities</span>
            </div>
            <div className="cards-grid">
              {expiring.map(s => <ScholarCard key={s.id} s={s} onNavigate={onNavigate} />)}
            </div>
          </div>
        </div>
      )}

      {/* HOW IT WORKS */}
      <div className="section">
        <div className="section-inner">
          <div className="section-header" style={{justifyContent:"center"}}>
            <h2 className="section-title" style={{textAlign:"center"}}>How It <span>Works</span></h2>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:24, marginTop:8}}>
            {[{n:1,icon:"🔍",title:"Search & Filter",desc:"Browse thousands of scholarships filtered by your field, degree, country, and deadline."},{n:2,icon:"📌",title:"Save & Apply",desc:"Bookmark opportunities and track your applications in one organized dashboard."},{n:3,icon:"🎓",title:"Win Funding",desc:"Submit your applications and receive life-changing scholarship funding."}].map(s => (
              <div key={s.n} className="card" style={{textAlign:"center",padding:"32px 24px"}}>
                <div style={{width:56,height:56,background:"var(--accent-bg)",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 16px"}}>{s.icon}</div>
                <h3 style={{fontFamily:"'DM Sans', sans-serif", fontSize:18, fontWeight:600, marginBottom:8}}>{s.title}</h3>
                <p style={{fontSize:14, color:"var(--text3)", lineHeight:1.6}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{background:"linear-gradient(135deg,#0D1A47 0%,#1B2D6B 100%)", padding:"64px 24px", textAlign:"center", color:"white"}}>
        <h2 style={{fontSize:36, marginBottom:12, color:"white"}}>Ready to Find Your Scholarship?</h2>
        <p style={{fontSize:17, opacity:0.85, marginBottom:28}}>Join 85,000+ students who found funding through Dani Global Academy</p>
        <div style={{display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap"}}>
          <button className="btn btn-gold btn-lg" onClick={() => onNavigate("register")}>Get Started — Free</button>
          <button className="btn btn-lg" style={{background:"rgba(255,255,255,0.15)", color:"white", borderColor:"rgba(255,255,255,0.3)"}} onClick={() => onNavigate("browse")}>Browse Scholarships</button>
        </div>
      </div>
    </div>
  );
}

// ─── BROWSE PAGE ───────────────────────────────────────────────────────────
function BrowsePage({ onNavigate, initialSearch="" }) {
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState("newest");
  const [filters, setFilters] = useState({ countries:[], degrees:[], awardTypes:[] });
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;
  const dSearch = useDebounce(search, 400);

  const allCountries = [...new Set(SCHOLARSHIPS.map(s => s.country))];
  const allDegrees = [...new Set(SCHOLARSHIPS.flatMap(s => s.degrees))];
  const allTypes = [...new Set(SCHOLARSHIPS.map(s => s.awardType))];

  function toggleFilter(key, val) {
    setFilters(f => ({ ...f, [key]: f[key].includes(val) ? f[key].filter(v => v !== val) : [...f[key], val] }));
    setPage(1);
  }

  const filtered = SCHOLARSHIPS.filter(s => {
    if (dSearch && !s.title.toLowerCase().includes(dSearch.toLowerCase()) && !s.org.toLowerCase().includes(dSearch.toLowerCase()) && !s.tags.join(" ").toLowerCase().includes(dSearch.toLowerCase())) return false;
    if (filters.countries.length && !filters.countries.includes(s.country)) return false;
    if (filters.degrees.length && !s.degrees.some(d => filters.degrees.includes(d))) return false;
    if (filters.awardTypes.length && !filters.awardTypes.includes(s.awardType)) return false;
    return true;
  }).sort((a, b) => {
    if (sort === "deadline") return new Date(a.deadline) - new Date(b.deadline);
    if (sort === "amount") return b.amount - a.amount;
    return b.id - a.id;
  });

  const pages = Math.ceil(filtered.length / PER_PAGE);
  const visible = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);
  const activeFilters = [...filters.countries, ...filters.degrees, ...filters.awardTypes];

  return (
    <div className="section">
      <div className="section-inner">
        <div className="browse-layout">
          {/* SIDEBAR FILTERS */}
          <div className="filters-panel">
            <h3 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:16,marginBottom:16}}>Filters</h3>
            {[{key:"countries",label:"Country",options:allCountries},{key:"degrees",label:"Degree Level",options:allDegrees},{key:"awardTypes",label:"Award Type",options:allTypes}].map(f => (
              <div className="filter-group" key={f.key}>
                <div className="filter-group-title">{f.label}</div>
                {f.options.map(o => (
                  <label className="filter-option" key={o}>
                    <input type="checkbox" checked={filters[f.key].includes(o)} onChange={() => toggleFilter(f.key, o)} />
                    {o}
                  </label>
                ))}
              </div>
            ))}
            {activeFilters.length > 0 && <button className="btn btn-secondary btn-sm" style={{width:"100%"}} onClick={() => setFilters({countries:[],degrees:[],awardTypes:[]})}>Clear All Filters</button>}
          </div>

          {/* MAIN */}
          <div>
            <div className="browse-header">
              <input className="search-input" placeholder="Search scholarships..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
              <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="deadline">Deadline</option>
                <option value="amount">Highest Award</option>
              </select>
            </div>
            {activeFilters.length > 0 && (
              <div className="active-filters">
                {activeFilters.map(f => <span key={f} className="filter-pill">{f} <span onClick={() => {
                  setFilters(prev => ({countries: prev.countries.filter(v=>v!==f), degrees: prev.degrees.filter(v=>v!==f), awardTypes: prev.awardTypes.filter(v=>v!==f)}));
                }} style={{cursor:"pointer",marginLeft:2}}>×</span></span>)}
              </div>
            )}
            <div className="results-count">{filtered.length} scholarship{filtered.length !== 1 ? "s" : ""} found</div>
            {visible.length === 0 ? (
              <div className="empty-state"><div className="icon">🔍</div><h3>No scholarships found</h3><p>Try adjusting your search or filters</p></div>
            ) : (
              <div className="cards-grid">
                {visible.map(s => <ScholarCard key={s.id} s={s} onNavigate={onNavigate} />)}
              </div>
            )}
            {pages > 1 && (
              <div className="pagination">
                <button className="page-btn" disabled={page===1} onClick={() => setPage(p => p-1)}>‹</button>
                {Array.from({length:pages},(_,i) => i+1).map(p => <button key={p} className={`page-btn ${p===page?"active":""}`} onClick={() => setPage(p)}>{p}</button>)}
                <button className="page-btn" disabled={page===pages} onClick={() => setPage(p => p+1)}>›</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DETAIL PAGE ───────────────────────────────────────────────────────────
function DetailPage({ slug, onNavigate }) {
  const [tab, setTab] = useState("overview");
  const { bookmarks, toggleBookmark, user, addApplication, applications } = useStore();
  const s = SCHOLARSHIPS.find(s => s.slug === slug);
  if (!s) return <div className="section"><div className="empty-state"><div className="icon">😔</div><h3>Scholarship not found</h3><button className="btn btn-primary" onClick={() => onNavigate("browse")}>Browse All</button></div></div>;
  const isBookmarked = bookmarks.has(s.id);
  const isTracked = applications.find(a => a.scholarshipId === s.id);
  const related = SCHOLARSHIPS.filter(r => r.id !== s.id && (r.country === s.country || r.fields.some(f => s.fields.includes(f)))).slice(0, 3);

  return (
    <div>
      <div className="detail-header">
        <div className="detail-header-inner">
          <div className="detail-logo" style={{background:s.orgColor}}>{s.orgLogo}</div>
          <div style={{flex:1}}>
            <div className="detail-org">{s.org}</div>
            <h1 className="detail-title">{s.title}</h1>
            <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
              <DeadlineBadge deadline={s.deadline} />
              <span style={{fontSize:14,opacity:0.8}}>🌍 {s.country}</span>
              <span className="view-counter" style={{color:"rgba(255,255,255,0.7)"}}>👁 {s.views.toLocaleString()} views</span>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div className="detail-amount">{formatAmount(s.amount, s.currency)}</div>
            <div style={{opacity:0.7,fontSize:14}}>{s.awardType}</div>
          </div>
        </div>
      </div>

      <div className="detail-layout">
        {/* MAIN */}
        <div>
          <div className="tabs">
            {["overview","requirements","eligibility","organization"].map(t => (
              <button key={t} className={`tab ${tab===t?"active":""}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
            ))}
          </div>
          <div className="prose">
            {tab === "overview" && <><p>{s.description}</p><p>This scholarship aims to support outstanding students in achieving their academic goals and contributing positively to their communities and the world.</p><div className="tags" style={{marginTop:16}}>{s.tags.map(t=><span key={t} className="tag">{t}</span>)}</div></>}
            {tab === "requirements" && <><h4>Academic Requirements</h4><p>{s.requirements}</p><h4>Documents Needed</h4><p>Personal statement (500-1000 words), Academic transcripts, Two letters of recommendation, Proof of enrollment or acceptance, Identity documents.</p></>}
            {tab === "eligibility" && <><h4>Who Can Apply</h4><p>This scholarship is open to students pursuing {s.degrees.join(", ")} degrees in {s.fields.join(", ")}. Applicants must be residents of or studying in {s.country}.</p><h4>Degree Levels</h4><div className="tags">{s.degrees.map(d=><span key={d} className="tag green">{d}</span>)}</div><h4>Fields of Study</h4><div className="tags">{s.fields.map(f=><span key={f} className="tag">{f}</span>)}</div></>}
            {tab === "organization" && <><h4>About {s.org}</h4><p>A leading organization committed to advancing education and supporting the next generation of global leaders through merit-based scholarships and fellowships.</p><p>They have awarded over $2 billion in scholarships to students across 140+ countries since their founding.</p></>}
          </div>
          {related.length > 0 && (
            <div style={{marginTop:40}}>
              <h3 style={{fontSize:20,marginBottom:16}}>Related Scholarships</h3>
              <div className="cards-grid" style={{gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))"}}>
                {related.map(s => <ScholarCard key={s.id} s={s} onNavigate={onNavigate} />)}
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div>
          <div className="sidebar-card" style={{marginBottom:16}}>
            <button className="btn btn-primary" style={{width:"100%",marginBottom:10}} onClick={() => { window.open("#"); toastStore.show("Redirecting to application..."); }}>Apply Now ↗</button>
            <button className={`btn ${isBookmarked?"btn-gold":"btn-secondary"}`} style={{width:"100%",marginBottom:10}} onClick={() => { if(!user){toastStore.show("Please login first","error");return;} toggleBookmark(s.id); toastStore.show(isBookmarked?"Removed from bookmarks":"Bookmarked!"); }}>
              {isBookmarked ? "★ Bookmarked" : "☆ Save Scholarship"}
            </button>
            {user && <button className={`btn ${isTracked?"btn-secondary":"btn-secondary"}`} style={{width:"100%"}} onClick={() => { if(isTracked){toastStore.show("Already tracking","error");return;} addApplication(s.id); toastStore.show("Added to tracker!"); }}>
              {isTracked ? "✓ Tracking" : "+ Track Application"}
            </button>}
          </div>
          <div className="sidebar-card">
            <h4 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,marginBottom:12,fontSize:14}}>Quick Info</h4>
            {[{l:"Award Amount",v:formatAmount(s.amount,s.currency)},{l:"Award Type",v:s.awardType},{l:"Deadline",v:new Date(s.deadline).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})},{l:"Country",v:s.country},{l:"Degree",v:s.degrees.join(", ")},{l:"Status",v:<span className="status published">Published</span>}].map(r => (
              <div className="sidebar-row" key={r.l}><span className="label">{r.l}</span><span className="value">{r.v}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AUTH PAGES ─────────────────────────────────────────────────────────────
function LoginPage({ onNavigate }) {
  const { login } = useStore();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  function handle() {
    if (!email || !pass) { toastStore.show("Please fill all fields","error"); return; }
    const role = email.includes("org") ? "org" : email.includes("admin") ? "admin" : "student";
    login({ name: email.split("@")[0].replace(/\./g," ").replace(/\b\w/g, l => l.toUpperCase()), email, role });
    toastStore.show("Welcome back! 👋");
    onNavigate("dashboard");
  }
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-sub">Sign in to your Dani Global Academy account</p>
        <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()} /></div>
        <button className="btn btn-primary" style={{width:"100%",marginTop:8}} onClick={handle}>Sign In</button>
        <div className="divider">or</div>
        <p style={{fontSize:13,textAlign:"center",color:"var(--text3)"}}>Don't have an account? <span style={{color:"var(--accent)",cursor:"pointer",fontWeight:500}} onClick={() => onNavigate("register")}>Sign up</span></p>
        <div style={{marginTop:16,padding:12,background:"var(--surface2)",borderRadius:10,fontSize:12,color:"var(--text3)"}}>
          <strong>Demo accounts:</strong><br/>student@demo.com → Student<br/>org@demo.com → Organization<br/>(any password)
        </div>
      </div>
    </div>
  );
}

function RegisterPage({ onNavigate }) {
  const { login } = useStore();
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({name:"",email:"",pass:"",field:"",org:""});
  function handle() {
    if (!form.name || !form.email || !form.pass) { toastStore.show("Please fill all required fields","error"); return; }
    login({ name: form.name, email: form.email, role, orgName: form.org });
    toastStore.show("Account created! Welcome 🎉");
    onNavigate("dashboard");
  }
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create account</h2>
        <p className="auth-sub">Join thousands of students finding scholarships</p>
        <div className="role-toggle">
          <button className={`role-btn ${role==="student"?"active":""}`} onClick={()=>setRole("student")}>🎓 Student</button>
          <button className={`role-btn ${role==="org"?"active":""}`} onClick={()=>setRole("org")}>🏛 Organization</button>
        </div>
        <div className="form-group"><label className="form-label">{role==="org"?"Contact Name":"Full Name"} *</label><input className="form-input" placeholder="Jane Smith" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
        {role==="org" && <div className="form-group"><label className="form-label">Organization Name *</label><input className="form-input" placeholder="Acme Foundation" value={form.org} onChange={e=>setForm({...form,org:e.target.value})} /></div>}
        <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
        {role==="student" && <div className="form-group"><label className="form-label">Field of Study</label><select className="form-select" value={form.field} onChange={e=>setForm({...form,field:e.target.value})}><option value="">Select field...</option>{CATEGORIES.map(c=><option key={c.id}>{c.name}</option>)}</select></div>}
        <div className="form-group"><label className="form-label">Password *</label><input className="form-input" type="password" placeholder="Min. 8 characters" value={form.pass} onChange={e=>setForm({...form,pass:e.target.value})} /></div>
        <button className="btn btn-primary" style={{width:"100%",marginTop:8}} onClick={handle}>Create Account</button>
        <p style={{fontSize:13,textAlign:"center",color:"var(--text3)",marginTop:12}}>Already have an account? <span style={{color:"var(--accent)",cursor:"pointer",fontWeight:500}} onClick={() => onNavigate("login")}>Sign in</span></p>
      </div>
    </div>
  );
}

// ─── DASHBOARD ─────────────────────────────────────────────────────────────
function DashboardPage({ onNavigate }) {
  const { user, bookmarks, applications } = useStore();
  const [section, setSection] = useState("home");
  if (!user) return <div className="auth-page"><div className="auth-card" style={{textAlign:"center"}}><div style={{fontSize:48,marginBottom:12}}>🔒</div><h3 style={{marginBottom:8}}>Login Required</h3><p style={{color:"var(--text3)",marginBottom:20,fontSize:14}}>Please sign in to access your dashboard</p><button className="btn btn-primary" onClick={() => onNavigate("login")}>Sign In</button></div></div>;
  const savedScholarships = SCHOLARSHIPS.filter(s => bookmarks.has(s.id));
  const trackedApps = applications.map(a => ({ ...a, scholarship: SCHOLARSHIPS.find(s => s.id === a.scholarshipId) })).filter(a => a.scholarship);
  const isOrg = user.role === "org";

  const navItems = isOrg ? [
    {id:"home",icon:"🏠",label:"Dashboard"},
    {id:"myscholarships",icon:"📋",label:"My Scholarships"},
    {id:"create",icon:"➕",label:"Post Scholarship"},
    {id:"settings",icon:"⚙️",label:"Settings"},
  ] : [
    {id:"home",icon:"🏠",label:"Dashboard"},
    {id:"bookmarks",icon:"★",label:"Bookmarks"},
    {id:"applications",icon:"📝",label:"My Applications"},
    {id:"settings",icon:"⚙️",label:"Settings"},
  ];

  return (
    <div className="dashboard-layout">
      <div className="sidebar">
        <div style={{padding:"0 12px 16px",borderBottom:"1px solid var(--border)",marginBottom:12}}>
          <div style={{width:44,height:44,background:"var(--accent)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:700,fontSize:18,marginBottom:8}}>{user.name[0]}</div>
          <div style={{fontWeight:600,fontSize:14}}>{user.name}</div>
          <div style={{fontSize:12,color:"var(--text3)"}}>{user.role === "org" ? "Organization" : "Student"}</div>
        </div>
        {navItems.map(item => (
          <button key={item.id} className={`sidebar-nav-item ${section===item.id?"active":""}`} onClick={() => item.id==="create" ? onNavigate("create") : setSection(item.id)}>
            <span>{item.icon}</span>{item.label}
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        {section === "home" && (
          <>
            <h2 style={{marginBottom:4}}>Welcome back, {user.name.split(" ")[0]} 👋</h2>
            <p style={{color:"var(--text3)",marginBottom:24,fontSize:14}}>Here's your scholarship activity</p>
            <div className="stats-grid">
              {isOrg ? <>
                <div className="stat-card accent"><div className="stat-num">3</div><div className="stat-label">Active Scholarships</div></div>
                <div className="stat-card"><div className="stat-num">12.4K</div><div className="stat-label">Total Views</div></div>
                <div className="stat-card"><div className="stat-num">1</div><div className="stat-label">Drafts</div></div>
              </> : <>
                <div className="stat-card accent"><div className="stat-num">{bookmarks.size}</div><div className="stat-label">Bookmarked</div></div>
                <div className="stat-card"><div className="stat-num">{applications.length}</div><div className="stat-label">Tracked Applications</div></div>
                <div className="stat-card"><div className="stat-num">{applications.filter(a=>a.status==="submitted").length}</div><div className="stat-label">Submitted</div></div>
                <div className="stat-card"><div className="stat-num">2</div><div className="stat-label">Deadlines This Month</div></div>
              </>}
            </div>
            {!isOrg && (
              <>
                <h3 style={{marginBottom:16}}>Recommended for You</h3>
                <div className="cards-grid" style={{gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))"}}>
                  {SCHOLARSHIPS.slice(0,3).map(s => <ScholarCard key={s.id} s={s} onNavigate={onNavigate} />)}
                </div>
              </>
            )}
          </>
        )}

        {section === "bookmarks" && (
          <>
            <h2 style={{marginBottom:20}}>Saved Scholarships</h2>
            {savedScholarships.length === 0 ? (
              <div className="empty-state"><div className="icon">☆</div><h3>No bookmarks yet</h3><p>Save scholarships to find them easily later</p><button className="btn btn-primary" onClick={() => onNavigate("browse")} style={{marginTop:12}}>Browse Scholarships</button></div>
            ) : (
              <div className="cards-grid">{savedScholarships.map(s => <ScholarCard key={s.id} s={s} onNavigate={onNavigate} />)}</div>
            )}
          </>
        )}

        {section === "applications" && (
          <>
            <h2 style={{marginBottom:20}}>My Applications</h2>
            {trackedApps.length === 0 ? (
              <div className="empty-state"><div className="icon">📝</div><h3>No applications tracked</h3><p>Start tracking your scholarship applications</p><button className="btn btn-primary" onClick={() => onNavigate("browse")} style={{marginTop:12}}>Find Scholarships</button></div>
            ) : (
              <KanbanBoard apps={trackedApps} onNavigate={onNavigate} />
            )}
          </>
        )}

        {section === "myscholarships" && (
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h2>My Scholarships</h2>
              <button className="btn btn-primary btn-sm" onClick={() => onNavigate("create")}>+ Post New</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Scholarship</th><th>Status</th><th>Deadline</th><th>Views</th><th>Actions</th></tr></thead>
                <tbody>
                  {SCHOLARSHIPS.slice(0,4).map(s => (
                    <tr key={s.id}>
                      <td><strong style={{fontSize:14}}>{s.title}</strong><div style={{fontSize:12,color:"var(--text3)"}}>{s.awardType}</div></td>
                      <td><span className="status published">Published</span></td>
                      <td style={{fontSize:13}}>{new Date(s.deadline).toLocaleDateString()}</td>
                      <td style={{fontSize:13}}>{s.views.toLocaleString()}</td>
                      <td><div style={{display:"flex",gap:6}}><button className="btn btn-secondary btn-sm" onClick={() => onNavigate("detail", s.slug)}>View</button><button className="btn btn-danger btn-sm" onClick={() => toastStore.show("Deleted","error")}>Delete</button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {section === "settings" && (
          <div style={{maxWidth:520}}>
            <h2 style={{marginBottom:20}}>Profile Settings</h2>
            <div className="sidebar-card">
              <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24,paddingBottom:24,borderBottom:"1px solid var(--border)"}}>
                <div style={{width:64,height:64,background:"var(--accent)",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:700,fontSize:24}}>{user.name[0]}</div>
                <div><div style={{fontWeight:600,fontSize:16}}>{user.name}</div><div style={{fontSize:13,color:"var(--text3)"}}>{user.email}</div><button className="btn btn-secondary btn-sm" style={{marginTop:8}} onClick={() => toastStore.show("Photo upload coming soon!")}>Change Photo</button></div>
              </div>
              <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" defaultValue={user.name} /></div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" defaultValue={user.email} type="email" /></div>
              {user.role === "student" && <div className="form-group"><label className="form-label">Field of Study</label><select className="form-select">{CATEGORIES.map(c=><option key={c.id}>{c.name}</option>)}</select></div>}
              <div className="form-group"><label className="form-label">Country</label><input className="form-input" placeholder="Your country" /></div>
              <button className="btn btn-primary" onClick={() => toastStore.show("Profile saved!")}>Save Changes</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function KanbanBoard({ apps, onNavigate }) {
  const { updateAppStatus } = useStore();
  const cols = ["pending","submitted","accepted","rejected"];
  return (
    <div className="kanban">
      {cols.map(col => {
        const items = apps.filter(a => a.status === col);
        return (
          <div className="kanban-col" key={col}>
            <div className="kanban-col-title">
              {col.charAt(0).toUpperCase()+col.slice(1)} <span className="kanban-count">{items.length}</span>
            </div>
            {items.map(a => (
              <div className="kanban-item" key={a.id}>
                <div className="kanban-item-title">{a.scholarship.title}</div>
                <div className="kanban-item-org">{a.scholarship.org}</div>
                <div style={{marginTop:8,display:"flex",gap:4,flexWrap:"wrap"}}>
                  {cols.filter(c=>c!==col).map(c => <button key={c} className="btn btn-secondary" style={{fontSize:11,padding:"3px 8px",borderRadius:6}} onClick={() => { updateAppStatus(a.id, c); toastStore.show(`Moved to ${c}`); }}>→{c}</button>)}
                </div>
              </div>
            ))}
            {items.length === 0 && <div style={{padding:"20px 12px",textAlign:"center",fontSize:13,color:"var(--text3)"}}>Empty</div>}
          </div>
        );
      })}
    </div>
  );
}

// ─── CREATE SCHOLARSHIP ─────────────────────────────────────────────────────
function CreatePage({ onNavigate }) {
  const { user } = useStore();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ title:"", description:"", amount:"", currency:"USD", awardType:"Full Tuition", deadline:"", country:"", appUrl:"", requirements:"", tags:"" });
  if (!user) return <div className="auth-page"><div className="auth-card" style={{textAlign:"center"}}><div style={{fontSize:48,marginBottom:12}}>🔒</div><h3>Login Required</h3><button className="btn btn-primary" style={{marginTop:12}} onClick={() => onNavigate("login")}>Sign In</button></div></div>;
  if (user.role !== "org") return <div className="auth-page"><div className="auth-card" style={{textAlign:"center"}}><div style={{fontSize:48,marginBottom:12}}>🏛</div><h3>Organization Account Required</h3><p style={{fontSize:14,color:"var(--text3)",marginBottom:16}}>Register as an organization to post scholarships</p><button className="btn btn-primary" onClick={() => onNavigate("register")}>Create Org Account</button></div></div>;

  const u = v => setForm(f => ({...f, ...v}));
  const steps = ["Basic Info","Eligibility","Details","Preview"];

  function submit() {
    toastStore.show("Scholarship published successfully! 🎉");
    onNavigate("dashboard");
  }

  return (
    <div className="section">
      <div className="section-inner" style={{maxWidth:760}}>
        <h2 style={{marginBottom:24}}>Post a Scholarship</h2>
        <div className="form-steps">
          {steps.map((s,i) => <div key={s} className={`form-step ${step===i+1?"active":step>i+1?"done":""}`}>
            <div className="form-step-num">{step>i+1?"✓":i+1}</div>{s}
          </div>)}
        </div>

        <div className="sidebar-card">
          {step===1 && <>
            <h3 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:18,marginBottom:20}}>Basic Information</h3>
            <div className="form-group"><label className="form-label">Scholarship Title *</label><input className="form-input" placeholder="e.g. Excellence in STEM Scholarship 2026" value={form.title} onChange={e=>u({title:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Description *</label><textarea className="form-textarea" placeholder="Describe the scholarship, its purpose, and what makes it unique..." value={form.description} onChange={e=>u({description:e.target.value})} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Award Amount *</label><input className="form-input" type="number" placeholder="50000" value={form.amount} onChange={e=>u({amount:e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Currency</label><select className="form-select" value={form.currency} onChange={e=>u({currency:e.target.value})}><option>USD</option><option>EUR</option><option>GBP</option><option>CAD</option><option>AUD</option></select></div>
            </div>
            <div className="form-group"><label className="form-label">Award Type</label><select className="form-select" value={form.awardType} onChange={e=>u({awardType:e.target.value})}><option>Full Tuition</option><option>Full Funding</option><option>Partial Funding</option><option>Stipend</option></select></div>
          </>}

          {step===2 && <>
            <h3 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:18,marginBottom:20}}>Eligibility Criteria</h3>
            <div className="form-group"><label className="form-label">Country / Region</label><input className="form-input" placeholder="e.g. USA, UK, International..." value={form.country} onChange={e=>u({country:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Requirements</label><textarea className="form-textarea" placeholder="List academic requirements, GPA minimum, work experience, etc." value={form.requirements} onChange={e=>u({requirements:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Degree Levels</label>
              <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:6}}>
                {["Undergraduate","Masters","PhD","Any"].map(d => <label key={d} style={{display:"flex",alignItems:"center",gap:6,fontSize:14,cursor:"pointer"}}><input type="checkbox"/>{d}</label>)}
              </div>
            </div>
            <div className="form-group"><label className="form-label">Fields of Study</label>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:6}}>
                {CATEGORIES.slice(0,6).map(c => <label key={c.id} style={{display:"flex",alignItems:"center",gap:6,fontSize:14,cursor:"pointer"}}><input type="checkbox"/>{c.name}</label>)}
              </div>
            </div>
          </>}

          {step===3 && <>
            <h3 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:18,marginBottom:20}}>Scholarship Details</h3>
            <div className="form-group"><label className="form-label">Application Deadline *</label><input className="form-input" type="date" value={form.deadline} onChange={e=>u({deadline:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">External Application URL</label><input className="form-input" type="url" placeholder="https://your-org.com/apply" value={form.appUrl} onChange={e=>u({appUrl:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Tags (comma separated)</label><input className="form-input" placeholder="e.g. STEM, Leadership, International" value={form.tags} onChange={e=>u({tags:e.target.value})} /></div>
          </>}

          {step===4 && <>
            <h3 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:18,marginBottom:20}}>Preview & Publish</h3>
            {form.title ? (
              <div style={{background:"var(--surface2)",borderRadius:12,padding:20,marginBottom:20}}>
                <div style={{fontSize:12,color:"var(--text3)",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Preview</div>
                <h3 style={{fontSize:22,marginBottom:4}}>{form.title || "Untitled"}</h3>
                <div style={{fontSize:22,fontWeight:700,color:"var(--accent)",marginBottom:8}}>{form.amount ? formatAmount(form.amount, form.currency) : "—"} <span style={{fontSize:13,color:"var(--text3)",fontWeight:400}}>/ {form.awardType}</span></div>
                <p style={{fontSize:14,color:"var(--text2)",lineHeight:1.6}}>{form.description || "No description provided."}</p>
                {form.tags && <div className="tags" style={{marginTop:12}}>{form.tags.split(",").map(t=>t.trim()).filter(Boolean).map(t=><span key={t} className="tag">{t}</span>)}</div>}
              </div>
            ) : <div style={{background:"var(--surface2)",borderRadius:12,padding:20,marginBottom:20,textAlign:"center",color:"var(--text3)"}}>Fill in step 1 to see a preview</div>}
            <p style={{fontSize:13,color:"var(--text3)"}}>By publishing you agree to our terms of service. Your scholarship will be reviewed and published within 24 hours.</p>
          </>}

          <div style={{display:"flex",justifyContent:"space-between",marginTop:24,borderTop:"1px solid var(--border)",paddingTop:20}}>
            <button className="btn btn-secondary" disabled={step===1} onClick={() => setStep(s=>s-1)}>← Back</button>
            <div style={{display:"flex",gap:8}}>
              <button className="btn btn-ghost" onClick={() => toastStore.show("Draft saved!")}>Save Draft</button>
              {step < 4 ? <button className="btn btn-primary" onClick={() => setStep(s=>s+1)}>Continue →</button>
              : <button className="btn btn-primary" onClick={submit}>🚀 Publish Scholarship</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FOOTER ────────────────────────────────────────────────────────────────
function Footer({ onNavigate }) {
  return (
    <footer style={{background:"var(--text)", color:"rgba(255,255,255,0.7)", padding:"48px 24px 32px", marginTop:"auto"}}>
      <div style={{maxWidth:1280, margin:"0 auto"}}>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px,1fr))", gap:32, marginBottom:40}}>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:900, color:"white", marginBottom:4}}>Dani <span style={{color:"#C9921A"}}>Global Academy</span></div>
            <p style={{fontSize:13, lineHeight:1.7}}>The world's largest scholarship discovery platform. Connecting students with life-changing opportunities.</p>
          </div>
          {[{title:"Platform", links:["Browse Scholarships","Categories","Featured","Expiring Soon"]},{title:"Account", links:["Login","Register","Dashboard","Settings"]},{title:"Organizations", links:["Post Scholarship","Org Dashboard","Verify Account","Pricing"]}].map(col => (
            <div key={col.title}>
              <div style={{fontWeight:600,color:"white",marginBottom:12,fontSize:14}}>{col.title}</div>
              {col.links.map(l => <div key={l} style={{fontSize:13,marginBottom:8,cursor:"pointer"}} onClick={() => toastStore.show("Coming soon!")}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:20, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12, fontSize:12}}>
          <span>© 2025 Dani Global Academy. All rights reserved.</span>
          <span>Built with ❤️ for students worldwide</span>
        </div>
      </div>
    </footer>
  );
}

// ─── APP ROOT ──────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [pageParam, setPageParam] = useState(null);
  const [searchParam, setSearchParam] = useState("");

  function navigate(p, param=null, search="") {
    setPage(p);
    setPageParam(param);
    setSearchParam(search);
    window.scrollTo(0,0);
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <Nav page={page} onNavigate={navigate} />
        <main style={{flex:1}}>
          {page === "home" && <HomePage onNavigate={navigate} />}
          {page === "browse" && <BrowsePage onNavigate={navigate} initialSearch={searchParam} />}
          {page === "detail" && <DetailPage slug={pageParam} onNavigate={navigate} />}
          {page === "login" && <LoginPage onNavigate={navigate} />}
          {page === "register" && <RegisterPage onNavigate={navigate} />}
          {page === "dashboard" && <DashboardPage onNavigate={navigate} />}
          {page === "create" && <CreatePage onNavigate={navigate} />}
        </main>
        <Footer onNavigate={navigate} />
        <ToastContainer />
      </div>
    </>
  );
}
