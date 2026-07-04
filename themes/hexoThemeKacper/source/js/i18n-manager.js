/**
 * Internationalization (i18n) Manager
 * 多语言管理器 - 支持中、日、英三语切换
 */

class I18nManager {
  constructor() {
    this.currentLang = 'zh-CN';
    this.languages = [
      { id: 'zh-CN', name: '简体中文', flag: '🇨🇳', file: 'zh-CN' },
      { id: 'ja', name: '日本語', flag: '🇯🇵', file: 'ja' },
      { id: 'en', name: 'English', flag: '🇬🇧', file: 'en' }
    ];
    this.translations = {};
    this.storageKey = 'terminal-language';
    this.loaded = false;
    
    this.init();
  }

  /**
   * 初始化 i18n 管理器
   */
  async init() {
    // 从 localStorage 加载保存的语言
    this.loadSavedLanguage();
    
    // 加载翻译文件
    await this.loadTranslations();
    
    // 初始化语言切换器 UI
    this.initLanguageSwitcher();
    
    // 应用当前语言
    this.applyLanguage();
    
    // 监听语言变化事件
    window.addEventListener('languagechange', (e) => {
      this.applyLanguage();
    });
  }

  /**
   * 加载保存的语言设置
   */
  loadSavedLanguage() {
    try {
      const savedLang = localStorage.getItem(this.storageKey);
      if (savedLang && this.isValidLanguage(savedLang)) {
        this.currentLang = savedLang;
        document.documentElement.setAttribute('data-lang', savedLang);
      } else {
        // 检测浏览器语言
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('zh')) {
          this.currentLang = 'zh-CN';
        } else if (browserLang.startsWith('ja')) {
          this.currentLang = 'ja';
        } else {
          this.currentLang = 'en';
        }
        document.documentElement.setAttribute('data-lang', this.currentLang);
      }
    } catch (e) {
      console.warn('无法访问 localStorage，使用默认语言');
    }
  }

  /**
   * 验证语言是否有效
   */
  isValidLanguage(langId) {
    return this.languages.some(lang => lang.id === langId);
  }

  /**
   * 加载翻译文件
   */
  async loadTranslations() {
    const basePath = '/js/i18n/';
    
    for (const lang of this.languages) {
      try {
        const response = await fetch(`${basePath}${lang.file}.js`);
        const scriptText = await response.text();
        
        // 执行脚本获取翻译对象
        const translationObj = this.evalTranslationScript(scriptText, lang.file);
        this.translations[lang.id] = translationObj;
      } catch (e) {
        console.warn(`加载翻译文件失败: ${lang.file}`, e);
        // 使用空对象作为后备
        this.translations[lang.id] = {};
      }
    }
    
    this.loaded = true;
  }

  /**
   * 评估翻译脚本获取对象
   */
  evalTranslationScript(scriptText, varName) {
    // 创建一个函数来执行脚本并返回对象
    try {
      // 移除 export 语句
      const cleanScript = scriptText.replace(/if\s*\(\s*typeof\s+module[\s\S]*$/m, '');
      
      // 执行脚本
      const fn = new Function(cleanScript + `; return ${varName};`);
      return fn();
    } catch (e) {
      console.warn('解析翻译脚本失败:', e);
      return {};
    }
  }

  /**
   * 设置语言
   * @param {string} langId - 语言 ID
   */
  setLanguage(langId) {
    if (!this.isValidLanguage(langId)) {
      console.warn(`无效的语言: ${langId}`);
      return;
    }

    this.currentLang = langId;
    document.documentElement.setAttribute('data-lang', langId);

    // 保存到 localStorage
    try {
      localStorage.setItem(this.storageKey, langId);
    } catch (e) {
      console.warn('无法保存语言设置');
    }

    // 触发自定义事件
    window.dispatchEvent(new CustomEvent('languagechange', {
      detail: { language: langId, languageName: this.getLanguageName(langId) }
    }));

    // 应用语言
    this.applyLanguage();
    
    // 更新 UI
    this.updateLanguageUI(langId);
  }

  /**
   * 获取语言名称
   */
  getLanguageName(langId) {
    const lang = this.languages.find(l => l.id === langId);
    return lang ? lang.name : langId;
  }

  /**
   * 获取当前语言
   */
  getCurrentLanguage() {
    return this.currentLang;
  }

  /**
   * 获取翻译文本
   * @param {string} key - 翻译键，如 'nav.home'
   * @param {object} params - 替换参数，如 { count: 5 }
   * @returns {string} 翻译后的文本
   */
  t(key, params = {}) {
    if (!this.loaded) {
      return key;
    }

    const translation = this.translations[this.currentLang];
    if (!translation) {
      return key;
    }

    // 解析嵌套键
    const keys = key.split('.');
    let value = translation;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // 如果找不到翻译，尝试使用英文
        const enTranslation = this.translations['en'];
        if (enTranslation) {
          let enValue = enTranslation;
          for (const ek of keys) {
            if (enValue && typeof enValue === 'object' && ek in enValue) {
              enValue = enValue[ek];
            } else {
              return key;
            }
          }
          value = enValue;
        } else {
          return key;
        }
        break;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // 替换参数
    return value.replace(/\{(\w+)\}/g, (match, param) => {
      return params[param] !== undefined ? params[param] : match;
    });
  }

  /**
   * 应用语言到页面
   */
  applyLanguage() {
    // 更新所有带有 data-i18n 属性的元素
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);
      
      // 检查是否是输入框
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        if (el.getAttribute('data-i18n-attr') === 'placeholder') {
          el.placeholder = translation;
        } else {
          el.value = translation;
        }
      } else {
        el.textContent = translation;
      }
    });

    // 更新带有 data-i18n-attr 属性的元素
    const attrElements = document.querySelectorAll('[data-i18n-attr]');
    attrElements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const attr = el.getAttribute('data-i18n-attr');
      if (key && attr) {
        el.setAttribute(attr, this.t(key));
      }
    });

    // 更新页面标题
    const titleEl = document.querySelector('title[data-i18n-title]');
    if (titleEl) {
      const key = titleEl.getAttribute('data-i18n-title');
      document.title = this.t(key);
    }

    // 更新 HTML lang 属性
    document.documentElement.lang = this.currentLang === 'zh-CN' ? 'zh-CN' : 
                                    this.currentLang === 'ja' ? 'ja' : 'en';
  }

  /**
   * 初始化语言切换器 UI
   */
  initLanguageSwitcher() {
    // 查找或创建语言切换器
    let switcher = document.getElementById('language-switcher');
    
    if (!switcher) {
      switcher = this.createLanguageSwitcher();
      // 插入到主题切换器旁边或 body
      const themeSwitcher = document.getElementById('theme-switcher');
      if (themeSwitcher) {
        themeSwitcher.parentNode.insertBefore(switcher, themeSwitcher.nextSibling);
      } else {
        document.body.appendChild(switcher);
      }
    }

    this.dropdown = switcher.querySelector('.language-dropdown');
    this.langBtn = switcher.querySelector('.language-btn');

    // 绑定事件
    this.bindEvents(switcher);
    
    // 初始化 UI 状态
    this.updateLanguageUI(this.currentLang);
  }

  /**
   * 创建语言切换器 HTML
   */
  createLanguageSwitcher() {
    const switcher = document.createElement('div');
    switcher.id = 'language-switcher';
    switcher.className = 'language-switcher';
    
    const currentLang = this.languages.find(l => l.id === this.currentLang) || this.languages[0];
    
    switcher.innerHTML = `
      <button class="language-btn" aria-label="切换语言，当前语言：${currentLang.name}">
        <span class="language-flag">${currentLang.flag}</span>
        <span class="language-code">${currentLang.id.toUpperCase()}</span>
      </button>
      <div class="language-dropdown">
        ${this.languages.map(lang => `
          <button class="language-option ${lang.id === this.currentLang ? 'active' : ''}" 
                  data-lang="${lang.id}" 
                  aria-label="切换到 ${lang.name}">
            <span class="language-option-flag">${lang.flag}</span>
            <span class="language-option-name">${lang.name}</span>
            <span class="language-option-code">${lang.id.toUpperCase()}</span>
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
    this.langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown();
    });

    // 语言选项点击
    const options = switcher.querySelectorAll('.language-option');
    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const langId = option.getAttribute('data-lang');
        this.setLanguage(langId);
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
    this.langBtn.setAttribute('aria-expanded', 'true');
  }

  /**
   * 关闭下拉菜单
   */
  closeDropdown() {
    if (this.dropdown) {
      this.dropdown.classList.remove('active');
    }
    if (this.langBtn) {
      this.langBtn.setAttribute('aria-expanded', 'false');
    }
  }

  /**
   * 更新语言 UI
   */
  updateLanguageUI(langId) {
    const lang = this.languages.find(l => l.id === langId);
    if (!lang) return;

    // 更新按钮显示
    if (this.langBtn) {
      this.langBtn.querySelector('.language-flag').textContent = lang.flag;
      this.langBtn.querySelector('.language-code').textContent = lang.id.toUpperCase();
      this.langBtn.setAttribute('aria-label', `切换语言，当前语言：${lang.name}`);
    }

    // 更新选项激活状态
    const options = document.querySelectorAll('.language-option');
    options.forEach(option => {
      const optionLang = option.getAttribute('data-lang');
      if (optionLang === langId) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });
  }

  /**
   * 获取所有可用语言
   */
  getLanguages() {
    return [...this.languages];
  }
}

// ============================================
// Initialize on DOM Ready
// ============================================

(function() {
  'use strict';

  function init() {
    // 初始化 i18n 管理器
    window.i18n = new I18nManager();
    
    // 暴露全局翻译函数
    window.t = function(key, params) {
      if (window.i18n) {
        return window.i18n.t(key, params);
      }
      return key;
    };
  }

  // DOM 加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
