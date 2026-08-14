import re
import os

with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

with open('screen.html', 'r', encoding='utf-8') as f:
    screen_html = f.read()

# Extract dashboard content from screen.html
# It is inside <div class="p-10 max-w-7xl mx-auto space-y-8 gap-10"> to the end </div> of main
match = re.search(r'(<div class="p-10 max-w-7xl mx-auto space-y-8 gap-10">.*?</div>)\s*</main>', screen_html, re.DOTALL)
if match:
    dashboard_html = match.group(1)
    
    # Inject dynamic formattedPipeline
    dashboard_html = dashboard_html.replace('$101,500', '${formattedPipeline}')
    # Remove script tags or backticks if any
    dashboard_html = dashboard_html.replace('`', '\\`')
    
    # Now build the new renderOverview
    new_render = '  ca.innerHTML = `\n    <!-- Dashboard Content -->\n    ' + dashboard_html.strip() + '\n  `;'
    
    # Find the current ca.innerHTML assignment block in app_js inside renderOverview()
    # It starts with ca.innerHTML = ` and ends with `; right after the Growth Velocity Chart Placeholder
    app_js = re.sub(r'ca\.innerHTML = `.*?`;', new_render, app_js, count=1, flags=re.DOTALL)
    
    with open('app.js', 'w', encoding='utf-8') as f:
        f.write(app_js)
    print('Successfully updated app.js renderOverview')
else:
    print('Failed to extract dashboard from screen.html')
