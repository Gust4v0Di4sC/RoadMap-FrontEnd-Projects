import React, { useEffect, useMemo, useRef, useState } from "react";
import type  {   DragEndEvent,
  DragStartEvent,} from "@dnd-kit/core"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDroppable,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

/* =========================
   Helpers
========================= */

type ViewMode = "table" | "card";

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const uid = () => Math.random().toString(16).slice(2);

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function copy(text: string) {
  navigator.clipboard.writeText(text);
}

function isEditableTarget(el: EventTarget | null) {
  const t = el as HTMLElement | null;
  if (!t) return false;
  const tag = t.tagName?.toLowerCase();
  return tag === "input" || tag === "textarea" || t.isContentEditable;
}

type GridConfig = { cols: number; rows: number; gap: number };

function makeGridCss(grid: GridConfig): React.CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: `repeat(${grid.cols}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${grid.rows}, minmax(0, 1fr))`,
    gap: `${grid.gap}px`,
  };
}

function getSnappedCellFromPointer(containerRect: DOMRect, grid: GridConfig, pointer: { x: number; y: number }) {
  const x = pointer.x - containerRect.left;
  const y = pointer.y - containerRect.top;

  const totalGapX = (grid.cols - 1) * grid.gap;
  const totalGapY = (grid.rows - 1) * grid.gap;
  const cellW = (containerRect.width - totalGapX) / grid.cols;
  const cellH = (containerRect.height - totalGapY) / grid.rows;

  const colFloat = x / (cellW + grid.gap);
  const rowFloat = y / (cellH + grid.gap);

  const col = clamp(Math.floor(colFloat) + 1, 1, grid.cols);
  const row = clamp(Math.floor(rowFloat) + 1, 1, grid.rows);

  return { col, row };
}

/* =========================
   UI Bits
========================= */

function NumberField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max?: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="text-xs text-slate-300">
      <span className="block">{label}</span>
      <input
        className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-2 py-1 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-sky-400/40"
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value || min))}
      />
    </label>
  );
}

function Segmented({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  return (
    <div className="grid grid-cols-2 rounded-xl border border-slate-800 bg-slate-900 p-1">
      <button
        onClick={() => onChange("table")}
        className={cx(
          "rounded-lg px-3 py-2 text-xs font-extrabold",
          value === "table" ? "bg-sky-400 text-slate-950" : "text-slate-300 hover:bg-slate-800"
        )}
      >
        📋 Tabela
      </button>
      <button
        onClick={() => onChange("card")}
        className={cx(
          "rounded-lg px-3 py-2 text-xs font-extrabold",
          value === "card" ? "bg-sky-400 text-slate-950" : "text-slate-300 hover:bg-slate-800"
        )}
      >
        🧩 Cards
      </button>
    </div>
  );
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="text-xs font-extrabold text-slate-300">{title}</div>
        <button
          onClick={() => copy(code)}
          className="rounded-lg border border-slate-800 bg-slate-900 px-2 py-1 text-[11px] font-bold text-sky-300 hover:bg-slate-800"
        >
          Copiar código
        </button>
      </div>
      <pre className="max-h-[260px] overflow-auto p-3 text-xs text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function GridOverlay({ cols, rows }: { cols: number; rows: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="relative border-r border-sky-400/15">
            <span className="absolute left-1 top-1 text-[10px] font-bold text-sky-400/80">
              {i + 1}
            </span>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 grid" style={{ gridTemplateRows: `repeat(${rows}, 1fr)` }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="relative border-b border-sky-400/15">
            <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] font-bold text-sky-400/80">
              {i + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================
   DND Primitives
========================= */

function DroppableContainer({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={cx(
        "relative rounded-2xl border border-dashed border-slate-700 bg-slate-950/60",
        isOver && "ring-2 ring-sky-400/70",
        className
      )}
    >
      {children}
    </div>
  );
}

function DraggableWrap({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, listeners, attributes, transform, isDragging } = useDraggable({ id });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: transform ? CSS.Translate.toString(transform) : undefined,
        opacity: isDragging ? 0.65 : 1,
        touchAction: "none",
      }}
    >
      {children}
    </div>
  );
}

/* =========================
   TABLE MODE (real table grid)
========================= */

