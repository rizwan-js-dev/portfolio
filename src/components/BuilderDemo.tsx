"use client";

import { useEffect, useState, type ReactNode } from "react";
import { DemoFrame } from "./DemoParts";
import { useStage } from "./useStage";

// A scripted walkthrough of the Currinda site builder: drag widgets onto a page,
// duplicate and move a widget, duplicate and rename a page, edit it, then publish.

const HEIGHT = 340;

type Pt = { x: number; y: number };
type Page = { id: string; name: string };
type State = {
  pages: Page[];
  orders: Record<string, string[]>;
  active: string;
  cursor: Pt;
  grab: boolean;
  ghost: { type: string; kind: "tile" | "block" } | null;
  hover: string | null;
  selected: string | null;
  pressed: string | null;
  editing: string | null;
  toast: string | null;
  publish: "idle" | "busy" | "done";
  fade: boolean;
  phase: 0 | 1 | 2;
  // Per-step flags, not carried over.
  saving: boolean;
  click: number | null;
};

// ---- Layout (stage coordinates) -------------------------------------------------

const BAR = 32;
const SIDEBAR_W = 148;
const PAGE_ROW_Y = 58;
const PAGE_ROW_STEP = 22;
const TILE_Y = 152;
const TILE_STEP = 44;
const PAGE = { x: 168, y: 40, w: 372, h: 296 };
const BX = PAGE.x + 8;
const BW = PAGE.w - 16;
const BLOCK_Y = PAGE.y + 26;
const GAP = 5;

const HEIGHTS: Record<string, number> = { hero: 50, listing: 52, map: 44, gallery: 38, catalog: 46, stays: 46, slot: 14 };

const tiles = [
  { type: "listing", label: "Listing" },
  { type: "map", label: "Map" },
  { type: "gallery", label: "Gallery" },
  { type: "catalog", label: "Catalog" },
  { type: "stays", label: "Stays" },
  { type: "text", label: "Text" },
];

const labels: Record<string, string> = {
  hero: "Hero",
  listing: "Listing",
  map: "Map",
  gallery: "Gallery",
  catalog: "Catalog",
  stays: "Accommodation",
};

// "listing2" is a duplicate of "listing".
const typeOf = (id: string) => id.replace(/\d+$/, "");

function tops(order: string[]) {
  const out: Record<string, number> = {};
  let y = BLOCK_Y;
  for (const id of order) {
    out[id] = y;
    y += HEIGHTS[typeOf(id)] + GAP;
  }
  return out;
}

const TOOLS = ["drag", "copy", "settings", "delete"] as const;
const tileCenter = (type: string): Pt => {
  const i = tiles.findIndex((t) => t.type === type);
  return { x: 8 + (i % 2) * 68 + 31, y: TILE_Y + Math.floor(i / 2) * TILE_STEP + 19 };
};
const blockCenter = (order: string[], id: string): Pt => ({
  x: BX + BW / 2 + 40,
  y: tops(order)[id] + HEIGHTS[typeOf(id)] / 2,
});
const toolCenter = (order: string[], id: string, tool: (typeof TOOLS)[number]): Pt => ({
  x: BX + BW - 11 - (TOOLS.length - 1 - TOOLS.indexOf(tool)) * 16,
  y: tops(order)[id] - 1,
});
const pageRowY = (i: number) => PAGE_ROW_Y + i * PAGE_ROW_STEP;
const PUBLISH: Pt = { x: 526, y: 16 };

// ---- Script ----------------------------------------------------------------------

const initial: State = {
  pages: [
    { id: "home", name: "Home" },
    { id: "venue", name: "Venue" },
  ],
  orders: { home: ["hero", "gallery"], venue: ["hero", "map"] },
  active: "home",
  cursor: { x: 450, y: 300 },
  grab: false,
  ghost: null,
  hover: null,
  selected: null,
  pressed: null,
  editing: null,
  toast: null,
  publish: "idle",
  fade: false,
  phase: 0,
  saving: false,
  click: null,
};

type Step = { dur: number; f: (s: State) => Partial<State>; edit?: boolean; click?: boolean; still?: boolean };
const script: Step[] = [];
const step = (dur: number, f: Step["f"], opts: Omit<Step, "dur" | "f"> = {}) => script.push({ dur, f, ...opts });

