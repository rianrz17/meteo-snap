// ---------- DUMMY DATA: 10 wilayah prioritas Kaltim ----------
const REGIONS = [
  {name:"Kutai Timur", lat:0.5014, lng:117.5735, score:88, risk:"Tinggi", phenomena:["Hujan Lebat","Angin Kencang"]},
  {name:"Berau", lat:2.1500, lng:117.5000, score:81, risk:"Tinggi", phenomena:["Gelombang Tinggi","Hujan Lebat"]},
  {name:"Kutai Kartanegara", lat:-0.4016, lng:117.0146, score:74, risk:"Waspada", phenomena:["Genangan","Angin Kencang"]},
  {name:"Samarinda", lat:-0.5021, lng:117.1537, score:69, risk:"Waspada", phenomena:["Genangan","Pohon Tumbang"]},
  {name:"Bontang", lat:0.1323, lng:117.4861, score:64, risk:"Waspada", phenomena:["Gelombang","Angin Kencang"]},
  {name:"Balikpapan", lat:-1.2689, lng:116.8276, score:58, risk:"Siaga", phenomena:["Hujan Sedang"]},
  {name:"Penajam Paser Utara", lat:-1.2437, lng:116.7419, score:52, risk:"Siaga", phenomena:["Hujan Sedang"]},
  {name:"Paser", mahaKey:1, lat:-1.9000, lng:116.2000, score:47, risk:"Siaga", phenomena:["Angin Kencang"]},
  {name:"Kutai Barat", lat:-0.4639, lng:115.8336, score:38, risk:"Aman", phenomena:["Cerah Berawan"]},
  {name:"Mahakam Ulu", lat:0.8214, lng:114.9764, score:31, risk:"Aman", phenomena:["Cerah Berawan"]},
];
const BMKG_ADM4 = {
  "Paser": "64.01.04.2005",
  "Kutai Kartanegara": "64.02.06.1006",
  "Berau": "64.03.05.1004",
  "Kutai Barat": "64.07.07.2019",
  "Kutai Timur": "64.08.04.2012",
  "Penajam Paser Utara": "64.09.01.1011",
  "Mahakam Ulu": "64.11.01.2006",
  "Balikpapan": "64.71.06.1001",
  "Samarinda": "64.72.09.1002",
  "Bontang": "64.74.01.1006"
};

const riskOrder = {"Tinggi":0,"Waspada":1,"Siaga":2,"Aman":3};
const riskColor = {"Tinggi":"#d64545","Waspada":"#e0873a","Siaga":"#e8c13a","Aman":"#3fa34d"};
const pillClass = {"Tinggi":"pill-tinggi","Waspada":"pill-waspada","Siaga":"pill-siaga","Aman":"pill-aman"};

const STAKEHOLDERS = [
  {name:"BPBD", icon:"fa-solid fa-house-flag"},
  {name:"Bandara APT Pranoto", icon:"fa-solid fa-plane"},
  {name:"KSOP", icon:"fa-solid fa-ship"},
  {name:"Pemda", icon:"fa-solid fa-landmark"},
  {name:"Media", icon:"fa-solid fa-newspaper"},
  {name:"PLN", icon:"fa-solid fa-bolt"},
];

