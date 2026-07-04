/**
 * 日本語翻訳ファイル
 * Japanese Translation
 */

const ja = {
  // ナビゲーション
  nav: {
    home: 'ホーム',
    archives: 'アーカイブ',
    categories: 'カテゴリー',
    tags: 'タグ',
    about: 'について',
    search: '検索',
    rss: 'RSS 購読'
  },

  // テーマ
  theme: {
    title: 'テーマ',
    classic: 'クラシック端末',
    amber: 'アンバー単色',
    cyberpunk: 'サイバーパンク',
    matrix: 'マトリックス緑',
    minimal: 'ミニマルグレー'
  },

  // 言語
  language: {
    title: '言語',
    zhCN: '簡体字中国語',
    ja: '日本語',
    en: 'English'
  },

  // 記事
  article: {
    readMore: '続きを読む',
    prev: '前へ',
    next: '次へ',
    share: '共有',
    comments: 'コメント',
    published: '投稿日',
    updated: '更新日',
    category: 'カテゴリー',
    tags: 'タグ',
    wordCount: '文字数',
    readingTime: '読書時間',
    minutes: '分'
  },

  // フッター
  footer: {
    systemOnline: 'システムオンライン',
    theme: 'テーマ',
    build: 'ビルド',
    thanks: 'ご訪問ありがとうございます！',
    visits: '訪問回数',
    visitors: '訪問者数',
    pageViews: 'ページビュー'
  },

  // 検索
  search: {
    placeholder: 'キーワードを入力...',
    noResults: '関連記事が見つかりません',
    results: '{count} 件の結果'
  },

  // アーカイブ
  archive: {
    title: '記事アーカイブ',
    year: '年',
    month: '月',
    total: '全 {count} 件の記事'
  },

  // カテゴリーとタグ
  taxonomy: {
    categories: '記事カテゴリー',
    tags: 'タグクラウド',
    noCategories: 'カテゴリーなし',
    noTags: 'タグなし'
  },

  // エラーページ
  error: {
    notFound: 'ページが見つかりません',
    notFoundDesc: '申し訳ございませんが、アクセスしたページは存在しません。',
    goHome: 'ホームに戻る',
    back: '前のページに戻る'
  },

  // メッセージ
  message: {
    copied: 'クリップボードにコピーしました',
    copyFailed: 'コピーに失敗しました',
    loading: '読み込み中...',
    loadMore: 'もっと読み込む',
    noMore: 'これ以上ありません'
  }
};

// 翻訳オブジェクトをエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ja;
}
