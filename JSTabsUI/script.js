document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-tab'); // ID do painel

            // 1. Desativar todos os botões e painéis (Remoção da Ativação)
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
                btn.setAttribute('tabindex', '-1'); // Não focável via Tab
            });
            
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.setAttribute('hidden', ''); // Esconde o painel
            });

            // 2. Ativar o botão clicado
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            button.setAttribute('tabindex', '0'); // Focável via Tab
            
            // 3. Mostrar o painel correspondente
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
                targetContent.removeAttribute('hidden'); // Remove o atributo hidden
            }
        });
    });

    // Se o primeiro painel não estiver ativo por padrão no HTML, 
    // você pode forçar o clique inicial aqui:
    // document.querySelector('.tab-button.active').click(); 
});