// Aturan rekomendasi rule-based per level risiko — tiap instansi punya beberapa aksi konkret
const DECISION_RULES = {
  "BPBD": {
    "Tinggi": ["Aktifkan status Siaga Darurat Bencana", "Kerahkan tim reaksi cepat & buka posko utama", "Siapkan jalur evakuasi & logistik pengungsian"],
    "Waspada": ["Tingkatkan piket pemantauan 24 jam", "Koordinasi dengan camat/lurah di wilayah terdampak", "Siagakan personel & peralatan siaga bencana"],
    "Siaga": ["Pemantauan berkala kondisi lapangan", "Perbarui data kontak & titik rawan bencana"],
    "Aman": ["Kegiatan operasional berjalan normal", "Lanjutkan pemantauan rutin mingguan"],
  },
  "Bandara APT Pranoto": {
    "Tinggi": ["Monitoring intensif pertumbuhan awan Cumulonimbus (CB)", "Terbitkan/perbarui NOTAM bila diperlukan", "Koordinasi dengan AirNav terkait potensi delay/diversion"],
    "Waspada": ["Monitoring perkembangan awan CB di sekitar bandara", "Informasikan kondisi cuaca ke maskapai secara berkala"],
    "Siaga": ["Pemantauan cuaca rutin di runway & jalur approach", "Pembaruan METAR/TAFOR berkala"],
    "Aman": ["Operasional penerbangan berjalan normal", "Pengamatan cuaca rutin sesuai jadwal"],
  },
  "KSOP": {
    "Tinggi": ["Terbitkan peringatan tinggi gelombang ke pelayaran", "Tunda keberangkatan kapal kecil/rakyat", "Koordinasi dengan Basarnas & Syahbandar setempat"],
    "Waspada": ["Peringatan dini kepada operator pelayaran", "Perketat pengawasan kelaikan kapal sebelum berlayar"],
    "Siaga": ["Pemantauan rutin jalur pelayaran Sungai Mahakam"],
    "Aman": ["Pelayaran & bongkar muat berjalan normal"],
  },
  "Pemda": {
    "Tinggi": ["Aktifkan status siaga darurat daerah", "Siapkan anggaran tak terduga & posko bantuan", "Koordinasi lintas OPD & kecamatan terdampak"],
    "Waspada": ["Rapat koordinasi lintas OPD terkait", "Siapkan kesiapsiagaan logistik kecamatan"],
    "Siaga": ["Pemantauan berkala melalui camat/lurah"],
    "Aman": ["Kondisi normal, layanan pemerintahan berjalan seperti biasa"],
  },
  "Media": {
    "Tinggi": ["Sebarluaskan peringatan dini ke publik secepatnya", "Siapkan liputan lapangan di titik rawan", "Update berkala mengikuti perkembangan status"],
    "Waspada": ["Publikasikan imbauan kewaspadaan cuaca", "Sosialisasikan jalur & titik rawan ke warga"],
    "Siaga": ["Informasi cuaca rutin ke publik"],
    "Aman": ["Info kondisi cuaca normal ke publik"],
  },
  "PLN": {
    "Tinggi": ["Siagakan tim reaksi cepat gangguan jaringan", "Antisipasi pohon tumbang & gangguan kabel", "Siapkan genset cadangan di lokasi kritis"],
    "Waspada": ["Siaga gangguan jaringan akibat angin/hujan", "Patroli jaringan di titik rawan"],
    "Siaga": ["Pemantauan rutin jaringan distribusi"],
    "Aman": ["Operasional distribusi listrik berjalan normal"],
  },
};

function decisionActions(stakeholder, topRisk){
  return DECISION_RULES[stakeholder.name][topRisk];
}
// Versi ringkas (aksi prioritas pertama) — dipakai di konteks yang butuh satu baris (mis. WhatsApp Brief)
function decisionFor(stakeholder, topRisk){
  return decisionActions(stakeholder, topRisk)[0];
}

function renderPriority(){
  const sorted = [...REGIONS].sort((a,b)=> b.score - a.score);
  const el = document.getElementById('priorityList');
  el.innerHTML = sorted.map((r,i)=>{
    const rankCls = i===0?'rank-1':i===1?'rank-2':i===2?'rank-3':'rank-other';
    return `<div class="priority-item">
      <div class="rank-badge ${rankCls}">${i+1}</div>
      <div>
        <div class="priority-name">${r.name}</div>
        <div class="priority-sub">${r.phenomena.join(' · ')}</div>
      </div>
      <div class="priority-score">
        <div class="risk-pill ${pillClass[r.risk]}">${r.risk}</div>
        <div class="priority-sub">Skor ${r.score}</div>
      </div>
    </div>`;
  }).join('');
}

