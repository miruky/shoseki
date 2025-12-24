import { describe, expect, it } from 'vitest';
import { parseFavorites, serializeFavorites } from './favorites';

describe('parseFavorites', () => {
  it('空・null は空集合', () => {
    expect(parseFavorites(null).size).toBe(0);
    expect(parseFavorites('').size).toBe(0);
  });

  it('文字列配列だけを取り込む', () => {
    const set = parseFavorites('["a","b",3,null,"a"]');
    expect([...set].sort()).toEqual(['a', 'b']);
  });

  it('壊れたJSONは空集合', () => {
    expect(parseFavorites('{not json').size).toBe(0);
  });

  it('配列以外は空集合', () => {
    expect(parseFavorites('{"a":1}').size).toBe(0);
  });
});

describe('serializeFavorites', () => {
  it('集合をJSON配列にして往復で保たれる', () => {
    const set = new Set(['kani', 'kokoro']);
    expect(parseFavorites(serializeFavorites(set))).toEqual(set);
  });
});
