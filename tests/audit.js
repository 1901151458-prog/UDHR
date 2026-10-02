/* 静态自检：id 引用、选择器引用、CSS 括号平衡、数据完整性 */
const fs = require('fs');
const file = process.argv[2];
const html = fs.readFileSync(file, 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const style = html.match(/<style>([\s\S]*?)<\/style>/)[1];

let fail = 0;
const ok = (c, msg, extra) => {
  console.log((c ? 'PASS  ' : 'FAIL  ') + msg + (extra ? '  ' + extra : ''));
  if (!c) fail++;
};

/* 1. 脚本里 getElementById 的目标必须在 HTML 中存在 */
const idsUsed = [...script.matchAll(/getElementById\('([^']+)'\)/g)].map(m => m[1]);
const idsDefined = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
const missingIds = [...new Set(idsUsed)].filter(id => !idsDefined.has(id));
ok(missingIds.length === 0, 'getElementById 目标全部存在', missingIds.join(', '));

/* 2. 脚本创建 / 查询的类名必须在 style 中有定义（动态生成的选择器除外） */
const classesInStyle = new Set([...style.matchAll(/\.([a-zA-Z][\w-]*)/g)].map(m => m[1]));
const classesUsed = [...script.matchAll(/class="([^"]+)"/g)]
  .flatMap(m => m[1].split(/\s+/))
  .concat([...script.matchAll(/classList\.(?:add|toggle)\('([^']+)'/g)].map(m => m[1]))
  .concat([...script.matchAll(/querySelector(?:All)?\('\.([\w-]+)/g)].map(m => m[1]))
  .concat([...script.matchAll(/className = '([^']+)'/g)].flatMap(m => m[1].split(/\s+/)))
  .filter(Boolean)
  /* 模板占位符与纯 JS 钩子（无样式需求）不算 */
  .filter(c => !c.includes('${'))
  .filter(c => c !== 'lbl');
const undefClasses = [...new Set(classesUsed)].filter(c => !classesInStyle.has(c));
ok(undefClasses.length === 0, '脚本使用的类名都在 CSS 中有定义', undefClasses.join(', '));

/* 3. CSS 花括号平衡 */
const open = (style.match(/\{/g) || []).length;
const close = (style.match(/\}/g) || []).length;
ok(open === close, 'CSS 花括号平衡', open + ' / ' + close);

/* 4. 标签平衡（忽略注释、脚本、样式与自闭合） */
const body = html.replace(/<!--[\s\S]*?-->/g, '');
const stripped = body.replace(/<script>[\s\S]*?<\/script>/g, '').replace(/<style>[\s\S]*?<\/style>/g, '');
const voidTags = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'source', 'canvas-dummy']);
const stack = [];
const tagIssues = [];
for (const m of stripped.matchAll(/<(\/?)([a-zA-Z][\w-]*)([^>]*)>/g)) {
  const [, slash, name, rest] = m;
  if (voidTags.has(name.toLowerCase()) || /\/\s*$/.test(rest)) continue;
  if (slash) {
    const top = stack.pop();
    if (top !== name) tagIssues.push(`</${name}> 与 <${top}> 不匹配`);
  } else stack.push(name);
}
ok(tagIssues.length === 0 && stack.length === 0, 'HTML 标签配对',
   (tagIssues.slice(0, 5).join(' | ') + ' 未闭合:' + stack.join(',')).trim());

/* 5. 数据完整性：NOTES 覆盖 ARTICLES，UNITS 划分完整且不重叠 */
const unitsMatch = script.match(/const UNITS = (\[[\s\S]*?\n\]);/);
const notesMatch = script.match(/const NOTES = (\{[\s\S]*?\n\});/);
ok(!!unitsMatch && !!notesMatch, 'UNITS / NOTES 数据块可定位');
const UNITS = eval(unitsMatch[1]);
const NOTES = eval('(' + notesMatch[1] + ')');
const all = UNITS.flatMap(u => u.a);
const dup = all.filter((n, i) => all.indexOf(n) !== i);
ok(dup.length === 0, 'UNITS 内条目无重复', dup.join(','));
const sorted = [...all].sort((a, b) => a - b);
ok(sorted.length === 30 && sorted[0] === 1 && sorted[29] === 30,
   'UNITS 完整覆盖 1–30', `count=${sorted.length}`);
/* 5b. 思想来源层：每条都有可展开的基督教 / 儒家典籍说明 */
const sourcesMatch = script.match(/const SOURCES = (\{[\s\S]*?\n\});/);
ok(!!sourcesMatch, 'SOURCES 数据块可定位');
const SOURCES = eval('(' + sourcesMatch[1] + ')');
const srcKeys = Object.keys(SOURCES).map(Number).sort((a, b) => a - b);
ok(srcKeys.length === 30 && srcKeys[0] === 1 && srcKeys[29] === 30,
   'SOURCES 完整覆盖 1-30', 'count=' + srcKeys.length);

const sBad = [];
let confCount = 0, christCount = 0;
for (const n of srcKeys) {
  const s = SOURCES[n];
  if (!s.conf || !s.conf.length) sBad.push(n + '(缺儒家)');
  if (!s.christ || !s.christ.length) sBad.push(n + '(缺基督教)');
  if (!s.hist) sBad.push(n + '(缺历史渊源)');
  confCount += (s.conf || []).length;
  christCount += (s.christ || []).length;
  for (const q of [].concat(s.conf || [], s.christ || [])) {
    if (!q.src) sBad.push(n + '(引文缺出处)');
    if (!q.text) sBad.push(n + '(引文缺正文)');
  }
  for (const q of s.conf || []) {
    if (!q.tw) sBad.push(n + '(儒家缺繁体)');
    else if (q.text.replace(/\s/g, '').length !== q.tw.replace(/\s/g, '').length)
      sBad.push(n + '(简繁字数不一致)');
  }
}
ok(sBad.length === 0, '思想来源数据齐全（儒家/基督教/历史渊源/简繁）', sBad.join(' '));
ok(confCount === 30 && christCount === 30, '儒家与基督教各 30 条引文',
   '儒家 ' + confCount + ' / 基督教 ' + christCount);

/* 5c. 引文内容抽查：防止数据被改坏 */
const flatQ = srcKeys.map(n => [].concat(SOURCES[n].conf, SOURCES[n].christ))
  .reduce((all, x) => all.concat(x), []);
const hasText = t => flatQ.some(q => (q.text || '').includes(t));
ok(hasText('己所不欲，勿施于人'), '含《论语》「己所不欲，勿施于人」');
ok(hasText('你们愿意人怎样待你们'), '含《马太福音》金律');
ok(hasText('神就照着自己的形像造人'), '含《创世记》1:27');
ok(hasText('大道之行也，天下为公'), '含《礼记·礼运》大同');
ok(hasText('老有所终'), '含《礼运》「皆有所养」一节');
ok(hasText('天视自我民视'), '含《泰誓》民本句');
ok(hasText('钦哉，钦哉，惟刑之恤哉'), '含《舜典》恤刑句');
ok(hasText('与其杀不辜，宁失不经'), '含《大禹谟》疑罪从轻句');
ok(hasText('不可偏护穷人'), '含《利未记》19:15 审判不偏');

/* 5d. 出处准确性：几处必须写对的地方 */
ok(SOURCES[5].conf[0].src.includes('卫灵公'), '「己所不欲」出处为《卫灵公》');
ok(SOURCES[2].conf[0].src.includes('卫灵公') && SOURCES[26].conf[0].src.includes('卫灵公'),
   '「有教无类」两处均标《卫灵公》');
ok(SOURCES[11].conf[0].note.includes('伪古文'), '《大禹谟》标注为伪古文');
ok(!SOURCES[24].christ[0].note.includes('待核') && SOURCES[24].christ[0].note.includes('神造物的工已经完毕'),
   '创世记 2:2 已实测并写入，无待核残留');
ok(SOURCES[2].christ[0].text.includes('希利尼人'), '和合本用字「希利尼人」');
ok(SOURCES[4].conf[0].note.includes('思想呼应'), '禁奴条注明儒家仅为思想呼应');
ok(SOURCES[16].conf[0].note.includes('张力'), '婚姻条以「张力」而非硬凑渊源');

/* 5e. 起草史：张彭春与 conscience 必须写明，且不得夸大为“把仁写进宣言” */
ok(SOURCES[1].hist.includes('张彭春'), '第一条注明张彭春的参与');
ok(SOURCES[1].hist.includes('conscience'), '第一条注明 conscience 一词的来源');
ok(/并非某一文明的独占贡献|多方折中/.test(SOURCES[1].hist), '第一条明确这是多方折中');

const missingNotes = sorted.filter(n => !NOTES[n]);
ok(missingNotes.length === 0, '每条都有「人的处境」文本', missingNotes.join(','));
const extraNotes = Object.keys(NOTES).map(Number).filter(n => sorted.indexOf(n) === -1);
ok(extraNotes.length === 0, '没有多余的 NOTES 条目', extraNotes.join(','));

/* 6. 每条注文的 cn / tw / en 非空；简体与繁体同形时才允许缺 tw */
const badLines = [];
for (const [n, t] of Object.entries(NOTES)) {
  if (!t.cn || !t.en) badLines.push(n + '(缺 cn/en)');
  if (!t.tw) badLines.push(n + '(缺 tw)');
}
ok(badLines.length === 0, '注文三语字段齐全', badLines.join(','));
const noteLen = Object.entries(NOTES).map(([n, t]) => [n, t.cn.length]);
const tooLong = noteLen.filter(([, l]) => l > 46);
ok(tooLong.length === 0, '注文长度适合作为引文（<=46 字）',
   tooLong.map(([n, l]) => n + ':' + l).join(','));

/* 6f. 三十条目录：标记、对话框与 tabindex 策略 */
ok(/id="tocOpen"/.test(html) && /id="tocSheet"/.test(html) && /id="tocBody"/.test(html),
   '目录按钮/对话框/容器在 HTML 中');
ok(/aria-haspopup="dialog"/.test(html) && /aria-controls="tocSheet"/.test(html),
   '目录按钮声明了 dialog 语义');
ok(/setAttribute\('tabindex', '-1'\)/.test(script), '条文 tabindex=-1（不进 Tab 序列，可编程聚焦）');
ok(/document\.hidden/.test(script), '粒子循环在页面隐藏时暂停');
ok(/esc\(q\.text\)/.test(script), '引文经 esc 转义后渲染');

/* 6h. 结尾黄金律：六传统对照（4 张新卡） */
ok(!html.includes('【待填'), '黄金律卡片无占位残留');
ok(/id="goldenGrid"/.test(html), '黄金律网格存在');
const gCards = (html.match(/<div class="g-card">/g) || []).length;
ok(gCards === 4, '黄金律新增 4 张传统卡片', 'count=' + gCards);
ok(html.includes('你所憎恶的') && html.includes('Shabbat 31a'), '含希勒尔《塔木德》Shabbat 31a');
ok(html.includes('纳瓦维四十则') && html.includes('兄弟'), '含纳瓦维四十则第 13');
ok(html.includes('法句经') && html.includes('刀杖'), '含《法句经》129–130');
ok(html.includes('普遍法则') && html.includes('AA IV: 421'), '含康德绝对命令与出处');
ok(SOURCES[10].christ[0].text.includes('屈枉正直') && !SOURCES[10].christ[0].text.includes('随众偏行'),
   '第10条主引文为出埃及记 23:6（与和合本实测一致）');
ok(SOURCES[27].christ[0].text.includes('我也以我的灵充满了他'),
   '第27条主引文为出埃及记 31:3（与和合本实测一致）');

/* 7. 关键可访问性属性 */
ok(/aria-pressed="false"/.test(script), '标记按钮带 aria-pressed');
ok(/aria-labelledby="lbl-preamble"/.test(html) && /id="lbl-preamble"/.test(html),
   '序言区有可访问名称');
ok(/aria-labelledby="lbl-articles"/.test(html) && /id="lbl-articles"/.test(html),
   '正文区有可访问名称');
ok(/class="skip-link" href="#doc-top"/.test(html) && /id="doc-top"[^>]*tabindex="-1"/.test(html)
   || /tabindex="-1"[^>]*id="doc-top"/.test(html), '跳过链接指向可聚焦的 main');

/* 8. 首条 highlight 与 CONCEPTS 的英文全称 */
ok(/UNIVERSAL DECLARATION\|OF HUMAN RIGHTS/.test(script), '首屏英文全称未丢失 "OF HUMAN RIGHTS"');

console.log('\n' + (fail ? fail + ' 项失败' : '全部通过'));
process.exit(fail ? 1 : 0);
