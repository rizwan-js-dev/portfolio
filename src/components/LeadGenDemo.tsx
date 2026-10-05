"use client";

import type { ReactNode } from "react";
import { CheckIcon, CountUp, Cursor, DemoFrame, Typewriter, WindowBar, viewFade, type CursorTarget } from "./DemoParts";
import { compileScript, useStage, useStepper, type ScriptStep } from "./useStage";

// Sale Link Up, end to end: search LinkedIn with filters, watch leads and emails come in,
// export them to Excel, send a bulk campaign, then read the campaign analytics.

const HEIGHT = 340;
const TOTAL = 247;

type View = "search" | "campaign" | "analytics";
type S = {
  view: View;
  typing: boolean;
  chips: number;
  searched: boolean;
  rows: number;
  emails: number;
  selected: boolean;
  menu: boolean;
  subject: 0 | 1 | 2;
  sending: "idle" | "busy" | "sending" | "done";
  stats: boolean;
  feed: number;
  hover: string | null;
  toast: "export" | "sent" | null;
  cursor: CursorTarget;
  fade: boolean;
  phase: 0 | 1 | 2;
};

const leads = [
  { name: "Aisha Khan", title: "VP Engineering", company: "Finlytics", city: "Bengaluru", email: "aisha@finlytics.io", tone: "bg-rose-100 text-rose-700" },
  { name: "Rohan Mehta", title: "VP Engineering", company: "CloudNest", city: "Pune", email: "rohan.m@cloudnest.io", tone: "bg-amber-100 text-amber-700" },
  { name: "Priya Nair", title: "VP of Engineering", company: "Zentra", city: "Chennai", email: "priya@zentra.ai", tone: "bg-emerald-100 text-emerald-700" },
  { name: "Arjun Patel", title: "VP Engineering", company: "ShipFast", city: "Ahmedabad", email: "arjun@shipfast.in", tone: "bg-sky-100 text-sky-700" },
  { name: "Sara Thomas", title: "VP Eng, Platform", company: "Leadify", city: "Mumbai", email: null, tone: "bg-violet-100 text-violet-700" },
  { name: "Vikram Rao", title: "VP Engineering", company: "DataPeak", city: "Hyderabad", email: "vikram@datapeak.io", tone: "bg-teal-100 text-teal-700" },
];

const chips = ["Industry: SaaS", "Location: India", "Company size: 51–500"];

const feed = [
  { who: "Priya Nair", what: "opened", when: "just now", dot: "bg-sky-500" },
  { who: "Rohan Mehta", what: "replied", when: "1m", dot: "bg-emerald-500" },
  { who: "Aisha Khan", what: "opened", when: "3m", dot: "bg-sky-500" },
  { who: "Vikram Rao", what: "clicked a link", when: "6m", dot: "bg-amber-500" },
];

const initial: S = {
  view: "search",
  typing: false,
  chips: 0,
  searched: false,
  rows: 0,
  emails: 0,
  selected: false,
  menu: false,
  subject: 0,
  sending: "idle",
  stats: false,
  feed: 0,
  hover: null,
  toast: null,
  cursor: { x: 330, y: 250 },
  fade: false,
  phase: 0,
};

