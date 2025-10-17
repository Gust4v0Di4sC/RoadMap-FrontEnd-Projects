document.addEventListener('DOMContentLoaded', () => {
    // === Lógica de Consentimento de Cookies ===
    const popup = document.getElementById('cookie-consent-popup');
    const acceptBtn = document.getElementById('accept-cookies-btn');
    const closeBtn = document.getElementById('close-popup-btn');
    const STORAGE_KEY = 'cookies_accepted';

    function showPopup() { popup.classList.remove('hidden'); }
    function hidePopup() { popup.classList.add('hidden'); }

    function acceptCookies() {
        localStorage.setItem(STORAGE_KEY, 'true');
        hidePopup();
        console.log('Cookies aceitos e consentimento salvo!');
    }

    acceptBtn.addEventListener('click', acceptCookies);
    closeBtn.addEventListener('click', acceptCookies);
    
    // Inicia a verificação do cookie
    const consent = localStorage.getItem(STORAGE_KEY);
    if (consent !== 'true') {
        showPopup();
    }
    
    // === NOVO: Lógica do Skeleton Loading e Conteúdo Real ===
    
    const skeletonContainer = document.getElementById('skeleton-container');
    const realContent = document.getElementById('real-content'); // Seleciona o novo conteúdo
    
    // Simula o tempo de carregamento da página (ex: 3 segundos)
    const loadingTime = 3000; 

    // Oculta o conteúdo real (apenas para garantir se o CSS falhar)
    if (realContent) {
        realContent.classList.add('hidden');
    }

    setTimeout(() => {
        // 1. Esconde o Skeleton Screen
        if (skeletonContainer) {
            // Usamos 'hidden' que usa display: none !important
            skeletonContainer.classList.add('hidden');
        }

        // 2. Mostra o Conteúdo Real
        if (realContent) {
            // Remove a classe 'hidden' para exibi-lo
            realContent.classList.remove('hidden'); 
        }

        console.log('Conteúdo real carregado. Skeleton hidden.');
        
    }, loadingTime);
    
});