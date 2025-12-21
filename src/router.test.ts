import { describe, expect, it } from 'vitest';
import { parseRoute, toHash } from './router';

describe('parseRoute', () => {
  it('空やルートはhome', () => {
    expect(parseRoute('')).toEqual({ name: 'home' });
    expect(parseRoute('#/')).toEqual({ name: 'home' });
  });

  it('記事', () => {
    expect(parseRoute('#/post/kokoro')).toEqual({ name: 'post', slug: 'kokoro' });
  });

  it('タグ(URLエンコードを復元)', () => {
    expect(parseRoute('#/tag/' + encodeURIComponent('日本文学'))).toEqual({
      name: 'tag',
      tag: '日本文学',
    });
  });

  it('アーカイブとについて', () => {
    expect(parseRoute('#/archive')).toEqual({ name: 'archive' });
    expect(parseRoute('#/about')).toEqual({ name: 'about' });
  });

  it('検索クエリ', () => {
    expect(parseRoute('#/search?q=' + encodeURIComponent('漱石'))).toEqual({
      name: 'search',
      query: '漱石',
    });
  });

  it('未知のパスはhome', () => {
    expect(parseRoute('#/unknown/x')).toEqual({ name: 'home' });
  });
});

describe('toHash と parseRoute は往復する', () => {
  it('各ルートで一致する', () => {
    const routes = [
      { name: 'home' } as const,
      { name: 'post', slug: '日本語スラッグ' } as const,
      { name: 'tag', tag: '海外文学' } as const,
      { name: 'archive' } as const,
      { name: 'about' } as const,
      { name: 'search', query: 'カフカ 変身' } as const,
    ];
    for (const route of routes) {
      expect(parseRoute(toHash(route))).toEqual(route);
    }
  });
});
