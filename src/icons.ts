import type { Post } from './types';

const STAR = 'M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 15l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z';
const STAR_W = 20;

// 0.5刻みの評価を、塗り部分をクリップで表現した星のSVGにする。
export function starRating(rating: number): string {
  const total = 5;
  const width = STAR_W * total;
  const fillW = (Math.max(0, Math.min(total, rating)) / total) * width;
  const stars = (cls: string) =>
    Array.from({ length: total }, (_, i) => `<path class="${cls}" d="${STAR}" transform="translate(${i * STAR_W} 0)"/>`).join('');
  const clipId = `star-clip-${Math.round(rating * 10)}`;
  return (
    `<svg class="stars" viewBox="0 0 ${width} ${STAR_W}" width="${width}" height="${STAR_W}" ` +
    `role="img" aria-label="5段階で${rating}">` +
    `<defs><clipPath id="${clipId}"><rect x="0" y="0" width="${fillW}" height="${STAR_W}"/></clipPath></defs>` +
    `<g class="star-empty">${stars('star-bg')}</g>` +
    `<g clip-path="url(#${clipId})">${stars('star-fg')}</g>` +
    `</svg>`
  );
}

// 本文や画像を持たないので、基調色と書名から表紙を手続きで描く。
// 陰影のグラデーション・背の溝・明朝体のイニシャルで、平板な四角に見えないようにする。
export function coverSvg(post: Post): string {
  const initial = post.book.title.slice(0, 1);
  // 1ページに複数の表紙が並ぶため、グラデーションidを書名から一意にする
  let h = 0;
  for (let i = 0; i < post.slug.length; i += 1) h = (h * 31 + post.slug.charCodeAt(i)) >>> 0;
  const gid = `cov${h.toString(36)}`;
  return (
    `<svg class="cover" viewBox="0 0 120 168" role="img" aria-label="${escapeAttr(post.book.title)}の表紙">` +
    `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="#ffffff" stop-opacity="0.18"/>` +
    `<stop offset="0.45" stop-color="#ffffff" stop-opacity="0"/>` +
    `<stop offset="1" stop-color="#000000" stop-opacity="0.24"/>` +
    `</linearGradient></defs>` +
    `<rect x="0" y="0" width="120" height="168" rx="4" fill="${post.cover}"/>` +
    `<rect x="0" y="0" width="120" height="168" rx="4" fill="url(#${gid})"/>` +
    `<rect x="8.5" y="8.5" width="103" height="151" rx="2" fill="none" stroke="rgba(255,255,255,0.34)"/>` +
    `<line x1="13" y1="9" x2="13" y2="159" stroke="rgba(0,0,0,0.16)" stroke-width="2"/>` +
    `<text x="65" y="88" text-anchor="middle" font-size="42" fill="rgba(255,255,255,0.94)" font-family="'Hiragino Mincho ProN', 'Noto Serif JP', serif">${escapeText(initial)}</text>` +
    `<line x1="46" y1="106" x2="84" y2="106" stroke="rgba(255,255,255,0.45)" stroke-width="1"/>` +
    `</svg>`
  );
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function escapeText(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const NAV_SEARCH_ICON =
  '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>';

// お気に入りトグルのハート。未登録は線画、登録済みは .active で塗る(CSS側)。
export const HEART_ICON =
  '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.3 4.2 12.6a4.6 4.6 0 0 1 0-6.5 4.4 4.4 0 0 1 6.3 0l1.5 1.5 1.5-1.5a4.4 4.4 0 0 1 6.3 0 4.6 4.6 0 0 1 0 6.5z"/></svg>';

// 記事の共有(リンクをコピー)ボタンに添える鎖のアイコン。
export const LINK_ICON =
  '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14a4 4 0 0 0 6 .5l2.5-2.5a4 4 0 0 0-5.7-5.7L10.4 7.7"/><path d="M15 10a4 4 0 0 0-6-.5L6.5 12a4 4 0 0 0 5.7 5.7l1.4-1.4"/></svg>';

export const LEAF_ICON =
  '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20C6 20 4 15 4 11 4 6 8 4 13 4c4 0 7 0 7 0s0 9-5 13c-2 1.6-4 1.4-4 1.4"/><path d="M11 20c0-5 2-9 6-12"/></svg>';

// 空状態に添える、開いた本のアイコン。
export const EMPTY_ICON =
  '<svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M24 13c-3-2-7-3-11-3-2 0-4 .2-5.5.6v26c1.5-.4 3.5-.6 5.5-.6 4 0 8 1 11 3"/><path d="M24 13c3-2 7-3 11-3 2 0 4 .2 5.5.6v26c-1.5-.4-3.5-.6-5.5-.6-4 0-8 1-11 3"/><path d="M24 13v26"/></svg>';

// テーマ切替ボタンのアイコン(自動・ライト・ダーク)。currentColorで描く。
export const THEME_ICONS: Record<'auto' | 'light' | 'dark', string> = {
  auto: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" stroke="none"/></svg>',
  light:
    '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M21.5 12h-2.4M4.9 12H2.5M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7M18.4 18.4l-1.7-1.7M7.3 7.3 5.6 5.6"/></svg>',
  dark: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4 7 7 0 1 0 20 14.5z"/></svg>',
};
