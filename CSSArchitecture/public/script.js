// public/script.js
const cssInput = document.querySelector('.css-input');
const architectureSelector = document.querySelector('.architecture-selector');
const validateButton = document.querySelector('.validate-button');
const mainContent = document.querySelector('.main-content'); // Onde os resultados serão exibidos

validateButton.addEventListener('click', async () => {
  const cssCode = cssInput.value;
  const selectedArchitecture = architectureSelector.value;

  if (!cssCode.trim()) {
    alert('Por favor, insira o código CSS.');
    return;
  }

  if (!selectedArchitecture) {
    alert('Por favor, selecione uma arquitetura.');
    return;
  }

  // Envia os dados para o back-end
  try {
    const response = await fetch('http://localhost:3000/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        css: cssCode,
        architecture: selectedArchitecture
      })
    });

    const result = await response.json();

    // Exibe o relatório
    displayReport(result);

  } catch (err) {
    displayReport({ isValid: false, messages: ['Erro de comunicação com o servidor.'] });
  }
});

// Função para exibir o relatório
function displayReport(report) {
  // Remove relatório anterior, se houver
  const oldReport = document.querySelector('.report');
  if (oldReport) {
    oldReport.remove();
  }

  const reportDiv = document.createElement('div');
  reportDiv.className = 'report';

  const statusTitle = document.createElement('h2');
  statusTitle.textContent = report.isValid ? '✅ Validação Concluída' : '❌ Erros Encontrados';
  reportDiv.appendChild(statusTitle);

  const messagesList = document.createElement('ul');
  report.messages.forEach(msg => {
    const listItem = document.createElement('li');
    listItem.textContent = msg;
    messagesList.appendChild(listItem);
  });
  reportDiv.appendChild(messagesList);

  mainContent.appendChild(reportDiv);
}