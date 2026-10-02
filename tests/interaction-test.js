/* 交互层端到端自检：
   把页面的真实 <script> 放进一个最小 DOM 模拟器里执行，
   再派发真实事件，检查「标记 / 清单 / 导出 / 计数器」的实际结果。
   目的不是渲染像素，而是确认读者会触发的每一条路径都能跑通。 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const file = process.argv[2];
const html = fs.readFileSync(file, 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

let fail = 0;
const ok = (c, msg, extra) => {
  console.log((c ? 'PASS  ' : 'FAIL  ') + msg + (extra ? '  ' + extra : ''));
  if (!c) fail++;
};

/* ───────────────── 最小 DOM ───────────────── */
const byId = new Map();

class ClassList {
  constructor(el) { this.el = el; }
  get set() { return this.el._classes; }
  add(...c) { c.forEach(x => this.el._classes.add(x)); }
  remove(...c) { c.forEach(x => this.el._classes.delete(x)); }
  contains(c) { return this.el._classes.has(c); }
  toggle(c, force) {
    const on = force === undefined ? !this.el._classes.has(c) : !!force;
    if (on) this.el._classes.add(c); else this.el._classes.delete(c);
    return on;
  }
}

class El {
  constructor(tag) {
    this.tagName = String(tag).toUpperCase();
    this.children = [];
    this.parentElement = null;
    this._attrs = new Map();
    this._classes = new Set();
    this.classList = new ClassList(this);
    this.dataset = {};
    this.style = new Proxy({}, { set: (t, k, v) => { t[k] = v; return true; }, get: (t, k) => t[k] });
    this._text = '';
    this._listeners = new Map();
    this.id = '';
  }
  get className() { return [...this._classes].join(' '); }
  set className(v) { this._classes = new Set(String(v).split(/\s+/).filter(Boolean)); }
  get classListSet() { return this._classes; }
  setAttribute(k, v) { this._attrs.set(k, String(v)); }
  getAttribute(k) { return this._attrs.has(k) ? this._attrs.get(k) : null; }
  removeAttribute(k) { this._attrs.delete(k); }
  get innerHTML() { return this._html || ''; }
  set innerHTML(v) { this._html = String(v); parseInto(this, String(v)); }
  set id(v) { this._id = v; byId.set(v, this); }
  get id() { return this._id || ''; }
  createTreeWalker() {
    return { nextNode: () => null };
  }
  get textContent() {
    return this._text || this.children.map(c => c.textContent).join('');
  }
  set textContent(v) { this._text = String(v); this.children = []; }
  get open() { return this._attrs.has('open'); }
  appendChild(c) { c.parentElement = this; this.children.push(c); return c; }
  removeChild(c) {
    const i = this.children.indexOf(c);
    if (i >= 0) this.children.splice(i, 1);
  }
  remove() { if (this.parentElement) this.parentElement.removeChild(this); }
  addEventListener(type, fn) {
    if (!this._listeners.has(type)) this._listeners.set(type, []);
    this._listeners.get(type).push(fn);
  }
  dispatch(type, extra) {
    const ev = Object.assign({
      type,
      target: this,
      preventDefault() {},
      stopPropagation() {},
      closest(sel) {
        let node = this;                 /* DOM 语义：从自身开始向上找 */
        while (node) {
          if (matches(node, sel)) return node;
          node = node.parentElement;
        }
        return null;
      }
    }, extra || {});
    let node = this;
    while (node) {
      const fns = node._listeners.get(type) || [];
      for (const fn of fns) fn(ev);
      node = node.parentElement;
    }
    return ev;
  }
  focus() { this._focused = true; }
  scrollIntoView() { this._scrolled = true; }
  closest(sel) {
    let node = this;
    while (node) {
      if (matches(node, sel)) return node;
      node = node.parentElement;
    }
    return null;
  }
  getBoundingClientRect() {
    return { left: 0, top: 1200, right: 860, bottom: 1600, width: 860, height: 400, x: 0, y: 1200 };
  }
  querySelector(sel) { const r = this.querySelectorAll(sel); return r[0] || null; }
  querySelectorAll(sel) {
    const out = [];
    const walk = node => {
      for (const c of node.children) {
        if (matches(c, sel)) out.push(c);
        walk(c);
      }
    };
    walk(this);
    return out;
  }
  /* canvas */
  getContext() {
    const owner = this;
    return {
      canvas: owner,
      fillStyle: '#000', strokeStyle: '#000', globalAlpha: 1,
      globalCompositeOperation: 'source-over',
      textAlign: 'left', textBaseline: 'alphabetic',
      font: '10px serif', letterSpacing: '0px',
      cleared: 0, fills: [],
      fillRect() {}, clearRect() { this.cleared++; },
      save() {}, restore() {}, beginPath() {}, moveTo() {}, lineTo() {},
      stroke() {}, fill() {}, arc() {}, drawImage() {},
      setTransform() {}, translate() {}, scale() {},
      fillText(text, x, y) {
        const size = parseFloat((this.font.match(/(\d+(?:\.\d+)?)px/) || [, 16])[1]);
        const w = text.split('').reduce((s, ch) => s + (/[\u4e00-\u9fff]/.test(ch) ? size : size * 0.55), 0);
        this.fills.push({ x, y, w, h: size });
      },
      measureText(t) {
        const size = parseFloat((this.font.match(/(\d+(?:\.\d+)?)px/) || [, 16])[1]);
        return { width: t.split('').reduce((s, ch) => s + (/[\u4e00-\u9fff]/.test(ch) ? size : size * 0.55), 0) };
      },
      createRadialGradient() { return { addColorStop() {} }; },
      getImageData(x, y, w, h) {
        /* 用 fillText 记录的字形包围盒合成 alpha 通道，让采样得到真实数量的点 */
        const n = Math.max(1, Math.round(w)) * Math.max(1, Math.round(h));
        const data = new Uint8ClampedArray(n * 4);
        for (const f of this.fills) {
          const x0 = Math.max(0, Math.floor(f.x - f.w / 2)), x1 = Math.min(Math.round(w) - 1, Math.ceil(f.x + f.w / 2));
          const y0 = Math.max(0, Math.floor(f.y - f.h / 2)), y1 = Math.min(Math.round(h) - 1, Math.ceil(f.y + f.h / 2));
          for (let yy = y0; yy <= y1; yy += 2) {
            for (let xx = x0; xx <= x1; xx += 2) {
              data[(yy * Math.round(w) + xx) * 4 + 3] = 255;
            }
          }
        }
        return { data, width: Math.round(w), height: Math.round(h) };
      }
    };
  }
}

