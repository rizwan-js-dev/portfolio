"use client";

import { useId } from "react";
import { CheckIcon, CountUp, Cursor, DemoFrame, WindowBar, viewFade, type CursorTarget } from "./DemoParts";
import { compileScript, useStage, useStepper, type ScriptStep } from "./useStage";

// Candidate records the last answer of a one-way interview and submits it; then the
// recruiter's dashboard shows the video moving through processing and scoring, and the
// recruiter opens the generated assessment and shortlists the candidate.

const HEIGHT = 340;

type Status = "uploading" | "processing" | "transcribing" | "scoring" | number;
type S = {
  view: "candidate" | "recruiter";
  cand: "prep" | "rec" | "done" | "sending" | "submitted";
  count: number;
  timer: number;
  timerMs: number;
  parts: number;
  partsMs: number;
  statuses: Record<string, Status>;
  drawer: boolean;
  shortlisted: boolean;
  hover: string | null;
  toast: string | null;
  cursor: CursorTarget;
  fade: boolean;
  phase: 0 | 1 | 2;
};

const PARTS = 9;
const MAX_SECONDS = 180;

const candidates = [
  { id: "sara", name: "Sara Ahmed", when: "just now", tone: "bg-rose-100 text-rose-700" },
  { id: "daniel", name: "Daniel Roy", when: "2 min ago", tone: "bg-sky-100 text-sky-700" },
  { id: "meera", name: "Meera Iyer", when: "4 min ago", tone: "bg-amber-100 text-amber-700" },
  { id: "kabir", name: "Kabir Singh", when: "9 min ago", tone: "bg-emerald-100 text-emerald-700" },
  { id: "ananya", name: "Ananya Das", when: "14 min ago", tone: "bg-violet-100 text-violet-700" },
  { id: "tom", name: "Tom Walsh", when: "21 min ago", tone: "bg-slate-200 text-slate-700" },
];

const initial: S = {
  view: "candidate",
  cand: "prep",
  count: 3,
  timer: 0,
  timerMs: 0,
  parts: 0,
  partsMs: 0,
  statuses: { sara: "uploading", daniel: "transcribing", meera: "processing", kabir: 4.0, ananya: 3.6, tom: 2.9 },
  drawer: false,
  shortlisted: false,
  hover: null,
  toast: null,
  cursor: { x: 470, y: 250 },
  fade: false,
  phase: 0,
};

const st = (s: S, patch: Record<string, Status>) => ({ statuses: { ...s.statuses, ...patch } });

const steps: ScriptStep<S>[] = [
  { dur: 800, f: () => initial },
  { dur: 700, f: () => ({ count: 2 }) },
  { dur: 700, f: () => ({ count: 1 }) },
  { dur: 2600, f: () => ({ cand: "rec", timer: 94, timerMs: 4300, parts: 7, partsMs: 4300 }) },
  { dur: 1700, f: () => ({ cursor: "stop", hover: "stop" }) },
  { dur: 800, f: () => ({ cand: "done", parts: PARTS, partsMs: 700, hover: null }), click: true },
  { dur: 750, f: () => ({ cursor: "submit", hover: "submit" }) },
  { dur: 700, f: () => ({ cand: "sending", hover: null }), click: true },
  { dur: 1500, f: () => ({ cand: "submitted" }) },
  // Recruiter side: processing runs for several candidates at once.
  { dur: 1100, f: () => ({ view: "recruiter", phase: 1, cursor: { x: 330, y: 318 } }) },
  { dur: 1000, f: (s) => st(s, { sara: "processing", meera: "transcribing" }) },
  { dur: 1000, f: (s) => st(s, { sara: "transcribing", daniel: "scoring" }) },
  { dur: 1000, f: (s) => st(s, { sara: "scoring", daniel: 3.8, meera: "scoring" }) },
  { dur: 1100, f: (s) => st(s, { sara: 4.3 }) },
  { dur: 750, f: () => ({ cursor: { t: "row-sara", dx: -60 }, hover: "row-sara", phase: 2 }) },
  { dur: 2000, f: () => ({ drawer: true, hover: null }), click: true },
  { dur: 700, f: () => ({ cursor: "shortlist", hover: "shortlist" }) },
  { dur: 1800, f: () => ({ shortlisted: true, hover: null, toast: "Sara Ahmed moved to Shortlisted" }), click: true, still: true },
  { dur: 500, f: () => ({ fade: true }) },
];

