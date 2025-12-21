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
export function coverSvg(post: Post): string {
  const initial = post.book.title.slice(0, 1);
  return (
    `<svg class="cover" viewBox="0 0 120 160" role="img" aria-label="${escapeAttr(post.book.title)}の表紙">` +
    `<rect x="0" y="0" width="120" height="160" rx="6" fill="${post.cover}"/>` +
    `<rect x="10" y="10" width="100" height="140" rx="3" fill="none" stroke="rgba(255,255,255,0.4)"/>` +
    `<line x1="14" y1="10" x2="14" y2="150" stroke="rgba(0,0,0,0.18)" stroke-width="3"/>` +
    `<text x="64" y="92" text-anchor="middle" font-size="46" fill="rgba(255,255,255,0.92)" font-family="serif">${escapeText(initial)}</text>` +
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

export const LEAF_ICON =
  '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20C6 20 4 15 4 11 4 6 8 4 13 4c4 0 7 0 7 0s0 9-5 13c-2 1.6-4 1.4-4 1.4"/><path d="M11 20c0-5 2-9 6-12"/></svg>';
