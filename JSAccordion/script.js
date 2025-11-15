


// 1. Defina o texto da resposta
const answersQuestions = [
     {
                question: "What is roadmap.sh?",
                answer: "roadmap.sh is a community effort to create learning paths, guides, project ideas and other similar content to help developers grow in their careers."
            },
            {
                question: "What are the plans for roadmap.sh?",
                answer: "We plan to continue adding new roadmaps, guides, and interactive elements. Our focus is on making the platform as comprehensive and useful as possible for developers worldwide."
            },
            {
                question: "How is roadmap.sh built?",
                answer: "The platform is built using modern web technologies and is open-source. The community contributes heavily to the content and structure of the roadmaps."
            },
            {
                question: "Can I use roadmap.sh in my team?",
                answer: "Yes, many teams use roadmap.sh as a reference for skill development and setting career growth paths. It's a great tool for mentorship and training."
            },
            {
                question: "How can I create custom roadmaps?",
                answer: "Currently, the platform supports community-driven contributions. You can propose a new roadmap or contribute to an existing one via GitHub."
            },
            {
                question: "Is roadmap.sh really 7th most starred project on GitHub?",
                answer: "Yes, it has achieved a very high ranking among popular GitHub repositories, thanks to the immense support and contributions from the developer community."
            }
];


 // 2. LÓGICA DO ACORDEÃO (Abrir/Fechar)
        function toggleAccordion(item, content) {
            item.classList.toggle('open');
            
            if (item.classList.contains('open')) {
                // Abre, definindo a altura máxima para a altura real do conteúdo
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                // Fecha, voltando para zero
                content.style.maxHeight = "0";
            }
        }

        // 3. RENDERIZAÇÃO E INSERÇÃO DE CONTEÚDO
        document.addEventListener('DOMContentLoaded', () => {
            const container = document.querySelector('.list-questions'); // Onde inseriremos o DL
            
            answersQuestions.forEach((item, index) => {
                // A. Cria o contêiner principal do item
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('accordion-item');

                // B. Cria a Pergunta (DT e BUTTON)
                const dt = document.createElement('dt');
                const button = document.createElement('button');
                button.classList.add('accordion-header');
                button.innerHTML = `${item.question} <span class="accordion-icon">v</span>`;
                
                dt.appendChild(button);
                itemDiv.appendChild(dt);

                // C. Cria a Resposta (DD e Content Container)
                const dd = document.createElement('dd');
                const contentDiv = document.createElement('div');
                contentDiv.classList.add('accordion-content');
                
                // Content Inner para padding (mantendo o max-height no contentDiv)
                const innerDiv = document.createElement('div');
                innerDiv.classList.add('accordion-content-inner');
                innerDiv.innerHTML = `<p>${item.answer}</p>`; // INSERÇÃO DA RESPOSTA AQUI!

                contentDiv.appendChild(innerDiv);
                dd.appendChild(contentDiv);
                itemDiv.appendChild(dd);

                // D. Insere o item completo no DL
                container.appendChild(itemDiv);

                // E. Anexa o Event Listener
                button.addEventListener('click', () => {
                    // Passa o itemDiv (o pai) e o contentDiv (a resposta) para a função
                    toggleAccordion(itemDiv, contentDiv);
                });

                // F. Abre o primeiro item por padrão
                if (index === 0) {
                    itemDiv.classList.add('open');
                    // Usamos setTimeout para garantir que o elemento esteja no DOM antes de calcular a altura
                    setTimeout(() => {
                        contentDiv.style.maxHeight = contentDiv.scrollHeight + "px";
                    }, 0);
                }
            });
        });
