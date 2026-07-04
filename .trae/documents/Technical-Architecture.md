# 技术架构文档

## 架构概述

本文档描述 Hexo 主题终端风格重构的技术实现方案，包括主题系统架构、CSS 变量设计、JavaScript 模块划分等。

## 技术栈

- **模板引擎**: EJS (Hexo 默认)
- **CSS 预处理器**: Stylus
- **JavaScript**: 原生 ES6+
- **构建工具**: Hexo CLI

## 文件结构

```
themes/hexoThemeKacper/
├── layout/                     # 模板文件
│   ├── _partial/              # 局部模板
│   │   ├── head.ejs           # 头部模板 (引入主题CSS/JS)
│   │   ├── header.ejs         # 页头组件
│   │   ├── footer.ejs         # 页脚组件
│   │   └── theme-switcher.ejs # 主题切换器组件
│   └── layout.ejs             # 主布局模板
├── source/                     # 静态资源
│   ├── css/
│   │   ├── _variables.styl    # 主题变量定义
│   │   ├── _themes/           # 各主题样式
│   │   │   ├── _classic.styl
│   │   │   ├── _amber.styl
│   │   │   ├── _cyberpunk.styl
│   │   │   ├── _matrix.styl
│   │   │   └── _minimal.styl
│   │   ├── _partial/          # 组件样式
│   │   │   ├── _terminal.styl # 终端组件样式
│   │   │   ├── _typewriter.styl # 打字效果
│   │   │   └── ...
│   │   └── style.styl         # 主样式入口
│   └── js/
│       ├── theme-manager.js   # 主题管理器
│       ├── typewriter.js      # 打字效果
│       └── main.js            # 主入口
└── _config.yml                # 主题配置
```

## CSS 变量系统

### 核心变量定义

```css
:root {
  /* 基础颜色 */
  --terminal-bg: #0d1117;
  --terminal-bg-secondary: #161b22;
  --terminal-bg-tertiary: #21262d;
  --terminal-text: #c9d1d9;
  --terminal-text-secondary: #8b949e;
  --terminal-text-muted: #6e7681;
  
  /* 强调色 */
  --terminal-accent: #58a6ff;
  --terminal-accent-rgb: 88, 166, 255;
  --terminal-success: #238636;
  --terminal-warning: #d29922;
  --terminal-error: #da3633;
  
  /* 边框和阴影 */
  --terminal-border: #30363d;
  --terminal-border-hover: #58a6ff;
  --terminal-glow: rgba(88, 166, 255, 0.3);
  
  /* 字体 */
  --terminal-font: 'JetBrains Mono', 'Fira Code', monospace;
  --terminal-font-size: 16px;
  --terminal-line-height: 1.6;
  
  /* 间距 */
  --terminal-spacing-xs: 4px;
  --terminal-spacing-sm: 8px;
  --terminal-spacing-md: 16px;
  --terminal-spacing-lg: 24px;
  --terminal-spacing-xl: 32px;
  
  /* 动画 */
  --terminal-transition-fast: 150ms ease;
  --terminal-transition-normal: 300ms ease;
  --terminal-transition-slow: 500ms ease;
}
```

### 主题特定变量

每个主题通过 `data-theme` 属性覆盖核心变量：

```css
[data-theme="amber"] {
  --terminal-bg: #1a0f00;
  --terminal-text: #ffb000;
  --terminal-accent: #ffcc00;
  --terminal-accent-rgb: 255, 204, 0;
  --terminal-font: 'VT323', monospace;
}
```

## JavaScript 模块设计

### 1. 主题管理器 (ThemeManager)