const cur = (s: State) => s.orders[s.active];
const setOrder = (s: State, order: string[]) => ({ orders: { ...s.orders, [s.active]: order } });
const withSlot = (order: string[], index: number) => {
  const o = order.filter((x) => x !== "slot");
  return [...o.slice(0, index), "slot", ...o.slice(index)];
};
const slotCenter = (order: string[]): Pt => ({ x: BX + BW / 2, y: tops(order).slot + HEIGHTS.slot / 2 });
const rename = (s: State, id: string, name: string) => ({
  pages: s.pages.map((p) => (p.id === id ? { ...p, name } : p)),
});

function dragTile(type: string, index: number) {
  step(750, () => ({ cursor: tileCenter(type), hover: `tile:${type}`, selected: null, toast: null }));
  step(220, () => ({ grab: true, ghost: { type, kind: "tile" } }));
  step(900, (s) => {
    const o = withSlot(cur(s), index);
    return { ...setOrder(s, o), cursor: slotCenter(o), hover: null };
  });
  step(750, (s) => ({ ...setOrder(s, cur(s).map((x) => (x === "slot" ? type : x))), grab: false, ghost: null, selected: type }), {
    edit: true,
  });
}

function selectBlock(id: string) {
  step(700, (s) => ({ cursor: blockCenter(cur(s), id), hover: id, toast: null }));
  step(450, () => ({ selected: id, hover: null }), { click: true });
}

function dragBlock(id: string, index: number) {
  step(600, (s) => ({ cursor: toolCenter(cur(s), id, "drag"), hover: "tool:drag", toast: null }));
  step(240, (s) => ({ ...setOrder(s, cur(s).map((x) => (x === id ? "slot" : x))), grab: true, ghost: { type: typeOf(id), kind: "block" }, hover: null }));
  step(950, (s) => {
    const o = withSlot(cur(s), index);
    return { ...setOrder(s, o), cursor: slotCenter(o) };
  });
  step(750, (s) => ({ ...setOrder(s, cur(s).map((x) => (x === "slot" ? id : x))), grab: false, ghost: null, selected: id }), {
    edit: true,
  });
}

step(900, () => initial);

// 1. Build the page by dragging widgets in.
dragTile("listing", 1);
dragTile("map", 3);

// 2. Duplicate a widget, then move the copy.
step(10, () => ({ phase: 1 }));
selectBlock("listing");
step(650, (s) => ({ cursor: toolCenter(cur(s), "listing", "copy"), hover: "tool:copy" }));
step(
  850,
  (s) => {
    const o = cur(s);
    const i = o.indexOf("listing");
    return { ...setOrder(s, [...o.slice(0, i + 1), "listing2", ...o.slice(i + 1)]), selected: "listing2", hover: null, toast: "Widget duplicated" };
  },
  { edit: true, click: true },
);
dragBlock("listing2", 4);

// 3. Duplicate the page, rename it, adapt it, publish.
step(10, () => ({ phase: 2 }));
step(750, () => ({ cursor: { x: 126, y: pageRowY(0) + 10 }, hover: "page:home", selected: null, toast: null }));
step(
  700,
  (s) => ({
    pages: [s.pages[0], { id: "homecopy", name: "Home copy" }, ...s.pages.slice(1)],
    orders: { ...s.orders, homecopy: [...s.orders.home] },
    pressed: "page-copy:home",
    toast: "Page duplicated",
  }),
  { edit: true, click: true },
);
step(750, () => ({ active: "homecopy", pressed: null, hover: null }));
step(600, () => ({ cursor: { x: 64, y: pageRowY(1) + 10 }, hover: "page:homecopy" }));
step(320, (s) => ({ editing: "homecopy", ...rename(s, "homecopy", "") }), { click: true });
for (let k = 1; k <= "Hotels".length; k++) step(95, (s) => rename(s, "homecopy", "Hotels".slice(0, k)));
step(450, () => ({ editing: null, hover: null, toast: null }), { edit: true });
selectBlock("listing2");
step(600, (s) => ({ cursor: toolCenter(cur(s), "listing2", "delete"), hover: "tool:delete" }));
step(700, (s) => ({ ...setOrder(s, cur(s).filter((x) => x !== "listing2")), selected: null, hover: null, toast: "Widget removed" }), {
  edit: true,
  click: true,
});
dragTile("stays", 1);
script[script.length - 1].still = true;
step(750, () => ({ cursor: PUBLISH, hover: "publish", selected: null, toast: null }));
step(700, () => ({ publish: "busy", hover: null }), { click: true });
step(1600, () => ({ publish: "done", toast: "Published · techsummit.currinda.app" }));
step(500, () => ({ fade: true }));

