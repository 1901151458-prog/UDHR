# 《世界人权宣言》三语网页 · 求助与监督渠道核实报告

核实方法：**每一个 URL 都用脚本实际发起 HTTPS 请求并读取响应**（经本地代理 CONNECT 隧道 + 原生 TLS，方法见 `tests/fetch-via-proxy.js`），记录 HTTP 状态码、最终跳转地址与页面 `<title>`。
对返回 403 的站点，另用 `tests/extract-links.js` 抓取其**自身导航页**中的真实链接，据此判断该路径是否真实存在，以区分「反爬拦截」与「路径不存在」。

核实时间：2026-10-02。核实总请求 243 次（去重后 151 个 URL），**已核实可访问 77 个**。

---

## 一、联合国人权条约机构（G1）

| # | 中文名 | 英文名 | 监督公约 | 官方页面 URL | 个人来文入口 | 核实状态 |
|---|---|---|---|---|---|---|
| — | 人权高专办条约机构总览 | OHCHR Treaty Bodies | 十个条约机构总入口 | https://www.ohchr.org/en/treaty-bodies | — | **200 已核实**（标题 Treaty Bodies \| OHCHR） |
| — | 条约机构总览（中文） | — | — | https://www.ohchr.org/zh/treaty-bodies | — | **200 已核实**（标题 条约机构 \| OHCHR） |
| — | 个人来文程序（总说明） | Individual Communications Procedures of Treaty Bodies | 各条约来文机制总说明 | https://www.ohchr.org/en/treaty-bodies/individual-communications-procedures-treaty-bodies | 同左 | **已核实存在**（该 URL 出现在 OHCHR 自身导航中；直连被 Cloudflare 拦截，见下） |
| 1 | 人权事务委员会 | Human Rights Committee | ICCPR 公民及政治权利国际公约 | https://www.ohchr.org/en/treaty-bodies/ccpr | 同左页内 | **已核实存在**（OHCHR 导航实测含此路径；直连 403 Cloudflare） |
| 2 | 经济、社会及文化权利委员会 | Committee on Economic, Social and Cultural Rights | ICESCR | https://www.ohchr.org/en/treaty-bodies/cescr | 同左 | **已核实存在**（同上） |
| 3 | 消除种族歧视委员会 | Committee on the Elimination of Racial Discrimination | CERD | https://www.ohchr.org/en/treaty-bodies/cerd | 同左 | **已核实存在**（同上） |
| 4 | 消除对妇女歧视委员会 | Committee on the Elimination of Discrimination against Women | CEDAW | https://www.ohchr.org/en/treaty-bodies/cedaw | 同左 | **已核实存在**（同上） |
| 5 | 禁止酷刑委员会 | Committee against Torture | CAT | https://www.ohchr.org/en/treaty-bodies/cat | 同左 | **已核实存在**（同上） |
| 6 | 儿童权利委员会 | Committee on the Rights of the Child | CRC | https://www.ohchr.org/en/treaty-bodies/crc | 同左 | **已核实存在**（同上） |
| 7 | 残疾人权利委员会 | Committee on the Rights of Persons with Disabilities | CRPD | https://www.ohchr.org/en/treaty-bodies/crpd | 同左 | **已核实存在**（同上） |
| 8 | 强迫失踪问题委员会 | Committee on Enforced Disappearances | CED | https://www.ohchr.org/en/treaty-bodies/ced | 同左 | **已核实存在**（同上） |
| 9 | 移徙工人委员会 | Committee on Migrant Workers | CMW | https://www.ohchr.org/en/treaty-bodies/cmw | 同左 | **已核实存在**（同上） |
| + | 防范酷刑小组委员会 | Subcommittee on Prevention of Torture | OPCAT | https://www.ohchr.org/en/treaty-bodies/spt | （不作个人来文） | **已核实存在**（OHCHR 导航实测含此路径） |
| — | 条约机构数据库 | TBInternet | 各国报告与来文记录 | https://tbinternet.ohchr.org/ | — | **200 已核实**（跳转至 TreatyBodyExternal/Home.aspx） |
| — | OHCHR 联系页 | OHCHR Contact Us | 无法归类时的联系入口 | https://www.ohchr.org/en/contact-us | — | **200 已核实** |

**OHCHR 投诉总入口说明**：经实测，`https://www.ohchr.org/en/complaints` 与 `/zh/complaints` 均返回 **404（页面不存在）**——OHCHR 并没有一个统一的 `/complaints` 页面。实际入口是两条并列路径：
1. 条约机构个人来文：`/en/treaty-bodies/individual-communications-procedures-treaty-bodies`
2. 特别程序来文：`https://spsubmission.ohchr.org/`（**200 已核实**，标题 "Submission of information to Special Procedures"）

