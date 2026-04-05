<div align="center">
  <img src="app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.webp" alt="App Logo" width="100" />
  <h1>📱 IoT Backend (Android 客户端)</h1>
  <p><b>基于 Android WebView + 纯前端构建的轻量级物联网设备监控与控制平台</b></p>
  
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![Android](https://img.shields.io/badge/Android-3DDC84?logo=android&logoColor=white)](#)
  [![OneNet](https://img.shields.io/badge/OneNet-IoT_Platform-green)](#)
  [![Kotlin](https://img.shields.io/badge/Kotlin-0095D5?logo=kotlin&logoColor=white)](#)
</div>

## 📖 项目简介

这是一款轻量级、高度可定制的物联网监控管理 Android 应用。系统采用 **“原生外壳 (Kotlin) + H5 核心渲染层 (WebView)”** 的混合架构，原生对接了 **[中国移动 OneNet 物联网开放平台 (Studio)](https://open.iot.10086.cn/studio)**。

系统抛弃了传统的硬编码界面，采用 **完全动态的数据模型驱动 (Dynamic Data Model)**。无论你的硬件设备挂载了温湿度、甲醛、烟雾等传感器，还是各类开关阀门，都可以在手机端自由“捏”出对应的监控面板。

> 💡 **提示**：如果你需要纯 PC 桌面端的 Web 版本代码，请访问配套的 [IoT PC Web Dashboard](https://github.com/NaHS2/iot-pc-web) 仓库。

---

## ✨ 核心特性

- 🔌 **设备零代码接入**：无需修改前端代码，在“设置”页添加设备的 OneNet 云端标识符(`cloudKey`)，首页即可自动生成对应的监控卡片或控制开关。
- 📊 **动态图标与主题**：内置几十种 FontAwesome 物联网常用图标与多套 Tailwind 主题色，支持可视化点选，轻松定制专属大盘。
- 📈 **智能图表与历史**：利用 Chart.js 渲染 24 小时内的环境变化折线图。智能处理设备掉线、缺测数据，图表不断层。
- 💾 **原生级数据导出 (FileProvider 桥接)**：支持一键导出 CSV 历史数据，并深度对接 Android 原生 `FileProvider` 与 `Intent.ACTION_SEND`，支持直接将数据**分享至微信**或调用本地 Excel 查看，彻底解决 WebView 无法下载文件的问题。
- 🚨 **边缘计算级警报**：脱离云端延迟，APP 本地基于你配置的上下限阈值进行状态机判断。当硬件离线或返回缓存脏数据时，自动抑制虚假警报轰炸。
- 📱 **深度原生交互适配**：全面移除浏览器原生 `alert/confirm` 阻塞弹窗，采用毛玻璃背景、定制动画的自定义 Modal 弹窗及 Toast 提示，并适配了 Android 状态栏与底部安全区 (Safe-Area)，沉浸式体验。

---

## 📂 目录结构

本项目是一个标准的 Android Studio 工程：

```text
IOT/
├── app/
│   ├── src/main/
│   │   ├── AndroidManifest.xml   # Android 权限与组件配置 (包含 FileProvider)
│   │   ├── java/.../MainActivity.kt # 原生主窗体、WebView 配置及 JS 桥接接口
│   │   ├── res/                  # 原生图标、字符串与文件共享路径配置
│   │   └── assets/www/           # ⭐️ 核心 Web 渲染层 (HTML/JS/CSS)
│   │       ├── index.html        # 主监控大盘
│   │       ├── monitoring.html   # 详细监测大图表
│   │       ├── control.html      # 下行控制界面及操作日志
│   │       ├── history.html      # 历史数据表格及 CSV 导出
│   │       ├── alerts.html       # 异常报警记录
│   │       ├── settings.html     # 数据模型与 OneNet 配置页
│   │       ├── login.html        # 登录页面
│   │       └── js/
│   │           ├── config.js     # 动态模型定义
│   │           └── onenet.js     # OneNet API 通信引擎
├── build.gradle                  # 项目构建脚本
└── README.md                     # 本文档
```

---

## 🚀 编译与打包运行

1. 确保您的电脑已安装 [Android Studio](https://developer.android.com/studio)。
2. 将本项目克隆或下载到本地，并在 Android Studio 中打开 (`File -> Open -> 选择 IOT 文件夹`)。
3. 等待 Gradle 自动同步依赖（首次可能需要几分钟）。
4. 连接您的 Android 手机（需开启 USB 调试），或启动 Android 模拟器。
5. 点击顶部工具栏的绿色三角形 **Run** 按钮 (`Shift + F10`)，即可编译并安装 APK 到手机上。

---

## ⚙️ 首次使用与配置指南 (连接真实硬件)

为了保护您的数据隐私，本 APP 在打包时不包含任何硬编码的云平台参数。**首次登录系统后，必须配置 OneNet 参数方可连接物理设备。**

### 1. 登录系统
- **默认管理员账号**：`NaHS`
- **默认密码**：`12345678`

### 2. 获取 OneNet 平台参数
请登录您的 [OneNet Studio 控制台](https://open.iot.10086.cn/studio)：
1. 记录下您的 **产品 ID (Product ID)**。
2. 找到您要监控的设备，记录下 **设备名称 (Device Name)**。
3. 生成并复制完整的 **鉴权 Token (Authorization)**（需符合 OneNet 签名规范）。

### 3. 在 APP 中绑定并定义数据模型
1. 在 APP 底部导航栏点击 **“我的”** 进入设置页。
2. 点击 **“OneNet 平台配置”**，填入上述参数并保存。
3. 在 **“数据模型与阈值管理”** 中，点击 **“+ 传感器”** 或 **“+ 控制器”**。
4. **关键步骤：** 填写的 **OneNet 云端标识符 (Cloud Key)** 必须与您在 OneNet 物模型中定义的标识符完全一致。
5. 配置上下限阈值、单位、图标后保存，返回首页即可看到真实的硬件数据。

---

## ⚠️ 二次开发注意事项

- **保留原生交互桥梁**：如果您要修改 `MainActivity.kt`，请务必保留 `addJavascriptInterface(WebAppInterface(this), "AndroidApp")` 以及 `WebChromeClient` 的设置。这是保证 Web 页面能调用原生系统分享面板（导出 CSV）的核心代码。
- **清除缓存**：如果您更换了 OneNet 设备，或者页面数据发生严重错乱，请在“我的”页面最下方点击 **“恢复默认/清除缓存”** 重置 `localStorage`。

---

## 👨‍💻 关于作者与声明

- **作者**：硫氢化钠 (NaHS)
- **邮箱**：[liuqingla2005@163.com](mailto:liuqingla2005@163.com)
- **B站主页**：[点击访问](https://space.bilibili.com/549713964?spm_id_from=333.1007.0.0)

**🛡️ 免责声明**：
本软件为开源物联网工具，仅供学习、研究与参考使用，开发者不承担任何因使用本项目（或其修改版本）引起的直接或间接责任。请妥善保管您的 OneNet Token 等鉴权信息，切勿泄露给第三方。
