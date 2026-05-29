/**
 * 简体中文翻译文件
 * Simplified Chinese Translation
 */

const zhCN = {
  // 导航
  nav: {
    home: '首页',
    archives: '归档',
    categories: '分类',
    tags: '标签',
    about: '关于',
    search: '搜索',
    rss: 'RSS 订阅'
  },

  // 主题
  theme: {
    title: '主题',
    classic: '经典终端',
    amber: '琥珀单色',
    cyberpunk: '赛博朋克',
    matrix: '矩阵绿',
    minimal: '极简灰度'
  },

  // 语言
  language: {
    title: '语言',
    zhCN: '简体中文',
    ja: '日本語',
    en: 'English'
  },

  // 文章
  article: {
    readMore: '阅读更多',
    prev: '上一篇',
    next: '下一篇',
    share: '分享',
    comments: '评论',
    published: '发布于',
    updated: '更新于',
    category: '分类',
    tags: '标签',
    wordCount: '字数',
    readingTime: '阅读时间',
    minutes: '分钟'
  },

  // 页脚
  footer: {
    systemOnline: '系统在线',
    theme: '主题',
    build: '构建',
    thanks: '感谢访问！',
    visits: '访问次数',
    visitors: '访客数',
    pageViews: '页面浏览'
  },

  // 搜索
  search: {
    placeholder: '输入关键词搜索...',
    noResults: '没有找到相关文章',
    results: '找到 {count} 个结果'
  },

  // 归档
  archive: {
    title: '文章归档',
    year: '年',
    month: '月',
    total: '共 {count} 篇文章'
  },

  // 分类和标签
  taxonomy: {
    categories: '文章分类',
    tags: '标签云',
    noCategories: '暂无分类',
    noTags: '暂无标签'
  },

  // 错误页面
  error: {
    notFound: '页面未找到',
    notFoundDesc: '抱歉，您访问的页面不存在。',
    goHome: '返回首页',
    back: '返回上页'
  },

  // 提示信息
  message: {
    copied: '已复制到剪贴板',
    copyFailed: '复制失败',
    loading: '加载中...',
    loadMore: '加载更多',
    noMore: '没有更多了'
  }
};

// 导出翻译对象
if (typeof module !== 'undefined' && module.exports) {
  module.exports = zhCN;
}