**特别程序总览**：https://www.ohchr.org/en/special-procedures-human-rights-council —— **200 已核实**。

**注**：OHCHR 各条约机构子页与公约文本页在自动访问时，部分被 Cloudflare 挑战页拦截（HTTP 403，页面标题 "Just a moment..."）。这些路径已通过「出现在 OHCHR 自身导航 HTML 中」得到佐证，在真实浏览器中可正常打开。同类情况下可直接 200 抓取的公约文本页有：ICESCR、CAT、CRC、CEDAW、CERD、CRPD、CMW（见下节）。

**各公约官方文本页（均 200 已核实）**：
- ICESCR：https://www.ohchr.org/en/instruments-mechanisms/instruments/international-covenant-economic-social-and-cultural-rights
- CAT：https://www.ohchr.org/en/instruments-mechanisms/instruments/convention-against-torture-and-other-cruel-inhuman-or-degrading
- CRC：https://www.ohchr.org/en/instruments-mechanisms/instruments/convention-rights-child
- CEDAW：https://www.ohchr.org/en/instruments-mechanisms/instruments/convention-elimination-all-forms-discrimination-against-women
- CERD：https://www.ohchr.org/en/instruments-mechanisms/instruments/international-convention-elimination-all-forms-racial
- CRPD：https://www.ohchr.org/en/instruments-mechanisms/instruments/convention-rights-persons-disabilities
- CMW：https://www.ohchr.org/en/instruments-mechanisms/instruments/international-convention-protection-rights-all-migrant-workers

---

## 二、专门机构（G2）

| # | 中文名 / 英文名 | 职责范围 | 官方页面 URL | 求助/投诉入口 | 核实状态 |
|---|---|---|---|---|---|
| 1 | 国际劳工组织 ILO · 结社自由 | 工会权利、强迫劳动、劳工标准 | https://www.ilo.org/topics-and-sectors/freedom-association | 结社自由委员会（CFA）申诉：见同页与下方报告 | **200 已核实**（标题 Freedom of association \| ILO） |
| 1b | ILO 监督体系总览 | 国际劳工标准申诉机制 | https://www.ilo.org/international-labour-standards/applying-and-promoting-international-labour-standards-overview-ilo | 同页说明申诉途径 | **200 已核实** |
| 1c | ILO 结社自由委员会报告 | CFA 实际受理记录 | https://www.ilo.org/resource/conference-paper/gb/gb355/412th-report-committee-freedom-association | — | **200 已核实**（412th Report of the CFA） |
| 1d | ILO 标准数据库 NORMLEX | 各国批准与申诉记录 | https://normlex.ilo.org/dyn/nrmlx_en/f?p=NORMLEXPUB | — | **302 已核实**（跳转至 NORMLEX 首页） |
| 2 | UNESCO · 受教育权 | 受教育权、教育公约监督 | https://www.unesco.org/en/right-education | 无独立个人投诉机制；见「法律行动」子页 | **200 已核实**（标题 Right to education \| UNESCO） |
| 2b | UNESCO · 受教育权（中文） | — | https://www.unesco.org/zh/right-education | — | **200 已核实**（标题 受教育权 \| UNESCO） |
| 2c | UNESCO · 受教育权 监测 | 1960 年公约磋商机制 | https://www.unesco.org/en/right-education/monitoring | — | **已核实**（该链接出现在 UNESCO 自身导航中） |
| 2d | UNESCO · 受教育权 法律行动 | — | https://www.unesco.org/en/right-education/legal-action | — | **已核实**（同上，导航实测） |
| 3 | 世界卫生组织 WHO · 健康与人权 | 健康权 | https://www.who.int/health-topics/human-rights | 无个人投诉机制 | **200 已核实**（标题 Human rights） |
| 3b | WHO · 人权与健康实况报道 | — | https://www.who.int/news-room/fact-sheets/detail/human-rights-and-health | — | **200 已核实** |
| 4 | 联合国难民署 UNHCR · 求助站 | 难民、寻求庇护者、无国籍者求助 | https://help.unhcr.org/ | 同左（按国家分站的求助信息） | **200 已核实**（标题 Information for Refugees, Asylum-seekers and Stateless People） |
| 4b | UNHCR · 终止无国籍状态 | 无国籍问题 | https://www.unhcr.org/what-we-do/protect-human-rights/ending-statelessness | — | **200 已核实**（标题 Ending statelessness） |
| 4c | UNHCR 官网 | — | https://www.unhcr.org/ | — | **200 已核实** |
| 5 | 联合国儿童基金会 UNICEF · 儿童保护 | 儿童保护 | https://www.unicef.org/protection | 举报不当行为：https://www.unicef.org/report-wrongdoing | **200 已核实**（标题 Child protection \| UNICEF） |
| 5b | UNICEF · 举报不当行为 | 针对 UNICEF 自身及合作方的举报 | https://www.unicef.org/report-wrongdoing | 同左 | **200 已核实**（标题 How to report wrongdoing \| UNICEF） |
| 6 | 联合国妇女署 UN Women | 性别平等与妇女人权 | https://www.unwomen.org/en | — | **200 已核实**（标题 Welcome \| UN Women – Headquarters） |
| 6b | UN Women · 终止暴力侵害妇女 | 针对妇女的暴力 | https://www.unwomen.org/en/what-we-do/ending-violence-against-women | — | **200 已核实** |
| 7 | 国际移民组织 IOM | 移民保护与协助 | https://www.iom.int/ | 联系页：https://www.iom.int/contact-us | **200 已核实**（标题 IOM, UN Migration） |
| 7b | IOM · 移民保护与协助 | — | https://www.iom.int/migrant-assistance-and-protection | — | **200 已核实**（跳转至 rovienna.iom.int 分站） |

