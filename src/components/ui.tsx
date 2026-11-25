import type { Rich } from '@/content/site';

/** Renders a run of text, setting the `it` parts in the serif italic. */
export function RichText({ value }: { value: Rich }) {
  return (
    <>
      {value.map((s, i) =>
        s.it ? (
          <span key={i} className="it">
            {s.t}
          </span>
        ) : (
          <span key={i}>{s.t}</span>
        ),
      )}
    </>
  );
}

/** Outlined ellipse label, e.g. "Our Process". */
export function Pill({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`it inline-flex items-center justify-center rounded-[50%] border border-current px-[1.6em] py-[0.55em] text-[22px] leading-none whitespace-nowrap ${className}`}>
      {children}
    </span>
  );
}
