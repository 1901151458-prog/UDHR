
(function () {
'use strict';

/* ══════════════════════════════════════════════════════════════
   数据：序言 & 三十条（简体 / 繁體 / English 三语并列）
   ══════════════════════════════════════════════════════════════ */
const PREAMBLE = [
  { cn:'鉴于对人类家庭所有成员的固有尊严及其平等的和不移的权利的承认，乃是世界自由、正义与和平的基础，',
    tw:'鑒於對人類家庭所有成員的固有尊嚴及其平等的和不移的權利的承認，乃是世界自由、正義與和平的基礎，',
    en:'Whereas recognition of the inherent dignity and of the equal and inalienable rights of all members of the human family is the foundation of freedom, justice and peace in the world,' },
  { cn:'鉴于对人权的无视和侮蔑已发展为野蛮暴行，这些暴行玷污了人类的良心，而一个人人享有言论和信仰自由并免予恐惧和匮乏的世界的来临，已被宣布为普通人民的最高愿望，',
    tw:'鑒於對人權的無視和侮蔑已發展為野蠻暴行，這些暴行玷污了人類的良心，而一個人人都享有言論和信仰自由並免於恐懼和匱乏的世界的來臨，已被宣佈為普通人民的最高願望，',
    en:'Whereas disregard and contempt for human rights have resulted in barbarous acts which have outraged the conscience of mankind, and the advent of a world in which human beings shall enjoy freedom of speech and belief and freedom from fear and want has been proclaimed as the highest aspiration of the common people,' },
  { cn:'鉴于为使人类不致迫不得已铤而走险对暴政和压迫进行反叛，有必要使人权受法治的保护，',
    tw:'鑒於為使人類不致迫不得已鋌而走險對暴政和壓迫進行反叛，有必要使人權受法治的保護，',
    en:'Whereas it is essential, if man is not to be compelled to have recourse, as a last resort, to rebellion against tyranny and oppression, that human rights should be protected by the rule of law,' },
  { cn:'鉴于有必要促进各国间友好关系的发展，',
    tw:'鑒於有必要促進各國間友好關係的發展，',
    en:'Whereas it is essential to promote the development of friendly relations between nations,' },
  { cn:'鉴于各联合国国家的人民已在联合国宪章中重申他们对基本人权、人格尊严和价值以及男女平等权利的信念，并决心促成较大自由中的社会进步和生活水平的改善，',
    tw:'鑒於各聯合國國家的人民已在聯合國憲章中重申他們對基本人權、人格尊嚴和價值以及男女平等權利的信念，並決心促成較大自由中的社會進步和生活水準的改善，',
    en:'Whereas the peoples of the United Nations have in the Charter reaffirmed their faith in fundamental human rights, in the dignity and worth of the human person and in the equal rights of men and women and have determined to promote social progress and better standards of life in larger freedom,' },
  { cn:'鉴于各会员国业已誓愿同联合国合作以促进对人权和基本自由的普遍尊重和遵行，',
    tw:'鑒於各會員國業已誓願同聯合國合作以促進對人權和基本自由的普遍尊重和遵行，',
    en:'Whereas Member States have pledged themselves to achieve, in co-operation with the United Nations, the promotion of universal respect for and observance of human rights and fundamental freedoms,' },
  { cn:'鉴于对这些权利和自由的普遍了解对于这个誓愿的充分实现具有很大的重要性，',
    tw:'鑒於對這些權利和自由的普遍了解對於這個誓願的充分實現具有很大的重要性，',
    en:'Whereas a common understanding of these rights and freedoms is of the greatest importance for the full realization of this pledge,' },
  { cn:'因此现在，大会发布这一世界人权宣言，作为所有人民和所有国家努力实现的共同标准，以期每一个人和社会机构经常铭念本宣言，努力通过教诲和教育促进对权利和自由的尊重，并通过国家的和国际的渐进措施，使这些权利和自由在各会员国本身人民及在其管辖下领土的人民中得到普遍和有效的承认和遵行。',
    tw:'因此現在，大會發佈這一世界人權宣言，作為所有人民和所有國家努力實現的共同標準，以期每一個人和社會機構經常銘念本宣言，努力通過教誨和教育促進對權利和自由的尊重，並通過國家的和國際的漸進措施，使這些權利和自由在各會員國本身人民及在其管轄下領土的人民中得到普遍和有效的承認和遵行。',
    en:'Now, therefore, THE GENERAL ASSEMBLY proclaims THIS UNIVERSAL DECLARATION OF HUMAN RIGHTS as a common standard of achievement for all peoples and all nations, to the end that every individual and every organ of society, keeping this Declaration constantly in mind, shall strive by teaching and education to promote respect for these rights and freedoms and by progressive measures, national and international, to secure their universal and effective recognition and observance, both among the peoples of Member States themselves and among the peoples of territories under their jurisdiction.' }
];

const ARTICLES = [];

const CN_NUM = ['零','一','二','三','四','五','六','七','八','九','十',
                '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
                '二十一','二十二','二十三','二十四','二十五','二十六','二十七','二十八','二十九','三十'];

/* ══════════════════════════════════════════════════════════════
   情感叙事层 · 意义单元：三十条不是三十块石头，而是五段路
   ══════════════════════════════════════════════════════════════ */

const UNITS = [
  { no:'壹', cn:'活着，并且是个人', tw:'活著，並且是個人', en:'TO LIVE, AND TO BE A PERSON', a:[1,2,3,4,5,6] },
  { no:'貳', cn:'不受任意支配',     tw:'不受任意支配',     en:'NOT TO BE AT ANYONE’S MERCY', a:[7,8,9,10,11] },
  { no:'叁', cn:'在自己的生活里自由', tw:'在自己的生活裡自由', en:'FREE WITHIN ONE’S OWN LIFE', a:[12,13,14,15,16,17] },
  { no:'肆', cn:'说话，相聚，被听见', tw:'說話，相聚，被聽見', en:'TO SPEAK, TO GATHER, TO BE HEARD', a:[18,19,20,21] },
  { no:'伍', cn:'有尊严地生活',       tw:'有尊嚴地生活',       en:'TO LIVE IN DIGNITY', a:[22,23,24,25,26,27,28,29,30] }
];

/* ══════════════════════════════════════════════════════════════
   情感叙事层 · 人的处境
   每条正文之前，给读者一个入口：不是解释法律，而是提醒你，
   这一条关乎的那件事，平常是什么样子。场景是具体的、日常的，
   为的是让抽象的“权利”落到一个能被想象的人身上。
   —— 此段不属于《世界人权宣言》正文，仅为阅读引导。
   ══════════════════════════════════════════════════════════════ */

const NOTES = {};

const SOURCES = {};

const AGENCIES = {
  /* ── 联合国条约机构 ── */
  CCPR:  {zh:'人权事务委员会', en:'Human Rights Committee', kind:'treaty', url:'https://www.ohchr.org/en/treaty-bodies/ccpr', complaint:'https://www.ohchr.org/en/treaty-bodies/individual-communications-procedures-treaty-bodies', scope:'监督《公民权利和政治权利国际公约》' },
  CESCR: {zh:'经济、社会及文化权利委员会', en:'Committee on Economic, Social and Cultural Rights', kind:'treaty', url:'https://www.ohchr.org/en/treaty-bodies/cescr', complaint:'https://www.ohchr.org/en/treaty-bodies/individual-communications-procedures-treaty-bodies', scope:'监督《经济、社会及文化权利国际公约》' },
  CERD:  {zh:'消除种族歧视委员会', en:'Committee on the Elimination of Racial Discrimination', kind:'treaty', url:'https://www.ohchr.org/en/treaty-bodies/cerd', complaint:'https://www.ohchr.org/en/treaty-bodies/individual-communications-procedures-treaty-bodies', scope:'监督《消除一切形式种族歧视国际公约》' },
  CEDAW: {zh:'消除对妇女歧视委员会', en:'Committee on the Elimination of Discrimination against Women', kind:'treaty', url:'https://www.ohchr.org/en/treaty-bodies/cedaw', complaint:'https://www.ohchr.org/en/treaty-bodies/individual-communications-procedures-treaty-bodies', scope:'监督《消除对妇女一切形式歧视公约》' },
  CAT:   {zh:'禁止酷刑委员会', en:'Committee against Torture', kind:'treaty', url:'https://www.ohchr.org/en/treaty-bodies/cat', complaint:'https://www.ohchr.org/en/treaty-bodies/individual-communications-procedures-treaty-bodies', scope:'监督《禁止酷刑公约》，可直接受理个人来文' },
  CRC:   {zh:'儿童权利委员会', en:'Committee on the Rights of the Child', kind:'treaty', url:'https://www.ohchr.org/en/treaty-bodies/crc', complaint:'https://www.ohchr.org/en/treaty-bodies/individual-communications-procedures-treaty-bodies', scope:'监督《儿童权利公约》' },
  CRPD:  {zh:'残疾人权利委员会', en:'Committee on the Rights of Persons with Disabilities', kind:'treaty', url:'https://www.ohchr.org/en/treaty-bodies/crpd', complaint:'https://www.ohchr.org/en/treaty-bodies/individual-communications-procedures-treaty-bodies', scope:'监督《残疾人权利公约》' },
  CED:   {zh:'强迫失踪问题委员会', en:'Committee on Enforced Disappearances', kind:'treaty', url:'https://www.ohchr.org/en/treaty-bodies/ced', complaint:'https://www.ohchr.org/en/treaty-bodies/individual-communications-procedures-treaty-bodies', scope:'可发「紧急行动请求」查找失踪者' },
  CMW:   {zh:'移徙工人委员会', en:'Committee on Migrant Workers', kind:'treaty', url:'https://www.ohchr.org/en/treaty-bodies/cmw', complaint:'https://www.ohchr.org/en/treaty-bodies/individual-communications-procedures-treaty-bodies', scope:'监督《保护所有移徙工人及其家庭成员权利国际公约》' },
  /* ── 联合国专门机构 ── */
  ILO:   {zh:'国际劳工组织', en:'International Labour Organization', kind:'agency', url:'https://www.ilo.org/', complaint:'https://www.ilo.org/international-labour-standards/ilo-supervisory-system-special-procedures/complaint-procedure-art26', scope:'劳工标准监督与投诉（结社自由、强迫劳动、同工同酬）' },
  UNESCO:{zh:'联合国教科文组织', en:'UNESCO', kind:'agency', url:'https://www.unesco.org/en/right-education', scope:'受教育权与文化权利的监督' },
  WHO:   {zh:'世界卫生组织', en:'World Health Organization', kind:'agency', url:'https://www.who.int/health-topics/human-rights', scope:'健康权' },
  UNHCR: {zh:'联合国难民署', en:'UNHCR, the UN Refugee Agency', kind:'agency', url:'https://help.unhcr.org/', scope:'庇护申请、难民与无国籍者求助' },
  UNICEF:{zh:'联合国儿童基金会', en:'UNICEF', kind:'agency', url:'https://www.unicef.org/protection', scope:'儿童保护' },
  UNWOMEN:{zh:'联合国妇女署', en:'UN Women', kind:'agency', url:'https://www.unwomen.org/en', scope:'妇女权利' },
  IOM:   {zh:'国际移民组织', en:'International Organization for Migration', kind:'agency', url:'https://www.iom.int/', scope:'移民与人口贩运求助' },
  /* ── 人道组织 ── */
  ICRC:  {zh:'红十字国际委员会', en:'International Committee of the Red Cross', kind:'humanitarian', url:'https://www.icrc.org/en/contact', scope:'探视被拘者、失踪人员、人道求助' }
};

/* 每条条文对应的渠道：un 条约机构 / spec 专门机构 / regional 地区机制 */

const HELPLINES = {};

/* ══════════════════════════════════════════════════════════════
   渲染：三语并列 · 意义单元 · 人的处境
   （标记状态由下方的「我的权利清单」负责恢复）
   ══════════════════════════════════════════════════════════════ */
(function renderContent () {
  const LANG_ATTR = { 'lang-cn':'zh-Hans', 'lang-tw':'zh-Hant', 'lang-en':'en' };

  const block = (cls, text) =>
    `<div class="lang ${cls}" lang="${LANG_ATTR[cls]}">` +
      text.split('<br>').map(s => `<p>${s}</p>`).join('') +
    `</div>`;

  const pWrap = document.getElementById('preamble');
  pWrap.innerHTML = '';          /* 幂等：重复执行时覆盖而非叠加 */
  PREAMBLE.forEach(item => {
    const div = document.createElement('div');
    div.className = 'clause';
    div.innerHTML =
      block('lang-cn', item.cn) +
      block('lang-tw', item.tw) +
      block('lang-en', item.en);
    pWrap.appendChild(div);
  });

  const unitOf = n => UNITS.find(u => u.a.indexOf(n) !== -1);

  const noteHtml = n => {
    const t = NOTES[n];
    if (!t) return '';
    return `<div class="note">
        <span class="tag">人的处境 · 一件真事</span>
        <span class="ln-cn" lang="zh-Hans">${t.cn}</span>
        ${t.tw && t.tw !== t.cn ? `<span class="ln-tw" lang="zh-Hant">${t.tw}</span>` : ''}
        <span class="ln-en" lang="en">${t.en}</span>
      </div>`;
  };

  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const quoteHtml = (q, cls) => {
    const tw = q.tw && q.tw !== q.text
      ? `<div class="txt tw" lang="zh-Hant">${esc(q.tw)}</div>` : '';
    return `<div class="quote ${cls}">
        <span class="tradition">${cls === 'conf' ? '儒家典籍' : '基督教典籍'}</span>
        <div class="txt" lang="zh-Hans">${esc(q.text)}</div>
        ${tw}
        <div class="src">${esc(q.src)}${q.en ? `<span class="en">${esc(q.en)}</span>` : ''}</div>
        ${q.note ? `<div class="gloss">${esc(q.note)}</div>` : ''}
      </div>`;
  };

  const helpHtml = n => {
    const h = HELPLINES[n];
    if (!h || (!h.un && !h.spec && !h.regional)) return '';
    const kinds = {
      treaty:'联合国条约机构', agency:'联合国专门机构', regional:'地区机制', humanitarian:'人道组织', general:'通用入口'
    };
    const item = key => {
      const a = AGENCIES[key];
      if (!a) return '';
      const url = a.complaint || a.url;
      return `<li class="h-item">
        <span class="h-name">
          <a href="${url}" target="_blank" rel="noopener noreferrer">${esc(a.zh)}</a>
          ${a.en ? `<span class="h-en">${esc(a.en)}</span>` : ''}
          <span class="h-kind">${kinds[a.kind] || '机构'}</span>
          ${a.complaint && a.complaint !== a.url ? '<span class="h-can">可提交申诉</span>' : ''}
        </span>
        ${a.scope ? `<span class="h-scope">${esc(a.scope)}</span>` : ''}
      </li>`;
    };
    const list = [].concat(h.un, h.spec, h.regional, h.general).filter(Boolean);
    return `<details class="help" id="help-${n}">
        <summary>
          <span class="cap">求助与监督渠道
            <span class="en">Where to seek help &amp; oversight</span></span>
          <span class="chev" aria-hidden="true">▾</span>
        </summary>
        <div class="help-body">
          <ul class="h-list">${list.map(item).join('')}</ul>
          ${h.note ? `<p class="h-note">${esc(h.note)}</p>` : ''}
          <p class="h-disclaimer"><b>须知：</b>联合国条约机构的个人来文通常要求：该国已批准相应公约、已用尽国内救济、同一事项未在其他国际程序中审理；条约机构不提供律师，其结论以「意见」形式作出。紧急人身危险请优先联系本地法律援助、红十字国际委员会或所在国监察机构。<b>对中国读者：</b>中国未批准任何来文议定书，条约机构个人来文对中国不可用——请改用上方「适用于中国的国际求助途径」中的渠道。</p>
        </div>
      </details>`;
  };

  const srcHtml = n => {
    const s = SOURCES[n];
    if (!s) return '';
    return `<details class="sources" id="sources-${n}">
        <summary>
          <span class="cap">查看思想来源
            <span class="en">Sources &amp; tradition</span></span>
          <span class="chev" aria-hidden="true">▾</span>
        </summary>
        <div class="src-body">
          <p class="src-note">这一条写在 1948 年，但它所回答的问题并不新。下面是两个更古老的传统在同一件事上说过的部分，供对照其来源与渊源。</p>
          ${(s.conf || []).map(q => quoteHtml(q, 'conf')).join('')}
          ${(s.christ || []).map(q => quoteHtml(q, 'christ')).join('')}
          ${s.hist ? `<div class="src-hist"><span class="tag">历史渊源</span>${s.hist}</div>` : ''}
          <p class="src-disclaimer"><b>辨析：</b>典籍与《宣言》条文之间是渊源与呼应的关系，不是引用关系；标注“思想呼应”者，表示该条在这个传统里没有直接对应，只有相近的问题意识。《宣言》是世俗文本，其条文不建立在任何宗教或学派之上。</p>
        </div>
      </details>`;
  };

  const aWrap = document.getElementById('articles');
  aWrap.innerHTML = '';          /* 幂等：重复执行时覆盖而非叠加 */
  let currentUnit = null;

  function renderArticle(a) {
    const u = unitOf(a.n);
    if (u && u !== currentUnit) {
      currentUnit = u;
      const ul = document.createElement('div');
      ul.className = 'unit-label';
      ul.innerHTML =
        `<span class="ln" aria-hidden="true"></span>
         <span class="txt" lang="zh-Hans">${u.no} · ${u.cn}
           <span class="no" lang="en">${u.en}</span>
         </span>
         <span class="ln r" aria-hidden="true"></span>`;
      aWrap.appendChild(ul);
    }

    const art = document.createElement('article');
    art.className = 'article' + (a.n === 1 ? ' highlight' : '');
    art.id = 'art-' + a.n;
    art.tabIndex = -1;                    /* 不进 Tab 序列（否则键盘用户要穿过 30 个条文） */
    art.setAttribute('tabindex', '-1');   /* 可编程聚焦：目录跳转后由脚本 focus */
    art.dataset.n = String(a.n);
    art.dataset.cn = a.cn.replace(/<br>/g, ' ');
    art.dataset.tw = a.tw.replace(/<br>/g, ' ');
    art.dataset.en = a.en.replace(/<br>/g, ' ');
    art.innerHTML =
      `<div class="art-label">
         <span class="cn" lang="zh-Hans">第${CN_NUM[a.n]}条</span>
         <span class="dot" aria-hidden="true"></span>
         <span class="tw" lang="zh-Hant">第${CN_NUM[a.n]}條</span>
         <span class="dot" aria-hidden="true"></span>
         <span class="en" lang="en">Article ${a.n}</span>
       </div>` +
      noteHtml(a.n) +
      block('lang-cn', a.cn) +
      block('lang-tw', a.tw) +
      block('lang-en', a.en) +
      srcHtml(a.n) +
      helpHtml(a.n) +
      `<div class="act">
         <button type="button" class="mark-btn" data-mark="${a.n}"
                 aria-pressed="false"
                 aria-label="记下第${CN_NUM[a.n]}条：这一条与我有关">
           <span class="ico" aria-hidden="true">✦</span><span class="lbl">这一条，与我有关</span>
         </button>
       </div>`;
    aWrap.appendChild(art);
  }
  function appendChunk(chunk) {
    Object.assign(NOTES, chunk.notes || {});
    Object.assign(SOURCES, chunk.sources || {});
    Object.assign(HELPLINES, chunk.helplines || {});
    (chunk.articles || []).forEach(function (a) { ARTICLES.push(a); renderArticle(a); });
    document.dispatchEvent(new CustomEvent('udhr:chunk'));
  }
  window.__udhrAppend = appendChunk;
})();

/* ══════════════════════════════════════════════════════════════
   三十条目录：按条号直达
   ══════════════════════════════════════════════════════════════ */
(function toc () {
  const openBtn = document.getElementById('tocOpen');
  const float   = document.getElementById('tocFloat');
  const dlg     = document.getElementById('tocSheet');
  const body    = document.getElementById('tocBody');
  if (!openBtn || !dlg || !body) return;
  let opener = openBtn;

  body.innerHTML = UNITS.map(u =>
    `<div class="unit-row">
       <div class="u-name" lang="zh-Hans">${u.no} · ${u.cn}</div>
       <div class="chips">
         ${u.a.map(n =>
           `<button type="button" class="chip" data-toc-n="${n}"
                    aria-label="跳到第${CN_NUM[n]}条">
              <span class="no" aria-hidden="true">${n}</span>
              <span class="cn" aria-hidden="true">第${CN_NUM[n]}条</span>
            </button>`).join('')}
       </div>
     </div>`).join('');

  function close () {
    if (typeof dlg.close === 'function' && dlg.open) dlg.close();
    else dlg.removeAttribute('open');
  }

  function openFrom (btn) {
    opener = btn;
    if (typeof dlg.showModal === 'function') { if (!dlg.open) dlg.showModal(); }
    else dlg.setAttribute('open', '');
  }

  openBtn.addEventListener('click', () => openFrom(openBtn));

  if (float) {
    float.addEventListener('click', () => openFrom(float));
    /* 正文标题处的目录按钮滚出屏幕后，常驻按钮浮现 */
    let raf = false;
    function updateFloat () {
      raf = false;
      let show = false;
      try { show = openBtn.getBoundingClientRect().top < -60; } catch (e) {}
      float.classList.toggle('on', show);
    }
    window.addEventListener('scroll', () => {
      if (raf) return; raf = true;
      requestAnimationFrame(updateFloat);
    }, { passive: true });
    window.addEventListener('resize', updateFloat, { passive: true });
    updateFloat();
  }

  dlg.addEventListener('close', () => { if (opener) opener.focus(); });

  dlg.addEventListener('click', e => {
    if (e.target.closest && e.target.closest('#tocClose')) { close(); return; }
    const chip = e.target.closest ? e.target.closest('.chip') : null;
    if (!chip) return;
    const n   = Number(chip.dataset.tocN);
    close();
    function reveal () {
      const art = document.getElementById('art-' + n);
      if (!art) return;
      if (art.scrollIntoView) {
        try { art.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        catch (e) { art.scrollIntoView(); }
      }
      art.classList.remove('jump');
      void art.offsetWidth;
      art.classList.add('jump');
      art.focus({ preventScroll: true });
    }
    if (document.getElementById('art-' + n)) reveal();
    else if (window.__udhrEnsure) window.__udhrEnsure(Math.ceil(n / 5)).then(reveal);
  });
})();


/* ══════════════════════════════════════════════════════════════
   粒子系统 —— 更清晰 / 更大 / 笔画更细
   关键调整：
   · 无描边 + 700 字重 → 笔画纤细
   · 采样密度提高（gap ≈ 1.5 DPR）→ 轮廓锐利
   · 粒子尺寸 = 采样间距 × 系数 → 无空隙也不糊
   · 拖尾淡出加快 → 减少拖影，边界清晰
   · 汇聚时流场近乎为零 → 粒子稳定贴合目标点
   ══════════════════════════════════════════════════════════════ */
const cv  = document.getElementById('bg');
const ctx = cv.getContext('2d', { alpha: true });

/* 每个理念同时以 简体 / 繁體 / English 三种语言形式呈现（同屏并列），
   三者共用同一字体栈、字重、字距与字号，以示完全平等。
   注：联合国《世界人权宣言》英文正式全称为
   “Universal Declaration of Human Rights”，不可省略 “of Human Rights”。
   自由取 FREEDOM（序言及多数条文用词）；LIBERTY 仅见于第三条 “life, liberty and security”。*/
const CONCEPTS = [
  { cn:'世界人权宣言', tw:'世界人權宣言', en:'UNIVERSAL DECLARATION|OF HUMAN RIGHTS' },
  { cn:'尊严',         tw:'尊嚴',         en:'DIGNITY'     },
  { cn:'自由',         tw:'自由',         en:'FREEDOM'     },
  { cn:'平等',         tw:'平等',         en:'EQUALITY'    },
  { cn:'健康',         tw:'健康',         en:'HEALTH'      }
];
CONCEPTS.forEach(c => {
  const lines = [c.cn];
  if (c.tw !== c.cn) lines.push(c.tw);          /* 简繁同形时不重复 */
  c.en.split('|').forEach(t => lines.push(t));
  c.lines = lines;
});
let conceptIdx = 0;

let W = 0, H = 0, DPR = 1;

let N = 0;
let px = new Float32Array(0), py = new Float32Array(0);
let vx = new Float32Array(0), vy = new Float32Array(0);
let tx = new Float32Array(0), ty = new Float32Array(0);
let phase = new Float32Array(0);
let colorIdx = new Uint8Array(0);

let mode = 'gather';
let modeStart = 0;
let k = 0;

const K_MAX  = 0.05;      /* 更高的弹簧刚度 → 更紧贴目标 */
const DAMP   = 0.88;

const mouse = { x:-1e5, y:-1e5, sx:-1e5, sy:-1e5 };

/* ── 蓝金渐变调色板（16 档） ── */
const STOPS = [
  [ 36,  84, 178],
  [ 91, 146, 229],
  [143, 195, 240],
  [232, 240, 250],
  [245, 215, 160],
  [217, 179, 130],
  [168, 124,  74]
];
const PALETTE = [];
const CN = 16;
for (let i = 0; i < CN; i++) {
  const t = i / (CN - 1) * (STOPS.length - 1);
  const seg = Math.min(Math.floor(t), STOPS.length - 2);
  const lt  = t - seg;
  const a = STOPS[seg], b = STOPS[seg + 1];
  const r = Math.round(a[0] + (b[0] - a[0]) * lt);
  const g = Math.round(a[1] + (b[1] - a[1]) * lt);
  const bl = Math.round(a[2] + (b[2] - a[2]) * lt);
  PALETTE.push(`rgb(${r}, ${g}, ${bl})`);
}
let colorStart = new Int32Array(CN + 1);

/* ── 星空粒子（象征宇宙） ── */
let NS = 0;
let starX = new Float32Array(0), starY = new Float32Array(0);
let starR = new Float32Array(0), starPh = new Float32Array(0), starSp = new Float32Array(0);
let starCol = [];
const STAR_COLORS = ['#dfe9ff', '#c9dcff', '#ffffff', '#f0d8ae'];

function buildStars () {
  const cssArea = (W / DPR) * (H / DPR);
  NS = Math.max(70, Math.min(240, Math.round(cssArea / 17000)));
  starX = new Float32Array(NS); starY = new Float32Array(NS);
  starR = new Float32Array(NS); starPh = new Float32Array(NS); starSp = new Float32Array(NS);
  starCol = new Array(NS);
  for (let i = 0; i < NS; i++) {
    starX[i] = Math.random() * W;
    starY[i] = Math.random() * H;
    starR[i] = (0.5 + Math.random() * 1.3) * DPR;
    starPh[i] = Math.random() * Math.PI * 2;
    starSp[i] = 0.4 + Math.random() * 1.6;
    const r = Math.random();
    starCol[i] = r < 0.62 ? STAR_COLORS[0]
               : r < 0.82 ? STAR_COLORS[1]
               : r < 0.94 ? STAR_COLORS[2]
               :            STAR_COLORS[3];
  }
}

const FONT_BODY = 'Georgia,"Times New Roman","Songti SC","STSong","SimSun","Noto Serif SC","Source Han Serif SC",serif';
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

/* ── 星云粒子：柔和、缓慢流动的背景光雾 ── */
const NEB_RGB = [[112,162,232], [150,192,246], [240,214,158], [214,226,246]];
let nebSprites = [];
let NN = 0;
let nebX = new Float32Array(0), nebY = new Float32Array(0);
let nebR = new Float32Array(0), nebPh = new Float32Array(0);
let nebSp = new Float32Array(0), nebA = new Float32Array(0);
let nebC = new Uint8Array(0);

function makeNebSprites () {
  nebSprites = NEB_RGB.map(rgb => {
    const s = document.createElement('canvas');
    s.width = s.height = 64;
    const c = s.getContext('2d');
    const gr = c.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0,    'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',.92)');
    gr.addColorStop(0.35, 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',.30)');
    gr.addColorStop(1,    'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',0)');
    c.fillStyle = gr;
    c.fillRect(0, 0, 64, 64);
    return s;
  });
}

function buildNebula () {
  if (!nebSprites.length) makeNebSprites();
  const cssArea = (W / DPR) * (H / DPR);
  NN = Math.max(36, Math.min(130, Math.round(cssArea / 16000)));
  nebX = new Float32Array(NN); nebY = new Float32Array(NN);
  nebR = new Float32Array(NN); nebPh = new Float32Array(NN);
  nebSp = new Float32Array(NN); nebA = new Float32Array(NN);
  nebC = new Uint8Array(NN);
  for (let i = 0; i < NN; i++) {
    nebX[i] = Math.random() * W;
    nebY[i] = Math.random() * H;
    nebR[i] = (26 + Math.random() * 96) * DPR;
    nebPh[i] = Math.random() * Math.PI * 2;
    nebSp[i] = 0.10 + Math.random() * 0.32;
    nebA[i] = 0.05 + Math.random() * 0.10;
    const q = Math.random();
    nebC[i] = q < 0.40 ? 0 : q < 0.72 ? 1 : q < 0.90 ? 3 : 2;
  }
}

/* 采样间距（渲染时用来计算粒子尺寸，使粒子刚好填满字形） */
let sampleGap = 3;

/* ── 多行文字 → 采样点 ──
   三语共用同一字体栈 / 字重 / 字距 / 字号，仅按最长行与行数自适应，确保完全一致 */
function samplePoints (lines) {
  const off = document.createElement('canvas');
  off.width  = Math.max(1, W);
  off.height = Math.max(1, H);
  const o = off.getContext('2d', { willReadFrequently:true });
  o.fillStyle = '#fff';
  o.strokeStyle = '#fff';
  o.lineJoin = 'round';
  o.lineCap  = 'round';
  o.textAlign = 'center';
  o.textBaseline = 'middle';
  o.font = `700 100px ${FONT_BODY}`;
  o.letterSpacing = '0.04em';

  const L = Math.max(1, lines.length);
  const LINE_GAP = 1.34;                 /* 统一行高系数 */
  const targetW  = Math.min(W * 0.96, 1240 * DPR);

  /* 以最长行决定宽度上限 */
  let maxRatio = 0.0001;
  for (const ln of lines) {
    const ratio = (o.measureText(ln).width || 1) / 100;
    if (ratio > maxRatio) maxRatio = ratio;
  }

  const fsByWidth  = targetW / maxRatio;
  const fsByHeight = (H * 0.44) / (L * LINE_GAP);
  let fs = Math.min(fsByWidth, fsByHeight);
  fs = Math.max(fs, 34 * DPR);
  fs = Math.min(fs, 300 * DPR);

  o.font = `700 ${fs}px ${FONT_BODY}`;
  o.letterSpacing = '0.04em';

  const cx = W / 2;
  const cy = H * 0.29;
  const lineH = fs * LINE_GAP;
  lines.forEach((ln, i) => {
    o.fillText(ln, cx, cy + (i - (L - 1) / 2) * lineH);
  });

  const data = o.getImageData(0, 0, W, H).data;

  /* 高密度采样：gap ≈ 1.5 DPR，点上限提高 */
  const MAXP = 34000;
  let gap = Math.max(2, Math.round(1.5 * DPR));
  let pts = [];

  for (let guard = 0; guard < 16; guard++) {
    pts = [];
    for (let y = 0; y < H; y += gap) {
      const row = y * W;
      for (let x = 0; x < W; x += gap) {
        if (data[(row + x) * 4 + 3] > 110) pts.push(x, y);
      }
    }
    if (pts.length / 2 <= MAXP) break;
    gap = Math.round(gap * 1.2) + 1;
  }

  sampleGap = gap;
  return { pts: pts, fs: fs, cy: cy, lineH: lineH };
}

/* ── 数组伸缩 ── */
function resizeArrays (M) {
  if (M === N) return;
  const _px = new Float32Array(M), _py = new Float32Array(M);
  const _vx = new Float32Array(M), _vy = new Float32Array(M);
  const _tx = new Float32Array(M), _ty = new Float32Array(M);
  const _ph = new Float32Array(M);
  const _ci = new Uint8Array(M);

  const keep = Math.min(M, N);
  for (let i = 0; i < keep; i++) {
    _px[i] = px[i]; _py[i] = py[i];
    _vx[i] = vx[i]; _vy[i] = vy[i];
    _tx[i] = tx[i]; _ty[i] = ty[i];
    _ph[i] = phase[i];
    _ci[i] = colorIdx[i];
  }
  for (let i = keep; i < M; i++) {
    _px[i] = Math.random() * W;
    _py[i] = Math.random() * H;
    _ph[i] = Math.random() * Math.PI * 2;
    _ci[i] = i % CN;
  }

  px = _px; py = _py; vx = _vx; vy = _vy;
  tx = _tx; ty = _ty; phase = _ph; colorIdx = _ci;
  N = M;
}

function reorderByColor () {
  const counts = new Int32Array(CN);
  for (let i = 0; i < N; i++) counts[colorIdx[i]]++;
  colorStart[0] = 0;
  for (let c = 0; c < CN; c++) colorStart[c + 1] = colorStart[c] + counts[c];

  const _px = new Float32Array(N), _py = new Float32Array(N);
  const _vx = new Float32Array(N), _vy = new Float32Array(N);
  const _tx = new Float32Array(N), _ty = new Float32Array(N);
  const _ph = new Float32Array(N);

  const pos = new Int32Array(CN);
  for (let c = 0; c < CN; c++) pos[c] = colorStart[c];

  for (let i = 0; i < N; i++) {
    const c = colorIdx[i];
    const j = pos[c]++;
    _px[j] = px[i]; _py[j] = py[i];
    _vx[j] = vx[i]; _vy[j] = vy[i];
    _tx[j] = tx[i]; _ty[j] = ty[i];
    _ph[j] = phase[i];
  }

  px = _px; py = _py; vx = _vx; vy = _vy;
  tx = _tx; ty = _ty; phase = _ph;

  let idx = 0;
  for (let c = 0; c < CN; c++) {
    const cnt = counts[c];
    for (let m = 0; m < cnt; m++) colorIdx[idx++] = c;
  }
}

function setTargets (pts) {
  const M = pts.length >> 1;
  if (M === 0) return false;
  resizeArrays(M);

  let minX = Infinity, maxX = -Infinity;
  for (let i = 0; i < M; i++) {
    const x = pts[i * 2];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
  }
  const span = maxX - minX || 1;

  for (let i = 0; i < N; i++) {
    tx[i] = pts[i * 2];
    ty[i] = pts[i * 2 + 1];
    const t = (tx[i] - minX) / span;
    colorIdx[i] = Math.min(CN - 1, Math.floor(t * CN));
  }

  reorderByColor();
  return true;
}


/* 采样并切换到第 conceptIdx 个理念 */
function showConcept (nextMode) {
  const c = CONCEPTS[conceptIdx];
  const s = samplePoints(c.lines);
  const ok = setTargets(s.pts);
  mode = ok ? nextMode : 'scatter';
  modeStart = performance.now();
}

function startNextWord (nextMode) {
  conceptIdx = (conceptIdx + 1) % CONCEPTS.length;
  showConcept(nextMode);
}

function resize () {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = Math.floor(window.innerWidth  * DPR);
  H = Math.floor(window.innerHeight * DPR);
  cv.width = W; cv.height = H;
  cv.style.width  = window.innerWidth  + 'px';
  cv.style.height = window.innerHeight + 'px';
  buildStars();
  buildNebula();
}

let scrolledAway = false;

let lastT = 0;

function loop (now) {
  if (document.hidden) {            /* 标签页在后台：跳过计算与绘制，省电 */
    requestAnimationFrame(loop);
    return;
  }
  if (!lastT) lastT = now;
  let dt = (now - lastT) / 16.667;
  lastT = now;
  dt = Math.min(Math.max(dt, 0.25), 2.5);

  const t = now * 0.001;

  const el = now - modeStart;
  if (scrolledAway) {
    k *= 0.94;
  } else if (mode === 'gather') {
    k = easeOutCubic(Math.min(el / 1200, 1)) * K_MAX;
    if (el > 1200) { mode = 'hold'; modeStart = now; }
  } else if (mode === 'hold') {
    k = K_MAX * 1.7;
    if (el > 2800) startNextWord('morph');
  } else if (mode === 'morph') {
    const p = Math.min(el / 1400, 1);
    const dip = Math.sin(p * Math.PI);
    k = K_MAX * (1 - 0.45 * dip);
    if (p >= 1) { mode = 'hold'; modeStart = now; }
  } else {
    k *= 0.90;
    if (el > 800) startNextWord('gather');
  }

  mouse.sx += (mouse.x - mouse.sx) * Math.min(1, 0.28 * dt);
  mouse.sy += (mouse.y - mouse.sy) * Math.min(1, 0.28 * dt);

  /* 拖尾淡出加快 → 减少拖影，字形边缘更锐利 */
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0,0,0,0.34)';
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter';

  if (N === 0) { requestAnimationFrame(loop); return; }

  const conv = Math.min(k / K_MAX, 1);

  const R    = 150 * DPR, R2 = R * R;
  /* 汇聚时流场几乎为零 → 粒子稳定贴合目标点，边界清晰 */
  const flow = 0.06 + (1 - conv) * 1.10;
  const BND  = 70 * DPR;

  for (let i = 0; i < N; i++) {
    const x = px[i], y = py[i];
    let vxi = vx[i], vyi = vy[i];
    let fx = 0, fy = 0;
    const ph = phase[i];

    const ang = Math.sin(x * 0.0016 + t * 0.50 + ph) * 2.0
              + Math.cos(y * 0.0019 - t * 0.35 + ph * 1.3) * 2.0
              + Math.sin((x + y) * 0.0008 + t * 0.9) * 1.2;
    fx += Math.cos(ang) * flow;
    fy += Math.sin(ang) * flow;
    fy -= 0.012;

    if (k > 0) {
      fx += (tx[i] - x) * k;
      fy += (ty[i] - y) * k;
    }

    const dx = x - mouse.sx, dy = y - mouse.sy;
    const d2 = dx * dx + dy * dy;
    if (d2 < R2 && d2 > 0.01) {
      const d = Math.sqrt(d2);
      const f = 1 - d / R;
      const ff = f * f * 46 * DPR;
      fx += (dx / d) * ff;
      fy += (dy / d) * ff;
    }

    if (x < BND)     fx += (BND - x) * 0.004;
    if (x > W - BND) fx -= (x - (W - BND)) * 0.004;
    if (y < BND)     fy += (BND - y) * 0.004;
    if (y > H - BND) fy -= (y - (H - BND)) * 0.004;

    vxi = (vxi + fx * dt) * Math.pow(DAMP, dt);
    vyi = (vyi + fy * dt) * Math.pow(DAMP, dt);

    const sp2 = vxi * vxi + vyi * vyi;
    if (sp2 > 1600) { const s = 40 / Math.sqrt(sp2); vxi *= s; vyi *= s; }

    px[i] = x + vxi * dt;
    py[i] = y + vyi * dt;
    vx[i] = vxi;
    vy[i] = vyi;
  }

  /* ── 星云：柔和光雾，缓慢流动（象征宇宙） ── */
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < NN; i++) {
    const nx = nebX[i] + Math.sin(t * nebSp[i] * 0.6  + nebPh[i])       * 76 * DPR;
    const ny = nebY[i] + Math.cos(t * nebSp[i] * 0.45 + nebPh[i] * 1.3) * 52 * DPR;
    const nr = nebR[i] * (0.86 + 0.14 * Math.sin(t * nebSp[i] * 0.9 + nebPh[i]));
    ctx.globalAlpha = (scrolledAway ? 0.5 : 1) *
                      nebA[i] * (0.6 + 0.4 * Math.sin(t * nebSp[i] * 0.7 + nebPh[i] * 2));
    ctx.drawImage(nebSprites[nebC[i]], nx - nr, ny - nr, nr * 2, nr * 2);
  }
  ctx.globalAlpha = 1;

  /* ── 星空：恒定微光 + 缓慢闪烁（象征宇宙） ── */
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < NS; i++) {
    const tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * starSp[i] + starPh[i]));
    ctx.globalAlpha = (scrolledAway ? 0.04 : 0.10) * tw;
    ctx.fillStyle = starCol[i];
    const sr = starR[i];
    ctx.fillRect(starX[i] - sr * 0.5, starY[i] - sr * 0.5, sr, sr);
  }

  /* ── 绘制：粒子尺寸与采样间距挂钩，既无空隙也不模糊 ── */
  const baseSize = Math.max(1, sampleGap * 0.98);
  const s    = baseSize * (0.5 + conv * 0.62);   /* 汇聚时 ≈ 采样间距，填满字形 */
  const half = s * 0.5;

  ctx.globalAlpha = (0.92 + conv * 0.08);

  for (let c = 0; c < CN; c++) {
    ctx.fillStyle = PALETTE[c];
    const s0 = colorStart[c], s1 = colorStart[c + 1];
    for (let i = s0; i < s1; i++) {
      ctx.fillRect(px[i] - half, py[i] - half, s, s);
    }
  }

  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';

  requestAnimationFrame(loop);
}

