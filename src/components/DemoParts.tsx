"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { STAGE_H, STAGE_W } from "./useStage";

// Building blocks shared by the animated project demos.

export function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.4L8 12.58l7.3-7.3a1 1 0 011.4 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// Scaled stage inside a framed window, with the phase chips underneath.
// `phase` of -1 highlights no chip (used for the reduced-motion still).
export function DemoFrame({
  stageRef,
  scale,
  ariaLabel,
  phases,
  phase,
  height = STAGE_H,
  children,
}: {
  stageRef: RefObject<HTMLDivElement | null>;
  scale: number | null;
  ariaLabel: string;
  phases: string[];
  phase: number;
  height?: number;
  children: ReactNode;
}) {
  return (
    <figure className="w-full">
      <div
        ref={stageRef}
        className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-2xl shadow-slate-300/40 dark:border-slate-700 dark:bg-slate-950 dark:shadow-black/40"
        style={{ aspectRatio: `${STAGE_W} / ${height}` }}
        role="img"
        aria-label={ariaLabel}
      >
        <div
          className="absolute left-0 top-0 origin-top-left select-none"
          style={{
            width: STAGE_W,
            height,
            transform: `scale(${scale ?? 1})`,
            opacity: scale ? 1 : 0,
          }}
        >
          {children}
        </div>
      </div>

      <figcaption className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
        {phases.map((p, i) => (
          <span
            key={p}
            className={`rounded-full px-3 py-1 font-medium transition-colors duration-300 ${
              phase === i
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
            }`}
          >
            {i + 1}. {p}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

// Browser title bar with an address field.
export function WindowBar({ url }: { url: string }) {
  return (
    <div className="absolute inset-x-0 top-0 flex h-[30px] items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-3 dark:border-slate-800 dark:bg-slate-900">
      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      <span className="mx-auto flex h-[18px] w-[280px] items-center justify-center gap-1 rounded-md bg-white text-[9px] text-slate-500 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700">
        <svg viewBox="0 0 16 16" className="h-2 w-2" fill="currentColor" aria-hidden>
          <path d="M4 7V5a4 4 0 118 0v2h.5A1.5 1.5 0 0114 8.5v5a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 13.5v-5A1.5 1.5 0 013.5 7H4zm2 0h4V5a2 2 0 10-4 0v2z" />
        </svg>
        {url}
      </span>
      <span className="w-[42px]" />
    </div>
  );
}

// Style for switching between full-screen views: the old one fades out, then the new one in.
export const viewFade = (on: boolean) => ({
  opacity: on ? 1 : 0,
  transition: on ? "opacity 260ms ease 160ms" : "opacity 160ms ease",
});

export type CursorTarget = string | { t: string; dx?: number; dy?: number } | { x: number; y: number };

// Mouse pointer that glides to an element marked `data-cursor="<name>"` inside the
// stage (or to fixed stage coordinates). `click` changes on every click to replay
// the ripple; `step` re-measures when the target may have moved. Must be rendered
// inside a full-size child of the stage.
export function Cursor({ target, click, step }: { target: CursorTarget; click: number | null; step: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const placed = useRef(false);
  const key = JSON.stringify(target);

  // Position is written straight to the element right after layout, so the pointer
  // starts moving in the same frame the step changes.
  useLayoutEffect(() => {
    const t: CursorTarget = JSON.parse(key);
    const measure = () => {
      const el = ref.current;
      const stage = el?.parentElement;
      if (!el || !stage) return;
      let x: number;
      let y: number;
      if (typeof t === "object" && "x" in t) {
        ({ x, y } = t);
      } else {
        const spec = typeof t === "string" ? { t } : t;
        const node = stage.querySelector(`[data-cursor="${spec.t}"]`);
        if (!node) return;
        const sr = stage.getBoundingClientRect();
        const k = sr.width / STAGE_W;
        const r = node.getBoundingClientRect();
        x = (r.left + r.width / 2 - sr.left) / k + (spec.dx ?? 0);
        y = (r.top + r.height / 2 - sr.top) / k + (spec.dy ?? 0);
      }
      if (!placed.current) {
        // First placement: appear in position rather than glide in from the corner.
        el.style.transition = "none";
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        void el.offsetWidth;
        el.style.transition = "";
        el.style.opacity = "1";
        placed.current = true;
        return;
      }
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    };
    measure();
    // Measure again once any entering panel has settled.
    const late = setTimeout(measure, 380);
    return () => clearTimeout(late);
  }, [key, click, step]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute left-0 top-0 z-30 opacity-0 [transition:left_600ms_cubic-bezier(0.65,0,0.35,1),top_600ms_cubic-bezier(0.65,0,0.35,1),opacity_200ms]"
    >
      {click !== null && <span key={click} className="builder-click absolute -left-3 -top-3 h-6 w-6 rounded-full border-2 border-blue-500" />}
      <svg width="16" height="16" viewBox="0 0 18 18" className="relative drop-shadow" aria-hidden>
        <path d="M1 1l5.5 15 2.2-6.3L15 7.5z" fill="#0f172a" stroke="white" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// Animates a number toward `value`. Drops instantly when the value goes down (loop reset).
export function CountUp({
  value,
  ms = 800,
  instant,
  format = (v) => Math.round(v).toLocaleString("en-IN"),
}: {
  value: number;
  ms?: number;
  instant?: boolean;
  format?: (v: number) => string;
}) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const start = performance.now();
    const origin = from.current;
    let id = requestAnimationFrame(function tick(now) {
      const p = instant || value < origin ? 1 : Math.min(1, (now - start) / ms);
      const v = origin + (value - origin) * (1 - Math.pow(1 - p, 3));
      from.current = v;
      setShown(v);
      if (p < 1) id = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(id);
  }, [value, ms, instant]);

  return <>{format(shown)}</>;
}

// Types `text` out over `ms`, with a caret while typing.
export function Typewriter({ text, ms = 900, instant, caret = true }: { text: string; ms?: number; instant?: boolean; caret?: boolean }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let id = requestAnimationFrame(function tick(now) {
      const p = instant ? 1 : Math.min(1, (now - start) / ms);
      setN(Math.round(p * text.length));
      if (p < 1) id = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(id);
  }, [text, ms, instant]);

  return (
    <>
      {text.slice(0, n)}
      {caret && n < text.length && <span className="ml-px inline-block h-[1em] w-px translate-y-[0.15em] animate-pulse bg-current" />}
    </>
  );
}
