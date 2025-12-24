import { compareByDateDesc, formatDate, readingMinutes } from './format';
import { coverSvg, EMPTY_ICON, starRating } from './icons';
import { renderMarkdown } from './markdown';
import { adjacentPosts } from './navigation';
import { POSTS } from './posts';
import { toHash } from './router';
import { postsByTag, searchPosts, tagCounts } from './search';
import type { Post } from './types';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// 検索ヒットなし・空のタグ・未検出ページで共通して使う空状態。
function emptyBlock(message: string, extra = ''): string {
  return (
    `<div class="empty-state">` +
    `<span class="empty-state-art" aria-hidden="true">${EMPTY_ICON}</span>` +
    `<p class="empty-state-text">${message}</p>` +
    extra +
    `</div>`
  );
}

const sorted = (): Post[] => [...POSTS].sort(compareByDateDesc);

// フリー写真(Lorem Picsum)をグレースケールで敷き、緑のティントを重ねて
// どんな写真でも基調になじむヒーローにする。視差はmotion層が付ける。
function heroHome(): string {
  return (
    `<section class="hero" data-parallax-scope>` +
    `<div class="hero-media">` +
    `<img class="hero-img" data-parallax="0.16" src="https://picsum.photos/seed/shoseki-shelf/1600/1000?grayscale" alt="" loading="lazy" width="1600" height="1000" />` +
    `<span class="hero-tint" aria-hidden="true"></span>` +
    `</div>` +
    `<div class="hero-inner">` +
    `<p class="kicker">読書の記録</p>` +
    `<h1 class="hero-title">しょせき</h1>` +
    `<p class="hero-lede">読んだ本の感想を、静かに書き留めておく場所。読了直後の熱と、再読でほどけていく心境を、その都度の言葉で。</p>` +
    `</div>` +
    `</section>`
  );
}

// 書籍カバーが横に流れる帯(マーキー)。装飾なので aria-hidden。
// 同じ並びを2つ繋げ、-50%平行移動でシームレスにループさせる。
function coverMarquee(): string {
  const posts = sorted();
  if (posts.length === 0) return '';
  const base = Array.from({ length: 4 }, () => posts).flat();
  const half = base
    .map(
      (p) =>
        `<a class="marquee-item" href="${toHash({ name: 'post', slug: p.slug })}" tabindex="-1">${coverSvg(p)}</a>`,
    )
    .join('');
  return `<div class="marquee" aria-hidden="true"><div class="marquee-track">${half}${half}</div></div>`;
}

function postHero(slug: string): string {
  const seed = encodeURIComponent(slug);
  return (
    `<div class="post-hero" data-parallax-scope>` +
    `<img class="post-hero-img" data-parallax="0.14" src="https://picsum.photos/seed/${seed}/1600/760?grayscale" alt="" loading="lazy" width="1600" height="760" />` +
    `<span class="hero-tint" aria-hidden="true"></span>` +
    `</div>`
  );
}

function tagChips(tags: string[]): string {
  return tags
    .map((t) => `<a class="chip" href="${toHash({ name: 'tag', tag: t })}">${esc(t)}</a>`)
    .join('');
}