/* ══════════════════════════════════════════════════════════════
   事件
   ══════════════════════════════════════════════════════════════ */
function setMouse (cx, cy) {
  mouse.x = cx * DPR;
  mouse.y = cy * DPR;
}

window.addEventListener('mousemove', e => setMouse(e.clientX, e.clientY), { passive:true });
window.addEventListener('touchmove', e => {
  if (e.touches[0]) setMouse(e.touches[0].clientX, e.touches[0].clientY);
}, { passive:true });

function clearMouse () {
  mouse.x = mouse.sx = -1e5;
  mouse.y = mouse.sy = -1e5;
}
window.addEventListener('mouseleave', clearMouse);
window.addEventListener('touchend',   clearMouse);
window.addEventListener('touchcancel', clearMouse);

window.addEventListener('pointerdown', () => {
  if (!scrolledAway && mode !== 'morph') startNextWord('morph');
});

window.addEventListener('scroll', () => {
  const away = window.scrollY > window.innerHeight * 0.55;
  if (away !== scrolledAway) {
    scrolledAway = away;
    if (!scrolledAway) {
      showConcept('gather');
      k = 0;
    }
  }
}, { passive:true });

let resizeTimer = 0;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const oldW = W, oldH = H;
    resize();
    if (oldW && oldH) {
      const sx = W / oldW, sy = H / oldH;
      for (let i = 0; i < N; i++) { px[i] *= sx; py[i] *= sy; }
    }
    if (!scrolledAway) {
      showConcept(mode === 'gather' ? 'gather' : 'hold');
    }
  }, 160);
});

