import './style.css';
import { LEAF_ICON, NAV_SEARCH_ICON } from './icons';
import { parseRoute, toHash, type Route } from './router';
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

app.innerHTML = `
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
    </div>
  </header>
  <main id="content" class="content"></main>
  <footer class="site-footer">
    <p>しょせき ・ 読んだ本の感想を書き留める場所</p>
  </footer>
`;

const content = app.querySelector<HTMLElement>('#content')!;
const form = app.querySelector<HTMLFormElement>('#search-form')!;
const searchInput = app.querySelector<HTMLInputElement>('#search-input')!;

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

function render(): void {
  const route = parseRoute(location.hash);
  content.innerHTML = viewFor(route);
  setActiveNav(route);
  if (route.name === 'search') searchInput.value = route.query;
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();
