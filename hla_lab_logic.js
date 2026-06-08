// hla_lab_logic.js
// Logic for HLA Laboratory Dashboard

const HLA_YEARS = {
  2564: typeof HLA2564 !== 'undefined' ? HLA2564 : null,
  2565: typeof HLA2565 !== 'undefined' ? HLA2565 : null,
  2566: typeof HLA2566 !== 'undefined' ? HLA2566 : null,
  2567: typeof HLA2567 !== 'undefined' ? HLA2567 : null,
  2568: typeof HLA2568 !== 'undefined' ? HLA2568 : null,
  2569: typeof HLA2569 !== 'undefined' ? HLA2569 : null
};

// Global State
let selectedYear = 2569;
let selectedMonth = null; // null means all months
let dataOk = true;

const MONTHS_FY = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
const MONTHS_FULL_FY = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
const YEARS = [2564, 2565, 2566, 2567, 2568, 2569];

function getAvailableIdxs() {
  const d = HLA_YEARS[selectedYear];
  if (!d) return [];
  let available = [];
  for (let i = 0; i < 12; i++) {
    // If any key has data for this month, it's available
    let hasVal = false;
    for (let k in d) {
      if (d[k] && d[k][i] !== null) {
        hasVal = true;
        break;
      }
    }
    if (hasVal) available.push(i);
  }
  return available;
}

function hasData(idx) {
  return getAvailableIdxs().includes(idx);
}

function safeSum(arr, monthIdx = null) {
  if (!arr) return 0;
  if (monthIdx !== null) {
    let val = parseFloat(arr[monthIdx]);
    return isNaN(val) ? 0 : val;
  }
  return arr.reduce((acc, val) => {
    let v = parseFloat(val);
    return acc + (isNaN(v) ? 0 : v);
  }, 0);
}

function refresh() {
  const dataset = HLA_YEARS[selectedYear];
  if (!dataset) {
    document.getElementById('kpi-val-1').textContent = 'N/A';
    dataOk = false;
    return;
  }
  dataOk = true;
  
  // 1. Calculate Aggregates
  const lympho_patient = safeSum(dataset.hla_lympho_patient, selectedMonth);
  const lympho_donor = safeSum(dataset.hla_lympho_donor, selectedMonth);
  const lympho_panel = safeSum(dataset.hla_lympho_panel, selectedMonth);
  const lympho_granu = safeSum(dataset.hla_lympho_granu, selectedMonth);
  const lympho_total = lympho_patient + lympho_donor + lympho_panel + lympho_granu;

  const class1_kt = safeSum(dataset.hla_class1_kt, selectedMonth);
  const class1_bmt = safeSum(dataset.hla_class1_bmt, selectedMonth);
  const class1_plt = safeSum(dataset.hla_class1_plt_pher, selectedMonth);
  const class1_pt = safeSum(dataset.hla_class1_pt_tt, selectedMonth);
  const class1_total = class1_kt + class1_bmt + class1_plt + class1_pt;

  const b27_siriraj = safeSum(dataset.hla_b27_siriraj, selectedMonth);
  const b27_center = safeSum(dataset.hla_b27_center, selectedMonth);
  const b27_total = b27_siriraj + b27_center;

  const cdc_kt = safeSum(dataset.hla_cdc_kt, selectedMonth);
  const cdc_re = safeSum(dataset.hla_cdc_re, selectedMonth);
  const cdc_granu = safeSum(dataset.hla_cdc_granu, selectedMonth);
  const cdc_total = cdc_kt + cdc_re + cdc_granu;

  const fcxm_kt = safeSum(dataset.hla_fcxm_kt, selectedMonth);
  const fcxm_re = safeSum(dataset.hla_fcxm_re, selectedMonth);
  const fcxm_total = fcxm_kt + fcxm_re;

  const xm_total = cdc_total + fcxm_total;

  const plt_ab_patient = safeSum(dataset.hla_plt_ab_patient, selectedMonth);
  const plt_ab_neg = safeSum(dataset.hla_plt_ab_neg, selectedMonth);
  const plt_ab_pos = safeSum(dataset.hla_plt_ab_pos, selectedMonth);
  
  const plt_xm_case = safeSum(dataset.hla_plt_xm_case, selectedMonth);
  const plt_xm_neg = safeSum(dataset.hla_plt_xm_unit_neg, selectedMonth);
  const plt_xm_pos = safeSum(dataset.hla_plt_xm_unit_pos, selectedMonth);
  const plt_xm_total = plt_xm_neg + plt_xm_pos;

  const serum_auto = safeSum(dataset.hla_serum_auto, selectedMonth);
  const serum_allo = safeSum(dataset.hla_serum_allo, selectedMonth);
  const serum_prp = safeSum(dataset.hla_serum_prp, selectedMonth);
  const serum_total = serum_auto + serum_allo + serum_prp;
  
  const serum_opd = safeSum(dataset.hla_serum_src_opd, selectedMonth);
  const serum_ward = safeSum(dataset.hla_serum_src_ward, selectedMonth);
  const serum_siph = safeSum(dataset.hla_serum_src_siph, selectedMonth);

  const rc_rhd = safeSum(dataset.hla_rc_geno_rhd, selectedMonth);
  const rc_rhdel = safeSum(dataset.hla_rc_geno_rhdel, selectedMonth);
  const rc_kidd = safeSum(dataset.hla_rc_geno_kidd, selectedMonth);
  const rc_duffy = safeSum(dataset.hla_rc_geno_duffy, selectedMonth);
  const rc_fc_rhdel = safeSum(dataset.hla_rc_geno_fc_rhdel, selectedMonth);
  const rc_total = rc_rhd + rc_rhdel + rc_kidd + rc_duffy + rc_fc_rhdel;

  const ag_kell = safeSum(dataset.hla_rbc_ag_kell, selectedMonth);

  // 2. Update KPIs
  document.getElementById('kpi-val-1').textContent = lympho_total.toLocaleString();
  document.getElementById('kpi-val-2').textContent = class1_total.toLocaleString();
  document.getElementById('kpi-val-3').textContent = xm_total.toLocaleString();
  document.getElementById('kpi-val-4').textContent = plt_xm_case.toLocaleString();

  // 3. Update Tables
  renderTable(dataset);

  // 4. Navigation UI
  buildYearTabs();
  buildMonthTabs();
}

