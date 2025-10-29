 // 
        // Lógica JavaScript
        //
        const textArea = document.getElementById('input-textarea');
        const counter = document.getElementById('counter');
        const characterLimit = 250;

       // Evento que acompanha a digitação
textArea.addEventListener("input", function () {
  let texto = textArea.value;
  const tamanho = texto.length;

  // 1. countter em tempo real
  counter.textContent = `${tamanho}/${characterLimit}`;

  if (tamanho === characterLimit) {
    // 2. Impede nova entrada (trunca o texto)
    textArea.value = texto.slice(0, characterLimit);

    // Aplica estilos de erro na BORDA E NO TEXTO DIGITADO (classe .error-border)
    textArea.classList.add("error-border");

    // Aplica estilo de erro no countter (classe .error-text)
    counter.classList.add("error-text");

    // Atualiza o countter após o truncamento (volta para 250)
    counter.textContent = `${characterLimit}/${characterLimit}`;
  } else {
    // Remove estilos de erro se estiver dentro do limite
    textArea.classList.remove("error-border");
    counter.classList.remove("error-text");
  }
});

// Adiciona um listener para o evento 'keydown' para prevenir a digitação APÓS o limite
textArea.addEventListener("keydown", function (event) {
  // Verifica se o texto já está no limite MÁXIMO e a tecla Pressionada
  // NÃO é uma tecla de controle (Backspace, Delete, Setas, etc.)
  if (textArea.value.length >= characterLimit && event.key.length === 1) {
    // Verifica se é um caractere digitável

    // Impede o evento de tecla
    event.preventDefault();
  }
});

// Inicializa a contagem ao carregar
window.onload = function () {
  textArea.dispatchEvent(new Event("input"));
};