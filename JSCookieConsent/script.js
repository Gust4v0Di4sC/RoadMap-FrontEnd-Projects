document.addEventListener('DOMContentLoaded', () => {
    // 1. Selecionar os elementos do DOM
    const popup = document.getElementById('cookie-consent-popup');
    const acceptBtn = document.getElementById('accept-cookies-btn');
    const closeBtn = document.getElementById('close-popup-btn');

    // Chave que usaremos no localStorage
    const STORAGE_KEY = 'cookies_accepted';

    // 2. Função para verificar o status do consentimento
    function checkConsent() {
        // Se a chave existir e o valor for 'true', o usuário já aceitou
        const consent = localStorage.getItem(STORAGE_KEY);
        
        if (consent === 'true') {
            // Se já aceitou, oculta o pop-up
            hidePopup();
        } else {
            // Caso contrário, mostra o pop-up
            showPopup();
        }
    }

    // 3. Funções de visualização
    function showPopup() {
        popup.classList.remove('hidden');
    }

    function hidePopup() {
        popup.classList.add('hidden');
    }

    // 4. Função para registrar o consentimento
    function acceptCookies() {
        // Grava o consentimento no localStorage
        localStorage.setItem(STORAGE_KEY, 'true');
        // Oculta o pop-up
        hidePopup();
        // Opcional: Você pode carregar scripts ou fazer outras ações aqui
        console.log('Cookies aceitos e consentimento salvo!');
    }

    // 5. Adicionar ouvintes de evento
    acceptBtn.addEventListener('click', acceptCookies);
    // Adicione a mesma lógica ao botão de fechar, se ele também deve persistir a escolha
    closeBtn.addEventListener('click', acceptCookies);
    // Nota: Em um site real, o botão 'X' pode simplesmente fechar **temporariamente**
    // Se o 'X' deve fechar e **não** gravar o consentimento, use apenas `hidePopup` no click dele.

    // 6. Iniciar a verificação ao carregar a página
    checkConsent();
});