import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  variant?: 'light' | 'dark';
}

// Inline token renderer for bold, italic, code, links
export const renderInlineText = (text: string, variant: 'light' | 'dark' = 'light'): React.ReactNode[] => {
  if (!text) return [];

  // Match: code (`...`), link ([...](...)), bold-italic (***...***), bold (**...**), italic (*...*)
  const regex = /(`[^`]+`|\[[^\]]+\]\([^)]+\)|\*\*\*[^*]+\*\*\*|___[^_]+___|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Inline Code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      const code = part.slice(1, -1);
      return (
        <code
          key={index}
          className={`px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold border mx-0.5 ${
            variant === 'dark'
              ? 'bg-slate-800 text-amber-300 border-slate-700'
              : 'bg-slate-100 text-slate-900 border-slate-300/80'
          }`}
        >
          {code}
        </code>
      );
    }

    // Link: [label](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      return (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`font-semibold underline transition-colors ${
            variant === 'dark'
              ? 'text-amber-300 hover:text-amber-200'
              : 'text-amber-700 hover:text-amber-900'
          }`}
        >
          {label}
        </a>
      );
    }

    // Bold-Italic: ***text*** or ___text___
    if (
      (part.startsWith('***') && part.endsWith('***') && part.length >= 6) ||
      (part.startsWith('___') && part.endsWith('___') && part.length >= 6)
    ) {
      const inner = part.slice(3, -3);
      return (
        <strong
          key={index}
          className={`font-bold italic ${variant === 'dark' ? 'text-white' : 'text-slate-950'}`}
        >
          {renderInlineText(inner, variant)}
        </strong>
      );
    }

    // Bold: **text** or __text__
    if (
      (part.startsWith('**') && part.endsWith('**') && part.length >= 4) ||
      (part.startsWith('__') && part.endsWith('__') && part.length >= 4)
    ) {
      const inner = part.slice(2, -2);
      return (
        <strong
          key={index}
          className={`font-bold ${variant === 'dark' ? 'text-white font-extrabold' : 'text-slate-950 font-bold'}`}
        >
          {renderInlineText(inner, variant)}
        </strong>
      );
    }

    // Italic: *text* or _text_
    if (
      (part.startsWith('*') && part.endsWith('*') && part.length >= 2) ||
      (part.startsWith('_') && part.endsWith('_') && part.length >= 2)
    ) {
      const inner = part.slice(1, -1);
      return (
        <em
          key={index}
          className={`italic ${variant === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}
        >
          {renderInlineText(inner, variant)}
        </em>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

// Code block with ChatGPT-style header and Copy button
const CodeBlock: React.FC<{ language: string; code: string }> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-lg overflow-hidden border border-slate-700/80 bg-slate-950 text-slate-200 text-xs shadow-md">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-amber-400" />
          <span className="uppercase font-semibold tracking-wider">{language || 'code'}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800 hover:text-white transition-colors cursor-pointer text-[10px]"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto font-mono text-[11px] leading-relaxed text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
  variant = 'light'
}) => {
  if (!content) return null;

  // Split into lines for block-level parsing
  const rawLines = content.replace(/\r\n/g, '\n').split('\n');
  const elements: React.ReactNode[] = [];

  let i = 0;
  while (i < rawLines.length) {
    const line = rawLines[i];

    // 1. Code Block: ```lang
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < rawLines.length && !rawLines[i].trim().startsWith('```')) {
        codeLines.push(rawLines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <CodeBlock key={`code-${i}`} language={lang} code={codeLines.join('\n')} />
      );
      continue;
    }

    // 2. Headings: #, ##, ###, ####, #####, ######
    const headingMatch = line.match(/^(#{1,6})\s*(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      // Strip any trailing hashtags
      const headingText = headingMatch[2].replace(/\s*#+$/, '').trim();

      if (level === 1) {
        elements.push(
          <h1
            key={`h1-${i}`}
            className={`text-base sm:text-lg font-black tracking-tight mt-3 mb-2 pb-1.5 border-b flex items-center gap-2 ${
              variant === 'dark'
                ? 'text-white border-slate-700'
                : 'text-slate-900 border-slate-200'
            }`}
          >
            {renderInlineText(headingText, variant)}
          </h1>
        );
      } else if (level === 2) {
        elements.push(
          <h2
            key={`h2-${i}`}
            className={`text-sm sm:text-base font-bold tracking-tight mt-3 mb-1.5 flex items-center gap-1.5 ${
              variant === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            {renderInlineText(headingText, variant)}
          </h2>
        );
      } else if (level === 3) {
        elements.push(
          <h3
            key={`h3-${i}`}
            className={`text-xs sm:text-sm font-bold tracking-tight mt-2.5 mb-1.5 flex items-center gap-2 ${
              variant === 'dark' ? 'text-amber-400' : 'text-slate-900'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            <span>{renderInlineText(headingText, variant)}</span>
          </h3>
        );
      } else {
        // level 4, 5, 6
        elements.push(
          <h4
            key={`h4-${i}`}
            className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider font-mono mt-2.5 mb-1 flex items-center gap-1.5 ${
              variant === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            <span className="w-1 h-1 rounded-xs bg-slate-400 shrink-0" />
            <span>{renderInlineText(headingText, variant)}</span>
          </h4>
        );
      }
      i++;
      continue;
    }

    // 3. Horizontal Rule: ---, ***, ___
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(line.trim())) {
      elements.push(
        <hr
          key={`hr-${i}`}
          className={`my-3 border-t ${variant === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}
        />
      );
      i++;
      continue;
    }

    // 4. Blockquote: > text
    if (line.trim().startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < rawLines.length && rawLines[i].trim().startsWith('>')) {
        quoteLines.push(rawLines[i].replace(/^>\s?/, ''));
        i++;
      }
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className={`border-l-3 border-amber-500 pl-3 py-1.5 my-2.5 rounded-r-lg text-xs italic space-y-1 ${
            variant === 'dark'
              ? 'bg-slate-800/60 text-slate-200'
              : 'bg-amber-50/60 text-slate-800'
          }`}
        >
          {quoteLines.map((ql, qIdx) => (
            <p key={qIdx} className="leading-relaxed">
              {renderInlineText(ql, variant)}
            </p>
          ))}
        </blockquote>
      );
      continue;
    }

    // 5. Table: | col1 | col2 | ...
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const tableLines: string[] = [];
      while (i < rawLines.length && rawLines[i].trim().startsWith('|') && rawLines[i].trim().endsWith('|')) {
        tableLines.push(rawLines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerRow = tableLines[0]
          .slice(1, -1)
          .split('|')
          .map(cell => cell.trim());

        // Check if second row is divider |---|---|
        const isDivider = /^(\|\s*:?-+:?\s*)+\|$/.test(tableLines[1]);
        const bodyRows = tableLines.slice(isDivider ? 2 : 1).map(row =>
          row
            .slice(1, -1)
            .split('|')
            .map(cell => cell.trim())
        );

        elements.push(
          <div
            key={`table-${i}`}
            className={`my-2.5 overflow-x-auto rounded-lg border shadow-2xs ${
              variant === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'
            }`}
          >
            <table className="w-full text-left border-collapse text-xs">
              <thead className={variant === 'dark' ? 'bg-slate-800/90 border-b border-slate-700' : 'bg-slate-100/80 border-b border-slate-200'}>
                <tr>
                  {headerRow.map((h, hIdx) => (
                    <th
                      key={hIdx}
                      className={`py-2 px-3 font-bold font-mono text-[11px] uppercase tracking-wider ${
                        variant === 'dark' ? 'text-slate-300' : 'text-slate-800'
                      }`}
                    >
                      {renderInlineText(h, variant)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${variant === 'dark' ? 'divide-slate-800 bg-slate-900' : 'divide-slate-100 bg-white'}`}>
                {bodyRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className={variant === 'dark' ? 'hover:bg-slate-800/50 transition-colors' : 'hover:bg-slate-50/60 transition-colors'}
                  >
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className={`py-2 px-3 text-xs ${variant === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}
                      >
                        {renderInlineText(cell, variant)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // 6. Unordered List: - item, * item, + item
    if (/^\s*[-*+]\s+/.test(line)) {
      const listItems: string[] = [];
      while (i < rawLines.length && /^\s*[-*+]\s+/.test(rawLines[i])) {
        const itemText = rawLines[i].replace(/^\s*[-*+]\s+/, '').trim();
        listItems.push(itemText);
        i++;
      }

      elements.push(
        <ul key={`ul-${i}`} className="space-y-1.5 my-2 pl-1.5 list-none">
          {listItems.map((item, itemIdx) => (
            <li
              key={itemIdx}
              className={`flex items-start gap-2.5 text-xs leading-relaxed ${
                variant === 'dark' ? 'text-slate-200' : 'text-slate-800'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5 shadow-xs" />
              <div className="flex-1">{renderInlineText(item, variant)}</div>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 7. Ordered List: 1. item, 2. item
    if (/^\s*\d+\.\s+/.test(line)) {
      const listItems: { num: string; text: string }[] = [];
      while (i < rawLines.length && /^\s*\d+\.\s+/.test(rawLines[i])) {
        const match = rawLines[i].match(/^\s*(\d+)\.\s+(.+)$/);
        if (match) {
          listItems.push({ num: match[1], text: match[2].trim() });
        }
        i++;
      }

      elements.push(
        <ol key={`ol-${i}`} className="space-y-1.5 my-2 pl-1 list-none">
          {listItems.map((item, itemIdx) => (
            <li
              key={itemIdx}
              className={`flex items-start gap-2.5 text-xs leading-relaxed ${
                variant === 'dark' ? 'text-slate-200' : 'text-slate-800'
              }`}
            >
              <span
                className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold font-mono shrink-0 mt-0.5 ${
                  variant === 'dark'
                    ? 'bg-slate-800 text-amber-300 border border-slate-700'
                    : 'bg-slate-200 text-slate-800'
                }`}
              >
                {item.num}
              </span>
              <div className="flex-1">{renderInlineText(item.text, variant)}</div>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 8. Empty lines
    if (!line.trim()) {
      i++;
      continue;
    }

    // 9. Regular Paragraph
    const paragraphLines: string[] = [];
    while (
      i < rawLines.length &&
      rawLines[i].trim() &&
      !rawLines[i].match(/^(#{1,6})\s*(.+)$/) &&
      !rawLines[i].trim().startsWith('```') &&
      !rawLines[i].trim().startsWith('>') &&
      !/^\s*[-*+]\s+/.test(rawLines[i]) &&
      !/^\s*\d+\.\s+/.test(rawLines[i]) &&
      !(rawLines[i].trim().startsWith('|') && rawLines[i].trim().endsWith('|'))
    ) {
      paragraphLines.push(rawLines[i]);
      i++;
    }

    elements.push(
      <p
        key={`p-${i}`}
        className={`my-2 text-xs leading-relaxed ${
          variant === 'dark' ? 'text-slate-200' : 'text-slate-800'
        }`}
      >
        {paragraphLines.map((pl, plIdx) => (
          <React.Fragment key={plIdx}>
            {renderInlineText(pl, variant)}
            {plIdx < paragraphLines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    );
  }

  return <div className={`markdown-content space-y-1.5 ${className}`}>{elements}</div>;
};