**重要更正**：`https://www.iom.int/migrant-assistance` 返回 **404**（不存在）。IOM 官网没有统一的「移民求助」总页，实际操作入口是各国 IOM 办事处 + 联系页。

---

## 三、地区人权机制（G3）

| # | 中文名 / 英文名 | 受理范围 | 官方页面 URL | 个人申诉入口 | 核实状态 |
|---|---|---|---|---|---|
| 1 | 欧洲人权法院 ECHR | 《欧洲人权公约》所载权利 | https://www.echr.coe.int/ | https://www.echr.coe.int/apply-to-the-court | **均 200 已核实**（标题 Apply to the Court - ECHR） |
| 1b | 欧洲委员会 Council of Europe | 人权与法治 | https://www.coe.int/en/web/human-rights-rule-of-law | — | **200 已核实**（标题 Directorate General: Human Rights and Rule of Law） |
| 2 | 美洲人权委员会 IACHR | 《美洲人权公约》等 | https://www.oas.org/en/iachr/ | 请愿入口：https://www.oas.org/en/iachr/petitions/ | **无法核实（原因）**：oas.org 全站对自动访问返回 Cloudflare 403「Just a moment...」，包括官网根路径、请愿页与 PDF 手册；三次不同路径与路径变体均被拦截，故不提供未经验证的替代 URL |
| 3 | 非洲人权与民族权委员会 ACHPR | 《非洲人权和民族权宪章》 | https://achpr.au.int/ | 来文程序：https://achpr.au.int/en/communications-procedure | **均 200 已核实** |
| 3b | ACHPR · 投诉提交指南 | — | https://achpr.au.int/en/guidelines-submitting-complaints | 标题 Guidelines for submitting complaints | **200 已核实** |
| 3c | ACHPR · 来文裁决 | — | https://achpr.au.int/en/category/decisions-communications | — | **200 已核实** |
| 3d | 非洲人权与民族权法院 African Court | 审理个人与 NGO 提交的案件 | https://www.african-court.org/afchpr/ | 如何提交案件：https://www.african-court.org/afchpr/how-to-file-a-case/ | **均 200 已核实**（跳转至 .../how-to-file-a-case-3/） |
| 4 | 东盟 ASEAN · 人权宣言 | 政治承诺，非司法机制 | https://asean.org/asean-human-rights-declaration/ | **无个人申诉机制** | **307 已核实**（跳转，非 200 直出） |
| 4b | 东盟政府间人权委员会 AICHR | 促进与保护人权（咨询性质） | https://aichr.org/ | **无个人申诉机制** | **307 已核实**（跳转） |
| 5 | 国际刑事法院 ICC | **受理**：灭绝种族罪、危害人类罪、战争罪、侵略罪（针对**个人**的刑事责任）。**不受理**：一般性人权申诉、国家间领土争端、个人民事纠纷；且受「 complementarity（补充性）」限制，仅在一国司法不愿或不能时介入 | https://www.icc-cpi.int/ | 提交情势/来文说明：https://www.icc-cpi.int/get-involved （另见初步审查页） | **200 已核实**（官网、get-involved、situations-under-investigations、situations-preliminary-examinations 均 200） |

