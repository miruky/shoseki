import { describe, expect, it } from 'vitest';
import { postsByTag, searchPosts, tagCounts } from './search';
import type { Post } from './types';

const posts: Post[] = [
  {
    slug: 'a',
    title: '漱石の話',
    book: { title: 'こころ', author: '夏目漱石' },
    rating: 5,
    date: '2026-01-01',
    tags: ['日本文学', '名作'],
    excerpt: '静かな小説',
    body: '手紙の話',
    cover: '#000',
  },
  {
    slug: 'b',
    title: 'カフカの話',
    book: { title: '変身', author: 'フランツ・カフカ' },
    rating: 4,
    date: '2026-02-01',
    tags: ['海外文学'],
    excerpt: '虫になる',
    body: '不条理',
    cover: '#111',
  },
  {
    slug: 'c',
    title: '芥川の話',
    book: { title: '羅生門', author: '芥川龍之介' },
    rating: 4,
    date: '2026-03-01',
    tags: ['日本文学', '短編'],
    excerpt: '善悪',
    body: '下人',
    cover: '#222',
  },
];

describe('searchPosts', () => {
  it('タイトル一致を返す', () => {
    expect(searchPosts(posts, '漱石').map((p) => p.slug)).toEqual(['a']);
  });

  it('書名・著者でも一致する', () => {
    expect(searchPosts(posts, 'カフカ').map((p) => p.slug)).toEqual(['b']);
    expect(searchPosts(posts, '羅生門').map((p) => p.slug)).toEqual(['c']);
  });

  it('複数語はすべて含む記事だけ返す', () => {
    expect(searchPosts(posts, '日本文学 短編').map((p) => p.slug)).toEqual(['c']);
  });

  it('該当なしは空配列', () => {
    expect(searchPosts(posts, '存在しない語')).toEqual([]);
  });

  it('空クエリは空配列', () => {
    expect(searchPosts(posts, '   ')).toEqual([]);
  });

  it('タイトル一致は本文一致より上位', () => {
    const result = searchPosts(posts, '話');
    expect(result[0]!.slug).toBe('a');
  });
});

describe('tagCounts', () => {
  it('タグを出現数の多い順に数える', () => {
    expect(tagCounts(posts)).toEqual([
      { tag: '日本文学', count: 2 },
      { tag: '名作', count: 1 },
      { tag: '海外文学', count: 1 },
      { tag: '短編', count: 1 },
    ]);
  });
});

describe('postsByTag', () => {
  it('タグを持つ記事を返す', () => {
    expect(postsByTag(posts, '日本文学').map((p) => p.slug)).toEqual(['a', 'c']);
  });
});