function postCard(post: Post, index = 0): string {
  // 一覧で少しずつ立ち上げるためのスタッガ用ディレイ
  const delay = `style="animation-delay:${Math.min(index, 9) * 55}ms"`;
  return (
    `<article class="card" data-reveal ${delay}>` +
    `<a class="card-cover" href="${toHash({ name: 'post', slug: post.slug })}" tabindex="-1" aria-hidden="true">${coverSvg(post)}</a>` +
    `<div class="card-body">` +
    `<h3 class="card-title"><a href="${toHash({ name: 'post', slug: post.slug })}">${esc(post.title)}</a></h3>` +
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
  if (!featured) return emptyBlock('まだ感想がありません。');
  return (
    `<div class="home">` +
    heroHome() +
    coverMarquee() +
    `<section class="featured" data-reveal aria-labelledby="featured-title">` +
    `<a class="featured-cover" href="${toHash({ name: 'post', slug: featured.slug })}" tabindex="-1" aria-hidden="true">${coverSvg(featured)}</a>` +
    `<div class="featured-body">` +
    `<p class="kicker">最新の感想</p>` +
    `<h2 class="featured-title" id="featured-title"><a href="${toHash({ name: 'post', slug: featured.slug })}">${esc(featured.title)}</a></h2>` +
    `<p class="featured-book">${esc(featured.book.title)} ・ ${esc(featured.book.author)}</p>` +
    `<div>${starRating(featured.rating)}</div>` +
    `<p class="featured-excerpt">${esc(featured.excerpt)}</p>` +
    `<div class="card-meta"><time>${formatDate(featured.date)}</time></div>` +
    `</div></section>` +
    `<div class="home-grid">` +
    `<div class="post-list">${rest.map((p, i) => postCard(p, i)).join('')}</div>` +
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

function postNav(slug: string): string {
  const { newer, older } = adjacentPosts(POSTS, slug);
  const link = (post: Post | null, dir: 'older' | 'newer'): string => {
    if (!post) return `<span class="post-nav-slot"></span>`;
    const label = dir === 'newer' ? '新しい感想' : '古い感想';
    return (
      `<a class="post-nav-slot post-nav-${dir}" href="${toHash({ name: 'post', slug: post.slug })}">` +
      `<span class="post-nav-dir">${label}</span>` +
      `<span class="post-nav-title">${esc(post.title)}</span>` +
      `</a>`
    );
  };
  if (!newer && !older) return '';
  return `<nav class="post-nav" aria-label="前後の感想">${link(older, 'older')}${link(newer, 'newer')}</nav>`;
}

export function postView(slug: string): string {
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return notFoundView();
  const related = relatedPosts(post);
  const relatedHtml = related.length
    ? `<section class="related"><h2>関連する感想</h2><div class="post-list">${related.map((p, i) => postCard(p, i)).join('')}</div></section>`
    : '';
  return (
    `<article class="post">` +
    postHero(post.slug) +
    `<div class="post-head" data-reveal>` +
    `<div class="post-cover">${coverSvg(post)}</div>` +
    `<div class="post-head-body">` +
    `<p class="kicker">${esc(post.book.title)} ・ ${esc(post.book.author)}</p>` +
    `<h1>${esc(post.title)}</h1>` +
    `<div class="post-rating">${starRating(post.rating)}</div>` +
    `<div class="card-meta"><time>${formatDate(post.date)}</time><span>${readingMinutes(post.body)}分で読めます</span></div>` +
    `<div class="chips">${tagChips(post.tags)}</div>` +
    `</div></div>` +
    `<div class="post-body">${renderMarkdown(post.body)}</div>` +
    postNav(slug) +
    relatedHtml +
    `<p class="back"><a href="${toHash({ name: 'home' })}">記事一覧へ戻る</a></p>` +
    `</article>`
  );
}

export function tagView(tag: string): string {
  const list = postsByTag(POSTS, tag).sort(compareByDateDesc);
  const body = list.length
    ? `<div class="post-list">${list.map((p, i) => postCard(p, i)).join('')}</div>`
    : emptyBlock(`「${esc(tag)}」の感想はまだありません。`);
  return `<div class="listing"><h1 class="page-title">タグ: ${esc(tag)}</h1>${body}</div>`;
}

export function searchView(query: string): string {
  const trimmed = query.trim();
  if (!trimmed) {
    return `<div class="listing"><h1 class="page-title">検索</h1>${emptyBlock('上の検索欄に、本の名前や感想の言葉を入れてください。')}</div>`;
  }
  const results = searchPosts(POSTS, trimmed);
  const body = results.length
    ? `<div class="post-list">${results.map((p, i) => postCard(p, i)).join('')}</div>`
    : emptyBlock(`「${esc(trimmed)}」に一致する感想は見つかりませんでした。`);
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
    emptyBlock(
      'お探しのページは見つかりませんでした。',
      `<p class="back"><a href="${toHash({ name: 'home' })}">記事一覧へ戻る</a></p>`,
    ) +
    `</div>`
  );
}