```javascript
class ThemeManager {
  constructor() {
    this.currentTheme = 'classic';
    this.themes = ['classic', 'amber', 'cyberpunk', 'matrix', 'minimal'];
    this.storageKey = 'terminal-theme';
    this.init();
  }
  
  init() {
    // 从 localStorage 加载主题
    const savedTheme = localStorage.getItem(this.storageKey);
    if (savedTheme && this.themes.includes(savedTheme)) {
      this.setTheme(savedTheme, false);
    }
    
    // 监听系统主题变化
    this.watchSystemTheme();
  }
  
  setTheme(themeName, animate = true) {
    if (!this.themes.includes(themeName)) return;
    
    const root = document.documentElement;
    
    if (animate) {
      root.style.transition = 'all 300ms ease';
    }
    
    root.setAttribute('data-theme', themeName);
    this.currentTheme = themeName;
    localStorage.setItem(this.storageKey, themeName);
    
    // 触发自定义事件
    window.dispatchEvent(new CustomEvent('themechange', { 
      detail: { theme: themeName } 
    }));
    
    setTimeout(() => {
      root.style.transition = '';
    }, 300);
  }
  
  getNextTheme() {
    const currentIndex = this.themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % this.themes.length;
    return this.themes[nextIndex];
  }
  
  cycleTheme() {
    this.setTheme(this.getNextTheme());
  }
  
  watchSystemTheme() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      // 可选：根据系统主题自动切换
    });
  }
}
```

### 2. 打字效果 (Typewriter)

```javascript
class Typewriter {
  constructor(element, options = {}) {
    this.element = element;
    this.text = element.textContent;
    this.speed = options.speed || 100;
    this.cursor = options.cursor !== false;
    this.delay = options.delay || 0;
    this.onComplete = options.onComplete || null;
    
    this.init();
  }
  
  init() {
    this.element.textContent = '';
    this.element.classList.add('typewriter');
    
    if (this.cursor) {
      this.cursorElement = document.createElement('span');
      this.cursorElement.className = 'typewriter-cursor';
      this.element.appendChild(this.cursorElement);
    }
    
    setTimeout(() => this.type(), this.delay);
  }
  
  type() {
    let index = 0;
    
    const typeChar = () => {
      if (index < this.text.length) {
        if (this.cursorElement) {
          this.cursorElement.before(this.text.charAt(index));
        } else {
          this.element.textContent += this.text.charAt(index);
        }
        index++;
        setTimeout(typeChar, this.speed);
      } else {
        this.onComplete && this.onComplete();
      }
    };
    
    typeChar();
  }
  
  // 静态方法：初始化所有带有 data-typewriter 属性的元素
  static initAll() {
    document.querySelectorAll('[data-typewriter]').forEach(el => {
      const options = {
        speed: parseInt(el.dataset.typewriterSpeed) || 100,
        delay: parseInt(el.dataset.typewriterDelay) || 0,
        cursor: el.dataset.typewriterCursor !== 'false'
      };
      new Typewriter(el, options);
    });
  }
}
```

### 3. 光标效果 (Cursor)

```javascript
class TerminalCursor {
  constructor() {
    this.cursors = new Set();
    this.active = true;
    this.interval = null;
    this.init();
  }
  
  init() {
    // 查找所有需要光标的元素
    document.querySelectorAll('[data-cursor]').forEach(el => {
      this.addCursor(el);
    });
    
    // 开始闪烁动画
    this.startBlinking();
  }
  
  addCursor(element) {
    const cursor = document.createElement('span');
    cursor.className = 'terminal-cursor';
    element.appendChild(cursor);
    this.cursors.add(cursor);
  }
  
  startBlinking() {
    this.interval = setInterval(() => {
      this.cursors.forEach(cursor => {
        cursor.classList.toggle('blink');
      });
    }, 530); // 与 VS Code 光标闪烁频率一致
  }
  
  stopBlinking() {
    clearInterval(this.interval);
  }
  
  // 支持 prefers-reduced-motion
  respectMotionPreference() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      this.stopBlinking();
    }
    
    mediaQuery.addEventListener('change', (e) => {
      if (e.matches) {
        this.stopBlinking();
      } else {
        this.startBlinking();
      }
    });
  }
}
```

## 组件实现

### 1. 主题切换器组件

