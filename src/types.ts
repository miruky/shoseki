export interface Book {
  title: string;
  author: string;
}

export interface Post {
  slug: string;
  title: string;
  book: Book;
  rating: number; // 1〜5、0.5刻み
  date: string; // ISO形式 yyyy-mm-dd
  tags: string[];
  excerpt: string;
  body: string; // 軽量マークダウン
  cover: string; // 表紙SVGの基調色(16進)
}
