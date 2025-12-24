// 読み手が「また読み返したい」感想に印をつけられるよう、お気に入りのslug集合を
// localStorageに保持する。保存に失敗しても閲覧は妨げない。

const KEY = 'shoseki.favorites.v1';

export function parseFavorites(raw: string | null): Set<string> {
  if (!raw) return new Set();
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return new Set();
    return new Set(value.filter((x): x is string => typeof x === 'string'));
  } catch {
    return new Set();
  }
}

export function serializeFavorites(set: Set<string>): string {
  return JSON.stringify([...set]);
}

export function loadFavorites(): Set<string> {
  try {
    return parseFavorites(localStorage.getItem(KEY));
  } catch {
    return new Set();
  }
}

function save(set: Set<string>): void {
  try {
    localStorage.setItem(KEY, serializeFavorites(set));
  } catch {
    // 保存できなくても操作は続行する
  }
}

export function isFavorite(slug: string): boolean {
  return loadFavorites().has(slug);
}

export function favoriteCount(): number {
  return loadFavorites().size;
}

// slugの登録状態を反転して保存し、反転後の状態(true=登録済み)を返す。
export function toggleFavorite(slug: string): boolean {
  const set = loadFavorites();
  let added: boolean;
  if (set.has(slug)) {
    set.delete(slug);
    added = false;
  } else {
    set.add(slug);
    added = true;
  }
  save(set);
  return added;
}
