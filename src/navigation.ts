import { compareByDateDesc } from './format';
import type { Post } from './types';

export interface Adjacent {
  newer: Post | null;
  older: Post | null;
}

// 日付の新しい順に並べたとき、指定スラッグの前後(1つ新しい記事・1つ古い記事)を返す。
export function adjacentPosts(posts: Post[], slug: string): Adjacent {
  const ordered = [...posts].sort(compareByDateDesc);
  const i = ordered.findIndex((p) => p.slug === slug);
  if (i === -1) return { newer: null, older: null };
  return {
    newer: i > 0 ? ordered[i - 1]! : null,
    older: i < ordered.length - 1 ? ordered[i + 1]! : null,
  };
}