const states: State[] = [];
script.forEach((st, i) => {
  const prev = i === 0 ? initial : states[i - 1];
  const base = { ...prev, saving: false, click: null };
  states.push({ ...base, ...st.f(base), saving: !!st.edit, click: st.click ? i : null });
});
const STILL = script.findIndex((s) => s.still);

// ---- Icons -----------------------------------------------------------------------

function Svg({ children, className = "h-3 w-3" }: { children: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {children}
    </svg>
  );
}

const icons: Record<string, ReactNode> = {
  listing: <path d="M5 4h8M5 8h8M5 12h8M2.5 4h.01M2.5 8h.01M2.5 12h.01" />,
  map: (
    <>
      <path d="M8 14s4.5-4 4.5-7.5a4.5 4.5 0 00-9 0C3.5 10 8 14 8 14z" />
      <circle cx="8" cy="6.5" r="1.5" />
    </>
  ),
  gallery: (
    <>
      <rect x="2" y="2.5" width="12" height="11" rx="1.5" />
      <path d="M2 11l3.5-3.5 3 3 2-2L14 12" />
      <circle cx="10.5" cy="5.5" r="1" />
    </>
  ),
  catalog: (
    <>
      <path d="M2.5 8.5V3a.5.5 0 01.5-.5h5.5l5 5-6 6-5-5z" />
      <circle cx="5.5" cy="5.5" r="1" />
    </>
  ),
  stays: <path d="M2 12V4M2 9h12v3M14 9V7.5A1.5 1.5 0 0012.5 6H7v3M4.5 7.5h.01" />,
  text: <path d="M3 4V3h10v1M8 3v10M6 13h4" />,
  drag: (
    <>
      <circle cx="6" cy="4" r=".6" fill="currentColor" />
      <circle cx="10" cy="4" r=".6" fill="currentColor" />
      <circle cx="6" cy="8" r=".6" fill="currentColor" />
      <circle cx="10" cy="8" r=".6" fill="currentColor" />
      <circle cx="6" cy="12" r=".6" fill="currentColor" />
      <circle cx="10" cy="12" r=".6" fill="currentColor" />
    </>
  ),
  copy: (
    <>
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
      <path d="M10.5 5.5V4A1.5 1.5 0 009 2.5H4A1.5 1.5 0 002.5 4v5A1.5 1.5 0 004 10.5h1.5" />
    </>
  ),
  settings: (
    <>
      <circle cx="8" cy="8" r="2" />
      <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" />
    </>
  ),
  delete: <path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.5 9h6l.5-9" />,
  page: <path d="M4 1.5h5l3 3v10H4zM9 1.5v3h3" />,
};

const Icon = ({ name, className }: { name: string; className?: string }) => <Svg className={className}>{icons[name]}</Svg>;

// ---- Widgets as they render on the event site -------------------------------------

function PhotoGlyph() {
  return (
    <svg viewBox="0 0 24 16" className="absolute bottom-0.5 left-0.5 h-2.5 w-4 text-white/70" fill="currentColor" aria-hidden>
      <path d="M0 16l7-8 5 5 4-3 8 6z" />
      <circle cx="18" cy="4" r="2.5" />
    </svg>
  );
}