```html
<!-- _partial/theme-switcher.ejs -->
<div class="theme-switcher" id="theme-switcher">
  <button class="theme-btn" aria-label="切换主题">
    <span class="theme-icon">🎨</span>
    <span class="theme-name">Classic</span>
  </button>
  <div class="theme-dropdown">
    <% const themes = [
      { id: 'classic', name: '经典终端', icon: '💻' },
      { id: 'amber', name: '琥珀单色', icon: '📺' },
      { id: 'cyberpunk', name: '赛博朋克', icon: '🌃' },
      { id: 'matrix', name: '矩阵绿', icon: '🌿' },
      { id: 'minimal', name: '极简灰度', icon: '⬛' }
    ]; %>
    <% themes.forEach(theme => { %>
      <button class="theme-option" data-theme="<%= theme.id %>">
        <span class="theme-option-icon"><%= theme.icon %></span>
        <span class="theme-option-name"><%= theme.name %></span>
      </button>
    <% }); %>
  </div>
</div>
```

### 2. 终端窗口组件

```html
<!-- 文章卡片使用终端窗口样式 -->
<article class="terminal-window">
  <div class="terminal-header">
    <div class="terminal-controls">
      <span class="terminal-btn close"></span>
      <span class="terminal-btn minimize"></span>
      <span class="terminal-btn maximize"></span>
    </div>
    <div class="terminal-title">post.md</div>
  </div>
  <div class="terminal-body">
    <div class="terminal-line">
      <span class="terminal-prompt">$</span>
      <span class="terminal-command">cat article.txt</span>
    </div>
    <div class="terminal-content">
      <!-- 文章内容 -->
    </div>
  </div>
</article>
```

## 性能优化策略

### 1. CSS 优化

- 使用 CSS 变量避免重复定义
- 利用 `will-change` 优化动画性能
- 使用 `contain` 属性隔离重绘区域

```css
.theme-switcher {
  will-change: transform, opacity;
}

.terminal-window {
  contain: layout style paint;
}
```

### 2. JavaScript 优化

- 使用事件委托减少监听器数量
- 防抖/节流处理频繁触发的事件
- 使用 Intersection Observer 实现懒加载

```javascript
// 主题切换防抖
let themeChangeTimeout;
function debouncedThemeChange(theme) {
  clearTimeout(themeChangeTimeout);
  themeChangeTimeout = setTimeout(() => {
    themeManager.setTheme(theme);
  }, 100);
}
```

### 3. 加载优化

- 异步加载非关键 CSS
- 使用 `preload` 预加载字体
- 代码分割，按需加载主题样式

```html
<link rel="preload" href="/css/fonts/jetbrains-mono.woff2" as="font" type="font/woff2" crossorigin>
```

## 无障碍支持

### 1. 键盘导航

- 所有交互元素可通过 Tab 键访问
- 主题切换器支持方向键导航
- Enter/Space 触发按钮操作

### 2. 屏幕阅读器

- 使用 ARIA 标签描述组件功能
- 主题切换时播报当前主题名称
- 打字效果完成后移除光标

```html
<button class="theme-btn" aria-label="当前主题：经典终端，点击切换">
  <span aria-hidden="true">💻</span>
</button>
```

### 3. 减少动画

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .typewriter-cursor,
  .terminal-cursor {
    animation: none;
    opacity: 1;
  }
}
```

## 浏览器兼容性

- **现代浏览器**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **CSS 变量**: 所有目标浏览器均支持
- **ES6 类**: 所有目标浏览器均支持
- **降级方案**: 提供基础样式作为后备

## 开发工作流

### 本地开发

```bash
# 启动 Hexo 开发服务器
hexo server --debug

# 监视样式变化
hexo generate --watch
```

### 构建部署

```bash
# 生成静态文件
hexo generate

# 部署到服务器
hexo deploy
```

## 扩展性考虑

### 添加新主题

1. 在 `_themes/` 目录创建新的 `.styl` 文件
2. 在 `ThemeManager.themes` 数组中添加主题 ID
3. 在主题切换器模板中添加新主题选项
4. 更新 PRD 文档

### 自定义配置

用户可通过 `_config.yml` 自定义：

```yaml
# 主题配置
theme_config:
  default_theme: classic
  enable_typewriter: true
  typewriter_speed: 100
  enable_cursor: true
```