function renderImpact(){
  const impacts = [
    {icon:"fa-solid fa-water", lbl:"Genangan", region:"Samarinda, Kukar"},
    {icon:"fa-solid fa-hill-rockslide", lbl:"Longsor", region:"Kutai Timur, Berau"},
    {icon:"fa-solid fa-tree", lbl:"Pohon Tumbang", region:"Samarinda, Balikpapan"},
    {icon:"fa-solid fa-wind", lbl:"Angin Kencang", region:"Kutim, Kukar, Bontang"},
    {icon:"fa-solid fa-water", lbl:"Gelombang Tinggi", region:"Berau, Bontang"},
  ];
  document.getElementById('impactList').innerHTML = impacts.map(i=>`
    <div class="impact-mini">
      <i class="${i.icon}"></i>
      <div><div class="lbl">${i.lbl}</div><div class="region">${i.region}</div></div>
    </div>`).join('');
}

function topRiskOverall(){
  const sorted = [...REGIONS].sort((a,b)=> riskOrder[a.risk]-riskOrder[b.risk]);
  return sorted[0].risk;
}

function renderStakeholders(){
  const topRisk = topRiskOverall();
  document.getElementById('stakeholderList').innerHTML = STAKEHOLDERS.map(s=>{
    const actions = decisionActions(s, topRisk);
    const actionList = actions.map(a=>`<li>${a}</li>`).join('');
    return `
    <div class="stakeholder-row">
      <div class="stakeholder-icon"><i class="${s.icon}"></i></div>
      <div>
        <div class="stakeholder-name">${s.name}</div>
        <ul class="stakeholder-action-list">${actionList}</ul>
      </div>
    </div>`;
  }).join('');
}

let map;
function regionByName(name){
  return REGIONS.find(r=>r.name===name);
}
function renderMap(){
  map = L.map('map', {scrollWheelZoom:false}).setView([0.9, 116.6], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:'&copy; OpenStreetMap contributors', maxZoom:12
  }).addTo(map);

  const geoLayer = L.geoJSON(KALTIM_GEOJSON, {
    style: (feature)=>{
      const r = regionByName(feature.properties.name);
      const risk = r ? r.risk : 'Aman';
      return {
        fillColor: riskColor[risk],
        color:'#ffffff',
        weight:1.3,
        fillOpacity:0.65
      };
    },
    onEachFeature: (feature, layer)=>{
      const r = regionByName(feature.properties.name);
      if(!r) return;
      layer.bindPopup(`<b>${r.name}</b><br>Risiko: <span style="color:${riskColor[r.risk]}"><b>${r.risk}</b></span><br>Skor: ${r.score}<br>Fenomena: ${r.phenomena.join(', ')}`);
      layer.on('mouseover', ()=> layer.setStyle({fillOpacity:0.88, weight:2}));
      layer.on('mouseout', ()=> layer.setStyle({fillOpacity:0.65, weight:1.3}));
    }
  }).addTo(map);

  try{ map.fitBounds(geoLayer.getBounds(), {padding:[10,10]}); }catch(e){}

  // small centroid label markers for readability
  REGIONS.forEach(r=>{
    L.circleMarker([r.lat, r.lng], {radius:3, color:'#0a2540', weight:1, fillColor:'#fff', fillOpacity:1}).addTo(map);
  });
}

