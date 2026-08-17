const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./eslint_app.json', 'utf8'));
data.forEach(f => {
  f.messages.forEach(m => {
    if(m.severity === 2 || m.severity === 1) {
      console.log(`${f.filePath}:${m.line}:${m.column} [${m.severity === 2 ? 'error' : 'warning'}] - ${m.ruleId}: ${m.message}`);
    }
  });
});
