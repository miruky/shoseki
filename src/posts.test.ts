import { describe, expect, it } from 'vitest';
import { POSTS } from './posts';

describe('posts データ', () => {
  it('スラッグは重複しない', () => {
    const slugs = POSTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('評価は0〜5かつ0.5刻み', () => {
    for (const p of POSTS) {
      expect(p.rating).toBeGreaterThanOrEqual(0);
      expect(p.rating).toBeLessThanOrEqual(5);
      expect(p.rating * 2).toBe(Math.round(p.rating * 2));
    }
  });

  it('日付はISO形式 yyyy-mm-dd', () => {
    for (const p of POSTS) expect(p.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('表紙色は16進カラー', () => {
    for (const p of POSTS) expect(p.cover).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it('必須項目が空でない', () => {
    for (const p of POSTS) {
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.book.title.length).toBeGreaterThan(0);
      expect(p.excerpt.length).toBeGreaterThan(0);
      expect(p.body.length).toBeGreaterThan(0);
    }
  });
});
