/**
 * Terminal Theme Manager
 * 主题管理系统 - 支持多主题切换和持久化存储
 */

class ThemeManager {
  constructor() {
    this.currentTheme = 'classic';
    this.themes = [
      { id: 'classic', name: '经典终端', icon: '💻' },
      { id: 'amber', name: '琥珀单色', icon: '📺' },
      { id: 'cyberpunk', name: '赛博朋克', icon: '🌃' },
      { id: 'matrix', name: '矩阵绿', icon: '🌿' },
      { id: 'minimal', name: '极简灰度', icon: '⬛' }
    ];
    this.storageKey = 'terminal-theme';
    this.dropdown = null;
    this.themeBtn = null;
    
    this.init();
  }

  /**
   * 初始化主题管理器
   */
  init() {
    // 从 localStorage 加载保存的主题
    this.loadSavedTheme();
    
    // 初始化主题切换器 UI
    this.initThemeSwitcher();
    
    // 监听系统主题变化
    this.watchSystemTheme();
    
    // 监听主题变化事件
    window.addEventListener('themechange', (e) => {
      this.updateThemeUI(e.detail.theme);
    });
  }

  /**
   * 加载保存的主题
   */
  loadSavedTheme() {
    try {
      const savedTheme = localStorage.getItem(this.storageKey);
      if (savedTheme && this.isValidTheme(savedTheme)) {
        this.setTheme(savedTheme, false);
      } else {
        // 默认使用经典主题
        this.setTheme('classic', false);
      }
    } catch (e) {
      console.warn('无法访问 localStorage，使用默认主题');
      this.setTheme('classic', false);
    }
  }

  /**
   * 验证主题是否有效
   */
  isValidTheme(themeId) {
    return this.themes.some(theme => theme.id === themeId);
  }

  /**
   * 设置主题
   * @param {string} themeId - 主题 ID
   * @param {boolean} animate - 是否启用过渡动画
   */
  setTheme(themeId, animate = true) {
    if (!this.isValidTheme(themeId)) {
      console.warn(`无效的主题: ${themeId}`);
      return;
    }

    const root = document.documentElement;
    
    // 启用过渡动画
    if (animate) {
      root.style.transition = 'all 300ms ease';
    }

    // 设置主题属性
    root.setAttribute('data-theme', themeId);
    this.currentTheme = themeId;

    // 保存到 localStorage
    try {
      localStorage.setItem(this.storageKey, themeId);
    } catch (e) {
      console.warn('无法保存主题设置');
    }

    // 触发自定义事件
    window.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme: themeId, themeName: this.getThemeName(themeId) }
    }));

    // 清除过渡动画
    if (animate) {
      setTimeout(() => {
        root.style.transition = '';
      }, 300);
    }

    // 更新 UI
    this.updateThemeUI(themeId);
  }

  /**
   * 获取主题名称
   */
  getThemeName(themeId) {
    const theme = this.themes.find(t => t.id === themeId);
    return theme ? theme.name : themeId;
  }

  /**
   * 获取当前主题
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * 切换到下一个主题
   */
  cycleTheme() {
    const currentIndex = this.themes.findIndex(t => t.id === this.currentTheme);
    const nextIndex = (currentIndex + 1) % this.themes.length;
    this.setTheme(this.themes[nextIndex].id);
  }

  /**
   * 初始化主题切换器 UI
   */
  initThemeSwitcher() {
    // 查找或创建主题切换器
    let switcher = document.getElementById('theme-switcher');
    
    if (!switcher) {
      switcher = this.createThemeSwitcher();
      document.body.appendChild(switcher);
    }

    this.dropdown = switcher.querySelector('.theme-dropdown');
    this.themeBtn = switcher.querySelector('.theme-btn');

    // 绑定事件
    this.bindEvents(switcher);
    
    // 初始化 UI 状态
    this.updateThemeUI(this.currentTheme);
  }

  /**
   * 创建主题切换器 HTML
   */
  createThemeSwitcher() {
    const switcher = document.createElement('div');
    switcher.id = 'theme-switcher';
    switcher.className = 'theme-switcher';
    
    const currentTheme = this.themes.find(t => t.id === this.currentTheme) || this.themes[0];
    
    switcher.innerHTML = `
      <button class="theme-btn" aria-label="切换主题，当前主题：${currentTheme.name}">
        <span class="theme-icon">${currentTheme.icon}</span>
        <span class="theme-name">${currentTheme.name}</span>
      </button>
      <div class="theme-dropdown">
        ${this.themes.map(theme => `
          <button class="theme-option ${theme.id === this.currentTheme ? 'active' : ''}" 
                  data-theme="${theme.id}" 
                  aria-label="切换到 ${theme.name}">
            <span class="theme-option-icon">${theme.icon}</span>
            <span class="theme-option-name">${theme.name}</span>
          </button>
        `).join('')}
      </div>
    `;
    
    return switcher;
  }

  /**
   * 绑定事件
   */
  bindEvents(switcher) {
    // 切换按钮点击
    this.themeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown();
    });

    // 主题选项点击
    const options = switcher.querySelectorAll('.theme-option');
    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const themeId = option.getAttribute('data-theme');
        this.setTheme(themeId);
        this.closeDropdown();
      });
    });

    // 点击外部关闭下拉菜单
    document.addEventListener('click', () => {
      this.closeDropdown();
    });

    // ESC 键关闭下拉菜单
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeDropdown();
      }
    });
  }

  /**
   * 切换下拉菜单
   */
  toggleDropdown() {
    if (this.dropdown.classList.contains('active')) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  /**
   * 打开下拉菜单
   */
  openDropdown() {
    this.dropdown.classList.add('active');
    this.themeBtn.setAttribute('aria-expanded', 'true');
  }

  /**
   * 关闭下拉菜单
   */
  closeDropdown() {
    this.dropdown.classList.remove('active');
    this.themeBtn.setAttribute('aria-expanded', 'false');
  }

  /**
   * 更新主题 UI
   */
  updateThemeUI(themeId) {
    const theme = this.themes.find(t => t.id === themeId);
    if (!theme) return;

    // 更新按钮显示
    if (this.themeBtn) {
      this.themeBtn.querySelector('.theme-icon').textContent = theme.icon;
      this.themeBtn.querySelector('.theme-name').textContent = theme.name;
      this.themeBtn.setAttribute('aria-label', `切换主题，当前主题：${theme.name}`);
    }

    // 更新选项激活状态
    const options = document.querySelectorAll('.theme-option');
    options.forEach(option => {
      const optionTheme = option.getAttribute('data-theme');
      if (optionTheme === themeId) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });
  }

  /**
   * 监听系统主题变化
   */
  watchSystemTheme() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // 如果用户没有手动设置过主题，跟随系统
    const hasUserPreference = localStorage.getItem(this.storageKey);
    if (!hasUserPreference) {
      // 所有终端主题都是暗色，不需要额外处理
    }

    mediaQuery.addEventListener('change', (e) => {
      // 可选：根据系统主题自动调整
      // 目前所有主题都是暗色风格，暂不处理
    });
  }

  /**
   * 获取所有可用主题
   */
  getThemes() {
    return [...this.themes];
  }
}

