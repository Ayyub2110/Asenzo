const { ESLint } = require("eslint");

(async function main() {
  const eslint = new ESLint({});
  const results = await eslint.lintFiles(["src/app/**/*.tsx", "src/hooks/**/*.ts"]);
  
  let hasErrors = false;
  results.forEach(f => {
    f.messages.forEach(m => {
      hasErrors = true;
      const cleanMessage = m.message.split('\n')[0]; // grab just the first line of the message
      console.log(`${f.filePath}:${m.line}:${m.column} [${m.severity === 2 ? 'error' : 'warning'}] ${m.ruleId} - ${cleanMessage}`);
    });
  });
  if (!hasErrors) console.log("No lint issues found.");
})().catch(console.error);