/* ══════════════════════════════════════════════════════════════
   启动
   ══════════════════════════════════════════════════════════════ */
resize();

(function boot () {
  conceptIdx = 0;
  const c = CONCEPTS[0];
  const s = samplePoints(c.lines);
  resizeArrays(s.pts.length >> 1);
  for (let i = 0; i < N; i++) {
    px[i] = Math.random() * W;
    py[i] = Math.random() * H;
    phase[i] = Math.random() * Math.PI * 2;
  }
  setTargets(s.pts);
  mode = 'gather';
  modeStart = performance.now();
  k = 0;
})();

/* ══════════════════════════════════════════════════════════════
   正文显影：文字进入视口时，由粒子汇聚成形，随后文字淡入
   ══════════════════════════════════════════════════════════════ */
(function revealSystem () {
  const reduce = window.matchMedia &&
                 window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const docEl = document.querySelector('.doc');
  if (!docEl || reduce) return;

  const queue = [];
  let active = 0;
  const MAX_ACTIVE = 2;

  /* ── 采样一段文字的字形轮廓（逐字定位，兼容三种语言与两端对齐） ── */
  function collectGlyphs (el, rect, scale) {
    const cw = Math.max(1, Math.round(rect.width  * scale));
    const ch = Math.max(1, Math.round(rect.height * scale));
    const off = document.createElement('canvas');
    off.width = cw; off.height = ch;
    const o = off.getContext('2d', { willReadFrequently: true });
    o.fillStyle = '#fff';
    o.textBaseline = 'middle';

    const range = document.createRange();
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    let node, count = 0;

    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent) continue;
      const cs = getComputedStyle(parent);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      o.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const text = node.nodeValue;
      for (let i = 0; i < text.length; i++) {
        const chr = text[i];
        if (!chr.trim()) continue;
        if (++count > 3200) return null;              /* 超大段落退回普通淡入 */
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        const r = range.getBoundingClientRect();
        if (!r.width && !r.height) continue;
        o.fillText(chr,
          (r.left - rect.left) * scale,
          (r.top + r.height / 2 - rect.top) * scale);
      }
    }

    const data = o.getImageData(0, 0, cw, ch).data;
    let gap = Math.max(3, Math.round(4 * scale));
    let pts = [];
    const MAXP = 5200;
    for (let guard = 0; guard < 12; guard++) {
      pts = [];
      for (let y = 0; y < ch; y += gap) {
        const row = y * cw;
        for (let x = 0; x < cw; x += gap) {
          if (data[(row + x) * 4 + 3] > 110) pts.push(x, y);
        }
      }
      if (pts.length / 2 <= MAXP) break;
      gap = Math.round(gap * 1.25) + 1;
    }
    return { pts, gap };
  }

  function finish (el) {
    el.style.opacity = '1';
    el.classList.remove('reveal');
    el.__rstate = 'shown';
    active--;
    pump();
  }

  function animate (el) {
    const rect = el.getBoundingClientRect();
    /* 已滚出视口：直接显示，不再演示 */
    if (rect.width < 4 || rect.height < 4 ||
        rect.bottom < 0 || rect.top > window.innerHeight - 40) {
      finish(el); return;
    }

    const scale = Math.max(0.42,
      Math.min(DPR, 2, 1240 / rect.width, 1500 / rect.height));
    const g0 = collectGlyphs(el, rect, scale);
    if (!g0 || (g0.pts.length >> 1) < 24) { finish(el); return; }

    const M  = g0.pts.length >> 1;
    const cw = Math.round(rect.width * scale);
    const ch = Math.round(rect.height * scale);
    const cv2 = document.createElement('canvas');
    cv2.className = 'reveal-fx';
    cv2.width = cw; cv2.height = ch;
    cv2.style.width  = rect.width  + 'px';
    cv2.style.height = rect.height + 'px';
    const dr = docEl.getBoundingClientRect();
    cv2.style.left = (rect.left - dr.left) + 'px';
    cv2.style.top  = (rect.top  - dr.top ) + 'px';
    docEl.appendChild(cv2);
    const g = cv2.getContext('2d');

    const sx = new Float32Array(M), sy = new Float32Array(M);
    const tx = new Float32Array(M), ty = new Float32Array(M);
    const ph = new Float32Array(M), dl = new Float32Array(M);
    const ci = new Uint8Array(M);

    let minX = 1e9, maxX = -1e9;
    for (let i = 0; i < M; i++) {
      const px0 = g0.pts[i * 2], py0 = g0.pts[i * 2 + 1];
      tx[i] = px0; ty[i] = py0;
      if (px0 < minX) minX = px0;
      if (px0 > maxX) maxX = px0;
    }
    const span = (maxX - minX) || 1;
    const spread = Math.max(cw, ch) * 0.72;

    for (let i = 0; i < M; i++) {
      const ang = Math.random() * Math.PI * 2;
      const rad = spread * (0.06 + Math.random() * 0.72);
      sx[i] = Math.max(-cw * 0.10, Math.min(cw * 1.10, tx[i] + Math.cos(ang) * rad));
      sy[i] = Math.max(-ch * 0.10, Math.min(ch * 1.10, ty[i] + Math.sin(ang) * rad));
      ph[i] = Math.random() * Math.PI * 2;
      dl[i] = Math.random() * 0.34;
      ci[i] = Math.min(CN - 1, Math.floor(((tx[i] - minX) / span) * CN));
    }

    const DUR = 700, HOLD = 140, OUT = 300;
    const t0 = performance.now();
    const dot = Math.max(1, g0.gap * 0.86);
    let textOn = false;

    function frame (now) {
      const e = now - t0;
      const fade = e <= DUR + HOLD ? 1
                 : Math.max(0, 1 - (e - DUR - HOLD) / OUT);

      g.clearRect(0, 0, cw, ch);
      g.globalCompositeOperation = 'lighter';

      if (fade > 0) {
        for (let i = 0; i < M; i++) {
          let p = (e / DUR - dl[i]) / (1 - dl[i]);
          if (p < 0) p = 0; else if (p > 1) p = 1;
          const ease = 1 - Math.pow(1 - p, 3);
          const wob  = (1 - ease) * 9 * scale;
          const x = sx[i] + (tx[i] - sx[i]) * ease
                  + Math.sin(ph[i] + e * 0.004) * wob;
          const y = sy[i] + (ty[i] - sy[i]) * ease
                  + Math.cos(ph[i] * 1.7 + e * 0.005) * wob;
          g.globalAlpha = (0.30 + 0.62 * ease) * fade;
          g.fillStyle = PALETTE[ci[i]];
          g.fillRect(x - dot * 0.5, y - dot * 0.5, dot, dot);
        }
      }

      if (!textOn && e > DUR * 0.5) {
        textOn = true;
        el.style.transition = 'opacity .55s ease-out';
        el.style.opacity = '1';
        el.classList.remove('reveal');
      }

      if (fade > 0) {
        requestAnimationFrame(frame);
      } else {
        cv2.remove();
        finish(el);
      }
    }
    requestAnimationFrame(frame);
  }

  function pump () {
    while (active < MAX_ACTIVE && queue.length) {
      const el = queue.shift();
      if (el.__rstate !== 'queued') continue;
      el.__rstate = 'animating';
      active++;
      requestAnimationFrame(() => animate(el));
    }
  }

  const blocks = [].slice.call(
    document.querySelectorAll('.clause, .article, .section-head, .ending-block'));

  blocks.forEach(el => {
    el.__rstate = 'idle';
    el.classList.add('reveal');
  });

  /* 滚动（向上或向下皆可）时扫描：进入视口即汇聚成字；
     完全离开视口后重新待命，使再次滑入时仍有粒子汇聚效果 */
  let ticking = false;
  function scan () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const vh = window.innerHeight;
      for (let i = 0; i < blocks.length; i++) {
        const el = blocks[i];
        const st = el.__rstate;
        const r = el.getBoundingClientRect();
        if (st === 'shown') {
          if (r.bottom < -vh * 0.28 || r.top > vh * 1.28) {
            el.__rstate = 'idle';
            el.classList.add('reveal');
            el.style.opacity = '';
            el.style.transition = '';
          }
        } else if (st === 'idle') {
          if (r.top < vh * 1.02 && r.bottom > vh * 0.02) {
            el.__rstate = 'queued';
            queue.push(el);
          }
        }
      }
      pump();
    });
  }

  window.addEventListener('scroll', scan, { passive: true });
  window.addEventListener('resize', scan, { passive: true });
  scan();
})();

