# 技术文档 - Terminal Theme for Hexo

## 目录

1. [项目概述](#项目概述)
2. [项目架构](#项目架构)
3. [主题系统](#主题系统)
4. [多语言系统](#多语言系统)
5. [CSS 变量系统](#css-变量系统)
6. [JavaScript 模块](#javascript-模块)
7. [模板系统](#模板系统)
8. [开发指南](#开发指南)
9. [API 参考](#api-参考)
10. [文件清单](#文件清单)

---

## 项目概述

本项目是基于 Hexo 博客平台的终端风格主题，采用复古终端美学与现代交互体验的融合设计。支持多主题切换和多语言切换功能。

### 技术栈

- **静态站点生成器**: Hexo
- **模板引擎**: EJS
- **CSS 预处理器**: Stylus
- **JavaScript**: ES6+ (原生，无框架依赖)
- **构建工具**: Hexo CLI

---

## 项目架构

```
themes/hexoThemeKacper/
├── layout/                     # EJS 模板文件
│   ├── _partial/              # 局部模板组件
│   │   ├── head.ejs           # HTML 头部（引入 CSS/JS）
│   │   ├── header.ejs         # 页头组件
│   │   ├── footer.ejs         # 页脚组件
│   │   ├── sidebar.ejs        # 侧边栏
│   │   ├── mobile-nav.ejs     # 移动端导航
│   │   └── baidu-analytics.ejs # 百度统计
│   ├── layout.ejs             # 主布局模板
│   ├── index.ejs              # 首页模板
│   ├── post.ejs               # 文章页模板
│   ├── page.ejs               # 独立页面模板
│   ├── archive.ejs            # 归档页模板
│   ├── category.ejs           # 分类页模板
│   └── tag.ejs                # 标签页模板
│
├── source/                     # 静态资源（构建后复制到 public）
│   ├── css/
│   │   ├── _variables.styl    # CSS 变量定义
│   │   ├── style.styl         # 主样式入口
│   │   ├── _extend.styl       # 扩展样式
│   │   ├── _util/             # 工具样式
│   │   │   ├── mixin.styl
│   │   │   └── grid.styl
│   │   └── _partial/          # 组件样式
│   │       ├── header.styl
│   │       ├── article.styl
│   │       ├── footer.styl
│   │       ├── sidebar.styl
│   │       ├── sidebar-aside.styl
│   │       ├── highlight.styl
│   │       ├── archive.styl
│   │       ├── comment.styl
│   │       ├── mobile.styl
│   │       └── language-switcher.styl
│   │
│   ├── js/
│   │   ├── theme-manager.js   # 主题管理器
│   │   ├── i18n-manager.js    # 多语言管理器
│   │   ├── script.js          # 原有脚本
│   │   └── i18n/              # 翻译文件
│   │       ├── zh-CN.js       # 简体中文
│   │       ├── ja.js          # 日本語
│   │       └── en.js          # English
│   │
│   └── fancybox/              # 图片灯箱插件
│
├── _config.yml                # 主题配置文件
└── package.json               # 主题依赖
```

---

## 主题系统

### 主题架构

主题系统基于 CSS 变量实现，通过 `data-theme` 属性切换。包含 5 种预设主题：

| 主题 ID | 名称 | 风格描述 |
|---------|------|----------|
| `classic` | 经典终端 | GitHub Dark 风格，蓝色强调色 |
| `amber` | 琥珀单色 | 复古 CRT 显示器，琥珀色文字 |
| `cyberpunk` | 赛博朋克 | 霓虹风格，品红和青色 |
| `matrix` | 矩阵绿 | 黑客帝国风格，绿色文字 |
| `minimal` | 极简灰度 | 黑白灰风格 |

### 主题切换机制

1. **存储**: 使用 `localStorage` 存储主题选择 (`terminal-theme`)
2. **恢复**: 页面加载前通过内联脚本立即恢复主题，防止闪烁
3. **切换**: 修改 `document.documentElement` 的 `data-theme` 属性
4. **过渡**: CSS `transition` 实现平滑切换动画

### 主题管理器 API

```javascript
// 全局实例
window.themeManager

// 方法
themeManager.setTheme(themeId, animate)   // 设置主题
themeManager.getCurrentTheme()            // 获取当前主题
themeManager.cycleTheme()                 // 循环切换主题
themeManager.getThemes()                  // 获取所有主题列表

// 事件
window.addEventListener('themechange', (e) => {
    console.log(e.detail.theme);      // 主题 ID
    console.log(e.detail.themeName);  // 主题名称
});
```

---

## 多语言系统

### 架构设计

采用独立翻译文件 + 运行时加载的模式：

1. **翻译文件**: `js/i18n/{lang}.js`，纯 JavaScript 对象
2. **加载方式**: `fetch()` 动态加载，避免阻塞渲染
3. **存储**: `localStorage` 持久化 (`terminal-language`)
4. **回退**: 找不到翻译时回退到英文

### 支持语言

| 语言代码 | 语言 | 文件名 |
|----------|------|--------|
| `zh-CN` | 简体中文 | `zh-CN.js` |
| `ja` | 日本語 | `ja.js` |
| `en` | English | `en.js` |

### 翻译文件格式

```javascript
const zhCN = {
    nav: {
        home: '首页',
        archives: '归档',
        // ...
    },
    article: {
        readMore: '阅读更多',
        // 支持参数替换
        results: '找到 {count} 个结果'
    }
    // ...
};
```

### 使用方式

**HTML 属性方式**（推荐）：
```html
<!-- 文本内容 -->
<span data-i18n="nav.home">首页</span>

<!-- 属性 -->
<input data-i18n="search.placeholder" data-i18n-attr="placeholder">

<!-- 带参数 -->
<span data-i18n="article.results" data-i18n-params='{"count": 5}'></span>
```

**JavaScript API**：
```javascript
// 全局实例
window.i18n

// 翻译函数
window.t('nav.home');                    // 简单翻译
window.t('article.results', {count: 5}); // 带参数

// 方法
i18n.setLanguage('zh-CN');               // 设置语言
i18n.getCurrentLanguage();               // 获取当前语言
i18n.getLanguages();                     // 获取所有语言

// 事件
window.addEventListener('languagechange', (e) => {
    console.log(e.detail.language);      // 语言代码
    console.log(e.detail.languageName);  // 语言名称
});
```

---

## CSS 变量系统

### 变量命名规范

所有变量使用 `--terminal-` 前缀，按功能分组：

```css
/* 基础颜色 */
--terminal-bg                  /* 主背景色 */
--terminal-bg-secondary        /* 次要背景 */
--terminal-bg-tertiary         /* 第三层背景 */
--terminal-bg-hover            /* 悬停背景 */

/* 文字颜色 */
--terminal-text                /* 主文字 */
--terminal-text-secondary      /* 次要文字 */
--terminal-text-muted          /* 弱化文字 */
--terminal-text-inverse        /* 反色文字 */

/* 强调色 */
--terminal-accent              /* 主强调色 */
--terminal-accent-hover        /* 悬停强调色 */
--terminal-success             /* 成功色 */
--terminal-warning             /* 警告色 */
--terminal-error               /* 错误色 */

/* 边框和阴影 */
--terminal-border              /* 边框颜色 */
--terminal-border-hover        /* 悬停边框 */
--terminal-glow                /* 发光效果 */
--terminal-glow-strong         /* 强发光 */

/* 字体 */
--terminal-font                /* 主字体 */
--terminal-font-size           /* 基础字号 */
--terminal-line-height         /* 行高 */

/* 间距 */
--terminal-space-xs            /* 4px */
--terminal-space-sm            /* 8px */
--terminal-space-md            /* 16px */
--terminal-space-lg            /* 24px */
--terminal-space-xl            /* 32px */

/* 动画 */
--terminal-transition-fast     /* 150ms */
--terminal-transition-normal   /* 300ms */
--terminal-transition-slow     /* 500ms */

/* 布局 */
--terminal-max-width           /* 最大宽度 1400px */
--terminal-radius              /* 圆角 4px */
--terminal-radius-sm           /* 小圆角 2px */
```

### 主题覆盖机制

通过属性选择器覆盖变量：

```css
:root {
    /* 默认主题变量 */
}

[data-theme="amber"] {
    /* 琥珀主题覆盖 */
    --terminal-bg: #1a0f00;
    --terminal-text: #ffb000;
    /* ... */
}
```

---

## JavaScript 模块

### ThemeManager 类

**文件**: `js/theme-manager.js`

**职责**: 管理主题切换、UI 渲染、持久化存储

**核心方法**:

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `constructor()` | - | - | 初始化管理器 |
| `init()` | - | - | 初始化流程 |
| `loadSavedTheme()` | - | - | 从 localStorage 加载 |
| `setTheme(themeId, animate)` | string, boolean | - | 设置主题 |
| `isValidTheme(themeId)` | string | boolean | 验证主题 |
| `getThemeName(themeId)` | string | string | 获取主题名 |
| `getCurrentTheme()` | - | string | 当前主题 |
| `cycleTheme()` | - | - | 循环切换 |
| `initThemeSwitcher()` | - | - | 初始化切换器 UI |
| `createThemeSwitcher()` | - | HTMLElement | 创建 DOM |
| `bindEvents(switcher)` | HTMLElement | - | 绑定事件 |
| `toggleDropdown()` | - | - | 切换下拉菜单 |
| `openDropdown()` | - | - | 打开下拉菜单 |
| `closeDropdown()` | - | - | 关闭下拉菜单 |
| `updateThemeUI(themeId)` | string | - | 更新 UI |
| `watchSystemTheme()` | - | - | 监听系统主题 |
| `getThemes()` | - | Array | 获取主题列表 |

### I18nManager 类

**文件**: `js/i18n-manager.js`

**职责**: 管理多语言切换、翻译加载、UI 渲染

**核心方法**:

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `constructor()` | - | - | 初始化管理器 |
| `init()` | - | Promise | 异步初始化 |
| `loadSavedLanguage()` | - | - | 加载保存的语言 |
| `loadTranslations()` | - | Promise | 加载翻译文件 |
| `evalTranslationScript(text, varName)` | string, string | Object | 解析翻译脚本 |
| `setLanguage(langId)` | string | - | 设置语言 |
| `isValidLanguage(langId)` | string | boolean | 验证语言 |
| `getLanguageName(langId)` | string | string | 获取语言名 |
| `getCurrentLanguage()` | - | string | 当前语言 |
| `t(key, params)` | string, Object | string | 翻译函数 |
| `applyLanguage()` | - | - | 应用到页面 |
| `initLanguageSwitcher()` | - | - | 初始化切换器 |
| `createLanguageSwitcher()` | - | HTMLElement | 创建 DOM |
| `bindEvents(switcher)` | HTMLElement | - | 绑定事件 |
| `toggleDropdown()` | - | - | 切换下拉菜单 |
| `openDropdown()` | - | - | 打开下拉菜单 |
| `closeDropdown()` | - | - | 关闭下拉菜单 |
| `updateLanguageUI(langId)` | string | - | 更新 UI |
| `getLanguages()` | - | Array | 获取语言列表 |

### Typewriter 类

**文件**: `js/theme-manager.js` (内嵌)

**职责**: 实现打字机效果

**用法**:
```html
<!-- HTML -->
<h1 data-typewriter data-typewriter-speed="100" data-typewriter-delay="300">标题文字</h1>

<!-- 自动初始化 -->
Typewriter.initAll();
```

**配置属性**:
- `data-typewriter`: 启用打字效果
- `data-typewriter-speed`: 打字速度（毫秒/字符）
- `data-typewriter-delay`: 延迟开始时间（毫秒）
- `data-typewriter-cursor`: 是否显示光标（默认 true）

### TerminalCursor 类

**文件**: `js/theme-manager.js` (内嵌)

**职责**: 管理终端光标闪烁效果

**用法**:
```html
<!-- 自动为带有 data-cursor 属性的元素添加光标 -->
<span data-cursor>提示符</span>
```

**特性**:
- 自动扫描页面中的 `data-cursor` 元素
- 使用 MutationObserver 监听动态添加的元素
- 支持 `prefers-reduced-motion` 媒体查询
- 闪烁频率：530ms（与 VS Code 一致）

---

## 模板系统

### 布局层次

```
layout.ejs (主布局)
├── head.ejs (HTML 头部)
├── header.ejs (页头)
│   ├── banner (背景横幅)
│   ├── logo (打字效果)
│   ├── subtitle (打字效果)
│   ├── page-buttons (按钮组)
│   └── nav (导航菜单)
├── body (页面主体)
└── footer.ejs (页脚)
    ├── status-line (状态栏)
    ├── info (版权信息)
    ├── command-line (命令行)
    └── stats (访问统计)
```

### 模板变量

**全局变量**:
- `config`: Hexo 站点配置
- `theme`: 主题配置
- `page`: 当前页面数据
- `site`: 站点数据

**辅助函数**:
- `url_for(path)`: 生成 URL
- `partial(name, locals, options)`: 引入局部模板
- `is_home()`, `is_post()`, `is_archive()`: 页面类型判断
- `date(date, format)`: 日期格式化

---

## 开发指南

### 添加新主题

1. **在 `_variables.styl` 中添加主题变量**:
```stylus
[data-theme="newtheme"]
  --terminal-bg: #000000
  --terminal-text: #ffffff
  // ... 其他变量
```

2. **在 `theme-manager.js` 中注册主题**:
```javascript
this.themes = [
  // 现有主题...
  { id: 'newtheme', name: '新主题', icon: '🎨' }
];
```

3. **（可选）添加主题特定字体**:
在 `style.styl` 的 Google Fonts 导入中添加新字体。

### 添加新语言

1. **创建翻译文件** `js/i18n/{lang}.js`:
```javascript
const langCode = {
    nav: { home: 'Home' },
    // ... 其他翻译
};
```

2. **在 `i18n-manager.js` 中注册**:
```javascript
this.languages = [
  // 现有语言...
  { id: 'lang', name: 'Language', flag: '🇺🇸', file: 'lang' }
];
```

3. **在 `head.ejs` 中引入翻译文件**:
```html
<script src="/js/i18n/lang.js"></script>
```

### 添加翻译键

1. **在所有翻译文件中添加键值**:
```javascript
// zh-CN.js
const zhCN = {
    newSection: {
        newKey: '中文翻译'
    }
};

// en.js
const en = {
    newSection: {
        newKey: 'English Translation'
    }
};
```

2. **在模板中使用**:
```html
<span data-i18n="newSection.newKey">默认文本</span>
```

### 自定义样式

**使用 CSS 变量**:
```css
.my-component {
    background: var(--terminal-bg-secondary);
    color: var(--terminal-text);
    border: 1px solid var(--terminal-border);
    padding: var(--terminal-space-md);
    font-family: var(--terminal-font);
}

.my-component:hover {
    border-color: var(--terminal-accent);
    box-shadow: 0 0 15px var(--terminal-glow);
}
```

---

## API 参考

### 全局对象

| 对象 | 类型 | 说明 |
|------|------|------|
| `window.themeManager` | ThemeManager | 主题管理器实例 |
| `window.i18n` | I18nManager | 多语言管理器实例 |
| `window.t` | Function | 翻译快捷函数 |
| `window.terminalCursor` | TerminalCursor | 光标管理器实例 |

### CSS 类名

**布局类**:
- `.outer` - 外层容器
- `.inner` - 内层容器
- `.left`, `.right` - 浮动

**组件类**:
- `.terminal-window` - 终端窗口
- `.terminal-header` - 终端标题栏
- `.terminal-body` - 终端内容区
- `.terminal-line` - 终端行
- `.terminal-prompt` - 终端提示符

**状态类**:
- `.active` - 激活状态
- `.on` - 开启状态

### 自定义事件

| 事件名 | 触发时机 | 事件详情 |
|--------|----------|----------|
| `themechange` | 主题切换时 | `{theme, themeName}` |
| `languagechange` | 语言切换时 | `{language, languageName}` |

---

## 文件清单

### 核心文件

| 文件 | 类型 | 说明 |
|------|------|------|
| `_config.yml` | 配置 | 主题配置 |
| `package.json` | 配置 | 依赖配置 |
| `layout/layout.ejs` | 模板 | 主布局 |
| `layout/_partial/head.ejs` | 模板 | HTML 头部 |
| `layout/_partial/header.ejs` | 模板 | 页头 |
| `layout/_partial/footer.ejs` | 模板 | 页脚 |

### 样式文件

| 文件 | 说明 |
|------|------|
| `source/css/style.styl` | 主样式入口 |
| `source/css/_variables.styl` | CSS 变量定义 |
| `source/css/_partial/header.styl` | 页头样式 |
| `source/css/_partial/article.styl` | 文章样式 |
| `source/css/_partial/footer.styl` | 页脚样式 |
| `source/css/_partial/language-switcher.styl` | 语言切换器样式 |

### 脚本文件

| 文件 | 说明 |
|------|------|
| `source/js/theme-manager.js` | 主题管理器 |
| `source/js/i18n-manager.js` | 多语言管理器 |
| `source/js/i18n/zh-CN.js` | 中文翻译 |
| `source/js/i18n/ja.js` | 日文翻译 |
| `source/js/i18n/en.js` | 英文翻译 |

### 文档文件

| 文件 | 说明 |
|------|------|
| `.trae/documents/PRD.md` | 产品需求文档 |
| `.trae/documents/Technical-Architecture.md` | 技术架构文档 |
| `.trae/documents/Technical-Documentation.md` | 技术文档（本文档） |

---

## 构建与部署

### 本地开发

```bash
# 启动开发服务器
hexo server

# 生成静态文件
hexo generate

# 清理并重新生成
hexo clean && hexo generate
```

### 部署

```bash
# 生成并部署
hexo deploy

# 完整流程
hexo clean && hexo generate && hexo deploy
```

---

## 浏览器兼容性

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

**降级方案**:
- CSS 变量在不支持的浏览器中使用默认值
- JavaScript 使用 ES6 类，需要现代浏览器支持
- 提供基础样式作为后备

---

## 性能优化

1. **CSS**: 使用 CSS 变量避免重复定义
2. **JavaScript**: 
   - 异步加载翻译文件
   - 使用 `defer` 属性延迟脚本执行
   - 事件委托减少监听器数量
3. **字体**: 使用 `preconnect` 预连接 Google Fonts
4. **动画**: 使用 `transform` 和 `opacity` 优化性能
5. **无障碍**: 支持 `prefers-reduced-motion`

---

*文档版本: 2026-05-18*
*作者: Terminal Theme Team*
