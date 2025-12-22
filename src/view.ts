import { compareByDateDesc, formatDate, readingMinutes } from './format';
import { coverSvg, starRating } from './icons';
import { renderMarkdown } from './markdown';
import { POSTS } from './posts';
import { toHash } from './router';
import { postsByTag, searchPosts, tagCounts } from './search';
import type { Post } from './types';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const sorted = (): Post[] => [...POSTS].sort(compareByDateDesc);

function tagChips(tags: string[]): string {
  return tags
    .map((t) => `<a class="chip" href="${toHash({ name: 'tag', tag: t })}">${esc(t)}</a>`)
    .join('');
}

function postCard(post: Post): string {
  return (
    `<article class="card">` +
    `<a class="card-cover" href="${toHash({ name: 'post', slug: post.slug })}">${coverSvg(post)}</a>` +
    `<div class="card-body">` +
    `<a class="card-title" href="${toHash({ name: 'post', slug: post.slug })}">${esc(post.title)}</a>` +
    `<p class="card-book">${esc(post.book.title)} ・ ${esc(post.book.author)}</p>` +
    `<div class="card-rating">${starRating(post.rating)}</div>` +
    `<p class="card-excerpt">${esc(post.excerpt)}</p>` +
    `<div class="card-meta"><time>${formatDate(post.date)}</time><span>${readingMinutes(post.body)}分で読めます</span></div>` +
    `<div class="chips">${tagChips(post.tags)}</div>` +
    `</div></article>`
  );
}

function tagCloud(): string {
  const chips = tagCounts(POSTS)
    .map(
      (t) =>
        `<a class="chip" href="${toHash({ name: 'tag', tag: t.tag })}">${esc(t.tag)}<span>${t.count}</span></a>`,
    )
    .join('');
  return `<section class="aside-block"><h2>タグ</h2><div class="chips">${chips}</div></section>`;
}

export function homeView(): string {
  const all = sorted();
  const [featured, ...rest] = all;
  if (!featured) return `<p class="empty">まだ記事がありません。</p>`;
  return (
    `<div class="home">` +
    `<section class="featured">` +
    `<a class="featured-cover" href="${toHash({ name: 'post', slug: featured.slug })}">${coverSvg(featured)}</a>` +
    `<div class="featured-body">` +
    `<p class="kicker">最新の感想</p>` +
    `<a class="featured-title" href="${toHash({ name: 'post', slug: featured.slug })}">${esc(featured.title)}</a>` +
    `<p class="featured-book">${esc(featured.book.title)} ・ ${esc(featured.book.author)}</p>` +
    `<div>${starRating(featured.rating)}</div>` +
    `<p class="featured-excerpt">${esc(featured.excerpt)}</p>` +
    `<div class="card-meta"><time>${formatDate(featured.date)}</time></div>` +
    `</div></section>` +
    `<div class="home-grid">` +
    `<div class="post-list">${rest.map(postCard).join('')}</div>` +
    `<aside class="sidebar">${tagCloud()}</aside>` +
    `</div></div>`
  );
}

function relatedPosts(post: Post): Post[] {
  return POSTS.filter((p) => p.slug !== post.slug)
    .map((p) => ({ p, shared: p.tags.filter((t) => post.tags.includes(t)).length }))
    .filter((x) => x.shared > 0)
    .sort((a, b) => b.shared - a.shared || compareByDateDesc(a.p, b.p))
    .slice(0, 3)
    .map((x) => x.p);
}

export function postView(slug: string): string {
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return notFoundView();
  const related = relatedPosts(post);
  const relatedHtml = related.length
    ? `<section class="related"><h2>関連する感想</h2><div class="post-list">${related.map(postCard).join('')}</div></section>`
    : '';
  return (
    `<article class="post">` +
    `<div class="post-head">` +
    `<div class="post-cover">${coverSvg(post)}</div>` +
    `<div class="post-head-body">` +
    `<p class="kicker">${esc(post.book.title)} ・ ${esc(post.book.author)}</p>` +
    `<h1>${esc(post.title)}</h1>` +
    `<div class="post-rating">${starRating(post.rating)}</div>` +
    `<div class="card-meta"><time>${formatDate(post.date)}</time><span>${readingMinutes(post.body)}分で読めます</span></div>` +
    `<div class="chips">${tagChips(post.tags)}</div>` +
    `</div></div>` +
    `<div class="post-body">${renderMarkdown(post.body)}</div>` +
    relatedHtml +
    `<p class="back"><a href="${toHash({ name: 'home' })}">記事一覧へ戻る</a></p>` +
    `</article>`
  );
}

export function tagView(tag: string): string {
  const list = postsByTag(POSTS, tag).sort(compareByDateDesc);
  const body = list.length
    ? `<div class="post-list">${list.map(postCard).join('')}</div>`
    : `<p class="empty">「${esc(tag)}」の記事はありません。</p>`;
  return `<div class="listing"><h1 class="page-title">タグ: ${esc(tag)}</h1>${body}</div>`;
}

export function searchView(query: string): string {
  const trimmed = query.trim();
  if (!trimmed) {
    return `<div class="listing"><h1 class="page-title">検索</h1><p class="empty">上の検索欄に語を入れてください。</p></div>`;
  }
  const results = searchPosts(POSTS, trimmed);
  const body = results.length
    ? `<div class="post-list">${results.map(postCard).join('')}</div>`
    : `<p class="empty">「${esc(trimmed)}」に一致する感想は見つかりませんでした。</p>`;
  return `<div class="listing"><h1 class="page-title">「${esc(trimmed)}」の検索結果(${results.length}件)</h1>${body}</div>`;
}

export function archiveView(): string {
  const byYear = new Map<string, Post[]>();
  for (const post of sorted()) {
    const year = post.date.slice(0, 4);
    (byYear.get(year) ?? byYear.set(year, []).get(year)!).push(post);
  }
  const sections = [...byYear.entries()]
    .map(([year, posts]) => {
      const items = posts
        .map(
          (p) =>
            `<li><a href="${toHash({ name: 'post', slug: p.slug })}"><time>${formatDate(p.date)}</time><span>${esc(p.title)}</span></a></li>`,
        )
        .join('');
      return `<section class="archive-year"><h2>${year}年</h2><ul class="archive-list">${items}</ul></section>`;
    })
    .join('');
  return `<div class="listing"><h1 class="page-title">アーカイブ</h1>${sections}</div>`;
}

export function aboutView(): string {
  return (
    `<div class="about">` +
    `<h1 class="page-title">このブログについて</h1>` +
    `<p>読んだ本の感想を、静かに書き留めておく場所です。読了直後の熱や、時間をおいて再読したときの心境の変化を、その都度の言葉で残しています。</p>` +
    `<p>評価は5段階ですが、点数そのものより、なぜそう感じたかの方を大切にしています。同じ本でも読む時期によって受け取り方は変わるので、ここでの星は「いまの自分にとっての」目安です。</p>` +
    `<p>感想は主観です。違う読み方があれば、それはそれで歓迎します。</p>` +
    `</div>`
  );
}

export function notFoundView(): string {
  return (
    `<div class="listing"><h1 class="page-title">ページが見つかりません</h1>` +
    `<p class="empty"><a href="${toHash({ name: 'home' })}">記事一覧へ戻る</a></p></div>`
  );
}
