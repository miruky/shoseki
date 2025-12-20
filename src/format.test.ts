import { describe, expect, it } from 'vitest';
import { compareByDateDesc, formatDate, readingMinutes } from './format';

describe('formatDate', () => {
  it('和風の日付にする', () => {
    expect(formatDate('2026-06-12')).toBe('2026年6月12日');
    expect(formatDate('2026-01-05')).toBe('2026年1月5日');
  });
});

describe('readingMinutes', () => {
  it('短文でも最低1分', () => {
    expect(readingMinutes('短い')).toBe(1);
  });

  it('文字数に応じて増える', () => {
    expect(readingMinutes('あ'.repeat(1000))).toBe(2);
  });
});

describe('compareByDateDesc', () => {
  it('新しい日付が先になる', () => {
    const items = [{ date: '2026-01-01' }, { date: '2026-03-01' }, { date: '2026-02-01' }];
    expect(items.sort(compareByDateDesc).map((i) => i.date)).toEqual([
      '2026-03-01',
      '2026-02-01',
      '2026-01-01',
    ]);
  });
});
