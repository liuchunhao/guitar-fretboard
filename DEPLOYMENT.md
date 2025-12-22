# 部署到 GitHub Pages

本專案可以部署到 GitHub Pages 作為靜態網頁。

## 前置準備

確保已經安裝了 `gh-pages` 套件：
```bash
npm install --save-dev gh-pages
```

## 部署步驟

### 1. 建置並部署

執行以下指令會自動建置專案並部署到 GitHub Pages：

```bash
npm run deploy
```

這個指令會：
- 執行 `npm run build` 建置專案
- 將 `dist` 資料夾的內容推送到 `gh-pages` 分支
- GitHub 會自動從 `gh-pages` 分支部署網站

### 2. 設定 GitHub Pages（首次部署需要）

1. 前往 GitHub repository: https://github.com/liuchunhao/guitar-fretboard
2. 點擊 **Settings** > **Pages**
3. 在 **Source** 下拉選單選擇 `gh-pages` 分支
4. 點擊 **Save**

### 3. 查看網站

等待幾分鐘後，網站會在以下網址上線：

**https://liuchunhao.github.io/guitar-fretboard**

## 後續更新

每次修改程式碼後，只需要執行以下指令即可更新網站：

```bash
npm run deploy
```

## 本地預覽

如果想在本地預覽建置後的網站：

```bash
npm run build
npm run preview
```

## 開發模式

開發時使用以下指令啟動開發伺服器：

```bash
npm run dev
```
