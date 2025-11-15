
// let answerText = document.getElementById('answer');


// function handleClick(){
   
//    answerText.classList.toggle('hidden');
//    answerText.classList.add('answer');
// }

 // 1. DATA ARRAY (Permanecerá no JS para facilitar a manutenção das respostas)
        const faqData = [
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

        // 2. FUNÇÃO SIMPLES DE TOGGLE
        function toggleAccordion(button) {
            // O item pai que contém a pergunta e a resposta (div.accordion-item)
            const item = button.closest('.accordion-item');
            
            
            // A resposta é a DD, que é o segundo filho do item (após o DT)
            // Usamos querySelector para encontrar a resposta dentro do item
            const content = item.querySelector('.accordion-content');
            
            item.classList.toggle('open');
            
            if (item.classList.contains('open')) {
                // Abre, definindo a altura máxima para a altura real do conteúdo
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                // Fecha, voltando para zero
                content.style.maxHeight = "0";
            }
        }

        // 3. INJEÇÃO DE DADOS E EVENT LISTENERS
        document.addEventListener('DOMContentLoaded', () => {
            const headers = document.querySelectorAll('.accordion-header');
            const answerParagraphs = document.querySelectorAll('.accordion-content-inner p');
           

            // Itera sobre os dados e injeta as respostas nos parágrafos vazios
            answerParagraphs.forEach((p, index) => {
                if (faqData[index]) {
                    p.textContent = faqData[index].answer;
                }
            });

            // Itera sobre todos os botões e anexa a função de clique
            headers.forEach((button, index) => {
                // Adiciona o evento de clique
                button.addEventListener('click', () => {
                    // Chama a função simples, passando o botão clicado
                    toggleAccordion(button);
                });

                // Abre o primeiro item por padrão
                if (index === 0) {
                    const item = button.closest('.accordion-item');
                    const content = item.querySelector('.accordion-content');
                    item.classList.add('open');
                    // Garante que a altura seja calculada após o texto ter sido injetado
                    setTimeout(() => {
                        content.style.maxHeight = content.scrollHeight + "px";
                    }, 0);
                }
            });
        });