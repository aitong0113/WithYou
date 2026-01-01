# WithYou - 家長陪伴支持平台

<div align="center">

![專案封面](images/withyou.png)

**Bootstrap + jQuery + SCSS 打造的親子陪伴故事平台**

<a href="https://你的github帳號.github.io/WithYou/" target="_blank"><img src="https://img.shields.io/badge/網站展示-F9C94E?style=for-the-badge" alt="Demo"></a> <a href="https://github.com/你的github帳號/WithYou" target="_blank"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github" alt="GitHub"></a>

</div>

---

## 專案簡介

WithYou 是一個以親子陪伴為主題的故事平台，協助家長與孩子透過繪本、故事與陪伴師資源，建立更緊密的親子關係。網站提供繪本陪伴流程、陪伴師介紹、親子故事分享等功能，並支援響應式設計，讓家長隨時隨地獲得支持。

**核心功能**

- 首頁溫馨主視覺與陪伴理念
- 繪本陪伴流程介紹
- 陪伴師介紹與聯絡
- 親子故事分享專區
- 線上預約陪伴服務
- 響應式設計（手機、平板、桌機）

---

## 技術棧

**前端框架**

- Bootstrap 5
- jQuery

**樣式設計**

- SCSS（Sass 預處理器）
- 客製化元件與動畫

**建置工具**

- npm scripts
- GitHub Pages

---

## 專案結構

```
WithYou/
├── Companions.html           # 陪伴師介紹
├── index.html                # 首頁
├── Layout.html               # 主要版型
├── package.json
├── service.html              # 服務預約
├── story.html                # 親子故事列表
├── story_detail.html         # 故事詳情
├── withYou.html              # 關於我們
├── images/                   # 圖片資源
├── js/
│   ├── all.js                # 主 JS
│   └── jquery.min.js
└── stylesheets/
    ├── all.css
    ├── all.scss
    ├── components/
    │   ├── _btn-hover.scss
    │   ├── _font-settings.scss
    │   ├── _gradient.scss
    │   ├── _header.scss
    │   ├── _img-hover.scss
    │   └── _link-hover.scss
    └── helpers/
        ├── _colored-links.scss
        ├── _utilities.scss
        └── _variables.scss
```

---

## 主要功能說明

### 1. 首頁

- 溫馨插畫主視覺
- 陪伴理念標語
- 快速導覽各大功能

### 2. 繪本陪伴流程

- 圖文並茂介紹陪伴流程
- 家長可了解服務內容

### 3. 陪伴師介紹

- 陪伴師專業背景與照片
- 線上聯絡/預約功能

### 4. 親子故事分享

- 家長/孩子故事列表
- 單篇故事詳情頁

### 5. 線上預約

- 填寫表單預約陪伴服務
- 表單驗證與送出提示

### 6. 響應式設計

- 支援手機、平板、桌機
- 主要功能皆可流暢瀏覽

---

## 學到什麼

**技術方面**

- Bootstrap 5 響應式網頁設計
- SCSS 結構化樣式管理
- jQuery 動態互動與 DOM 操作
- 表單驗證與 UX 優化

**架構設計**

- 多頁式網站規劃
- SCSS 元件化與變數管理
- 圖片與資源最佳化

**開發流程**

- npm scripts 管理開發流程
- Git 版本控制
- GitHub Pages 靜態網站部署

**業務邏輯**

- 親子陪伴流程設計
- 陪伴師資源整合
- 親子故事資料結構

---

## 快速開始

### 安裝依賴

```bash
npm install
```

### 開發環境

直接開啟 `index.html` 或使用 Live Server 預覽

### 建置生產版本

```bash
npm run build
```

### 部署到 GitHub Pages

```bash
npm run deploy
```

---

## 注意事項

- 圖片與插畫僅供學習展示，請勿商業使用
- 表單功能可依需求串接後端或第三方服務
- 若需擴充功能，建議以元件化 SCSS 維護

---

## 相關連結

- **網站展示**：https://你的github帳號.github.io/WithYou/
- **GitHub Repo**：https://github.com/你的github帳號/WithYou

---

### 作者

✍️ Abbie Lin  ｜ Frontend & UI/UX Designer

親子陪伴 × 設計 × 前端

💌 GitHub: <a href="https://github.com/你的github帳號" target="_blank">你的github帳號</a>

---

> 封面圖請將你首頁截圖上傳至 images/withyou-cover.png 並同步更新 GitHub 上的圖片路徑。
