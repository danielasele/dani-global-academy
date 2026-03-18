import { useState, useEffect } from "react";

// ─── ADMIN CONFIG ────────────────────────────────────────────────────────────
// STEP 1: Replace with your Google Sheet CSV URL (see README for instructions)
const GOOGLE_SHEET_CSV_URL = "YOUR_GOOGLE_SHEET_CSV_URL_HERE";
// STEP 2: Change this password to something secret!
const ADMIN_PASSWORD = "dani2025admin";

// ─── FALLBACK DATA (used if Google Sheet not connected) ───────────────────────
const FALLBACK_SCHOLARSHIPS = [
  { id:1, slug:"gates-millennium-scholars", title:"Gates Millennium Scholars Program", org:"Bill & Melinda Gates Foundation", orgLogo:"BG", orgColor:"#0078D4", amount:50000, currency:"USD", awardType:"Full Tuition", deadline:"2025-05-31", country:"USA", fields:["Any Field"], degrees:["Undergraduate","Graduate"], tags:["STEM","Minority","Leadership"], description:"The Gates Millennium Scholars Program selects 1,000 talented students each year to receive a good-faith scholarship.", requirements:"Minimum 3.3 GPA. Demonstrated leadership and community service. Financial need required.", views:4821, status:"published", featured:true },
  { id:2, slug:"chevening-scholarship", title:"Chevening Scholarship", org:"UK Foreign Office", orgLogo:"CF", orgColor:"#C8102E", amount:45000, currency:"GBP", awardType:"Full Funding", deadline:"2025-11-05", country:"UK", fields:["Any Field"], degrees:["Masters"], tags:["International","Leadership","UK"], description:"Chevening is the UK government's international scholarships programme. It offers full funding for a one-year master's degree at any UK university.", requirements:"Two years of work experience. Undergraduate degree. English proficiency.", views:3960, status:"published", featured:true },
  { id:3, slug:"fulbright-program", title:"Fulbright U.S. Student Program", org:"U.S. Department of State", orgLogo:"FU", orgColor:"#003F87", amount:35000, currency:"USD", awardType:"Full Funding", deadline:"2025-10-10", country:"USA", fields:["Arts","Humanities","STEM"], degrees:["Graduate","Research"], tags:["International","Research","USA"], description:"The Fulbright U.S. Student Program provides grants for individually designed study/research projects.", requirements:"U.S. citizenship. Bachelor's degree by start date.", views:5102, status:"published", featured:true },
  { id:4, slug:"rhodes-scholarship", title:"Rhodes Scholarship", org:"Rhodes Trust", orgLogo:"RT", orgColor:"#00539F", amount:60000, currency:"USD", awardType:"Full Funding", deadline:"2025-10-01", country:"UK", fields:["Any Field"], degrees:["Graduate"], tags:["Prestigious","Oxford","Leadership"], description:"The Rhodes Scholarship is the oldest and most celebrated international fellowship award in the world.", requirements:"Age 18-24. Strong academic record. Leadership qualities.", views:6340, status:"published", featured:true },
  { id:5, slug:"daad-scholarship", title:"DAAD Scholarship Program", org:"German Academic Exchange Service", orgLogo:"DA", orgColor:"#005AA0", amount:11000, currency:"EUR", awardType:"Stipend", deadline:"2026-07-20", country:"Germany", fields:["STEM","Engineering"], degrees:["Masters","PhD"], tags:["Germany","Research","STEM"], description:"DAAD scholarships enable highly-qualified graduates to pursue research and study programs in Germany.", requirements:"Bachelor's degree with above-average results. Two academic recommendations.", views:2788, status:"published", featured:false },
  { id:6, slug:"erasmus-mundus", title:"Erasmus Mundus Joint Master Degrees", org:"European Commission", orgLogo:"EM", orgColor:"#003399", amount:24000, currency:"EUR", awardType:"Full Funding", deadline:"2026-01-15", country:"Europe", fields:["Any Field"], degrees:["Masters"], tags:["Europe","International"], description:"Erasmus Mundus Joint Master Degrees are prestigious, integrated, international study programmes.", requirements:"Bachelor's degree. English proficiency.", views:3210, status:"published", featured:false },
];

const CATEGORIES = [
  { id:1, name:"STEM", icon:"🔬", count:142 },
  { id:2, name:"Arts & Humanities", icon:"🎨", count:87 },
  { id:3, name:"Business", icon:"💼", count:95 },
  { id:4, name:"Medicine", icon:"⚕️", count:63 },
  { id:5, name:"Law", icon:"⚖️", count:41 },
  { id:6, name:"Social Sciences", icon:"🌍", count:78 },
  { id:7, name:"Engineering", icon:"⚙️", count:119 },
  { id:8, name:"Education", icon:"📚", count:55 },
];

