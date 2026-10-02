# 企业责任与供应链申诉 · 渠道核实报告（第二轮）

核实时间：2026-10-02。方法：Node 直连实测（状态码+标题）为主；OECD 等 Cloudflare 拦截站用官方搜索快照确认路径并如实标注；无法确证的一律标「待核/无法核实」。

---

## 一、德国《供应链尽职义务法》（LkSG）

| 项 | 结果 |
| --- | --- |
| BAFA 投诉程序页（英） | https://www.bafa.de/EN/Supply_Chain_Act/Complaints_Procedure/complaints_procedure_node.html —— **实测 200** |
| BAFA 投诉程序页（德） | https://www.bafa.de/DE/Lieferketten/Beschwerdeverfahren/beschwerdeverfahren_node.html —— **实测 200** |
| **BAFA 投诉提交页（英）** | https://www.bafa.de/EN/Supply_Chain_Act/Submit_Complaint/submit_complaint_node.html —— **实测 200**（注意：这才是对外提交入口；上面的"Complaints Procedure"页是讲企业内部程序的，页面自己写明"不含 §14 官方行动申请的信息"） |
| **在线投诉表格** | https://elan1.bafa.bund.de/beschwerdeverfahren-lksg/ —— 页面内链接，标注"Report a complaint" |
| 邮箱（非匿名） | lieferkettengesetz@bafa.bund.de |
| LkSG 概述页（英） | https://www.bafa.de/EN/Supply_Chain_Act/supply_chain_act_node.html —— **实测 200** |
| 法律文本 | https://www.gesetze-im-internet.de/lksg/ —— **实测 200**；§1 适用门槛：德国境内员工 **≥3,000 人**（2023 年起），**2024-01-01 起降为 ≥1,000 人**（§1 原文已逐字核对）；§8 企业内部投诉程序；§9 间接供应商 |

**关键事实（均出自上述 BAFA 官方页，逐字摘录）**：
- **可以匿名**：原文 "your complaint will be treated confidentially. Should you nevertheless fear disadvantages for yourself, you can also submit your complaint anonymously."（注意：**邮件渠道不匿名**，只有在线表格可匿名）。
- **任何人可提交**：包括外国供应商的工人；前提是——"In the case of foreign companies, this company must be a supplier to a German company"（外国公司必须是某德国公司的供应商），即违规发生在受该法约束的德国企业的供应链内。
- **两类**：本人受影响（或代受影响者）提交 = 依 §14(1) No.2 的官方行动申请，会得到反馈；仅提供一般线索 = BAFA 可依 §14(1) No.1 依职权调查，但**不会回复结果**。

---

## 二、OECD《跨国企业准则》与国家联络点（NCP）

| 项 | 结果 |
| --- | --- |
| NCP 名录（现行数据库） | https://www.oecd.org/en/networks/national-contact-points-for-responsible-business-conduct/database.html —— **官方快照确认**（oecd.org 对本环境 403 Cloudflare，直连受限） |
| 旧名录页 | https://mneguidelines.oecd.org/ncps/ —— 403 受限（路径为官方旧页面，直连受限） |
| 特定实例（specific instances）页 | https://mneguidelines.oecd.org/specificinstances.htm —— **直连受限、路径经官方快照确认** |
| **中国是否准入国** | **待核**。本环境无法访问 OECD 准入国名单页（403），也未找到可确证的官方快照。**建议页面不写「中国已是准入国」**，或写「以 OECD NCP 数据库为准」。 |
| 中国 NCP 设于何处 | **待核**。有旁证：OECD 2015 年举办过 China NCP 研讨会（web-archive.oecd.org 2015 议程 PDF）；商务部相关域名 oecdguidelines.mofcom.gov.cn 在本环境不可达。**不宜写死「设在商务部」**，可写「中国 NCP 信息请以 OECD NCP 数据库为准」。 |
| 提交特定实例的门槛 | **谁可以提交**：OECD 官方文件原句 "Any interested party can submit a complaint to an NCP"（OECD 哈萨克斯坦 RBC 研讨会背景说明 PDF，mneguidelines.oecd.org 快照）。**不要求先穷尽内部渠道**（各国 NCP 程序规则均未设此前提；NCP 会询问是否有平行程序）。 |
| NCP 的作用 | **调解/斡旋（good offices），不是裁决**：NCP 程序旨在通过调停解决"指称企业未遵守《准则》"的问题（OECD BIAC 手册），结果无法律约束力。 |

---

## 三、欧盟举报人保护指令 2019/1937

| 项 | 结果 |
| --- | --- |
| 欧委会官方页（现行） | https://commission.europa.eu/topics/human-rights/your-fundamental-rights-eu/protection-whistleblowers_en —— **实测 200**（旧链接 …/your-rights-eu/protection-whistleblowers_en 会 301 跳到此页） |
| 指令全文 | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32019L1937 —— 202（异步文档页，正常） |

