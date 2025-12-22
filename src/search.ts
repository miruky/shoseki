import type { Post } from './types';

// 記事の全文検索。空白区切りの語をすべて含む記事を、一致箇所の重みで並べる。
// タイトルと書名・著者を重く、本文を軽く評価する。
export function searchPosts(posts: Post[], query: string): Post[] {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
  if (terms.length === 0) return [];

  const scored: Array<{ post: Post; score: number }> = [];
  for (const post of posts) {
    const haystacks = {
      title: post.title.toLowerCase(),
      book: `${post.book.title} ${post.book.author}`.toLowerCase(),
      tags: post.tags.join(' ').toLowerCase(),
      body: `${post.excerpt} ${post.body}`.toLowerCase(),
    };
    let score = 0;
    const matchedAll = terms.every((term) => {
      let hit = false;
      if (haystacks.title.includes(term)) {
        score += 5;
        hit = true;
      }
      if (haystacks.book.includes(term)) {
        score += 4;
        hit = true;
      }
      if (haystacks.tags.includes(term)) {
        score += 3;
        hit = true;
      }
      if (haystacks.body.includes(term)) {
        score += 1;
        hit = true;
      }
      return hit;
    });
    if (matchedAll) scored.push({ post, score });
  }

  return scored
    .sort((a, b) => b.score - a.score || (a.post.date < b.post.date ? 1 : -1))
    .map((s) => s.post);
}

export interface TagCount {
  tag: string;
  count: number;
}

export function tagCounts(posts: Post[]): TagCount[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  // 同数のときは初出順を保つ(Mapの挿入順 + 安定ソート)
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function postsByTag(posts: Post[], tag: string): Post[] {
  return posts.filter((p) => p.tags.includes(tag));
}
