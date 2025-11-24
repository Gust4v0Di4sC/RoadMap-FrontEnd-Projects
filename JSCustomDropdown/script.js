const dropdown = document.getElementById("myDropdown");
const trigger = document.getElementById("dropdownTrigger");
const selectedText = document.getElementById("selectedText");
const items = document.querySelectorAll(".dropdown-item");

// 1. Alternar estado Aberto/Fechado
trigger.addEventListener("click", () => {
  dropdown.classList.toggle("open");
});

// 2. Lógica de Seleção de Item
items.forEach((item) => {
  item.addEventListener("click", () => {
    // Pegar o texto do item clicado
    const text = item.innerText;

    // Atualizar o texto do botão principal (Trigger)
    selectedText.innerText = text;

    // Remover classe 'selected' de todos e adicionar ao atual
    items.forEach((i) => i.classList.remove("selected"));
    item.classList.add("selected");

    // Fechar o dropdown
    dropdown.classList.remove("open");

    // (Opcional) Aqui você pode pegar o valor: item.getAttribute('data-value')
    console.log("Selecionado:", item.getAttribute("data-value"));
  });
});

// 3. Fechar se clicar fora do dropdown
window.addEventListener("click", (e) => {
  if (!dropdown.contains(e.target)) {
    dropdown.classList.remove("open");
  }
});
