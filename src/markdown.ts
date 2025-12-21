// 軽量マークダウンをHTMLに変換する。対応するのは見出し・段落・引用・
// 箇条書き・強調・リンクのみ。本文をデータとして書きやすくするための最小実装。

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// インライン記法。エスケープ済みの文字列に対して適用する。
function inline(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label: string, href: string) => {
      const safe = /^https?:\/\//.test(href) ? href : '#';
      return `<a href="${escapeHtml(safe)}" rel="noopener">${label}</a>`;
    });
}

export function renderMarkdown(source: string): string {
  const blocks = source.split(/\n{2,}/);
  const html: string[] = [];

  for (const block of blocks) {
    const lines = block.split('\n');
    const first = lines[0] ?? '';

    const heading = /^(#{1,3})\s+(.*)$/.exec(first);
    if (heading && lines.length === 1) {
      const level = heading[1]!.length + 1; // h2〜h4を使う
      html.push(`<h${level}>${inline(escapeHtml(heading[2]!))}</h${level}>`);
      continue;
    }

    if (lines.every((l) => /^>\s?/.test(l))) {
      const inner = lines.map((l) => inline(escapeHtml(l.replace(/^>\s?/, '')))).join('<br>');
      html.push(`<blockquote>${inner}</blockquote>`);
      continue;
    }

    if (lines.every((l) => /^[-*]\s+/.test(l))) {
      const items = lines
        .map((l) => `<li>${inline(escapeHtml(l.replace(/^[-*]\s+/, '')))}</li>`)
        .join('');
      html.push(`<ul>${items}</ul>`);
      continue;
    }

    const paragraph = lines.map((l) => inline(escapeHtml(l))).join('<br>');
    html.push(`<p>${paragraph}</p>`);
  }

  return html.join('\n');
}

// 本文から記法を除いたおおよその文字数。読了時間の見積もりに使う。
export function plainTextLength(source: string): number {
  return source
    .replace(/[#>*-]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s/g, '').length;
}