// ─── UTILITIES ────────────────────────────────────────────────────────────────
function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
function formatAmount(amount, currency) {
  try { return new Intl.NumberFormat("en-US", { style:"currency", currency, maximumFractionDigits:0 }).format(amount); }
  catch { return `${currency} ${amount}`; }
}
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function useDebounce(value, delay) {
  const [deb, setDeb] = useState(value);
  useEffect(() => { const t = setTimeout(() => setDeb(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return deb;
}

// ─── GOOGLE SHEETS PARSER ─────────────────────────────────────────────────────
async function fetchFromGoogleSheets(url) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    const rows = text.trim().split("\n").map(r => r.split(",").map(c => c.trim().replace(/^"|"$/g, "")));
    const headers = rows[0].map(h => h.toLowerCase().trim());
    return rows.slice(1).filter(r => r.length > 1 && r[0]).map((r, i) => {
      const obj = {};
      headers.forEach((h, idx) => { obj[h] = r[idx] || ""; });
      return {
        id: i + 1,
        slug: obj.slug || slugify(obj.title || `scholarship-${i+1}`),
        title: obj.title || "Untitled Scholarship",
        org: obj.org || obj.organization || "Unknown Organization",
        orgLogo: (obj.org || "XX").substring(0,2).toUpperCase(),
        orgColor: obj.color || "#1B2D6B",
        amount: parseFloat(obj.amount) || 0,
        currency: obj.currency || "USD",
        awardType: obj.awardtype || obj["award type"] || "Full Funding",
        deadline: obj.deadline || "2026-12-31",
        country: obj.country || "International",
        fields: (obj.fields || obj.field || "Any Field").split(";").map(s => s.trim()),
        degrees: (obj.degrees || obj.degree || "Any").split(";").map(s => s.trim()),
        tags: (obj.tags || "").split(";").map(s => s.trim()).filter(Boolean),
        description: obj.description || "",
        requirements: obj.requirements || "",
        views: parseInt(obj.views) || 0,
        status: obj.status || "published",
        featured: obj.featured === "true" || obj.featured === "yes" || obj.featured === "1",
        appUrl: obj.appurl || obj["application url"] || "",
      };
    }).filter(s => s.status === "published");
  } catch(e) {
    return null;
  }
}

// ─── LOCAL STORAGE HELPERS ────────────────────────────────────────────────────
function loadLocal(key, def) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; }
}
function saveLocal(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ─── GLOBAL STORE ─────────────────────────────────────────────────────────────
const store = {
  user: null,
  bookmarks: new Set(loadLocal("dga_bookmarks", [])),
  applications: loadLocal("dga_apps", []),
  adminScholarships: loadLocal("dga_admin_scholarships", []),
  listeners: new Set(),
  notify() { this.listeners.forEach(fn => fn()); },
  login(u) { this.user = u; this.notify(); },
  logout() { this.user = null; this.notify(); },
  toggleBookmark(id) {
    this.bookmarks.has(id) ? this.bookmarks.delete(id) : this.bookmarks.add(id);
    saveLocal("dga_bookmarks", [...this.bookmarks]);
    this.notify();
  },
  addApplication(scholarshipId) {
    if (!this.applications.find(a => a.scholarshipId === scholarshipId)) {
      this.applications.push({ id: Date.now(), scholarshipId, status:"pending", appliedAt: new Date().toISOString().slice(0,10) });
      saveLocal("dga_apps", this.applications);
      this.notify();
    }
  },
  updateAppStatus(id, status) {
    const a = this.applications.find(a => a.id === id);
    if(a) { a.status = status; saveLocal("dga_apps", this.applications); this.notify(); }
  },
  addAdminScholarship(s) {
    const newS = { ...s, id: Date.now(), slug: slugify(s.title), views: 0, status:"published", orgLogo: (s.org||"XX").substring(0,2).toUpperCase(), orgColor:"#1B2D6B" };
    this.adminScholarships = [newS, ...this.adminScholarships];
    saveLocal("dga_admin_scholarships", this.adminScholarships);
    this.notify();
    return newS;
  },
  updateAdminScholarship(id, updates) {
    this.adminScholarships = this.adminScholarships.map(s => s.id === id ? {...s, ...updates} : s);
    saveLocal("dga_admin_scholarships", this.adminScholarships);
    this.notify();
  },
  deleteAdminScholarship(id) {
    this.adminScholarships = this.adminScholarships.filter(s => s.id !== id);
    saveLocal("dga_admin_scholarships", this.adminScholarships);
    this.notify();
  },
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
  --bg: #F7F8FC; --surface: #FFFFFF; --surface2: #EEF1F8; --border: #DDE2EF;
  --text: #0F1D4A; --text2: #4A5480; --text3: #8891B0;
  --accent: #1B2D6B; --accent2: #C9921A; --accent-bg: #EEF1F8;
  --danger: #C0392B; --success: #16A34A;
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
.nav { background: var(--surface); border-bottom: 1px solid var(--border); position: sticky; top:0; z-index:100; }
.nav-inner { max-width: 1280px; margin: 0 auto; padding: 0 24px; height: 64px; display: flex; align-items: center; gap: 24px; }
.nav-links { display: flex; gap: 4px; margin-left: auto; }
.nav-link { padding: 8px 14px; border-radius: 8px; font-size: 14px; font-weight: 500; color: var(--text2); transition: all 0.15s; border: none; background: none; }
.nav-link:hover { background: var(--surface2); color: var(--text); }
.nav-link.active { background: var(--accent-bg); color: var(--accent); }
.nav-actions { display: flex; gap: 8px; align-items: center; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 9px 18px; border-radius: var(--radius); font-size: 14px; font-weight: 500; border: none; transition: all 0.15s; white-space: nowrap; }
.btn-primary { background: var(--accent); color: white; }
.btn-primary:hover { background: #0f1d4a; transform: translateY(-1px); }
.btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
.btn-secondary:hover { background: var(--border); }
.btn-ghost { background: none; color: var(--text2); }
.btn-ghost:hover { background: var(--surface2); }
.btn-danger { background: #FEF2F2; color: var(--danger); border: 1px solid #FECACA; }
.btn-danger:hover { background: #FEE2E2; }
.btn-gold { background: var(--accent2); color: white; }
.btn-gold:hover { background: #a87a14; }
.btn-success { background: #F0FDF4; color: var(--success); border: 1px solid #BBF7D0; }
.btn-sm { padding: 6px 12px; font-size: 13px; }
.btn-lg { padding: 13px 28px; font-size: 16px; border-radius: 14px; }
.hero { background: linear-gradient(135deg, #0D1A47 0%, #1B2D6B 50%, #0D1A47 100%); color: white; padding: 80px 24px 100px; position: relative; overflow: hidden; }
.hero::before { content:''; position:absolute; inset:0; background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
.hero-inner { max-width: 1280px; margin: 0 auto; position: relative; }
.hero h1 { font-size: clamp(36px, 5vw, 64px); font-weight: 900; line-height: 1.1; margin-bottom: 16px; }
.hero h1 em { font-style: italic; color: var(--accent2); }
.hero p { font-size: 18px; opacity: 0.85; margin-bottom: 40px; max-width: 560px; font-weight: 300; }
.hero-search { display: flex; max-width: 640px; background: white; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 40px rgba(0,0,0,0.2); }
.hero-search input { flex:1; padding: 16px 20px; border: none; outline: none; font-size: 16px; color: var(--text); }
.hero-search button { padding: 16px 28px; background: var(--accent2); color: white; border: none; font-weight: 600; font-size: 15px; }
.hero-stats { display: flex; gap: 48px; margin-top: 56px; flex-wrap: wrap; }
.hero-stat .num { font-size: 36px; font-weight: 700; font-family: 'Playfair Display', serif; }
.hero-stat .lbl { font-size: 13px; opacity: 0.7; margin-top: 2px; }
.section { padding: 72px 24px; }
.section-inner { max-width: 1280px; margin: 0 auto; }
.section-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 32px; flex-wrap: wrap; gap: 12px; }
.section-title { font-size: 32px; font-weight: 700; }
.section-title span { color: var(--accent); }
.cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; box-shadow: var(--shadow); transition: all 0.2s; position: relative; }
.card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
.card-logo { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 14px; margin-bottom: 12px; flex-shrink: 0; }
.card-row { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
.card-org { font-size: 12px; color: var(--text3); font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
.card-title { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; margin: 4px 0 12px; line-height: 1.3; }
.card-amount { font-size: 22px; font-weight: 700; color: var(--accent); font-family: 'Playfair Display', serif; }
.card-amount-type { font-size: 12px; color: var(--text3); font-weight: 400; }
.card-meta { display: flex; gap: 16px; margin: 12px 0; font-size: 13px; color: var(--text2); flex-wrap: wrap; }
.tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
.tag { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; background: var(--surface2); color: var(--text2); border: 1px solid var(--border); }
.tag.blue { background: #EEF1F8; color: #1B2D6B; border-color: #BCC5E8; }
.deadline-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.deadline-badge.urgent { background: #FEF2F2; color: #B91C1C; border: 1px solid #FECACA; }
.deadline-badge.soon { background: #FFFBEB; color: #92400E; border: 1px solid #FDE68A; }
.deadline-badge.ok { background: #FEF6E4; color: #7A5210; border: 1px solid #F5D48A; }
.deadline-badge.closed { background: var(--surface2); color: var(--text3); border: 1px solid var(--border); }
.bookmark-btn { position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); display: flex; align-items: center; justify-content: center; font-size: 16px; transition: all 0.15s; }
.bookmark-btn:hover { background: var(--surface2); transform: scale(1.1); }
.bookmark-btn.active { background: #FFFBEB; border-color: #FDE68A; }
.browse-layout { display: grid; grid-template-columns: 260px 1fr; gap: 28px; }
.filters-panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; height: fit-content; position: sticky; top: 80px; }
.filter-group { margin-bottom: 20px; }
.filter-group-title { font-size: 12px; font-weight: 600; color: var(--text3); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; }
.filter-option { display: flex; align-items: center; gap: 8px; padding: 5px 0; font-size: 14px; color: var(--text2); cursor: pointer; }
.filter-option input { accent-color: var(--accent); }
.search-input { flex: 1; min-width: 200px; padding: 10px 16px; border: 1px solid var(--border); border-radius: 10px; font-size: 14px; outline: none; background: var(--surface); }
.search-input:focus { border-color: var(--accent); }
.sort-select { padding: 10px 14px; border: 1px solid var(--border); border-radius: 10px; font-size: 14px; outline: none; background: var(--surface); }
.browse-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
.filter-pill { display: flex; align-items: center; gap: 4px; padding: 4px 10px; background: var(--accent-bg); color: var(--accent); border-radius: 20px; font-size: 12px; font-weight: 500; }
.active-filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
.results-count { font-size: 14px; color: var(--text3); margin-bottom: 16px; }
.detail-layout { display: grid; grid-template-columns: 1fr 320px; gap: 32px; max-width: 1280px; margin: 0 auto; padding: 40px 24px; }
.detail-header { background: linear-gradient(135deg, #0D1A47 0%, #1B2D6B 100%); color: white; padding: 48px 24px; }
.detail-header-inner { max-width: 1280px; margin: 0 auto; display: flex; gap: 24px; align-items: flex-start; flex-wrap: wrap; }
.detail-logo { width: 72px; height: 72px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 22px; flex-shrink: 0; border: 3px solid rgba(255,255,255,0.2); }
.detail-title { font-size: clamp(24px, 3vw, 36px); font-weight: 900; margin: 4px 0 8px; }
.detail-amount { font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 900; color: var(--accent2); }
.sidebar-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow); margin-bottom: 16px; }
.sidebar-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 14px; }
.sidebar-row:last-child { border-bottom: none; }
.sidebar-row .label { color: var(--text3); }
.tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--border); margin-bottom: 24px; }
.tab { padding: 10px 16px; font-size: 14px; font-weight: 500; color: var(--text3); border: none; background: none; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.15s; }
.tab.active { color: var(--accent); border-bottom-color: var(--accent); }
.prose p { margin-bottom: 16px; font-size: 15px; line-height: 1.75; color: var(--text2); }
.prose h4 { margin: 20px 0 8px; font-size: 16px; }
.dashboard-layout { display: grid; grid-template-columns: 220px 1fr; min-height: calc(100vh - 64px); }
.sidebar { background: var(--surface); border-right: 1px solid var(--border); padding: 24px 12px; }
.sidebar-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; font-size: 14px; font-weight: 500; color: var(--text2); cursor: pointer; border: none; background: none; width: 100%; text-align: left; margin-bottom: 2px; transition: all 0.15s; }
.sidebar-nav-item:hover { background: var(--surface2); color: var(--text); }
.sidebar-nav-item.active { background: var(--accent-bg); color: var(--accent); }
.dashboard-content { padding: 32px; overflow-y: auto; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; margin-bottom: 32px; }
.stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; }
.stat-num { font-size: 32px; font-weight: 700; font-family: 'Playfair Display', serif; }
.stat-label { font-size: 13px; color: var(--text3); margin-top: 4px; }
.stat-card.accent { background: var(--accent); border-color: var(--accent); }
.stat-card.accent .stat-num, .stat-card.accent .stat-label { color: white; }
.stat-card.gold { background: var(--accent2); border-color: var(--accent2); }
.stat-card.gold .stat-num, .stat-card.gold .stat-label { color: white; }
.table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; margin-bottom: 24px; }
table { width: 100%; border-collapse: collapse; }
th { padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; background: var(--surface2); border-bottom: 1px solid var(--border); }
td { padding: 14px 16px; font-size: 14px; color: var(--text2); border-bottom: 1px solid var(--border); vertical-align: middle; }
tr:last-child td { border-bottom: none; }
tr:hover td { background: var(--surface2); }
.status { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.status::before { content:''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; opacity: 0.7; }
.status.published { background: #F0FDF4; color: #166534; }
.status.draft { background: var(--surface2); color: var(--text3); }
.status.pending { background: #FFFBEB; color: #92400E; }
.status.submitted { background: #EFF6FF; color: #1D4ED8; }
.status.accepted { background: #F0FDF4; color: #166534; }
.status.rejected { background: #FEF2F2; color: #991B1B; }
.auth-page { min-height: calc(100vh - 64px); display: flex; align-items: center; justify-content: center; padding: 24px; background: var(--surface2); }
.auth-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 40px; width: 100%; max-width: 440px; box-shadow: var(--shadow-lg); }
.form-group { margin-bottom: 16px; }
.form-label { display: block; font-size: 13px; font-weight: 500; color: var(--text2); margin-bottom: 6px; }
.form-input { width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: 10px; font-size: 14px; outline: none; transition: border-color 0.15s; background: var(--bg); }
.form-input:focus { border-color: var(--accent); background: white; }
.form-textarea { width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: 10px; font-size: 14px; outline: none; min-height: 100px; resize: vertical; background: var(--bg); }
.form-textarea:focus { border-color: var(--accent); background: white; }
.form-select { width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: 10px; font-size: 14px; outline: none; background: var(--bg); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.role-toggle { display: grid; grid-template-columns: 1fr 1fr; background: var(--surface2); border-radius: 10px; padding: 4px; margin-bottom: 24px; }
.role-btn { padding: 8px; border-radius: 8px; font-size: 14px; font-weight: 500; border: none; background: none; color: var(--text2); transition: all 0.15s; }
.role-btn.active { background: var(--surface); color: var(--text); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
.cat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px 16px; text-align: center; transition: all 0.2s; cursor: pointer; }
.cat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
.toast-wrap { position: fixed; bottom: 24px; right: 24px; z-index: 999; display: flex; flex-direction: column; gap: 8px; }
.toast { background: var(--text); color: white; padding: 12px 18px; border-radius: 10px; font-size: 14px; font-weight: 500; box-shadow: var(--shadow-lg); animation: toastIn 0.3s ease; }
.toast.success { background: var(--success); }
.toast.error { background: var(--danger); }
@keyframes toastIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }
.empty-state { text-align: center; padding: 60px 24px; color: var(--text3); }
.empty-state .icon { font-size: 48px; margin-bottom: 12px; }
.pagination { display: flex; align-items: center; gap: 8px; margin-top: 32px; justify-content: center; }
.page-btn { width: 36px; height: 36px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); font-size: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.page-btn:hover, .page-btn.active { background: var(--accent); color: white; border-color: var(--accent); }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.kanban { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.kanban-col { background: var(--surface2); border-radius: var(--radius); padding: 12px; }
.kanban-col-title { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.6px; color: var(--text3); margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; }
.kanban-count { background: var(--border); color: var(--text3); border-radius: 12px; padding: 1px 8px; font-size: 11px; }
.kanban-item { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 14px; margin-bottom: 10px; font-size: 14px; }
.badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
.badge.admin { background: #FEF6E4; color: #7A5210; border: 1px solid #F5D48A; }
.alert { padding: 12px 16px; border-radius: 10px; font-size: 14px; margin-bottom: 16px; }
.alert.info { background: #EEF1F8; color: var(--accent); border: 1px solid #BCC5E8; }
.alert.success { background: #F0FDF4; color: #166534; border: 1px solid #BBF7D0; }
.alert.warning { background: #FFFBEB; color: #92400E; border: 1px solid #FDE68A; }
.loading { display: flex; align-items: center; justify-content: center; padding: 40px; gap: 12px; color: var(--text3); font-size: 14px; }
.spinner { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 24px; }
.modal { background: var(--surface); border-radius: 20px; padding: 32px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-lg); }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.modal-title { font-size: 22px; font-weight: 700; }
.close-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface2); font-size: 18px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.divider { height: 1px; background: var(--border); margin: 20px 0; }
@media (max-width: 768px) {
  .browse-layout, .detail-layout, .dashboard-layout { grid-template-columns: 1fr; }
  .filters-panel { position: static; }
  .sidebar { display: none; }
  .kanban { grid-template-columns: 1fr 1fr; }
  .form-row { grid-template-columns: 1fr; }
}
`;

// ─── TOAST ────────────────────────────────────────────────────────────────────
const toastStore = { toasts:[], listeners:new Set(), notify() { this.listeners.forEach(fn => fn()); },
  show(msg, type="success") { const id=Date.now(); this.toasts.push({id,msg,type}); this.notify(); setTimeout(()=>{ this.toasts=this.toasts.filter(t=>t.id!==id); this.notify(); },3500); }
};
function ToastContainer() {
  const [toasts,setToasts]=useState([]);
  useEffect(()=>{ const fn=()=>setToasts([...toastStore.toasts]); toastStore.listeners.add(fn); return()=>toastStore.listeners.delete(fn); },[]);
  return <div className="toast-wrap">{toasts.map(t=><div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>)}</div>;
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function DeadlineBadge({deadline}) {
  const d=daysUntil(deadline);
  if(d<0) return <span className="deadline-badge closed">⊘ Closed</span>;
  if(d<=7) return <span className="deadline-badge urgent">⚠ {d}d left</span>;
  if(d<=30) return <span className="deadline-badge soon">◷ {d}d left</span>;
  return <span className="deadline-badge ok">◷ {d}d left</span>;
}

function LogoSVG({size=38}) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <path d="M10 80 Q60 65 110 80 L110 95 Q60 80 10 95 Z" fill="#1B2D6B"/>
      <path d="M10 80 Q60 65 110 80" stroke="#C9921A" strokeWidth="3" fill="none"/>
      <path d="M60 65 L60 95" stroke="#C9921A" strokeWidth="2"/>
      <path d="M10 80 Q35 68 60 65 L60 95 Q35 93 10 95 Z" fill="#1B2D6B" opacity="0.85"/>
      <path d="M60 65 Q85 68 110 80 L110 95 Q85 93 60 95 Z" fill="#1B2D6B"/>
      <path d="M10 80 Q35 70 60 67" stroke="#C9921A" strokeWidth="2.5" fill="none"/>
      <path d="M60 67 Q85 70 110 80" stroke="#C9921A" strokeWidth="2.5" fill="none"/>
      <circle cx="60" cy="52" r="22" fill="#1B2D6B" stroke="#2A45A0" strokeWidth="1.5"/>
      <ellipse cx="60" cy="52" rx="10" ry="22" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
      <line x1="38" y1="52" x2="82" y2="52" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
      <line x1="41" y1="42" x2="79" y2="42" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      <line x1="41" y1="62" x2="79" y2="62" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      <rect x="38" y="26" width="44" height="6" rx="2" fill="#1A1A1A"/>
      <polygon points="60,14 38,26 82,26" fill="#1A1A1A"/>
      <line x1="82" y1="26" x2="88" y2="34" stroke="#C9921A" strokeWidth="2.5"/>
      <circle cx="88" cy="36" r="3" fill="#C9921A"/>
    </svg>
  );
}

function ScholarCard({s, onNavigate}) {
  const {bookmarks,toggleBookmark,user}=useStore();
  const isBookmarked=bookmarks.has(s.id);
  return (
    <div className="card" onClick={()=>onNavigate("detail",s.slug)} style={{cursor:"pointer"}}>
      <button className={`bookmark-btn ${isBookmarked?"active":""}`} onClick={e=>{e.stopPropagation(); if(!user){toastStore.show("Please login to bookmark","error");return;} toggleBookmark(s.id); toastStore.show(isBookmarked?"Removed bookmark":"Bookmarked! ★");}}>
        {isBookmarked?"★":"☆"}
      </button>
      <div className="card-row">
        <div className="card-logo" style={{background:s.orgColor||"#1B2D6B"}}>{s.orgLogo}</div>
        <div><div className="card-org">{s.org}</div><h3 className="card-title" style={{margin:0}}>{s.title}</h3></div>
      </div>
      <div className="card-amount">{formatAmount(s.amount,s.currency)} <span className="card-amount-type">/ {s.awardType}</span></div>
      <div className="card-meta">
        <span>🌍 {s.country}</span>
        <span>🎓 {s.degrees[0]}{s.degrees.length>1?` +${s.degrees.length-1}`:""}</span>
        <span><DeadlineBadge deadline={s.deadline}/></span>
      </div>
      <div className="tags">
        {s.fields[0]!=="Any Field"&&<span className="tag blue">{s.fields[0]}</span>}
        {s.tags.slice(0,3).map(t=><span key={t} className="tag">{t}</span>)}
      </div>
      <div style={{marginTop:12,fontSize:13,color:"var(--text3)"}}>👁 {(s.views||0).toLocaleString()} views</div>
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav({page,onNavigate}) {
  const {user,logout}=useStore();
  return (
    <nav className="nav">
      <div className="nav-inner">
        <div onClick={()=>onNavigate("home")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
          <LogoSVG/>
          <div style={{lineHeight:1.1}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:900,color:"#1B2D6B"}}>Dani</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:11,fontWeight:700,color:"#C9921A",letterSpacing:"0.5px",textTransform:"uppercase"}}>Global Academy</div>
          </div>
        </div>
        <div className="nav-links">
          <button className={`nav-link ${page==="home"?"active":""}`} onClick={()=>onNavigate("home")}>Home</button>
          <button className={`nav-link ${page==="browse"?"active":""}`} onClick={()=>onNavigate("browse")}>Browse</button>
          {user&&<button className={`nav-link ${page==="dashboard"?"active":""}`} onClick={()=>onNavigate("dashboard")}>Dashboard</button>}
          {user?.role==="admin"&&<button className={`nav-link ${page==="admin"?"active":""}`} style={{color:"#C9921A"}} onClick={()=>onNavigate("admin")}>⚙ Admin</button>}
        </div>
        <div className="nav-actions">
          {!user?<>
            <button className="btn btn-ghost btn-sm" onClick={()=>onNavigate("login")}>Login</button>
            <button className="btn btn-primary btn-sm" onClick={()=>onNavigate("register")}>Sign Up</button>
          </>:<>
            <span style={{fontSize:13,color:"var(--text2)"}}>👋 {user.name.split(" ")[0]}</span>
            {user.role==="admin"&&<span className="badge admin">Admin</span>}
            <button className="btn btn-secondary btn-sm" onClick={()=>{logout();toastStore.show("Logged out");onNavigate("home");}}>Logout</button>
          </>}
        </div>
      </div>
    </nav>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({onNavigate,scholarships,loading}) {
  const [search,setSearch]=useState("");
  const featured=scholarships.filter(s=>s.featured).slice(0,4);
  const expiring=scholarships.filter(s=>{const d=daysUntil(s.deadline);return d>0&&d<=45;}).slice(0,3);
  function doSearch(){if(search.trim())onNavigate("browse",null,search);}
  return (
    <div>
      <div className="hero">
        <div className="hero-inner">
          <h1>Find Your <em>Dream</em><br/>Scholarship</h1>
          <p>Discover scholarships from leading organizations around the world. Your future starts here.</p>
          <div className="hero-search">
            <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doSearch()} placeholder="Search by keyword, field, or country..."/>
            <button onClick={doSearch}>Search →</button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><div className="num">{scholarships.length}+</div><div className="lbl">Active Scholarships</div></div>
            <div className="hero-stat"><div className="num">$180M+</div><div className="lbl">Total Award Value</div></div>
            <div className="hero-stat"><div className="num">140</div><div className="lbl">Countries Covered</div></div>
            <div className="hero-stat"><div className="num">85K+</div><div className="lbl">Students Helped</div></div>
          </div>
        </div>
      </div>
      <div className="section" style={{background:"var(--surface2)"}}>
        <div className="section-inner">
          <div className="section-header"><h2 className="section-title">Browse by <span>Category</span></h2></div>
          <div className="cat-grid">
            {CATEGORIES.map(c=><div key={c.id} className="cat-card" onClick={()=>onNavigate("browse")}>
              <div style={{fontSize:28,marginBottom:8}}>{c.icon}</div>
              <div style={{fontSize:13,fontWeight:600,marginBottom:2}}>{c.name}</div>
              <div style={{fontSize:12,color:"var(--text3)"}}>{c.count} scholarships</div>
            </div>)}
          </div>
        </div>
      </div>
      <div className="section">
        <div className="section-inner">
          <div className="section-header">
            <h2 className="section-title">Featured <span>Scholarships</span></h2>
            <button className="btn btn-secondary btn-sm" onClick={()=>onNavigate("browse")}>View All →</button>
          </div>
          {loading?<div className="loading"><div className="spinner"></div>Loading scholarships...</div>:
          featured.length===0?<div className="empty-state"><div className="icon">🎓</div><h3>No scholarships yet</h3><p>Check back soon or add some via the Admin panel</p></div>:
          <div className="cards-grid">{featured.map(s=><ScholarCard key={s.id} s={s} onNavigate={onNavigate}/>)}</div>}
        </div>
      </div>
      {expiring.length>0&&<div className="section" style={{background:"var(--surface2)"}}>
        <div className="section-inner">
          <div className="section-header"><h2 className="section-title">⚠ Closing <span>Soon</span></h2></div>
          <div className="cards-grid">{expiring.map(s=><ScholarCard key={s.id} s={s} onNavigate={onNavigate}/>)}</div>
        </div>
      </div>}
      <div style={{background:"linear-gradient(135deg,#0D1A47 0%,#1B2D6B 100%)",padding:"64px 24px",textAlign:"center",color:"white"}}>
        <h2 style={{fontSize:36,marginBottom:12,color:"white"}}>Ready to Find Your Scholarship?</h2>
        <p style={{fontSize:17,opacity:0.85,marginBottom:28}}>Join 85,000+ students who found funding through Dani Global Academy</p>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button className="btn btn-gold btn-lg" onClick={()=>onNavigate("register")}>Get Started — Free</button>
          <button className="btn btn-lg" style={{background:"rgba(255,255,255,0.15)",color:"white",border:"1px solid rgba(255,255,255,0.3)"}} onClick={()=>onNavigate("browse")}>Browse Scholarships</button>
        </div>
      </div>
    </div>
  );
}

// ─── BROWSE PAGE ──────────────────────────────────────────────────────────────
function BrowsePage({onNavigate,scholarships,loading,initialSearch=""}) {
  const [search,setSearch]=useState(initialSearch);
  const [sort,setSort]=useState("newest");
  const [filters,setFilters]=useState({countries:[],degrees:[],awardTypes:[]});
  const [page,setPage]=useState(1);
  const PER_PAGE=6;
  const dSearch=useDebounce(search,400);
  const allCountries=[...new Set(scholarships.map(s=>s.country))];
  const allDegrees=[...new Set(scholarships.flatMap(s=>s.degrees))];
  const allTypes=[...new Set(scholarships.map(s=>s.awardType))];
  function toggleFilter(key,val){setFilters(f=>({...f,[key]:f[key].includes(val)?f[key].filter(v=>v!==val):[...f[key],val]}));setPage(1);}
  const filtered=scholarships.filter(s=>{
    if(dSearch&&!s.title.toLowerCase().includes(dSearch.toLowerCase())&&!s.org.toLowerCase().includes(dSearch.toLowerCase())&&!s.tags.join(" ").toLowerCase().includes(dSearch.toLowerCase()))return false;
    if(filters.countries.length&&!filters.countries.includes(s.country))return false;
    if(filters.degrees.length&&!s.degrees.some(d=>filters.degrees.includes(d)))return false;
    if(filters.awardTypes.length&&!filters.awardTypes.includes(s.awardType))return false;
    return true;
  }).sort((a,b)=>{
    if(sort==="deadline")return new Date(a.deadline)-new Date(b.deadline);
    if(sort==="amount")return b.amount-a.amount;
    return b.id-a.id;
  });
  const pages=Math.ceil(filtered.length/PER_PAGE);
  const visible=filtered.slice((page-1)*PER_PAGE,page*PER_PAGE);
  const activeFilters=[...filters.countries,...filters.degrees,...filters.awardTypes];
  return (
    <div className="section">
      <div className="section-inner">
        <div className="browse-layout">
          <div className="filters-panel">
            <h3 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:16,marginBottom:16}}>Filters</h3>
            {[{key:"countries",label:"Country",options:allCountries},{key:"degrees",label:"Degree Level",options:allDegrees},{key:"awardTypes",label:"Award Type",options:allTypes}].map(f=>(
              <div className="filter-group" key={f.key}>
                <div className="filter-group-title">{f.label}</div>
                {f.options.map(o=><label className="filter-option" key={o}><input type="checkbox" checked={filters[f.key].includes(o)} onChange={()=>toggleFilter(f.key,o)} />{o}</label>)}
              </div>
            ))}
            {activeFilters.length>0&&<button className="btn btn-secondary btn-sm" style={{width:"100%"}} onClick={()=>setFilters({countries:[],degrees:[],awardTypes:[]})}>Clear Filters</button>}
          </div>
          <div>
            <div className="browse-header">
              <input className="search-input" placeholder="Search scholarships..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/>
              <select className="sort-select" value={sort} onChange={e=>setSort(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="deadline">Deadline</option>
                <option value="amount">Highest Award</option>
              </select>
            </div>
            {activeFilters.length>0&&<div className="active-filters">{activeFilters.map(f=><span key={f} className="filter-pill">{f} <span onClick={()=>setFilters(prev=>({countries:prev.countries.filter(v=>v!==f),degrees:prev.degrees.filter(v=>v!==f),awardTypes:prev.awardTypes.filter(v=>v!==f)}))} style={{cursor:"pointer",marginLeft:2}}>×</span></span>)}</div>}
            <div className="results-count">{filtered.length} scholarship{filtered.length!==1?"s":""} found</div>
            {loading?<div className="loading"><div className="spinner"></div>Loading...</div>:
            visible.length===0?<div className="empty-state"><div className="icon">🔍</div><h3>No scholarships found</h3><p>Try adjusting your search or filters</p></div>:
            <div className="cards-grid">{visible.map(s=><ScholarCard key={s.id} s={s} onNavigate={onNavigate}/>)}</div>}
            {pages>1&&<div className="pagination">
              <button className="page-btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>‹</button>
              {Array.from({length:pages},(_,i)=>i+1).map(p=><button key={p} className={`page-btn ${p===page?"active":""}`} onClick={()=>setPage(p)}>{p}</button>)}
              <button className="page-btn" disabled={page===pages} onClick={()=>setPage(p=>p+1)}>›</button>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DETAIL PAGE ──────────────────────────────────────────────────────────────
function DetailPage({slug,onNavigate,scholarships}) {
  const [tab,setTab]=useState("overview");
  const {bookmarks,toggleBookmark,user,addApplication,applications}=useStore();
  const s=scholarships.find(s=>s.slug===slug);
  if(!s)return <div className="section"><div className="empty-state"><div className="icon">😔</div><h3>Scholarship not found</h3><button className="btn btn-primary" onClick={()=>onNavigate("browse")}>Browse All</button></div></div>;
  const isBookmarked=bookmarks.has(s.id);
  const isTracked=applications.find(a=>a.scholarshipId===s.id);
  const related=scholarships.filter(r=>r.id!==s.id&&(r.country===s.country||r.fields.some(f=>s.fields.includes(f)))).slice(0,3);
  return (
    <div>
      <div className="detail-header">
        <div className="detail-header-inner">
          <div className="detail-logo" style={{background:s.orgColor||"#1B2D6B"}}>{s.orgLogo}</div>
          <div style={{flex:1}}>
            <div style={{opacity:0.8,fontSize:16}}>{s.org}</div>
            <h1 className="detail-title">{s.title}</h1>
            <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
              <DeadlineBadge deadline={s.deadline}/>
              <span style={{fontSize:14,opacity:0.8}}>🌍 {s.country}</span>
              <span style={{fontSize:13,color:"rgba(255,255,255,0.6)"}}>👁 {(s.views||0).toLocaleString()} views</span>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div className="detail-amount">{formatAmount(s.amount,s.currency)}</div>
            <div style={{opacity:0.7,fontSize:14}}>{s.awardType}</div>
          </div>
        </div>
      </div>
      <div className="detail-layout">
        <div>
          <div className="tabs">
            {["overview","requirements","eligibility","organization"].map(t=><button key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>)}
          </div>
          <div className="prose">
            {tab==="overview"&&<><p>{s.description||"No description available."}</p><div className="tags" style={{marginTop:16}}>{s.tags.map(t=><span key={t} className="tag">{t}</span>)}</div></>}
            {tab==="requirements"&&<><h4>Requirements</h4><p>{s.requirements||"Please check the official website for requirements."}</p><h4>Documents Needed</h4><p>Personal statement, Academic transcripts, Letters of recommendation, Proof of enrollment, Identity documents.</p></>}
            {tab==="eligibility"&&<><h4>Who Can Apply</h4><p>Open to students pursuing {s.degrees.join(", ")} degrees in {s.fields.join(", ")}. Based in or studying in {s.country}.</p><h4>Degree Levels</h4><div className="tags">{s.degrees.map(d=><span key={d} className="tag blue">{d}</span>)}</div><h4>Fields of Study</h4><div className="tags">{s.fields.map(f=><span key={f} className="tag">{f}</span>)}</div></>}
            {tab==="organization"&&<><h4>About {s.org}</h4><p>A leading organization committed to advancing education and supporting the next generation of global leaders through merit-based scholarships and fellowships.</p></>}
          </div>
          {related.length>0&&<div style={{marginTop:40}}><h3 style={{fontSize:20,marginBottom:16}}>Related Scholarships</h3><div className="cards-grid" style={{gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))"}}>{related.map(s=><ScholarCard key={s.id} s={s} onNavigate={onNavigate}/>)}</div></div>}
        </div>
        <div>
          <div className="sidebar-card">
            {s.appUrl?<a href={s.appUrl} target="_blank" rel="noopener noreferrer"><button className="btn btn-primary" style={{width:"100%",marginBottom:10}}>Apply Now ↗</button></a>:<button className="btn btn-primary" style={{width:"100%",marginBottom:10}} onClick={()=>toastStore.show("No application URL provided","error")}>Apply Now ↗</button>}
            <button className={`btn ${isBookmarked?"btn-gold":"btn-secondary"}`} style={{width:"100%",marginBottom:10}} onClick={()=>{if(!user){toastStore.show("Please login first","error");return;}toggleBookmark(s.id);toastStore.show(isBookmarked?"Removed from bookmarks":"Bookmarked! ★");}}>
              {isBookmarked?"★ Bookmarked":"☆ Save Scholarship"}
            </button>
            {user&&<button className={`btn ${isTracked?"btn-success":"btn-secondary"}`} style={{width:"100%"}} onClick={()=>{if(isTracked){toastStore.show("Already tracking","error");return;}addApplication(s.id);toastStore.show("Added to application tracker! 📝");}}>
              {isTracked?"✓ Tracking Application":"+ Track Application"}
            </button>}
          </div>
          <div className="sidebar-card">
            <h4 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,marginBottom:12,fontSize:14}}>Quick Info</h4>
            {[{l:"Award Amount",v:formatAmount(s.amount,s.currency)},{l:"Award Type",v:s.awardType},{l:"Deadline",v:new Date(s.deadline).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})},{l:"Country",v:s.country},{l:"Degree",v:s.degrees.join(", ")}].map(r=>(
              <div className="sidebar-row" key={r.l}><span className="label">{r.l}</span><span style={{fontWeight:500}}>{r.v}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AUTH PAGES ───────────────────────────────────────────────────────────────
function LoginPage({onNavigate}) {
  const {login}=useStore();
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  function handle(){
    if(!email||!pass){toastStore.show("Please fill all fields","error");return;}
    if(pass===ADMIN_PASSWORD&&(email.toLowerCase().includes("admin")||email.toLowerCase().includes("dani"))){
      login({name:"Admin",email,role:"admin"});
      toastStore.show("Welcome Admin! 🔑");
      onNavigate("admin");
      return;
    }
    const role=email.includes("org")?"org":"student";
    login({name:email.split("@")[0].replace(/\./g," ").replace(/\b\w/g,l=>l.toUpperCase()),email,role});
    toastStore.show("Welcome back! 👋");
    onNavigate("dashboard");
  }
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 style={{marginBottom:4}}>Welcome back</h2>
        <p style={{color:"var(--text3)",fontSize:14,marginBottom:28}}>Sign in to your Dani Global Academy account</p>
        <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/></div>
        <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/></div>
        <button className="btn btn-primary" style={{width:"100%",marginTop:8}} onClick={handle}>Sign In</button>
        <p style={{fontSize:13,textAlign:"center",color:"var(--text3)",marginTop:12}}>Don't have an account? <span style={{color:"var(--accent)",cursor:"pointer",fontWeight:500}} onClick={()=>onNavigate("register")}>Sign up</span></p>
        <div style={{marginTop:16,padding:12,background:"var(--surface2)",borderRadius:10,fontSize:12,color:"var(--text3)"}}>
          <strong>Admin login:</strong> use your email + password: <code>dani2025admin</code>
        </div>
      </div>
    </div>
  );
}

function RegisterPage({onNavigate}) {
  const {login}=useStore();
  const [role,setRole]=useState("student");
  const [form,setForm]=useState({name:"",email:"",pass:""});
  function handle(){
    if(!form.name||!form.email||!form.pass){toastStore.show("Please fill all fields","error");return;}
    login({name:form.name,email:form.email,role});
    toastStore.show("Account created! Welcome 🎉");
    onNavigate("dashboard");
  }
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 style={{marginBottom:4}}>Create account</h2>
        <p style={{color:"var(--text3)",fontSize:14,marginBottom:20}}>Join thousands of students finding scholarships</p>
        <div className="role-toggle">
          <button className={`role-btn ${role==="student"?"active":""}`} onClick={()=>setRole("student")}>🎓 Student</button>
          <button className={`role-btn ${role==="org"?"active":""}`} onClick={()=>setRole("org")}>🏛 Organization</button>
        </div>
        <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" placeholder="Jane Smith" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
        <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
        <div className="form-group"><label className="form-label">Password *</label><input className="form-input" type="password" placeholder="Min. 8 characters" value={form.pass} onChange={e=>setForm({...form,pass:e.target.value})}/></div>
        <button className="btn btn-primary" style={{width:"100%",marginTop:8}} onClick={handle}>Create Account</button>
        <p style={{fontSize:13,textAlign:"center",color:"var(--text3)",marginTop:12}}>Already have an account? <span style={{color:"var(--accent)",cursor:"pointer",fontWeight:500}} onClick={()=>onNavigate("login")}>Sign in</span></p>
      </div>
    </div>
  );
}

// ─── STUDENT DASHBOARD ────────────────────────────────────────────────────────
function DashboardPage({onNavigate,scholarships}) {
  const {user,bookmarks,applications}=useStore();
  const [section,setSection]=useState("home");
  if(!user)return <div className="auth-page"><div className="auth-card" style={{textAlign:"center"}}><div style={{fontSize:48,marginBottom:12}}>🔒</div><h3 style={{marginBottom:8}}>Login Required</h3><button className="btn btn-primary" style={{marginTop:12}} onClick={()=>onNavigate("login")}>Sign In</button></div></div>;
  const savedScholarships=scholarships.filter(s=>bookmarks.has(s.id));
  const trackedApps=applications.map(a=>({...a,scholarship:scholarships.find(s=>s.id===a.scholarshipId)})).filter(a=>a.scholarship);
  const navItems=[
    {id:"home",icon:"🏠",label:"Dashboard"},
    {id:"bookmarks",icon:"★",label:"Bookmarks"},
    {id:"applications",icon:"📝",label:"Applications"},
    {id:"settings",icon:"⚙️",label:"Settings"},
  ];
  return (
    <div className="dashboard-layout">
      <div className="sidebar">
        <div style={{padding:"0 12px 16px",borderBottom:"1px solid var(--border)",marginBottom:12}}>
          <div style={{width:44,height:44,background:"var(--accent)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:700,fontSize:18,marginBottom:8}}>{user.name[0]}</div>
          <div style={{fontWeight:600,fontSize:14}}>{user.name}</div>
          <div style={{fontSize:12,color:"var(--text3)"}}>{user.role==="org"?"Organization":"Student"}</div>
        </div>
        {navItems.map(item=><button key={item.id} className={`sidebar-nav-item ${section===item.id?"active":""}`} onClick={()=>setSection(item.id)}><span>{item.icon}</span>{item.label}</button>)}
      </div>
      <div className="dashboard-content">
        {section==="home"&&<>
          <h2 style={{marginBottom:4}}>Welcome back, {user.name.split(" ")[0]} 👋</h2>
          <p style={{color:"var(--text3)",marginBottom:24,fontSize:14}}>Here's your scholarship activity</p>
          <div className="stats-grid">
            <div className="stat-card accent"><div className="stat-num">{bookmarks.size}</div><div className="stat-label">Bookmarked</div></div>
            <div className="stat-card"><div className="stat-num">{applications.length}</div><div className="stat-label">Tracked Applications</div></div>
            <div className="stat-card"><div className="stat-num">{applications.filter(a=>a.status==="submitted").length}</div><div className="stat-label">Submitted</div></div>
            <div className="stat-card gold"><div className="stat-num">{applications.filter(a=>a.status==="accepted").length}</div><div className="stat-label">Accepted 🎉</div></div>
          </div>
          <h3 style={{marginBottom:16}}>Recommended for You</h3>
          <div className="cards-grid" style={{gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))"}}>
            {scholarships.slice(0,3).map(s=><ScholarCard key={s.id} s={s} onNavigate={onNavigate}/>)}
          </div>
        </>}
        {section==="bookmarks"&&<>
          <h2 style={{marginBottom:20}}>Saved Scholarships</h2>
          {savedScholarships.length===0?<div className="empty-state"><div className="icon">☆</div><h3>No bookmarks yet</h3><button className="btn btn-primary" onClick={()=>onNavigate("browse")} style={{marginTop:12}}>Browse Scholarships</button></div>:
          <div className="cards-grid">{savedScholarships.map(s=><ScholarCard key={s.id} s={s} onNavigate={onNavigate}/>)}</div>}
        </>}
        {section==="applications"&&<>
          <h2 style={{marginBottom:20}}>My Applications</h2>
          {trackedApps.length===0?<div className="empty-state"><div className="icon">📝</div><h3>No applications tracked</h3><button className="btn btn-primary" onClick={()=>onNavigate("browse")} style={{marginTop:12}}>Find Scholarships</button></div>:
          <div className="kanban">
            {["pending","submitted","accepted","rejected"].map(col=>{
              const items=trackedApps.filter(a=>a.status===col);
              return <div className="kanban-col" key={col}>
                <div className="kanban-col-title">{col.charAt(0).toUpperCase()+col.slice(1)}<span className="kanban-count">{items.length}</span></div>
                {items.map(a=><div className="kanban-item" key={a.id}>
                  <div style={{fontWeight:600,fontSize:13,marginBottom:4}}>{a.scholarship.title}</div>
                  <div style={{fontSize:12,color:"var(--text3)",marginBottom:8}}>{a.scholarship.org}</div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                    {["pending","submitted","accepted","rejected"].filter(c=>c!==col).map(c=><button key={c} className="btn btn-secondary" style={{fontSize:11,padding:"2px 7px",borderRadius:6}} onClick={()=>{store.updateAppStatus(a.id,c);toastStore.show(`Moved to ${c}`);}}>→{c}</button>)}
                  </div>
                </div>)}
                {items.length===0&&<div style={{padding:"20px 12px",textAlign:"center",fontSize:13,color:"var(--text3)"}}>Empty</div>}
              </div>;
            })}
          </div>}
        </>}
        {section==="settings"&&<div style={{maxWidth:520}}>
          <h2 style={{marginBottom:20}}>Profile Settings</h2>
          <div className="sidebar-card">
            <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24,paddingBottom:24,borderBottom:"1px solid var(--border)"}}>
              <div style={{width:64,height:64,background:"var(--accent)",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:700,fontSize:24}}>{user.name[0]}</div>
              <div><div style={{fontWeight:600,fontSize:16}}>{user.name}</div><div style={{fontSize:13,color:"var(--text3)"}}>{user.email}</div></div>
            </div>
            <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" defaultValue={user.name}/></div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" defaultValue={user.email} type="email"/></div>
            <div className="form-group"><label className="form-label">Country</label><input className="form-input" placeholder="Your country"/></div>
            <button className="btn btn-primary" onClick={()=>toastStore.show("Profile saved! ✅")}>Save Changes</button>
          </div>
        </div>}
      </div>
    </div>
  );
}

// ─── SCHOLARSHIP FORM MODAL ───────────────────────────────────────────────────
function ScholarshipModal({onClose,onSave,editData=null}) {
  const empty={title:"",org:"",amount:"",currency:"USD",awardType:"Full Funding",deadline:"",country:"",fields:"Any Field",degrees:"Undergraduate",tags:"",description:"",requirements:"",appUrl:"",featured:false};
  const [form,setForm]=useState(editData?{...editData,fields:editData.fields.join(";"),degrees:editData.degrees.join(";"),tags:editData.tags.join(";")}:empty);
  const u=v=>setForm(f=>({...f,...v}));
  function save(){
    if(!form.title||!form.org||!form.deadline){toastStore.show("Please fill Title, Organization and Deadline","error");return;}
    const s={...form,amount:parseFloat(form.amount)||0,fields:form.fields.split(";").map(s=>s.trim()),degrees:form.degrees.split(";").map(s=>s.trim()),tags:form.tags.split(";").map(s=>s.trim()).filter(Boolean)};
    onSave(s);
  }
  return (
    <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{editData?"Edit Scholarship":"Add New Scholarship"}</div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Title *</label><input className="form-input" value={form.title} onChange={e=>u({title:e.target.value})} placeholder="Scholarship title"/></div>
          <div className="form-group"><label className="form-label">Organization *</label><input className="form-input" value={form.org} onChange={e=>u({org:e.target.value})} placeholder="Foundation name"/></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Amount</label><input className="form-input" type="number" value={form.amount} onChange={e=>u({amount:e.target.value})} placeholder="50000"/></div>
          <div className="form-group"><label className="form-label">Currency</label><select className="form-select" value={form.currency} onChange={e=>u({currency:e.target.value})}><option>USD</option><option>EUR</option><option>GBP</option><option>CAD</option><option>AUD</option></select></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Award Type</label><select className="form-select" value={form.awardType} onChange={e=>u({awardType:e.target.value})}><option>Full Funding</option><option>Full Tuition</option><option>Partial Funding</option><option>Stipend</option></select></div>
          <div className="form-group"><label className="form-label">Deadline *</label><input className="form-input" type="date" value={form.deadline} onChange={e=>u({deadline:e.target.value})}/></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Country</label><input className="form-input" value={form.country} onChange={e=>u({country:e.target.value})} placeholder="USA, UK, International..."/></div>
          <div className="form-group"><label className="form-label">Fields (separate with ;)</label><input className="form-input" value={form.fields} onChange={e=>u({fields:e.target.value})} placeholder="STEM;Business;Any Field"/></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Degrees (separate with ;)</label><input className="form-input" value={form.degrees} onChange={e=>u({degrees:e.target.value})} placeholder="Undergraduate;Masters;PhD"/></div>
          <div className="form-group"><label className="form-label">Tags (separate with ;)</label><input className="form-input" value={form.tags} onChange={e=>u({tags:e.target.value})} placeholder="STEM;Leadership;Women"/></div>
        </div>
        <div className="form-group"><label className="form-label">Application URL</label><input className="form-input" type="url" value={form.appUrl} onChange={e=>u({appUrl:e.target.value})} placeholder="https://apply.org/scholarship"/></div>
        <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={form.description} onChange={e=>u({description:e.target.value})} placeholder="Describe the scholarship..."/></div>
        <div className="form-group"><label className="form-label">Requirements</label><textarea className="form-textarea" value={form.requirements} onChange={e=>u({requirements:e.target.value})} placeholder="Eligibility requirements..."/></div>
        <div className="form-group" style={{display:"flex",alignItems:"center",gap:8}}>
          <input type="checkbox" id="featured" checked={form.featured} onChange={e=>u({featured:e.target.checked})} style={{accentColor:"var(--accent)"}}/>
          <label htmlFor="featured" className="form-label" style={{margin:0}}>Feature on homepage</label>
        </div>
        <div style={{display:"flex",gap:10,marginTop:8}}>
          <button className="btn btn-secondary" style={{flex:1}} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{flex:2}} onClick={save}>{editData?"Save Changes":"Add Scholarship"} ✅</button>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminPage({onNavigate,scholarships,sheetUrl,setSheetUrl,onRefresh,loading}) {
  const {user,adminScholarships}=useStore();
  const [section,setSection]=useState("scholarships");
  const [showModal,setShowModal]=useState(false);
  const [editItem,setEditItem]=useState(null);
  const [sheetInput,setSheetInput]=useState(sheetUrl||"");
  const [deleteConfirm,setDeleteConfirm]=useState(null);

  if(!user||user.role!=="admin"){
    return (
      <div className="auth-page">
        <div className="auth-card" style={{textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:12}}>🔑</div>
          <h3 style={{marginBottom:8}}>Admin Access Required</h3>
          <p style={{color:"var(--text3)",marginBottom:20,fontSize:14}}>Login with admin credentials to access this panel</p>
          <button className="btn btn-primary" onClick={()=>onNavigate("login")}>Admin Login</button>
        </div>
      </div>
    );
  }

  const allScholarships=[...adminScholarships,...FALLBACK_SCHOLARSHIPS.filter(f=>!adminScholarships.find(a=>a.slug===f.slug))];

  function handleSave(data){
    if(editItem){
      store.updateAdminScholarship(editItem.id,{...data,slug:editItem.slug});
      toastStore.show("Scholarship updated! ✅");
    } else {
      store.addAdminScholarship(data);
      toastStore.show("Scholarship added! 🎉");
    }
    setShowModal(false);
    setEditItem(null);
  }

  function handleDelete(id){
    store.deleteAdminScholarship(id);
    setDeleteConfirm(null);
    toastStore.show("Deleted","error");
  }

  const navItems=[
    {id:"scholarships",icon:"📋",label:"Manage Scholarships"},
    {id:"add",icon:"➕",label:"Add Scholarship"},
    {id:"sheets",icon:"📊",label:"Google Sheets"},
    {id:"stats",icon:"📈",label:"Statistics"},
  ];

  return (
    <div className="dashboard-layout">
      <div className="sidebar">
        <div style={{padding:"0 12px 16px",borderBottom:"1px solid var(--border)",marginBottom:12}}>
          <div style={{width:44,height:44,background:"var(--accent2)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:8}}>⚙️</div>
          <div style={{fontWeight:600,fontSize:14}}>Admin Panel</div>
          <div style={{fontSize:12,color:"var(--text3)"}}>Dani Global Academy</div>
        </div>
        {navItems.map(item=><button key={item.id} className={`sidebar-nav-item ${section===item.id?"active":""}`} onClick={()=>{setSection(item.id);if(item.id==="add"){setEditItem(null);setShowModal(true);}}}><span>{item.icon}</span>{item.label}</button>)}
        <div style={{marginTop:"auto",paddingTop:16,borderTop:"1px solid var(--border)",marginTop:16}}>
          <button className="sidebar-nav-item" onClick={()=>onNavigate("home")}><span>🏠</span>View Website</button>
        </div>
      </div>

      <div className="dashboard-content">
        {/* MANAGE SCHOLARSHIPS */}
        {section==="scholarships"&&<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
            <div>
              <h2 style={{marginBottom:4}}>Manage Scholarships</h2>
              <p style={{color:"var(--text3)",fontSize:14}}>{allScholarships.length} total scholarships</p>
            </div>
            <button className="btn btn-primary" onClick={()=>{setEditItem(null);setShowModal(true);}}>+ Add Scholarship</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Title</th><th>Organization</th><th>Amount</th><th>Deadline</th><th>Status</th><th>Featured</th><th>Actions</th></tr></thead>
              <tbody>
                {allScholarships.map(s=>(
                  <tr key={s.id}>
                    <td style={{maxWidth:200}}><strong style={{fontSize:13}}>{s.title}</strong></td>
                    <td style={{fontSize:13}}>{s.org}</td>
                    <td style={{fontSize:13,fontWeight:600,color:"var(--accent)"}}>{formatAmount(s.amount,s.currency)}</td>
                    <td><DeadlineBadge deadline={s.deadline}/></td>
                    <td><span className="status published">Published</span></td>
                    <td style={{textAlign:"center"}}>{s.featured?"⭐":""}</td>
                    <td>
                      <div style={{display:"flex",gap:6}}>
                        <button className="btn btn-secondary btn-sm" onClick={()=>{setEditItem(s);setShowModal(true);}}>✏️ Edit</button>
                        {adminScholarships.find(a=>a.id===s.id)?
                          <button className="btn btn-danger btn-sm" onClick={()=>setDeleteConfirm(s.id)}>🗑️</button>:
                          <span style={{fontSize:11,color:"var(--text3)",padding:"6px 8px"}}>Built-in</span>
                        }
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>}

        {/* GOOGLE SHEETS */}
        {section==="sheets"&&<>
          <h2 style={{marginBottom:8}}>📊 Google Sheets Integration</h2>
          <p style={{color:"var(--text3)",fontSize:14,marginBottom:24}}>Connect a Google Sheet to manage all scholarships like a spreadsheet</p>
          <div className="sidebar-card" style={{maxWidth:600}}>
            <h3 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:17,marginBottom:16}}>How to set up Google Sheets</h3>
            <div style={{background:"var(--surface2)",borderRadius:10,padding:16,marginBottom:20,fontSize:13,lineHeight:1.8}}>
              <strong>Step 1:</strong> Open Google Sheets → create a new spreadsheet<br/>
              <strong>Step 2:</strong> Add these column headers in Row 1:<br/>
              <code style={{background:"var(--border)",padding:"4px 8px",borderRadius:6,display:"block",margin:"8px 0",fontSize:12}}>title, org, amount, currency, awardType, deadline, country, fields, degrees, tags, description, requirements, appUrl, featured, status</code>
              <strong>Step 3:</strong> Fill in your scholarships (one per row)<br/>
              <strong>Step 4:</strong> Click <strong>File → Share → Publish to web</strong><br/>
              <strong>Step 5:</strong> Choose <strong>"Comma-separated values (.csv)"</strong> → click Publish<br/>
              <strong>Step 6:</strong> Copy the URL and paste it below<br/>
              <br/>
              <strong>💡 Tips:</strong><br/>
              • For multiple fields/degrees/tags, separate with semicolons: <code>STEM;Business</code><br/>
              • Set <code>featured</code> to <code>true</code> to show on homepage<br/>
              • Set <code>status</code> to <code>published</code> to show on site
            </div>
            <div className="form-group">
              <label className="form-label">Your Google Sheet CSV URL</label>
              <input className="form-input" value={sheetInput} onChange={e=>setSheetInput(e.target.value)} placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv"/>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button className="btn btn-primary" style={{flex:1}} onClick={()=>{setSheetUrl(sheetInput);saveLocal("dga_sheet_url",sheetInput);toastStore.show("Sheet URL saved! Click Refresh to load data 📊");}}>
                💾 Save URL
              </button>
              <button className="btn btn-secondary" onClick={()=>{onRefresh();toastStore.show("Refreshing from Google Sheets... 🔄");}}>
                🔄 Refresh Now
              </button>
            </div>
            {sheetUrl&&sheetUrl!=="YOUR_GOOGLE_SHEET_CSV_URL_HERE"&&<div className="alert success" style={{marginTop:16}}>✅ Google Sheet connected! {loading?"Loading...":scholarships.length+" scholarships loaded."}</div>}
            {(!sheetUrl||sheetUrl==="YOUR_GOOGLE_SHEET_CSV_URL_HERE")&&<div className="alert info" style={{marginTop:16}}>ℹ️ No Google Sheet connected yet. Using built-in scholarship data.</div>}
          </div>
        </>}

        {/* STATS */}
        {section==="stats"&&<>
          <h2 style={{marginBottom:24}}>📈 Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card accent"><div className="stat-num">{allScholarships.length}</div><div className="stat-label">Total Scholarships</div></div>
            <div className="stat-card gold"><div className="stat-num">{allScholarships.filter(s=>s.featured).length}</div><div className="stat-label">Featured</div></div>
            <div className="stat-card"><div className="stat-num">{allScholarships.filter(s=>daysUntil(s.deadline)>0).length}</div><div className="stat-label">Active</div></div>
            <div className="stat-card"><div className="stat-num">{adminScholarships.length}</div><div className="stat-label">Manually Added</div></div>
            <div className="stat-card"><div className="stat-num">{[...new Set(allScholarships.map(s=>s.country))].length}</div><div className="stat-label">Countries</div></div>
            <div className="stat-card"><div className="stat-num">${Math.round(allScholarships.reduce((a,s)=>a+s.amount,0)/1000)}K+</div><div className="stat-label">Total Value</div></div>
          </div>
          <h3 style={{marginBottom:16}}>Scholarships by Country</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Country</th><th>Count</th><th>Total Value</th></tr></thead>
              <tbody>
                {[...new Set(allScholarships.map(s=>s.country))].map(country=>{
                  const cs=allScholarships.filter(s=>s.country===country);
                  return <tr key={country}><td>{country}</td><td>{cs.length}</td><td style={{color:"var(--accent)",fontWeight:600}}>{cs.reduce((a,s)=>a+(s.amount||0),0).toLocaleString()} {cs[0]?.currency}</td></tr>;
                })}
              </tbody>
            </table>
          </div>
        </>}
      </div>

      {/* MODALS */}
      {showModal&&<ScholarshipModal onClose={()=>{setShowModal(false);setEditItem(null);}} onSave={handleSave} editData={editItem}/>}
      {deleteConfirm&&<div className="modal-overlay">
        <div className="modal" style={{maxWidth:400,textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:12}}>🗑️</div>
          <h3 style={{marginBottom:8}}>Delete Scholarship?</h3>
          <p style={{color:"var(--text3)",marginBottom:24,fontSize:14}}>This cannot be undone</p>
          <div style={{display:"flex",gap:10}}>
            <button className="btn btn-secondary" style={{flex:1}} onClick={()=>setDeleteConfirm(null)}>Cancel</button>
            <button className="btn btn-danger" style={{flex:1}} onClick={()=>handleDelete(deleteConfirm)}>Yes, Delete</button>
          </div>
        </div>
      </div>}
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({onNavigate}) {
  return (
    <footer style={{background:"var(--text)",color:"rgba(255,255,255,0.7)",padding:"48px 24px 32px",marginTop:"auto"}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(180px,1fr))",gap:32,marginBottom:40}}>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:900,color:"white",marginBottom:8}}>Dani <span style={{color:"#C9921A"}}>Global Academy</span></div>
            <p style={{fontSize:13,lineHeight:1.7}}>Connecting students with life-changing scholarship opportunities worldwide.</p>
          </div>
          {[{title:"Platform",links:["Browse Scholarships","Categories","Featured","Expiring Soon"]},{title:"Account",links:["Login","Register","Dashboard","Settings"]},{title:"Organizations",links:["Post Scholarship","Admin Panel","Contact Us"]}].map(col=>(
            <div key={col.title}>
              <div style={{fontWeight:600,color:"white",marginBottom:12,fontSize:14}}>{col.title}</div>
              {col.links.map(l=><div key={l} style={{fontSize:13,marginBottom:8,cursor:"pointer"}} onClick={()=>toastStore.show("Coming soon!")}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,0.1)",paddingTop:20,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,fontSize:12}}>
          <span>© 2025 Dani Global Academy. All rights reserved.</span>
          <span>Built with ❤️ for students worldwide</span>
        </div>
      </div>
    </footer>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page,setPage]=useState("home");
  const [pageParam,setPageParam]=useState(null);
  const [searchParam,setSearchParam]=useState("");
  const [scholarships,setScholarships]=useState([]);
  const [loading,setLoading]=useState(true);
  const [sheetUrl,setSheetUrl]=useState(()=>loadLocal("dga_sheet_url",GOOGLE_SHEET_CSV_URL));
  const {adminScholarships}=useStore();

  async function loadScholarships(){
    setLoading(true);
    let sheetData=null;
    if(sheetUrl&&sheetUrl!=="YOUR_GOOGLE_SHEET_CSV_URL_HERE"){
      sheetData=await fetchFromGoogleSheets(sheetUrl);
    }
    const base=sheetData||FALLBACK_SCHOLARSHIPS;
    const merged=[...adminScholarships,...base.filter(f=>!adminScholarships.find(a=>a.slug===f.slug))];
    setScholarships(merged);
    setLoading(false);
  }

  useEffect(()=>{
    loadScholarships();
    const fn=()=>loadScholarships();
    store.listeners.add(fn);
    return()=>store.listeners.delete(fn);
  },[sheetUrl]);

  function navigate(p,param=null,search=""){
    setPage(p);setPageParam(param);setSearchParam(search);
    window.scrollTo(0,0);
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <Nav page={page} onNavigate={navigate}/>
        <main style={{flex:1}}>
          {page==="home"&&<HomePage onNavigate={navigate} scholarships={scholarships} loading={loading}/>}
          {page==="browse"&&<BrowsePage onNavigate={navigate} scholarships={scholarships} loading={loading} initialSearch={searchParam}/>}
          {page==="detail"&&<DetailPage slug={pageParam} onNavigate={navigate} scholarships={scholarships}/>}
          {page==="login"&&<LoginPage onNavigate={navigate}/>}
          {page==="register"&&<RegisterPage onNavigate={navigate}/>}
          {page==="dashboard"&&<DashboardPage onNavigate={navigate} scholarships={scholarships}/>}
          {page==="admin"&&<AdminPage onNavigate={navigate} scholarships={scholarships} sheetUrl={sheetUrl} setSheetUrl={setSheetUrl} onRefresh={loadScholarships} loading={loading}/>}
        </main>
        <Footer onNavigate={navigate}/>
        <ToastContainer/>
      </div>
    </>
  );
}
