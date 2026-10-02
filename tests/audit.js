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
ok(confCount === 38 && christCount === 30, '儒家 38 条（含宋明）、基督教 30 条引文',
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
ok(hasText('天命之谓性'), '含子思《中庸》「天命之谓性」');
ok(hasText('个个人心有仲尼'), '含王阳明《咏良知四首示诸生》');
ok(hasText('万物并育而不相害'), '含子思《中庸》「万物并育而不相害」');
ok(hasText('故君子必慎其独也'), '含《大学》「慎独」（旧题曾子作）');
ok(hasText('良知者，孟子所谓'), '含王阳明《大学问》良知句');
ok(hasText('老吾老'), '含孟子「老吾老以及人之老」');
ok(hasText('皆入小学'), '含朱熹《大学章句序》「皆入小学」');
ok(hasText('尽己之谓忠'), '含朱熹《论语集注》忠恕句');
ok(hasText('曾子曰：君子以文会友'), '第二十条标明「曾子曰」');
const sages = ['子思','王阳明','朱熹','曾子'].filter(name =>
  srcKeys.some(n => JSON.stringify([].concat(SOURCES[n].conf)).includes(name)));
ok(sages.length === 4, '曾子/子思/朱熹/王阳明均有引文', sages.join(','));

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
const tooLong = noteLen.filter(([, l]) => l > 200);
ok(tooLong.length === 0, '注文长度适合作为叙事段落（<=200 字）',
   tooLong.map(([n, l]) => n + ':' + l).join(','));
const notFactual = Object.entries(NOTES).map(([n, t]) => [n, t.cn])
  .filter(([, cn]) => !/\d{4}|一九四|一九\d|联合国|国际|美国|英国|法国|德国|瑞士|南非|意大利|中国|苏联|孟|孔子|郑国|奥威尔|阿伦特|罗斯福|贝弗里奇|杜南|纽伦堡|柏林|芝加哥|伯尔尼|伯恩|索尔费里诺|英格兰|大宪章|法王|亨利四世|南特/.test(cn))
  .map(([n]) => n);
ok(notFactual.length === 0, '每条注文都含可核实的真事要素（年份/机构/人名/地名）',
   '缺失条目 ' + notFactual.join(','));

/* 6f. 三十条目录：标记、对话框与 tabindex 策略 */
ok(/id="tocOpen"/.test(html) && /id="tocSheet"/.test(html) && /id="tocBody"/.test(html),
   '目录按钮/对话框/容器在 HTML 中');
ok(/aria-haspopup="dialog"/.test(html) && /aria-controls="tocSheet"/.test(html),
   '目录按钮声明了 dialog 语义');
ok(/setAttribute\('tabindex', '-1'\)/.test(script), '条文 tabindex=-1（不进 Tab 序列，可编程聚焦）');
ok(/document\.hidden/.test(script), '粒子循环在页面隐藏时暂停');
ok(/esc\(q\.text\)/.test(script), '引文经 esc 转义后渲染');

/* 6i. 标题粒子：汇聚成字后不再叠加印刷体白字（.hero-clear 已整体移除） */
ok(!/heroClear|applyHeroText|heroLayout|heroDim|escapeHtml/.test(script),
   '脚本中无 hero-clear 残留（白字叠加层已移除）');
ok(!html.includes('hero-clear'), 'HTML 中无 .hero-clear 元素');

/* 6j. 常驻目录：正文阅读时可见 */
ok(/id="tocFloat"/.test(html) && /aria-controls="tocSheet"/.test(html), '常驻目录按钮在 HTML 中并指向目录对话框');
ok(/updateFloat/.test(script), '常驻按钮随滚动显隐的逻辑存在');
ok(/\.toc-float\{/.test(style), '常驻按钮样式已定义');

/* 6k. 求助与监督渠道：机构字典与条文映射 */
const agMatch = script.match(/const AGENCIES = (\{[\s\S]*?\n\});/);
const hlMatch = script.match(/const HELPLINES = (\{[\s\S]*?\n\});/);
ok(!!agMatch && !!hlMatch, 'AGENCIES / HELPLINES 数据块可定位');
const AGENCIES = eval('(' + agMatch[1] + ')');
const HELPLINES = eval('(' + hlMatch[1] + ')');
const agKeys = Object.keys(AGENCIES);
ok(agKeys.length >= 15, '机构字典覆盖条约机构与专门机构', 'count=' + agKeys.length);
const hlKeys = Object.keys(HELPLINES).map(Number).filter(n => n >= 1 && n <= 30);
ok(hlKeys.length === 30, '30 条均有求助渠道映射', 'count=' + hlKeys.length);
const hlBad = [];
for (const n of hlKeys) {
  const h = HELPLINES[n];
  const refs = [].concat(h.un || [], h.spec || [], h.regional || [], h.general || []);
  if (!refs.length) hlBad.push(n + '(无渠道)');
  for (const k of refs) if (!AGENCIES[k]) hlBad.push(n + '(机构未定义:' + k + ')');
}
ok(hlBad.length === 0, '每条映射的机构都已定义', hlBad.join(' '));
const urlBad = [];
for (const [k, a] of Object.entries(AGENCIES)) {
  if (!a.zh) urlBad.push(k + '(缺中文名)');
  if (!a.url || !/^https:\/\//.test(a.url)) urlBad.push(k + '(主页缺 https URL)');
  if (a.complaint && !/^https:\/\//.test(a.complaint)) urlBad.push(k + '(申诉入口非 https)');
  if ((a.url + (a.complaint || '')).includes('待核') || (a.url + (a.complaint || '')).includes('pending'))
    urlBad.push(k + '(含待核占位)');
}
ok(urlBad.length === 0, '所有机构 URL 均为 https 且无占位残留', urlBad.join(' '));
ok(script.includes('individual-communications-procedures-treaty-bodies'),
   'OHCHR 个人来文使用规范路径（实测确认）');
ok(html.includes('spsubmission.ohchr.org'), '特别程序来文提交站已列出');
ok(!script.includes("complaint:'https://www.ohchr.org/en/treaty-bodies/individual-communications'"),
   '无旧版来文 URL 残留');
ok(html.includes('unodc.org') && html.includes('african-court.org') && html.includes('countries/nhri'),
   '通用说明含 UNODC 法律援助、非洲人权法院与 NHRI 名录');
ok(html.includes('不构成法律意见'), '页面带有“非法律意见”免责说明');
ok(html.includes('亚洲目前没有可受理个人申诉的区域人权法院'), '如实写明亚洲无区域申诉法院的结构性事实');
ok(script.includes('helpHtml') && script.includes('target="_blank" rel="noopener noreferrer"'),
   '求助渠道以新窗口 + noopener 链接渲染');

/* 6l. 企业责任与供应链渠道 + 自查方法 */
ok(/id="helpSupply"/.test(html) && /id="helpCheck"/.test(html),
   '供应链渠道与自查方法两个区块存在');
ok(html.includes('bafa.de') && html.includes('mneguidelines.oecd.org') && html.includes('mohrss.gov.cn'),
   '含 BAFA、OECD 联络点与国内 12333 渠道');
ok((html.match(/<li><b>/g) || []).length === 7, '自查方法恰好七个问题');
ok(html.includes('匿名示例'), '含匿名供应链场景示例');
ok(html.includes('先备份') && html.includes('报复'), '含证据备份与报复风险提示');
ok(!/星宇|比亚迪|宁德时代/.test(html), '不点名任何具体企业（通用化承诺）');
const supUrls = (html.match(/https:\/\/[^"']*bafa\.de[^"']*/g) || []).concat(html.match(/https:\/\/[^"']*mneguidelines\.oecd\.org[^"']*/g) || []);
ok(supUrls.length >= 2 && supUrls.every(u => u.startsWith('https://')), '供应链链接为 https', 'count=' + supUrls.length);

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