// ============================================
// Typewriter Effect
// ============================================

class Typewriter {
  constructor(element, options = {}) {
    this.element = element;
    this.originalText = element.textContent;
    this.speed = options.speed || 80;
    this.cursor = options.cursor !== false;
    this.delay = options.delay || 0;
    this.onComplete = options.onComplete || null;
    this.cursorElement = null;
    
    this.init();
  }

  init() {
    // 清空元素内容
    this.element.textContent = '';
    this.element.classList.add('typewriter');

    // 添加光标
    if (this.cursor) {
      this.cursorElement = document.createElement('span');
      this.cursorElement.className = 'typewriter-cursor';
      this.element.appendChild(this.cursorElement);
    }

    // 延迟后开始打字
    setTimeout(() => this.type(), this.delay);
  }

  type() {
    let index = 0;
    const text = this.originalText;

    const typeChar = () => {
      if (index < text.length) {
        const char = document.createTextNode(text.charAt(index));
        
        if (this.cursorElement) {
          this.element.insertBefore(char, this.cursorElement);
        } else {
          this.element.appendChild(char);
        }
        
        index++;
        setTimeout(typeChar, this.speed);
      } else {
        // 打字完成
        if (this.onComplete) {
          this.onComplete();
        }
        
        // 3秒后移除光标
        if (this.cursorElement) {
          setTimeout(() => {
            if (this.cursorElement && this.cursorElement.parentNode) {
              this.cursorElement.parentNode.removeChild(this.cursorElement);
            }
          }, 3000);
        }
      }
    };

    typeChar();
  }

  /**
   * 静态方法：初始化所有带有 data-typewriter 属性的元素
   */
  static initAll() {
    const elements = document.querySelectorAll('[data-typewriter]');
    
    elements.forEach((el, index) => {
      const options = {
        speed: parseInt(el.dataset.typewriterSpeed) || 80,
        delay: parseInt(el.dataset.typewriterDelay) || (index * 500),
        cursor: el.dataset.typewriterCursor !== 'false'
      };
      
      new Typewriter(el, options);
    });
  }
}

// ============================================
// Terminal Cursor Effect
// ============================================

class TerminalCursor {
  constructor() {
    this.cursors = new Set();
    this.interval = null;
    this.blinkInterval = 530; // VS Code 光标闪烁频率
    
    this.init();
  }

  init() {
    // 查找所有需要光标的元素
    this.scanForCursors();
    
    // 开始闪烁动画
    this.startBlinking();
    
    // 监听动态添加的元素
    this.observeDOM();
    
    // 尊重用户的动画偏好
    this.respectMotionPreference();
  }

  /**
   * 扫描页面中的光标元素
   */
  scanForCursors() {
    document.querySelectorAll('[data-cursor]').forEach(el => {
      this.addCursor(el);
    });
  }

  /**
   * 为元素添加光标
   */
  addCursor(element) {
    // 检查是否已添加光标
    if (element.querySelector('.terminal-cursor')) {
      return;
    }

    const cursor = document.createElement('span');
    cursor.className = 'terminal-cursor';
    element.appendChild(cursor);
    this.cursors.add(cursor);
  }

  /**
   * 开始闪烁动画
   */
  startBlinking() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => {
      this.cursors.forEach(cursor => {
        cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
      });
    }, this.blinkInterval);
  }

  /**
   * 停止闪烁动画
   */
  stopBlinking() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    
    // 显示所有光标
    this.cursors.forEach(cursor => {
      cursor.style.opacity = '1';
    });
  }

  /**
   * 监听 DOM 变化
   */
  observeDOM() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // 检查新添加的元素是否包含光标标记
            if (node.hasAttribute && node.hasAttribute('data-cursor')) {
              this.addCursor(node);
            }
            
            // 检查子元素
            if (node.querySelectorAll) {
              node.querySelectorAll('[data-cursor]').forEach(el => {
                this.addCursor(el);
              });
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * 尊重用户的动画偏好设置
   */
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

// ============================================
// Initialize on DOM Ready
// ============================================

(function() {
  'use strict';

  function init() {
    // 初始化主题管理器
    window.themeManager = new ThemeManager();
    
    // 初始化打字效果
    Typewriter.initAll();
    
    // 初始化终端光标
    window.terminalCursor = new TerminalCursor();
  }

  // DOM 加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