type TableCell = { id: string; text: string };

function makeTable(rows: number, cols: number): TableCell[][] {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      id: `cell-${r}-${c}`,
      text: r === 0 ? `Header ${c + 1}` : `R${r + 1}C${c + 1}`,
    }))
  );
}

function cellLabel(r: number, c: number) {
  const col = String.fromCharCode("A".charCodeAt(0) + c);
  return `${col}${r + 1}`;
}

/* =========================
   CARD MODE (grid + spans + nesting)
========================= */

type ContainerId = string;
type ItemId = string;

type CardItem = {
  id: ItemId;
  parent: ContainerId; // 'root' or another item id
  col: number; // 1-based
  row: number; // 1-based
  w: number;
  h: number;
  title: string;
  innerGrid?: GridConfig; // if becomes a container
};

function collides(a: CardItem, b: CardItem) {
  const ax2 = a.col + a.w - 1;
  const ay2 = a.row + a.h - 1;
  const bx2 = b.col + b.w - 1;
  const by2 = b.row + b.h - 1;
  const overlapX = a.col <= bx2 && ax2 >= b.col;
  const overlapY = a.row <= by2 && ay2 >= b.row;
  return overlapX && overlapY;
}

function findNearestFreeSpot(
  desired: { col: number; row: number },
  moving: CardItem,
  siblings: CardItem[],
  grid: GridConfig
) {
  for (let radius = 0; radius <= Math.max(grid.cols, grid.rows); radius++) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const col = clamp(desired.col + dx, 1, grid.cols - moving.w + 1);
        const row = clamp(desired.row + dy, 1, grid.rows - moving.h + 1);
        const candidate: CardItem = { ...moving, col, row };
        const hit = siblings.some((s) => s.id !== moving.id && collides(candidate, s));
        if (!hit) return { col, row };
      }
    }
  }
  return {
    col: clamp(desired.col, 1, grid.cols - moving.w + 1),
    row: clamp(desired.row, 1, grid.rows - moving.h + 1),
  };
}

/* =========================
   CODE GEN (CSS / Tailwind / Bootstrap)
========================= */

function genCssTable(rows: number, cols: number) {
  return `/* Table Mode - CSS */
.table {
  display: grid;
  grid-template-columns: repeat(${cols}, 1fr);
  border: 1px solid #334155;
}
.cell {
  border: 1px solid #1f2937;
  padding: 12px;
}`;
}

function genTailwindTable(cols: number) {
  return `<!-- Table Mode - Tailwind -->
<div class="grid grid-cols-${cols} border border-slate-700">
  <div class="border border-slate-800 p-3">Cell</div>
</div>`;
}

function genBootstrapTable() {
  return `<!-- Table Mode - Bootstrap (tabela clássica) -->
<table class="table table-bordered">
  <thead><tr><th>Header</th></tr></thead>
  <tbody><tr><td>Cell</td></tr></tbody>
</table>`;
}

function genCssCards(grid: GridConfig) {
  return `/* Card Mode - CSS Grid */
.container {
  display: grid;
  grid-template-columns: repeat(${grid.cols}, 1fr);
  grid-template-rows: repeat(${grid.rows}, 1fr);
  gap: ${grid.gap}px;
}
.card {
  border-radius: 16px;
  border: 1px solid #334155;
  background: rgba(30, 41, 59, .6);
}`;
}

function genTailwindCards(grid: GridConfig) {
  // Tailwind não gera classes dinâmicas reais; isso é “preview/template”.
  return `<!-- Card Mode - Tailwind (template) -->
<div class="grid grid-cols-${grid.cols} gap-3">
  <div class="col-span-3 row-span-2 rounded-2xl border border-slate-700 bg-slate-800/60 p-4">Card</div>
</div>`;
}

function genBootstrapCards() {
  return `<!-- Card Mode - Bootstrap (grid via row/col) -->
<div class="container">
  <div class="row g-3">
    <div class="col-4"><div class="card"><div class="card-body">Card</div></div></div>
    <div class="col-8"><div class="card"><div class="card-body">Card</div></div></div>
  </div>
</div>`;
}

/* =========================
   APP
========================= */

