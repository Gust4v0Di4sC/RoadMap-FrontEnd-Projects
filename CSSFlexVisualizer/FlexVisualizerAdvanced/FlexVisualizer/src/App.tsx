import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToParentElement } from "@dnd-kit/modifiers";

const directions = ["row", "row-reverse", "column", "column-reverse"] as const;
const justifyOptions = [
  "flex-start",
  "center",
  "flex-end",
  "space-between",
  "space-around",
  "space-evenly",
] as const;
const alignOptions = ["stretch", "flex-start", "center", "flex-end"] as const;
const wrapOptions = ["nowrap", "wrap"] as const;

type Direction = (typeof directions)[number];
type Justify = (typeof justifyOptions)[number];
type Align = (typeof alignOptions)[number];
type Wrap = (typeof wrapOptions)[number];

type FlexItemModel = {
  id: string;
  label: string;
  // “tamanho” por item: basis + grow/shrink
  basisPx: number; // px
  grow: number;
  shrink: number;
  alignSelf: "auto" | Align;
};

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nextLabel(n: number) {
  return `Item ${n}`;
}

export default function FlexboxVisualizer() {
  const [direction, setDirection] = useState<Direction>("row");
  const [justify, setJustify] = useState<Justify>("flex-start");
  const [align, setAlign] = useState<Align>("stretch");
  const [wrap, setWrap] = useState<Wrap>("wrap");
  const [gap, setGap] = useState(12);

  const [items, setItems] = useState<FlexItemModel[]>(() => {
    const base = [1, 2, 3].map((i) => ({
      id: uid(),
      label: nextLabel(i),
      basisPx: 120,
      grow: 0,
      shrink: 1,
      alignSelf: "auto" as const,
    }));
    return base;
  });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // importante: sem isso, em alguns ambientes o drag “não inicia”
      activationConstraint: { distance: 4 },
    })
  );

  const ids = useMemo(() => items.map((i) => i.id), [items]);
  const selected = useMemo(
    () => items.find((i) => i.id === selectedId) || null,
    [items, selectedId]
  );
  const activeIndex = useMemo(
    () => (activeId ? items.findIndex((i) => i.id === activeId) : -1),
    [activeId, items]
  );

  const addItem = () => {
    setItems((prev) => {
      const n = prev.length + 1;
      return [
        ...prev,
        {
          id: uid(),
          label: nextLabel(n),
          basisPx: 120,
          grow: 0,
          shrink: 1,
          alignSelf: "auto",
        },
      ];
    });
  };

  const removeSelected = () => {
    if (!selectedId) return;
    setItems((prev) => prev.filter((i) => i.id !== selectedId));
    setSelectedId(null);
  };

  const updateSelected = (patch: Partial<FlexItemModel>) => {
    if (!selectedId) return;
    setItems((prev) =>
      prev.map((i) => (i.id === selectedId ? { ...i, ...patch } : i))
    );
  };

  const cssOut = useMemo(() => {
    return [
      ".container {",
      "  display: flex;",
      `  flex-direction: ${direction};`,
      `  justify-content: ${justify};`,
      `  align-items: ${align};`,
      `  flex-wrap: ${wrap};`,
      `  gap: ${gap}px;`,
      "}",
      "",
      ".item {",
      "  /* por item */",
      "  /* flex: grow shrink basis */",
      "}",
    ].join("\n");
  }, [direction, justify, align, wrap, gap]);

  const twOut = useMemo(() => {
    const dirMap: Record<Direction, string> = {
      row: "flex-row",
      "row-reverse": "flex-row-reverse",
      column: "flex-col",
      "column-reverse": "flex-col-reverse",
    };
    const justifyMap: Record<Justify, string> = {
      "flex-start": "justify-start",
      center: "justify-center",
      "flex-end": "justify-end",
      "space-between": "justify-between",
      "space-around": "justify-around",
      "space-evenly": "justify-evenly",
    };
    const alignMap: Record<Align, string> = {
      stretch: "items-stretch",
      "flex-start": "items-start",
      center: "items-center",
      "flex-end": "items-end",
    };

    return [
      "flex",
      dirMap[direction],
      justifyMap[justify],
      alignMap[align],
      wrap === "wrap" ? "flex-wrap" : "flex-nowrap",
      `gap-[${gap}px]`,
    ].join(" ");
  }, [direction, justify, align, wrap, gap]);

  const bsOut = useMemo(() => {
    // Observação: o Bootstrap não tem “basis px arbitrário” como Tailwind.
    const dirMap: Record<Direction, string> = {
      row: "flex-row",
      "row-reverse": "flex-row-reverse",
      column: "flex-column",
      "column-reverse": "flex-column-reverse",
    };
    const justifyMap: Record<Justify, string> = {
      "flex-start": "justify-content-start",
      center: "justify-content-center",
      "flex-end": "justify-content-end",
      "space-between": "justify-content-between",
      "space-around": "justify-content-around",
      "space-evenly": "justify-content-evenly",
    };
    const alignMap: Record<Align, string> = {
      stretch: "align-items-stretch",
      "flex-start": "align-items-start",
      center: "align-items-center",
      "flex-end": "align-items-end",
    };

    return [
      "d-flex",
      dirMap[direction],
      justifyMap[justify],
      alignMap[align],
      wrap === "wrap" ? "flex-wrap" : "flex-nowrap",
      "/* gap: use gap-0..5 (depende da versão) */",
    ].join(" ");
  }, [direction, justify, align, wrap]);

  const tsxOut = useMemo(() => {
    const containerStyle = `{
  display: "flex",
  flexDirection: "${direction}",
  justifyContent: "${justify}",
  alignItems: "${align}",
  flexWrap: "${wrap}",
  gap: "${gap}px",
}`;

    const itemStyleExample = `{
  flex: "grow shrink basis",
  // ex: flex: "${selected?.grow ?? 0} ${selected?.shrink ?? 1} ${selected?.basisPx ?? 120}px" 
}`;

    return [
      "// JSX/TSX (exemplo)\n",
      "<div className=\"container\" style=" + containerStyle + ">",
      "  {items.map((item) => (",
      "    <div\n      key={item.id}\n      className=\"item\"\n      style={{ flex: `${item.grow} ${item.shrink} ${item.basisPx}px`, alignSelf: item.alignSelf }}\n    >",
      "      {item.label}",
      "    </div>",
      "  ))}",
      "</div>",
      "\n// item style\n" + itemStyleExample,
    ].join("\n");
  }, [direction, justify, align, wrap, gap, selected]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 grid grid-cols-[360px_1fr]">
      {/* Controls */}
      <aside className="border-r border-zinc-800 p-4 space-y-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Flex Visualizer</h2>
          <span className="text-xs text-zinc-400">Figma-like (reorder)</span>
        </div>

        <Panel title="Container">
          <Control label="Direction">
            <Select value={direction} onChange={setDirection} options={[...directions]} />
          </Control>

          <Control label="Justify Content">
            <Select value={justify} onChange={setJustify} options={[...justifyOptions]} />
          </Control>

          <Control label="Align Items">
            <Select value={align} onChange={setAlign} options={[...alignOptions]} />
          </Control>

          <Control label="Wrap">
            <Select value={wrap} onChange={setWrap} options={[...wrapOptions]} />
          </Control>

          <Control label={`Gap: ${gap}px`}>
            <input
              type="range"
              min={0}
              max={48}
              value={gap}
              onChange={(e) => setGap(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </Control>
        </Panel>

        <Panel title="Itens">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={addItem}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500 transition px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              + Add
            </button>
            <button
              onClick={removeSelected}
              disabled={!selectedId}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 transition px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-500"
            >
              − Remove
            </button>
          </div>

          <div className="mt-3">
            <label className="text-[11px] text-zinc-400 uppercase tracking-wide">
              Selecione um item no preview
            </label>
            <div className="mt-2 rounded-xl border border-zinc-800 bg-zinc-900/60 p-2">
              {selected ? (
                <div className="space-y-3">
                  <div className="text-sm font-semibold">{selected.label}</div>

                  <Control label={`Basis: ${selected.basisPx}px`}>
                    <input
                      type="range"
                      min={40}
                      max={420}
                      value={selected.basisPx}
                      onChange={(e) =>
                        updateSelected({ basisPx: Number(e.target.value) })
                      }
                      className="w-full accent-indigo-500"
                    />
                  </Control>

                  <div className="grid grid-cols-2 gap-2">
                    <Control label={`Grow: ${selected.grow}`}>
                      <input
                        type="range"
                        min={0}
                        max={6}
                        value={selected.grow}
                        onChange={(e) =>
                          updateSelected({ grow: Number(e.target.value) })
                        }
                        className="w-full accent-indigo-500"
                      />
                    </Control>
                    <Control label={`Shrink: ${selected.shrink}`}>
                      <input
                        type="range"
                        min={0}
                        max={3}
                        value={selected.shrink}
                        onChange={(e) =>
                          updateSelected({ shrink: Number(e.target.value) })
                        }
                        className="w-full accent-indigo-500"
                      />
                    </Control>
                  </div>

                  <Control label="Align Self">
                    <Select
                      value={selected.alignSelf}
                      onChange={(v) =>
                        updateSelected({
                          alignSelf: v as FlexItemModel["alignSelf"],
                        })
                      }
                      options={["auto", ...alignOptions]}
                    />
                  </Control>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Dica: para layouts complexos, use <strong>wrap</strong> + basis
                    + grow e veja o comportamento real do Flex.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-zinc-400">
                  Clique em um item no preview para editar o tamanho.
                </p>
              )}
            </div>
          </div>
        </Panel>

        <Panel title="Instalação">
          <pre className="rounded-xl bg-black/60 border border-zinc-800 p-3 text-xs text-zinc-200 overflow-auto">
            pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities @dnd-kit/modifiers
          </pre>
          <p className="text-xs text-zinc-400 leading-relaxed mt-2">
            Se você estiver usando um componente com pai tendo <code>overflow-hidden</code>
            ou <code>pointer-events</code>, isso pode bloquear o drag. Aqui já está
            com <strong>touch-none</strong> no item.
          </p>
        </Panel>
      </aside>

      {/* Preview + Outputs (preview expande naturalmente) */}
      <main className="p-6 min-h-screen flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-300">Preview</h3>
          <span className="text-xs text-zinc-400">
            Itens: {items.length}
            {activeId ? ` • Dragging ${activeIndex + 1}` : ""}
          </span>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-sm flex-1">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToParentElement]}
            onDragStart={(e) => setActiveId(String(e.active.id))}
            onDragCancel={() => setActiveId(null)}
            onDragEnd={(e) => {
              const { active, over } = e;
              setActiveId(null);
              if (!over) return;
              if (active.id !== over.id) {
                setItems((prev) => {
                  const oldIndex = prev.findIndex((i) => i.id === active.id);
                  const newIndex = prev.findIndex((i) => i.id === over.id);
                  const moved = arrayMove(prev, oldIndex, newIndex);
                  return moved;
                });
              }
            }}
          >
            <div
              className="flex min-h-[280px] rounded-xl border border-zinc-800 bg-zinc-950/40 p-4"
              style={{
                flexDirection: direction,
                justifyContent: justify,
                alignItems: align,
                flexWrap: wrap,
                gap: `${gap}px`,
              }}
            >
              <SortableContext items={ids} strategy={rectSortingStrategy}>
                {items.map((item, idx) => (
                  <FlexSortableItem
                    key={item.id}
                    id={item.id}
                    index={idx}
                    label={item.label}
                    isSelected={item.id === selectedId}
                    onSelect={() => setSelectedId(item.id)}
                    style={{
                      flex: `${item.grow} ${item.shrink} ${item.basisPx}px`,
                      alignSelf: item.alignSelf === "auto" ? undefined : item.alignSelf,
                    }}
                  />
                ))}
              </SortableContext>
            </div>

            {/* Overlay: faz o item seguir o cursor (Figma-like) */}
            <DragOverlay dropAnimation={null}>
              {activeId ? (
                <div className="touch-none select-none rounded-2xl bg-indigo-500/90 px-4 py-3 text-sm font-semibold shadow-2xl ring-1 ring-indigo-300/30">
                  {items.find((i) => i.id === activeId)?.label ?? "Item"}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <CodeBlock title="CSS">{cssOut}</CodeBlock>
          <CodeBlock title="Tailwind">{twOut}</CodeBlock>
          <CodeBlock title="Bootstrap">{bsOut}</CodeBlock>
        </div>

        <CodeBlock title="HTML / TSX">{tsxOut}</CodeBlock>

        <Callout>
          <strong>Como o Figma funciona aqui (do jeito certo):</strong> você arrasta,
          o item segue o cursor (overlay), e ao soltar ele entra na posição possível
          do Flexbox. Você também consegue criar layouts complexos ajustando
          <em>basis/grow/shrink</em> por item.
        </Callout>
      </main>
    </div>
  );
}

function FlexSortableItem({
  id,
  index,
  label,
  isSelected,
  onSelect,
  style,
}: {
  id: string;
  index: number;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  style?: React.CSSProperties;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const dndStyle: React.CSSProperties = {
    ...style,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.25 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={dndStyle}
      onClick={onSelect}
      className={
        "touch-none select-none rounded-2xl px-4 py-3 text-sm font-semibold shadow ring-1 " +
        (isSelected
          ? "bg-indigo-600 ring-indigo-300/40"
          : "bg-indigo-700 ring-white/10 hover:bg-indigo-600") +
        " cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-indigo-300/60"
      }
      tabIndex={0}
      {...attributes}
      {...listeners}
      aria-label={`Arraste para mover ${label}`}
      title="Clique para selecionar • Arraste para reordenar"
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-black/25 text-xs">
          {index + 1}
        </span>
        <span className="truncate">{label}</span>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <h3 className="text-sm font-semibold text-zinc-200 mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] text-zinc-400 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

function Select<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: T[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function CodeBlock({ title, children }: { title: string; children: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-zinc-300">{title}</h4>
        <span className="text-[10px] text-zinc-500">output</span>
      </div>
      <pre className="rounded-xl bg-black/60 border border-zinc-800 p-3 text-xs text-emerald-300 overflow-auto whitespace-pre-wrap">
        {children}
      </pre>
    </div>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-4 text-sm text-zinc-200 leading-relaxed">
      {children}
    </div>
  );
}
