# Guitar Fretboard Visualizer

一個用於記憶吉他音階指型的網站。

## Features

*   **Interactive Fretboard:** 24 格吉他指板的視覺化呈現，顯示弦編號（Y 軸）
*   **Note Display on Hover:** 滑鼠懸停在任何格子上，顯示音符名稱、弦號和格數
*   **Scale Highlighting:** 從選單選擇音階，在指板上標示所有音符（C Major、G Major、A Minor、F Lydian、G Mixolydian）
*   **3NPS Patterns:** 支援 7 個調式的 3 notes per string 指型（Ionian、Dorian、Phrygian、Lydian、Mixolydian、Aeolian、Locrian）
*   **CAGED System:** 支援 5 個 CAGED 和弦指型（C、A、G、E、D Shape）
*   **Pattern Display:** 選擇特定指型時，音符圓圈預設顯示，滑鼠懸停時才顯示音符名稱
*   **Multiple Tunings:** 支援多種調弦方式（Standard、Drop D、DADGAD、Open G）
*   **Phonetic Display:** 可切換顯示唱名（Do、Re、Mi、Fa、Sol、La、Ti）

## Demo

**線上展示：** https://liuchunhao.github.io/guitar-fretboard

## How to Run

1.  **安裝相依套件：**
    ```bash
    npm install
    ```
2.  **啟動開發伺服器：**
    ```bash
    npm run dev
    ```
3.  **本地預覽建置結果：**
    ```bash
    npm run build
    npm run preview
    ```

## 部署到 GitHub Pages

### 首次部署

1.  **建置並部署：**
    ```bash
    npm run deploy
    ```

2.  **設定 GitHub Pages：**
    - 前往 GitHub repository 的 **Settings** > **Pages**
    - 在 **Source** 選擇 `gh-pages` 分支
    - 點擊 **Save**

3.  **查看網站：**
    - 等待幾分鐘後，網站會在 https://liuchunhao.github.io/guitar-fretboard 上線

### 後續更新

每次修改程式碼後，執行以下指令更新網站：
```bash
npm run deploy
```

## 技術棧

- React 18
- Vite
- CSS (vanilla)
- gh-pages (部署)
