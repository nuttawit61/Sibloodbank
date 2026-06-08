import re
import sys

with open('Dashboard Blood Collection.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update Title and Headers
html = html.replace('<title>Blood Collection Dashboard</title>', '<title>Standard Lab Dashboard</title>')
html = html.replace('<h1>Blood Collection Statistics</h1>', '<h1>Standard Lab & Test Statistics</h1>')
html = html.replace('<p>ห้องรับบริจาคเลือด · มหาวิทยาลัยมหิดล</p>', '<p>ห้องเลือดแดงมาตรฐาน · มหาวิทยาลัยมหิดล</p>')
html = html.replace('สถิติการรับบริจาคเลือด', 'สถิติห้องเลือดแดงมาตรฐาน')

# 2. Update Nav Menu Active Class
nav_old = '''<a href="Dashboard Blood Collection.html" class="nav-link active">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        Blood Collection
      </a>'''
nav_new = '''<a href="Dashboard Blood Collection.html" class="nav-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        Blood Collection
      </a>'''
html = html.replace(nav_old, nav_new)

nav_std_old = '''<a href="Dashboard Standard Lab.html" class="nav-link">'''
nav_std_new = '''<a href="Dashboard Standard Lab.html" class="nav-link active">'''
html = html.replace(nav_std_old, nav_std_new)

# 3. Update Theme
html = html.replace('class="header blood-theme"', 'class="header std-theme"')
css_theme = '''
    /* Teal theme for Standard Lab active tab */
    .std-theme .nav-link.active {
      background: var(--teal-lt);
      color: var(--teal);
    }
'''
html = html.replace('/* Purple theme for Hemapheresis active tab */', css_theme + '\n    /* Purple theme for Hemapheresis active tab */')

# 4. Replace Data Block
with open('mapped_standard.js', 'r', encoding='utf-8') as f:
    std_data = f.read()

# Remove old BC data
html = re.sub(r'const BC64 = \{.*?\};', '', html, flags=re.DOTALL)
html = re.sub(r'const BC65 = \{.*?\};', '', html, flags=re.DOTALL)
html = re.sub(r'const BC66 = \{.*?\};', '', html, flags=re.DOTALL)
html = re.sub(r'const BC67 = \{.*?\};', '', html, flags=re.DOTALL)
html = re.sub(r'const BC68 = \{.*?\};', '', html, flags=re.DOTALL)
html = re.sub(r'const BC69 = \{.*?\};', '', html, flags=re.DOTALL)
html = re.sub(r'// Mapped Blood Collection Data for Dashboard', std_data, html)

# 5. Change functions
html = html.replace('eval(BC)', 'eval(STD)')
html = html.replace('eval(BC)', 'eval(STD)')
html = html.replace('eval(	ypeof BC', 'eval(	ypeof STD')

with open('Dashboard Standard Lab.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Base updates completed!")
