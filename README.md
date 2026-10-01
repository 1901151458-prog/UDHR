# 世界人权宣言 · Universal Declaration of Human Rights

简体中文 · 繁體中文 · English 三语并列的《世界人权宣言》全文页面。

- 1948 年 12 月 10 日由联合国大会第 217A(III) 号决议通过。
- 三十条条文、序言、结语，三种语言同字体、同字号、同字距并列呈现。
- 每条正文前有一段「人的处境」引导文字，说明这一条平常关乎的是什么；
  该部分**不属于《宣言》正文**，仅为阅读引导。
- 可逐条标记「这一条，与我有关」，生成属于自己的权利清单，可复制或打印。
  （清单只保存在浏览器本地，不联网、不上传。）

## 在线访问

启用 GitHub Pages 后，地址为：

```
https://<你的用户名>.github.io/<仓库名>/
```

## 文件

| 文件 | 说明 |
| --- | --- |
| `index.html` | 整个网站，单文件，无外部依赖、无 CDN、无统计脚本，可离线打开 |
| `push-to-github.bat` | 首次上传用的脚本（本地提交已就绪，见下） |
| `.nojekyll` | 让 GitHub Pages 原样发布文件，不做 Jekyll 处理 |

## 发布到 GitHub Pages

### 方式一：本站脚本（已装 Git 的人）

把 `push-to-github.bat` 用鼠标拖进 **Git CMD** 或 **Git Bash** 窗口后回车，或在该目录执行：

```
push-to-github.bat <你的GitHub用户名> <仓库名>
```

脚本会修正提交归属、绑定远程、推送，并在成功后打印 GitHub Pages 的开启地址。

若没有现成仓库，先到 <https://github.com/new> 建一个 **Public** 仓库，
**不要**勾选 "Add a README file"。首次推送会弹出浏览器要求登录并授权。

### 方式二：GitHub Desktop（不想碰命令行）

1. 安装 <https://desktop.github.com>，登录 GitHub。
2. File → Add local repository → 选择本文件夹。
3. 点 **Publish repository**，取消勾选 "Keep this code private"，发布。

### 方式三：网页上传（完全不装工具）

1. 在 <https://github.com/new> 建一个 Public 仓库，不勾选任何初始化文件。
2. 进入空仓库页，点 "uploading an existing file"。
3. 把 `index.html` 和 `.nojekyll` 拖进去（文件名必须是 `index.html`），Commit。
4. Settings → Pages → Source 选 `Deploy from a branch`，Branch 选 `main`、目录选 `/ (root)`，Save。

三种方式完成后效果相同：等约一分钟，访问 `https://<用户名>.github.io/<仓库名>/`。

## 关于原文

官方文本以联合国官网公布的三语版本为准：
<https://www.un.org/zh/about-us/universal-declaration-of-human-rights>

本页面未改动官方条文；新增的「人的处境」与「意义单元」段落属于阅读辅助内容，已在页面与代码注释中明确标注。