**亚太地区可用政府间人权机制的实情**：**除东盟 AICHR（咨询/促进性质，无个人申诉）外，亚洲没有类似欧洲人权法院那样的、可受理个人申诉的区域人权法院或委员会。**（实测确认：ASEAN 与 AICHR 页面均存在但只有 307 跳转，且机构本身不设个人申诉程序。）亚太区域另有「亚太国家人权机构论坛（APF）」，但那是国家人权机构的网络，不是政府间司法机制。

---

## 四、通用/兜底渠道（G4）

| # | 中文名 / 英文名 | 职责 | 官方页面 URL | 名录/求助入口 | 核实状态 |
|---|---|---|---|---|---|
| 1 | 全球国家人权机构联盟 GANHRI | 各国 NHRI 的全球网络 | https://ganhri.org/ | 成员名录：https://ganhri.org/membership/ | **无法核实（原因）**：ganhri.org 对自动访问返回 **403 Forbidden**（含首页、/membership/、/members-directory/、/about-us/、PDF 年度报告，五次不同路径全部 403），无任何路径可验证。**不建议在页面写这里的 URL** |
| 1b | OHCHR · 国家人权机构页面（替代） | NHRI 与区域机制 | https://www.ohchr.org/en/countries/nhri | 同左 | **200 已核实**（标题 NHRIs and Regional Human Rights Mechanisms \| OHCHR）—— 可作为 GANHRI 的可靠替代入口 |
| 2 | 国际监察专员协会 IOI | 各国监察专员（Ombudsman）网络 | https://www.theioi.org/ | 成员名录：https://www.theioi.org/ioi-members | **均 200 已核实**（标题 IOI / IOI Members） |
| 3 | 红十字国际委员会 ICRC | 探视被拘者、寻人、人道救助 | https://www.icrc.org/en | 联系：https://www.icrc.org/en/contact | **200 已核实** |
| 3b | ICRC · 保护工作 | 被拘者、失踪人员等 | https://www.icrc.org/en/what-we-do/protection | — | **200 已核实** |
| 3c | ICRC · 重建家庭联系（寻人） | 寻找失踪亲属 | https://www.icrc.org/en/what-we-do/restoring-family-links | 跳转至 /reconnecting-families | **200 已核实**（标题 Reconnecting families） |
| 3d | ICRC · 受保护人员 | 战俘、平民等 | https://www.icrc.org/en/law-and-policy/protected-persons | — | **200 已核实** |
| 3e | ICRC 中文 | — | https://www.icrc.org/zh | — | **200 已核实**（标题 红十字国际委员会） |
| 4 | 工商业与人权（OHCHR） | 跨国公司与人权 | https://www.ohchr.org/en/business-and-human-rights | — | **200 已核实** |
| 5 | 联合国全球契约 UN Global Compact | 企业自愿承诺（非申诉机制） | https://www.unglobalcompact.org/ | — | **200 已核实**（301 跳转至无 www） |
| 6 | 联合国人权总页 | 人权事务总览 | https://www.un.org/en/global-issues/human-rights | — | **200 已核实** |
| 6b | 联合国人权总页（中文） | — | https://www.un.org/zh/global-issues/human-rights | — | **200 已核实**（标题 人权 \| 联合国） |
| 6c | 联合国联系页 | 无法归类时的兜底 | https://www.un.org/en/contact-us | — | **200 已核实**（跳转 contact-us-0） |

**关于「各国法律援助/免费法律咨询」国际名录**：
本次实测中，最接近的**官方国际组织页面**是 UNODC 的 **Access to Legal Aid**：https://www.unodc.org/unodc/en/justice-and-prison-reform/legal-aid.html —— **200 已核实**。其次是 **世界正义工程（WJP）**：https://worldjusticeproject.org/ —— **200 已核实**（提供各国法治指数，可作背景参考）。

**局限（必须说明）**：
- UNODC 该页是**政策与项目介绍**，不是「按国家查询免费律师/法律援助机构」的数据库；
- WJP 是**法治指数研究机构**，不做个案转介；
- **经核实，不存在一个由联合国或主要国际组织维护的、权威的「各国免费法律咨询机构名录」。** 实践中，个案求助应走：当地法律援助机构 / 各国律师协会 / 国家人权机构（NHRI，经 OHCHR NHRI 页面查找）/ 区域人权机制（如 ECHR、ACHPR）。本次实测中未找到可验证的全球统一名录，故不提供未经证实的替代链接。

---

## 五、无法核实或已失效的条目（清单）