function renderTable(dataset) {
  const tbody = document.querySelector('#table-standard tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  
  let seq = 1;

  function addRow(label, key, isTotal=false) {
    let val = 0;
    if (typeof key === 'string') {
      val = safeSum(dataset[key], selectedMonth);
    } else {
      val = key; // already calculated
    }
    const tr = document.createElement('tr');
    if (isTotal) {
      tr.className = 'col-total';
      tr.innerHTML = `
        <td class="sticky-seq"></td>
        <td class="sticky-item"><strong>${label}</strong></td>
        <td class="val"><strong>${val.toLocaleString()}</strong></td>
      `;
    } else {
      tr.innerHTML = `
        <td class="sticky-seq">${seq++}</td>
        <td class="sticky-item">${label}</td>
        <td class="val">${val.toLocaleString()}</td>
      `;
    }
    tbody.appendChild(tr);
  }

  function addGroup(label) {
    const tr = document.createElement('tr');
    tr.className = 'col-total';
    tr.innerHTML = `
      <td class="sticky-seq"></td>
      <td class="sticky-item" colspan="2" style="text-align: left;"><strong>${label}</strong></td>
    `;
    tbody.appendChild(tr);
  }

  // 1. Lymphocyte Separation
  addGroup('1. Lymphocyte Separation');
  addRow('1.1 Patient', 'hla_lympho_patient');
  addRow('1.2 Donor', 'hla_lympho_donor');
  addRow('1.3 Panel cell / Donor SDP', 'hla_lympho_panel');
  addRow('1.4 For Granulocyte Crossmatch', 'hla_lympho_granu');
  addRow('รวม Lymphocyte Separation', safeSum(dataset.hla_lympho_patient, selectedMonth) + safeSum(dataset.hla_lympho_donor, selectedMonth) + safeSum(dataset.hla_lympho_panel, selectedMonth) + safeSum(dataset.hla_lympho_granu, selectedMonth), true);

  // 2. HLA Class I typing
  addGroup('2. HLA Class I typing - serology');
  addRow('2.1 KT & LRD', 'hla_class1_kt');
  addRow('2.2 Donor BMT', 'hla_class1_bmt');
  addRow('2.3 Donor Plt.Pheresis', 'hla_class1_plt_pher');
  addRow('2.4 Pt. TT for search Plt.', 'hla_class1_pt_tt');
  addRow('รวม HLA Class I typing', safeSum(dataset.hla_class1_kt, selectedMonth) + safeSum(dataset.hla_class1_bmt, selectedMonth) + safeSum(dataset.hla_class1_plt_pher, selectedMonth) + safeSum(dataset.hla_class1_pt_tt, selectedMonth), true);

  // 3. HLA-B27
  addGroup('3. HLA-B27 typing');
  addRow('ศิริราช, SIPH, H solution', 'hla_b27_siriraj');
  addRow('ศูนย์บริการโลหิตแห่งชาติ', 'hla_b27_center');
  addRow('รวม HLA-B27 typing', safeSum(dataset.hla_b27_siriraj, selectedMonth) + safeSum(dataset.hla_b27_center, selectedMonth), true);

  // 4. Crossmatch
  addGroup('4. Lymphocyte crossmatch (CDC)');
  addRow('4.1 For KT - LRD', 'hla_cdc_kt');
  addRow('4.2 Re crossmatch', 'hla_cdc_re');
  addRow('4.3 For Granulocyte-CDC-XM Pt+Donor', 'hla_cdc_granu');
  addRow('รวม CDC Crossmatch', safeSum(dataset.hla_cdc_kt, selectedMonth) + safeSum(dataset.hla_cdc_re, selectedMonth) + safeSum(dataset.hla_cdc_granu, selectedMonth), true);

  addGroup('5. Flowcytometry crossmatch (FCXM)');
  addRow('5.1 KT - LRD', 'hla_fcxm_kt');
  addRow('5.2 Re crossmatch', 'hla_fcxm_re');
  addRow('รวม FCXM Crossmatch', safeSum(dataset.hla_fcxm_kt, selectedMonth) + safeSum(dataset.hla_fcxm_re, selectedMonth), true);

  // 6. Platelet Antibody
  addGroup('6. Platelet Antibody screening');
  addRow('Patient (จำนวนผู้ป่วย)', 'hla_plt_ab_patient');
  addRow('Negative', 'hla_plt_ab_neg');
  addRow('Positive', 'hla_plt_ab_pos');

  // 7. Platelet Crossmatching
  addGroup('7. Platelet Crossmatching');
  addRow('Crossmatching Cases', 'hla_plt_xm_case');
  addRow('Donors (Unit) - Negative', 'hla_plt_xm_unit_neg');
  addRow('Donors (Unit) - Positive', 'hla_plt_xm_unit_pos');
  addRow('รวม Donors (Unit)', safeSum(dataset.hla_plt_xm_unit_neg, selectedMonth) + safeSum(dataset.hla_plt_xm_unit_pos, selectedMonth), true);

  // 8. Serum derived drop
  addGroup('8. Serum derived drop');
  addRow('8.1 Autologous', 'hla_serum_auto');
  addRow('8.2 Allogenic', 'hla_serum_allo');
  addRow('8.3 PRP from blood donor', 'hla_serum_prp');
  addRow('รวม Serum derived drop', safeSum(dataset.hla_serum_auto, selectedMonth) + safeSum(dataset.hla_serum_allo, selectedMonth) + safeSum(dataset.hla_serum_prp, selectedMonth), true);

  // 9. Red cell genotyping
  addGroup('9. Red cell genotyping');
  addRow('9.1 Multiplex Rh D (in-house)', 'hla_rc_geno_rhd');
  addRow('9.2 Rh Del (in-house)', 'hla_rc_geno_rhdel');
  addRow('9.3 Kidd (in-house)', 'hla_rc_geno_kidd');
  addRow('9.4 Duffy (in-house)', 'hla_rc_geno_duffy');
  addRow('9.5 Flow cytometry-Rh Del', 'hla_rc_geno_fc_rhdel');
  addRow('รวม Red cell genotyping', safeSum(dataset.hla_rc_geno_rhd, selectedMonth) + safeSum(dataset.hla_rc_geno_rhdel, selectedMonth) + safeSum(dataset.hla_rc_geno_kidd, selectedMonth) + safeSum(dataset.hla_rc_geno_duffy, selectedMonth) + safeSum(dataset.hla_rc_geno_fc_rhdel, selectedMonth), true);

  // 10. RBC-Ag
  addGroup('10. RBC-Ag typing (microplate)');
  addRow('Kell (Microplate)', 'hla_rbc_ag_kell');
}

let chartInstances = {};

function createOrUpdateChart(id, type, labels, data, bgColor, borderColor) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  if (chartInstances[id]) {
    chartInstances[id].destroy();
  }
  chartInstances[id] = new Chart(ctx, {
    type: type,
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: bgColor,
        borderColor: borderColor,
        borderWidth: 1,
        borderRadius: type === 'bar' ? 4 : 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: type === 'pie' || type === 'doughnut' ? {} : {
        y: { beginAtZero: true, ticks: { precision: 0 } }
      }
    }
  });
}

