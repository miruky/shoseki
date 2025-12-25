import { POSTS } from './posts';
import type { Route } from './router';

// ルートごとのページタイトルと説明文。SPAでも各ページが固有の <title> と
// description を持つようにし、ブックマークや共有時に内容が伝わるようにする。

const SITE = 'しょせき';
const SITE_DESC = '読んだ本の感想を書き留める、緑を基調とした静かなブログ';

export interface PageMeta {
  title: string;
  description: string;
}

export function pageMeta(route: Route): PageMeta {
  switch (route.name) {
    case 'home':
      return { title: `${SITE} | 本の感想ブログ`, description: SITE_DESC };
    case 'post': {
      const post = POSTS.find((p) => p.slug === route.slug);
      if (!post) return { title: `ページが見つかりません | ${SITE}`, description: SITE_DESC };
      return { title: `${post.title} | ${SITE}`, description: post.excerpt };
    }
    case 'tag':
      return { title: `タグ: ${route.tag} | ${SITE}`, description: `「${route.tag}」に連なる本の感想。` };
    case 'archive':
      return { title: `アーカイブ | ${SITE}`, description: 'これまでの感想を年ごとにたどります。' };
    case 'about':
      return { title: `このブログについて | ${SITE}`, description: SITE_DESC };
    case 'favorites':
      return { title: `お気に入り | ${SITE}`, description: '印をつけて読み返したい感想の一覧。' };
    case 'search': {
      const q = route.query.trim();
      return q
        ? { title: `「${q}」の検索結果 | ${SITE}`, description: `「${q}」に一致する感想の一覧。` }
        : { title: `検索 | ${SITE}`, description: SITE_DESC };
    }
  }
}
