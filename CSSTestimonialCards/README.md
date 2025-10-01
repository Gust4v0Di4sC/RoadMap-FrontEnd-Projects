
-----

# 📝 Projeto: Testimonial Cards Responsivos (HTML & CSS Grid/Flexbox)

Um conjunto de cards de depoimento (Testimonial Cards) construídos com HTML e CSS, utilizando **Grid Layout** e **Flexbox** para criar diferentes estruturas visuais e garantir a responsividade.

-----

## 🚀 Tecnologias Utilizadas

  * **HTML5:** Para a estrutura semântica dos cards e conteúdo.
  * **CSS3:** Para estilização, layout e responsividade, com foco em:
      * **CSS Grid:** Para o layout principal complexo (cards lado a lado e em diferentes linhas).
      * **Flexbox:** Para alinhar o conteúdo interno dos cards (imagem e texto).

-----

## 🛠️ Estrutura do Projeto

A estrutura do projeto é simples, ideal para um componente web isolado:

```
/testimonial-cards-project
├── index.html        # Contém todo o HTML e o CSS (pode ser separado em style.css)
└── assets/
    └── images/
        ├── jacqueline.jpg  # Imagem do Testemunho 1
        ├── artem.jpg       # Imagem do Testemunho 2/3
        └── fundo-area.jpg  # Imagem de fundo do card central
```

-----

## 📄 Estrutura do Layout (Grid)

O layout principal usa **CSS Grid** para posicionar os cards em um container de **3 colunas** e múltiplas linhas, replicando o design complexo.

O contêiner principal (`.grid-container`) possui 3 colunas (`grid-template-columns: repeat(3, 1fr)`).

| Card | Posição | Estilo CSS |
| :--- | :--- | :--- |
| **Card Topo Esquerdo** | 1ª Linha, 1ª Coluna | `grid-column: 1 / 2; grid-row: 1 / 2;` |
| **Card Topo Central** | 1ª Linha, 2ª Coluna | `grid-column: 2 / 3; grid-row: 1 / 2;` |
| **Card Topo Direito** | 1ª Linha, 3ª Coluna | `grid-column: 3 / 4; grid-row: 1 / 2;` |
| **Card Central Grande** | 2ª Linha, Ocupa 3 Colunas | `grid-column: 1 / 4; grid-row: 2 / 3;` |
| **Card Inferior** | 3ª Linha, Ocupa 3 Colunas | `grid-column: 1 / 4; grid-row: 3 / 4;` |

-----

## 💻 Como Visualizar

1.  **Clone ou baixe** este repositório para o seu computador.
2.  **Abra o arquivo `index.html`** em seu navegador web (Chrome, Firefox, etc.).
3.  Você pode inspecionar o código e alterar as classes no painel de desenvolvedor do navegador para testar diferentes layouts de grade.

-----

