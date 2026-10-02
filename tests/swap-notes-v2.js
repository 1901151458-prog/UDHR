/* 用 notes-v2.js 的数据整体替换页面里的 NOTES 块，并更新注记标签 */
const fs = require('fs');
const path = require('path');
const file = process.argv[2];
const notesV2 = require(path.join(__dirname, 'notes-v2.js'));

let raw = fs.readFileSync(file, 'utf8');
const crlf = raw.includes('\r\n');
let text = crlf ? raw.replace(/\r\n/g, '\n') : raw;

/* 1. 替换 NOTES 块（花括号配对定位） */
const start = text.indexOf('const NOTES = {');
if (start < 0) { console.log('未找到 NOTES 起点'); process.exit(1); }
const braceStart = text.indexOf('{', start);
let depth = 0, end = -1;
for (let i = braceStart; i < text.length; i++) {
  if (text[i] === '{') depth++;
  else if (text[i] === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
}
if (end < 0) { console.log('未找到配对括号'); process.exit(1); }

const newBlock = 'const NOTES = ' + JSON.stringify(notesV2, null, 2) + ';';
text = text.slice(0, start) + newBlock + text.slice(end);

/* 2. 注记标签：真事叙事版 */
const oldTag = '<span class="tag">人的处境 · 这一条，是关于一个人的一天</span>';
const newTag = '<span class="tag">人的处境 · 一件真事</span>';
if (text.includes(oldTag)) text = text.replace(oldTag, newTag);
else console.log('提示：未找到旧标签（可能已被改过），跳过');

fs.writeFileSync(file, crlf ? text.replace(/\n/g, '\r\n') : text, 'utf8');
console.log('NOTES 已替换为真事叙事版（' + Object.keys(notesV2).length + ' 条）');
