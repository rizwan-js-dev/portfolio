"use client";

import { useEffect, useRef, useState } from "react";

// Every project demo is drawn on a fixed-width stage that is scaled to fit its container.
export const STAGE_W = 560;
export const STAGE_H = 320;

// Scales the stage to its container, and reports whether it is on screen and whether
// motion should be reduced.
export function useStage() {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / STAGE_W));
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => setReduced(mq.matches);
    onMq();
    mq.addEventListener("change", onMq);
    return () => {
      ro.disconnect();
      io.disconnect();
      mq.removeEventListener("change", onMq);
    };
  }, []);

  return { ref, scale, visible, reduced };
}

// ---- Scripted demos ----------------------------------------------------------------
// A demo is a list of steps. Each step waits `dur` ms and patches the previous state;
// `click` marks a step where the cursor clicks, `still` marks the frame shown when the
// viewer prefers reduced motion.

export type ScriptStep<S> = { dur: number; f: (s: S) => Partial<S>; click?: boolean; still?: boolean };
export type Frame<S> = S & { click: number | null };

export function compileScript<S extends object>(initial: S, steps: ScriptStep<S>[]) {
  const frames: Frame<S>[] = [];
  steps.forEach((st, i) => {
    const prev: S = i === 0 ? initial : frames[i - 1];
    frames.push({ ...prev, ...st.f(prev), click: st.click ? i : null });
  });
  return {
    frames,
    durations: steps.map((s) => s.dur),
    still: Math.max(0, steps.findIndex((s) => s.still)),
  };
}

// Plays through `durations` on a loop while `running`, returning the current step.
export function useStepper(durations: number[], running: boolean) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setI((n) => (n + 1) % durations.length), durations[i]);
    return () => clearTimeout(t);
  }, [i, running, durations]);

  return i;
}