function buildCharts() {
  const d = HLA_YEARS[selectedYear];
  if (!d) return;

  const mIdxs = getAvailableIdxs();
  let labels = [];
  let dataLympho = [];
  let dataClass1 = [];
  let dataXM = [];

  if (selectedMonth === null) {
    labels = mIdxs.map(i => MONTHS_FY[i]);
    for (let i of mIdxs) {
      const lympho = safeSum(d.hla_lympho_patient, i) + safeSum(d.hla_lympho_donor, i) + safeSum(d.hla_lympho_panel, i) + safeSum(d.hla_lympho_granu, i);
      dataLympho.push(lympho);

      const class1 = safeSum(d.hla_class1_kt, i) + safeSum(d.hla_class1_bmt, i) + safeSum(d.hla_class1_plt_pher, i) + safeSum(d.hla_class1_pt_tt, i);
      dataClass1.push(class1);

      const xm = safeSum(d.hla_cdc_kt, i) + safeSum(d.hla_cdc_re, i) + safeSum(d.hla_cdc_granu, i) + safeSum(d.hla_fcxm_kt, i) + safeSum(d.hla_fcxm_re, i);
      dataXM.push(xm);
    }
  } else {
    labels = [MONTHS_FULL_FY[selectedMonth]];
    const lympho = safeSum(d.hla_lympho_patient, selectedMonth) + safeSum(d.hla_lympho_donor, selectedMonth) + safeSum(d.hla_lympho_panel, selectedMonth) + safeSum(d.hla_lympho_granu, selectedMonth);
    dataLympho.push(lympho);

    const class1 = safeSum(d.hla_class1_kt, selectedMonth) + safeSum(d.hla_class1_bmt, selectedMonth) + safeSum(d.hla_class1_plt_pher, selectedMonth) + safeSum(d.hla_class1_pt_tt, selectedMonth);
    dataClass1.push(class1);

    const xm = safeSum(d.hla_cdc_kt, selectedMonth) + safeSum(d.hla_cdc_re, selectedMonth) + safeSum(d.hla_cdc_granu, selectedMonth) + safeSum(d.hla_fcxm_kt, selectedMonth) + safeSum(d.hla_fcxm_re, selectedMonth);
    dataXM.push(xm);
  }

  // Common colors
  const tealColors = 'rgba(13, 148, 136, 0.7)';
  const tealBorder = 'rgba(13, 148, 136, 1)';

  createOrUpdateChart('chart1', 'bar', labels, dataLympho, tealColors, tealBorder);
  createOrUpdateChart('chart2', 'line', labels, dataClass1, tealColors, tealBorder);
  createOrUpdateChart('chart3', 'bar', labels, dataXM, 'rgba(56, 189, 248, 0.7)', 'rgba(56, 189, 248, 1)');

  // Doughnut: Serum Derived Drop Sources
  const src_opd = safeSum(d.hla_serum_src_opd, selectedMonth);
  const src_ward = safeSum(d.hla_serum_src_ward, selectedMonth);
  const src_siph = safeSum(d.hla_serum_src_siph, selectedMonth);
  createOrUpdateChart('chart4', 'doughnut', ['OPD', 'Ward', 'SIPH'], [src_opd, src_ward, src_siph], 
    ['#0ea5e9', '#0d9488', '#38bdf8'], ['#0284c7', '#0f766e', '#0284c7']);
}