const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'source']);

/* 极简 HTML 解析：够把 innerHTML 字符串变成可查询的元素树 */
function parseInto(parent, str) {
  parent.children = [];
  const stack = [parent];
  const re = /<!--[\s\S]*?-->|<\/([a-zA-Z][\w-]*)\s*>|<([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>/g;
  let last = 0, m;
  const text = s => {
    const t = s.replace(/\s+/g, ' ').trim();
    if (t) stack[stack.length - 1]._text = (stack[stack.length - 1]._text || '') + t;
  };
  while ((m = re.exec(str))) {
    text(str.slice(last, m.index));
    last = re.lastIndex;
    if (m[1]) {
      if (stack.length > 1) stack.pop();
      continue;
    }
    if (!m[2]) continue;                       /* 注释 / 其他声明 */
    const node = new El(m[2]);
    const attrs = m[3] || '';
    for (const a of attrs.matchAll(/([a-zA-Z_:][\w:.-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)) {
      const name = a[1];
      const value = a[2] !== undefined ? a[2] : a[3] !== undefined ? a[3] : a[4] !== undefined ? a[4] : '';
      node.setAttribute(name, value);
      if (name === 'class') node.className = value;
      if (name === 'id') node.id = value;
      if (name.startsWith('data-')) {
        node.dataset[name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value;
      }
    }
    node.parentElement = stack[stack.length - 1];
    stack[stack.length - 1].appendChild(node);
    if (!VOID_TAGS.has(m[2].toLowerCase()) && !m[4]) stack.push(node);
  }
  text(str.slice(last));
}

function matches(el, sel) {
  if (!el || el.tagName === undefined) return false;
  return sel.split(',').map(s => s.trim()).some(one => {
    if (one.startsWith('.')) {
      return one.match(/\.[\w-]+/g).every(c => el._classes.has(c.slice(1)));
    }
    if (one.startsWith('#')) return el.id === one.slice(1);
    if (one.startsWith('[') && one.endsWith(']')) {
      const [k, v] = one.slice(1, -1).split('=');
      const val = el.getAttribute(k);
      return v === undefined ? val !== null : val === v.replace(/["']/g, '');
    }
    if (one.includes('[')) {
      const [tag, rest] = one.split('[');
      const attr = rest.replace(/\]/g, '');
      const eq = attr.indexOf('=');
      const k = eq === -1 ? attr : attr.slice(0, eq);
      const v = eq === -1 ? undefined : attr.slice(eq + 1).replace(/^["']|["']$/g, '');
      return el.tagName === tag.toUpperCase() &&
             (v === undefined ? el.getAttribute(k) !== null : el.getAttribute(k) === v);
    }
    return el.tagName === one.toUpperCase();
  });
}

/* 用页面真实的 <body> 结构，避免测试骨架与真实页面不一致 */
const root = new El('html');
const body = new El('body');
root.appendChild(body);
const bodyHtml = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)[1];
parseInto(body, bodyHtml);

/* ───────────────── window / document 模拟 ───────────────── */
const stores = new Map();
const localStorage = {
  getItem: k => (stores.has(k) ? stores.get(k) : null),
  setItem: (k, v) => stores.set(k, String(v)),
  removeItem: k => stores.delete(k)
};

const doc = {
  documentElement: root,
  body,
  getElementById: id => byId.get(id) || null,
  createElement: t => new El(t),
  querySelector: s => body.querySelector(s),
  querySelectorAll: s => body.querySelectorAll(s),
  addEventListener() {}
};

const timers = [];
const window = {
  innerWidth: 1280,
  innerHeight: 800,
  devicePixelRatio: 1,
  scrollY: 0,
  scrollX: 0,
  isSecureContext: true,
  document: doc,
  localStorage,
  matchMedia: () => ({ matches: false, addListener() {}, addEventListener() {} }),
  addEventListener(type, fn) { (window._l = window._l || {})[type] = (window._l[type] || []).concat(fn); },
  dispatch(type, extra) { ((window._l || {})[type] || []).forEach(fn => fn(Object.assign({ type }, extra))); },
  requestAnimationFrame() { return 1; },   /* 不驱动动画帧，只跑同步代码 */
  cancelAnimationFrame() {},
  setTimeout(fn, ms) { timers.push({ fn, ms }); return timers.length; },
  clearTimeout() {},
  setInterval() { return 1; },
  clearInterval() {},
  print() { window._printed = true; },
  navigator: { clipboard: null },
  performance: { now: () => 0 },
  getComputedStyle: () => ({
    display: 'block', visibility: 'visible', fontStyle: 'normal', fontWeight: '600',
    fontSize: '17px', fontFamily: 'Georgia, serif'
  })
};
window.window = window;

const bgCanvas = byId.get('bg');
const preambleWrap = byId.get('preamble');
const articlesWrap = byId.get('articles');
const dlg = byId.get('rightsSheet');
dlg.showModal = function () { this.setAttribute('open', ''); };
dlg.close = function () { this.removeAttribute('open'); this.dispatch('close'); };
const tocDlg = byId.get('tocSheet');
if (tocDlg) {
  tocDlg.showModal = function () { this.setAttribute('open', ''); };
  tocDlg.close = function () { this.removeAttribute('open'); this.dispatch('close'); };
}

/* Canvas 需要按 CSS 尺寸工作 */
Object.defineProperty(bgCanvas, 'width', { writable: true, value: 1280 });
Object.defineProperty(bgCanvas, 'height', { writable: true, value: 800 });

const sandbox = {
  window, document: doc, navigator: window.navigator,
  localStorage, console,
  requestAnimationFrame: window.requestAnimationFrame,
  cancelAnimationFrame: window.cancelAnimationFrame,
  setTimeout: window.setTimeout, clearTimeout: window.clearTimeout,
  setInterval: window.setInterval, clearInterval: window.clearInterval,
  performance: window.performance, getComputedStyle: window.getComputedStyle,
  Math, Date, JSON, Object, Array, Number, String, Boolean, Set, Map,
  Float32Array, Uint8Array, Uint8ClampedArray, Int32Array, Infinity, NaN,
  NodeFilter: { SHOW_TEXT: 4 }, Range: class { setStart() {} setEnd() {} getBoundingClientRect() { return { left: 0, top: 0, width: 10, height: 17 }; } },
  Node: { TEXT_NODE: 3 }
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

/* ───────────────── 执行页面脚本 ───────────────── */
try {
  vm.runInContext(script, sandbox, { filename: 'page.js' });
  ok(true, '页面脚本在 DOM 模拟器中完整执行完毕');
} catch (e) {
  ok(false, '页面脚本执行失败', e && e.stack ? e.stack.split('\n').slice(0, 4).join(' | ') : e);
  console.log('\n' + fail + ' 项失败');
  process.exit(1);
}

/* ───────────────── 结构断言 ───────────────── */
const articles = articlesWrap.querySelectorAll('.article');
ok(articles.length === 30, '渲染出 30 条条文', 'count=' + articles.length);

const units = articlesWrap.querySelectorAll('.unit-label');
ok(units.length === 5, '渲染出 5 个意义单元分隔', 'count=' + units.length);

const srcBlocks = articlesWrap.querySelectorAll('.sources');
ok(srcBlocks.length === 30, '每条条文下都有可展开的伸缩说明', 'count=' + srcBlocks.length);
const confQ = articlesWrap.querySelectorAll('.quote.conf');
const christQ = articlesWrap.querySelectorAll('.quote.christ');
ok(confQ.length === 38 && christQ.length === 30, '儒家 38 条（含宋明圣贤）、基督教 30 条',
   '儒家 ' + confQ.length + ' / 基督教 ' + christQ.length);
const srcBody = articlesWrap.querySelectorAll('.src-body');
ok(srcBody.length === 30, '每条说明都有正文容器', 'count=' + srcBody.length);
const histBlocks = articlesWrap.querySelectorAll('.src-hist');
ok(histBlocks.length === 30, '每条说明都有「历史渊源」', 'count=' + histBlocks.length);
const firstSummary = srcBlocks[0].querySelector('summary');
ok(!!firstSummary && firstSummary.textContent.includes('查看思想来源'), '折叠标题文案正确',
   firstSummary ? firstSummary.textContent.replace(/\s+/g, ' ').trim().slice(0, 30) : 'missing');
ok(!!srcBlocks[0].querySelector('.tradition'), '引文带有传统标签');
const srcIds = srcBlocks.map(el => el.id);
ok(srcIds.every(x => x && x.indexOf('sources-') === 0), '每条说明都有可定位的 id');
ok(articles.every(a => a.getAttribute('tabindex') === '-1'), '条文 tabindex=-1：不进 Tab 序列、可编程聚焦');
/* ── 三十条目录 ── */
const tocOpenBtn = byId.get('tocOpen');
const tocSheetDlg = byId.get('tocSheet');
ok(!!tocOpenBtn && !!tocSheetDlg, '目录按钮与对话框存在');
const tocChips = byId.get('tocBody').querySelectorAll('.chip');
ok(tocChips.length === 30, '目录渲染 30 个条号', 'count=' + tocChips.length);
ok(byId.get('tocBody').querySelectorAll('.unit-row').length === 5, '目录按 5 个单元分组');
tocOpenBtn.dispatch('click', { target: tocOpenBtn });
ok(tocSheetDlg.open, '点击按钮打开目录对话框');
const chip25 = tocChips[24];
ok(chip25.querySelector('.cn').textContent.indexOf('二十五') !== -1, '第 25 个芯片条号正确',
   chip25.querySelector('.cn').textContent);
chip25.dispatch('click', { target: chip25 });
ok(!tocSheetDlg.open, '点击条号后目录关闭');
ok(byId.get('art-25')._focused === true, '跳转后目标条文获得焦点');
ok(byId.get('art-25')._classes.has('jump'), '目标条文有跳转闪示');
ok(byId.get('art-25')._scrolled === true, '目标条文执行了滚动定位');

/* 常驻目录按钮：正文阅读时可见，与正文标题处的按钮共用同一对话框 */
const tocFloat = byId.get('tocFloat');
ok(!!tocFloat && tocFloat.getAttribute('aria-controls') === 'tocSheet', '常驻目录按钮存在且指向同一对话框');
tocFloat.dispatch('click', { target: tocFloat });
ok(tocSheetDlg.open, '常驻按钮也能打开目录');
const chip1 = byId.get('tocBody').querySelectorAll('.chip')[0];
chip1.dispatch('click', { target: chip1 });
ok(!tocSheetDlg.open && tocFloat._focused === true, '经常驻按钮打开并跳转后，焦点回到常驻按钮');
const goldenCards = byId.get('goldenGrid') ? byId.get('goldenGrid').querySelectorAll('.g-card') : [];
ok(goldenCards.length === 4, '结尾黄金律新增 4 张传统卡片', 'count=' + goldenCards.length);
ok(!String(byId.get('goldenGrid').innerHTML).includes('【待填'), '黄金律卡片无占位残留');
/* ── 求助与监督渠道 ── */
const helpBlocks = articlesWrap.querySelectorAll('.help');
ok(helpBlocks.length === 30, '每条条文下都有求助渠道伸缩区', 'count=' + helpBlocks.length);
/* 测试桩不支持后代选择器，改为：取 .h-name 下的 <a> 子元素 */
const hNames = articlesWrap.querySelectorAll('.h-name');
const hLinks = hNames.map(el => el.children.find(c => c.tagName === 'A')).filter(Boolean);
ok(hLinks.length >= 60, '求助渠道链接数量充足', 'count=' + hLinks.length);
ok(hLinks.every(a => a.getAttribute('target') === '_blank' && (a.getAttribute('rel') || '').includes('noopener')),
   '所有渠道链接 target=_blank 且带 noopener');
ok(hLinks.every(a => /^https:\/\//.test(a.getAttribute('href'))), '所有渠道链接为 https');
ok(hLinks.every(a => !a.getAttribute('href').includes('待核')), '链接无占位残留');
ok(articlesWrap.querySelectorAll('.h-kind').length >= 60, '渠道带有机构类型标签');
const helpSum = helpBlocks[0].querySelector('summary');
ok(!!helpSum && helpSum.textContent.includes('求助与监督渠道'), '折叠标题文案正确');
/* ── 供应链渠道与自查方法（正文标题下的通用区块） ── */
const china = byId.get('helpChina');
ok(!!china, '中国渠道区块存在');
ok(china.querySelector('summary').textContent.includes('适用于中国的国际求助途径'), '中国区块标题正确');
const chinaNames = china.querySelectorAll('.h-name');
const chinaAnchors = chinaNames.map(el => el.children.find(c => c.tagName === 'A')).filter(Boolean);
ok(chinaAnchors.length >= 9, '中国渠道链接数量充足', 'count=' + chinaAnchors.length);
ok(chinaAnchors.every(a => /^https?:\/\//.test(a.getAttribute('href'))), '中国渠道链接均带协议');
const guide = byId.get('helpGuide');
ok(!!guide, '维权步骤指南区块存在');
ok(guide.querySelector('summary').textContent.includes('维权步骤指南'), '指南区块标题正确');
const gList = guide.querySelector('.h-check');
ok(!!gList && gList.children.filter(c => c.tagName === 'LI').length === 7, '指南恰好七步',
   'count=' + (gList ? gList.children.filter(c => c.tagName === 'LI').length : 0));
const supply = byId.get('helpSupply');
const check = byId.get('helpCheck');
ok(!!supply && !!check, '供应链渠道与自查方法区块存在');
ok(supply.querySelector('summary').textContent.includes('企业责任与供应链渠道'), '供应链区块标题正确');
ok(check.querySelector('summary').textContent.includes('怎么确认哪条渠道适合自己'), '自查区块标题正确');
const hCheckList = check.querySelector('.h-check');
ok(!!hCheckList && hCheckList.children.filter(c => c.tagName === 'LI').length === 7,
   '自查清单七个问题', 'count=' + (hCheckList ? hCheckList.children.filter(c => c.tagName === 'LI').length : 0));
const supplyLinks = supply.querySelectorAll('.h-name');
const supplyAnchors = supplyLinks.map(el => el.children.find(c => c.tagName === 'A')).filter(Boolean);
ok(supplyAnchors.length >= 6, '供应链渠道链接数量充足', 'count=' + supplyAnchors.length);
ok(supplyAnchors.every(a => /^https:\/\//.test(a.getAttribute('href'))), '供应链链接全部为 https');
const notes = articlesWrap.querySelectorAll('.note');
ok(notes.length === 30, '每条正文前都有「人的处境」', 'count=' + notes.length);

const btns = articlesWrap.querySelectorAll('.mark-btn');
ok(btns.length === 30, '每条都有标记按钮', 'count=' + btns.length);
ok(btns.every(b => b.getAttribute('aria-pressed') === 'false'),
   '初始 aria-pressed 全部为 false');
ok(articles[0]._classes.has('highlight'), '第一条保留 highlight 仪式');

/* 第一天条必须是第一条 */
const firstUnitAfter = articlesWrap.children.findIndex(c => c._classes.has('unit-label'));
ok(firstUnitAfter === 0, '单元分隔出现在第一条之前');

/* ───────────────── 交互：标记 → 浮条 → 清单 → 导出 ───────────────── */
const daysText = byId.get('daysNum').textContent;
const days = Number(String(daysText).replace(/,/g, ''));
const expect = Math.floor((Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) - Date.UTC(1948, 11, 10)) / 86400000);
ok(days === expect, '1948.12.10 至今的天数计算正确', days + ' vs ' + expect);
ok(days > 27000, '天数符合 2026 年的时间量级', String(days));

articlesWrap.dispatch('click', { target: btns[2] });
if (process.env.DBG) {
  try {
    console.log('DEBUG matchesFn=', typeof matches,
      'direct=', matches(btns[2], '.mark-btn'),
      'closest=', String(btns[2].closest('.mark-btn')),
      'parent=', btns[2].parentElement && btns[2].parentElement.className,
      'listeners=', [...articlesWrap._listeners.keys()],
      'articles=', body.querySelectorAll('.article').length,
      'tag=', btns[2].tagName);
  } catch (e) { console.log('DEBUG ERROR', e.message); }
}
ok(articles[2]._classes.has('marked'), '点击后条文进入 marked 状态');
ok(btns[2].getAttribute('aria-pressed') === 'true', '点击后 aria-pressed=true');
ok(byId.get('rightsCount').innerHTML.indexOf('<b>1</b>') === 0, '浮条计数更新为 1',
   byId.get('rightsCount').innerHTML);
ok(byId.get('rightsBar')._classes.has('on'), '浮条已显示');
ok(JSON.parse(localStorage.getItem('udhr.myRights.v1')).join(',') === '3', '已写入 localStorage',
   localStorage.getItem('udhr.myRights.v1'));

articlesWrap.dispatch('click', { target: btns[24] });
articlesWrap.dispatch('click', { target: btns[0] });
ok(byId.get('rightsCount').innerHTML.indexOf('<b>3</b>') === 0, '继续累积到 3 条',
   byId.get('rightsCount').innerHTML);
if (process.env.DBG) {
  console.log('DBG markedArticles=', articles.filter(a => a._classes.has('marked'))
    .map(a => a.getAttribute('id')).join(','),
    'storage=', localStorage.getItem('udhr.myRights.v1'));
}

/* 打开清单 */
byId.get('rightsOpen').dispatch('click', { target: byId.get('rightsOpen') });
ok(dlg.open, '清单对话框已打开');
const sheetBody = byId.get('sheetBody');
const picks = sheetBody.querySelectorAll('.pick');
ok(picks.length === 3, '清单列出 3 条', 'count=' + picks.length);
ok(picks.length === 3 &&
   picks[0].querySelector('.no').textContent.indexOf('一') !== -1 &&
   picks[2].querySelector('.no').textContent.indexOf('二十五') !== -1,
   '清单按条号升序排列',
   picks.map(p => p.querySelector('.no').textContent).join(' / '));

/* 取消一条 */
const dropBtns = sheetBody.querySelectorAll('.drop');
ok(dropBtns.length === 3, '每条清单项都有「去掉」按钮');
sheetBody.dispatch('click', { target: dropBtns[2] });
ok(byId.get('rightsCount').innerHTML.indexOf('<b>2</b>') === 0, '清单内取消后计数变 2',
   byId.get('rightsCount').innerHTML);

/* 导出文字 */
const text = window.__myRights.asText();
const textLines = text.split('\n');
ok(text.indexOf('我的权利清单') === 0, '导出文本以标题开头');
ok(textLines[2] === '共 2 条', '导出文本条数正确', textLines[2]);
ok(text.indexOf('第一条') !== -1 && text.indexOf('第三条') !== -1, '导出文本含被记下的条文');
ok(text.indexOf('人人生而自由，在尊严和权利上一律平等。') !== -1, '导出文本含第一条中文');
ok(text.indexOf('All human beings are born free') !== -1, '导出文本含英文对照');
if (process.env.DBG) {
  console.log('DBG text=\n' + text);
  console.log('DBG dataset art-1=', JSON.stringify(byId.get('art-1').dataset).slice(0, 120));
  console.log('DBG dataset art-25=', byId.get('art-25') ? JSON.stringify(byId.get('art-25').dataset).slice(0, 120) : 'MISSING');
}

/* 打印 */
byId.get('sheetPrint').dispatch('click', { target: byId.get('sheetPrint') });
timers.filter(t => true).forEach(t => { if (t.ms === 240) t.fn(); });
ok(window._printed === true, '打印按钮确实触发了 window.print');

/* 关闭 */
byId.get('sheetDone').dispatch('click', { target: byId.get('sheetDone') });
ok(!dlg.open, '「继续阅读」关闭清单');

/* 清空 */
if (process.env.DBG) {
  console.log('DBG beforeReset markedArticles=',
    articles.filter(a => a._classes.has('marked')).map(a => a.id).join(','),
    'byId art-1=', !!byId.get('art-1'),
    'same=', byId.get('art-1') === articles[0],
    'art1classes=', [...articles[0]._classes].join('/'));
}
byId.get('rightsReset').dispatch('click', { target: byId.get('rightsReset') });
if (process.env.DBG) {
  console.log('DBG afterReset count=', byId.get('rightsCount').innerHTML,
    'art1=', [...articles[0]._classes].join('/'),
    'art3=', [...articles[2]._classes].join('/'),
    'pressed=', articles[2].querySelector('.mark-btn').getAttribute('aria-pressed'));
}
ok(byId.get('rightsCount').innerHTML.indexOf('<b>0</b>') === 0, '清空后计数归零');
ok(articles.every(a => !a._classes.has('marked')), '清空后所有标记状态撤销');
ok(btns.every(b => b.getAttribute('aria-pressed') === 'false'), '清空后 aria-pressed 全部复位');
ok(JSON.parse(localStorage.getItem('udhr.myRights.v1')).length === 0, '清空后持久化数据为空');

/* 空清单时的文案 */
byId.get('rightsOpen').dispatch('click', { target: byId.get('rightsOpen') });
ok(byId.get('sheetBody').innerHTML.indexOf('你还没有记下任何一条') !== -1, '空清单有引导文案');

/* 浮动条：无选择时隐藏 */
ok(!byId.get('rightsBar')._classes.has('on'), '无选择时浮条隐藏');

/* ───────────────── 重新载入：清单是否被记住 ───────────────── */
localStorage.setItem('udhr.myRights.v1', '[1,2,3]');
try {
  vm.runInContext(script, sandbox, { filename: 'page-reload.js' });
  ok(true, '页面脚本可在同一环境二次执行（模拟重新打开）');
} catch (e) {
  ok(false, '二次执行失败', e && e.message);
}
ok(byId.get('rightsCount').innerHTML.indexOf('<b>3</b>') === 0, '重新打开后清单数量恢复',
   byId.get('rightsCount').innerHTML);
ok(byId.get('rightsBar')._classes.has('on'), '重新打开后浮条自动出现');
ok([1, 2, 3].every(n => byId.get('art-' + n).classList.contains('marked')),
   '重新打开后三条标记状态恢复');
ok([1, 2, 3].every(n => byId.get('art-' + n).querySelector('.mark-btn').getAttribute('aria-pressed') === 'true'),
   '重新打开后 aria-pressed 恢复为 true');
ok(byId.get('art-4').querySelector('.mark-btn').getAttribute('aria-pressed') === 'false',
   '未标记的条文保持 false');

/* 二次执行不应破坏渲染结果 */
ok(articlesWrap.querySelectorAll('.article').length === 30 ||
   articlesWrap.querySelectorAll('.article').length === 30,
   '二次执行后条文数量不变（重渲染覆盖而非叠加）',
   'count=' + articlesWrap.querySelectorAll('.article').length);
ok(articlesWrap.querySelectorAll('.unit-label').length === 5, '二次执行后单元分隔仍为 5 个',
   'count=' + articlesWrap.querySelectorAll('.unit-label').length);

console.log('\n' + (fail ? fail + ' 项失败' : '全部通过'));
process.exit(fail ? 1 : 0);
