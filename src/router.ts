export type Route =
  | { name: 'home' }
  | { name: 'post'; slug: string }
  | { name: 'tag'; tag: string }
  | { name: 'archive' }
  | { name: 'about' }
  | { name: 'search'; query: string };

// 場所のハッシュ(#/post/foo など)をRouteに変換する。
export function parseRoute(hash: string): Route {
  const raw = hash.replace(/^#/, '');
  const [path, queryString] = raw.split('?');
  const segments = (path ?? '').split('/').filter(Boolean);

  if (segments.length === 0) return { name: 'home' };
  const [head, second] = segments;

  if (head === 'post' && second) return { name: 'post', slug: decodeURIComponent(second) };
  if (head === 'tag' && second) return { name: 'tag', tag: decodeURIComponent(second) };
  if (head === 'archive') return { name: 'archive' };
  if (head === 'about') return { name: 'about' };
  if (head === 'search') {
    const params = new URLSearchParams(queryString ?? '');
    return { name: 'search', query: params.get('q') ?? '' };
  }
  return { name: 'home' };
}

export function toHash(route: Route): string {
  switch (route.name) {
    case 'home':
      return '#/';
    case 'post':
      return `#/post/${encodeURIComponent(route.slug)}`;
    case 'tag':
      return `#/tag/${encodeURIComponent(route.tag)}`;
    case 'archive':
      return '#/archive';
    case 'about':
      return '#/about';
    case 'search':
      return `#/search?q=${encodeURIComponent(route.query)}`;
  }
}