**关键事实（按指令原文）**：
- 保护对象（Art. 4）：私营/公共部门中"在工作相关背景下获得信息"的举报人——雇员、前雇员、应聘者、自雇者、股东、管理层成员、志愿者、实习生，以及协助者、同事、亲属（Art. 4(4)）。**50 人以上**私营法人必须设立内部渠道（Art. 8(3)）；成员国须指定外部主管机关（Art. 11）。
- **供应链工人的场景**：指令的保护以「举报人与受义务约束的欧盟实体存在工作相关联系」为前提；**中国供应商的工人通常与该欧盟买家没有雇佣关系，不属于该指令的直接保护范围**（此为本报告按 Art. 4 作出的解读，指令原文未明说外国供应商工人）。但：德国《供应链法》§8 另要求德国企业设立**对内部和外部人士（含供应链）开放**的投诉程序（BAFA 页原文："internal and external persons can report…in its own business area and supply chain"）——**所以正确路径是：用买家企业的投诉/举报渠道**（受 LkSG 及企业自身政策保护），而不是指望欧盟举报人指令的保护。

---

## 四、下游车企举报渠道（官方页面，均实测 200）

| 企业 | 官方渠道 | 状态 |
| --- | --- | --- |
| 大众集团 | https://www.volkswagen-group.com/en/our-whistleblower-system-16041.html | **200**（页面：Our Whistleblower System） |
| 宝马集团 | 举报门户：https://bmwgroup.speakup.report/main （自 https://www.bmwgroup.com/en/company/compliance.html 官方页内链接提取） | **200（compliance 页）**；门户为官方链接 |
| 梅赛德斯-奔驰集团 | https://group.mercedes-benz.com/bpo/en/ （Whistleblower System BPO，英） | **200**（德文页 https://group.mercedes-benz.com/nachhaltigkeit/gesellschaft-governance/compliance-integritaet/bpo.html 亦 200） |

**一般受理范围**（依据：三家官方页 + LkSG §8）：这类渠道通常受理企业员工、业务伙伴及第三方的举报，**多数支持匿名**（宝马 SpeakUp 系统、奔驰 BPO、大众举报系统均提供匿名选项——具体以各页实时说明为准）；供应链工人可用的**法律依据**是 LkSG §8（德国企业必须让外部人士能就自身业务与供应链的人权/环境风险提出举报）。

---

## 五、中国国内一线渠道

| 项 | 结果 |
| --- | --- |
| 人社部官网 | http://www.mohrss.gov.cn/ —— **实测 200** |
| 12333 热线 | 全国统一的人力资源社会保障服务电话：官方页面 http://www.mohrss.gov.cn/SYrlzyhshbzb/zhuanti/jinbaogongcheng/jbgcdianhuazixunfuwu/ —— **实测 200**（"12333 电话服务"）；依据文件《人力资源和社会保障电话咨询服务规范》（人社厅发）。 |
| 劳动保障监察线上入口 | **无单一的全国统一网页投诉入口**；各地劳动保障监察机构受理（12333 热线转接/当地人社局窗口）；欠薪有「全国根治欠薪线索反映平台」（通过国务院客户端小程序/人社部 App 进入，无独立稳定 URL）。**如实标注：以 12333 热线与当地人社部门为入口。** |

---

## 六、通用事实

- **欧盟举报人指定机关名录**：**没有一份欧委会官方的统一汇总名单页**（欧委会举报人保护页未提供合并名录；指令只要求各成员国各自指定并公布）。存在**非官方/合作网络 NEIWA**（Network of European Integrity and Whistleblowing Authorities，欧洲廉政与举报人保护机关网络），其成员含多国指定机关（见比利时联邦监察专员页 https://www.federalombudsman.be/de/node/659 转载的 NEIWA 声明）——**NEIWA 官网 URL 待核**，不建议页面直接链接。

---

## 待核 / 无法核实的条目

1. **中国是否为 OECD 宣言准入国**——无法核实（OECD 名单页 403，无可信快照）。
2. **中国 NCP 是否设于商务部**——无法核实（仅有 2015 年 OECD China NCP 研讨会等旁证）。
3. **NEIWA 官网地址**——待核（仅确认该网络存在及多国声明转载）。
4. **三家车企举报系统的"匿名"具体条款**——各页实时文本为准，未逐页抓取全文。
5. **oecdguidelines.mofcom.gov.cn**——本环境不可达，无法确认是否为商务部现行 NCP 页。

（本报告所有"实测 200"条目均为本环境直接抓取；"官方快照确认"条目来自搜索引擎返回的官方域名快照；其余为法律原文/官方页面逐字摘录。）