const steps: ScriptStep<S>[] = [
  { dur: 700, f: () => initial },
  // 1. Search with filters; leads stream in as they are scraped.
  { dur: 600, f: () => ({ cursor: "search-input" }) },
  { dur: 1000, f: () => ({ typing: true }), click: true },
  { dur: 550, f: () => ({ cursor: "add-filter", hover: "add-filter" }) },
  { dur: 500, f: () => ({ chips: 1 }), click: true },
  { dur: 500, f: () => ({ chips: 2 }), click: true },
  { dur: 550, f: () => ({ chips: 3, hover: null }), click: true },
  { dur: 550, f: () => ({ cursor: "search-btn", hover: "search-btn" }) },
  { dur: 350, f: () => ({ searched: true, rows: 1, hover: null }), click: true },
  ...[2, 3, 4, 5, 6].map((n) => ({ dur: 350, f: () => ({ rows: n, emails: n - 1 }) })),
  { dur: 600, f: () => ({ emails: 6 }) },
  // 2. Select everything and export to Excel.
  { dur: 650, f: () => ({ cursor: "select-all", phase: 1 }) },
  { dur: 650, f: () => ({ selected: true }), click: true },
  { dur: 600, f: () => ({ cursor: "export", hover: "export" }) },
  { dur: 500, f: () => ({ menu: true }), click: true },
  { dur: 500, f: () => ({ cursor: "export-xlsx", hover: "export-xlsx" }) },
  { dur: 1500, f: () => ({ menu: false, hover: null, toast: "export" }), click: true },
  // 3. Send a campaign to the list, then check analytics.
  { dur: 650, f: () => ({ cursor: "add-campaign", hover: "add-campaign", toast: null }) },
  { dur: 900, f: () => ({ view: "campaign", hover: null, phase: 2 }), click: true },
  { dur: 600, f: () => ({ cursor: "subject" }) },
  { dur: 1100, f: () => ({ subject: 1 }), click: true },
  { dur: 400, f: () => ({ subject: 2 }) },
  { dur: 600, f: () => ({ cursor: "send", hover: "send" }) },
  { dur: 500, f: () => ({ sending: "busy", hover: null }), click: true },
  { dur: 2400, f: () => ({ sending: "sending" }) },
  { dur: 900, f: () => ({ sending: "done", toast: "sent" }) },
  { dur: 700, f: () => ({ cursor: "nav-analytics", hover: "nav-analytics", toast: null }) },
  { dur: 1600, f: () => ({ view: "analytics", stats: true, hover: null }), click: true },
  { dur: 550, f: () => ({ feed: 1 }) },
  { dur: 550, f: () => ({ feed: 2 }) },
  { dur: 550, f: () => ({ feed: 3 }) },
  { dur: 1600, f: () => ({ feed: 4 }), still: true },
  { dur: 500, f: () => ({ fade: true }) },
];

const { frames, durations, still } = compileScript(initial, steps);

// Cumulative opens and replies over the first 24 hours.
const OPENS = [0, 38, 67, 88, 101, 110, 117, 122, 126, 129, 132, 134, 135, 136, 137, 137, 138, 138, 139, 139, 139, 139, 139, 139, 139];
const REPLIES = [0, 3, 7, 11, 14, 17, 19, 21, 23, 24, 25, 26, 27, 28, 28, 29, 29, 30, 30, 30, 31, 31, 31, 31, 31];
const path = (data: number[]) => data.map((v, i) => `${i === 0 ? "M" : "L"}${(i / 24) * 250 + 4} ${96 - (v / 150) * 88}`).join(" ");

// ---- Small UI pieces -------------------------------------------------------------------

function Svg({ d, className = "h-3 w-3" }: { d: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {d}
    </svg>
  );
}

const icons = {
  search: (
    <>
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5L14 14" />
    </>
  ),
  lists: <path d="M5 4h9M5 8h9M5 12h9M2 4h.01M2 8h.01M2 12h.01" />,
  campaigns: <path d="M2 4.5l6 4 6-4M2.5 3.5h11a.5.5 0 01.5.5v8a.5.5 0 01-.5.5h-11A.5.5 0 012 12V4a.5.5 0 01.5-.5z" />,
  analytics: <path d="M2.5 13.5h11M4.5 11V8M8 11V4.5M11.5 11V6.5" />,
};

