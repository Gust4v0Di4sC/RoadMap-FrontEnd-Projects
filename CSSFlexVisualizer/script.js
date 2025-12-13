 const preview = document.getElementById("preview");
  const cssOut = document.getElementById("cssOut");
  const twOut = document.getElementById("twOut");
  const htmlOut = document.getElementById("htmlOut");

  const state = {
    items: [],
    selected: null,
  };

  function createItem() {
    const el = document.createElement("div");
    el.className = "item";
    el.textContent = `Item ${state.items.length + 1}`;
    el.style.flex = "0 1 120px";

    el.onclick = () => {
      document.querySelectorAll(".item").forEach(i => i.classList.remove("selected"));
      el.classList.add("selected");
      state.selected = el;
      syncItemControls();
    };

    preview.appendChild(el);
    state.items.push(el);
  }

  function syncItemControls() {
    if (!state.selected) return;
    const [grow,, basis] = state.selected.style.flex.split(" ");
    document.getElementById("grow").value = grow;
    document.getElementById("basis").value = parseInt(basis);
  }

  function updateLayout() {
    preview.style.flexDirection = direction.value;
    preview.style.justifyContent = justify.value;
    preview.style.alignItems = align.value;
    preview.style.gap = gap.value + "px";

    cssOut.textContent = `
display: flex;
flex-direction: ${direction.value};
justify-content: ${justify.value};
align-items: ${align.value};
gap: ${gap.value}px;
`.trim();

    twOut.textContent = `
flex
${direction.value === "row" ? "flex-row" : "flex-col"}
justify-${justify.value.replace("flex-", "")}
items-${align.value.replace("flex-", "")}
gap-[${gap.value}px]
`.trim();

    htmlOut.textContent = preview.innerHTML.replaceAll("selected", "").trim();
  }

  document.querySelectorAll("select, input[type=range]").forEach(el =>
    el.addEventListener("input", () => {
      if (state.selected && (el.id === "basis" || el.id === "grow")) {
        const grow = growInput.value;
        const basis = basisInput.value;
        state.selected.style.flex = `${grow} 1 ${basis}px`;
      }
      updateLayout();
    })
  );

  const growInput = document.getElementById("grow");
  const basisInput = document.getElementById("basis");

  document.getElementById("add").onclick = () => {
    createItem();
    updateLayout();
  };

  // init
  createItem();
  createItem();
  createItem();
  updateLayout();