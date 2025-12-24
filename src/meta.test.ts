import { describe, expect, it } from 'vitest';
import { pageMeta } from './meta';
import { POSTS } from './posts';

describe('pageMeta', () => {
  it('ホームはサイト名を返す', () => {
    expect(pageMeta({ name: 'home' }).title).toContain('しょせき');
  });

  it('記事は記事名を題に、抜粋を説明にする', () => {
    const post = POSTS[0]!;
    const meta = pageMeta({ name: 'post', slug: post.slug });
    expect(meta.title).toBe(`${post.title} | しょせき`);
    expect(meta.description).toBe(post.excerpt);
  });

  it('存在しない記事は404相当の題にする', () => {
    expect(pageMeta({ name: 'post', slug: 'no-such' }).title).toContain('見つかりません');
  });

  it('タグ・検索は対象語を題に含める', () => {
    expect(pageMeta({ name: 'tag', tag: '再読' }).title).toContain('再読');
    expect(pageMeta({ name: 'search', query: '海' }).title).toContain('海');
  });

  it('空の検索は検索の題にする', () => {
    expect(pageMeta({ name: 'search', query: '   ' }).title).toBe('検索 | しょせき');
  });
});