function Checkbox({ on, delay = 0 }: { on: boolean; delay?: number }) {
  return (
    <span
      className={`grid h-2.5 w-2.5 place-items-center rounded-[3px] border transition-colors duration-150 ${on ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {on && <CheckIcon className="h-2 w-2" />}
    </span>
  );
}

function Merge({ children }: { children: ReactNode }) {
  return <span className="rounded bg-blue-50 px-1 font-mono text-[7.5px] text-blue-700 ring-1 ring-blue-100">{children}</span>;
}

function Toggle() {
  return (
    <span className="relative h-2.5 w-4.5 rounded-full bg-blue-600">
      <span className="absolute right-[1.5px] top-[1.5px] h-[7px] w-[7px] rounded-full bg-white" />
    </span>
  );
}

function ExcelIcon() {
  return <span className="grid h-5 w-4 place-items-center rounded-[3px] bg-[#1f7244] text-[7px] font-bold text-white">X</span>;
}

// ---- Component -----------------------------------------------------------------------

export default function LeadGenDemo() {
  const stage = useStage();
  const { reduced } = stage;
  const i = useStepper(durations, stage.visible && !reduced);
  const s = reduced ? frames[still] : frames[i];
  const step = reduced ? still : i;
  const view = (v: View) => viewFade(s.view === v);
  const url = { search: "app.salelinkup.com/search", campaign: "app.salelinkup.com/campaigns/new", analytics: "app.salelinkup.com/campaigns/q-question" }[s.view];

  return (
    <DemoFrame
      stageRef={stage.ref}
      scale={stage.scale}
      height={HEIGHT}
      ariaLabel="Animated demo of Sale Link Up: a LinkedIn search with filters returns leads whose emails are found one by one, all 247 leads are exported to Excel, a bulk email campaign with merge fields is sent, and the analytics page shows opens, replies and recent activity."
      phases={["Scrape LinkedIn", "Export to Excel", "Campaign & analytics"]}
      phase={reduced ? -1 : s.phase}
    >
      <div className="absolute inset-0 bg-white transition-opacity duration-500" style={{ opacity: s.fade && !reduced ? 0 : 1 }}>
        <WindowBar url={url} />

        {/* Sidebar */}
        <div className="absolute bottom-0 left-0 top-[30px] w-[112px] border-r border-slate-200 bg-slate-50 px-2 py-3">
          <p className="flex items-center gap-1.5 px-1 text-[10px] font-semibold text-slate-900">
            <span className="grid h-4 w-4 place-items-center rounded bg-blue-600 text-[7px] font-bold text-white">SL</span>
            SaleLinkUp
          </p>
          <div className="mt-4 space-y-0.5">
            {(
              [
                ["search", "Search", "search"],
                ["lists", "Lists", null],
                ["campaigns", "Campaigns", "campaign"],
                ["analytics", "Analytics", "analytics"],
              ] as const
            ).map(([icon, label, v]) => {
              const active = v === s.view;
              return (
                <p
                  key={label}
                  data-cursor={`nav-${icon}`}
                  className={`flex items-center gap-1.5 rounded px-1.5 py-1 text-[9px] transition-colors ${
                    active ? "bg-white font-medium text-slate-900 shadow-sm ring-1 ring-slate-200" : s.hover === `nav-${icon}` ? "bg-slate-100 text-slate-700" : "text-slate-500"
                  }`}
                >
                  <Svg d={icons[icon]} className="h-2.5 w-2.5" />
                  {label}
                </p>
              );
            })}
          </div>
          <div className="absolute inset-x-3 bottom-3">
            <p className="flex justify-between text-[7.5px] text-slate-500">
              <span>Credits</span>
              <span className="tabular-nums">1,250 left</span>
            </p>
            <div className="mt-1 h-1 rounded-full bg-slate-200">
              <div className="h-full w-[62%] rounded-full bg-slate-500" />
            </div>
          </div>
        </div>

        {/* ---------------- Search ---------------- */}
        <div className="absolute bottom-0 left-[112px] right-0 top-[30px] px-3 py-3" style={view("search")}>
          <div className="flex gap-1.5">
            <div data-cursor="search-input" className="flex h-6 flex-1 items-center gap-1.5 rounded-md border border-slate-300 px-2 text-[9.5px]">
              <Svg d={icons.search} className="h-2.5 w-2.5 text-slate-400" />
              {s.typing ? (
                <span className="text-slate-800">
                  <Typewriter text="VP Engineering" ms={800} instant={reduced} />
                </span>
              ) : (
                <span className="text-slate-400">Job title, keyword or LinkedIn URL</span>
              )}
            </div>
            <span
              data-cursor="search-btn"
              className={`flex h-6 items-center rounded-md px-3 text-[9px] font-medium text-white transition-colors ${s.hover === "search-btn" ? "bg-blue-700" : "bg-blue-600"}`}
            >
              Search
            </span>
          </div>

          <div className="mt-2 flex h-[18px] items-center gap-1">
            {chips.slice(0, s.chips).map((c) => (
              <span key={c} className="builder-pop flex items-center gap-1 rounded bg-slate-100 px-1.5 py-[3px] text-[8px] text-slate-700">
                {c} <span className="text-slate-400">×</span>
              </span>
            ))}
            <span
              data-cursor="add-filter"
              className={`rounded border border-dashed px-1.5 py-[2px] text-[8px] transition-colors ${
                s.hover === "add-filter" ? "border-slate-400 text-slate-700" : "border-slate-300 text-slate-500"
              }`}
            >
              + Filter
            </span>
          </div>

          <div className="mt-2 flex h-6 items-center">
            <p className="text-[9px] text-slate-600">
              {s.selected ? (
                <>
                  <span className="font-semibold text-slate-900">{TOTAL} selected</span> · <span className="text-blue-600">Clear</span>
                </>
              ) : s.searched ? (
                <>
                  <span className="font-semibold tabular-nums text-slate-900">
                    <CountUp value={TOTAL} ms={2400} instant={reduced} />
                  </span>{" "}
                  results
                </>
              ) : (
                <span className="text-slate-400">Search to find leads</span>
              )}
            </p>
            <div className="relative ml-auto flex gap-1.5">
              <span
                data-cursor="export"
                className={`flex h-6 items-center gap-1 rounded-md border px-2 text-[8.5px] text-slate-700 transition-colors ${
                  s.hover === "export" || s.menu ? "border-slate-400 bg-slate-50" : "border-slate-300"
                }`}
              >
                Export <span className="text-[7px] text-slate-400">▾</span>
              </span>
              <span
                data-cursor="add-campaign"
                className={`flex h-6 items-center rounded-md px-2 text-[8.5px] font-medium text-white transition-colors ${
                  s.hover === "add-campaign" ? "bg-blue-700" : "bg-blue-600"
                } ${s.selected ? "" : "opacity-50"}`}
              >
                Add to campaign
              </span>
              {s.menu && (
                <div className="builder-pop absolute left-0 top-7 z-20 w-[118px] rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                  {[
                    ["export-xlsx", "Excel (.xlsx)"],
                    ["export-csv", "CSV"],
                    ["export-sheets", "Google Sheets"],
                  ].map(([id, label]) => (
                    <p key={id} data-cursor={id} className={`px-2 py-1 text-[8.5px] ${s.hover === id ? "bg-slate-100 text-slate-900" : "text-slate-600"}`}>
                      {label}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-1.5 overflow-hidden rounded-md border border-slate-200">
            <div className="grid h-5 grid-cols-[14px_1.55fr_0.95fr_0.8fr_1.5fr] items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-2 text-[7.5px] font-medium uppercase tracking-wider text-slate-400">
              <span data-cursor="select-all">
                <Checkbox on={s.selected} />
              </span>
              <span>Name</span>
              <span>Company</span>
              <span>Location</span>
              <span>Email</span>
            </div>
            {leads.map((l, idx) => {
              const shown = idx < s.rows;
              const found = idx < s.emails;
              return (
                <div
                  key={l.name}
                  className={`grid h-[29px] grid-cols-[14px_1.55fr_0.95fr_0.8fr_1.5fr] items-center gap-1.5 border-b border-slate-100 px-2 last:border-0 ${shown ? "builder-pop" : "invisible"}`}
                >
                  <Checkbox on={s.selected} delay={idx * 35} />
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full text-[6.5px] font-semibold ${l.tone}`}>
                      {l.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                    <span className="min-w-0 leading-tight">
                      <span className="block truncate text-[8.5px] font-medium text-slate-800">{l.name}</span>
                      <span className="block truncate text-[7px] text-slate-400">{l.title}</span>
                    </span>
                  </span>
                  <span className="truncate text-[8.5px] text-slate-600">{l.company}</span>
                  <span className="truncate text-[8.5px] text-slate-500">{l.city}</span>
                  <span className="flex min-w-0 items-center gap-1 text-[8px]">
                    {!found ? (
                      <span className="flex items-center gap-1 text-slate-400">
                        <span className="h-2 w-2 animate-spin rounded-full border border-slate-300 border-t-transparent" /> Finding email…
                      </span>
                    ) : l.email ? (
                      <>
                        <span className="truncate font-mono text-slate-700">{l.email}</span>
                        <span className="shrink-0 text-emerald-600">
                          <CheckIcon className="h-2.5 w-2.5" />
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-400">No email found</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          {s.toast === "export" && (
            <div className="builder-pop absolute bottom-3 right-3 flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 shadow-lg">
              <ExcelIcon />
              <div className="leading-tight">
                <p className="font-mono text-[8.5px] text-slate-800">leads_vp-engineering_saas.xlsx</p>
                <p className="text-[7.5px] text-slate-500">{TOTAL} rows · 38 KB · Downloaded</p>
              </div>
            </div>
          )}
        </div>

        {/* ---------------- Campaign ---------------- */}
        <div className="absolute bottom-0 left-[112px] right-0 top-[30px] px-3 py-3" style={view("campaign")}>
          <div className="flex items-center">
            <div>
              <p className="text-[8px] text-slate-400">Campaigns / New campaign</p>
              <p className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-900">
                VP Engineering outreach
                <span className="rounded bg-slate-100 px-1 py-[1px] text-[7.5px] font-medium text-slate-500">{s.sending === "done" ? "Sent" : "Draft"}</span>
              </p>
            </div>
            <span
              data-cursor="send"
              className={`ml-auto flex h-6 w-[82px] items-center justify-center rounded-md text-[8.5px] font-medium text-white transition-colors ${
                s.sending === "done" ? "bg-emerald-600" : s.hover === "send" ? "bg-blue-700" : "bg-blue-600"
              }`}
            >
              {s.sending === "busy" ? (
                <span className="h-2 w-2 animate-spin rounded-full border border-white border-t-transparent" />
              ) : s.sending === "done" ? (
                "Sent"
              ) : s.sending === "sending" ? (
                "Sending…"
              ) : (
                "Send campaign"
              )}
            </span>
          </div>

          <div className="mt-2.5 flex gap-2.5">
            <div className="flex-1 rounded-md border border-slate-200 text-[8.5px]">
              {[
                ["From", <span key="f" className="text-slate-700">Sales team &lt;sales@company.com&gt;</span>],
                [
                  "To",
                  <span key="t" className="rounded bg-slate-100 px-1.5 py-[2px] text-slate-700">
                    {TOTAL} leads · VP Engineering · SaaS · India
                  </span>,
                ],
                [
                  "Subject",
                  <span key="s" data-cursor="subject" className="flex min-h-[14px] flex-1 items-center gap-1 text-slate-800">
                    {s.subject > 0 && <Typewriter text="Quick question, " ms={900} instant={reduced} caret={s.subject === 1} />}
                    {s.subject === 2 && <Merge>first_name</Merge>}
                    {s.subject === 0 && <span className="text-slate-400">Add a subject</span>}
                  </span>,
                ],
              ].map(([label, value]) => (
                <div key={label as string} className="flex items-center gap-2 border-b border-slate-100 px-2.5 py-1.5">
                  <span className="w-9 text-slate-400">{label}</span>
                  {value}
                </div>
              ))}
              <div className="space-y-1.5 px-2.5 py-2 text-[8.5px] leading-relaxed text-slate-700">
                <p>
                  Hi <Merge>first_name</Merge>,
                </p>
                <p>
                  Noticed <Merge>company</Merge> is hiring across engineering. We help teams like yours cut hiring time with pre-screened candidates.
                </p>
                <p>Open to a 15-minute call next week?</p>
                <p className="text-slate-500">— Sales team</p>
              </div>
            </div>

            <div className="w-[132px] space-y-2 rounded-md border border-slate-200 p-2.5 text-[8px]">
              <p className="text-[7.5px] font-medium uppercase tracking-wider text-slate-400">Settings</p>
              <p className="flex justify-between text-slate-600">
                Send <span className="text-slate-800">Now</span>
              </p>
              <p className="flex justify-between text-slate-600">
                Daily limit <span className="text-slate-800">150 / inbox</span>
              </p>
              {["Track opens", "Track replies", "Stop on reply"].map((t) => (
                <p key={t} className="flex items-center justify-between text-slate-600">
                  {t} <Toggle />
                </p>
              ))}
            </div>
          </div>

          {s.sending !== "idle" && (
            <div className="builder-pop mt-2.5 rounded-md border border-slate-200 px-2.5 py-2">
              <p className="flex justify-between text-[8.5px] text-slate-600">
                <span>{s.sending === "done" ? "All emails sent" : "Sending in batches…"}</span>
                <span className="tabular-nums">
                  <CountUp value={s.sending === "busy" ? 0 : TOTAL} ms={2200} instant={reduced} /> / {TOTAL}
                </span>
              </p>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: s.sending === "busy" ? "0%" : "100%", transition: s.sending === "busy" ? "none" : "width 2200ms cubic-bezier(0.3, 0.6, 0.4, 1)" }}
                />
              </div>
            </div>
          )}

          {s.toast === "sent" && (
            <div className="builder-pop absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md bg-slate-900 px-2.5 py-1.5 text-[8.5px] text-white shadow-lg">
              <CheckIcon className="h-3 w-3 text-emerald-400" /> Campaign sent to {TOTAL} leads
            </div>
          )}
        </div>

        {/* ---------------- Analytics ---------------- */}
        <div className="absolute bottom-0 left-[112px] right-0 top-[30px] px-3 py-3" style={view("analytics")}>
          <p className="text-[8px] text-slate-400">Campaigns / VP Engineering outreach</p>
          <p className="text-[12px] font-semibold text-slate-900">Analytics</p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {(
              [
                ["Sent", TOTAL, null],
                ["Delivered", 241, "97.6%"],
                ["Opened", 139, "57.7%"],
                ["Replied", 31, "12.9%"],
              ] as const
            ).map(([label, v, pct]) => (
              <div key={label} className="rounded-md border border-slate-200 px-2 py-1.5">
                <p className="text-[7.5px] text-slate-500">{label}</p>
                <p className="flex items-baseline gap-1">
                  <span className="text-[13px] font-semibold tabular-nums text-slate-900">
                    <CountUp value={s.stats ? v : 0} ms={1100} instant={reduced} />
                  </span>
                  {pct && <span className="text-[7.5px] text-slate-400">{pct}</span>}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-2 flex gap-2">
            <div className="flex-1 rounded-md border border-slate-200 p-2">
              <div className="flex items-center justify-between text-[8px]">
                <span className="font-medium text-slate-700">First 24 hours</span>
                <span className="flex gap-2 text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="h-0.5 w-2.5 bg-blue-600" /> Opens
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-0.5 w-2.5 bg-emerald-500" /> Replies
                  </span>
                </span>
              </div>
              <svg viewBox="0 0 258 110" className="mt-1 h-[118px] w-full" aria-hidden>
                {[8, 37, 66, 96].map((y) => (
                  <line key={y} x1="4" x2="254" y1={y} y2={y} stroke="#e2e8f0" strokeWidth="1" />
                ))}
                {["0h", "6h", "12h", "18h", "24h"].map((l, k) => (
                  <text key={l} x={4 + k * 62.5} y="107" fontSize="7" fill="#94a3b8" textAnchor={k === 0 ? "start" : k === 4 ? "end" : "middle"}>
                    {l}
                  </text>
                ))}
                <path
                  d={path(OPENS)}
                  pathLength={1}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                  strokeDasharray="1"
                  style={{ strokeDashoffset: s.stats ? 0 : 1, transition: s.stats ? "stroke-dashoffset 1400ms ease-out" : "none" }}
                />
                <path
                  d={path(REPLIES)}
                  pathLength={1}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                  strokeDasharray="1"
                  style={{ strokeDashoffset: s.stats ? 0 : 1, transition: s.stats ? "stroke-dashoffset 1400ms ease-out 200ms" : "none" }}
                />
              </svg>
            </div>

            <div className="w-[140px] rounded-md border border-slate-200 p-2">
              <p className="text-[8px] font-medium text-slate-700">Activity</p>
              <div className="mt-1.5 space-y-1.5">
                {feed.slice(0, s.feed).map((e) => (
                  <div key={e.who} className="builder-pop flex items-start gap-1.5 text-[7.5px] leading-tight">
                    <span className={`mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full ${e.dot}`} />
                    <span className="flex-1 text-slate-600">
                      <span className="font-medium text-slate-800">{e.who}</span> {e.what}
                    </span>
                    <span className="text-slate-400">{e.when}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {!reduced && <Cursor target={s.cursor} click={s.click} step={step} />}
      </div>
    </DemoFrame>
  );
}