// ---------- Generate Smart Brief ----------
function buildWaText(){
  const sorted = [...REGIONS].sort((a,b)=> b.score-a.score).slice(0,3);
  const topRisk = topRiskOverall();
  const statusIcon = topRisk==="Tinggi"?"🔴 SIAGA":topRisk==="Waspada"?"🟠 WASPADA":topRisk==="Siaga"?"🟡 SIAGA DINI":"🟢 AMAN";
  const now = new Date();
  const jam = String(now.getHours()).padStart(2,'0')+"."+String(now.getMinutes()).padStart(2,'0');
  let txt = `⚠️ <b>BMKG</b>\n<b>METEO SNAP</b>\nProvinsi Kalimantan Timur\n\n`;
  txt += `<b>Update:</b> ${jam} WITA\n<b>Status:</b> ${statusIcon}\n\n`;
  txt += `<b>Prioritas:</b>\n`;
  sorted.forEach((r,i)=> txt += `${i+1}. ${r.name}\n`);
  txt += `\n<b>Potensi:</b>\nGenangan, Angin Kencang, Pohon Tumbang\n\n`;
  txt += `<b>Rekomendasi:</b>\n`;
  STAKEHOLDERS.slice(0,3).forEach(s=> txt += `${s.name}\n✔ ${decisionFor(s, topRisk)}\n`);
  return txt;
}

function buildExecHtml(){
  const sorted = [...REGIONS].sort((a,b)=> b.score-a.score);
  const topRisk = topRiskOverall();
  return `
  <h5>Executive Brief — METEO SNAP</h5>
  <p class="text-muted" style="font-size:.8rem;">Provinsi Kalimantan Timur · ${new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}</p>
  <p><b>Status:</b> ${topRisk}</p>
  <p><b>Ringkasan:</b> Kondisi cuaca signifikan terpantau di wilayah prioritas dengan potensi hujan lebat, angin kencang, dan gelombang tinggi.</p>
  <b>Ranking Wilayah:</b>
  <ol>${sorted.map(r=>`<li>${r.name} — <span class="risk-pill ${pillClass[r.risk]}" style="display:inline-block;">${r.risk}</span></li>`).join('')}</ol>
  <b>Rekomendasi Instansi:</b>
  <ul>${STAKEHOLDERS.map(s=>`<li><b>${s.name}:</b><ul>${decisionActions(s, topRisk).map(a=>`<li>${a}</li>`).join('')}</ul></li>`).join('')}</ul>
  `;
}

document.getElementById('generateBtn').addEventListener('click', ()=>{
  document.getElementById('waBubbleContent').innerHTML = buildWaText();
  document.getElementById('execBody').innerHTML = buildExecHtml();
  new bootstrap.Modal(document.getElementById('waModal')).show();
});
document.getElementById('btnWA').addEventListener('click', ()=>{
  if(document.getElementById('waBubbleContent').textContent.includes('Klik')) document.getElementById('waBubbleContent').innerHTML = buildWaText();
  new bootstrap.Modal(document.getElementById('waModal')).show();
});
document.getElementById('btnExec').addEventListener('click', ()=>{
  document.getElementById('execBody').innerHTML = buildExecHtml();
  new bootstrap.Modal(document.getElementById('execModal')).show();
});
document.getElementById('btnInfo').addEventListener('click', ()=> alert('Infografis generator — direncanakan pada Sprint 2.'));
document.getElementById('btnDash').addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

document.getElementById('copyWA').addEventListener('click', ()=>{
  const txt = document.getElementById('waBubbleContent').innerText;
  navigator.clipboard.writeText(txt).then(()=>{
    const btn = document.getElementById('copyWA');
    const old = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin';
    setTimeout(()=> btn.innerHTML = old, 1500);
  });
});

document.getElementById('themeToggle').addEventListener('click', function(){
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  this.innerHTML = isDark ? '<i class="fa-solid fa-moon"></i><span>Dark Mode</span>' : '<i class="fa-solid fa-sun"></i><span>Light Mode</span>';
});

function populateEngineSelector(){
  const sel = document.getElementById('engineRegion');
  sel.innerHTML = REGIONS.map(r=>`<option value="${r.name}">${r.name}</option>`).join('');
}

