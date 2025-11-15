document.addEventListener('DOMContentLoaded', (event) => {
        
        // 2. Chama a função global 'datepicker()' e passa o ID do input como string.
        const picker = datepicker('#birthdate', {
            // Opções de configuração (Exemplos Comuns)
            
            // Define o formato da data que será exibido no input
            // Veja: https://www.npmjs.com/package/date-fns
            formatter: (input, date, instance) => {
                const value = date.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })
                input.value = value
            },
            
            // Habilita as opções de navegação rápida
            customDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
            customMonths: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            startDay: 0, // 0 para Domingo
            
            // Outras opções:
            // position: 'bl', // Posição de exibição (Bottom-Left)
            // minDate: new Date(2023, 0, 1) // Data mínima permitida
        });
        
        // Você pode agora interagir com a instância do datepicker (a variável 'picker')
         picker.setDate(new Date()); 

    });