### A. 实测返回 404（路径不存在，请勿使用）
| URL | 状态 | 说明 |
|---|---|---|
| https://www.ohchr.org/en/complaints | 404 | OHCHR 无 `/complaints` 总入口 |
| https://www.ohchr.org/zh/complaints | 404 | 同上（中文） |
| https://www.ohchr.org/zh/how-complain | 404 | 同上 |
| https://www.ilo.org/freedom-of-association | 404 | 正确路径为 `/topics-and-sectors/freedom-association` |
| https://www.ilo.org/about-ilo/.../committee-freedom-association | 404 | ILO 改版后路径失效 |
| https://www.unesco.org/en/cultural-rights | 404 | UNESCO 无此路径 |
| https://www.unesco.org/en/culture/cultural-rights | 404 | 同上 |
| https://www.unicef.org/child-protection | 404 | 正确路径为 `/protection` |
| https://www.iom.int/migrant-assistance | 404 | IOM 无此统一求助页 |
| https://www.unhcr.org/zh-hans/ | 404 | UNHCR 中文站点路径变更，未找到稳定替代 |
| https://www.icc-cpi.int/situations | 404 | 正确路径为 `/situations-under-investigations` |
| https://www.icc-cpi.int/get-involved/communications | 404 | ICC 无此路径 |
| https://www.icrc.org/en/what-we-do/missing-persons | 404 | 正确路径为 `/what-we-do/restoring-family-links` |
| https://www.icrc.org/en/what-we-do/detention | 404 | ICRC 改版后失效 |
| https://achpr.au.int/en/communications | 404 | 正确路径为 `/en/communications-procedure` |
| https://www.ohchr.org/zh/treaty-bodies/individual-communications-procedures-treaty-bodies | 404 | 中文版无对应路径（英文版有效） |
| https://www.undp.org/rule-law | 404 | UNDP 路径变更 |
| https://www.ohchr.org/en/human-rights-treaty-bodies | 404 | 无此路径 |
| https://www.echr.coe.int/faq、/forms | 200 但实为 404 页 | 返回 200 状态码但内容是 "Page 404"，实为 404 页 |

### B. 被 Cloudflare / 服务器反爬拦截，无法直接核实（403）
这些站点对本次自动访问返回 403，**路径真实性未能直接验证**，除已通过自身导航佐证者外，均未列入上表：

| 站点 | 现象 | 处理 |
|---|---|---|
| www.oas.org（IACHR 全站） | 所有路径 403「Just a moment...」，含官网、请愿页、PDF 手册 | **不提供 URL**，标注无法核实 |
| ganhri.org | 所有路径 403 Forbidden（含 PDF） | **不提供 URL**，改用 OHCHR NHRI 页面替代 |
| www.ohchr.org 部分子页 | 403「Just a moment...」（条约机构子页、部分公约文本页） | 已通过 OHCHR 自身导航 HTML 佐证存在；已在表中标注「已核实存在（导航佐证）」 |
| www.unhcr.org 部分路径 | 403（`/zh-hans/` 等） | 标注 404/403，不采用 |

### C. 间歇性网络失败（非 URL 问题）
UNESCO、ASEAN 的部分请求出现 `Client network socket disconnected before secure TLS connection was established`，重试后 UNESCO 的 `right-education`（英/中）、ASEAN 的 `asean-human-rights-declaration/` 均成功返回 200/307，故这些 URL 有效，失败属本地网络抖动。

### D. 无法核实的结构性结论（非 URL 问题）
- **亚洲无区域性个人申诉人权法院/委员会**（除东盟 AICHR 的咨询性机制外）。这是实测与检索共同的结论，建议在页面上如实写明，不要把 AICHR 描述成可受理个人申诉的机构。
- **不存在权威的全球「免费法律援助机构名录」**。建议页面引导读者走 UNODC 法律援助页面 + 各国 NHRI + 区域机制三条路径，并说明各自局限。
- **OHCHR 没有统一投诉入口**，必须分流到「条约机构个人来文」与「特别程序来文」两条。

---

## 附：核实工具（均在工作区 tests/ 目录）
- `tests/fetch-via-proxy.js` —— 经本地代理 CONNECT 隧道 + 原生 TLS 的抓取器，能绕开 Node fetch 无代理支持的局限，记录状态码/跳转/标题
- `tests/extract-links.js` —— 抓取站点导航页、提取站内真实链接，用于佐证被 Cloudflare 拦截的路径
- `tests/urls-*.json` —— 各轮待核实 URL 清单
- `tests/out-*.json` —— 各轮原始核实结果
- `tests/verified-ok.json` —— 去重后的 77 条已核实可访问 URL
