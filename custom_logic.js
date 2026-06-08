// =====================================================
//  MONTH DETAIL PANEL
// =====================================================
function renderMonthPanel() {
  const panel = document.getElementById('monthDetailPanel');
  if (selectedMonth === null) {
    panel.style.display = 'none';
    return;
  }
  panel.style.display = 'flex';
  
  const mName = MONTHS_FY[selectedMonth];
  const d = currentData();
  const getV = (key) => { const v = d[key][selectedMonth]; return v !== null ? v : 0; };
  
  const abo = getV('test_abo');
  const xmatch = getV('test_xmatch');
  const dat = getV('test_dat');
  
  const html = 
    <div class="mdp-header">
      <h4>ข้อมูลประจำเดือน +mName+ +selectedYear+</h4>
    </div>
    <div class="mdp-stats">
      <div class="mdp-stat">
        <div class="mdp-stat-val">+fmt(abo)+</div>
        <div class="mdp-stat-lbl">ABO/Rh Tests</div>
      </div>
      <div class="mdp-stat">
        <div class="mdp-stat-val">+fmt(xmatch)+</div>
        <div class="mdp-stat-lbl">Crossmatch</div>
      </div>
      <div class="mdp-stat">
        <div class="mdp-stat-val">+fmt(dat)+</div>
        <div class="mdp-stat-lbl">DAT</div>
      </div>
    </div>
    <button class="btn-close-mdp" onclick="selectMonth(null)">ปิด</button>
  ;
  panel.innerHTML = html;
}

// =====================================================
//  KPI GRID
// =====================================================
function d2badge(d, prevYear) {
  if (d > 0) return <span class="kpi-badge up">↑ +d+% (เทียบ +prevYear+)</span>;
  if (d < 0) return <span class="kpi-badge down">↓ +Math.abs(d)+% (เทียบ +prevYear+)</span>;
  return <span class="kpi-badge">≈ 0% (เทียบ +prevYear+)</span>;
}

function renderKPIs() {
  const idxs = getCurrentIdxs();
  const cData = currentData();
  const pData = prevData();
  
  const aboTest = sumOf('test_abo', idxs);
  const aboPrev = pData ? sumOf('test_abo', idxs, pData) : 0;
  
  const xmatchTest = sumOf('test_xmatch', idxs);
  const xmatchPrev = pData ? sumOf('test_xmatch', idxs, pData) : 0;
  
  const datTest = sumOf('test_dat', idxs);
  const datPrev = pData ? sumOf('test_dat', idxs, pData) : 0;

  const abScreen = sumOf('lab_bg_ab_screen', idxs);
  const abScreenPrev = pData ? sumOf('lab_bg_ab_screen', idxs, pData) : 0;

  const kpis = [
    {
      icon: '🧪', label: 'Blood Group ABO (Test)', val: fmt(aboTest),
      sub: 'รวมจำนวนการตรวจ ABO', color: 'var(--blue)', bg: 'var(--blue-lt)',
      badge: d2badge(delta(aboTest, aboPrev), selectedYear - 1)
    },
    {
      icon: '🔬', label: 'Crossmatch (Test)', val: fmt(xmatchTest),
      sub: 'การทดสอบความเข้ากันได้', color: 'var(--teal)', bg: 'var(--teal-lt)',
      badge: d2badge(delta(xmatchTest, xmatchPrev), selectedYear - 1)
    },
    {
      icon: '🧬', label: 'DAT (Test)', val: fmt(datTest),
      sub: 'Direct Antiglobulin Test', color: 'var(--indigo)', bg: 'var(--indigo-lt)',
      badge: d2badge(delta(datTest, datPrev), selectedYear - 1)
    },
    {
      icon: '🔍', label: 'Antibody Screen (Lab)', val: fmt(abScreen),
      sub: 'การตรวจกรองแอนติบอดี', color: 'var(--purple)', bg: 'var(--purple-lt)',
      badge: d2badge(delta(abScreen, abScreenPrev), selectedYear - 1)
    }
  ];

  const grid = document.getElementById('kpiGrid');
  grid.innerHTML = kpis.map(k => 
    <div class="kpi-card fade-up" style="--kpi-color:+k.color+; --kpi-bg:+k.bg+;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div class="kpi-icon-wrap">+k.icon+</div>
        +(k.badge ? k.badge : '')+
      </div>
      <div class="kpi-label">+k.label+</div>
      <div class="kpi-value">+k.val+</div>
      <div class="kpi-sub">+k.sub+</div>
    </div>
  ).join('');
}

// =====================================================
//  DONOR CATEGORIES SECTION (REPURPOSED)
// =====================================================
function renderDonorCategories() {
  const idxs = getCurrentIdxs();
  
  const hdfn = sumOf('lab_total_case_hdfn', idxs);
  const anc = sumOf('lab_anc_abo_rh', idxs);
  const iat = sumOf('test_iat', idxs);
  const abIden = sumOf('test_iden', idxs);
  const bgAbo = sumOf('lab_bg_abo', idxs);

  const categories = [
    { icon: '🩸', label: 'HDFN Cases', val: fmt(hdfn), sub: 'จำนวน Case รวม', color: 'var(--red)', bg: 'var(--red-lt)' },
    { icon: '🤰', label: 'ANC Blood Group', val: fmt(anc), sub: 'ตรวจครรภ์', color: 'var(--pink)', bg: 'var(--pink-lt)' },
    { icon: '🧫', label: 'IAT Test', val: fmt(iat), sub: 'Indirect Antiglobulin', color: 'var(--amber)', bg: 'var(--amber-lt)' },
    { icon: '📌', label: 'Ab-Identification', val: fmt(abIden), sub: 'ระบุชนิดแอนติบอดี', color: 'var(--orange)', bg: 'var(--orange-lt)' },
    { icon: '💉', label: 'Blood Group ABO (Lab)', val: fmt(bgAbo), sub: 'ตรวจกรุ๊ปเลือด (Lab)', color: 'var(--cyan)', bg: 'var(--cyan-lt)' }
  ];

  const grid = document.getElementById('donorCatGrid');
  grid.innerHTML = categories.map(c => 
    <div class="kpi-card fade-up" style="--kpi-color:+c.color+; --kpi-bg:+c.bg+;">
      <div class="kpi-icon-wrap">+c.icon+</div>
      <div class="kpi-label">+c.label+</div>
      <div class="kpi-value">+c.val+</div>
      <div class="kpi-sub">+c.sub+</div>
    </div>
  ).join('');
}

