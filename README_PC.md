<div align="center">
  <h1>🌐 IoT PC Web Dashboard</h1>
  <p><b>一个基于纯静态前端技术构建的企业级物联网数据监测与设备控制控制台</b></p>
  
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](#)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](#)
  [![OneNet](https://img.shields.io/badge/OneNet-IoT_Platform-green)](#)
  
</div>

## 📖 项目简介

这是一个完全基于纯前端静态页面（HTML + 原生 JS + Tailwind CSS）构建的物联网管理后台。系统原生对接了 **OneNet Studio 物联网平台**，无需任何后端服务器（Serverless），即可实现云端设备的实时状态监测、历史数据查询、远程下发控制指令以及动态阈值报警等核心功能。

本项目在 UI/UX 上进行了深度的桌面端 (PC) 适配，提供了类似现代 SaaS 后台的响应式布局，支持动态自定义数据模型（传感器/控制器），非常适合作为物联网课程设计、毕业设计、或中小型 IoT 项目的快速展示面板。

✨ **在线预览 (Live Demo):** [请在此处填入你使用 Vercel 部署后的网址]

---

## 🚀 核心功能特性

*   **⚡️ 纯前端 Serverless 架构**
    *   零后端依赖，直接在浏览器端通过 AJAX 请求调用 OneNet API。
    *   所有配置信息（如 API Token、数据模型、报警阈值）均安全地存储在浏览器的 `localStorage` 中。
*   **📊 实时数据监测与可视化**
    *   对接 OneNet 云端，自动拉取并展示最新传感器数据。
    *   内置动态折线图（基于 Chart.js），支持直观查看数据变化趋势。
*   **🎛️ 远程设备控制**
    *   支持布尔型（开关）和数值型（滑块）控制指令的下发。
    *   详尽的操作日志记录（执行时间、操作内容、状态反馈）。
*   **⚠️ 智能报警与阈值管理**
    *   前端内置状态机过滤逻辑，有效拦截因网络波动或设备离线导致的“伪报警”。
    *   支持针对不同传感器独立设置上下限阈值，触发异常后自动在界面高亮并记录。
*   **🛠️ 动态数据模型 (Dynamic Data Model)**
    *   告别硬编码！用户可以在“设置”页面自由添加、编辑、删除传感器或控制器。
    *   灵活映射 OneNet 云端的标识符 (Identifier) 到前端 UI，支持自定义图标、颜色、单位和数据类型。
*   **📁 历史数据一键导出**
    *   支持查询设备历史状态，并一键将最近 24 小时的采样数据导出为符合 Excel 标准的 CSV 文件。

---

## 📂 项目结构

本项目无需复杂的编译打包过程（如 Webpack/Vite），开箱即用：

```text
IOT_PC_Web/
├── index.html           # 仪表盘首页 (概览)
├── monitoring.html      # 实时环境监测 (详细图表)
├── control.html         # 设备远程控制 (面板与操作日志)
├── history.html         # 历史数据查询 (表格与 CSV 导出)
├── alerts.html          # 异常报警记录
├── settings.html        # 系统设置 (OneNet配置、数据模型管理)
├── login.html           # 登录页面
├── js/
│   ├── config.js        # 核心配置管理 (动态模型、API配置)
│   ├── onenet.js        # OneNet API 通信封装 (查询、控制指令下发)
│   ├── mock.js          # 离线模拟数据 (用于无网络时的界面预览)
│   └── chart-setup.js   # 图表初始化与更新逻辑
└── ...
```

---

## 💻 本地运行指南

由于浏览器存在跨域 (CORS) 限制和对本地 `file://` 协议读取模块的限制，建议通过简单的本地服务器来运行本项目，而不是直接双击打开 HTML 文件。

### 方案 A：使用 Python (推荐)
如果你电脑上安装了 Python，只需在终端中进入项目目录并执行：
```bash
# Python 3.x
python -m http.server 8080
```
然后在浏览器中访问：`http://localhost:8080`

### 方案 B：使用 VS Code 插件
如果你使用 VS Code 开发，推荐安装 `Live Server` 插件。
在 `index.html` 文件上右键，选择 **"Open with Live Server"** 即可自动在浏览器中打开并支持热更新。

### 方案 C：使用 Node.js
```bash
npx serve
```

---

## ☁️ 一键部署到公网 (Vercel)

本项目非常适合部署到 Vercel 等静态网站托管平台，实现全球极速访问。

1. Fork 本仓库到你的 GitHub 账号下。
2. 登录 [Vercel](https://vercel.com/)，选择 **"Add New Project"**。
3. 关联你的 GitHub 账号，并导入刚刚 Fork 的仓库。
4. 由于是纯静态页面，所有设置保持默认（Framework Preset 选择 `Other`），直接点击 **"Deploy"**。
5. 部署完成后，Vercel 会提供一个免费的公网访问链接（支持 HTTPS）。

---

## ⚙️ 系统配置指南 (连接你的 OneNet 设备)

1. 部署或本地运行后，默认会进入系统的**模拟数据模式**（用于展示 UI）。
2. 在左侧导航栏点击进入 **[设置]** 页面。
3. 找到 **[系统与云平台]** 模块，点击 **[OneNet 平台配置]**。
4. 填入你自己在 OneNet Studio 创建的真实设备信息：
   *   `Product ID` (产品 ID)
   *   `Device Name` (设备名称)
   *   `Authorization Token` (API 鉴权 Token，需符合 OneNet 签名规范)
5. 点击保存后，系统将自动尝试连接真实的物理设备并拉取真实数据。
6. (可选) 在设置页面的 **[数据模型管理]** 中，修改云端标识符 (Cloud Key) 以匹配你在 OneNet 定义的真实物模型。

---

## 👨‍💻 作者与许可

*   **Author:** 硫氢化钠 (NaHS)
*   **Email:** liuqingla2005@163.com
*   **Bilibili:** [B站主页](https://space.bilibili.com/549713964?spm_id_from=333.1007.0.0)

**免责声明：** 本软件/系统及其附带文档（下称“本软件”）仅供学习、交流与参考使用。作者对因使用本软件而造成的任何直接或间接损失不承担任何法律责任。

Distributed under the [MIT License](LICENSE).
