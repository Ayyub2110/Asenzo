const fs = require('fs');
let app = fs.readFileSync('c:/Users/Administrator/Asenzo/app.js', 'utf8');

// 1. Emoji Dictionary Mapping to Exact Stroke-SVG equivalents
const emojiDict = {
  '⚡': 'bolt', '💡': 'lightbulb', '📝': 'edit_document', '🗑': 'delete', 
  '🚀': 'rocket_launch', '🧠': 'psychology', '🛡': 'shield', '🎯': 'track_changes', 
  '⚠': 'warning', '🏆': 'emoji_events', '✓': 'check', '✅': 'check_circle', 
  '❌': 'cancel', '🔍': 'search', '📋': 'content_paste', '💬': 'chat',
  '🪝': 'phishing', '📜': 'history_edu', '📈': 'trending_up', '🎧': 'headphones',
  '📄': 'description', '📖': 'menu_book', '💼': 'work', '📸': 'photo_camera',
  '📑': 'article', '✉': 'mail', '📰': 'newspaper', '👤': 'person', '👁': 'visibility',
  '🔥': 'local_fire_department', '❤': 'favorite', '🧲': 'magnet', '🔄': 'sync', 
  '🧪': 'science', '📊': 'bar_chart', '✏': 'edit', '➡': 'arrow_forward', '🔢': 'numbers',
  '🛑': 'stop', '📅': 'calendar_month', '📍': 'location_on', '💾': 'save', '★': 'star'
};

const emojiRegex = new RegExp(`[${Object.keys(emojiDict).join('')}]`, 'g');

// Global emoji replacement with safe span wrapper
app = app.replace(emojiRegex, (match) => {
  if (emojiDict[match]) {
    return `<span class="material-symbols-outlined" style="font-size:inherit; vertical-align:middle;">${emojiDict[match]}</span>`;
  }
  return match;
});

// 2. Style to Class replacement logic
const styleMap = [
  // Container Backgrounds & Cards
  { regex: /background:[#a-zA-Z0-9]+;border:1px (?:solid|dashed) #[a-zA-Z0-9]+;border-radius:\d+px;padding:\d+px;margin-bottom:\d+px/gi, rep: 'refine-card mb-16' },
  { regex: /padding:\d+px;text-align:center;background:#F8FAFC;border:1px dashed #[a-zA-Z0-9]+;border-radius:\d+px(?:;margin-bottom:\d+px)?/gi, rep: 'refine-card-dashed' },
  { regex: /background:#F8FAFC;padding:12px;border-radius:10px;border:1px solid #E2E8F0/gi, rep: 'refine-card' },
  { regex: /background:rgba\(255,255,255,0\.05\);padding:12px;border-radius:10px;border:1px solid rgba\(255,255,255,0\.1\)/gi, rep: 'refine-card' },
  
  // Layout
  { regex: /display:flex;justify-content:space-between;align-items:center/gi, rep: 'flex-between' },
  { regex: /display:flex;justify-content:space-between;align-items:flex-start/gi, rep: 'flex-between align-start' },
  { regex: /display:flex;flex-direction:column;gap:(\d+)px/gi, rep: (m, g) => `flex-col gap-${g}` },
  { regex: /display:flex;align-items:center;gap:(\d+)px/gi, rep: (m, g) => `flex-row gap-${g}` },
  { regex: /display:flex;gap:(\d+)px;align-items:center/gi, rep: (m, g) => `flex-row gap-${g}` },
  { regex: /display:flex;gap:(\d+)px/gi, rep: (m, g) => `flex-row gap-${g}` },

  // Typography
  { regex: /font-size:16px;font-weight:(700|800);color:#[A-Za-z0-9]+/gi, rep: 'txt-heading-md' },
  { regex: /font-weight:(700|800);font-size:1[3-5](?:\.5)?px;color:#[A-Za-z0-9]+/gi, rep: 'txt-heading-sm' },
  { regex: /font-size:1[3-5](?:\.5)?px;font-weight:(700|800);color:#[A-Za-z0-9]+/gi, rep: 'txt-heading-sm' },
  { regex: /font-size:13px;color:(#[A-Za-z0-9]+|var\(--text-main\))/gi, rep: 'txt-body' },
  { regex: /font-size:12(?:\.5)?px;color:(#[A-Za-z0-9]+|var\(--text-muted\))/gi, rep: 'txt-body-sm text-muted' },
  { regex: /font-size:1[01](?:\.5)?px;font-weight:700;color:#[A-Za-z0-9]+;text-transform:uppercase;?/gi, rep: 'txt-body-xs text-faint' },
  
  // Standalones
  { regex: /margin-top:(\d+)px/gi, rep: (m, d) => `mt-${d}` },
  { regex: /margin-bottom:(\d+)px/gi, rep: (m, d) => `mb-${d}` }
];

// Helper to sanitize remaining empty styles and merge classes
let pass1 = app;

function applyMappings(content) {
  return content.replace(/style="([^"]+)"/g, (match, css) => {
    let classes = [];
    let remCSS = css;
    
    // Normalize string format
    remCSS = remCSS.replace(/\s*:\s*/g, ':').replace(/\s*;\s*/g, ';');
    if (!remCSS.endsWith(';')) remCSS += ';';

    for (let map of styleMap) {
      remCSS = remCSS.replace(map.regex, (subM, g1) => {
        classes.push(typeof map.rep === 'function' ? map.rep(subM, g1) : map.rep);
        return '';
      });
    }

    // cleanup empty trailing/leading semicolons
    remCSS = remCSS.replace(/^;+/, '').replace(/;+$/, '').trim();

    if (classes.length === 0) {
      return match;
    }

    let classStr = classes.join(' ');
    // Adjust slightly to nearest grid scale dynamically if something didn't match perfectly
    classStr = classStr.replace(/gap-(10|14|18)/g, 'gap-12').replace(/mt-(10|14|18)/g, 'mt-12');

    if (remCSS === '' || remCSS === ';') {
      return `class="${classStr}"`;
    } else {
      return `class="${classStr}" style="${remCSS}"`;
    }
  });
}

// Ensure multiple replace-passes if style structures were dense
app = applyMappings(app);

// Combine adjacent classes
app = app.replace(/class="([^"]+)"\s+class="([^"]+)"/g, 'class="$1 $2"');
app = app.replace(/class="([^"]+)"\s+style="([^"]+)"\s+class="([^"]+)"/g, 'class="$1 $3" style="$2"');

fs.writeFileSync('c:/Users/Administrator/Asenzo/app.js', app, 'utf8');
console.log('Refactor complete.');
