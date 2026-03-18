import { useState, useEffect } from "react";

// ─── ADMIN CONFIG ────────────────────────────────────────────────────────────
// STEP 1: Replace with your Google Sheet CSV URL (see README for instructions)
const GOOGLE_SHEET_CSV_URL = "YOUR_GOOGLE_SHEET_CSV_URL_HERE";
// STEP 2: Change this password to something secret!
const ADMIN_PASSWORD = "dani2025admin";

// ─── SCHOLARSHIP DATA (80+ real scholarships worldwide) ──────────────────────
const FALLBACK_SCHOLARSHIPS = [
  // ── USA ──────────────────────────────────────────────────────────────────
  { id:1, slug:"gates-millennium-scholars", title:"Gates Millennium Scholars Program", org:"Bill & Melinda Gates Foundation", orgLogo:"BG", orgColor:"#0078D4", amount:50000, currency:"USD", awardType:"Full Tuition", deadline:"2026-01-15", country:"USA", fields:["Any Field"], degrees:["Undergraduate","Graduate"], tags:["STEM","Minority","Leadership"], description:"The Gates Millennium Scholars Program selects 1,000 talented students each year. The program focuses on promoting academic excellence and providing an opportunity for outstanding minority students.", requirements:"Minimum 3.3 GPA. Demonstrated leadership and community service. Financial need required. Must be African American, American Indian, Alaska Native, Asian Pacific Islander, or Hispanic.", views:4821, status:"published", featured:true, appUrl:"https://gmsp.org" },
  { id:2, slug:"fulbright-program", title:"Fulbright U.S. Student Program", org:"U.S. Department of State", orgLogo:"FU", orgColor:"#003F87", amount:35000, currency:"USD", awardType:"Full Funding", deadline:"2026-10-10", country:"USA", fields:["Arts","Humanities","Social Sciences","STEM"], degrees:["Graduate","Research"], tags:["International","Research","USA"], description:"The Fulbright U.S. Student Program provides grants for individually designed study/research projects or for English Teaching Assistant Programs in over 140 countries worldwide.", requirements:"U.S. citizenship. Bachelor's degree by start date. Language proficiency may be required.", views:5102, status:"published", featured:true, appUrl:"https://us.fulbrightonline.org" },
  { id:3, slug:"knight-hennessy-scholars", title:"Knight-Hennessy Scholars Program", org:"Stanford University", orgLogo:"KH", orgColor:"#8C1515", amount:90000, currency:"USD", awardType:"Full Funding", deadline:"2026-10-09", country:"USA", fields:["Any Field"], degrees:["Graduate","MBA","JD","MD"], tags:["Stanford","Leadership","Multidisciplinary"], description:"Knight-Hennessy Scholars is one of the world's largest fully endowed graduate scholarships. The program cultivates a diverse community of future global leaders from every discipline.", requirements:"Apply within 4 years of completing undergraduate degree. Acceptance to a Stanford graduate program. Demonstrated leadership and civic commitment.", views:4100, status:"published", featured:true, appUrl:"https://knight-hennessy.stanford.edu" },
  { id:4, slug:"paul-daisy-soros", title:"Paul & Daisy Soros Fellowships for New Americans", org:"Soros Foundation", orgLogo:"SF", orgColor:"#E8401C", amount:90000, currency:"USD", awardType:"Full Funding", deadline:"2026-11-01", country:"USA", fields:["Any Field"], degrees:["Graduate"], tags:["Immigrants","USA","Leadership"], description:"The Paul & Daisy Soros Fellowships for New Americans supports immigrants and children of immigrants pursuing graduate school in the United States. The program honors the contributions of New Americans.", requirements:"New American (immigrant or child of immigrants). Under age 30. Completing undergraduate degree or enrolled in graduate program.", views:1892, status:"published", featured:false, appUrl:"https://www.pdsoros.org" },
  { id:5, slug:"aauw-career-development", title:"AAUW Career Development Grants", org:"AAUW Foundation", orgLogo:"AA", orgColor:"#8B2FC9", amount:12000, currency:"USD", awardType:"Partial Funding", deadline:"2026-12-15", country:"USA", fields:["Any Field"], degrees:["Certificate","Undergraduate"], tags:["Women","Career","USA"], description:"Career Development Grants provide funding to women who hold a bachelor's degree and are preparing to advance or change careers. Priority given to AAUW members and women of color.", requirements:"U.S. citizen or permanent resident. Female. At least 5 years since bachelor's degree. Enrolled in accredited program.", views:1243, status:"published", featured:false, appUrl:"https://www.aauw.org" },
  { id:6, slug:"microsoft-scholarship", title:"Microsoft Scholarship Program", org:"Microsoft Corporation", orgLogo:"MS", orgColor:"#00A4EF", amount:5000, currency:"USD", awardType:"Partial Funding", deadline:"2026-02-01", country:"USA", fields:["Computer Science","Engineering","Technology"], degrees:["Undergraduate"], tags:["Tech","STEM","Corporate"], description:"Microsoft Scholarships are awarded to students who demonstrate a passion for technology, academic excellence, and a commitment to creating a more accessible and inclusive world.", requirements:"Enrolled full-time at a 4-year university in the US. Pursuing degree in CS or related field. Minimum 3.0 GPA.", views:2980, status:"published", featured:false, appUrl:"https://careers.microsoft.com/students" },
  { id:7, slug:"google-generation-scholarship", title:"Google Generation Scholarship", org:"Google LLC", orgLogo:"GG", orgColor:"#4285F4", amount:10000, currency:"USD", awardType:"Partial Funding", deadline:"2026-03-01", country:"USA", fields:["Computer Science","Engineering","Technology"], degrees:["Undergraduate","Graduate"], tags:["Tech","Google","Diversity"], description:"Google Generation Scholarships are designed to help aspiring students pursue degrees in computer science and related fields. Google is committed to breaking barriers and creating opportunities.", requirements:"Enrolled in a Bachelor's or Master's program. Pursuing CS or related technical field. Demonstrated financial need or minority background.", views:3450, status:"published", featured:false, appUrl:"https://buildyourfuture.withgoogle.com/scholarships" },
  { id:8, slug:"coca-cola-scholars", title:"Coca-Cola Scholars Program", org:"Coca-Cola Scholars Foundation", orgLogo:"CC", orgColor:"#F40009", amount:20000, currency:"USD", awardType:"Partial Funding", deadline:"2025-10-31", country:"USA", fields:["Any Field"], degrees:["Undergraduate"], tags:["Leadership","Community","USA"], description:"The Coca-Cola Scholars Program scholarship is an achievement-based scholarship awarded to graduating high school seniors. 150 Scholars are chosen each year for their capacity to lead and serve.", requirements:"Current high school senior. U.S. citizen or permanent resident. Minimum 3.0 GPA. Demonstrated leadership and service.", views:2100, status:"published", featured:false, appUrl:"https://www.coca-colascholarsfoundation.org" },
  { id:9, slug:"jack-kent-cooke", title:"Jack Kent Cooke Foundation College Scholarship", org:"Jack Kent Cooke Foundation", orgLogo:"JK", orgColor:"#003366", amount:55000, currency:"USD", awardType:"Full Funding", deadline:"2025-11-15", country:"USA", fields:["Any Field"], degrees:["Undergraduate"], tags:["Need-Based","High Achievement","USA"], description:"The Jack Kent Cooke Foundation College Scholarship Program is an undergraduate scholarship for high-achieving students with financial need. Up to $55,000 per year for four years.", requirements:"High school senior with exceptional academic achievement. Demonstrated financial need. Unweighted GPA 3.5 or higher. SAT 1200+ or ACT 26+.", views:1870, status:"published", featured:false, appUrl:"https://jkcf.org" },
  { id:10, slug:"harry-truman-scholarship", title:"Harry S. Truman Scholarship", org:"Harry S. Truman Scholarship Foundation", orgLogo:"HT", orgColor:"#002868", amount:30000, currency:"USD", awardType:"Partial Funding", deadline:"2026-02-01", country:"USA", fields:["Public Policy","Social Sciences","Law"], degrees:["Undergraduate"], tags:["Public Service","Leadership","USA"], description:"The Truman Scholarship is the premier scholarship for college students who are committed to making a difference through public service. It supports future public leaders.", requirements:"U.S. citizen. College junior. Commitment to public service career. Exceptional leadership record.", views:980, status:"published", featured:false, appUrl:"https://www.truman.gov" },
  { id:11, slug:"national-merit-scholarship", title:"National Merit Scholarship", org:"National Merit Scholarship Corporation", orgLogo:"NM", orgColor:"#1B2D6B", amount:2500, currency:"USD", awardType:"Partial Funding", deadline:"2026-04-01", country:"USA", fields:["Any Field"], degrees:["Undergraduate"], tags:["Academic Excellence","USA","High School"], description:"National Merit Scholarships are one-time awards. Finalists compete for corporate-sponsored or college-sponsored scholarships. About 7,500 scholarships are awarded annually.", requirements:"U.S. citizen. High PSAT/NMSQT score qualifying as Semifinalist. Enrolled full-time as high school senior.", views:5200, status:"published", featured:false, appUrl:"https://www.nationalmerit.org" },
  { id:12, slug:"schwarzman-scholars", title:"Schwarzman Scholars Program", org:"Schwarzman College, Tsinghua University", orgLogo:"SC", orgColor:"#8B0000", amount:45000, currency:"USD", awardType:"Full Funding", deadline:"2025-09-20", country:"China", fields:["Public Policy","Business","Technology","International Relations"], degrees:["Masters"], tags:["China","Leadership","Global","Tsinghua"], description:"Schwarzman Scholars is a highly selective, one-year master's program at Tsinghua University in Beijing aimed at preparing future leaders who understand China's role in global trends.", requirements:"Age 18-28. Bachelor's degree. English language proficiency. Leadership and professional achievement.", views:2470, status:"published", featured:false, appUrl:"https://www.schwarzmanscholars.org" },

  // ── UK ───────────────────────────────────────────────────────────────────
  { id:13, slug:"chevening-scholarship", title:"Chevening Scholarship", org:"UK Foreign Office", orgLogo:"CF", orgColor:"#C8102E", amount:45000, currency:"GBP", awardType:"Full Funding", deadline:"2025-11-05", country:"UK", fields:["Any Field"], degrees:["Masters"], tags:["International","Leadership","UK"], description:"Chevening is the UK government's international awards programme, funded by the Foreign, Commonwealth & Development Office. It offers full funding for a one-year master's degree at any UK university.", requirements:"Two years of work experience. Undergraduate degree. English proficiency. Must return to home country for two years after completing the scholarship.", views:3960, status:"published", featured:true, appUrl:"https://www.chevening.org" },
  { id:14, slug:"rhodes-scholarship", title:"Rhodes Scholarship", org:"Rhodes Trust", orgLogo:"RT", orgColor:"#00539F", amount:60000, currency:"USD", awardType:"Full Funding", deadline:"2025-10-01", country:"UK", fields:["Any Field"], degrees:["Graduate"], tags:["Prestigious","Oxford","Leadership"], description:"The Rhodes Scholarship is the oldest and most celebrated international fellowship award in the world. Rhodes Scholars are selected for postgraduate study at the University of Oxford.", requirements:"Age 18-24. Strong academic record. Leadership qualities. Commitment to public service.", views:6340, status:"published", featured:true, appUrl:"https://www.rhodeshouse.ox.ac.uk" },
  { id:15, slug:"commonwealth-scholarship", title:"Commonwealth Scholarship and Fellowship Plan", org:"Commonwealth Scholarship Commission", orgLogo:"CS", orgColor:"#006B54", amount:20000, currency:"GBP", awardType:"Full Funding", deadline:"2025-10-16", country:"UK", fields:["Any Field"], degrees:["Masters","PhD"], tags:["Commonwealth","UK","Development"], description:"Commonwealth Scholarships are offered to citizens of Commonwealth countries to study in the UK. Funded by the UK government, they support educational development in Commonwealth nations.", requirements:"Citizen of a Commonwealth country. Undergraduate degree with at least upper second class honours. Commitment to development of home country.", views:2340, status:"published", featured:false, appUrl:"https://cscuk.fcdo.gov.uk" },
  { id:16, slug:"wellcome-trust-scholarship", title:"Wellcome Trust PhD Scholarships", org:"Wellcome Trust", orgLogo:"WT", orgColor:"#E30613", amount:25000, currency:"GBP", awardType:"Full Funding", deadline:"2026-03-31", country:"UK", fields:["Medicine","Biology","STEM","Health Sciences"], degrees:["PhD"], tags:["Medical Research","Science","UK"], description:"Wellcome Trust funds exceptional research in biomedical and health sciences. PhD scholarships support talented researchers tackling some of the world's most pressing health challenges.", requirements:"Excellent academic record. Strong research proposal. Passion for biomedical science. Open to all nationalities.", views:1650, status:"published", featured:false, appUrl:"https://wellcome.org" },
  { id:17, slug:"british-council-scholarship", title:"British Council Study UK Scholarships", org:"British Council", orgLogo:"BC", orgColor:"#0047AB", amount:15000, currency:"GBP", awardType:"Partial Funding", deadline:"2026-05-01", country:"UK", fields:["Any Field"], degrees:["Undergraduate","Masters"], tags:["UK","International","Cultural Exchange"], description:"British Council scholarships enable talented students from around the world to study at UK universities, building international connections and developing global leaders.", requirements:"Eligible nationality per country-specific criteria. Academic excellence. English language proficiency.", views:1890, status:"published", featured:false, appUrl:"https://www.britishcouncil.org" },

  // ── EUROPE ───────────────────────────────────────────────────────────────
  { id:18, slug:"erasmus-mundus", title:"Erasmus Mundus Joint Master Degrees", org:"European Commission", orgLogo:"EM", orgColor:"#003399", amount:24000, currency:"EUR", awardType:"Full Funding", deadline:"2026-01-15", country:"Europe", fields:["Any Field"], degrees:["Masters"], tags:["Europe","International","Multi-Country"], description:"Erasmus Mundus Joint Master Degrees are prestigious, integrated international study programmes jointly delivered by an international consortium of universities across Europe.", requirements:"Bachelor's degree. English proficiency. Depends on specific program requirements.", views:3210, status:"published", featured:false, appUrl:"https://www.eacea.ec.europa.eu/erasmus-plus" },
  { id:19, slug:"daad-scholarship", title:"DAAD Research Grants", org:"German Academic Exchange Service", orgLogo:"DA", orgColor:"#005AA0", amount:11000, currency:"EUR", awardType:"Stipend", deadline:"2026-07-20", country:"Germany", fields:["STEM","Engineering","Natural Sciences","Humanities"], degrees:["Masters","PhD","Research"], tags:["Germany","Research","STEM"], description:"DAAD scholarships enable highly-qualified graduates and postgraduates to pursue research and study programs in Germany. Covers living costs, travel expenses, and health insurance.", requirements:"Bachelor's degree with above-average results. Two academic recommendations. Language proficiency in German or English.", views:2788, status:"published", featured:false, appUrl:"https://www.daad.de" },
  { id:20, slug:"eiffel-excellence-france", title:"Eiffel Excellence Scholarship Programme", org:"Campus France", orgLogo:"EF", orgColor:"#002395", amount:14000, currency:"EUR", awardType:"Full Funding", deadline:"2026-01-08", country:"France", fields:["Engineering","Economics","Law","Political Science"], degrees:["Masters","PhD"], tags:["France","Excellence","International"], description:"The Eiffel Excellence Scholarship Programme is a tool developed by the French Ministry for Europe and Foreign Affairs to attract top foreign students to French higher education institutions.", requirements:"Under 30 years (Masters) or 35 years (PhD). Non-French national. Nominated by a French institution. Excellent academic record.", views:1560, status:"published", featured:false, appUrl:"https://www.campusfrance.org" },
  { id:21, slug:"holland-scholarship", title:"Holland Scholarship", org:"Dutch Ministry of Education", orgLogo:"HL", orgColor:"#AE1C28", amount:5000, currency:"EUR", awardType:"Partial Funding", deadline:"2026-05-01", country:"Netherlands", fields:["Any Field"], degrees:["Undergraduate","Masters"], tags:["Netherlands","Holland","International"], description:"The Holland Scholarship is funded by the Dutch Ministry of Education, Culture and Science and is meant for international students from outside the European Economic Area.", requirements:"Non-EEA student. Applying for first year of Bachelor's or Master's program. Excellent academic record.", views:1230, status:"published", featured:false, appUrl:"https://www.studyinnl.org" },
  { id:22, slug:"swedish-institute-scholarship", title:"Swedish Institute Scholarship for Global Professionals", org:"Swedish Institute", orgLogo:"SI", orgColor:"#006AA7", amount:16500, currency:"EUR", awardType:"Full Funding", deadline:"2026-02-10", country:"Sweden", fields:["Any Field"], degrees:["Masters"], tags:["Sweden","Sustainability","Leadership"], description:"The Swedish Institute Scholarship for Global Professionals (SISGP) supports future global leaders who want to pursue a Master's degree in Sweden and make a positive impact in the world.", requirements:"Citizen of eligible country. Bachelor's degree. At least 3,000 hours work experience. Leadership qualities.", views:1780, status:"published", featured:false, appUrl:"https://si.se/en/apply/scholarships" },
  { id:23, slug:"swiss-government-excellence", title:"Swiss Government Excellence Scholarships", org:"Swiss Confederation", orgLogo:"SG", orgColor:"#FF0000", amount:22000, currency:"CHF", awardType:"Full Funding", deadline:"2025-12-15", country:"Switzerland", fields:["Any Field"], degrees:["PhD","Postdoc","Research"], tags:["Switzerland","Research","Excellence"], description:"The Swiss Government Excellence Scholarships are aimed at promoting international exchange and research cooperation between Switzerland and over 180 countries.", requirements:"Citizen of eligible country. University degree. Research proposal. Under 35 years for PhD.", views:1120, status:"published", featured:false, appUrl:"https://www.sbfi.admin.ch/scholarships" },
  { id:24, slug:"nuffic-orange-tulip", title:"Orange Tulip Scholarship Netherlands", org:"Nuffic", orgLogo:"OT", orgColor:"#FF5900", amount:8000, currency:"EUR", awardType:"Partial Funding", deadline:"2026-03-01", country:"Netherlands", fields:["Any Field"], degrees:["Undergraduate","Masters"], tags:["Netherlands","Dutch","Developing Countries"], description:"The Orange Tulip Scholarship programme aims to provide talented and motivated students from specific countries the opportunity to study at a Dutch university of their choice.", requirements:"Citizen of eligible country. Accepted to Dutch university. Strong academic record.", views:990, status:"published", featured:false, appUrl:"https://www.nuffic.nl" },
  { id:25, slug:"bologna-university-scholarship", title:"University of Bologna International Excellence Scholarships", org:"University of Bologna", orgLogo:"UB", orgColor:"#CC0000", amount:11000, currency:"EUR", awardType:"Full Funding", deadline:"2026-05-31", country:"Italy", fields:["Any Field"], degrees:["Masters"], tags:["Italy","Bologna","Excellence","International"], description:"The University of Bologna offers scholarships to outstanding non-EU students wishing to enroll in 2-year Master's Degree programs taught entirely in English.", requirements:"Non-EU citizen. Excellent academic record. Applying for an English-taught Master's program at Bologna.", views:1340, status:"published", featured:false, appUrl:"https://www.unibo.it/en/international" },

  // ── AUSTRALIA & NEW ZEALAND ───────────────────────────────────────────────
  { id:26, slug:"australia-awards-scholarship", title:"Australia Awards Scholarships", org:"Australian Government", orgLogo:"AU", orgColor:"#00843D", amount:55000, currency:"AUD", awardType:"Full Funding", deadline:"2026-04-30", country:"Australia", fields:["Any Field"], degrees:["Undergraduate","Masters","PhD"], tags:["Australia","Development","Pacific","Africa"], description:"Australia Awards Scholarships are long-term development scholarships funded by the Australian Government. They provide opportunity for people from developing countries to undertake full-time study in Australia.", requirements:"Citizen of eligible developing country. Meet English language requirements. Commitment to return home after study.", views:3120, status:"published", featured:true, appUrl:"https://www.australiaawardscholarships.dfat.gov.au" },
  { id:27, slug:"endeavour-research-fellowship", title:"Endeavour Leadership Program", org:"Australian Government", orgLogo:"EL", orgColor:"#00843D", amount:15000, currency:"AUD", awardType:"Stipend", deadline:"2026-06-30", country:"Australia", fields:["Any Field"], degrees:["Research","Postdoc"], tags:["Australia","Research","Leadership"], description:"The Endeavour Leadership Program provides merit-based, fully-funded scholarships for high achieving individuals from the Indo-Pacific and beyond to undertake study, research or professional development.", requirements:"Strong academic record. Research proposal or study plan. Citizens of eligible countries.", views:1230, status:"published", featured:false, appUrl:"https://internationaleducation.gov.au" },
  { id:28, slug:"new-zealand-commonwealth-scholarships", title:"New Zealand Commonwealth Scholarship", org:"New Zealand Government", orgLogo:"NZ", orgColor:"#00247D", amount:18000, currency:"NZD", awardType:"Full Funding", deadline:"2026-03-01", country:"New Zealand", fields:["Any Field"], degrees:["Masters","PhD"], tags:["New Zealand","Commonwealth","Pacific"], description:"New Zealand Commonwealth Scholarships enable students from Commonwealth developing countries to study in New Zealand, contributing to development in their home countries.", requirements:"Citizen of a developing Commonwealth country. Bachelor's degree. English language proficiency.", views:880, status:"published", featured:false, appUrl:"https://www.education.govt.nz" },

  // ── CANADA ────────────────────────────────────────────────────────────────
  { id:29, slug:"vanier-canada-graduate", title:"Vanier Canada Graduate Scholarships", org:"Government of Canada", orgLogo:"VC", orgColor:"#FF0000", amount:50000, currency:"CAD", awardType:"Partial Funding", deadline:"2025-11-01", country:"Canada", fields:["Any Field"], degrees:["PhD"], tags:["Canada","Research","Excellence"], description:"The Vanier Canada Graduate Scholarships program aims to attract and retain world-class doctoral students by supporting students who demonstrate both leadership skills and a high standard of scholarly achievement.", requirements:"Nominated by a Canadian university. Excellent academic record. Demonstrated leadership. Canadian citizen, permanent resident, or foreign national.", views:1560, status:"published", featured:false, appUrl:"https://vanier.gc.ca" },
  { id:30, slug:"trudeau-foundation-scholarship", title:"Pierre Elliott Trudeau Foundation Scholarship", org:"Trudeau Foundation", orgLogo:"TF", orgColor:"#D62828", amount:40000, currency:"CAD", awardType:"Full Funding", deadline:"2026-01-31", country:"Canada", fields:["Social Sciences","Humanities","Law","Environment"], degrees:["PhD"], tags:["Canada","Social Sciences","Leadership"], description:"The Trudeau Foundation doctoral scholarship supports exceptional PhD students whose research touches on at least one of the four themes: human rights & dignity, responsible citizenship, Canada and the world, and people and their natural environment.", requirements:"Canadian doctoral program. Research in social sciences or humanities. Demonstrated leadership. Exceptional academic record.", views:720, status:"published", featured:false, appUrl:"https://www.trudeaufoundation.ca" },
  { id:31, slug:"lester-b-pearson-scholarship", title:"Lester B. Pearson International Scholarship", org:"University of Toronto", orgLogo:"LP", orgColor:"#00204E", amount:70000, currency:"CAD", awardType:"Full Funding", deadline:"2026-01-15", country:"Canada", fields:["Any Field"], degrees:["Undergraduate"], tags:["Canada","International","Undergraduate","Toronto"], description:"The Lester B. Pearson International Scholarship program recognizes international students who demonstrate exceptional academic achievement and creativity and who are recognized as leaders within their school.", requirements:"International student (non-Canadian). High school or CEGEP student. Nominated by school. Outstanding academic achievement.", views:2340, status:"published", featured:false, appUrl:"https://future.utoronto.ca/pearson" },

  // ── ASIA ─────────────────────────────────────────────────────────────────
  { id:32, slug:"japanese-government-monbukagakusho", title:"Japanese Government MEXT Scholarship", org:"Ministry of Education, Japan", orgLogo:"MX", orgColor:"#BC002D", amount:14400, currency:"JPY", awardType:"Full Funding", deadline:"2026-05-31", country:"Japan", fields:["Any Field"], degrees:["Undergraduate","Masters","PhD","Research"], tags:["Japan","Government","MEXT","Research"], description:"The Japanese Government (Monbukagakusho/MEXT) Scholarships are offered by the Japanese Government to international students who wish to study at Japanese universities. Full funding including tuition, accommodation and living allowance.", requirements:"Under 35 years for research students. Citizen of eligible country. Good academic record. Japanese or English language.", views:4500, status:"published", featured:true, appUrl:"https://www.mext.go.jp" },
  { id:33, slug:"korean-government-scholarship-gksp", title:"Korean Government Scholarship Program (KGSP)", org:"National Institute for International Education, South Korea", orgLogo:"KG", orgColor:"#003478", amount:18600, currency:"KRW", awardType:"Full Funding", deadline:"2026-03-31", country:"South Korea", fields:["Any Field"], degrees:["Undergraduate","Masters","PhD"], tags:["Korea","Government","NIIED","Full Funding"], description:"The Korean Government Scholarship Program provides scholarships to international students to study at Korean universities for the purpose of enhancing international exchange in education and mutual friendship.", requirements:"Citizen of eligible country. Under 25 years (undergraduate) or 40 years (graduate). Excellent academic record.", views:3800, status:"published", featured:true, appUrl:"https://www.niied.go.kr" },
  { id:34, slug:"chinese-government-scholarship", title:"Chinese Government Scholarship (CSC)", org:"China Scholarship Council", orgLogo:"CG", orgColor:"#DE2910", amount:27000, currency:"CNY", awardType:"Full Funding", deadline:"2026-04-30", country:"China", fields:["Any Field"], degrees:["Undergraduate","Masters","PhD","Language"], tags:["China","CSC","Full Funding","Mandarin"], description:"The Chinese Government Scholarship (CSC) is a full scholarship to study at Chinese universities. Covers tuition, accommodation, living allowance and comprehensive medical insurance.", requirements:"Citizen of eligible country. Under 25 (undergraduate), 35 (Masters), or 40 (PhD). Good health. Academic excellence.", views:5600, status:"published", featured:true, appUrl:"https://www.campuschina.org" },
  { id:35, slug:"singapore-asean-scholarship", title:"Singapore ASEAN Undergraduate Scholarship", org:"Ministry of Education Singapore", orgLogo:"SA", orgColor:"#EF3340", amount:30000, currency:"SGD", awardType:"Full Funding", deadline:"2026-02-28", country:"Singapore", fields:["Any Field"], degrees:["Undergraduate"], tags:["Singapore","ASEAN","Southeast Asia"], description:"The ASEAN Undergraduate Scholarship is awarded to outstanding students from ASEAN countries to pursue an undergraduate degree at one of six autonomous universities in Singapore.", requirements:"Citizen of ASEAN country (except Singapore). Excellent academic results in secondary/high school. Good character and leadership qualities.", views:1780, status:"published", featured:false, appUrl:"https://www.moe.gov.sg" },
  { id:36, slug:"taiwan-icdf-scholarship", title:"Taiwan ICDF International Higher Education Scholarship", org:"Taiwan ICDF", orgLogo:"TW", orgColor:"#FF0000", amount:12000, currency:"USD", awardType:"Full Funding", deadline:"2026-03-31", country:"Taiwan", fields:["Agriculture","Environmental Science","Public Health","Education"], degrees:["Masters","PhD"], tags:["Taiwan","Development","Agriculture","Public Health"], description:"The Taiwan ICDF International Higher Education Scholarship Programme invites students from developing countries to pursue higher education in Taiwan with the aim of cultivating talent for international development.", requirements:"Citizen of eligible developing country. Bachelor's degree. Under 40 years. Relevant work experience preferred.", views:1240, status:"published", featured:false, appUrl:"https://www.icdf.org.tw" },
  { id:37, slug:"aga-khan-scholarship", title:"Aga Khan Foundation International Scholarship", org:"Aga Khan Foundation", orgLogo:"AK", orgColor:"#006633", amount:20000, currency:"USD", awardType:"Full Funding", deadline:"2026-03-31", country:"International", fields:["Development","Public Health","Architecture","Education"], degrees:["Masters"], tags:["Developing Countries","Need-Based","International","Muslim"], description:"The Aga Khan Foundation offers a limited number of scholarships for postgraduate studies to outstanding students from select developing countries who have no other means of financing their studies.", requirements:"Citizen of a developing country. Demonstrated academic excellence. Financial need. Return commitment to home country.", views:1654, status:"published", featured:false, appUrl:"https://www.akdn.org/our-agencies/aga-khan-foundation" },

  // ── AFRICA ────────────────────────────────────────────────────────────────
  { id:38, slug:"mastercard-foundation-scholars", title:"Mastercard Foundation Scholars Program", org:"Mastercard Foundation", orgLogo:"MC", orgColor:"#EB001B", amount:60000, currency:"USD", awardType:"Full Funding", deadline:"2026-02-28", country:"Africa", fields:["Any Field"], degrees:["Undergraduate","Masters"], tags:["Africa","Mastercard","Need-Based","Leadership"], description:"The Mastercard Foundation Scholars Program provides comprehensive scholarships to talented young Africans with demonstrated financial need to access quality secondary and university education.", requirements:"African citizen. Demonstrated financial need. Academic excellence. Leadership potential. Commitment to give back to community.", views:4200, status:"published", featured:true, appUrl:"https://mastercardfdn.org/programs/scholars" },
  { id:39, slug:"african-development-bank-scholarship", title:"African Development Bank Scholarship Program", org:"African Development Bank", orgLogo:"AD", orgColor:"#009B4E", amount:25000, currency:"USD", awardType:"Full Funding", deadline:"2026-01-31", country:"Africa", fields:["Economics","Finance","Engineering","Agriculture"], degrees:["Masters"], tags:["Africa","Development","Economics","Banking"], description:"The AfDB Scholarship Program provides scholarships for African students to pursue Master's-level studies at leading universities in Africa and abroad, with focus on development-related fields.", requirements:"African citizen. Bachelor's degree with minimum 2nd class upper. Under 40 years. Working in development-related field.", views:1890, status:"published", featured:false, appUrl:"https://www.afdb.org/en/topics-and-sectors/initiatives-partnerships/african-development-bank-scholarship-program" },
  { id:40, slug:"great-wall-scholarship-china-africa", title:"Great Wall Scholarship (China-Africa)", org:"Chinese Government & African Union", orgLogo:"GW", orgColor:"#DE2910", amount:18000, currency:"CNY", awardType:"Full Funding", deadline:"2026-04-15", country:"China", fields:["Any Field"], degrees:["Undergraduate","Masters","PhD"], tags:["China","Africa","South-South","Full Funding"], description:"The Great Wall Scholarship is provided under the China-Africa cooperation framework. It enables African students to study in China, fostering educational exchange and South-South cooperation.", requirements:"Citizen of an African country. Under 25 (undergraduate) or 40 (graduate). Good academic record. Health certificate.", views:2100, status:"published", featured:false, appUrl:"https://www.campuschina.org" },
  { id:41, slug:"wits-vice-chancellor-scholarship", title:"Wits Vice-Chancellor's Scholarship", org:"University of the Witwatersrand", orgLogo:"WV", orgColor:"#003087", amount:80000, currency:"ZAR", awardType:"Full Funding", deadline:"2025-10-31", country:"South Africa", fields:["Any Field"], degrees:["Undergraduate"], tags:["South Africa","Academic Excellence","Wits"], description:"The Wits Vice-Chancellor's Scholarship is awarded to the highest-achieving school leavers in South Africa. It covers full tuition, residence and a living allowance.", requirements:"South African citizen or permanent resident. Exceptional matric results (90%+ average). Admission to Wits.", views:1450, status:"published", featured:false, appUrl:"https://www.wits.ac.za" },
  { id:42, slug:"africa-oxford-initiative-scholarship", title:"Africa Oxford Initiative Scholarship", org:"University of Oxford", orgLogo:"AO", orgColor:"#002147", amount:42000, currency:"GBP", awardType:"Full Funding", deadline:"2026-01-22", country:"UK", fields:["Any Field"], degrees:["Masters","PhD"], tags:["Oxford","Africa","UK","Research"], description:"The Africa Oxford Initiative supports talented Africans to pursue postgraduate studies at the University of Oxford, promoting African intellectual leadership and research on African issues.", requirements:"African citizen. Strong academic record. Acceptance to Oxford program. Research interest in Africa-related issues.", views:1680, status:"published", featured:false, appUrl:"https://www.africa.ox.ac.uk" },
  { id:43, slug:"nelson-mandela-scholarship", title:"Nelson Mandela Scholarship", org:"Nelson Mandela Foundation", orgLogo:"NMS", orgColor:"#009A44", amount:15000, currency:"USD", awardType:"Full Funding", deadline:"2026-05-31", country:"South Africa", fields:["Social Sciences","Law","Education","Public Policy"], degrees:["Masters"], tags:["South Africa","Mandela","Social Justice","Leadership"], description:"The Nelson Mandela Scholarship Programme supports exceptional young South Africans to pursue graduate studies, embodying Mandela's values of social justice, education and servant leadership.", requirements:"South African citizen. Bachelor's degree. Under 35 years. Demonstrated commitment to community service.", views:1320, status:"published", featured:false, appUrl:"https://www.nelsonmandela.org" },
  { id:44, slug:"kenya-government-scholarship", title:"Kenya Government Scholarship (Local)", org:"Ministry of Education Kenya", orgLogo:"KE", orgColor:"#006600", amount:2000, currency:"USD", awardType:"Partial Funding", deadline:"2026-06-30", country:"Kenya", fields:["Any Field"], degrees:["Undergraduate"], tags:["Kenya","Government","Local","East Africa"], description:"The Government of Kenya offers scholarships to bright Kenyan students who scored highly in the Kenya Certificate of Secondary Education (KCSE) but lack financial means to attend university.", requirements:"Kenyan citizen. Strong KCSE results. Financial need. Accepted to a Kenyan university.", views:3400, status:"published", featured:false, appUrl:"https://www.education.go.ke" },
  { id:45, slug:"ethiopian-higher-education-scholarship", title:"Ethiopian Higher Education Scholarship", org:"Ministry of Education Ethiopia", orgLogo:"ET", orgColor:"#078930", amount:1500, currency:"USD", awardType:"Partial Funding", deadline:"2026-07-15", country:"Ethiopia", fields:["Any Field"], degrees:["Undergraduate"], tags:["Ethiopia","Government","East Africa","Need-Based"], description:"The Ethiopian government provides scholarships to academically excellent students from low-income families to access higher education at public universities across Ethiopia.", requirements:"Ethiopian citizen. Excellent secondary school results. Demonstrated financial need.", views:2100, status:"published", featured:false, appUrl:"https://www.moe.gov.et" },
  { id:46, slug:"ghana-scholarship-secretariat", title:"Ghana Scholarship Secretariat Award", org:"Ghana Scholarship Secretariat", orgLogo:"GS", orgColor:"#006B3F", amount:5000, currency:"USD", awardType:"Partial Funding", deadline:"2026-05-31", country:"Ghana", fields:["Any Field"], degrees:["Undergraduate","Masters"], tags:["Ghana","West Africa","Government"], description:"The Ghana Scholarship Secretariat administers various local and foreign scholarships for Ghanaian students to pursue education at both local and international institutions.", requirements:"Ghanaian citizen. Strong academic record. Specific criteria vary per scholarship type.", views:1870, status:"published", featured:false, appUrl:"https://scholarshipgh.com" },
  { id:47, slug:"nigerian-federal-scholarship", title:"Nigerian Federal Government Scholarship", org:"Federal Government of Nigeria", orgLogo:"NF", orgColor:"#008751", amount:3000, currency:"USD", awardType:"Partial Funding", deadline:"2026-06-30", country:"Nigeria", fields:["Any Field"], degrees:["Undergraduate","Masters"], tags:["Nigeria","Government","West Africa","Federal"], description:"The Federal Government of Nigeria provides scholarships to support Nigerian students at both undergraduate and postgraduate levels, both locally and abroad.", requirements:"Nigerian citizen. Minimum 5 credit passes in WAEC/NECO including Mathematics and English. Admitted to recognized institution.", views:4100, status:"published", featured:false, appUrl:"https://www.scholarshipboard.org" },

  // ── MIDDLE EAST ──────────────────────────────────────────────────────────
  { id:48, slug:"kuwait-government-scholarship", title:"Kuwait Government Scholarship", org:"Kuwait Cultural Office", orgLogo:"KW", orgColor:"#007A3D", amount:20000, currency:"KWD", awardType:"Full Funding", deadline:"2026-05-31", country:"Kuwait", fields:["Any Field"], degrees:["Undergraduate","Masters","PhD"], tags:["Kuwait","Middle East","Gulf","Full Funding"], description:"The Kuwait Government Scholarship offers full funding for Kuwaiti nationals to pursue higher education at leading international universities, covering tuition, living expenses and travel.", requirements:"Kuwaiti national. Excellent secondary school results. Accepted to recognized international university.", views:1120, status:"published", featured:false, appUrl:"https://www.moe.edu.kw" },
  { id:49, slug:"abu-dhabi-crown-prince-scholarship", title:"Abu Dhabi Crown Prince's Scholarship", org:"Crown Prince Court – Abu Dhabi", orgLogo:"CP", orgColor:"#009A44", amount:50000, currency:"AED", awardType:"Full Funding", deadline:"2026-04-30", country:"UAE", fields:["Engineering","Medicine","Technology","Business"], degrees:["Undergraduate","Masters"], tags:["UAE","Abu Dhabi","Gulf","Excellence"], description:"The Abu Dhabi Crown Prince's Scholarship is awarded to exceptional Emirati students to study at the world's top universities, building human capital for the UAE's vision of the future.", requirements:"Emirati national. Exceptional academic record. Accepted to top-ranked international university.", views:980, status:"published", featured:false, appUrl:"https://www.cpc.gov.ae" },
  { id:50, slug:"sultan-qaboos-scholarship-oman", title:"Sultan Qaboos Scholarship (Oman)", org:"Ministry of Higher Education, Oman", orgLogo:"SQ", orgColor:"#DB161B", amount:15000, currency:"OMR", awardType:"Full Funding", deadline:"2026-07-01", country:"Oman", fields:["Any Field"], degrees:["Undergraduate","Masters","PhD"], tags:["Oman","Gulf","Middle East","Government"], description:"Sultan Qaboos scholarships support Omani nationals in pursuing higher education abroad, contributing to the development of qualified human resources for Oman's national development.", requirements:"Omani national. Strong academic record. Accepted to recognized international university.", views:890, status:"published", featured:false, appUrl:"https://www.mohe.gov.om" },

  // ── LATIN AMERICA ────────────────────────────────────────────────────────
  { id:51, slug:"brazil-cnpq-fellowship", title:"CNPq Research Fellowships Brazil", org:"National Research Council of Brazil", orgLogo:"CN", orgColor:"#009C3B", amount:8000, currency:"BRL", awardType:"Stipend", deadline:"2026-06-30", country:"Brazil", fields:["STEM","Agriculture","Health","Technology"], degrees:["PhD","Postdoc","Research"], tags:["Brazil","Research","STEM","Latin America"], description:"CNPq (National Council for Scientific and Technological Development) offers research fellowships to talented researchers in Brazil and abroad to advance scientific knowledge.", requirements:"Demonstrated research excellence. Affiliation with Brazilian university or research institution. Specific requirements per fellowship type.", views:1230, status:"published", featured:false, appUrl:"https://www.cnpq.br" },
  { id:52, slug:"oea-scholarship-oas", title:"OAS Academic Scholarship Program", org:"Organization of American States", orgLogo:"OA", orgColor:"#005A9C", amount:12000, currency:"USD", awardType:"Partial Funding", deadline:"2026-03-31", country:"Americas", fields:["Any Field"], degrees:["Masters","PhD"], tags:["Americas","Latin America","OAS","Development"], description:"The OAS Academic Scholarship Program is one of the oldest and most prestigious scholarship programs in the Americas, supporting professional development of human resources in member states.", requirements:"Citizen of OAS member state. Bachelor's degree. Under 45 years. Language proficiency in language of study.", views:1560, status:"published", featured:false, appUrl:"https://www.oas.org/en/scholarships" },

  // ── GLOBAL / INTERNATIONAL ────────────────────────────────────────────────
  { id:53, slug:"world-bank-scholarship-jj-wbg", title:"World Bank Scholarship Program (JJ/WBG)", org:"World Bank Group", orgLogo:"WB", orgColor:"#009FDA", amount:25000, currency:"USD", awardType:"Full Funding", deadline:"2026-04-30", country:"International", fields:["Economics","Public Policy","Development","Finance"], degrees:["Masters"], tags:["World Bank","Development","Economics","International"], description:"The Joint Japan/World Bank Graduate Scholarship Program (JJ/WBGSP) is for mid-career professionals from developing countries working in development-related fields who want to pursue a Master's degree.", requirements:"Citizen of World Bank member developing country. Age 45 or under. Minimum 3 years relevant development experience. Accepted to a partner university.", views:2340, status:"published", featured:false, appUrl:"https://www.worldbank.org/scholarships" },
  { id:54, slug:"rotary-peace-fellowship", title:"Rotary Peace Fellowships", org:"Rotary Foundation", orgLogo:"RP", orgColor:"#17458F", amount:75000, currency:"USD", awardType:"Full Funding", deadline:"2025-11-15", country:"International", fields:["Peace Studies","International Relations","Social Sciences","Public Health"], degrees:["Masters"], tags:["Peace","International","Rotary","Leadership"], description:"Rotary Peace Fellowships enable outstanding individuals to become effective peace and development leaders. Fellows study at one of six Rotary Peace Centers at partner universities worldwide.", requirements:"3 years work experience in peace and development. Excellent English. Bachelor's degree. Strong leadership record. Willingness to work across cultures.", views:1870, status:"published", featured:true, appUrl:"https://www.rotary.org/en/our-programs/peace-fellowships" },
  { id:55, slug:"ford-foundation-fellowship", title:"Ford Foundation Predoctoral Fellowship", org:"Ford Foundation", orgLogo:"FF", orgColor:"#003087", amount:27000, currency:"USD", awardType:"Partial Funding", deadline:"2025-12-18", country:"USA", fields:["Any Field"], degrees:["PhD"], tags:["Diversity","USA","Research","Underrepresented"], description:"The Ford Foundation Fellowship Programs seek to increase the diversity of the nation's college and university faculties by increasing their ethnic and racial diversity, to maximize their educational benefits.", requirements:"U.S. citizen or national. Commitment to a career in teaching and research. Member of underrepresented group. Enrolled in PhD program.", views:1120, status:"published", featured:false, appUrl:"https://sites.nationalacademies.org/PGA/FordFellowships" },
  { id:56, slug:"un-women-scholarship", title:"UN Women Scholarship for Equality and Empowerment", org:"UN Women", orgLogo:"UN", orgColor:"#009EDB", amount:15000, currency:"USD", awardType:"Partial Funding", deadline:"2026-03-31", country:"International", fields:["Gender Studies","Law","Public Policy","Social Sciences"], degrees:["Masters"], tags:["Women","UN","Gender Equality","International"], description:"UN Women scholarships support women from developing countries to pursue Master's-level studies in gender, law, governance and related fields that advance women's rights and empowerment.", requirements:"Female. Citizen of developing country. Bachelor's degree. Commitment to gender equality work. Under 40 years.", views:1670, status:"published", featured:false, appUrl:"https://www.unwomen.org" },
  { id:57, slug:"opec-fund-scholarship", title:"OPEC Fund Scholarship", org:"OPEC Fund for International Development", orgLogo:"OF", orgColor:"#00538C", amount:20000, currency:"USD", awardType:"Full Funding", deadline:"2026-04-30", country:"International", fields:["Engineering","Economics","Development","Environment"], degrees:["Masters","PhD"], tags:["OPEC","Development","International","Energy"], description:"The OPEC Fund Scholarship supports students from developing countries who wish to pursue postgraduate studies in fields related to development, economics, engineering and sustainability.", requirements:"Citizen of an eligible developing country. Strong academic record. Under 35 years. Studying development-related field.", views:890, status:"published", featured:false, appUrl:"https://opecfund.org" },
  { id:58, slug:"isdb-scholarship-islamic-development-bank", title:"IsDB Merit Scholarship", org:"Islamic Development Bank", orgLogo:"ID", orgColor:"#006B3F", amount:18000, currency:"USD", awardType:"Full Funding", deadline:"2026-03-31", country:"International", fields:["Science","Technology","Engineering","Medicine"], degrees:["Masters","PhD"], tags:["Islamic Development Bank","OIC Countries","STEM","Merit"], description:"The Islamic Development Bank (IsDB) Merit Scholarship for High Technology Programme aims to develop human capital in OIC member countries in critical areas of science and technology.", requirements:"Citizen of IsDB member country. Under 35 years (Masters) or 40 years (PhD). Excellent academic record. Studying STEM field.", views:2100, status:"published", featured:false, appUrl:"https://www.isdb.org/scholarship" },
  { id:59, slug:"emu-scholarship-eastern-mediterranean", title:"Eastern Mediterranean University Scholarship", org:"Eastern Mediterranean University", orgLogo:"EM2", orgColor:"#003087", amount:8000, currency:"USD", awardType:"Partial Funding", deadline:"2026-06-30", country:"Cyprus", fields:["Any Field"], degrees:["Undergraduate","Masters","PhD"], tags:["Cyprus","Mediterranean","International","Merit"], description:"Eastern Mediterranean University in Cyprus offers merit-based scholarships to outstanding international students from around the world, covering partial tuition reduction.", requirements:"Strong academic record. Accepted to EMU. Non-Cypriot international student.", views:1230, status:"published", featured:false, appUrl:"https://www.emu.edu.tr" },
  { id:60, slug:"agcas-graduate-scholarship", title:"ADB–Japan Scholarship Program", org:"Asian Development Bank", orgLogo:"AJ", orgColor:"#E60012", amount:20000, currency:"USD", awardType:"Full Funding", deadline:"2026-01-31", country:"Japan", fields:["Economics","Business","Science","Technology"], degrees:["Masters"], tags:["ADB","Japan","Asia","Development"], description:"The ADB–Japan Scholarship Program provides scholarships for citizens of ADB's developing member countries to pursue postgraduate studies at designated academic institutions in the Asia and Pacific region.", requirements:"Citizen of ADB developing member country. Bachelor's degree. Work experience in development-related organization. Under 35 years.", views:1780, status:"published", featured:false, appUrl:"https://www.adb.org/work-with-us/careers/japan-scholarship-program" },

  // ── WOMEN & SPECIFIC GROUPS ───────────────────────────────────────────────
  { id:61, slug:"lwe-scholarship-women-engineering", title:"Society of Women Engineers Scholarship", org:"Society of Women Engineers (SWE)", orgLogo:"SW", orgColor:"#C10230", amount:17000, currency:"USD", awardType:"Partial Funding", deadline:"2026-02-15", country:"USA", fields:["Engineering","Technology","Computer Science"], degrees:["Undergraduate","Graduate"], tags:["Women","Engineering","STEM","USA"], description:"SWE offers scholarships to female-identifying students studying engineering, engineering technology, and computer science. Over 260 scholarships valued at over $1 million are awarded annually.", requirements:"Female-identifying student. Enrolled in ABET-accredited engineering program or computer science program. Minimum 3.0 GPA.", views:1560, status:"published", featured:false, appUrl:"https://scholarships.swe.org" },
  { id:62, slug:"punto-cielo-scholarships-women", title:"Cartier Women's Initiative Fellowship", org:"Cartier", orgLogo:"CW", orgColor:"#B5221B", amount:100000, currency:"USD", awardType:"Grant", deadline:"2026-06-30", country:"International", fields:["Business","Entrepreneurship","Social Impact"], degrees:["Any"], tags:["Women","Entrepreneurship","Social Impact","International"], description:"The Cartier Women's Initiative is an international entrepreneurship program to recognize and support women-run and women-owned impact-driven businesses around the world.", requirements:"Female founder. Impact-driven business. At early stage. Willing to be coached and mentored.", views:1230, status:"published", featured:false, appUrl:"https://www.cartierwomensinitiative.com" },
  { id:63, slug:"l-oreal-unesco-women-science", title:"L'Oréal-UNESCO For Women in Science Awards", org:"L'Oréal Foundation & UNESCO", orgLogo:"LU", orgColor:"#C60C30", amount:60000, currency:"USD", awardType:"Grant", deadline:"2026-03-31", country:"International", fields:["Biology","Chemistry","Physics","Mathematics","Computer Science"], degrees:["PhD","Postdoc"], tags:["Women","Science","UNESCO","International"], description:"The L'Oréal-UNESCO For Women in Science International Awards recognize, reward and support eminent women researchers who have contributed to scientific progress.", requirements:"Female researcher. PhD in natural sciences or mathematics. Outstanding contributions to research. Nominated by scientific institution.", views:1890, status:"published", featured:false, appUrl:"https://www.forwomeninscience.com" },

  // ── STEM SPECIFIC ─────────────────────────────────────────────────────────
  { id:64, slug:"nasa-scholarship-aeronautics", title:"NASA Aeronautics Scholarship and Advanced STEM Training", org:"NASA", orgLogo:"NA", orgColor:"#FC3D21", amount:15000, currency:"USD", awardType:"Partial Funding", deadline:"2026-03-01", country:"USA", fields:["Aerospace","Engineering","Physics","Computer Science"], degrees:["Undergraduate","Graduate"], tags:["NASA","Aerospace","STEM","USA"], description:"NASA's Aeronautics Scholarship and Advanced STEM Training and Research (ASTAR) Fellowship Program supports and trains U.S. citizens and residents who plan to pursue careers in aeronautics.", requirements:"U.S. citizen or permanent resident. Enrolled in science or engineering program. Strong academic record. Interest in aeronautics.", views:2100, status:"published", featured:false, appUrl:"https://www.nasa.gov/stem" },
  { id:65, slug:"barry-goldwater-scholarship", title:"Barry Goldwater Scholarship", org:"Barry Goldwater Scholarship Foundation", orgLogo:"BG2", orgColor:"#1B3A6B", amount:7500, currency:"USD", awardType:"Partial Funding", deadline:"2026-01-25", country:"USA", fields:["Mathematics","Natural Sciences","Engineering"], degrees:["Undergraduate"], tags:["STEM","Research","USA","Science"], description:"The Barry Goldwater Scholarship is the premier undergraduate award in the natural sciences, mathematics, and engineering in the United States. It supports students planning research careers in these fields.", requirements:"U.S. citizen or permanent resident. College sophomore or junior. Plans to pursue research career in STEM. Outstanding academic achievement.", views:1340, status:"published", featured:false, appUrl:"https://goldwater.scholarsapply.org" },
  { id:66, slug:"intel-science-talent-search", title:"Regeneron Science Talent Search", org:"Society for Science & Regeneron", orgLogo:"RS", orgColor:"#00A3E0", amount:250000, currency:"USD", awardType:"Grant", deadline:"2025-11-12", country:"USA", fields:["Science","Engineering","Mathematics"], degrees:["Undergraduate"], tags:["STEM","High School","Science","Research"], description:"The Regeneron Science Talent Search is America's oldest and most prestigious science and mathematics competition for high school seniors. Finalists receive awards totaling over $1.8 million.", requirements:"High school senior in the U.S. Original research project. Must be enrolled in a U.S. high school.", views:2560, status:"published", featured:false, appUrl:"https://www.societyforscience.org/regeneron-sts" },

  // ── ARTS & HUMANITIES ─────────────────────────────────────────────────────
  { id:67, slug:"mellon-foundation-arts-scholarship", title:"Mellon Undergraduate Curatorial Fellowship", org:"Andrew W. Mellon Foundation", orgLogo:"AF", orgColor:"#1B365D", amount:10000, currency:"USD", awardType:"Partial Funding", deadline:"2026-02-01", country:"USA", fields:["Arts","Art History","Museum Studies","Humanities"], degrees:["Undergraduate"], tags:["Arts","Museums","Humanities","USA"], description:"The Mellon Foundation supports undergraduate fellowships in the arts and humanities, particularly in museum curation, art history and cultural preservation. Fellows work with major museum collections.", requirements:"Enrolled undergraduate at partner institution. Interest in museum/curatorial work. Specific requirements vary by partner.", views:780, status:"published", featured:false, appUrl:"https://mellon.org" },
  { id:68, slug:"artlink-creative-arts-award", title:"Artlink International Arts Scholarship", org:"Artlink Australia", orgLogo:"AL", orgColor:"#F7941D", amount:5000, currency:"AUD", awardType:"Grant", deadline:"2026-04-30", country:"Australia", fields:["Arts","Visual Arts","Performing Arts","Media"], degrees:["Any"], tags:["Arts","Creative","Australia","International"], description:"Artlink supports outstanding artists and arts practitioners from Australia and the Asia-Pacific to undertake international residencies, study and professional development.", requirements:"Australian artist or arts practitioner. Demonstrated artistic achievement. Clear project proposal.", views:670, status:"published", featured:false, appUrl:"https://www.artlink.com.au" },

  // ── BUSINESS & ECONOMICS ─────────────────────────────────────────────────
  { id:69, slug:"insead-henry-tanaka-scholarship", title:"INSEAD Scholarship for Excellence", org:"INSEAD Business School", orgLogo:"IN", orgColor:"#003087", amount:35000, currency:"EUR", awardType:"Partial Funding", deadline:"2026-05-15", country:"France", fields:["Business","MBA","Management"], degrees:["MBA","Masters"], tags:["Business","MBA","INSEAD","Excellence"], description:"INSEAD offers merit scholarships to the most outstanding candidates admitted to its MBA program. Awards recognize academic excellence, professional achievement and leadership potential.", requirements:"Acceptance to INSEAD MBA program. Exceptional GMAT score. Strong professional background. Leadership qualities.", views:1450, status:"published", featured:false, appUrl:"https://www.insead.edu/mba/financial-aid" },
  { id:70, slug:"cfa-institute-scholarship", title:"CFA Institute Access Scholarship", org:"CFA Institute", orgLogo:"CF2", orgColor:"#003087", amount:1000, currency:"USD", awardType:"Partial Funding", deadline:"2026-09-16", country:"International", fields:["Finance","Economics","Investment"], degrees:["Any"], tags:["Finance","CFA","Investment","International"], description:"The CFA Institute Access Scholarship reduces the CFA Program enrollment and exam fees for qualified candidates who demonstrate financial need, making the CFA credential accessible to more people.", requirements:"Demonstrated financial need. Commitment to CFA Program. Open to all nationalities.", views:2340, status:"published", featured:false, appUrl:"https://www.cfainstitute.org/access-scholarship" },

  // ── MEDICAL / HEALTH ─────────────────────────────────────────────────────
  { id:71, slug:"wellcome-trust-biomedical-phd", title:"Wellcome Trust Biomedical PhD Studentships", org:"Wellcome Trust", orgLogo:"WB2", orgColor:"#E30613", amount:28000, currency:"GBP", awardType:"Full Funding", deadline:"2026-03-31", country:"UK", fields:["Medicine","Biology","Neuroscience","Immunology"], degrees:["PhD"], tags:["Medical","Biomedical","UK","Research"], description:"Wellcome funds PhD studentships through its Training Fellowships and Wellcome-funded programmes at universities. Fellows tackle fundamental biomedical questions that advance human health.", requirements:"Open to all nationalities. Strong undergraduate degree in life sciences. Research interest in biomedical field. Apply through Wellcome-funded institutions.", views:1560, status:"published", featured:false, appUrl:"https://wellcome.org/grant-funding/schemes/phd-training-fellowships" },
  { id:72, slug:"bmgf-global-health-fellowship", title:"Bill & Melinda Gates Foundation Global Health Fellowship", org:"Bill & Melinda Gates Foundation", orgLogo:"BG3", orgColor:"#0078D4", amount:45000, currency:"USD", awardType:"Full Funding", deadline:"2026-02-01", country:"International", fields:["Global Health","Public Health","Medicine","Development"], degrees:["Graduate","Postdoc"], tags:["Global Health","Gates","International","Public Health"], description:"The Gates Foundation Global Health Fellows program places professionals in short-term assignments with global health organizations in developing countries, building capacity and sharing expertise.", requirements:"Health professional or researcher. Relevant advanced degree. 5+ years of professional experience. Open to all nationalities.", views:1870, status:"published", featured:false, appUrl:"https://www.gatesfoundation.org" },
  { id:73, slug:"fogarty-international-center-nih", title:"NIH Fogarty International Scholarship", org:"National Institutes of Health (NIH)", orgLogo:"FI", orgColor:"#006BB6", amount:32000, currency:"USD", awardType:"Full Funding", deadline:"2026-01-07", country:"USA", fields:["Global Health","Medicine","Research","Epidemiology"], degrees:["PhD","Postdoc","Research"], tags:["NIH","Global Health","USA","Medical Research"], description:"The Fogarty International Center at NIH supports and facilitates global health research by U.S. and international investigators, builds partnerships between health research institutions, and trains the next generation of scientists.", requirements:"U.S. citizen or permanent resident (for some programs). Graduate students or postdoctoral researchers. Strong academic record in health sciences.", views:1120, status:"published", featured:false, appUrl:"https://www.fic.nih.gov" },

  // ── ENVIRONMENT & SUSTAINABILITY ──────────────────────────────────────────
  { id:74, slug:"unep-fellowship-environment", title:"UNEP Young Champions of the Earth", org:"UN Environment Programme", orgLogo:"UE", orgColor:"#009B77", amount:15000, currency:"USD", awardType:"Grant", deadline:"2026-07-31", country:"International", fields:["Environment","Sustainability","Climate Change","Green Energy"], degrees:["Any"], tags:["Environment","UN","Youth","Sustainability"], description:"The UNEP Young Champions of the Earth prize selects six young people with big ideas for the planet each year, providing them with seed funding, mentoring and a platform to develop their environmental solutions.", requirements:"Age 18-30. Visionary idea addressing environmental challenge. Commitment to environmental action. Open to all nationalities.", views:1780, status:"published", featured:false, appUrl:"https://www.unep.org/youngchampions" },
  { id:75, slug:"climate-reality-scholarship", title:"Climate Reality Project Scholarship", org:"The Climate Reality Project", orgLogo:"CR", orgColor:"#00A86B", amount:5000, currency:"USD", awardType:"Partial Funding", deadline:"2026-04-30", country:"International", fields:["Environment","Climate Science","Communications","Policy"], degrees:["Undergraduate","Graduate"], tags:["Climate","Environment","Youth","Advocacy"], description:"The Climate Reality Project offers scholarships to students passionate about climate communication and action, supporting the development of future climate leaders.", requirements:"Passion for climate action. Enrolled student. Strong writing ability. Demonstrated commitment to environmental issues.", views:1230, status:"published", featured:false, appUrl:"https://www.climaterealityproject.org" },

  // ── JOURNALISM & MEDIA ────────────────────────────────────────────────────
  { id:76, slug:"reuters-journalism-scholarship", title:"Reuters Institute Journalism Fellowship", org:"Reuters Institute, University of Oxford", orgLogo:"RJ", orgColor:"#FF8000", amount:12000, currency:"GBP", awardType:"Full Funding", deadline:"2026-02-01", country:"UK", fields:["Journalism","Media","Communications"], degrees:["Professional","Research"], tags:["Journalism","Oxford","Media","International"], description:"The Reuters Institute for the Study of Journalism at Oxford offers fellowships for senior journalists, editors and media executives from around the world to study, research and debate issues facing journalism.", requirements:"At least 5 years of professional journalism experience. Working journalist or editor. Strong research proposal.", views:890, status:"published", featured:false, appUrl:"https://reutersinstitute.politics.ox.ac.uk/fellowships" },
  { id:77, slug:"knight-journalism-fellowship-stanford", title:"Knight Journalism Fellowship at Stanford", org:"Stanford University", orgLogo:"KJ", orgColor:"#8C1515", amount:75000, currency:"USD", awardType:"Full Funding", deadline:"2026-01-31", country:"USA", fields:["Journalism","Technology","Media","Communications"], tags:["Journalism","Stanford","Media","Technology"], degrees:["Professional","Graduate"], description:"The Knight Journalism Fellowship at Stanford University offers mid-career journalists a year of exploration in areas such as technology, medicine, the environment, politics and economics.", requirements:"At least 7 years of journalism experience. Mid-career professional. Strong project proposal. Open to international journalists.", views:780, status:"published", featured:false, appUrl:"https://jsk.stanford.edu" },

  // ── LAW ───────────────────────────────────────────────────────────────────
  { id:78, slug:"grotius-international-law-scholarship", title:"Grotius Scholarship in International Law", org:"American Society of International Law", orgLogo:"GR", orgColor:"#003087", amount:8000, currency:"USD", awardType:"Partial Funding", deadline:"2026-03-01", country:"USA", fields:["Law","International Law","Human Rights"], degrees:["Graduate","LLM"], tags:["Law","International Law","LLM","USA"], description:"The Grotius Scholarship enables outstanding law graduates from developing countries to attend summer programs in international law at accredited U.S. universities.", requirements:"Law degree from developing country. Strong academic record in law. Demonstrated interest in international law.", views:670, status:"published", featured:false, appUrl:"https://www.asil.org" },

  // ── PEACE & DIPLOMACY ─────────────────────────────────────────────────────
  { id:79, slug:"us-institute-of-peace-jennings-scholarship", title:"Jennings Randolph Peace Scholarship", org:"U.S. Institute of Peace", orgLogo:"JP", orgColor:"#003087", amount:40000, currency:"USD", awardType:"Full Funding", deadline:"2025-10-31", country:"USA", fields:["Peace Studies","International Relations","Conflict Resolution","Law"], degrees:["PhD","Senior Fellow"], tags:["Peace","Diplomacy","Conflict","USA"], description:"The Jennings Randolph Senior Fellowship Award supports scholars and practitioners to pursue research and education in the field of international peace and conflict resolution at the USIP.", requirements:"Senior scholars, practitioners or journalists. Outstanding record in peace and security field. Proposed research relevant to USIP mission.", views:560, status:"published", featured:false, appUrl:"https://www.usip.org/grants-fellowships/fellowships" },

  // ── SPORT & CULTURE ───────────────────────────────────────────────────────
  { id:80, slug:"ioc-olympic-solidarity-scholarship", title:"Olympic Solidarity Scholarship", org:"International Olympic Committee", orgLogo:"IO", orgColor:"#0085C7", amount:18000, currency:"USD", awardType:"Stipend", deadline:"2026-06-30", country:"International", fields:["Sports Science","Physical Education","Coaching"], degrees:["Undergraduate","Graduate","Professional"], tags:["Olympics","Sports","IOC","International"], description:"Olympic Solidarity scholarships provide financial support to athletes from National Olympic Committees with limited resources, enabling them to prepare for the Olympic Games and competitions.", requirements:"Athlete from eligible National Olympic Committee. Demonstrated sporting achievement. Nominated by national Olympic committee.", views:2100, status:"published", featured:false, appUrl:"https://www.olympic.org/olympic-solidarity" },

  // ── AFRICA INCLUSIVE SCHOLARSHIPS ─────────────────────────────────────────
  { id:81, slug:"mott-foundation-africa-scholarship", title:"Charles Stewart Mott Foundation African Scholarship", org:"Charles Stewart Mott Foundation", orgLogo:"CM", orgColor:"#005A8E", amount:22000, currency:"USD", awardType:"Full Funding", deadline:"2026-04-30", country:"Africa", fields:["Civil Society","Education","Environment","Poverty"], degrees:["Masters","PhD"], tags:["Africa","Civil Society","Philanthropy","Development"], description:"The Mott Foundation supports African scholars pursuing graduate studies in civil society, education reform, environment and poverty alleviation, recognizing Africa's unique development challenges and opportunities.", requirements:"African citizen. Strong academic record. Commitment to civil society work. Demonstrated community impact.", views:1120, status:"published", featured:false, appUrl:"https://www.mott.org" },
  { id:82, slug:"african-union-scholarship", title:"African Union Scholarship Programme", org:"African Union Commission", orgLogo:"AU2", orgColor:"#009A44", amount:15000, currency:"USD", awardType:"Full Funding", deadline:"2026-05-31", country:"Africa", fields:["Any Field"], degrees:["Masters","PhD"], tags:["African Union","Pan-African","Integration","Leadership"], description:"The African Union Scholarship Programme supports talented young Africans to pursue postgraduate studies at African universities, promoting Pan-African unity, integration and the development of an African knowledge economy.", requirements:"African Union member state citizen. Under 40 years. Strong academic record. Commitment to Pan-African development.", views:2400, status:"published", featured:true, appUrl:"https://au.int/en/education" },
  { id:83, slug:"intra-africa-academic-mobility", title:"Intra-Africa Academic Mobility Scheme", org:"European Union & African Higher Education Institutions", orgLogo:"IA", orgColor:"#003399", amount:12000, currency:"EUR", awardType:"Full Funding", deadline:"2026-03-15", country:"Africa", fields:["Any Field"], degrees:["Masters","PhD","Staff Mobility"], tags:["Africa","Mobility","EU","Higher Education"], description:"The Intra-Africa Academic Mobility Scheme promotes South-South academic mobility within Africa, allowing students and staff to study or teach at universities in other African countries, strengthening African higher education.", requirements:"Enrolled at participating African university. Strong academic record. Apply through your home institution.", views:1650, status:"published", featured:false, appUrl:"https://www.aau.org" },
  { id:84, slug:"awdf-women-scholarship-africa", title:"African Women's Development Fund Scholarship", org:"African Women's Development Fund", orgLogo:"AW", orgColor:"#D4006A", amount:8000, currency:"USD", awardType:"Partial Funding", deadline:"2026-06-30", country:"Africa", fields:["Gender Studies","Law","Health","Development","Education"], degrees:["Masters","PhD"], tags:["African Women","Feminism","Development","Gender"], description:"AWDF supports African women scholars pursuing postgraduate studies in fields that advance women's rights, gender equality and women-led development across Africa.", requirements:"African woman. Undergraduate degree. Commitment to feminist and women's rights agenda. Under 45 years.", views:1890, status:"published", featured:false, appUrl:"https://www.awdf.org" },
  { id:85, slug:"east-african-community-scholarship", title:"East African Community Scholarship", org:"East African Community Secretariat", orgLogo:"EA", orgColor:"#006B3F", amount:10000, currency:"USD", awardType:"Partial Funding", deadline:"2026-04-15", country:"East Africa", fields:["Integration Studies","Economics","Law","Science"], degrees:["Undergraduate","Masters"], tags:["East Africa","EAC","Regional Integration","Kenya","Uganda","Tanzania"], description:"The EAC Scholarship supports citizens of East African Community partner states — Kenya, Uganda, Tanzania, Rwanda, Burundi, South Sudan and DRC — to pursue studies that promote regional integration.", requirements:"Citizen of EAC partner state. Strong academic record. Studies relevant to EAC integration. Under 35 years.", views:1430, status:"published", featured:false, appUrl:"https://www.eac.int" },
  { id:86, slug:"ecowas-scholarship-west-africa", title:"ECOWAS Scholarship Award", org:"Economic Community of West African States", orgLogo:"EC", orgColor:"#009B3A", amount:8500, currency:"USD", awardType:"Partial Funding", deadline:"2026-05-01", country:"West Africa", fields:["Any Field"], degrees:["Undergraduate","Masters"], tags:["West Africa","ECOWAS","Regional","Integration"], description:"ECOWAS scholarships are awarded to citizens of member states to pursue undergraduate or postgraduate studies at institutions within the ECOWAS region, promoting West African unity and human development.", requirements:"Citizen of ECOWAS member state. Excellent academic results. Commitment to regional development.", views:1780, status:"published", featured:false, appUrl:"https://www.ecowas.int" },
  { id:87, slug:"sadc-scholarship-southern-africa", title:"SADC Scholarship and Training Awards", org:"Southern African Development Community", orgLogo:"SD", orgColor:"#007A5E", amount:12000, currency:"USD", awardType:"Partial Funding", deadline:"2026-04-30", country:"Southern Africa", fields:["Agriculture","Engineering","Health","Education"], degrees:["Masters","PhD"], tags:["Southern Africa","SADC","Regional","Development"], description:"SADC Training and Scholarships Scheme provides awards for citizens of SADC member states to pursue postgraduate training in priority areas aligned with the SADC Regional Indicative Strategic Development Plan.", requirements:"Citizen of SADC member state. Bachelor's degree. Studies in SADC priority sectors. Commitment to return home.", views:1230, status:"published", featured:false, appUrl:"https://www.sadc.int" },
  { id:88, slug:"mtn-foundation-scholarship", title:"MTN Foundation Scholarship", org:"MTN Foundation", orgLogo:"MT", orgColor:"#FFCC00", amount:5000, currency:"USD", awardType:"Partial Funding", deadline:"2026-07-31", country:"Africa", fields:["STEM","Business","ICT","Engineering"], degrees:["Undergraduate"], tags:["MTN","Africa","Corporate","STEM","Technology"], description:"The MTN Foundation Scholarship supports bright young Africans in STEM and business fields, recognizing that Africa's digital future depends on developing homegrown talent in technology and innovation.", requirements:"Citizen of MTN operating country in Africa. Strong academic results. Financial need. Enrolled in accredited institution.", views:3200, status:"published", featured:true, appUrl:"https://www.mtn.com/foundation" },
  { id:89, slug:"dangote-foundation-scholarship", title:"Aliko Dangote Foundation Scholarship", org:"Aliko Dangote Foundation", orgLogo:"DF", orgColor:"#E8301B", amount:4000, currency:"USD", awardType:"Partial Funding", deadline:"2026-06-30", country:"Nigeria", fields:["Business","Engineering","Agriculture","Health"], degrees:["Undergraduate","Masters"], tags:["Nigeria","Dangote","Africa","Corporate","Food Security"], description:"The Aliko Dangote Foundation Scholarship supports Nigerian and African students pursuing studies in areas critical to Africa's food security, industrialization and health, reflecting the Foundation's mission to alleviate suffering.", requirements:"Nigerian citizen (priority) or African national. Strong academic record. Studying priority field. Financial need demonstrated.", views:2890, status:"published", featured:false, appUrl:"https://www.dangote.com/foundation" },
  { id:90, slug:"equity-bank-foundation-scholarship", title:"Equity Bank Foundation Wings to Fly Scholarship", org:"Equity Bank Foundation", orgLogo:"EB", orgColor:"#E31B23", amount:3500, currency:"USD", awardType:"Full Funding", deadline:"2026-03-31", country:"Kenya", fields:["Any Field"], degrees:["Undergraduate"], tags:["Kenya","Wings to Fly","Need-Based","Secondary","East Africa"], description:"Wings to Fly is one of Africa's largest scholarship programs, providing holistic scholarships to brilliant but disadvantaged Kenyan students from Form 1 to university, covering fees, accommodation, meals and mentorship.", requirements:"Kenyan citizen. Brilliant but financially disadvantaged. Strong primary school performance. Selected through district vetting.", views:4500, status:"published", featured:true, appUrl:"https://www.equitygroupfoundation.com/wingstofly" },
  { id:91, slug:"stanbic-scholarship-africa", title:"Stanbic Bank Africa Scholarship", org:"Stanbic Bank / Standard Bank Group", orgLogo:"SB", orgColor:"#009FDF", amount:6000, currency:"USD", awardType:"Partial Funding", deadline:"2026-05-15", country:"Africa", fields:["Business","Finance","Economics","Banking"], degrees:["Undergraduate","Masters"], tags:["Africa","Banking","Finance","Stanbic"], description:"Stanbic Bank scholarships are awarded to academically excellent students in Africa pursuing degrees in finance, economics and business, developing future leaders for Africa's financial sector.", requirements:"Citizen of Stanbic operating country. Strong academic record. Enrolled in finance or business program. Leadership potential.", views:1560, status:"published", featured:false, appUrl:"https://www.stanbicbank.com" },
  { id:92, slug:"africare-scholarship", title:"Africare Community Scholarship", org:"Africare", orgLogo:"AC", orgColor:"#008751", amount:3000, currency:"USD", awardType:"Partial Funding", deadline:"2026-07-01", country:"Africa", fields:["Health","Agriculture","Education","Environment"], tags:["Africa","Community","Development","Rural"], degrees:["Undergraduate","Vocational"], description:"Africare community scholarships support young people from rural African communities to access higher and vocational education, with a focus on building skills that directly benefit their home communities.", requirements:"From rural African community. Academic potential. Commitment to return and serve home community. Financial need.", views:1120, status:"published", featured:false, appUrl:"https://www.africare.org" },
  { id:93, slug:"tony-elumelu-entrepreneurship", title:"Tony Elumelu Foundation Entrepreneurship Programme", org:"Tony Elumelu Foundation", orgLogo:"TE", orgColor:"#E8A000", amount:5000, currency:"USD", awardType:"Grant", deadline:"2026-03-01", country:"Africa", fields:["Business","Entrepreneurship","Agriculture","Technology"], degrees:["Any"], tags:["Africa","Entrepreneurship","Business","Tony Elumelu","Startup"], description:"The Tony Elumelu Foundation Entrepreneurship Programme is the largest African philanthropic initiative to identify, train and fund 10,000 African entrepreneurs over 10 years. Each selected entrepreneur receives $5,000 seed capital, mentorship and business training.", requirements:"African citizen. Viable business idea or early-stage startup. Commitment to complete 12-week training. Under 35 years preferred.", views:8900, status:"published", featured:true, appUrl:"https://www.tonyelumelufoundation.org/teep" },
  { id:94, slug:"mo-ibrahim-leadership-fellowship", title:"Mo Ibrahim Foundation Scholarship and Fellowship", org:"Mo Ibrahim Foundation", orgLogo:"MI", orgColor:"#C0272D", amount:50000, currency:"USD", awardType:"Full Funding", deadline:"2026-03-31", country:"Africa", fields:["Public Policy","Governance","Development","Law"], degrees:["Masters","PhD"], tags:["Africa","Governance","Leadership","Policy"], description:"The Mo Ibrahim Foundation supports African scholars in governance, public policy and leadership, nurturing a generation of transformative African leaders who can build more prosperous and well-governed societies.", requirements:"African citizen. Exceptional academic record. Commitment to African governance and development. Under 35 years.", views:2340, status:"published", featured:true, appUrl:"https://mo.ibrahim.foundation" },
  { id:95, slug:"robert-bosch-africa-fellowship", title:"Robert Bosch Foundation Africa Programme", org:"Robert Bosch Foundation", orgLogo:"RB", orgColor:"#E20015", amount:18000, currency:"EUR", awardType:"Full Funding", deadline:"2026-04-01", country:"Germany", fields:["Development","Engineering","Business","Social Sciences"], degrees:["Graduate","Professional"], tags:["Germany","Africa","Bosch","Exchange","Leadership"], description:"The Robert Bosch Foundation Africa Programme fosters exchange and dialogue between Germany and African countries. Fellows from Africa spend time in Germany in professional placements, building bridges between the two regions.", requirements:"African citizen aged 25-40. University degree. Minimum 2 years professional experience. Basic German or English proficiency.", views:1230, status:"published", featured:false, appUrl:"https://www.bosch-stiftung.de" },
  { id:96, slug:"acbf-scholarship-africa-capacity", title:"African Capacity Building Foundation Scholarship", org:"African Capacity Building Foundation", orgLogo:"CB", orgColor:"#004C97", amount:16000, currency:"USD", awardType:"Full Funding", deadline:"2026-04-30", country:"Africa", fields:["Economics","Development","Public Policy","Finance"], degrees:["Masters","PhD"], tags:["Africa","Capacity Building","Economics","Policy"], description:"ACBF scholarships build Africa's human capital in economic policy, public finance management and development economics, equipping a new generation of African economists and policymakers.", requirements:"African citizen. Bachelor's degree in economics or related field. Under 40 years. Employed in public sector or development institution.", views:980, status:"published", featured:false, appUrl:"https://www.acbf-pact.org" },
  { id:97, slug:"google-africa-developer-scholarship", title:"Google Africa Developer Scholarship", org:"Google & Andela", orgLogo:"GA", orgColor:"#4285F4", amount:3000, currency:"USD", awardType:"Training Grant", deadline:"2026-06-30", country:"Africa", fields:["Computer Science","Technology","Software Development","Mobile"], degrees:["Any"], tags:["Africa","Google","Tech","Software","Andela","Digital Skills"], description:"Google Africa Developer Scholarship provides access to world-class technology training for African learners, bridging the digital skills gap and creating pathways into the global tech industry for African youth.", requirements:"African citizen. Basic computer literacy. Commitment to complete program. Strong interest in technology and software development.", views:6700, status:"published", featured:true, appUrl:"https://developers.google.com/scholarships" },
  { id:98, slug:"facebook-developer-circles-scholarship", title:"Meta Developer Scholarship for Africa", org:"Meta (Facebook)", orgLogo:"FB", orgColor:"#1877F2", amount:2500, currency:"USD", awardType:"Training Grant", deadline:"2026-05-31", country:"Africa", fields:["Technology","Software Development","Data Science","AI"], degrees:["Any"], tags:["Africa","Meta","Facebook","Tech","Digital","AI"], description:"Meta Developer Scholarships equip African developers with cutting-edge skills in software development, AI, augmented reality and the metaverse, preparing Africa's next generation of tech innovators.", requirements:"African citizen. Intermediate coding skills. English proficiency. Commitment to complete program and build a project.", views:4320, status:"published", featured:false, appUrl:"https://developers.facebook.com" },
  { id:99, slug:"african-women-stem-scholarship", title:"African Women in STEM Scholarship", org:"African Development Bank & UNESCO", orgLogo:"AFS", orgColor:"#009B4E", amount:15000, currency:"USD", awardType:"Full Funding", deadline:"2026-04-15", country:"Africa", fields:["STEM","Engineering","Mathematics","Physics","Chemistry"], degrees:["Undergraduate","Masters","PhD"], tags:["African Women","STEM","Gender","Science","Engineering"], description:"This joint AfDB-UNESCO initiative is dedicated to increasing the participation of African women in science, technology, engineering and mathematics. The scholarship addresses the gender gap in STEM and nurtures female scientific talent across Africa.", requirements:"African woman. Strong performance in STEM subjects. Under 35 years. Financial need considered. Commitment to mentor other girls.", views:3450, status:"published", featured:true, appUrl:"https://www.afdb.org/en/topics-and-sectors/initiatives-partnerships/women-in-stem" },
  { id:100, slug:"commonweath-africa-scholarship", title:"Commonwealth Scholarship for African Students", org:"Commonwealth Scholarship Commission", orgLogo:"CAS", orgColor:"#006B54", amount:19000, currency:"GBP", awardType:"Full Funding", deadline:"2025-10-16", country:"UK", fields:["Any Field"], degrees:["Masters","PhD"], tags:["Africa","Commonwealth","UK","Development"], description:"Commonwealth Scholarships for African students are funded by the UK government specifically targeting citizens of Commonwealth African nations. Awards support study at UK universities in fields critical to African development.", requirements:"Citizen of Commonwealth African country. Upper second class degree or higher. Commitment to returning to Africa post-study.", views:2890, status:"published", featured:false, appUrl:"https://cscuk.fcdo.gov.uk/scholarships/commonwealth-scholarships" },
  { id:101, slug:"great-barrier-reef-scholarship", title:"Mandela Washington Fellowship for Young African Leaders", org:"U.S. Department of State", orgLogo:"MW", orgColor:"#003087", amount:25000, currency:"USD", awardType:"Full Funding", deadline:"2025-11-05", country:"USA", fields:["Business","Entrepreneurship","Civic Leadership","Public Management"], degrees:["Professional"], tags:["Africa","USA","Obama","Leadership","Young Leaders"], description:"The Mandela Washington Fellowship is the flagship program of the Young African Leaders Initiative (YALI). It brings young African leaders to the United States for six weeks of intensive academic coursework, leadership training and networking.", requirements:"African citizen aged 25-35. Demonstrated record of accomplishment in leadership. English proficiency. Employed or self-employed.", views:5600, status:"published", featured:true, appUrl:"https://yali.state.gov/washington-fellowship" },
  { id:102, slug:"german-development-scholarship-africa", title:"GIZ Scholarship for African Development Professionals", org:"Deutsche Gesellschaft für Internationale Zusammenarbeit (GIZ)", orgLogo:"GZ", orgColor:"#005A9C", amount:20000, currency:"EUR", awardType:"Full Funding", deadline:"2026-05-31", country:"Germany", fields:["Development","Agriculture","Water","Governance","Health"], degrees:["Masters"], tags:["Africa","Germany","GIZ","Development","Cooperation"], description:"GIZ scholarships support African development professionals to pursue postgraduate studies in Germany in fields directly relevant to GIZ's cooperation programs in Africa, building a generation of Africa-Germany development bridges.", requirements:"African citizen. Working in development-related sector. Minimum 2 years relevant work experience. Bachelor's degree.", views:1120, status:"published", featured:false, appUrl:"https://www.giz.de" },
  { id:103, slug:"carnegie-african-diaspora-fellowship", title:"Carnegie African Diaspora Fellowship Program", org:"Carnegie Corporation of New York", orgLogo:"CG2", orgColor:"#CC0000", amount:8000, currency:"USD", awardType:"Stipend", deadline:"2026-04-01", country:"Africa", fields:["Any Field"], degrees:["Academic Faculty"], tags:["Africa","Diaspora","Carnegie","Academia","Knowledge Transfer"], description:"The Carnegie African Diaspora Fellowship Program supports African-born academics in the diaspora to undertake collaborative visits to higher education institutions in Africa, transferring knowledge and strengthening African universities.", requirements:"African-born academic in diaspora. Faculty position at North American or European university. Collaborative project with African institution.", views:780, status:"published", featured:false, appUrl:"https://www.iie.org/programs/carnegie-african-diaspora-fellowship-program" },
  { id:104, slug:"kcdf-scholarship-kenya", title:"Kenya Community Development Foundation Scholarship", org:"Kenya Community Development Foundation", orgLogo:"KC", orgColor:"#006600", amount:2500, currency:"USD", awardType:"Partial Funding", deadline:"2026-07-31", country:"Kenya", fields:["Any Field"], degrees:["Undergraduate"], tags:["Kenya","Community","Youth","East Africa","Need-Based"], description:"KCDF scholarships support bright Kenyan youth from marginalized communities to access higher education, building local leaders who will drive community transformation from within.", requirements:"Kenyan citizen from marginalized community. Strong KCSE results. Financial need. Active community involvement.", views:2100, status:"published", featured:false, appUrl:"https://www.kcdf.or.ke" },
  { id:105, slug:"anzisha-prize-africa-entrepreneurs", title:"Anzisha Prize for Young African Entrepreneurs", org:"African Leadership Academy & Mastercard Foundation", orgLogo:"AP", orgColor:"#EB001B", amount:25000, currency:"USD", awardType:"Grant", deadline:"2026-06-15", country:"Africa", fields:["Entrepreneurship","Business","Social Enterprise","Agriculture"], degrees:["Any"], tags:["Africa","Youth Entrepreneurship","Anzisha","Social Impact","Innovation"], description:"The Anzisha Prize celebrates Africa's very young entrepreneurs aged 15-22 who are building innovative businesses that create jobs and solve pressing community challenges across the continent.", requirements:"African citizen aged 15-22. Operating a business or social enterprise. At least 6 months in operation. Genuine impact on community.", views:3400, status:"published", featured:true, appUrl:"https://www.anzishaprize.org" },
  { id:106, slug:"africa-oxford-climate-research", title:"Oxford Climate Research Africa Fellowship", org:"University of Oxford Environmental Change Institute", orgLogo:"OC", orgColor:"#002147", amount:35000, currency:"GBP", awardType:"Full Funding", deadline:"2026-02-28", country:"UK", fields:["Climate Science","Environment","Sustainability","Development"], degrees:["PhD","Postdoc"], tags:["Africa","Oxford","Climate","Environment","Research"], description:"Oxford's Africa Climate Research Fellowship is dedicated to African researchers studying climate change impacts on the African continent, supporting African voices in global climate science.", requirements:"African citizen. Strong academic background in environmental or related science. Acceptance to Oxford program. Research focus on Africa.", views:1340, status:"published", featured:false, appUrl:"https://www.eci.ox.ac.uk" },
  { id:107, slug:"acacia-scholarship-africa-agriculture", title:"AGRA Africa Agriculture Scholarship", org:"Alliance for a Green Revolution in Africa (AGRA)", orgLogo:"AG", orgColor:"#78BE20", amount:14000, currency:"USD", awardType:"Full Funding", deadline:"2026-04-30", country:"Africa", fields:["Agriculture","Agronomy","Food Science","Rural Development"], degrees:["Masters","PhD"], tags:["Africa","Agriculture","Food Security","AGRA","Green Revolution"], description:"AGRA scholarships support African agricultural scientists, researchers and extension officers to pursue postgraduate studies that advance food security and agricultural transformation across Africa.", requirements:"African citizen. Working in or committed to agriculture sector. Bachelor's degree in agriculture or related field. Under 40 years.", views:1780, status:"published", featured:false, appUrl:"https://www.agra.org" },
  { id:108, slug:"icipe-scholarship-african-insects", title:"ICIPE Scholarship Programme (Insect Science)", org:"International Centre of Insect Physiology and Ecology", orgLogo:"IC", orgColor:"#5C8A00", amount:16000, currency:"USD", awardType:"Full Funding", deadline:"2026-05-31", country:"Kenya", fields:["Biology","Entomology","Agriculture","Ecology","Environmental Science"], degrees:["Masters","PhD"], tags:["Africa","Insects","Entomology","Nairobi","Research"], description:"ICIPE offers fully funded postgraduate scholarships at its Nairobi campus for African scientists studying insect science and its applications for improving health, agriculture and environment in Africa.", requirements:"African citizen. Strong science degree. Accepted to ICIPE program. Commitment to research in Africa.", views:890, status:"published", featured:false, appUrl:"https://www.icipe.org" },
  { id:109, slug:"atu-scholarship-africa-telecoms", title:"African Telecommunications Union Scholarship", org:"African Telecommunications Union", orgLogo:"AT", orgColor:"#0060A9", amount:7000, currency:"USD", awardType:"Partial Funding", deadline:"2026-06-01", country:"Africa", fields:["ICT","Telecommunications","Computer Science","Engineering"], degrees:["Undergraduate","Masters"], tags:["Africa","ICT","Telecommunications","Digital","Technology"], description:"The ATU Scholarship supports African students in pursuing studies in information and communications technology fields, building the digital talent Africa needs to achieve its digital transformation agenda.", requirements:"African citizen. Strong academic performance in STEM. Enrolled in or accepted to accredited telecommunications or ICT program.", views:1120, status:"published", featured:false, appUrl:"https://atuuat.africa" },
  { id:110, slug:"ubuntu-pathways-scholarship", title:"Ubuntu Pathways Scholarship (South Africa)", org:"Ubuntu Pathways", orgLogo:"UP", orgColor:"#E8700A", amount:4000, currency:"ZAR", awardType:"Full Funding", deadline:"2026-07-31", country:"South Africa", fields:["Any Field"], degrees:["BSc","Undergraduate"], tags:["South Africa","Ubuntu","Port Elizabeth","Need-Based","Youth"], description:"Ubuntu Pathways provides holistic scholarships to young people from Port Elizabeth's impoverished communities, offering not just financial support but mentoring, career guidance and life skills to break the cycle of poverty.", requirements:"South African citizen from Port Elizabeth area. Graduate of Ubuntu Pathways school program. Strong academic performance.", views:1450, status:"published", featured:false, appUrl:"https://www.ubuntupathways.org" },

  // ── CHINA SCHOLARSHIPS ────────────────────────────────────────────────────
  { id:111, slug:"csc-chinese-government-scholarship-2026", title:"CSC Chinese Government Scholarship 2026", org:"China Scholarship Council (CSC)", orgLogo:"CS", orgColor:"#DE2910", amount:36000, currency:"CNY", awardType:"Full Funding", deadline:"2026-03-15", country:"China", fields:["Any Field"], degrees:["BSc","MSc","PhD"], tags:["China","CSC","Full Funding","2026","Government"], description:"The CSC Chinese Government Scholarship 2026 offers full scholarships to outstanding international students to study in China. Covers tuition, accommodation, living allowance and medical insurance for BSc, MSc and PhD students.", requirements:"Non-Chinese citizen. BSc: under 25, MSc: under 35, PhD: under 40. Strong academic record. Health certificate required.", views:9800, status:"published", featured:true, appUrl:"https://www.campuschina.org" },
  { id:112, slug:"ucas-university-china-scholarship", title:"UCAS University of Chinese Academy of Sciences Scholarship", org:"University of Chinese Academy of Sciences", orgLogo:"UC", orgColor:"#B22222", amount:42000, currency:"CNY", awardType:"Full Funding", deadline:"2026-04-30", country:"China", fields:["STEM","Physics","Chemistry","Biology","Engineering","Computer Science"], degrees:["MSc","PhD","Postdoc"], tags:["China","UCAS","Academy of Sciences","Research","STEM"], description:"The UCAS Scholarship is offered by the University of Chinese Academy of Sciences to outstanding international students pursuing MSc, PhD and postdoctoral research in natural sciences, engineering and technology at one of China's most prestigious research universities.", requirements:"Strong STEM background. Research proposal for PhD/Postdoc. English or Chinese proficiency. Non-Chinese citizen.", views:4500, status:"published", featured:true, appUrl:"https://www.ucas.ac.cn" },
  { id:113, slug:"uscas-scholarship-china", title:"USCAS – University of Science and Technology of China Scholarship", org:"University of Science and Technology of China (USTC)", orgLogo:"US2", orgColor:"#003087", amount:38000, currency:"CNY", awardType:"Full Funding", deadline:"2026-03-31", country:"China", fields:["Physics","Chemistry","Mathematics","Biology","Engineering","Computer Science"], degrees:["BSc","MSc","PhD"], tags:["China","USTC","Science","Technology","Research"], description:"USTC offers full scholarships to exceptional international students at BSc, MSc and PhD levels. USTC is ranked among China's top universities for science and technology, offering world-class research facilities.", requirements:"Strong academic background in science or engineering. Non-Chinese citizen. Under 25 (BSc), 35 (MSc), 40 (PhD). English or Chinese language.", views:3200, status:"published", featured:false, appUrl:"https://www.ustc.edu.cn/international" },
  { id:114, slug:"beijing-government-scholarship", title:"Beijing Government Scholarship", org:"Beijing Municipal Government", orgLogo:"BJ", orgColor:"#DE2910", amount:30000, currency:"CNY", awardType:"Full Funding", deadline:"2026-05-31", country:"China", fields:["Any Field"], degrees:["BSc","MSc","PhD"], tags:["China","Beijing","Government","2026"], description:"The Beijing Government Scholarship supports international students studying at Beijing universities. Covers tuition fees, accommodation and provides a monthly living allowance for BSc, MSc and PhD students.", requirements:"Non-Chinese citizen. Enrolled or accepted at a Beijing university. Good academic standing. Under official age limits per level.", views:2800, status:"published", featured:false, appUrl:"https://www.bjstudyabroad.com" },
  { id:115, slug:"shanghai-government-scholarship-2026", title:"Shanghai Government Scholarship 2026", org:"Shanghai Municipal Education Commission", orgLogo:"SH", orgColor:"#E60000", amount:32000, currency:"CNY", awardType:"Full Funding", deadline:"2026-04-30", country:"China", fields:["Any Field"], degrees:["BSc","MSc","PhD"], tags:["China","Shanghai","Government","2026"], description:"The Shanghai Government Scholarship (SGS) is awarded to outstanding international students enrolled at Shanghai universities. Full coverage of tuition, accommodation and monthly stipend.", requirements:"Non-Chinese citizen. Enrolled at participating Shanghai university. Strong academic record. Health certificate.", views:2600, status:"published", featured:false, appUrl:"https://www.studyinshanghai.org" },
  { id:116, slug:"confucius-institute-scholarship", title:"Confucius Institute Scholarship", org:"Hanban / Confucius Institute Headquarters", orgLogo:"CI", orgColor:"#C8102E", amount:22000, currency:"CNY", awardType:"Full Funding", deadline:"2026-04-30", country:"China", fields:["Chinese Language","Chinese Studies","Education"], degrees:["BSc","MSc","Language"], tags:["China","Confucius","Chinese Language","Hanban"], description:"The Confucius Institute Scholarship supports international students and teachers to study Chinese language and culture at Chinese universities or to teach Chinese abroad. Covers tuition, accommodation and living expenses.", requirements:"Non-Chinese citizen. Nominated by Confucius Institute or Chinese embassy. Age and qualification requirements vary by category.", views:3400, status:"published", featured:false, appUrl:"https://cis.hanban.org" },
  { id:117, slug:"silk-road-scholarship-china", title:"Silk Road Scholarship Program", org:"Chinese Ministry of Education", orgLogo:"SR", orgColor:"#DE2910", amount:28000, currency:"CNY", awardType:"Full Funding", deadline:"2026-05-01", country:"China", fields:["Any Field"], degrees:["MSc","PhD"], tags:["China","Silk Road","Belt and Road","International"], description:"The Silk Road Scholarship is part of China's Belt and Road Initiative, offering scholarships to students from countries along the Silk Road to study in China at MSc and PhD levels.", requirements:"Citizen of Silk Road or Belt and Road Initiative country. Strong academic record. Non-Chinese citizen. Under 35 (MSc) or 40 (PhD).", views:3100, status:"published", featured:false, appUrl:"https://www.campuschina.org/scholarships" },
  { id:118, slug:"peking-university-scholarship", title:"Peking University Presidential Scholarship", org:"Peking University", orgLogo:"PK", orgColor:"#8B0000", amount:50000, currency:"CNY", awardType:"Full Funding", deadline:"2026-03-15", country:"China", fields:["Any Field"], degrees:["MSc","PhD","Postdoc"], tags:["China","Peking University","PKU","Elite","Research"], description:"Peking University Presidential Scholarship is awarded to the most outstanding international applicants for MSc, PhD and postdoctoral programs. PKU is China's top-ranked university with world-class research.", requirements:"Exceptional academic achievement. Research proposal for PhD/Postdoc. Non-Chinese citizen. English language proficiency.", views:2400, status:"published", featured:false, appUrl:"https://www.pku.edu.cn/international" },
  { id:119, slug:"tsinghua-excellence-scholarship", title:"Tsinghua University Excellence Scholarship", org:"Tsinghua University", orgLogo:"TH", orgColor:"#660000", amount:48000, currency:"CNY", awardType:"Full Funding", deadline:"2026-03-20", country:"China", fields:["Engineering","STEM","Business","Policy"], degrees:["BSc","MSc","PhD"], tags:["China","Tsinghua","Elite","Engineering","Technology"], description:"Tsinghua University Excellence Scholarship offers full funding to outstanding international students at BSc, MSc and PhD levels. Tsinghua is ranked among Asia's top universities with exceptional programs in engineering and technology.", requirements:"Top academic performance. Non-Chinese citizen. Specific GPA/grade requirements per program. Language test scores.", views:2700, status:"published", featured:false, appUrl:"https://www.tsinghua.edu.cn/en/Admission" },
  { id:120, slug:"fudan-university-scholarship", title:"Fudan University International Student Scholarship", org:"Fudan University", orgLogo:"FD", orgColor:"#003087", amount:38000, currency:"CNY", awardType:"Full Funding", deadline:"2026-04-15", country:"China", fields:["Any Field"], degrees:["BSc","MSc","PhD"], tags:["China","Fudan","Shanghai","International","Research"], description:"Fudan University Shanghai offers comprehensive scholarships to international students at all degree levels. Known for its strong programs in medicine, law, social sciences and humanities.", requirements:"Strong academic record. Non-Chinese citizen. Health certificate. Language requirements depend on program language.", views:1980, status:"published", featured:false, appUrl:"https://www.fudan.edu.cn/en" },

  // ── POLAND ────────────────────────────────────────────────────────────────
  { id:121, slug:"nawa-poland-scholarship-2026", title:"NAWA Polish National Agency for Academic Exchange Scholarship", org:"Polish National Agency for Academic Exchange (NAWA)", orgLogo:"NW", orgColor:"#DC143C", amount:16000, currency:"PLN", awardType:"Full Funding", deadline:"2026-04-15", country:"Poland", fields:["Any Field"], degrees:["BSc","MSc","PhD","Postdoc"], tags:["Poland","NAWA","2026","Eastern Europe","Research"], description:"NAWA offers a range of scholarship programmes for international students and researchers to study and conduct research in Poland. Programmes include the Ignacy Łukasiewicz Scholarship, Banach Programme and Stefan Banach Fellowship for BSc through Postdoc levels.", requirements:"Non-Polish citizen. Strong academic record. Research proposal for postdoc. Knowledge of Polish or English depending on program.", views:2400, status:"published", featured:true, appUrl:"https://nawa.gov.pl/en/scholarships" },
  { id:122, slug:"nawa-banach-scholarship-poland", title:"NAWA Banach Programme – Full Degree Scholarships in Poland", org:"NAWA – Polish National Agency for Academic Exchange", orgLogo:"NB", orgColor:"#DC143C", amount:14400, currency:"PLN", awardType:"Full Funding", deadline:"2026-03-31", country:"Poland", fields:["STEM","Economics","Agriculture","Medical Sciences"], degrees:["MSc"], tags:["Poland","Banach","NAWA","Full Funding","MSc"], description:"The Stefan Banach programme offers scholarships for citizens of Eastern Partnership and selected Asian countries to pursue full MSc degrees at Polish public universities, covering tuition, accommodation and monthly stipend.", requirements:"Citizen of Armenia, Azerbaijan, Belarus, Georgia, Moldova, Ukraine or selected Asian countries. Bachelor's degree. Age under 35.", views:1890, status:"published", featured:false, appUrl:"https://nawa.gov.pl/en/scholarships/banach" },
  { id:123, slug:"nawa-lukasiewicz-scholarship", title:"NAWA Ignacy Łukasiewicz Scholarship Programme", org:"NAWA Poland", orgLogo:"NL", orgColor:"#DC143C", amount:1500, currency:"PLN", awardType:"Stipend", deadline:"2026-05-15", country:"Poland", fields:["Any Field"], degrees:["BSc","MSc","PhD"], tags:["Poland","Łukasiewicz","NAWA","Developing Countries"], description:"The Ignacy Łukasiewicz Scholarship Programme offers monthly stipends to students from developing countries who have been accepted to a Polish university, covering living expenses during their studies in Poland.", requirements:"Citizen of developing country. Accepted to Polish public university. Strong academic record. Under official age limits.", views:1450, status:"published", featured:false, appUrl:"https://nawa.gov.pl/en/scholarships/lukasiewicz" },
  { id:124, slug:"polish-government-scholarship-ministry", title:"Polish Government Scholarship (Ministry of Foreign Affairs)", org:"Polish Ministry of Foreign Affairs", orgLogo:"PG", orgColor:"#DC143C", amount:13200, currency:"PLN", awardType:"Full Funding", deadline:"2026-05-31", country:"Poland", fields:["Any Field"], degrees:["BSc","MSc","PhD"], tags:["Poland","Government","Foreign Affairs","Eastern Europe"], description:"The Polish Government offers scholarships through its Ministry of Foreign Affairs for students from countries with which Poland has bilateral agreements, supporting academic exchange and international diplomacy.", requirements:"Citizen of country with Polish bilateral scholarship agreement. Nominated by home country ministry or embassy. Good academic standing.", views:1230, status:"published", featured:false, appUrl:"https://www.gov.pl/web/diplomacy/scholarships" },

  // ── IRELAND ───────────────────────────────────────────────────────────────
  { id:125, slug:"ireland-government-scholarship-2026", title:"Ireland Government Scholarship (Science Foundation Ireland)", org:"Science Foundation Ireland & Irish Government", orgLogo:"IR", orgColor:"#169B62", amount:22000, currency:"EUR", awardType:"Full Funding", deadline:"2026-02-28", country:"Ireland", fields:["STEM","Engineering","Computer Science","Biotechnology"], degrees:["MSc","PhD","Postdoc"], tags:["Ireland","SFI","Science","STEM","Research"], description:"Science Foundation Ireland funds postgraduate and postdoctoral researchers in STEM fields. SFI awards support Ireland's ambition to become a global innovation hub, with strong links to multinational tech companies based in Ireland.", requirements:"Any nationality. Strong STEM background. Research proposal. Host supervisor at Irish university. BSc for MSc/MSc for PhD.", views:1780, status:"published", featured:true, appUrl:"https://www.sfi.ie/funding" },
  { id:126, slug:"irish-research-council-scholarship", title:"Irish Research Council Postgraduate Scholarship", org:"Irish Research Council", orgLogo:"IC2", orgColor:"#169B62", amount:18500, currency:"EUR", awardType:"Full Funding", deadline:"2026-02-12", country:"Ireland", fields:["Any Field"], degrees:["MSc","PhD"], tags:["Ireland","Research","IRC","Postgraduate","Arts and Science"], description:"The Irish Research Council awards postgraduate scholarships across all disciplines including arts, humanities, social sciences and STEM. The scholarship covers fees and provides a generous annual stipend.", requirements:"Any nationality. Enrolled or accepted to Irish university. Strong academic record. Supervisor agreement. Research proposal.", views:1340, status:"published", featured:false, appUrl:"https://research.ie/funding/goipg" },
  { id:127, slug:"ucd-global-graduate-scholarship", title:"UCD Global Graduate Scholarship", org:"University College Dublin", orgLogo:"UD", orgColor:"#003087", amount:10000, currency:"EUR", awardType:"Partial Funding", deadline:"2026-07-31", country:"Ireland", fields:["Any Field"], degrees:["MSc","PhD"], tags:["Ireland","UCD","Dublin","International","Graduate"], description:"UCD Global Graduate Scholarships are awarded to high-achieving international students enrolling in postgraduate programs at University College Dublin, one of Ireland's leading research-intensive universities.", requirements:"Non-EU international student. Minimum 2.1 undergraduate degree. Accepted to UCD program. All nationalities welcome.", views:1120, status:"published", featured:false, appUrl:"https://www.ucd.ie/scholarships" },
  { id:128, slug:"trinity-college-dublin-postgraduate-award", title:"Trinity College Dublin Postgraduate Research Awards", org:"Trinity College Dublin", orgLogo:"TC", orgColor:"#003D7C", amount:16000, currency:"EUR", awardType:"Full Funding", deadline:"2026-01-31", country:"Ireland", fields:["Any Field"], degrees:["PhD","Postdoc"], tags:["Ireland","Trinity","Dublin","Research","PhD"], description:"Trinity College Dublin awards postgraduate research scholarships covering fees and stipend across all faculties. Trinity is Ireland's oldest and most prestigious university, ranked among Europe's top 100.", requirements:"Strong undergraduate or master's degree. Research proposal. Supervisor agreement at Trinity. Open to all nationalities.", views:980, status:"published", featured:false, appUrl:"https://www.tcd.ie/scholarships" },

  // ── FINLAND ───────────────────────────────────────────────────────────────
  { id:129, slug:"finland-government-scholarship-cimo", title:"Finland Scholarship Programme (CIMO Fellowships)", org:"Finnish National Agency for Education (EDUFI)", orgLogo:"FN", orgColor:"#003580", amount:1500, currency:"EUR", awardType:"Stipend", deadline:"2026-01-31", country:"Finland", fields:["Any Field"], degrees:["MSc","PhD","Postdoc","Research"], tags:["Finland","EDUFI","CIMO","Nordic","Research"], description:"The EDUFI Fellowship (formerly CIMO Fellowship) provides monthly stipends for doctoral and postdoctoral researchers from non-EU countries to conduct research at Finnish universities and research institutes.", requirements:"Citizen of non-EU country. Doctoral student or postdoctoral researcher. Invitation from Finnish host institution. Research proposal.", views:1230, status:"published", featured:true, appUrl:"https://www.oph.fi/en/funding/edufi-fellowships" },
  { id:130, slug:"aalto-university-scholarship-finland", title:"Aalto University Scholarship Programme", org:"Aalto University", orgLogo:"AA2", orgColor:"#E60014", amount:10000, currency:"EUR", awardType:"Partial Funding", deadline:"2026-01-15", country:"Finland", fields:["Engineering","Technology","Arts","Business","STEM"], degrees:["MSc"], tags:["Finland","Aalto","Engineering","Design","Nordic"], description:"Aalto University offers tuition fee waivers and scholarships to outstanding non-EU/EEA students admitted to its MSc programs in engineering, technology, arts and business.", requirements:"Non-EU/EEA citizen. Admitted to Aalto MSc program. Strong academic record. Scholarship is competitive based on application quality.", views:1890, status:"published", featured:false, appUrl:"https://www.aalto.fi/en/admissions/scholarships" },
  { id:131, slug:"university-helsinki-scholarship", title:"University of Helsinki Scholarship Programme", org:"University of Helsinki", orgLogo:"UH", orgColor:"#003580", amount:10000, currency:"EUR", awardType:"Partial Funding", deadline:"2026-01-15", country:"Finland", fields:["Any Field"], degrees:["MSc"], tags:["Finland","Helsinki","Nordic","Research","International"], description:"The University of Helsinki offers tuition fee waivers to excellent non-EU/EEA students admitted to its English-taught Master's degree programs. Helsinki is Finland's leading university.", requirements:"Non-EU/EEA citizen. Admitted to an English-taught Helsinki MSc program. Strong academic performance.", views:1450, status:"published", featured:false, appUrl:"https://www.helsinki.fi/en/admissions/scholarships" },

  // ── HUNGARY ───────────────────────────────────────────────────────────────
  { id:132, slug:"stipendium-hungaricum-2026", title:"Stipendium Hungaricum Scholarship Programme 2026", org:"Tempus Public Foundation, Hungary", orgLogo:"SH2", orgColor:"#477050", amount:14400, currency:"EUR", awardType:"Full Funding", deadline:"2026-01-15", country:"Hungary", fields:["Any Field"], degrees:["BSc","MSc","PhD"], tags:["Hungary","Stipendium Hungaricum","2026","Full Funding","Eastern Europe"], description:"Stipendium Hungaricum is Hungary's flagship scholarship programme offering full scholarships to students from partner countries to study in Hungary at BSc, MSc and PhD levels. Covers tuition, accommodation, health insurance and monthly stipend.", requirements:"Citizen of partner country. Nominated by home country authority. Strong academic record. Age: BSc under 23, MSc under 35, PhD under 45.", views:5600, status:"published", featured:true, appUrl:"https://stipendiumhungaricum.hu" },
  { id:133, slug:"hungary-bilateral-scholarship", title:"Hungarian Government Scholarship (Bilateral)", org:"Hungarian Ministry of Foreign Affairs", orgLogo:"HG", orgColor:"#CE2939", amount:10800, currency:"EUR", awardType:"Full Funding", deadline:"2026-03-31", country:"Hungary", fields:["Any Field"], degrees:["BSc","MSc","PhD","Postdoc"], tags:["Hungary","Bilateral","Government","Eastern Europe"], description:"The Hungarian Government awards bilateral scholarships to citizens of countries that have educational agreements with Hungary, covering all study levels from Bachelor's to Postdoctoral research.", requirements:"Citizen of country with Hungarian bilateral agreement. Nominated through home country ministry. Age requirements vary by level.", views:1890, status:"published", featured:false, appUrl:"https://tka.hu/international-programs/scholarships" },
  { id:134, slug:"bme-budapest-technology-scholarship", title:"BME Budapest University of Technology Scholarship", org:"Budapest University of Technology and Economics", orgLogo:"BM", orgColor:"#003087", amount:5000, currency:"EUR", awardType:"Partial Funding", deadline:"2026-04-30", country:"Hungary", fields:["Engineering","Technology","Mathematics","Computer Science"], degrees:["BSc","MSc","PhD"], tags:["Hungary","Budapest","Engineering","Technology","BME"], description:"BME offers merit scholarships to outstanding international students in engineering, technology and science disciplines. BME is Central Europe's leading technical university.", requirements:"Accepted to BME program. Strong academic results in STEM. Non-Hungarian international student.", views:1120, status:"published", featured:false, appUrl:"https://www.bme.hu/international" },

  // ── ROMANIA ───────────────────────────────────────────────────────────────
  { id:135, slug:"romanian-government-scholarship-2026", title:"Romanian Government Scholarship Programme 2026", org:"Ministry of Education Romania", orgLogo:"RO", orgColor:"#002B7F", amount:6000, currency:"RON", awardType:"Full Funding", deadline:"2026-03-31", country:"Romania", fields:["Any Field"], degrees:["BSc","MSc","PhD"], tags:["Romania","Government","2026","Eastern Europe","Full Funding"], description:"The Romanian Government offers full scholarships to students from countries that have bilateral agreements with Romania. Covers tuition fees, accommodation and monthly stipend for BSc, MSc and PhD programs.", requirements:"Citizen of country with Romanian bilateral agreement. Nominated by home country education authority. Strong academic record.", views:2100, status:"published", featured:true, appUrl:"https://www.cnred.edu.ro/en/scholarships" },
  { id:136, slug:"eugen-ionescu-scholarship-romania", title:"Eugen Ionescu Scholarship (Romania – French Language)", org:"Agence Universitaire de la Francophonie & Romanian Government", orgLogo:"EI", orgColor:"#002B7F", amount:8000, currency:"EUR", awardType:"Full Funding", deadline:"2026-04-30", country:"Romania", fields:["Humanities","Social Sciences","Arts","Law"], degrees:["MSc","PhD"], tags:["Romania","French Language","Francophonie","AUF"], description:"The Eugen Ionescu Scholarships are awarded to French-speaking students from AUF member countries to pursue MSc or doctoral studies in Romania, strengthening Francophone academic ties.", requirements:"French-speaking citizen of AUF member country. Bachelor's degree. French language proficiency. Under 40 years.", views:890, status:"published", featured:false, appUrl:"https://www.auf.org/eugenionescu" },
  { id:137, slug:"babes-bolyai-scholarship-romania", title:"Babeș-Bolyai University International Scholarship", org:"Babeș-Bolyai University Cluj-Napoca", orgLogo:"BB", orgColor:"#003087", amount:4500, currency:"EUR", awardType:"Partial Funding", deadline:"2026-06-30", country:"Romania", fields:["Any Field"], degrees:["BSc","MSc","PhD"], tags:["Romania","Cluj-Napoca","International","Babes-Bolyai"], description:"Babeș-Bolyai University, Romania's largest university, offers international scholarships to outstanding students. BBU offers multilingual programs in Romanian, Hungarian and German.", requirements:"International student. Strong academic record. Accepted to BBU program.", views:780, status:"published", featured:false, appUrl:"https://www.ubbcluj.ro/en/international" },

  // ── FRANCE ────────────────────────────────────────────────────────────────
  { id:138, slug:"eiffel-excellence-scholarship-2026", title:"Eiffel Excellence Scholarship 2026", org:"Campus France / French Ministry of Foreign Affairs", orgLogo:"EF2", orgColor:"#002395", amount:14600, currency:"EUR", awardType:"Full Funding", deadline:"2026-01-08", country:"France", fields:["Engineering","Economics","Law","Political Science","Management"], degrees:["MSc","PhD"], tags:["France","Eiffel","Excellence","2026","Campus France"], description:"The Eiffel Excellence Scholarship Programme 2026 attracts top international students to French grandes écoles and universities. Full coverage including monthly allowance, accommodation, health insurance, cultural activities and travel.", requirements:"Non-French citizen. Under 30 (MSc) or 35 (PhD). Nominated by French educational institution. Top academic standing.", views:3890, status:"published", featured:true, appUrl:"https://www.campusfrance.org/en/eiffel-scholarship-program-of-excellence" },
  { id:139, slug:"ile-de-france-region-scholarship", title:"Île-de-France Region Excellence Scholarship", org:"Région Île-de-France", orgLogo:"IDF", orgColor:"#002395", amount:10000, currency:"EUR", awardType:"Partial Funding", deadline:"2026-04-30", country:"France", fields:["Any Field"], degrees:["MSc","PhD"], tags:["France","Paris","Île-de-France","Excellence"], description:"The Île-de-France Region awards excellence scholarships to international students enrolled in Paris-area universities and grandes écoles, supporting the region's status as a global academic hub.", requirements:"International student enrolled or accepted to Paris-area institution. Strong academic record. Research proposal for PhD.", views:1230, status:"published", featured:false, appUrl:"https://www.iledefrance.fr" },
  { id:140, slug:"french-embassy-scholarship", title:"French Embassy Excellence Scholarship", org:"French Embassy Network", orgLogo:"FE", orgColor:"#002395", amount:12000, currency:"EUR", awardType:"Full Funding", deadline:"2026-03-31", country:"France", fields:["Any Field"], degrees:["MSc","PhD"], tags:["France","Embassy","Excellence","International"], description:"French Embassies worldwide award scholarships to outstanding students from their host countries to pursue MSc or PhD studies in France, supporting French academic diplomacy and scientific cooperation.", requirements:"Citizen of country with French Embassy scholarship. Excellent academic record. French or English language. Accepted to French institution.", views:1780, status:"published", featured:false, appUrl:"https://www.france.fr/scholarships" },
  { id:141, slug:"sciences-po-scholarship-france", title:"Sciences Po Excellence Scholarship", org:"Sciences Po Paris", orgLogo:"SP", orgColor:"#003087", amount:15000, currency:"EUR", awardType:"Partial Funding", deadline:"2026-03-15", country:"France", fields:["Political Science","Law","Economics","International Relations","Journalism"], degrees:["BSc","MSc","PhD"], tags:["France","Sciences Po","Paris","Social Sciences","Excellence"], description:"Sciences Po Paris offers merit and need-based scholarships to international students at all degree levels. Sciences Po is one of France's most prestigious and internationally recognized grandes écoles.", requirements:"International student admitted to Sciences Po. Strong academic record. Financial need may also be considered.", views:2100, status:"published", featured:false, appUrl:"https://www.sciencespo.fr/en/financial-aid" },

  // ── ITALY ─────────────────────────────────────────────────────────────────
  { id:142, slug:"italy-dsu-scholarship-2026", title:"Italy DSU Right to Education Scholarship 2026", org:"Italian Ministry of University and Research (MUR)", orgLogo:"IT", orgColor:"#009246", amount:5500, currency:"EUR", awardType:"Full Funding", deadline:"2026-08-31", country:"Italy", fields:["Any Field"], degrees:["BSc","MSc","PhD"], tags:["Italy","DSU","Right to Study","Need-Based","2026"], description:"Italy's DSU (Diritto allo Studio Universitario) scholarships guarantee university access to deserving and financially needy students, covering tuition exemption, cash grants and accommodation at Italian universities.", requirements:"Enrolled at Italian university. Financial need based on ISEE indicator. Academic merit requirements per university.", views:2340, status:"published", featured:true, appUrl:"https://www.studiare-in-italia.it" },
  { id:143, slug:"italian-government-scholarship-icps", title:"Italian Government Scholarship (ICPSItalia)", org:"Italian Ministry of Foreign Affairs", orgLogo:"IG", orgColor:"#009246", amount:6000, currency:"EUR", awardType:"Full Funding", deadline:"2026-03-31", country:"Italy", fields:["Any Field"], degrees:["MSc","PhD","Postdoc","Research"], tags:["Italy","Government","Foreign Affairs","MSc","PhD","Postdoc"], description:"The Italian Government offers scholarships through its Ministry of Foreign Affairs to international students and researchers wishing to pursue MSc, PhD or postdoctoral research at Italian universities.", requirements:"Non-Italian citizen. Under 28 (MSc) or 30 (PhD) or 40 (Postdoc). Research proposal. Nominated by Italian embassy or directly applied.", views:1890, status:"published", featured:false, appUrl:"https://www.esteri.it/it/opportunita/borse-di-studio" },
  { id:144, slug:"politecnico-milano-scholarship-italy", title:"Politecnico di Milano Merit Scholarship", org:"Politecnico di Milano", orgLogo:"PM", orgColor:"#B8860B", amount:8000, currency:"EUR", awardType:"Partial Funding", deadline:"2026-04-30", country:"Italy", fields:["Engineering","Architecture","Design","STEM","Urban Planning"], degrees:["BSc","MSc","PhD"], tags:["Italy","Milano","Engineering","Politecnico","Design"], description:"Politecnico di Milano offers merit scholarships to outstanding international students in engineering, architecture and design. PoliMi is Italy's top technical university and one of Europe's most prestigious.", requirements:"International student. Strong academic record (GPA or grades). Accepted to PoliMi program. English language.", views:1670, status:"published", featured:false, appUrl:"https://www.polimi.it/en/international-prospective-students/financial-aid" },
  { id:145, slug:"sapienza-scholarship-rome", title:"Sapienza University of Rome Excellence Scholarship", org:"Sapienza University of Rome", orgLogo:"SR2", orgColor:"#8B0000", amount:5000, currency:"EUR", awardType:"Partial Funding", deadline:"2026-06-30", country:"Italy", fields:["Any Field"], degrees:["BSc","MSc","PhD"], tags:["Italy","Rome","Sapienza","Excellence","Research"], description:"Sapienza University of Rome, Europe's oldest university, awards excellence scholarships to outstanding international students. Sapienza is Italy's largest university with a rich tradition of academic excellence.", requirements:"International student. Excellent academic record. Accepted to Sapienza program. All levels welcome.", views:1230, status:"published", featured:false, appUrl:"https://www.uniroma1.it/en/international-students" },

  // ── UAE ───────────────────────────────────────────────────────────────────
  { id:146, slug:"uae-government-scholarship", title:"UAE Federal Government Scholarship", org:"Ministry of Education UAE", orgLogo:"UA", orgColor:"#009A44", amount:40000, currency:"AED", awardType:"Full Funding", deadline:"2026-06-30", country:"UAE", fields:["Any Field"], degrees:["BSc","MSc","PhD"], tags:["UAE","Government","Dubai","Abu Dhabi","Full Funding"], description:"The UAE Federal Government Scholarship provides full funding to Emirati nationals for undergraduate, masters and doctoral studies at leading universities worldwide, building UAE's knowledge economy.", requirements:"UAE national. Strong academic performance. Accepted to recognized university. Specific requirements vary by level.", views:1340, status:"published", featured:true, appUrl:"https://www.moe.gov.ae/en/scholarships" },
  { id:147, slug:"khalifa-university-scholarship-uae", title:"Khalifa University Scholarship Programme", org:"Khalifa University", orgLogo:"KU", orgColor:"#003087", amount:60000, currency:"AED", awardType:"Full Funding", deadline:"2026-05-31", country:"UAE", fields:["Engineering","Science","Technology","Health","Energy"], degrees:["BSc","MSc","PhD"], tags:["UAE","Abu Dhabi","Khalifa","Engineering","Research"], description:"Khalifa University offers full scholarships to outstanding students across all degree levels in engineering, science and technology. KU is the UAE's top-ranked university for research and innovation.", requirements:"Strong academic record. Accepted to Khalifa University. BSc scholarships for UAE nationals; MSc/PhD open to international students too.", views:1780, status:"published", featured:false, appUrl:"https://www.ku.ac.ae/admissions/scholarships" },
  { id:148, slug:"nyuad-scholarship-abu-dhabi", title:"NYU Abu Dhabi Full Need Scholarship", org:"New York University Abu Dhabi", orgLogo:"NY", orgColor:"#57068C", amount:80000, currency:"USD", awardType:"Full Funding", deadline:"2026-01-01", country:"UAE", fields:["Any Field"], degrees:["BSc"], tags:["UAE","Abu Dhabi","NYU","Liberal Arts","Need-Based"], description:"NYU Abu Dhabi meets 100% of demonstrated financial need for all admitted students. NYUAD is one of the world's most selective universities offering an elite liberal arts education in the Gulf.", requirements:"International high school graduate. Exceptional academic achievement. Need demonstrated. Rigorous selection including essays and interviews.", views:2890, status:"published", featured:false, appUrl:"https://admissions.nyuad.nyu.edu" },
  { id:149, slug:"sharjah-university-scholarship-uae", title:"University of Sharjah Scholarship", org:"University of Sharjah", orgLogo:"US3", orgColor:"#009A44", amount:25000, currency:"AED", awardType:"Partial Funding", deadline:"2026-07-31", country:"UAE", fields:["Any Field"], degrees:["BSc","MSc","PhD"], tags:["UAE","Sharjah","Gulf","Merit","International"], description:"The University of Sharjah offers merit scholarships to outstanding students from across the world, providing quality education in a multicultural environment in the heart of the UAE.", requirements:"Strong academic results. Accepted to UOS program. All nationalities. Specific GPA requirements per scholarship tier.", views:1120, status:"published", featured:false, appUrl:"https://www.sharjah.ac.ae/en/Academics/scholarships" },

  // ── SAUDI ARABIA ─────────────────────────────────────────────────────────
  { id:150, slug:"king-abdulaziz-scholarship-saudi", title:"King Abdulaziz University International Scholarship", org:"King Abdulaziz University", orgLogo:"KA", orgColor:"#006C35", amount:30000, currency:"SAR", awardType:"Full Funding", deadline:"2026-05-31", country:"Saudi Arabia", fields:["Any Field"], degrees:["MSc","PhD","Postdoc"], tags:["Saudi Arabia","KAU","Jeddah","Islam","Research"], description:"King Abdulaziz University in Jeddah offers full scholarships to outstanding international students and researchers for MSc, PhD and postdoctoral research. KAU is Saudi Arabia's largest university.", requirements:"Non-Saudi citizen. Strong academic record. Research proposal for PhD/Postdoc. Islam not required.", views:1780, status:"published", featured:true, appUrl:"https://www.kau.edu.sa/international" },
  { id:151, slug:"kaust-fellowship-saudi-arabia", title:"KAUST Fellowship (Full Funding MSc & PhD)", org:"King Abdullah University of Science and Technology", orgLogo:"KF", orgColor:"#007A5E", amount:37000, currency:"USD", awardType:"Full Funding", deadline:"2026-01-15", country:"Saudi Arabia", fields:["STEM","Engineering","Computer Science","Environment","Biology"], degrees:["MSc","PhD","Postdoc"], tags:["Saudi Arabia","KAUST","STEM","Research","World-Class"], description:"KAUST provides all admitted graduate students with a generous fellowship package covering tuition, housing, health insurance and a living allowance. KAUST is a world-class research university in Saudi Arabia focused on science and engineering.", requirements:"Any nationality. Bachelor's (for MSc) or Master's (for PhD) in STEM. Strong academic record. English language. GRE may be required.", views:3400, status:"published", featured:true, appUrl:"https://admissions.kaust.edu.sa" },
  { id:152, slug:"king-saud-university-scholarship", title:"King Saud University Scholarship Programme", org:"King Saud University", orgLogo:"KS", orgColor:"#006C35", amount:28000, currency:"SAR", awardType:"Full Funding", deadline:"2026-04-30", country:"Saudi Arabia", fields:["Any Field"], degrees:["BSc","MSc","PhD"], tags:["Saudi Arabia","Riyadh","KSU","Government","Research"], description:"King Saud University in Riyadh offers full scholarships to international students at BSc, MSc and PhD levels. KSU is Saudi Arabia's oldest and one of the Arab world's most respected universities.", requirements:"Non-Saudi international student. Strong academic record. Health certificate. Some programs require Arabic proficiency.", views:1560, status:"published", featured:false, appUrl:"https://www.ksu.edu.sa/en/international" },
  { id:153, slug:"saudi-aramco-scholarship", title:"Saudi Aramco Scholarship Programme", org:"Saudi Aramco", orgLogo:"SA2", orgColor:"#00A550", amount:50000, currency:"SAR", awardType:"Full Funding", deadline:"2026-03-31", country:"Saudi Arabia", fields:["Engineering","Computer Science","Chemistry","Earth Sciences","Business"], degrees:["BSc","MSc"], tags:["Saudi Arabia","Aramco","Oil","Engineering","Corporate"], description:"Saudi Aramco, the world's largest oil company, offers prestigious scholarships to Saudi nationals and select international students for engineering, science and business degrees at top global universities.", requirements:"Strong academic performance. Commitment to work at Saudi Aramco post-graduation (Saudi nationals). Specific requirements for international students.", views:2100, status:"published", featured:false, appUrl:"https://www.saudiaramco.com/en/working-here/students" },
  { id:154, slug:"king-fahd-scholarship-saudi", title:"King Fahd Scholarship Fund", org:"King Fahd Foundation", orgLogo:"KF2", orgColor:"#006C35", amount:25000, currency:"SAR", awardType:"Full Funding", deadline:"2026-06-30", country:"Saudi Arabia", fields:["Islamic Studies","Arabic","Social Sciences","Medicine"], degrees:["BSc","MSc","PhD"], tags:["Saudi Arabia","Islamic Studies","Arabic","King Fahd","Heritage"], description:"The King Fahd Scholarship Fund supports Muslim students worldwide to pursue higher education with a focus on Islamic studies, Arabic language, medicine and social sciences.", requirements:"Muslim student. Strong academic record. Knowledge of Arabic preferred. Financial need considered.", views:1340, status:"published", featured:false, appUrl:"https://www.kff.org.sa" },

  // ── OTHER INTERESTING SCHOLARSHIPS ───────────────────────────────────────
  { id:155, slug:"turkish-burslari-scholarship-2026", title:"Türkiye Scholarships (Turkish Government) 2026", org:"Presidency for Turks Abroad and Related Communities", orgLogo:"TR", orgColor:"#E30A17", amount:12000, currency:"TRY", awardType:"Full Funding", deadline:"2026-02-20", country:"Turkey", fields:["Any Field"], degrees:["BSc","MSc","PhD","Postdoc"], tags:["Turkey","Türkiye","Government","2026","Full Funding","All Levels"], description:"Türkiye Scholarships 2026 offer full scholarships to international students for BSc, MSc, PhD and postdoctoral research at Turkish universities. Covers tuition, accommodation, health insurance, Turkish language course and monthly stipend.", requirements:"Non-Turkish citizen. Age: BSc under 21, MSc under 30, PhD under 35, Postdoc under 45. Strong academic record. No prior study in Turkey.", views:7800, status:"published", featured:true, appUrl:"https://www.turkiyeburslari.gov.tr" },
  { id:156, slug:"kakenhi-japan-postdoc-fellowship", title:"JSPS Postdoctoral Fellowship Japan", org:"Japan Society for the Promotion of Science", orgLogo:"JP2", orgColor:"#BC002D", amount:3600000, currency:"JPY", awardType:"Full Funding", deadline:"2026-05-13", country:"Japan", fields:["Any Field"], degrees:["Postdoc"], tags:["Japan","JSPS","Postdoc","Research","Fellowship"], description:"The JSPS Postdoctoral Fellowship for Research in Japan enables outstanding postdoctoral researchers from abroad to conduct research at Japanese universities and research institutions under the guidance of a Japanese host researcher.", requirements:"Postdoctoral researcher. PhD awarded within 6 years. Citizen of eligible country. Must have Japanese host researcher.", views:2100, status:"published", featured:false, appUrl:"https://www.jsps.go.jp/english/e-fellow" },
  { id:157, slug:"norway-government-scholarship-quota", title:"Norwegian Quota Scholarship", org:"Norwegian State Educational Loan Fund (Lånekassen)", orgLogo:"NO", orgColor:"#EF2B2D", amount:120000, currency:"NOK", awardType:"Full Funding", deadline:"2026-02-01", country:"Norway", fields:["Any Field"], degrees:["MSc","PhD"], tags:["Norway","Nordic","Quota","Need-Based"], description:"The Norwegian Quota Scholarship provides funding for students from developing countries and Eastern Europe to pursue full degree programs at Norwegian universities. Covers tuition, living expenses and travel.", requirements:"Citizen of developing country or Eastern Europe. Accepted to Norwegian university. Age under 35 (MSc) or 40 (PhD).", views:1450, status:"published", featured:false, appUrl:"https://www.lanekassen.no/en" },
  { id:158, slug:"denmark-excellence-scholarship", title:"Denmark Government Scholarship", org:"Danish Ministry of Higher Education", orgLogo:"DK", orgColor:"#C60C30", amount:8500, currency:"DKK", awardType:"Stipend", deadline:"2026-03-01", country:"Denmark", fields:["Any Field"], degrees:["MSc","PhD"], tags:["Denmark","Nordic","Scandinavia","Research"], description:"Denmark offers government scholarships and fee waivers to non-EU/EEA students admitted to Danish universities. The Danish higher education system is internationally recognized for quality and innovation.", requirements:"Non-EU/EEA citizen. Accepted to Danish university. Strong academic record. Specific criteria vary per institution.", views:1120, status:"published", featured:false, appUrl:"https://www.ufm.dk/en/education/scholarships" },
  { id:159, slug:"czech-government-scholarship-2026", title:"Czech Government Scholarship Programme 2026", org:"Czech Ministry of Education", orgLogo:"CZ", orgColor:"#D7141A", amount:9600, currency:"CZK", awardType:"Full Funding", deadline:"2026-03-31", country:"Czech Republic", fields:["Any Field"], degrees:["BSc","MSc","PhD"], tags:["Czech Republic","Government","Eastern Europe","2026","Central Europe"], description:"The Czech Government Scholarship Programme offers full scholarships to students from developing countries to study at Czech public universities. Covers tuition, accommodation allowance and monthly stipend.", requirements:"Citizen of developing country. Bilateral agreement with Czech Republic. Strong academic record. Czech language required for Czech-medium programs.", views:1340, status:"published", featured:false, appUrl:"https://www.dzs.cz/en" },
  { id:160, slug:"austria-oead-scholarship", title:"OeAD Austrian Government Scholarship", org:"OeAD – Austrian Agency for Education and Internationalisation", orgLogo:"OE", orgColor:"#ED2939", amount:11000, currency:"EUR", awardType:"Full Funding", deadline:"2026-03-01", country:"Austria", fields:["Any Field"], degrees:["MSc","PhD","Postdoc"], tags:["Austria","OeAD","Vienna","Research","Central Europe"], description:"OeAD manages Austria's government scholarship programmes for international students and researchers. The Ernst Mach Grant supports MSc students; doctoral and postdoctoral grants support research at Austrian universities.", requirements:"Non-Austrian citizen. Strong academic record. Acceptance to Austrian university. Research proposal for PhD/Postdoc.", views:1230, status:"published", featured:false, appUrl:"https://www.oead.at/en/students/scholarships" },
  { id:161, slug:"belgium-vlir-uos-scholarship", title:"VLIR-UOS Belgian Development Scholarship", org:"VLIR-UOS Flemish Interuniversity Council", orgLogo:"VL", orgColor:"#F6D800", amount:18000, currency:"EUR", awardType:"Full Funding", deadline:"2026-02-01", country:"Belgium", fields:["Development","Health","Agriculture","Environment","Education"], degrees:["MSc","PhD"], tags:["Belgium","VLIR-UOS","Development","Flemish","International"], description:"VLIR-UOS scholarships fund students from the global South to pursue MSc and PhD programs at Flemish universities in Belgium, focusing on topics relevant to sustainable development.", requirements:"Citizen of eligible developing country. Bachelor's degree. Under 40 years. Commitment to return home after study.", views:1780, status:"published", featured:false, appUrl:"https://www.vliruos.be/en/scholarships" },
  { id:162, slug:"spain-maec-scholarship", title:"MAEC-AECID Spanish Government Scholarship", org:"Spanish Ministry of Foreign Affairs (MAEC/AECID)", orgLogo:"ES", orgColor:"#AA151B", amount:12000, currency:"EUR", awardType:"Full Funding", deadline:"2026-03-15", country:"Spain", fields:["Any Field"], degrees:["MSc","PhD","Postdoc"], tags:["Spain","MAEC","AECID","Latin America","MSc","PhD"], description:"The MAEC-AECID scholarship supports foreign nationals and Spanish professionals for postgraduate studies and research in Spain. Strong priority given to Latin American applicants.", requirements:"Non-Spanish citizen or Spanish professional. Under 40 years. Accepted to Spanish institution. Strong academic record.", views:1560, status:"published", featured:false, appUrl:"https://www.aecid.gob.es/en/becas-y-lectorados" },
  { id:163, slug:"portugal-scholarship-programme", title:"Portugal Scholarship Programme (IPDEJ)", org:"Camões Institute – Portugal", orgLogo:"PT", orgColor:"#006600", amount:9000, currency:"EUR", awardType:"Full Funding", deadline:"2026-04-30", country:"Portugal", fields:["Any Field"], degrees:["MSc","PhD"], tags:["Portugal","Camões","PALOP","Lusophone","Portuguese Language"], description:"Portugal awards scholarships to citizens of Portuguese-speaking countries (PALOP) and other nations for postgraduate studies at Portuguese universities, deepening Lusophone cultural and academic ties.", requirements:"Citizen of eligible country. Portuguese language proficiency. Accepted to Portuguese university. Strong academic record.", views:1120, status:"published", featured:false, appUrl:"https://www.camoes.mne.gov.pt/en/scholarships" },
  { id:164, slug:"netherlands-orangetulip-2026", title:"Orange Tulip Scholarship 2026 Netherlands", org:"Nuffic Netherlands", orgLogo:"OT2", orgColor:"#FF5900", amount:15000, currency:"EUR", awardType:"Partial Funding", deadline:"2026-03-01", country:"Netherlands", fields:["Any Field"], degrees:["BSc","MSc","PhD"], tags:["Netherlands","Holland","Orange Tulip","2026","Nuffic"], description:"The Orange Tulip Scholarship 2026 is funded by Dutch universities and the private sector to attract talented international students to study in the Netherlands at BSc, MSc and PhD levels.", requirements:"Citizen of eligible non-EEA country. Accepted to participating Dutch institution. Strong academic record. Each institution has specific criteria.", views:2100, status:"published", featured:false, appUrl:"https://www.studyinnl.org/finances/orange-tulip" },
  { id:165, slug:"singapore-ntu-scholarship", title:"NTU Research Scholarship Singapore", org:"Nanyang Technological University", orgLogo:"NT", orgColor:"#CF0722", amount:30000, currency:"SGD", awardType:"Full Funding", deadline:"2026-06-30", country:"Singapore", fields:["STEM","Engineering","Business","Social Sciences"], degrees:["MSc","PhD","Postdoc"], tags:["Singapore","NTU","Research","Asia","Technology"], description:"NTU Research Scholarships support full-time graduate research students at MSc and PhD levels. NTU is ranked among the world's top 20 universities and offers world-class research infrastructure.", requirements:"Any nationality. Bachelor's degree with honors for MSc; MSc/outstanding BSc for PhD. Strong research potential. English proficiency.", views:2340, status:"published", featured:false, appUrl:"https://www.ntu.edu.sg/admissions/graduate/financialmatters/scholarships" },
  { id:166, slug:"south-korea-gks-topik-scholarship", title:"Korean Government Scholarship Program (GKS) 2026", org:"National Institute for International Education (NIIED)", orgLogo:"GKS", orgColor:"#003478", amount:10000, currency:"KRW", awardType:"Full Funding", deadline:"2026-02-28", country:"South Korea", fields:["Any Field"], degrees:["BSc","MSc","PhD"], tags:["Korea","GKS","2026","NIIED","Full Funding"], description:"The Global Korea Scholarship (GKS) 2026 offers comprehensive scholarships to international students for BSc, MSc and PhD programs in South Korea. Includes Korean language training, tuition, accommodation, insurance and monthly allowance.", requirements:"Non-Korean citizen. Age under 25 (BSc), 40 (MSc/PhD). GPA 80%+ equivalent. No prior Korean degree. Health certificate.", views:6700, status:"published", featured:true, appUrl:"https://www.niied.go.kr/user/indexN.do" },
  { id:167, slug:"taiwan-scholarship-mofa-2026", title:"Taiwan MOFA Scholarship 2026", org:"Ministry of Foreign Affairs Taiwan", orgLogo:"TM", orgColor:"#FE0000", amount:600, currency:"USD", awardType:"Stipend", deadline:"2026-03-31", country:"Taiwan", fields:["Any Field"], degrees:["BSc","MSc","PhD"], tags:["Taiwan","MOFA","2026","Mandarin","Chinese Language"], description:"The Taiwan Ministry of Foreign Affairs Scholarship 2026 supports international students to study at Taiwanese universities at BSc, MSc and PhD levels, with additional Chinese language training.", requirements:"Non-Taiwan citizen. Age under 30 (BSc/Language) or 40 (MSc/PhD). Accepted to Taiwanese university. Strong academic record.", views:2890, status:"published", featured:false, appUrl:"https://www.mofa.gov.tw/scholarship" },
  { id:168, slug:"malaysia-mqs-scholarship", title:"Malaysia International Scholarship (MIS)", org:"Malaysian Ministry of Higher Education", orgLogo:"MY", orgColor:"#CC0001", amount:24000, currency:"MYR", awardType:"Full Funding", deadline:"2026-05-31", country:"Malaysia", fields:["STEM","Engineering","Agriculture","Health","Technology"], degrees:["MSc","PhD"], tags:["Malaysia","MIS","Government","Southeast Asia","Full Funding"], description:"The Malaysia International Scholarship (MIS) is a merit-based scholarship for outstanding international students to pursue postgraduate studies in Malaysia. It covers tuition, monthly allowance, health insurance and accommodation.", requirements:"Citizen of eligible country. Bachelor's degree with strong GPA. Under 40 years. Research proposal required. English proficiency.", views:2340, status:"published", featured:false, appUrl:"https://biasiswa.mohe.gov.my/MIS" },
  { id:169, slug:"new-zealand-pmsf-postdoc", title:"NZ Pacific Postdoctoral Fellowship", org:"Royal Society Te Apārangi New Zealand", orgLogo:"NZP", orgColor:"#00247D", amount:80000, currency:"NZD", awardType:"Full Funding", deadline:"2026-05-01", country:"New Zealand", fields:["Any Field"], degrees:["Postdoc"], tags:["New Zealand","Pacific","Postdoc","Research","Royal Society"], description:"The Pacific Postdoctoral Fellowship supports early-career researchers from Pacific Island nations to conduct postdoctoral research at New Zealand universities, building Pacific research capacity.", requirements:"Citizen of Pacific Island nation. PhD awarded within 5 years. Research proposal. New Zealand host supervisor.", views:780, status:"published", featured:false, appUrl:"https://www.royalsociety.org.nz/fellowships" },
  { id:170, slug:"brazil-science-without-borders-postdoc", title:"Brazil CAPES Print Scholarship", org:"CAPES Brazil", orgLogo:"CP2", orgColor:"#009C3B", amount:6000, currency:"BRL", awardType:"Stipend", deadline:"2026-06-30", country:"Brazil", fields:["STEM","Health","Social Sciences","Humanities"], degrees:["PhD","Postdoc"], tags:["Brazil","CAPES","Print","Latin America","Research"], description:"The CAPES Print Programme supports Brazilian and international researchers for PhD sandwich programs and postdoctoral research in Brazil, promoting internationalization of Brazilian universities.", requirements:"PhD student or postdoctoral researcher. Research agreement with Brazilian host institution. Strong academic record.", views:1120, status:"published", featured:false, appUrl:"https://www.gov.br/capes/pt-br/acesso-a-informacao/acoes-e-programas/bolsas/bolsas-no-exterior/print" },
  { id:171, slug:"mexico-conacyt-scholarship", title:"Mexico CONAHCYT Scholarship", org:"CONAHCYT Mexico", orgLogo:"MX2", orgColor:"#006847", amount:12000, currency:"MXN", awardType:"Stipend", deadline:"2026-04-30", country:"Mexico", fields:["Any Field"], degrees:["MSc","PhD","Postdoc"], tags:["Mexico","CONAHCYT","Latin America","Research","Science"], description:"CONAHCYT (formerly CONACYT) offers scholarships for Mexican students to pursue postgraduate studies in Mexico and abroad, and for international researchers to collaborate with Mexican institutions.", requirements:"Mexican citizen (for abroad programs). Strong academic record. Enrolled or accepted to recognized program. Research proposal required.", views:1890, status:"published", featured:false, appUrl:"https://conahcyt.mx/becas_posgrados" },
  { id:172, slug:"switzerland-snf-postdoc-mobility", title:"Swiss National Science Foundation Postdoc Mobility", org:"Swiss National Science Foundation (SNSF)", orgLogo:"SN", orgColor:"#FF0000", amount:45000, currency:"CHF", awardType:"Full Funding", deadline:"2026-02-01", country:"Switzerland", fields:["Any Field"], degrees:["Postdoc"], tags:["Switzerland","SNSF","Postdoc","Research","Swiss"], description:"SNSF Postdoc Mobility fellowships support early-career Swiss researchers for research stays abroad, enabling them to develop their scientific profile and expand their international research network.", requirements:"Swiss citizen or long-term resident. PhD awarded within 2 years. Accepted by foreign research institution. Research proposal.", views:1230, status:"published", featured:false, appUrl:"https://www.snf.ch/en/9i9Hn2nFbBFJanNF/funding/funding-fellowships/postdoc-mobility" },
  { id:173, slug:"israel-scholarship-weizmann", title:"Weizmann Institute Postdoctoral Fellowship Israel", org:"Weizmann Institute of Science", orgLogo:"WI", orgColor:"#0038B8", amount:35000, currency:"USD", awardType:"Full Funding", deadline:"2026-08-31", country:"Israel", fields:["Biology","Chemistry","Physics","Mathematics","Computer Science"], degrees:["Postdoc"], tags:["Israel","Weizmann","Science","Postdoc","Research"], description:"The Weizmann Institute of Science offers postdoctoral fellowships to outstanding scientists from around the world. The Weizmann Institute is one of the world's foremost research institutions.", requirements:"PhD in natural sciences or mathematics. Accepted by Weizmann faculty supervisor. Open to all nationalities. Research proposal.", views:1450, status:"published", featured:false, appUrl:"https://www.weizmann.ac.il/feinberg/admissions/postdoctoral-fellows" },
  { id:174, slug:"russia-state-scholarship-2026", title:"Russian Government Scholarship 2026", org:"Russian Ministry of Education (Rossotrudnichestvo)", orgLogo:"RU", orgColor:"#D52B1E", amount:90000, currency:"RUB", awardType:"Full Funding", deadline:"2026-04-15", country:"Russia", fields:["Any Field"], degrees:["BSc","MSc","PhD"], tags:["Russia","Government","2026","Rossotrudnichestvo","Russian Language"], description:"The Russian Government Scholarship 2026 offers full funding for international students to study at leading Russian universities. Covers tuition, accommodation, monthly stipend and one-year Russian language preparatory course.", requirements:"Non-Russian citizen. Strong academic record. Under 30 (BSc/MSc) or 35 (PhD). Health certificate. Russian language required or preparatory course.", views:3200, status:"published", featured:false, appUrl:"https://education-in-russia.com/scholarships" },
  { id:175, slug:"pakistan-hec-overseas-scholarship", title:"HEC Pakistan Overseas Scholarship", org:"Higher Education Commission Pakistan", orgLogo:"HEC", orgColor:"#01411C", amount:40000, currency:"USD", awardType:"Full Funding", deadline:"2026-04-30", country:"Pakistan", fields:["STEM","Social Sciences","Engineering","Business","Medicine"], degrees:["MSc","PhD"], tags:["Pakistan","HEC","Overseas","Government","South Asia"], description:"The HEC Overseas Scholarship sends Pakistani students to leading international universities for MSc and PhD studies in priority fields, contributing to Pakistan's human capital development.", requirements:"Pakistani citizen. Strong academic record (first class or equivalent). Under 35 (MSc) or 40 (PhD). Employed in Pakistani institution preferred.", views:2340, status:"published", featured:false, appUrl:"https://hec.gov.pk/english/scholarships" },
  { id:176, slug:"india-iccr-scholarship", title:"ICCR India Cultural Relations Scholarship", org:"Indian Council for Cultural Relations (ICCR)", orgLogo:"IC3", orgColor:"#FF9933", amount:6000, currency:"USD", awardType:"Full Funding", deadline:"2026-03-31", country:"India", fields:["Any Field"], degrees:["BSc","MSc","PhD"], tags:["India","ICCR","Cultural Exchange","South Asia","Government"], description:"ICCR scholarships offer international students the opportunity to study in India at BSc, MSc and PhD levels at leading Indian universities. The program promotes India's cultural diplomacy and academic exchange.", requirements:"Citizen of eligible country. Strong academic record. Accepted to Indian university. Knowledge of English or Hindi.", views:2780, status:"published", featured:false, appUrl:"https://a2ascholarships.iccr.gov.in" },
  { id:177, slug:"indonesia-scholarship-dikti", title:"Indonesia Endowment Fund for Education (LPDP) Scholarship", org:"LPDP – Indonesia Endowment Fund", orgLogo:"LP2", orgColor:"#CE1126", amount:30000, currency:"IDR", awardType:"Full Funding", deadline:"2026-06-30", country:"Indonesia", fields:["Any Field"], degrees:["MSc","PhD"], tags:["Indonesia","LPDP","Southeast Asia","Government","Endowment"], description:"LPDP is Indonesia's largest scholarship fund, offering full MSc and PhD scholarships to Indonesian citizens at home and abroad, and limited international scholarships to study in Indonesia.", requirements:"Indonesian citizen (for most programs). Strong academic record. Under 35 (MSc) or 40 (PhD). Commitment to contribute to Indonesia's development.", views:3100, status:"published", featured:false, appUrl:"https://www.lpdp.kemenkeu.go.id" },

  // ── POSTDOCTORAL SPECIFIC ─────────────────────────────────────────────────
  { id:178, slug:"marie-curie-postdoc-fellowship-eu", title:"Marie Skłodowska-Curie Postdoctoral Fellowship (EU)", org:"European Commission – Horizon Europe", orgLogo:"MC2", orgColor:"#003399", amount:65000, currency:"EUR", awardType:"Full Funding", deadline:"2026-09-10", country:"Europe", fields:["Any Field"], degrees:["Postdoc"], tags:["Europe","Marie Curie","Postdoc","Horizon Europe","Research","Mobility"], description:"Marie Skłodowska-Curie Postdoctoral Fellowships support experienced researchers for two-year research stays at European institutions. One of the most prestigious postdoctoral fellowships in the world, open to researchers of any nationality.", requirements:"PhD awarded. Any nationality. Moving to/within Europe. Strong research proposal. Host institution agreement in EU/associated country.", views:4500, status:"published", featured:true, appUrl:"https://marie-sklodowska-curie-actions.ec.europa.eu/actions/postdoctoral-fellowships" },
  { id:179, slug:"hfsp-postdoctoral-fellowship", title:"Human Frontier Science Program Postdoctoral Fellowship", org:"Human Frontier Science Program Organization", orgLogo:"HF", orgColor:"#006B54", amount:57000, currency:"USD", awardType:"Full Funding", deadline:"2026-08-26", country:"International", fields:["Biology","Neuroscience","Biochemistry","Physics","Chemistry"], degrees:["Postdoc"], tags:["Postdoc","International","Life Sciences","Frontier","Research"], description:"HFSP Long-Term Fellowships support postdoctoral researchers working in a different country and/or different field from their PhD training, fostering innovative interdisciplinary research in life sciences.", requirements:"PhD awarded within 3 years. Change of country for postdoc. Change of field preferred. Any nationality. Research proposal.", views:1780, status:"published", featured:false, appUrl:"https://www.hfsp.org/funding/hfsp-funding/postdoctoral-fellowships" },
  { id:180, slug:"embo-postdoctoral-fellowship", title:"EMBO Postdoctoral Fellowship", org:"European Molecular Biology Organization", orgLogo:"EM3", orgColor:"#003D7C", amount:48000, currency:"EUR", awardType:"Full Funding", deadline:"2026-02-12", country:"Europe", fields:["Molecular Biology","Biochemistry","Genetics","Cell Biology","Neuroscience"], degrees:["Postdoc"], tags:["Europe","EMBO","Molecular Biology","Postdoc","Research"], description:"EMBO Fellowships support postdoctoral researchers in the life sciences for two-year stays at European research institutions. EMBO is one of Europe's most prestigious scientific organizations.", requirements:"PhD awarded. Moving to European country different from current/PhD country. Research in life sciences. Strong publication record.", views:1450, status:"published", featured:false, appUrl:"https://www.embo.org/funding-awards/fellowships/postdoctoral-fellowships" },
];

const CATEGORIES = [
  { id:1,  name:"STEM",              icon:"🔬", count:42 },
  { id:2,  name:"Arts & Humanities", icon:"🎨", count:12 },
  { id:3,  name:"Business",          icon:"💼", count:15 },
  { id:4,  name:"Medicine & Health", icon:"⚕️", count:14 },
  { id:5,  name:"Law & Policy",      icon:"⚖️", count:9  },
  { id:6,  name:"Social Sciences",   icon:"🌍", count:14 },
  { id:7,  name:"Engineering",       icon:"⚙️", count:22 },
  { id:8,  name:"Environment",       icon:"🌱", count:10 },
  { id:9,  name:"Africa",            icon:"🌍", count:32 },
  { id:10, name:"BSc",               icon:"🎓", count:38 },
  { id:11, name:"MSc",               icon:"📘", count:72 },
  { id:12, name:"PhD & Postdoc",     icon:"🔬", count:55 },
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
          <span>© 2026 Dani Global Academy. All rights reserved.</span>
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
