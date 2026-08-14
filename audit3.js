const fs = require('fs');
const app = fs.readFileSync('c:/Users/Administrator/Asenzo/app.js', 'utf8');
const regex = /function (render[A-Za-z0-9_]+)\b/g;
let match;
let output = ['# Executive Obsidian Refinement - Audit Pass\n\n'];

output.push('## Executive Summary\n* The codebase relies heavily on hardcoded inline styles instead of CSS classes.\n* Emojis are used for icons across multiple screens, violating the single-icon system rule.\n* Spacing is arbitrary (using specific px values directly in styles).\n\n## Screen-by-Screen Breakdown\n');

while ((match = regex.exec(app)) !== null) {
  const funcName = match[1];
  const startIndex = match.index;
  let braces = 0;
  let endIndex = -1;
  let started = false;
  for (let i = startIndex; i < app.length; i++) {
    if (app[i] === '{') { started = true; braces++; }
    if (app[i] === '}') { braces--; }
    if (started && braces === 0) { endIndex = i; break; }
  }
  if (endIndex !== -1) {
    const body = app.substring(startIndex, endIndex + 1);
    
    // Extract unique styles
    const styleMatches = [...body.matchAll(/style="([^"]+)"/g)].map(m => m[1]);
    const uniqueStyles = [...new Set(styleMatches)];
    
    // Extract emojis
    const emojiRegex = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}]/gu;
    const emojiMatches = body.match(emojiRegex) || [];
    const uniqueEmojis = [...new Set(emojiMatches)];
    
    if (uniqueStyles.length > 0 || uniqueEmojis.length > 0) {
      output.push('### ' + funcName);
      if (uniqueEmojis.length > 0) {
        output.push('**Emojis found:** ' + uniqueEmojis.join(' '));
      }
      if (uniqueStyles.length > 0) {
        output.push('**Inline Styles Detected:**');
        uniqueStyles.slice(0, 10).forEach(s => output.push('- `' + s + '`'));
        if (uniqueStyles.length > 10) output.push(`- ...and ${uniqueStyles.length - 10} more variations.`);
      }
      output.push('\n');
    }
  }
}
fs.writeFileSync('c:/Users/Administrator/Asenzo/fidelity_audit_pass.md', output.join('\n'));