/* ══════════════════════════════════════════════════════════════
   背景浓淡：首屏最浓 → 正文更淡 → 结尾恢复首屏浓度
   并在正文两侧显示题记“天降生民 / natural rights…”
   ══════════════════════════════════════════════════════════════ */
(function atmosphere () {
  const bgArt    = document.querySelector('.bg-art');
  const notes    = [].slice.call(document.querySelectorAll('.side-note'));
  const ending   = document.querySelector('.ending');
  const articles = document.getElementById('articles');
  if (!bgArt) return;

  const HERO_OP = 0.55, BODY_OP = 0.32;

  let raf = false;
  function update () {
    raf = false;
    const vh = window.innerHeight;
    const y  = window.scrollY;
    const artTop = articles ? (articles.getBoundingClientRect().top + y) : Infinity;
    const endTop = ending  ? (ending.getBoundingClientRect().top + y)  : Infinity;

    const inEnding = y + vh * 0.55 > endTop;
    const inBody   = !inEnding && y > vh * 0.45;

    bgArt.style.opacity = String(inEnding ? HERO_OP : (inBody ? BODY_OP : HERO_OP));

    const showNotes = !inEnding && (y + vh * 0.85 > artTop) && (y + vh * 0.35 < endTop);
    for (let i = 0; i < notes.length; i++) notes[i].classList.toggle('show', showNotes);
  }

  function onScroll () {
    if (raf) return;
    raf = true;
    requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();

/* ══════════════════════════════════════════════════════════════
   读者参与层 · 我的权利清单
   三十条读到最后，如果读者一条都没有留下，那这就只是一篇文章。
   读者可以逐条记下「与我有关」的那些，清单随阅读累积，可复制、可打印。
   —— 清单只存在读者自己的浏览器里，不上传、不统计。
   ══════════════════════════════════════════════════════════════ */
(function rights () {
  const KEY = 'udhr.myRights.v1';
  const aWrap = document.getElementById('articles');
  if (!aWrap) return;

  /* localStorage 在 file:// 或隐私模式下可能直接抛错，因此做一层内存兜底 */
  const mem = {};
  const store = {
    get (k) {
      try { return window.localStorage.getItem(k); }
      catch (e) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; }
    },
    set (k, v) {
      try { window.localStorage.setItem(k, v); } catch (e) { mem[k] = v; }
    }
  };

  const marked = new Set();
  const toCn = n => CN_NUM[n] || String(n);

  document.addEventListener('udhr:chunk', function () {
    marked.forEach(function (n) { applyMark(n, true); });
    refresh();
    if (dlg && dlg.open) renderSheet();
  });

  function load () {
    try {
      const raw = store.get(KEY);
      if (!raw) return;
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) arr.forEach(n => { marked.add(Number(n)); });
    } catch (e) { /* 数据损坏时静默重来，不打扰读者 */ }
  }
  function save () {
    try { store.set(KEY, JSON.stringify(Array.from(marked).sort((a, b) => a - b))); }
    catch (e) {}
  }

  /* ── DOM：浮条 / 清单 / 提示 ── */
  const bar    = document.getElementById('rightsBar');
  const countE = document.getElementById('rightsCount');
  const dlg    = document.getElementById('rightsSheet');
  const bodyE  = document.getElementById('sheetBody');
  const hintE  = document.getElementById('sheetHint');
  const toastE = document.getElementById('toast');

  let toastTimer = 0;
  function toast (msg) {
    if (!toastE) return;
    toastE.textContent = msg;
    toastE.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastE.classList.remove('on'), 2000);
  }

  /* ── 标记状态 ── */
  function applyMark (n, on) {
    const art = document.getElementById('art-' + n);
    if (!art) return;
    art.classList.toggle('marked', on);
    const btn = art.querySelector('.mark-btn');
    if (btn) {
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      const lbl = btn.querySelector('.lbl');
      if (lbl) lbl.textContent = on ? '已记下 · 与我有关' : '这一条，与我有关';
    }
  }

  function toggle (n) {
    if (marked.has(n)) marked.delete(n); else marked.add(n);
    const on = marked.has(n);
    applyMark(n, on);
    save(); refresh();
    toast(on ? '已记下 · 第' + toCn(n) + '条' : '已取消 · 第' + toCn(n) + '条');
    if (dlg && dlg.open) renderSheet();
  }

  function refresh () {
    const size = marked.size;
    if (countE) countE.innerHTML = '<b>' + size + '</b>条被你记下';
    if (bar) bar.classList.toggle('on', size > 0);
  }

  function listHtml () {
    const ns = Array.from(marked).sort((a, b) => a - b);
    if (!ns.length) {
      return '<p class="empty">你还没有记下任何一条。<br>' +
             '往上读，遇到让你停顿的那一句，点一下条文下方的「这一条，与我有关」。<br>' +
             '清单只保存在你自己的浏览器里，不上传，也不会有别人看到。</p>';
    }
    return ns.map(n => {
      const raw = document.getElementById('art-' + n);
      const cn = raw ? raw.dataset.cn : '';
      const en = raw ? raw.dataset.en : '';
      return '<div class="pick">' +
          '<span class="no">第' + toCn(n) + '条</span>' +
          '<span class="txt" lang="zh-Hans">' + cn +
            '<span class="en" lang="en">' + en + '</span>' +
          '</span>' +
          '<button type="button" class="drop" data-drop="' + n + '">去掉</button>' +
        '</div>';
    }).join('');
  }

  function renderSheet () {
    if (bodyE) bodyE.innerHTML = listHtml();
    if (hintE) {
      hintE.textContent = marked.size
        ? '共 ' + marked.size + ' 条。这张清单只属于你，可以复制带走，也可以打印出来贴在看得见的地方。'
        : '点选条文下方的「这一条，与我有关」，清单会随阅读累积。';
    }
  }

  function openSheet () {
    renderSheet();
    if (!dlg) return;
    if (typeof dlg.showModal === 'function') {
      if (!dlg.open) dlg.showModal();
    } else {
      dlg.setAttribute('open', '');
    }
  }
  function closeSheet () {
    if (!dlg) return;
    if (typeof dlg.close === 'function') { if (dlg.open) dlg.close(); }
    else dlg.removeAttribute('open');
  }

  /* ── 导出为纯文字 ── */
  function asText () {
    const ns = Array.from(marked).sort((a, b) => a - b);
    const head = [
      '我的权利清单',
      '《世界人权宣言》 · 一九四八年十二月十日通过',
      '共 ' + ns.length + ' 条',
      '',
      '——这不是一份收藏，而是一次清点：在这三十条里，',
      '哪些是我此刻最不愿失去的。',
      ''
    ];
    const items = ns.map(n => {
      const raw = document.getElementById('art-' + n);
      const cn = raw ? raw.dataset.cn : '';
      const tw = raw ? raw.dataset.tw : '';
      const en = raw ? raw.dataset.en : '';
      return ['第' + toCn(n) + '条', cn, tw && tw !== cn ? tw : '', en, '']
        .filter(l => l !== '').join('\n');
    });
    return head.concat(items).join('\n');
  }

  async function copyText () {
    const text = asText();
    let ok = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        ok = true;
      }
    } catch (e) { ok = false; }
    if (!ok) {
      /* 退回可选中文本：让读者自己复制 */
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      ta.remove();
    }
    toast(ok ? '已复制到剪贴板' : '请手动复制（浏览器未允许自动复制）');
  }

  /* ── 事件 ── */
  aWrap.addEventListener('click', e => {
    const btn = e.target.closest ? e.target.closest('.mark-btn') : null;
    if (!btn) return;
    toggle(Number(btn.dataset.mark));
  });

  if (bar) {
    bar.addEventListener('click', e => {
      const open  = e.target.closest ? e.target.closest('#rightsOpen')  : null;
      const reset = e.target.closest ? e.target.closest('#rightsReset') : null;
      if (open) openSheet();
      if (reset) {
        marked.clear(); save();
        /* 逐条复位：不依赖复合选择器，兼容性更稳 */
        aWrap.querySelectorAll('.article').forEach(el => {
          if (el.classList.contains('marked')) applyMark(Number(el.dataset.n), false);
        });
        refresh(); renderSheet();
        toast('清单已清空');
      }
    });
  }

  if (dlg) {
    dlg.addEventListener('click', e => {
      const drop = e.target.closest ? e.target.closest('.drop') : null;
      if (drop) { toggle(Number(drop.dataset.drop)); return; }
      if (e.target.closest && e.target.closest('#sheetClose, #sheetDone')) closeSheet();
    });
    dlg.addEventListener('close', () => { if (bar) bar.focus(); });
  }
  const copyBtn = document.getElementById('sheetCopy');
  if (copyBtn) copyBtn.addEventListener('click', copyText);
  const printBtn = document.getElementById('sheetPrint');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      closeSheet();
      toast('已打开打印视图 · 可存为 PDF');
      setTimeout(() => { try { window.print(); } catch (e) {} }, 240);
    });
  }

  /* ── 恢复上次的清单 ── */
  load();
  marked.forEach(n => applyMark(n, true));
  refresh();

  /* 首次到访：三秒后轻轻告诉读者可以做什么 */
  let firstTime = false;
  try {
    firstTime = !store.get('udhr.seen.v1');
    if (firstTime) store.set('udhr.seen.v1', '1');
  } catch (e) {}
  if (firstTime) setTimeout(() => toast('读到某一条时，可以点它下方的「与我有关」'), 3200);

  window.__myRights = { asText: asText, open: openSheet };
})();

/* ══════════════════════════════════════════════════════════════
   1948.12.10 → 今天：同一句话，已经过去了多少天
   ══════════════════════════════════════════════════════════════ */
(function sinceAdoption () {
  const el = document.getElementById('daysNum');
  if (!el) return;
  const adopted = Date.UTC(1948, 11, 10);
  function tick () {
    const now = new Date();
    const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    el.textContent = Math.floor((today - adopted) / 86400000).toLocaleString('en-US');
  }
  tick();
  setInterval(tick, 60000);
})();

/* ══════════════════════════════════════════════════════════════
   阅读进度：页首那一线，是读到了第几分之几
   ══════════════════════════════════════════════════════════════ */
(function readProgress () {
  const barEl = document.querySelector('.read-progress');
  const fill = document.getElementById('readFill');
  if (!barEl || !fill) return;
  let raf = false;
  function update () {
    raf = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    fill.style.width = (p * 100).toFixed(2) + '%';
    barEl.classList.toggle('on', window.scrollY > 40);
  }
  window.addEventListener('scroll', () => {
    if (raf) return;
    raf = true;
    requestAnimationFrame(update);
  }, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
})();

requestAnimationFrame(loop);

})();
