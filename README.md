# 世界人权宣言 · Universal Declaration of Human Rights

简体中文 · 繁體中文 · English 三语并列的《世界人权宣言》全文页面。

- 1948 年 12 月 10 日由联合国大会第 217A(III) 号决议通过。
- 三十条条文、序言、结语，三种语言同字体、同字号、同字距并列呈现。
- 每条正文前有一段「人的处境」引导文字，说明这一条平常关乎的是什么；
  该部分**不属于《宣言》正文**，仅为阅读引导。
- 每条之下可展开「查看思想来源」：列出一条条文的**基督教与儒家典籍**出处，并附一段
  「历史渊源」。凡该传统中没有直接对应者，明确标注「思想呼应」；凡与现代观念方向相反者
  （如《论语·里仁》「父母在，不远游」），标注为对照与张力，不硬凑为正面渊源。
- 可逐条标记「这一条，与我有关」，生成属于自己的权利清单，可复制或打印。
  （清单只保存在浏览器本地，不联网、不上传。）

## 在线访问

已发布地址：

```
https://1901151458-prog.github.io/UDHR/
```

## 引文体例

- 基督教部分引《圣经》**和合本**原文，用字依和合本（如「希利尼人」「拿石头打他」），
  简体/繁体字形差异未逐字校改。
- 儒家部分引先秦典籍原文（文言，简体），并附繁体对照与英译。
- 与和合本原文的核对方式见 `tests/cuv-verify.js` 与 `tests/cuv-verses.txt`（实测经文缓存）。
- 中西典籍与《宣言》条文之间是**渊源与呼应**关系，不是引用关系。《宣言》是不含宗教语汇的
  世俗文本，其条文不建立在任何宗教或学派之上。

## 起草史要点

第一条历经五版，其中 **conscience（良心）** 一词由当时的中国代表、人权委员会副主席
**张彭春**提出；他以自身传统中的「仁」为理据，主张单以 reason（理性）不足以构成人的根本
特质。此说见于哥伦比亚大学《宣言》起草史项目与 Johannes Morsink 的档案研究
（*The Universal Declaration of Human Rights: Origins, Drafting, and Intent*, 1999）。
需注意：文本最终采用的是 conscience，而非「仁」；第一条是多方折中的产物，并非某一文明的
独占贡献。另据联合国官网，`All men` 改为 `All human beings` 由印度代表 Hansa Mehta 促成。

## 文件

| 文件 | 说明 |
| --- | --- |
| `index.html` | 整个网站，单文件，无外部依赖、无 CDN、无统计脚本，可离线打开 |
| `push-to-github.bat` | 推送脚本（本地提交已就绪） |
| `.nojekyll` | 让 GitHub Pages 原样发布文件，不做 Jekyll 处理 |

## 发布 / 更新

已有仓库时，在 **Git CMD** 或 **Git Bash** 中执行：

```
push-to-github.bat 1901151458-prog UDHR
```

或手动三步：

```
git add -A
git commit -m "更新说明"
git push
```

没有仓库时，先在 <https://github.com/new> 建一个 **Public** 仓库（不要勾选
"Add a README file"），再执行上面的命令；首次推送会弹出浏览器要求登录授权，
之后不再需要。也可用 GitHub Desktop 的 File → Add local repository 后点
**Publish repository**，或直接在网页上拖拽上传 `index.html` 与 `.nojekyll`。

## 关于原文

官方文本以联合国官网公布的三语版本为准：
<https://www.un.org/zh/about-us/universal-declaration-of-human-rights>

本页面未改动官方条文；「人的处境」「意义单元」「思想来源」三段均为阅读辅助内容，
已在页面与代码注释中明确标注。
