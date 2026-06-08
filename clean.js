const fs = require('fs');

let html = fs.readFileSync('Dashboard Standard Lab.html', 'utf8');

// 1. Title and header strings
html = html.replace('<title>Blood Collection Dashboard', '<title>Standard Lab Dashboard');
html = html.replace('<h1>Blood Collection</h1>', '<h1>Standard Lab & Test Statistics</h1>');
html = html.replace('<p>ภาควิชาเวชศาสตร์การธนาคารเลือด</p>', '<p>ห้องเลือดแดงมาตรฐาน · มหาวิทยาลัยมหิดล</p>');
html = html.replace('🩸 หมวดผู้บริจาคโลหิต (Donor Categories)', '📊 หมวดหมู่การทดสอบ (Key Test Categories)');

// 2. Remove chart rows 3 and 4 entirely
const row3Start = html.indexOf('<div class="chart-row" id="row3"');
if (row3Start !== -1) {
    const row3End = html.indexOf('<div class="chart-row" id="row4"', row3Start);
    if (row3End !== -1) {
        const row4End = html.indexOf('<!-- ===== ANALYSIS SECTION ===== -->', row3End);
        html = html.substring(0, row3Start) + html.substring(row4End);
    }
}

// 3. Remove analysis section entirely
const analysisStart = html.indexOf('<!-- ===== ANALYSIS SECTION ===== -->');
if (analysisStart !== -1) {
    const analysisEnd = html.indexOf('<!-- ===== FOOTER ===== -->', analysisStart);
    html = html.substring(0, analysisStart) + html.substring(analysisEnd);
}

// 4. Fix CSS blood-theme to std-theme
html = html.replace('.blood-theme .nav-link.active', '.std-theme .nav-link.active');

// 5. Save back
fs.writeFileSync('Dashboard Standard Lab.html', html, 'utf8');
console.log('Cleaned up HTML with Node.js');