function buildYearTabs() {
  const container = document.getElementById('yearTabs');
  if(!container) return;
  container.innerHTML = '';
  YEARS.forEach(y => {
    const active = selectedYear === y;
    const tab = document.createElement('div');
    tab.className = 'month-tab' + (active ? ' active' : '');
    let info = y === 2569 ? 'ม.ค. - เม.ย. (4 เดือน)' : 'ม.ค. - ธ.ค. (12 เดือน)';
    tab.innerHTML = `
      <div class="month-tab-abbr">ปี ${y}</div>
      <div class="month-tab-num">${info}</div>
      <div class="month-tab-dot"></div>
    `;
    tab.addEventListener('click', () => {
      if (selectedYear === y) return;
      selectedYear = y;
      if (selectedMonth !== null && !getAvailableIdxs().includes(selectedMonth)) {
        selectedMonth = null;
      }
      refresh();
      buildCharts();
    });
    container.appendChild(tab);
  });

  const selectedYearTag = document.getElementById('selectedYearTag');
  if (selectedYearTag) selectedYearTag.textContent = `ปีปฏิทิน ${selectedYear}`;
  
  const headerYearPill = document.getElementById('headerYearPill');
  if (headerYearPill) headerYearPill.innerHTML = `📅 ปี ${selectedYear}`;
  
  const totalMonthsStr = selectedYear === 2569 ? 'ม.ค.–เม.ย.' : 'ม.ค.–ธ.ค.';
  const headerMonthsPill = document.getElementById('headerMonthsPill');
  if (headerMonthsPill) headerMonthsPill.innerHTML = `<span class="live-dot"></span> ข้อมูล ${totalMonthsStr} ${selectedYear}`;
  
  const headerFilePill = document.getElementById('headerFilePill');
  if (headerFilePill) headerFilePill.textContent = `📄 สถิติ ${selectedYear - 2500}.xlsx`;
  
  const monthSelectorFootnote = document.getElementById('monthSelectorFootnote');
  if (monthSelectorFootnote) monthSelectorFootnote.innerHTML = `
    ปีปฏิทิน ${selectedYear} (${totalMonthsStr} ${selectedYear}) · แหล่งข้อมูล: สถิติ ${selectedYear - 2500}.xlsx (Tab: HLA)
  `;
}