function renderEngineOutput(regionName, risk){
  const region = REGIONS.find(r=>r.name===regionName) || REGIONS[0];
  const box = document.getElementById('engineOutput');
  const badgeClass = pillClass[risk];
  box.innerHTML = `<div class="col-12 mb-2">
      <span style="font-size:.82rem;">IBF: <b>${region.name}</b> &rarr; </span>
      <span class="risk-pill ${badgeClass}">Risiko ${risk}</span>
    </div>` +
    STAKEHOLDERS.map(s=>`
      <div class="col-md-4">
        <div class="impact-mini" style="align-items:flex-start; margin-bottom:0;">
          <i class="${s.icon}" style="margin-top:2px;"></i>
          <div><div class="lbl">${s.name}</div><ul class="stakeholder-action-list">${decisionActions(s, risk).map(a=>`<li>${a}</li>`).join('')}</ul></div>
        </div>
      </div>`).join('');
}

document.getElementById('engineApply').addEventListener('click', ()=>{
  const region = document.getElementById('engineRegion').value;
  const risk = document.getElementById('engineRisk').value;
  renderEngineOutput(region, risk);
});

function renderLegend(){
  const items = [
    {label:'Tinggi', color: riskColor['Tinggi']},
    {label:'Waspada', color: riskColor['Waspada']},
    {label:'Siaga', color: riskColor['Siaga']},
    {label:'Aman', color: riskColor['Aman']},
  ];
  document.getElementById('mapLegend').innerHTML = items.map(i=>
    `<div class="legend-row"><span class="dot" style="background:${i.color};"></span>${i.label}</div>`
  ).join('');
}

let trendChartInstance;
function renderTrendChart(){
  // dummy 7-day status history (skor risiko rata-rata provinsi per hari)
  const days = ['13 Jul','14 Jul','15 Jul','16 Jul','17 Jul','18 Jul','19 Jul'];
  const scores = [42, 48, 55, 60, 58, 66, 71];
  const statusColor = scores.map(s=> s>=75?riskColor['Tinggi'] : s>=60?riskColor['Waspada'] : s>=45?riskColor['Siaga'] : riskColor['Aman']);
  const ctx = document.getElementById('trendChart').getContext('2d');
  if(trendChartInstance) trendChartInstance.destroy();
  trendChartInstance = new Chart(ctx, {
    type:'line',
    data:{
      labels: days,
      datasets:[{
        label:'Skor Risiko Rata-rata Provinsi',
        data: scores,
        borderColor:'#0f4c81',
        backgroundColor:'rgba(43,143,214,0.15)',
        pointBackgroundColor: statusColor,
        pointRadius:6,
        pointHoverRadius:8,
        tension:0.35,
        fill:true,
      }]
    },
    options:{
      responsive:true,
      plugins:{ legend:{ display:false } },
      scales:{ y:{ beginAtZero:true, max:100, ticks:{stepSize:20} } }
    }
  });
}

function classifyFromBMKG(entry){
  // entry: single forecast object from BMKG cuaca array (t, tp, ws, weather_desc, ...)
  const desc = (entry.weather_desc || '').toLowerCase();
  const ws = entry.ws || 0;   // wind speed km/h
  const tp = entry.tp || 0;   // precipitation mm (akumulasi periode prakiraan)
  const phenomena = [];
  let risk = 'Aman';

  if(desc.includes('petir')){
    risk = 'Tinggi'; phenomena.push('Hujan Petir');
  } else if(desc.includes('hujan lebat') || tp >= 20){
    risk = 'Tinggi'; phenomena.push('Hujan Lebat');
  } else if(desc.includes('hujan sedang') || (tp >= 10 && tp < 20)){
    risk = 'Waspada'; phenomena.push('Hujan Sedang');
  } else if(desc.includes('kabur') || desc.includes('kabut') || desc.includes('asap')){
    risk = 'Aman'; phenomena.push('Jarak Pandang Terbatas');
  } else if(desc.includes('hujan ringan') || (tp >= 1 && tp < 10)){
    risk = 'Aman'; phenomena.push('Hujan Ringan');
  } else {
    risk = 'Aman'; phenomena.push(entry.weather_desc || 'Cerah Berawan');
  }

  if(ws >= 30){
    risk = 'Tinggi'; phenomena.push('Angin Kencang');
  } else if(ws >= 20){
    if(riskOrder[risk] > riskOrder['Waspada']) risk = 'Waspada';
    phenomena.push('Angin Kencang');
  }
  return {risk, phenomena: [...new Set(phenomena)], temp: entry.t, humidity: entry.hu, wind: ws, desc: entry.weather_desc, image: entry.image, local_datetime: entry.local_datetime};
}

