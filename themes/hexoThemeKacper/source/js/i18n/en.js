/**
 * English Translation File
 * 英文翻译文件
 */

const en = {
  // Navigation
  nav: {
    home: 'Home',
    archives: 'Archives',
    categories: 'Categories',
    tags: 'Tags',
    about: 'About',
    search: 'Search',
    rss: 'RSS Feed'
  },

  // Theme
  theme: {
    title: 'Theme',
    classic: 'Classic Terminal',
    amber: 'Amber Monochrome',
    cyberpunk: 'Cyberpunk',
    matrix: 'Matrix Green',
    minimal: 'Minimal Gray'
  },

  // Language
  language: {
    title: 'Language',
    zhCN: '简体中文',
    ja: '日本語',
    en: 'English'
  },

  // Article
  article: {
    readMore: 'Read More',
    prev: 'Previous',
    next: 'Next',
    share: 'Share',
    comments: 'Comments',
    published: 'Published on',
    updated: 'Updated on',
    category: 'Category',
    tags: 'Tags',
    wordCount: 'Words',
    readingTime: 'Reading time',
    minutes: 'min'
  },

  // Footer
  footer: {
    systemOnline: 'SYSTEM ONLINE',
    theme: 'THEME',
    build: 'BUILD',
    thanks: 'Thanks for visiting!',
    visits: 'Total visits',
    visitors: 'Unique visitors',
    pageViews: 'Page views'
  },

  // Search
  search: {
    placeholder: 'Search keywords...',
    noResults: 'No articles found',
    results: 'Found {count} results'
  },

  // Archive
  archive: {
    title: 'Archives',
    year: '',
    month: '',
    total: '{count} articles in total'
  },

  // Categories and Tags
  taxonomy: {
    categories: 'Categories',
    tags: 'Tag Cloud',
    noCategories: 'No categories',
    noTags: 'No tags'
  },

  // Error Page
  error: {
    notFound: 'Page Not Found',
    notFoundDesc: 'Sorry, the page you are looking for does not exist.',
    goHome: 'Go Home',
    back: 'Go Back'
  },

  // Messages
  message: {
    copied: 'Copied to clipboard',
    copyFailed: 'Copy failed',
    loading: 'Loading...',
    loadMore: 'Load More',
    noMore: 'No more content'
  }
};

// Export translation object
if (typeof module !== 'undefined' && module.exports) {
  module.exports = en;
}
