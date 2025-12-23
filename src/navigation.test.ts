import { describe, expect, it } from 'vitest';
import { adjacentPosts } from './navigation';
import type { Post } from './types';

function mk(slug: string, date: string): Post {
  return {
    slug,
    title: slug,
    book: { title: 't', author: 'a' },
    rating: 3,
    date,
    tags: [],
    excerpt: 'x',
    body: 'x',
    cover: '#000000',
  };
}

const posts = [mk('a', '2026-01-01'), mk('b', '2026-02-01'), mk('c', '2026-03-01')];

describe('adjacentPosts', () => {
  it('中間は新しい記事と古い記事の両方を返す', () => {
    const { newer, older } = adjacentPosts(posts, 'b');
    expect(newer?.slug).toBe('c');
    expect(older?.slug).toBe('a');
  });

  it('最新の記事は newer が null', () => {
    const { newer, older } = adjacentPosts(posts, 'c');
    expect(newer).toBeNull();
    expect(older?.slug).toBe('b');
  });

  it('最古の記事は older が null', () => {
    expect(adjacentPosts(posts, 'a').older).toBeNull();
  });

  it('未知のスラッグは両方 null', () => {
    const r = adjacentPosts(posts, 'zzz');
    expect(r.newer).toBeNull();
    expect(r.older).toBeNull();
  });
});