// =====================================================
//  DATA TABLE RENDER
// =====================================================
function renderTable() {
  const idxs = getCurrentIdxs();
  const activeSet = new Set(selectedMonth !== null ? [selectedMonth] : []);
  const tableIdxs = getAvailableIdxs();

  const thead = 
    <thead>
      <tr>
        <th class="text-left">หมวดหมู่</th>
        <th class="text-left">รายการทดสอบ</th>
        +tableIdxs.map(i => <th class="+(activeSet.has(i)?'active-month-col':'')+"><span style="font-size:13px;font-weight:800;">+MONTHS_FY[i]+</span><br/><span style="font-size:9px;color:inherit;opacity:.7">+selectedYear+</span></th>).join('')+
        <th class="col-total">รวมปี +selectedYear+</th>
      </tr>
    </thead>
  ;

  const totalCell = (key) => {
    const t = sumOf(key, getAvailableIdxs());
    return <td class="col-total">+fmt(t)+</td>;
  };

  const row = (category, name, key) => {
    let cells = '';
    const arr = currentData()[key];
    
    tableIdxs.forEach(i => {
      const activeClass = activeSet.has(i) ? 'active-month-col' : '';
      let valText = '–';
      if (arr && arr[i] !== null) {
        valText = fmt(arr[i]);
      }
      cells += <td class="+activeClass+">+valText+</td>;
    });

    return 
      <tr>
        <td class="text-left" style="font-weight: 600; color: var(--text-2);">+category+</td>
        <td class="text-left">+name+</td>
        +cells+
        +totalCell(key)+
      </tr>
    ;
  };

  const tbody = 
    <tbody>
      <tr class="section-header"><td colspan="+(tableIdxs.length + 3)+">Standard Lab</td></tr>
      +row('HDFN', 'Blood group Coombs Test & HDFN', 'lab_abo_rh_hdfn')+
      +row('HDFN', 'DAT', 'lab_dat')+
      +row('HDFN', 'IAT-Ab screening', 'lab_iat_ab_screen')+
      +row('HDFN', 'X-match HDFN', 'lab_xmatch_hdfn')+
      +row('HDFN', 'Total Case', 'lab_total_case_hdfn')+
      +row('ANC', 'ABO, Rh, Ab Screen', 'lab_anc_abo_rh')+
      +row('Blood Group', 'ABO', 'lab_bg_abo')+
      +row('Blood Group', 'Rh', 'lab_bg_rh')+
      +row('Blood Group', 'Ab screening', 'lab_bg_ab_screen')+
      +row('Standard Cells', 'ABO Cell (A,B,O)', 'lab_cell_abo')+
      
      <tr class="section-header"><td colspan="+(tableIdxs.length + 3)+">Standard Test</td></tr>
      +row('Test', 'ABO', 'test_abo')+
      +row('Test', 'Rh', 'test_rh')+
      +row('Test', 'DAT', 'test_dat')+
      +row('Test', 'IAT', 'test_iat')+
      +row('Test', 'X-match', 'test_xmatch')+
      +row('Test', 'Identification', 'test_iden')+
    </tbody>
  ;

  const table = document.getElementById('dataTable');
  if (table) table.innerHTML = thead + tbody;
}

// =====================================================
//  CHARTING LOGIC
// =====================================================
let chartLine = null;
let chartBar = null;

function destroyCharts() {
  if (chartLine) chartLine.destroy();
  if (chartBar) chartBar.destroy();
}

function buildCharts() {
  destroyCharts();
  const cData = currentData();
  const pData = prevData();
  
  const elTrend = document.getElementById('chartDonation');
  if (elTrend) {
    chartLine = new Chart(elTrend, {
      type: 'line',
      data: {
        labels: MONTHS_FY,
        datasets: [
          {
            label: 'ABO Tests (Test)',
            data: cData.test_abo,
            borderColor: '#1a6fe0',
            backgroundColor: 'rgba(26,111,224,0.1)',
            fill: true,
            tension: 0.3, borderWidth: 2, pointRadius: 4
          },
          {
            label: 'DAT Tests (Test)',
            data: cData.test_dat,
            borderColor: '#e0284f',
            backgroundColor: 'transparent',
            tension: 0.3, borderWidth: 2, pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  const elComp = document.getElementById('chartDonors');
  if (elComp) {
    chartBar = new Chart(elComp, {
      type: 'bar',
      data: {
        labels: MONTHS_FY,
        datasets: [
          {
            label: 'Crossmatch HDFN',
            data: cData.lab_xmatch_hdfn,
            backgroundColor: '#0ea5e9',
            borderRadius: 4
          },
          {
            label: 'Ab-Identification (Test)',
            data: cData.test_iden,
            backgroundColor: '#8b5cf6',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
}

// =====================================================
//  REFRESH TRIGGER
