import { faq } from '@/content/site';

/** Word-wraps a line to a fixed column, the way the reference's FAQ.md reads. */
function wrap(text: string, max: number) {
  const out: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    if (line && (line + ' ' + word).length > max) {
      out.push(line);
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  if (line) out.push(line);
  return out;
}

type Line = { t: string; kind: 'h' | 'p' | 'rule' | 'blank' };

function buildLines(): Line[] {
  const lines: Line[] = [];
  faq.forEach((f, i) => {
    if (i) lines.push({ t: '', kind: 'blank' }, { t: '---', kind: 'rule' }, { t: '', kind: 'blank' });
    wrap(`# ${f.q}`, 30).forEach((t) => lines.push({ t, kind: 'h' }));
    lines.push({ t: '', kind: 'blank' });
    wrap(f.a, 32).forEach((t) => lines.push({ t, kind: 'p' }));
  });
  return lines;
}

const LINES = buildLines();

/** FAQ.md as a code editor: line numbers, mono text, markdown headings, its own scroll. */
export default function FaqEditor() {
  return (
    <div className="h-full overflow-y-auto overscroll-contain bg-[#f3f2f0] py-3 pr-4" data-lenis-prevent>
      <ol className="font-mono text-[13px] leading-[18px]">
        {LINES.map((l, i) => (
          <li key={i} className="grid grid-cols-[38px_1fr] gap-3">
            <span className="text-right text-[11px] text-[#b7b3ad] tabular-nums select-none">{i + 1}</span>
            <span className={`whitespace-pre text-red ${l.kind === 'h' ? 'font-semibold' : ''} ${l.kind === 'rule' ? 'text-red/60' : ''}`}>
              {l.t}
              {i === LINES.length - 1 && <span className="ml-0.5 inline-block h-[14px] w-[7px] translate-y-[2px] animate-[caret_1s_steps(1)_infinite] bg-red" />}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
