import { describe, expect, it } from 'vitest';
import { POSTS } from './posts';
import { homeView, postView, tagView } from './view';

describe('view の見出し構造', () => {
  it('ホームに h1 がある', () => {
    expect(homeView()).toContain('<h1');
  });

  it('注目記事の見出しは h2', () => {
    expect(homeView()).toContain('<h2 class="featured-title"');
  });

  it('一覧カードの見出しは h3', () => {
    expect(homeView()).toContain('<h3 class="card-title"');
  });

  it('記事ページは h1 にタイトルを持つ', () => {
    expect(postView(POSTS[0]!.slug)).toContain('<h1>');
  });
});

describe('view のエッジケース', () => {
  it('未知スラッグはページ未検出を返す', () => {
    expect(postView('does-not-exist')).toContain('ページが見つかりません');
  });

  it('記事がある限り前後ナビを出す', () => {
    expect(postView(POSTS[0]!.slug)).toContain('post-nav');
  });

  it('該当のないタグは空状態を示す', () => {
    expect(tagView('存在しないタグxyz')).toContain('記事はありません');
  });
});