export default function App() {
  const [mode, setMode] = useState<ViewMode>("card");
  const [showOverlay, setShowOverlay] = useState(true);

  /* -------- TABLE MODE STATE -------- */
  const [tableRows, setTableRows] = useState(5);
  const [tableCols, setTableCols] = useState(5);
  const [tableGap, setTableGap] = useState(0);
  const [table, setTable] = useState<TableCell[][]>(() => makeTable(5, 5));
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);

  /* -------- CARD MODE STATE -------- */
  const [rootGrid, setRootGrid] = useState<GridConfig>({ cols: 12, rows: 8, gap: 12 });
  const [cards, setCards] = useState<CardItem[]>(() => [
    { id: "c1", parent: "root", col: 1, row: 1, w: 4, h: 3, title: "Card A" },
    { id: "c2", parent: "root", col: 5, row: 1, w: 4, h: 2, title: "Card B" },
    { id: "c3", parent: "root", col: 9, row: 1, w: 4, h: 3, title: "Card C" },
  ]);
  const [selectedCardId, setSelectedCardId] = useState<ItemId | null>(null);
  const selectedCard = useMemo(() => cards.find((c) => c.id === selectedCardId) || null, [cards, selectedCardId]);

  const containerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const setContainerRef = (id: string) => (el: HTMLDivElement | null) => {
    containerRefs.current[id] = el;
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overlayLabel, setOverlayLabel] = useState<string>("");

  /* -------- shared keyboard: delete selected -------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return;

      if (mode === "table") {
        if ((e.key === "Delete" || e.key === "Backspace") && selectedCell) {
          e.preventDefault();
          setTable((prev) => {
            const next = prev.map((row) => row.map((c) => ({ ...c })));
            next[selectedCell.r][selectedCell.c].text = "";
            return next;
          });
        }
      }

      if (mode === "card") {
        if ((e.key === "Delete" || e.key === "Backspace") && selectedCard) {
          e.preventDefault();
          removeSelectedCard();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, selectedCell, selectedCard]); // eslint-disable-line react-hooks/exhaustive-deps

  /* =========================
     TABLE MODE DND (swap cell content)
  ========================= */

  const tableGrid: GridConfig = useMemo(
    () => ({ cols: tableCols, rows: tableRows, gap: tableGap }),
    [tableCols, tableRows, tableGap]
  );

  function resizeTable(nextRows: number, nextCols: number) {
    setTableRows(nextRows);
    setTableCols(nextCols);

    setTable((prev) => {
      const currentRows = prev.length;
      const currentCols = prev[0]?.length ?? 0;

      const out: TableCell[][] = [];

      for (let r = 0; r < nextRows; r++) {
        const row: TableCell[] = [];
        for (let c = 0; c < nextCols; c++) {
          if (r < currentRows && c < currentCols) {
            row.push(prev[r][c]);
          } else {
            row.push({ id: `cell-${r}-${c}-${uid()}`, text: r === 0 ? `Header ${c + 1}` : "" });
          }
        }
        out.push(row);
      }
      return out;
    });

    setSelectedCell(null);
  }

  /* =========================
     CARD MODE helpers
  ========================= */

  const getGridForContainer = (containerId: ContainerId): GridConfig => {
    if (containerId === "root") return rootGrid;
    const parent = cards.find((c) => c.id === containerId);
    return parent?.innerGrid || { cols: 6, rows: 4, gap: 10 };
  };

  const cardsIn = (containerId: ContainerId) => cards.filter((c) => c.parent === containerId);

  const ensureInnerGrid = (itemId: ItemId) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === itemId
          ? { ...c, innerGrid: c.innerGrid || { cols: 6, rows: 4, gap: 10 } }
          : c
      )
    );
  };

  const addRootCard = () => {
    const grid = getGridForContainer("root");
    const siblings = cardsIn("root");
    const base: CardItem = {
      id: "c_" + uid(),
      parent: "root",
      col: 1,
      row: 1,
      w: 3,
      h: 2,
      title: `Card ${siblings.length + 1}`,
    };

    const spot = findNearestFreeSpot({ col: 1, row: 1 }, base, siblings, grid);
    setCards((p) => [...p, { ...base, ...spot }]);
    setSelectedCardId(base.id);
  };

  const addInsideSelected = () => {
    if (!selectedCard) return;
    ensureInnerGrid(selectedCard.id);

    const grid = getGridForContainer(selectedCard.id);
    const siblings = cardsIn(selectedCard.id);
    const base: CardItem = {
      id: "c_" + uid(),
      parent: selectedCard.id,
      col: 1,
      row: 1,
      w: 2,
      h: 1,
      title: `Inner ${siblings.length + 1}`,
    };
    const spot = findNearestFreeSpot({ col: 1, row: 1 }, base, siblings, grid);
    setCards((p) => [...p, { ...base, ...spot }]);
  };

  const removeSelectedCard = () => {
    if (!selectedCard) return;

    // remove selected + descendants
    const toRemove = new Set<string>();
    const stack = [selectedCard.id];
    while (stack.length) {
      const id = stack.pop()!;
      toRemove.add(id);
      cards.forEach((c) => {
        if (c.parent === id) stack.push(c.id);
      });
    }

    setCards((p) => p.filter((c) => !toRemove.has(c.id)));
    setSelectedCardId(null);
  };

  /* =========================
     DND START / END (mode-aware)
  ========================= */

  const onDragStart = (e: DragStartEvent) => {
    const id = String(e.active.id);
    setActiveId(id);

    if (mode === "table") {
      // label from cell
      const [, r, c] = id.split(":"); // tbl:r:c
      const rr = Number(r);
      const cc = Number(c);
      const t = table?.[rr]?.[cc]?.text || cellLabel(rr, cc);
      setOverlayLabel(t || cellLabel(rr, cc));
      return;
    }

    // card
    const it = cards.find((c) => c.id === id);
    setOverlayLabel(it?.title || "Card");
  };

  const onDragEnd = (e: DragEndEvent) => {
    const active = String(e.active.id);
    const over = e.over?.id ? String(e.over.id) : null;
    setActiveId(null);

    if (!over) return;

    /* ---- TABLE MODE: swap content ---- */
    if (mode === "table") {
      if (!active.startsWith("tbl:") || !over.startsWith("tbl:")) return;

      const [, ar, ac] = active.split(":");
      const [, or, oc] = over.split(":");
      const aR = Number(ar), aC = Number(ac), oR = Number(or), oC = Number(oc);

      if (aR === oR && aC === oC) return;

      setTable((prev) => {
        const next = prev.map((row) => row.map((c) => ({ ...c })));
        const tmp = next[aR][aC].text;
        next[aR][aC].text = next[oR][oC].text;
        next[oR][oC].text = tmp;
        return next;
      });
      setSelectedCell({ r: oR, c: oC });
      return;
    }

    /* ---- CARD MODE ---- */
    const it = cards.find((c) => c.id === active);
    if (!it) return;

    // droppables:
    // - "container:<id>" root or card container
    // - "item:<id>" drop on top of a card to nest into it
    if (over.startsWith("item:")) {
      const targetId = over.replace("item:", "");
      if (targetId === it.id) return;

      // ensure target becomes container
      ensureInnerGrid(targetId);

      const grid = getGridForContainer(targetId);
      const siblings = cardsIn(targetId);

      const moved: CardItem = { ...it, parent: targetId, col: 1, row: 1 };
      const spot = findNearestFreeSpot({ col: 1, row: 1 }, moved, siblings, grid);

      setCards((prev) => prev.map((c) => (c.id === it.id ? { ...c, parent: targetId, ...spot } : c)));
      setSelectedCardId(it.id);
      return;
    }

    if (over.startsWith("container:")) {
      const containerId = over.replace("container:", "");
      const grid = getGridForContainer(containerId);
      const el = containerRefs.current[containerId];
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const pointer = {
        x: (e.activatorEvent as PointerEvent)?.clientX ?? rect.left + rect.width / 2,
        y: (e.activatorEvent as PointerEvent)?.clientY ?? rect.top + rect.height / 2,
      };

      const snapped = getSnappedCellFromPointer(rect, grid, pointer);

      const desired = {
        col: clamp(snapped.col, 1, grid.cols - it.w + 1),
        row: clamp(snapped.row, 1, grid.rows - it.h + 1),
      };

      const siblings = cards
        .filter((c) => c.parent === containerId)
        .filter((c) => c.id !== it.id);

      const spot = findNearestFreeSpot(desired, { ...it, parent: containerId }, siblings, grid);

      setCards((prev) =>
        prev.map((c) =>
          c.id === it.id
            ? { ...c, parent: containerId, col: spot.col, row: spot.row }
            : c
        )
      );
      setSelectedCardId(it.id);
    }
  };

  /* =========================
     Render: TABLE MODE
  ========================= */

  const tableCode = useMemo(() => {
    return {
      css: genCssTable(tableRows, tableCols),
      tw: genTailwindTable(tableCols),
      bs: genBootstrapTable(),
    };
  }, [tableRows, tableCols]);

  function TableCellDroppable({ r, c, text }: { r: number; c: number; text: string }) {
    const id = `tbl:${r}:${c}`;
    const { setNodeRef, isOver } = useDroppable({ id });
    const { setNodeRef: setDragRef, listeners, attributes, transform, isDragging } = useDraggable({ id });

    const style: React.CSSProperties = {
      transform: transform ? CSS.Translate.toString(transform) : undefined,
      opacity: isDragging ? 0.6 : 1,
    };

    const selected = selectedCell?.r === r && selectedCell?.c === c;

    return (
      <div ref={setNodeRef} className={cx(isOver && "ring-2 ring-sky-400/40")}>
        <div
          ref={setDragRef}
          {...listeners}
          {...attributes}
          style={style}
          onClick={() => setSelectedCell({ r, c })}
          className={cx(
            "relative h-full w-full select-none",
            "border border-slate-800 bg-slate-950/20 px-3 py-3",
            "cursor-grab active:cursor-grabbing",
            selected && "ring-2 ring-sky-400/70"
          )}
        >
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400">{cellLabel(r, c)}</span>
            {r === 0 ? (
              <span className="text-[10px] font-bold text-amber-300/80">HEADER</span>
            ) : null}
          </div>
          <div className={cx("text-xs text-slate-200", r === 0 && "font-semibold")}>
            {text || <span className="text-slate-500">vazio</span>}
          </div>
        </div>
      </div>
    );
  }

  function renderTable() {
    return (
      <div className="space-y-4">
        <DroppableContainer id="table-root" className="p-3">
          <div
            className="relative rounded-xl bg-slate-950/30 p-2"
            style={makeGridCss(tableGrid)}
          >
            {showOverlay ? <GridOverlay cols={tableCols} rows={tableRows} /> : null}

            {table.map((row, r) =>
              row.map((cell, c) => (
                <div key={cell.id} style={{ gridColumn: `${c + 1} / span 1`, gridRow: `${r + 1} / span 1` }}>
                  <TableCellDroppable r={r} c={c} text={cell.text} />
                </div>
              ))
            )}
          </div>
        </DroppableContainer>

        <div className="grid grid-cols-1 gap-4">
          <CodeBlock title="CSS (Table Mode)" code={tableCode.css} />
          <CodeBlock title="Tailwind (Table Mode)" code={tableCode.tw} />
          <CodeBlock title="Bootstrap (Table Mode)" code={tableCode.bs} />
        </div>
      </div>
    );
  }

  /* =========================
     Render: CARD MODE
  ========================= */

  const cardCode = useMemo(() => {
    return {
      css: genCssCards(rootGrid),
      tw: genTailwindCards(rootGrid),
      bs: genBootstrapCards(),
    };
  }, [rootGrid]);

  function ItemDropZone({ itemId }: { itemId: string }) {
    const { setNodeRef, isOver } = useDroppable({ id: `item:${itemId}` });
    return (
      <div
        ref={setNodeRef}
        className={cx(
          "absolute inset-0 rounded-2xl",
          isOver && "ring-2 ring-emerald-400/70"
        )}
      />
    );
  }

  function renderCardContainer(containerId: ContainerId, cfg: GridConfig, title: string, heightClass: string) {
    const list = cardsIn(containerId);

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-extrabold uppercase tracking-wide text-slate-300">{title}</div>
          <div className="text-[11px] text-slate-400">
            {cfg.cols}×{cfg.rows} • gap {cfg.gap}px
          </div>
        </div>

        <DroppableContainer id={`container:${containerId}`} className="p-3">
          <div
            ref={(el) => setContainerRef(containerId)(el)}
            className={cx("relative w-full rounded-xl bg-slate-950/30 p-2", heightClass)}
            style={makeGridCss(cfg)}
          >
            {showOverlay ? <GridOverlay cols={cfg.cols} rows={cfg.rows} /> : null}

            {list.map((it) => {
              const selected = selectedCardId === it.id;
              return (
                <div
                  key={it.id}
                  style={{
                    gridColumn: `${it.col} / span ${it.w}`,
                    gridRow: `${it.row} / span ${it.h}`,
                  }}
                >
                  <DraggableWrap id={it.id}>
                    <div
                      onClick={() => setSelectedCardId(it.id)}
                      className={cx(
                        "relative h-full w-full rounded-2xl border border-slate-700",
                        "bg-gradient-to-b from-slate-800/70 to-slate-900/60",
                        "shadow-[0_10px_30px_-20px_rgba(0,0,0,.8)]",
                        "cursor-grab active:cursor-grabbing select-none",
                        selected && "ring-2 ring-sky-400/80"
                      )}
                    >
                      {/* drop on top to nest */}
                      <ItemDropZone itemId={it.id} />

                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="text-sm font-extrabold text-slate-100">{it.title}</div>
                        <div className="text-[11px] font-bold text-slate-400">
                          {it.w}×{it.h}
                        </div>
                      </div>

                      {/* inner grid */}
                      {it.innerGrid ? (
                        <div className="px-3 pb-3">
                          <div className="rounded-xl border border-slate-700 bg-slate-950/40 p-2">
                            <div className="mb-2 text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                              Conteúdo (Inner Grid)
                            </div>

                            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/30 p-2">
                              {renderInnerGrid(it.id, it.innerGrid)}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="px-4 pb-4 text-xs text-slate-400">
                          Dica: solte um item <b>em cima</b> deste card para colocar dentro dele.
                        </div>
                      )}
                    </div>
                  </DraggableWrap>
                </div>
              );
            })}
          </div>
        </DroppableContainer>
      </div>
    );
  }

  function renderInnerGrid(containerId: string, cfg: GridConfig) {
    const list = cardsIn(containerId);

    return (
      <div
        ref={(el) => setContainerRef(containerId)(el)}
        className="relative h-[190px] w-full rounded-xl bg-slate-950/20 p-2"
        style={makeGridCss(cfg)}
      >
        {showOverlay ? <GridOverlay cols={cfg.cols} rows={cfg.rows} /> : null}

        {list.map((it) => {
          const selected = selectedCardId === it.id;
          return (
            <div
              key={it.id}
              style={{
                gridColumn: `${it.col} / span ${it.w}`,
                gridRow: `${it.row} / span ${it.h}`,
              }}
            >
              <DraggableWrap id={it.id}>
                <div
                  onClick={() => setSelectedCardId(it.id)}
                  className={cx(
                    "relative h-full w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2",
                    "cursor-grab active:cursor-grabbing",
                    selected && "ring-2 ring-sky-400/80"
                  )}
                >
                  <ItemDropZone itemId={it.id} />
                  <div className="text-xs font-extrabold text-slate-200">{it.title}</div>
                  <div className="text-[10px] font-bold text-slate-400">
                    col {it.col}, row {it.row} • {it.w}×{it.h}
                  </div>
                </div>
              </DraggableWrap>
            </div>
          );
        })}
      </div>
    );
  }

  function renderCards() {
    return (
      <div className="space-y-4">
        {renderCardContainer("root", rootGrid, "Canvas (Cards)", "min-h-[520px]")}

        <div className="grid grid-cols-1 gap-4">
          <CodeBlock title="CSS (Card Mode)" code={cardCode.css} />
          <CodeBlock title="Tailwind (Card Mode)" code={cardCode.tw} />
          <CodeBlock title="Bootstrap (Card Mode)" code={cardCode.bs} />
        </div>
      </div>
    );
  }

  /* =========================
     Sidebar content
  ========================= */

  const sidebarTitle = mode === "table" ? "Table Mode" : "Card Mode";

  return (
    <div className="h-screen bg-slate-900 text-slate-100">
      <div className="grid h-full grid-cols-[340px_1fr]">
        {/* Sidebar */}
        <aside className="border-r border-slate-800 bg-slate-950/60 p-4">
          <div className="mb-3">
            <div className="text-sm font-black tracking-tight text-sky-300">Grid Visualizer</div>
            <div className="text-xs text-slate-400">{sidebarTitle}</div>
          </div>

          <Segmented value={mode} onChange={setMode} />

          <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/30 px-3 py-2">
            <div className="text-xs font-bold text-slate-300">Overlay (linhas/colunas)</div>
            <button
              onClick={() => setShowOverlay((v) => !v)}
              className={cx(
                "rounded-lg px-2 py-1 text-[11px] font-extrabold",
                showOverlay ? "bg-emerald-400 text-slate-950" : "bg-slate-800 text-slate-300"
              )}
            >
              {showOverlay ? "ON" : "OFF"}
            </button>
          </div>

          {/* TABLE controls */}
          {mode === "table" ? (
            <div className="mt-3 space-y-3 rounded-2xl border border-slate-800 bg-slate-950/40 p-3">
              <div className="text-xs font-extrabold uppercase tracking-wide text-slate-300">Tabela</div>

              <div className="grid grid-cols-2 gap-2">
                <NumberField
                  label="Rows"
                  value={tableRows}
                  min={1}
                  onChange={(n) => resizeTable(clamp(n, 1, 50), tableCols)}
                />
                <NumberField
                  label="Cols"
                  value={tableCols}
                  min={1}
                  onChange={(n) => resizeTable(tableRows, clamp(n, 1, 26))}
                />
                <div className="col-span-2">
                  <NumberField
                    label="Gap (px)"
                    value={tableGap}
                    min={0}
                    onChange={(n) => setTableGap(clamp(n, 0, 40))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  className="rounded-xl bg-sky-400 px-3 py-2 text-xs font-extrabold text-slate-950 hover:bg-sky-300"
                  onClick={() => resizeTable(tableRows + 1, tableCols)}
                >
                  + Add Row
                </button>
                <button
                  className="rounded-xl bg-sky-400 px-3 py-2 text-xs font-extrabold text-slate-950 hover:bg-sky-300"
                  onClick={() => resizeTable(tableRows, tableCols + 1)}
                >
                  + Add Col
                </button>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-3">
                <div className="text-xs font-bold text-slate-300">Célula selecionada</div>
                {selectedCell ? (
                  <>
                    <div className="mt-2 text-xs text-slate-400">
                      {cellLabel(selectedCell.r, selectedCell.c)}
                    </div>
                    <input
                      className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-900 px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-400/40"
                      value={table[selectedCell.r]?.[selectedCell.c]?.text ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        setTable((prev) => {
                          const next = prev.map((row) => row.map((c) => ({ ...c })));
                          next[selectedCell.r][selectedCell.c].text = v;
                          return next;
                        });
                      }}
                      placeholder="Texto da célula..."
                    />
                    <button
                      className="mt-2 w-full rounded-xl bg-rose-400 px-3 py-2 text-xs font-extrabold text-slate-950 hover:bg-rose-300"
                      onClick={() => {
                        setTable((prev) => {
                          const next = prev.map((row) => row.map((c) => ({ ...c })));
                          next[selectedCell.r][selectedCell.c].text = "";
                          return next;
                        });
                      }}
                    >
                      Limpar célula (Del)
                    </button>
                  </>
                ) : (
                  <div className="mt-2 text-xs text-slate-500">Clique em uma célula.</div>
                )}
              </div>

              <div className="text-[11px] leading-relaxed text-slate-500">
                <b>Como funciona:</b> arraste uma célula e solte em outra para trocar o conteúdo (swap).
              </div>
            </div>
          ) : null}

          {/* CARD controls */}
          {mode === "card" ? (
            <div className="mt-3 space-y-3 rounded-2xl border border-slate-800 bg-slate-950/40 p-3">
              <div className="text-xs font-extrabold uppercase tracking-wide text-slate-300">Canvas (Cards)</div>

              <div className="grid grid-cols-2 gap-2">
                <NumberField
                  label="Cols"
                  value={rootGrid.cols}
                  min={1}
                  onChange={(n) => setRootGrid((g) => ({ ...g, cols: clamp(n, 1, 24) }))}
                />
                <NumberField
                  label="Rows"
                  value={rootGrid.rows}
                  min={1}
                  onChange={(n) => setRootGrid((g) => ({ ...g, rows: clamp(n, 1, 24) }))}
                />
                <div className="col-span-2">
                  <NumberField
                    label="Gap (px)"
                    value={rootGrid.gap}
                    min={0}
                    onChange={(n) => setRootGrid((g) => ({ ...g, gap: clamp(n, 0, 40) }))}
                  />
                </div>
              </div>

              <button
                className="w-full rounded-xl bg-sky-400 px-3 py-2 text-sm font-extrabold text-slate-950 hover:bg-sky-300"
                onClick={addRootCard}
              >
                + Add Card
              </button>

              <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-3">
                <div className="text-xs font-bold text-slate-300">Selecionado</div>

                {!selectedCard ? (
                  <div className="mt-2 text-xs text-slate-500">Clique em um card.</div>
                ) : (
                  <>
                    <div className="mt-2 text-sm font-extrabold text-slate-100">{selectedCard.title}</div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <NumberField
                        label="Col"
                        value={selectedCard.col}
                        min={1}
                        onChange={(n) => {
                          const grid = getGridForContainer(selectedCard.parent);
                          const col = clamp(n, 1, grid.cols - selectedCard.w + 1);
                          setCards((p) => p.map((c) => (c.id === selectedCard.id ? { ...c, col } : c)));
                        }}
                      />
                      <NumberField
                        label="Row"
                        value={selectedCard.row}
                        min={1}
                        onChange={(n) => {
                          const grid = getGridForContainer(selectedCard.parent);
                          const row = clamp(n, 1, grid.rows - selectedCard.h + 1);
                          setCards((p) => p.map((c) => (c.id === selectedCard.id ? { ...c, row } : c)));
                        }}
                      />
                      <NumberField
                        label="W (colSpan)"
                        value={selectedCard.w}
                        min={1}
                        onChange={(n) => {
                          const grid = getGridForContainer(selectedCard.parent);
                          const w = clamp(n, 1, grid.cols);
                          const col = clamp(selectedCard.col, 1, grid.cols - w + 1);
                          setCards((p) => p.map((c) => (c.id === selectedCard.id ? { ...c, w, col } : c)));
                        }}
                      />
                      <NumberField
                        label="H (rowSpan)"
                        value={selectedCard.h}
                        min={1}
                        onChange={(n) => {
                          const grid = getGridForContainer(selectedCard.parent);
                          const h = clamp(n, 1, grid.rows);
                          const row = clamp(selectedCard.row, 1, grid.rows - h + 1);
                          setCards((p) => p.map((c) => (c.id === selectedCard.id ? { ...c, h, row } : c)));
                        }}
                      />
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <button
                        className="rounded-xl bg-emerald-400 px-3 py-2 text-xs font-extrabold text-slate-950 hover:bg-emerald-300"
                        onClick={() => ensureInnerGrid(selectedCard.id)}
                      >
                        Tornar container
                      </button>
                      <button
                        className="rounded-xl bg-amber-400 px-3 py-2 text-xs font-extrabold text-slate-950 hover:bg-amber-300"
                        onClick={addInsideSelected}
                      >
                        + Add inside
                      </button>
                    </div>

                    <button
                      className="mt-2 w-full rounded-xl bg-rose-400 px-3 py-2 text-xs font-extrabold text-slate-950 hover:bg-rose-300"
                      onClick={removeSelectedCard}
                    >
                      Remover (Del)
                    </button>

                    <div className="mt-2 text-[11px] leading-relaxed text-slate-500">
                      <b>Nesting:</b> arraste um card e solte <b>em cima</b> de outro para colocar dentro dele.
                      Depois, você pode posicionar dentro do grid interno.
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : null}
        </aside>

        {/* Main */}
        <main className="overflow-auto p-5">
          <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
            {mode === "table" ? (
              renderTable()
            ) : (
              renderCards()
            )}

            <DragOverlay>
              {activeId ? (
                <div className="rounded-xl border border-slate-700 bg-slate-900/95 px-3 py-2 text-sm font-extrabold text-slate-100 shadow-xl">
                  {overlayLabel || "Movendo"}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </main>
      </div>
    </div>
  );
}