function scoreForRisk(risk){
  return {"Tinggi":90, "Waspada":65, "Siaga":45, "Aman":25}[risk] || 25;
}

async function fetchBMKGForecast(adm4){
  const url = `/api/weather?adm4=${adm4}`;
  const res = await fetch(url);
  if(!res.ok) throw new Error('HTTP ' + res.status);
  const json = await res.json();
  const item = json.data && json.data[0];
  if(!item || !item.cuaca || !item.cuaca[0] || !item.cuaca[0][0]){
    throw new Error('Format data tidak sesuai');
  }
  // Ambil entri prakiraan terdekat (jam pertama pada hari pertama)
  return item.cuaca[0][0];
}

let bmkgLoaded = false;
async function loadAllBMKGForecasts(){
  const statusEl = document.getElementById('bmkgStatusLine');
  const btn = document.getElementById('bmkgRefreshBtn');
  statusEl.textContent = 'Memuat data prakiraan dari data.bmkg.go.id ...';
  btn.disabled = true;

  const results = await Promise.allSettled(
    REGIONS.map(r => fetchBMKGForecast(BMKG_ADM4[r.name]))
  );

  let successCount = 0;
  results.forEach((res, i)=>{
    if(res.status === 'fulfilled'){
      const c = classifyFromBMKG(res.value);
      REGIONS[i].risk = c.risk;
      REGIONS[i].score = scoreForRisk(c.risk);
      REGIONS[i].phenomena = c.phenomena;
      REGIONS[i].bmkg = c;
      successCount++;
    } else {
      REGIONS[i].bmkg = null;
    }
  });

  bmkgLoaded = successCount > 0;
  if(successCount === REGIONS.length){
    statusEl.textContent = `Data prakiraan BMKG berhasil dimuat untuk ${successCount} wilayah. Update: ${new Date().toLocaleTimeString('id-ID')} WITA.`;
  } else if(successCount > 0){
    statusEl.textContent = `Berhasil memuat ${successCount} dari ${REGIONS.length} wilayah. Sisanya memakai data dummy (kemungkinan koneksi/CORS ke API BMKG terbatas).`;
  } else {
    statusEl.textContent = 'Tidak dapat mengambil data BMKG saat ini (kemungkinan browser memblokir permintaan lintas domain/CORS). Dashboard tetap menampilkan data dummy sebagai fallback.';
  }

  renderBmkgForecastGrid();
  renderSummaryCards();
  renderPriority();
  renderImpact();
  renderStakeholders();
  if(KALTIM_GEOJSON){
    if(map){ map.remove(); }
    renderMap();
  }
  renderLegend();
  populateEngineSelector();
  renderEngineOutput(document.getElementById('engineRegion').value || REGIONS[0].name, document.getElementById('engineRisk').value || REGIONS[0].risk);

  btn.disabled = false;
}

const statusEmoji = {"Tinggi":"🔴", "Waspada":"🟠", "Siaga":"🟡", "Aman":"🟢"};