function buildMonthTabs() {
  const container = document.getElementById('monthTabs');
  if (!container) return;
  container.innerHTML = '';
  MONTHS_FY.forEach((m, i) => {
    const tab = document.createElement('div');
    const isAvail = hasData(i);
    tab.className = 'month-tab' +
      (isAvail ? ' has-data' : ' disabled') +
      (selectedMonth === i ? ' active' : '');
    tab.innerHTML = `
      <div class="month-tab-abbr">${m}</div>
      <div class="month-tab-num">${selectedYear}</div>
      <div class="month-tab-dot"></div>
    `;
    tab.addEventListener('click', () => {
      if (!isAvail) return;
      if (selectedMonth === i) {
        selectedMonth = null;
      } else {
        selectedMonth = i;
      }
      refresh();
      buildCharts();
    });
    container.appendChild(tab);
  });

  const tag = document.getElementById('selectedMonthTag');
  if (!tag) return;
  if (selectedMonth === null) {
    const totalMonthsStr = selectedYear === 2569 ? 'ม.ค.–เม.ย.' : 'ม.ค.–ธ.ค.';
    tag.textContent = `รวมทุกเดือน (${totalMonthsStr} ${selectedYear})`;
  } else {
    tag.textContent = `${MONTHS_FULL_FY[selectedMonth]} ${selectedYear}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  refresh();
  buildCharts();
});
