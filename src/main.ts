import './style.css';
import { LEAF_ICON, NAV_SEARCH_ICON, THEME_ICONS } from './icons';
import { pageMeta } from './meta';
import { parseRoute, toHash, type Route } from './router';
import { applyTheme, loadTheme, nextTheme, THEME_LABEL, type ThemeMode } from './theme';
import { initMotion, revealRoute } from './motion';
import {
  aboutView,
  archiveView,
  homeView,
  postView,
  searchView,
  tagView,
} from './view';

const app = document.getElementById('app');
if (!app) throw new Error('#app が見つからない');

let theme: ThemeMode = loadTheme();
applyTheme(theme);

app.innerHTML = `
  <a class="skip-link" href="#content">本文へスキップ</a>
  <div class="reading-progress" hidden aria-hidden="true"><span class="reading-progress-fill"></span></div>
  <header class="site-header">
    <div class="header-inner">
      <a class="brand" href="#/"><span class="brand-mark">${LEAF_ICON}</span><span class="brand-name">しょせき</span></a>
      <nav class="nav">
        <a data-nav="home" href="#/">ホーム</a>
        <a data-nav="archive" href="#/archive">アーカイブ</a>
        <a data-nav="about" href="#/about">について</a>
      </nav>
      <form class="search" id="search-form" role="search">
        <span class="search-icon">${NAV_SEARCH_ICON}</span>
        <input id="search-input" type="search" placeholder="本や感想を検索" aria-label="検索" />
      </form>
      <button class="theme-toggle" id="theme-toggle" type="button"></button>
    </div>
  </header>
  <main id="content" class="content" tabindex="-1"></main>
  <footer class="site-footer">
    <p>しょせき ・ 読んだ本の感想を書き留める場所</p>
  </footer>
`;

const content = app.querySelector<HTMLElement>('#content')!;
const form = app.querySelector<HTMLFormElement>('#search-form')!;
const searchInput = app.querySelector<HTMLInputElement>('#search-input')!;
const themeToggle = app.querySelector<HTMLButtonElement>('#theme-toggle')!;
const progressBar = app.querySelector<HTMLElement>('.reading-progress')!;
const progressFill = app.querySelector<HTMLElement>('.reading-progress-fill')!;

function updateThemeToggle(): void {
  themeToggle.innerHTML = THEME_ICONS[theme];
  const label = `テーマ切替(現在: ${THEME_LABEL[theme]})`;
  themeToggle.setAttribute('aria-label', label);
  themeToggle.title = label;
}

themeToggle.addEventListener('click', () => {
  theme = nextTheme(theme);
  applyTheme(theme);
  updateThemeToggle();
});
updateThemeToggle();

// ハッシュルーターと衝突しないよう、スキップは遷移せずに本文へフォーカスする。
const skipLink = app.querySelector<HTMLAnchorElement>('.skip-link')!;
skipLink.addEventListener('click', (ev) => {
  ev.preventDefault();
  content.focus();
});

// 「/」で検索へ、検索中の Esc で抜ける。
window.addEventListener('keydown', (ev) => {
  const target = ev.target as HTMLElement;
  const typing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
  if (ev.key === '/' && !typing) {
    ev.preventDefault();
    searchInput.focus();
  } else if (ev.key === 'Escape' && target === searchInput) {
    searchInput.blur();
  }
});

form.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const query = searchInput.value.trim();
  location.hash = toHash({ name: 'search', query });
});

function viewFor(route: Route): string {
  switch (route.name) {
    case 'home':
      return homeView();
    case 'post':
      return postView(route.slug);
    case 'tag':
      return tagView(route.tag);
    case 'archive':
      return archiveView();
    case 'about':
      return aboutView();
    case 'search':
      return searchView(route.query);
  }
}

function setActiveNav(route: Route): void {
  app!.querySelectorAll<HTMLElement>('[data-nav]').forEach((el) => {
    el.classList.toggle('active', el.dataset.nav === route.name);
  });
}

// ルートごとに <title> と説明文を差し替え、共有・ブックマークで内容が伝わるようにする。
function setMetaTag(attr: 'name' | 'property', key: string, value: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function applyMeta(route: Route): void {
  const meta = pageMeta(route);
  document.title = meta.title;
  setMetaTag('name', 'description', meta.description);
  setMetaTag('property', 'og:title', meta.title);
  setMetaTag('property', 'og:description', meta.description);
}

// 記事の「リンクをコピー」。クリップボードが使えなければ選択して伝える。
content.addEventListener('click', (ev) => {
  const btn = (ev.target as HTMLElement).closest<HTMLButtonElement>('[data-share]');
  if (!btn) return;
  const label = btn.querySelector('.post-share-label');
  const done = (text: string): void => {
    if (label) label.textContent = text;
    btn.classList.add('copied');
    window.setTimeout(() => {
      if (label) label.textContent = 'リンクをコピー';
      btn.classList.remove('copied');
    }, 1800);
  };
  navigator.clipboard?.writeText(location.href).then(
    () => done('コピーしました'),
    () => done('コピーできませんでした'),
  );
});

// 記事ページでだけ、読み進めた割合をバーで示す。
function updateProgress(route: Route): void {
  if (route.name !== 'post') {
    progressBar.hidden = true;
    return;
  }
  progressBar.hidden = false;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  progressFill.style.width = `${ratio * 100}%`;
}

window.addEventListener('scroll', () => updateProgress(parseRoute(location.hash)), {
  passive: true,
});

function render(): void {
  const route = parseRoute(location.hash);
  content.innerHTML = viewFor(route);
  setActiveNav(route);
  applyMeta(route);
  if (route.name === 'search') searchInput.value = route.query;
  revealRoute(content);
  updateProgress(route);
}

window.addEventListener('hashchange', render);
initMotion();
render();
