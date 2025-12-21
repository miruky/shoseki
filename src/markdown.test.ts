import { describe, expect, it } from 'vitest';
import { plainTextLength, renderMarkdown } from './markdown';

describe('renderMarkdown', () => {
  it('段落を<p>にする', () => {
    expect(renderMarkdown('こんにちは')).toBe('<p>こんにちは</p>');
  });

  it('空行で段落を分ける', () => {
    expect(renderMarkdown('一段落\n\n二段落')).toBe('<p>一段落</p>\n<p>二段落</p>');
  });

  it('見出しを変換する(#はh2から)', () => {
    expect(renderMarkdown('# 見出し')).toBe('<h2>見出し</h2>');
    expect(renderMarkdown('## 小見出し')).toBe('<h3>小見出し</h3>');
  });

  it('引用と箇条書き', () => {
    expect(renderMarkdown('> 引用文')).toBe('<blockquote>引用文</blockquote>');
    expect(renderMarkdown('- 一\n- 二')).toBe('<ul><li>一</li><li>二</li></ul>');
  });

  it('強調とリンク', () => {
    expect(renderMarkdown('**太字**と*斜体*')).toBe('<p><strong>太字</strong>と<em>斜体</em></p>');
    expect(renderMarkdown('[名前](https://example.com)')).toContain(
      '<a href="https://example.com" rel="noopener">名前</a>',
    );
  });

  it('HTMLをエスケープする', () => {
    expect(renderMarkdown('<script>')).toBe('<p>&lt;script&gt;</p>');
  });

  it('javascriptリンクは無効化する', () => {
    expect(renderMarkdown('[x](javascript:alert(1))')).toContain('href="#"');
  });
});

describe('plainTextLength', () => {
  it('記法を除いた文字数を数える', () => {
    expect(plainTextLength('# 見出し')).toBe(3);
    expect(plainTextLength('**太字**')).toBe(2);
  });
});