const { frames, durations, still } = compileScript(initial, steps);

const mmss = (v: number) => {
  const s = Math.round(v);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

// ---- Camera feed ---------------------------------------------------------------------

function WebcamFeed({ talking = false }: { talking?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#c8bfb2]">
      {/* Room, softened like a portrait-mode background */}
      <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full blur-[2.5px]" aria-hidden>
        <defs>
          <linearGradient id={`${id}wall`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e4ddd2" />
            <stop offset="1" stopColor="#b9ae9f" />
          </linearGradient>
        </defs>
        <rect width="320" height="200" fill={`url(#${id}wall)`} />
        <rect x="14" y="18" width="74" height="118" rx="2" fill="#f7f4ee" />
        <path d="M51 18v118M14 77h74" stroke="#d6cdbf" strokeWidth="3" />
        <rect x="0" y="0" width="120" height="200" fill="#fff8ea" opacity="0.25" />
        <rect x="232" y="44" width="80" height="5" fill="#7d5f43" />
        <rect x="232" y="96" width="80" height="5" fill="#7d5f43" />
        {[
          [236, 24, "#6b7f99"],
          [244, 20, "#a3574a"],
          [252, 26, "#c9a35b"],
          [261, 22, "#4f6b5a"],
          [270, 18, "#7d6a8f"],
          [290, 24, "#8f7b62"],
        ].map(([x, h, c]) => (
          <rect key={`a${x}`} x={x as number} y={44 - (h as number)} width="7" height={h as number} fill={c as string} />
        ))}
        {[
          [238, 22, "#b88a5a"],
          [247, 18, "#566f8c"],
          [256, 24, "#8c4b45"],
          [278, 20, "#5f7a63"],
        ].map(([x, h, c]) => (
          <rect key={`b${x}`} x={x as number} y={96 - (h as number)} width="8" height={h as number} fill={c as string} />
        ))}
        <ellipse cx="292" cy="140" rx="20" ry="26" fill="#5c7d4e" />
        <ellipse cx="278" cy="150" rx="12" ry="18" fill="#6f8f5d" />
        <rect x="280" y="160" width="24" height="26" rx="3" fill="#b07a55" />
      </svg>

      {/* Person */}
      <svg
        viewBox="0 0 320 200"
        preserveAspectRatio="xMidYMid slice"
        className={`absolute inset-0 h-full w-full blur-[0.5px] ${talking ? "cam-sway" : ""}`}
        aria-hidden
      >
        <defs>
          <radialGradient id={`${id}skin`} cx="0.42" cy="0.38" r="0.75">
            <stop offset="0" stopColor="#e0b393" />
            <stop offset="0.65" stopColor="#c4916f" />
            <stop offset="1" stopColor="#a47254" />
          </radialGradient>
          <linearGradient id={`${id}top`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a5a6b" />
            <stop offset="1" stopColor="#2c3845" />
          </linearGradient>
        </defs>
        <path d="M122 70c-6 40-4 80 6 104h64c10-24 12-64 6-104-6-26-70-26-76 0z" fill="#241b17" />
        <path d="M84 200c4-40 30-58 76-60 46 2 72 20 76 60z" fill={`url(#${id}top)`} />
        <path d="M147 140l13 18 13-18z" fill="#e9e4dc" />
        <path d="M148 118h24v26c-4 6-20 6-24 0z" fill="#b07d60" />
        <ellipse cx="160" cy="124" rx="13" ry="5" fill="#8a5a42" opacity="0.35" />
        <ellipse cx="129" cy="92" rx="5" ry="8" fill="#c4917a" />
        <ellipse cx="191" cy="92" rx="5" ry="8" fill="#c4917a" />
        <ellipse cx="160" cy="88" rx="31" ry="38" fill={`url(#${id}skin)`} />
        <path d="M128 86c-4-30 10-46 33-46 22 0 36 14 32 44-6-16-18-24-33-24s-26 10-32 26z" fill="#2b211c" />
        <path d="M150 46c10-4 26-2 34 10" stroke="#5a463a" strokeWidth="3" fill="none" opacity="0.45" strokeLinecap="round" />
        <path d="M143.5 80.5c3.5-1.6 8-1.6 11 0M166 80.5c3-1.6 7.5-1.6 11 0" stroke="#3a2a22" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.8" />
        <g className="cam-blink" opacity="0.85">
          <ellipse cx="149" cy="88" rx="2.6" ry="1.5" fill="#2e211b" />
          <ellipse cx="171" cy="88" rx="2.6" ry="1.5" fill="#2e211b" />
        </g>
        <path d="M160 90c-1 6-3 9-1 11" stroke="#9a6a54" strokeWidth="1.2" fill="none" opacity="0.6" strokeLinecap="round" />
        <ellipse cx="146" cy="103" rx="6" ry="3" fill="#d8927f" opacity="0.25" />
        <ellipse cx="174" cy="103" rx="6" ry="3" fill="#d8927f" opacity="0.25" />
        <ellipse cx="160" cy="110" rx="5.5" ry="1.6" fill="#9a5a4e" className={talking ? "cam-talk" : ""} />
      </svg>

      {/* Warm indoor light, lens vignette and sensor grain */}
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(255,214,170,0.18),transparent_60%)] mix-blend-soft-light" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.28))]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.16] mix-blend-overlay" aria-hidden>
        <filter id={`${id}grain`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id}grain)`} />
      </svg>
    </div>
  );
}

function Spinner({ className = "border-current" }: { className?: string }) {
  return <span className={`inline-block h-2 w-2 animate-spin rounded-full border border-t-transparent ${className}`} />;
}

function StatusCell({ status, shortlisted }: { status: Status; shortlisted: boolean }) {
  if (shortlisted)
    return (
      <span className="builder-pop inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[8px] font-medium text-emerald-700 ring-1 ring-emerald-200">
        <CheckIcon className="h-2.5 w-2.5" /> Shortlisted
      </span>
    );
  if (typeof status === "number") return <span className="text-[8.5px] text-slate-500">Assessed</span>;
  const label = { uploading: "Uploading", processing: "Processing video", transcribing: "Transcribing", scoring: "Scoring" }[status];
  return (
    <span key={status} className="builder-pop inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[8px] text-slate-600">
      <Spinner className="border-slate-400" /> {label}
    </span>
  );
}

// ---- Component -----------------------------------------------------------------------

export default function InterviewDemo() {
  const stage = useStage();
  const { reduced } = stage;
  const i = useStepper(durations, stage.visible && !reduced);
  const s = reduced ? frames[still] : frames[i];
  const step = reduced ? still : i;
  const recording = s.cand === "rec";
  const recorded = s.cand === "done" || s.cand === "sending";

  return (
    <DemoFrame
      stageRef={stage.ref}
      scale={stage.scale}
      height={HEIGHT}
      ariaLabel="Animated demo of the one-way video interview platform: a candidate records and submits the final answer, the video uploads in parts, the recruiter dashboard shows it being processed, transcribed and scored, and the recruiter opens the assessment and shortlists the candidate."
      phases={["Candidate records", "Upload & processing", "Auto assessment"]}
      phase={reduced ? -1 : s.phase}
    >
      <div className="absolute inset-0 bg-white transition-opacity duration-500" style={{ opacity: s.fade && !reduced ? 0 : 1 }}>
        {/* ---------------- Candidate view ---------------- */}
        <div className="absolute inset-0 bg-white" style={viewFade(s.view === "candidate")}>
          <WindowBar url="lumenlabs.jobs/interview/7Q2-KM4X" />
          <div className="absolute inset-x-0 top-[30px] flex h-[36px] items-center border-b border-slate-100 px-3">
            <span className="grid h-5 w-5 place-items-center rounded bg-slate-900 text-[9px] font-bold text-white">L</span>
            <span className="ml-1.5 text-[10px] font-semibold text-slate-800">Lumen Labs</span>
            <span className="mx-2 h-3 w-px bg-slate-200" />
            <span className="text-[9px] text-slate-500">Senior Backend Engineer · Video interview</span>
            <span className="ml-auto flex items-center gap-2 text-[8.5px] text-slate-500">
              Question 3 of 3
              <span className="flex gap-0.5">
                <span className="h-1 w-4 rounded-full bg-slate-800" />
                <span className="h-1 w-4 rounded-full bg-slate-800" />
                <span className={`h-1 w-4 rounded-full ${s.cand === "submitted" ? "bg-slate-800" : "bg-slate-300"}`} />
              </span>
            </span>
          </div>

          {s.cand === "submitted" ? (
            <div className="builder-pop absolute inset-x-0 bottom-0 top-[66px] grid place-items-center">
              <div className="w-[300px] text-center">
                <span className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
                  <CheckIcon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-[13px] font-semibold text-slate-900">Your interview has been submitted</p>
                <p className="mt-1 text-[9.5px] leading-relaxed text-slate-500">
                  Thanks, Sara. The Lumen Labs hiring team will review your answers and get back to you within 5 working days.
                </p>
                <p className="mt-3 text-[8.5px] text-slate-400">3 answers · 5m 48s recorded · You can close this tab</p>
              </div>
            </div>
          ) : (
            <>
              {/* Camera */}
              <div className="absolute left-3 top-[78px] h-[200px] w-[322px] overflow-hidden rounded-lg bg-slate-800">
                <WebcamFeed talking={recording} />
                {s.cand === "prep" && (
                  <div className="absolute inset-0 grid place-items-center bg-black/25">
                    <div className="text-center text-white">
                      <p className="text-[9px] font-medium text-white/80">Recording starts in</p>
                      <p key={s.count} className="builder-pop text-[34px] font-semibold leading-none">
                        {s.count}
                      </p>
                    </div>
                  </div>
                )}
                <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
                  {recording && (
                    <span className="flex items-center gap-1 rounded bg-black/55 px-1.5 py-0.5 text-[8.5px] font-medium text-white">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" /> REC
                    </span>
                  )}
                  {recorded && <span className="rounded bg-black/55 px-1.5 py-0.5 text-[8.5px] font-medium text-white">Recorded</span>}
                </div>
                <span className="absolute right-2.5 top-2.5 rounded bg-black/55 px-1.5 py-0.5 font-mono text-[8.5px] tabular-nums text-white">
                  <CountUp value={s.timer} ms={s.timerMs} instant={reduced} format={mmss} />
                </span>
              </div>

              {/* Devices + mic level */}
              <div className="absolute left-3 top-[284px] flex w-[322px] items-center gap-2 text-[8px] text-slate-500">
                <svg viewBox="0 0 16 16" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <rect x="5.5" y="1.5" width="5" height="8" rx="2.5" />
                  <path d="M3 8a5 5 0 0010 0M8 13v2" />
                </svg>
                <span className="flex h-2 items-end gap-[2px]">
                  {[0.5, 0.9, 0.7, 1, 0.6, 0.8, 0.4].map((h, k) => (
                    <span
                      key={k}
                      className={`w-[2px] rounded-full ${recording ? "interview-wave bg-emerald-500" : "bg-slate-300"}`}
                      style={{ height: `${h * 100}%`, animationDelay: `${k * 80}ms` }}
                    />
                  ))}
                </span>
                <span>MacBook Pro Camera · Default microphone</span>
              </div>

              {/* Question panel */}
              <div className="absolute left-[346px] right-3 top-[78px] flex h-[222px] flex-col rounded-lg border border-slate-200 p-3">
                <p className="text-[8px] font-medium uppercase tracking-wider text-slate-400">Question 3</p>
                <p className="mt-1 text-[10.5px] font-semibold leading-snug text-slate-800">
                  How would you scale a video processing pipeline to handle 100+ interviews at the same time?
                </p>
                <p className="mt-2 text-[8px] text-slate-500">Up to 3 min · 1 retake allowed</p>
                <div className="mt-3 border-t border-slate-100 pt-3">
                  {s.cand === "prep" && <p className="text-[8.5px] text-slate-500">Take a moment to think. Recording starts automatically.</p>}
                  {/* Kept mounted during prep so the timer and bar animate from zero. */}
                  <div className={s.cand === "prep" ? "hidden" : ""}>
                    <p className="flex items-center justify-between text-[8.5px]">
                      <span className="flex items-center gap-1 text-slate-600">
                        {recording && <span className="h-1.5 w-1.5 rounded-full bg-red-500" />}
                        {recording ? "Recording" : "Answer recorded"}
                      </span>
                      <span className="font-mono tabular-nums text-slate-500">
                        <CountUp value={s.timer} ms={s.timerMs} instant={reduced} format={mmss} /> / 03:00
                      </span>
                    </p>
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${recording ? "bg-red-500" : "bg-slate-400"}`}
                        style={{ width: `${(s.timer / MAX_SECONDS) * 100}%`, transition: `width ${s.timerMs}ms linear` }}
                      />
                      </div>
                  </div>
                </div>
                <div className="mt-auto flex flex-col gap-1.5">
                  {recording || s.cand === "prep" ? (
                    <span
                      data-cursor="stop"
                      className={`flex h-7 items-center justify-center gap-1.5 rounded-md border text-[9.5px] font-medium transition-colors ${
                        s.hover === "stop" ? "border-slate-400 bg-slate-50 text-slate-800" : "border-slate-300 text-slate-700"
                      } ${s.cand === "prep" ? "opacity-50" : ""}`}
                    >
                      <span className="h-2 w-2 rounded-[2px] bg-red-500" /> Stop recording
                    </span>
                  ) : (
                    <>
                      <span
                        data-cursor="submit"
                        className={`flex h-7 items-center justify-center gap-1.5 rounded-md text-[9.5px] font-medium text-white transition-colors ${
                          s.hover === "submit" ? "bg-blue-700" : "bg-blue-600"
                        }`}
                      >
                        {s.cand === "sending" ? <Spinner className="border-white" /> : "Submit interview"}
                      </span>
                      <span className="flex h-6 items-center justify-center rounded-md border border-slate-200 text-[9px] text-slate-600">Re-record (1 left)</span>
                    </>
                  )}
                </div>
              </div>

              {/* Upload status */}
              <div className="absolute inset-x-3 top-[304px] flex h-[26px] items-center gap-2.5 rounded-md bg-slate-50 px-2.5 ring-1 ring-slate-200">
                <svg viewBox="0 0 16 16" className="h-3 w-3 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M4.5 12.5h-.5a3 3 0 01-.4-6A4.5 4.5 0 0112.4 6 3 3 0 0112 12.5h-.5M8 8v6M6 10l2-2 2 2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[8.5px] text-slate-600">
                  {s.parts >= PARTS ? "Answer saved" : s.parts > 0 ? "Saving your answer securely…" : "Ready to save"}
                </span>
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-slate-700" style={{ width: `${(s.parts / PARTS) * 100}%`, transition: `width ${s.partsMs}ms linear` }} />
                </div>
                <span className="font-mono text-[8px] tabular-nums text-slate-500">
                  part <CountUp value={s.parts} ms={s.partsMs} instant={reduced} /> of {PARTS}
                </span>
              </div>
            </>
          )}
        </div>

        {/* ---------------- Recruiter view ---------------- */}
        <div className="absolute inset-0 bg-white" style={viewFade(s.view === "recruiter")}>
          <WindowBar url="lumenlabs.jobs/admin/jobs/senior-backend" />
          <div className="absolute bottom-0 left-0 top-[30px] w-[108px] border-r border-slate-200 bg-slate-50 px-2 py-3">
            <p className="flex items-center gap-1.5 px-1 text-[9.5px] font-semibold text-slate-800">
              <span className="grid h-4 w-4 place-items-center rounded bg-slate-900 text-[8px] font-bold text-white">L</span> Lumen Labs
            </p>
            <div className="mt-4 space-y-0.5">
              {["Dashboard", "Jobs", "Candidates", "Interviews", "Reports"].map((n) => (
                <p
                  key={n}
                  className={`rounded px-1.5 py-1 text-[9px] ${
                    n === "Candidates" ? "bg-white font-medium text-slate-900 shadow-sm ring-1 ring-slate-200" : "text-slate-500"
                  }`}
                >
                  {n}
                </p>
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 left-[108px] right-0 top-[30px] px-3.5 py-3">
            <p className="text-[8px] text-slate-400">Jobs / Senior Backend Engineer</p>
            <div className="mt-0.5 flex items-center">
              <p className="text-[12px] font-semibold text-slate-900">Candidates</p>
              <span className="ml-auto rounded-md bg-slate-900 px-2 py-1 text-[8.5px] font-medium text-white">Invite candidates</span>
            </div>
            <div className="mt-2 flex gap-3 border-b border-slate-200 text-[8.5px]">
              <span className="border-b-2 border-slate-900 pb-1 font-medium text-slate-900">All 42</span>
              <span className="pb-1 text-slate-500">Assessed 31</span>
              <span className="pb-1 text-slate-500">In progress 11</span>
            </div>
            <div className="mt-2 grid grid-cols-[1.6fr_1fr_1.3fr_0.5fr] px-1.5 text-[7.5px] font-medium uppercase tracking-wider text-slate-400">
              <span>Candidate</span>
              <span>Submitted</span>
              <span>Status</span>
              <span className="text-right">Score</span>
            </div>
            {candidates.map((c) => {
              const status = s.statuses[c.id];
              const scored = typeof status === "number";
              const hovered = s.hover === `row-${c.id}`;
              return (
                <div
                  key={c.id}
                  data-cursor={`row-${c.id}`}
                  className={`grid h-[28px] grid-cols-[1.6fr_1fr_1.3fr_0.5fr] items-center border-b border-slate-100 px-1.5 transition-colors ${
                    hovered || (s.drawer && c.id === "sara") ? "bg-slate-50" : ""
                  } ${c.id === "sara" && scored ? "row-flash" : ""}`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className={`grid h-4 w-4 place-items-center rounded-full text-[6.5px] font-semibold ${c.tone}`}>
                      {c.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                    <span className="text-[9px] font-medium text-slate-800">{c.name}</span>
                  </span>
                  <span className="text-[8.5px] text-slate-500">{c.when}</span>
                  <span>
                    <StatusCell status={status} shortlisted={c.id === "sara" && s.shortlisted} />
                  </span>
                  <span className="text-right text-[9px] font-semibold tabular-nums text-slate-800">{scored ? status.toFixed(1) : "—"}</span>
                </div>
              );
            })}
          </div>

          {/* Candidate drawer */}
          <div
            className="absolute bottom-0 right-0 top-[30px] flex w-[258px] flex-col border-l border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/20"
            style={{ transform: `translateX(${s.drawer ? 0 : 105}%)`, transition: "transform 380ms cubic-bezier(0.2, 0.8, 0.2, 1)" }}
          >
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-rose-100 text-[9px] font-semibold text-rose-700">SA</span>
              <div>
                <p className="text-[11px] font-semibold text-slate-900">Sara Ahmed</p>
                <p className="text-[8px] text-slate-500">Submitted just now · 5m 48s</p>
              </div>
              <span className="ml-auto text-[11px] text-slate-400">×</span>
            </div>

            <div className="relative mt-2.5 h-[72px] shrink-0 overflow-hidden rounded-md">
              <WebcamFeed />
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-black/50 text-white">
                  <svg viewBox="0 0 16 16" className="ml-0.5 h-3 w-3" fill="currentColor" aria-hidden>
                    <path d="M4 2.5v11l9-5.5z" />
                  </svg>
                </span>
              </span>
              <span className="absolute bottom-1 right-1.5 rounded bg-black/60 px-1 font-mono text-[7.5px] text-white">5:48</span>
            </div>
            <div className="mt-1 flex gap-0.5 text-[7px] text-slate-400">
              {["Q1 · 2:02", "Q2 · 2:12", "Q3 · 1:34"].map((q) => (
                <span key={q} className="flex-1 border-t-2 border-slate-300 pt-0.5">
                  {q}
                </span>
              ))}
            </div>

            <div className="mt-2.5 flex items-center justify-between">
              <p className="text-[8px] font-medium uppercase tracking-wider text-slate-400">Assessment</p>
              <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[7.5px] font-medium text-emerald-700">Recommend: advance</span>
            </div>
            <p className="mt-0.5 text-[15px] font-semibold leading-tight tabular-nums text-slate-900">
              <CountUp value={s.drawer ? 4.3 : 0} ms={900} instant={reduced} format={(v) => v.toFixed(1)} />
              <span className="text-[9px] font-normal text-slate-400"> / 5</span>
            </p>
            <div className="mt-1 space-y-1">
              {(
                [
                  ["Communication", 4.5],
                  ["Technical depth", 4.1],
                  ["Problem solving", 4.2],
                ] as const
              ).map(([label, v]) => (
                <div key={label} className="flex items-center gap-2 text-[8px]">
                  <span className="w-[70px] text-slate-600">{label}</span>
                  <span className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <span
                      className="block h-full rounded-full bg-slate-700"
                      style={{ width: `${s.drawer ? (v / 5) * 100 : 0}%`, transition: "width 900ms cubic-bezier(0.2, 0.8, 0.2, 1) 150ms" }}
                    />
                  </span>
                  <span className="w-4 text-right tabular-nums text-slate-700">{v.toFixed(1)}</span>
                </div>
              ))}
            </div>
            <p className="mt-1.5 text-[8px] leading-snug text-slate-600">
              Structured answer on scaling: a queue per upload, horizontally scaled FFmpeg workers, idempotent retries. Light on monitoring.
            </p>

            <div className="mt-auto flex gap-1.5 pt-1.5">
              <span className="flex h-7 flex-1 items-center justify-center rounded-md border border-slate-200 text-[9px] text-slate-600">Reject</span>
              <span
                data-cursor="shortlist"
                className={`flex h-7 flex-1 items-center justify-center gap-1 rounded-md text-[9px] font-medium text-white transition-colors ${
                  s.shortlisted ? "bg-emerald-600" : s.hover === "shortlist" ? "bg-blue-700" : "bg-blue-600"
                }`}
              >
                {s.shortlisted ? (
                  <>
                    <CheckIcon className="h-3 w-3" /> Shortlisted
                  </>
                ) : (
                  "Shortlist"
                )}
              </span>
            </div>
          </div>

          {s.toast && (
            <div
              key={s.toast}
              className="builder-pop absolute bottom-3 left-[124px] flex items-center gap-1.5 rounded-md bg-slate-900 px-2.5 py-1.5 text-[9px] text-white shadow-xl"
            >
              <CheckIcon className="h-3 w-3 text-emerald-400" />
              {s.toast}
            </div>
          )}
        </div>

        {!reduced && <Cursor target={s.cursor} click={s.click} step={step} />}
      </div>
    </DemoFrame>
  );
}