function Widget({ type }: { type: string }) {
  switch (type) {
    case "hero":
      return (
        <div className="relative h-full overflow-hidden rounded-md bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 px-3 py-2 text-white">
          <span className="absolute -right-4 -top-6 h-20 w-20 rounded-full bg-white/10" />
          <span className="absolute right-16 -bottom-8 h-14 w-14 rounded-full bg-white/10" />
          <p className="text-[6px] font-semibold tracking-[0.2em] text-white/70">TECHSUMMIT 2025</p>
          <p className="mt-0.5 text-[11px] font-bold leading-tight">Build the future of events</p>
          <p className="mt-0.5 text-[7px] text-white/80">12–14 March · Ahmedabad</p>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white px-2.5 py-1 text-[7.5px] font-semibold text-blue-700 shadow">
            Register
          </span>
        </div>
      );
    case "listing":
      return (
        <div className="h-full rounded-md border border-slate-200 bg-white px-2.5 py-1">
          <div className="flex items-center justify-between">
            <p className="text-[8px] font-bold text-slate-800">Sessions</p>
            <p className="text-[6.5px] font-medium text-blue-600">View all →</p>
          </div>
          {[
            ["09:30", "Opening keynote", "Hall A"],
            ["11:00", "Scaling SaaS platforms", "Hall B"],
            ["14:15", "Panel: AI in live events", "Hall A"],
          ].map(([time, title, hall]) => (
            <div key={time} className="mt-[2px] flex items-center gap-1.5 text-[7px] leading-none">
              <span className="rounded bg-blue-50 px-1 py-[1.5px] font-mono text-[6.5px] text-blue-700">{time}</span>
              <span className="flex-1 text-slate-700">{title}</span>
              <span className="text-[6.5px] text-slate-400">{hall}</span>
            </div>
          ))}
        </div>
      );
    case "map":
      return (
        <div className="relative h-full overflow-hidden rounded-md border border-slate-200 bg-[#e8efe2]">
          <svg viewBox="0 0 356 44" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
            <rect x="230" y="0" width="60" height="18" fill="#d3e6c8" />
            <path d="M0 34 C80 30 120 40 200 28 S320 20 356 26" stroke="#bfdbfe" strokeWidth="7" fill="none" />
            <path d="M0 14 H356 M120 0 V44 M250 0 V44" stroke="#fff" strokeWidth="3" />
            <path d="M0 24 H356 M60 0 V44 M190 0 V44 M310 0 V44" stroke="#fff" strokeWidth="1.2" />
          </svg>
          <span className="absolute left-[252px] top-[8px] grid h-3.5 w-3.5 -translate-x-1/2 place-items-center rounded-full bg-rose-500 shadow ring-2 ring-white">
            <span className="h-1 w-1 rounded-full bg-white" />
          </span>
          <div className="absolute left-2 top-1/2 -translate-y-1/2 rounded bg-white px-2 py-1 shadow">
            <p className="text-[6px] uppercase tracking-wider text-slate-400">Venue</p>
            <p className="text-[7.5px] font-semibold text-slate-800">Expo Centre, Ahmedabad</p>
            <p className="text-[6.5px] text-blue-600">Get directions →</p>
          </div>
        </div>
      );
    case "gallery":
      return (
        <div className="grid h-full grid-cols-5 gap-1">
          {[
            "from-amber-300 to-rose-400",
            "from-sky-300 to-indigo-500",
            "from-emerald-300 to-teal-500",
            "from-fuchsia-300 to-purple-500",
            "from-orange-300 to-amber-500",
          ].map((g) => (
            <div key={g} className={`relative rounded bg-gradient-to-br ${g}`}>
              <PhotoGlyph />
            </div>
          ))}
        </div>
      );
    case "catalog":
      return (
        <div className="grid h-full grid-cols-3 gap-1.5">
          {[
            ["Standard pass", "₹2,499", "from-sky-200 to-blue-300"],
            ["VIP pass", "₹7,999", "from-amber-200 to-orange-300"],
            ["Workshop", "₹1,499", "from-emerald-200 to-teal-300"],
          ].map(([name, price, g]) => (
            <div key={name} className="flex flex-col rounded border border-slate-200 bg-white p-1">
              <div className={`h-4 rounded-sm bg-gradient-to-br ${g}`} />
              <p className="mt-0.5 text-[7px] font-semibold text-slate-800">{name}</p>
              <p className="flex items-center justify-between text-[7px] text-slate-600">
                {price}
                <span className="rounded bg-blue-600 px-1 text-[6px] font-semibold text-white">Add</span>
              </p>
            </div>
          ))}
        </div>
      );
    case "stays":
      return (
        <div className="grid h-full grid-cols-2 gap-1.5">
          {[
            ["Riverside Hotel", "4.6", "1.2 km", "₹4,200", "from-cyan-300 to-blue-500"],
            ["The Grand Palms", "4.8", "2.5 km", "₹6,800", "from-lime-300 to-emerald-500"],
          ].map(([name, rating, dist, price, g]) => (
            <div key={name} className="flex gap-1.5 rounded border border-slate-200 bg-white p-1">
              <div className={`relative w-12 shrink-0 rounded-sm bg-gradient-to-br ${g}`}>
                <PhotoGlyph />
              </div>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-[7.5px] font-semibold text-slate-800">{name}</p>
                <p className="text-[6.5px] text-slate-500">
                  <span className="text-amber-500">★</span> {rating} · {dist} from venue
                </p>
                <p className="mt-0.5 text-[7px] font-bold text-slate-800">
                  {price}
                  <span className="font-normal text-slate-400">/night</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}

// ---- Component ---------------------------------------------------------------------

export default function BuilderDemo() {
  const stage = useStage();
  const { visible, reduced } = stage;
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!visible || reduced) return;
    const t = setTimeout(() => setI((n) => (n + 1) % script.length), script[i].dur);
    return () => clearTimeout(t);
  }, [i, visible, reduced]);

  const s = reduced ? states[STILL] : states[i];
  const order = s.orders[s.active];
  const blockTops = tops(order);
  const pageName = s.pages.find((p) => p.id === s.active)?.name ?? "";
  const move = "600ms cubic-bezier(0.65, 0, 0.35, 1)";
  const showCursor = !reduced;

  return (
    <DemoFrame
      stageRef={stage.ref}
      scale={stage.scale}
      height={HEIGHT}
      ariaLabel="Animated demo of the Currinda no-code site builder: listing and map widgets are dragged onto an event page, a widget is duplicated and moved, the page is duplicated and renamed to Hotels, an accommodation widget is added, and the site is published."
      phases={["Drag & drop widgets", "Copy widgets", "Copy pages & publish"]}
      phase={reduced ? -1 : s.phase}
    >
      <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity: s.fade && !reduced ? 0 : 1 }}>
        {/* App toolbar */}
        <div className="absolute inset-x-0 top-0 flex items-center border-b border-slate-200 bg-white px-3 dark:border-slate-800 dark:bg-slate-900" style={{ height: BAR }}>
          <span className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="ml-3 grid h-4 w-4 place-items-center rounded bg-gradient-to-br from-blue-600 to-indigo-600 text-[8px] font-bold text-white">C</span>
          <span className="ml-1.5 text-[10px] font-bold text-slate-800 dark:text-slate-100">Currinda</span>
          <span className="ml-3 text-[9px] text-slate-400">
            TechSummit 2025 / <span className="font-medium text-slate-700 dark:text-slate-200">{pageName || "…"}</span>
          </span>

          <div className="ml-auto flex items-center gap-2.5">
            <span className="flex items-center gap-1 text-[8.5px] text-slate-400">
              {s.saving ? (
                <>
                  <span className="h-2 w-2 animate-spin rounded-full border border-slate-400 border-t-transparent" /> Saving…
                </>
              ) : (
                <>
                  <span className="text-emerald-500">✓</span> Saved
                </>
              )}
            </span>
            <span className="rounded-md border border-slate-200 px-2 py-[3px] text-[9px] font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">Preview</span>
            <span
              className={`flex w-[52px] items-center justify-center gap-1 rounded-md py-1 text-[9px] font-semibold text-white transition-all duration-150 ${
                s.publish === "done" ? "bg-emerald-600" : s.hover === "publish" ? "bg-blue-700 ring-4 ring-blue-500/20" : "bg-blue-600"
              }`}
            >
              {s.publish === "busy" ? (
                <span className="h-2 w-2 animate-spin rounded-full border border-white border-t-transparent" />
              ) : s.publish === "done" ? (
                "✓ Live"
              ) : (
                "Publish"
              )}
            </span>
          </div>
        </div>

        {/* Sidebar: pages + widgets */}
        <div className="absolute bottom-0 left-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" style={{ top: BAR, width: SIDEBAR_W }}>
          <div className="absolute inset-x-2.5 top-[10px] flex items-center justify-between">
            <p className="text-[8px] font-semibold uppercase tracking-wider text-slate-400">Pages</p>
            <span className="text-[11px] leading-none text-slate-400">+</span>
          </div>
          {s.pages.map((p, idx) => {
            const active = p.id === s.active;
            const hovered = s.hover === `page:${p.id}`;
            const editing = s.editing === p.id;
            return (
              <div
                key={p.id}
                className={`builder-pop absolute inset-x-2 flex h-5 items-center gap-1.5 rounded-md px-1.5 text-[9px] transition-[top,background-color] duration-300 ${
                  active
                    ? "bg-blue-50 font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
                    : hovered
                      ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      : "text-slate-600 dark:text-slate-300"
                }`}
                style={{ top: pageRowY(idx) - BAR }}
              >
                <Icon name="page" className="h-2.5 w-2.5 shrink-0 opacity-60" />
                {editing ? (
                  <span className="flex h-4 flex-1 items-center rounded border border-blue-500 bg-white px-1 font-normal text-slate-800 dark:bg-slate-900 dark:text-slate-100">
                    {p.name}
                    <span className="ml-px h-2.5 w-px animate-pulse bg-slate-800 dark:bg-slate-100" />
                  </span>
                ) : (
                  <span className="flex-1 truncate">{p.name}</span>
                )}
                {hovered && !editing && (
                  <span
                    className={`grid h-3.5 w-3.5 place-items-center rounded transition-colors ${
                      s.pressed === `page-copy:${p.id}` ? "bg-blue-600 text-white" : "bg-white text-slate-500 shadow-sm dark:bg-slate-700 dark:text-slate-200"
                    }`}
                  >
                    <Icon name="copy" className="h-2.5 w-2.5" />
                  </span>
                )}
              </div>
            );
          })}

          <p className="absolute left-2.5 text-[8px] font-semibold uppercase tracking-wider text-slate-400" style={{ top: TILE_Y - BAR - 14 }}>
            Widgets
          </p>
          {tiles.map((t, idx) => {
            const hovered = s.hover === `tile:${t.type}`;
            return (
              <div
                key={t.type}
                className={`absolute flex h-[38px] w-[62px] flex-col items-center justify-center gap-1 rounded-md border text-[8px] font-medium transition-colors duration-200 ${
                  hovered
                    ? "border-blue-400 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-500/10 dark:text-blue-300"
                    : "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
                }`}
                style={{ left: 8 + (idx % 2) * 68, top: TILE_Y - BAR + Math.floor(idx / 2) * TILE_STEP }}
              >
                <Icon name={t.type} className="h-3.5 w-3.5" />
                {t.label}
              </div>
            );
          })}
        </div>

        {/* Canvas with the event page being edited */}
        <div
          className="absolute bottom-0 right-0 bg-slate-100 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[size:12px_12px] dark:bg-slate-950 dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)]"
          style={{ top: BAR, left: SIDEBAR_W }}
        />
        <div
          className="absolute overflow-hidden rounded-t-lg bg-white shadow-lg shadow-slate-300/50 ring-1 ring-slate-200 dark:shadow-black/40 dark:ring-slate-700"
          style={{ left: PAGE.x, top: PAGE.y, width: PAGE.w, height: PAGE.h }}
        >
          <div className="flex h-[20px] items-center border-b border-slate-100 px-2.5 text-[6.5px] text-slate-500">
            <span className="text-[8px] font-bold text-slate-800">◆ TechSummit</span>
            <span className="ml-auto flex gap-2.5">
              {["Agenda", "Speakers", "Venue", "Tickets"].map((l) => (
                <span key={l}>{l}</span>
              ))}
            </span>
            <span className="ml-2.5 rounded-full bg-blue-600 px-1.5 py-[1px] font-semibold text-white">Register</span>
          </div>
        </div>

        {order.map((id) => {
          const top = blockTops[id];
          const h = HEIGHTS[typeOf(id)];
          const key = `${s.active}:${id}`;
          if (id === "slot") {
            return (
              <div key={key} className="absolute flex items-center" style={{ left: BX, top, width: BW, height: h }}>
                <span className="h-1.5 w-1.5 rounded-full border-2 border-blue-500 bg-white" />
                <span className="h-[2px] flex-1 bg-blue-500" />
                <span className="h-1.5 w-1.5 rounded-full border-2 border-blue-500 bg-white" />
              </div>
            );
          }
          const selected = s.selected === id;
          const hovered = s.hover === id;
          return (
            <div
              key={key}
              className="builder-pop absolute"
              style={{ left: BX, top, width: BW, height: h, transition: "top 420ms cubic-bezier(0.2, 0.8, 0.2, 1)" }}
            >
              <Widget type={typeOf(id)} />
              <span
                className={`pointer-events-none absolute -inset-[3px] rounded-lg border-[1.5px] transition-colors duration-200 ${
                  selected ? "border-blue-500" : hovered ? "border-blue-300" : "border-transparent"
                }`}
              />
              {selected && (
                <>
                  <span className="builder-pop absolute -top-[11px] left-0 rounded-t bg-blue-500 px-1.5 py-[1px] text-[6.5px] font-semibold text-white">
                    {labels[typeOf(id)]}
                    {id.endsWith("2") && " (copy)"}
                  </span>
                  <span className="builder-pop absolute -top-[9px] right-1 flex gap-0.5 rounded bg-slate-900 p-[1px] shadow-lg">
                    {TOOLS.map((tool) => (
                      <span
                        key={tool}
                        className={`grid h-3.5 w-3.5 place-items-center rounded-sm transition-colors ${
                          s.hover === `tool:${tool}` || s.pressed === `tool:${tool}`
                            ? tool === "delete"
                              ? "bg-rose-500 text-white"
                              : "bg-blue-500 text-white"
                            : "text-slate-300"
                        }`}
                      >
                        <Icon name={tool} className="h-2.5 w-2.5" />
                      </span>
                    ))}
                  </span>
                </>
              )}
            </div>
          );
        })}

        {s.toast && (
          <div
            key={s.toast}
            className="builder-pop absolute flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-slate-900 px-3 py-1.5 text-[9px] font-medium text-white shadow-xl dark:bg-white dark:text-slate-900"
            style={{ left: PAGE.x + PAGE.w / 2, bottom: 12 }}
          >
            <span className="grid h-3 w-3 place-items-center rounded-full bg-emerald-500 text-[7px] text-white">✓</span>
            {s.toast}
          </div>
        )}

        {/* Item being dragged */}
        {s.ghost && showCursor && (
          <div
            className="absolute z-10"
            style={{
              left: s.cursor.x - (s.ghost.kind === "tile" ? 14 : 30),
              top: s.cursor.y - (s.ghost.kind === "tile" ? 12 : 10),
              transition: `left ${move}, top ${move}`,
            }}
          >
            <div className="builder-lift">
              {s.ghost.kind === "tile" ? (
                <span className="flex items-center gap-1.5 rounded-md border border-blue-400 bg-white/95 px-2 py-1.5 text-[9px] font-semibold text-blue-700 shadow-xl shadow-blue-900/20">
                  <Icon name={s.ghost.type} className="h-3 w-3" />
                  {tiles.find((t) => t.type === s.ghost?.type)?.label}
                </span>
              ) : (
                <div className="origin-top-left scale-50 rounded-lg opacity-90 shadow-2xl ring-2 ring-blue-500" style={{ width: BW, height: HEIGHTS[s.ghost.type] }}>
                  <Widget type={s.ghost.type} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cursor */}
        {showCursor && (
          <div className="pointer-events-none absolute z-20" style={{ left: s.cursor.x, top: s.cursor.y, transition: `left ${move}, top ${move}` }}>
            {s.click !== null && <span key={s.click} className="builder-click absolute -left-3 -top-3 h-6 w-6 rounded-full border-2 border-blue-500" />}
            {s.grab ? (
              <svg width="18" height="18" viewBox="0 0 18 18" className="relative -left-2 -top-2 drop-shadow" aria-hidden>
                <path
                  d="M5 8V6.5a1.2 1.2 0 012.4 0V8V5.5a1.2 1.2 0 012.4 0V8V6a1.2 1.2 0 012.4 0v2.5-1a1.2 1.2 0 012.4 0V11a5 5 0 01-5 5H9.5A4.5 4.5 0 015 11.5L3.6 9.4a1.2 1.2 0 012-1.3z"
                  fill="white"
                  stroke="#0f172a"
                  strokeWidth="1.1"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" className="relative drop-shadow" aria-hidden>
                <path d="M1 1l5.5 15 2.2-6.3L15 7.5z" fill="#0f172a" stroke="white" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        )}
      </div>
    </DemoFrame>
  );
}