function renderSummaryCards(){
  const topRisk = topRiskOverall();
  const statusEl = document.getElementById('statusValue');
  statusEl.textContent = `${statusEmoji[topRisk]} ${topRisk.toUpperCase()}`;
  statusEl.className = 'value status-' + topRisk.toLowerCase();

  const iconEl = document.getElementById('statusIcon');
  iconEl.style.background = riskColor[topRisk];
  iconEl.innerHTML = topRisk === 'Aman'
    ? '<i class="fa-solid fa-circle-check"></i>'
    : '<i class="fa-solid fa-triangle-exclamation"></i>';

  // Fenomena dominan: kumpulkan semua fenomena unik dari wilayah berisiko tertinggi ke bawah
  const sorted = [...REGIONS].sort((a,b)=> b.score - a.score);
  const allPhenomena = [];
  sorted.forEach(r=>{
    (r.phenomena || []).forEach(p=>{
      if(!allPhenomena.includes(p) && p !== 'Cerah' && p !== 'Berawan' && p !== 'Cerah Berawan'){
        allPhenomena.push(p);
      }
    });
  });
  document.getElementById('fenomenaValue').textContent = allPhenomena.length ? allPhenomena.slice(0,3).join(' & ') : 'Cerah Berawan';

  const now = new Date();
  const jam = String(now.getHours()).padStart(2,'0') + '.' + String(now.getMinutes()).padStart(2,'0');
  document.getElementById('lastUpdate').textContent = jam + ' WITA';
  const tglOpts = { day:'numeric', month:'short', year:'numeric' };
  document.getElementById('periodeValue').textContent = 'Periode potensi: ' + now.toLocaleDateString('id-ID', tglOpts);
}

function renderBmkgForecastGrid(){
  const grid = document.getElementById('bmkgForecastGrid');
  grid.innerHTML = REGIONS.map(r=>{
    const b = r.bmkg;
    if(!b){
      return `<div class="col-md-4 col-sm-6">
        <div class="bmkg-card">
          <div>
            <div class="nm">${r.name}</div>
            <div class="desc">Data tidak tersedia (fallback dummy)</div>
          </div>
        </div>
      </div>`;
    }
    return `<div class="col-md-4 col-sm-6">
      <div class="bmkg-card">
        <img src="${b.image}" alt="${b.desc}" onerror="this.style.display='none'">
        <div>
          <div class="nm">${r.name}</div>
          <div class="desc">${b.desc} &middot; ${b.temp}&deg;C</div>
          <div class="meta">Kelembapan ${b.humidity}% &middot; Angin ${b.wind} km/j</div>
        </div>
      </div>
    </div>`;
  }).join('');
}

document.getElementById('bmkgRefreshBtn').addEventListener('click', loadAllBMKGForecasts);

const AUTO_REFRESH_MS = 10 * 60 * 1000; // 10 menit
let autoRefreshTimer = null;

function startAutoRefresh(){
  if(autoRefreshTimer) clearInterval(autoRefreshTimer);
  autoRefreshTimer = setInterval(loadAllBMKGForecasts, AUTO_REFRESH_MS);
}
function stopAutoRefresh(){
  if(autoRefreshTimer) clearInterval(autoRefreshTimer);
  autoRefreshTimer = null;
}
document.getElementById('autoRefreshToggle').addEventListener('change', function(){
  if(this.checked){ startAutoRefresh(); } else { stopAutoRefresh(); }
});
// Muat ulang otomatis begitu tab kembali aktif setelah lama tidak dilihat (mis. dibuka semalaman)
document.addEventListener('visibilitychange', ()=>{
  if(document.visibilityState === 'visible' && document.getElementById('autoRefreshToggle').checked){
    loadAllBMKGForecasts();
  }
});

let KALTIM_GEOJSON = null;

async function initDashboard(){
  try{
    const res = await fetch('assets/kaltim.geojson');
    KALTIM_GEOJSON = await res.json();
  }catch(e){
    console.error('Gagal memuat assets/kaltim.geojson', e);
  }

  renderPriority();
  renderImpact();
  renderStakeholders();
  if(KALTIM_GEOJSON) renderMap();
  renderLegend();
  renderTrendChart();
  populateEngineSelector();
  renderEngineOutput(REGIONS[0].name, REGIONS[0].risk);
  loadAllBMKGForecasts();
  if(document.getElementById('autoRefreshToggle').checked){
    startAutoRefresh();
  }
}

initDashboard();
