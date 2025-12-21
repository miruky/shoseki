import { plainTextLength } from './markdown';

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${y}年${m}月${d}日`;
}

// 日本語はおよそ毎分500字として読了時間を見積もる。最低1分。
export function readingMinutes(body: string): number {
  return Math.max(1, Math.round(plainTextLength(body) / 500));
}

export function compareByDateDesc(a: { date: string }, b: { date: string }): number {
  return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
}
