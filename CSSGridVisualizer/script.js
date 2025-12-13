 const grid = document.getElementById("grid");
  const codeEl = document.getElementById("code");
  const copyBtn = document.getElementById("copyBtn");
  const codeHint = document.getElementById("codeHint");

  const addBtn = document.getElementById("addItem");
  const removeBtn = document.getElementById("removeItem");

  let selectedItem = null;
  let currentTab = "css";

  const cols = document.getElementById("cols");
  const rows = document.getElementById("rows");
  const gap = document.getElementById("gap");

  const colStart = document.getElementById("colStart");
  const colEnd = document.getElementById("colEnd");
  const rowStart = document.getElementById("rowStart");
  const rowEnd = document.getElementById("rowEnd");

  function updateGrid() {
    grid.style.gridTemplateColumns = cols.value;
    grid.style.gridTemplateRows = rows.value;
    grid.style.gap = gap.value + "px";
    renderCode();
  }

  [cols, rows, gap].forEach(i => i.addEventListener("input", updateGrid));
  updateGrid();

  function setSelected(el) {
    document.querySelectorAll(".item").forEach(i => i.classList.remove("selected"));
    selectedItem = el || null;

    if (selectedItem) {
      selectedItem.classList.add("selected");
      colStart.value = selectedItem.style.gridColumnStart || "";
      colEnd.value = selectedItem.style.gridColumnEnd || "";
      rowStart.value = selectedItem.style.gridRowStart || "";
      rowEnd.value = selectedItem.style.gridRowEnd || "";
      removeBtn.disabled = false;
    } else {
      colStart.value = "";
      colEnd.value = "";
      rowStart.value = "";
      rowEnd.value = "";
      removeBtn.disabled = true;
    }
  }

  grid.addEventListener("click", e => {
    if (!e.target.classList.contains("item")) return;
    setSelected(e.target);
  });

  [colStart, colEnd, rowStart, rowEnd].forEach(input => {
    input.addEventListener("input", () => {
      if (!selectedItem) return;
      selectedItem.style.gridColumnStart = colStart.value;
      selectedItem.style.gridColumnEnd = colEnd.value;
      selectedItem.style.gridRowStart = rowStart.value;
      selectedItem.style.gridRowEnd = rowEnd.value;
      renderCode();
    });
  });

  function renumberItems() {
    [...grid.children].forEach((item, idx) => {
      item.textContent = String(idx + 1);
    });
  }

  addBtn.addEventListener("click", () => {
    if (!selectedItem) return;

    const newItem = document.createElement("div");
    newItem.className = "item";
    newItem.textContent = String(grid.children.length + 1);

    // "Mesmo bloco": replica start do selecionado (útil pra “tabela/bloco”)
    newItem.style.gridColumnStart = selectedItem.style.gridColumnStart;
    newItem.style.gridRowStart = selectedItem.style.gridRowStart;

    grid.appendChild(newItem);
    renderCode();
  });

  function removeSelectedItem() {
    if (!selectedItem) return;
    const toRemove = selectedItem;

    // Define próxima seleção: tenta o próximo item, senão o anterior
    const items = [...grid.children];
    const idx = items.indexOf(toRemove);

    const next = items[idx + 1] || items[idx - 1] || null;

    toRemove.remove();
    renumberItems();
    setSelected(next);
    renderCode();

    // feedback rápido no botão
    const old = removeBtn.textContent;
    removeBtn.textContent = "Removido ✓";
    setTimeout(() => (removeBtn.textContent = old), 1200);
  }

  removeBtn.addEventListener("click", removeSelectedItem);

  // Atalho Delete/Backspace (sem atrapalhar quando digitando)
  document.addEventListener("keydown", (e) => {
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
    const isTyping = tag === "input" || tag === "textarea" || e.target?.isContentEditable;

    if (isTyping) return;

    if ((e.key === "Delete" || e.key === "Backspace") && selectedItem) {
      e.preventDefault();
      removeSelectedItem();
    }
  });

  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentTab = tab.dataset.tab;

      codeHint.textContent =
        currentTab === "css"
          ? "CSS Grid puro."
          : currentTab === "tailwind"
          ? "Tailwind com utilitários + style inline para templates complexos."
          : "Bootstrap usando d-grid + estilos inline.";

      renderCode();
    });
  });

  copyBtn.addEventListener("click", async () => {
    await navigator.clipboard.writeText(codeEl.textContent);
    copyBtn.textContent = "Copiado ✓";
    copyBtn.classList.add("copied");

    setTimeout(() => {
      copyBtn.textContent = "Copiar código";
      copyBtn.classList.remove("copied");
    }, 1500);
  });

  function getGridData() {
    return {
      columns: grid.style.gridTemplateColumns,
      rows: grid.style.gridTemplateRows,
      gap: grid.style.gap,
      items: [...grid.children].map((item, i) => ({
        index: i + 1,
        colStart: item.style.gridColumnStart || "auto",
        colEnd: item.style.gridColumnEnd || "auto",
        rowStart: item.style.gridRowStart || "auto",
        rowEnd: item.style.gridRowEnd || "auto"
      }))
    };
  }

  function generateCSS() {
    const g = getGridData();
    let css = `
.grid {
  display: grid;
  grid-template-columns: ${g.columns};
  grid-template-rows: ${g.rows};
  gap: ${g.gap};
}
`;
    g.items.forEach(i => {
      css += `
.item-${i.index} {
  grid-column: ${i.colStart} / ${i.colEnd};
  grid-row: ${i.rowStart} / ${i.rowEnd};
}
`;
    });
    return css.trim();
  }

  function generateTailwind() {
    const g = getGridData();
    let code = `
<div class="grid gap-[${g.gap}]"
  style="grid-template-columns:${g.columns};grid-template-rows:${g.rows};">
`;
    g.items.forEach(i => {
      code += `
  <div class="bg-slate-800 rounded-lg
    col-start-[${i.colStart}] col-end-[${i.colEnd}]
    row-start-[${i.rowStart}] row-end-[${i.rowEnd}]">
    ${i.index}
  </div>`;
    });
    code += `\n</div>`;
    return code.trim();
  }

  function generateBootstrap() {
    const g = getGridData();
    let code = `
<div class="d-grid gap-2"
  style="grid-template-columns:${g.columns};grid-template-rows:${g.rows};">
`;
    g.items.forEach(i => {
      code += `
  <div class="bg-secondary text-white p-2 rounded"
    style="grid-column:${i.colStart} / ${i.colEnd};
           grid-row:${i.rowStart} / ${i.rowEnd};">
    ${i.index}
  </div>`;
    });
    code += `\n</div>`;
    return code.trim();
  }

  function renderCode() {
    if (currentTab === "css") codeEl.textContent = generateCSS();
    if (currentTab === "tailwind") codeEl.textContent = generateTailwind();
    if (currentTab === "bootstrap") codeEl.textContent = generateBootstrap();
  }

  renderCode();