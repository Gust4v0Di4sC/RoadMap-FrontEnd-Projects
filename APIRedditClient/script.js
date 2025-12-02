document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app-container');
    const addLaneBtn = document.getElementById('add-lane-btn');
    const addLaneModal = document.getElementById('add-lane-modal');
    const addLaneForm = document.getElementById('add-lane-form');
    const subredditInput = document.getElementById('subreddit-input');
    const errorMessage = document.getElementById('error-message');

    // Estado da Aplicação (Lista de subreddits)
    let subreddits = loadSubreddits();
    
    // Inicializa a aplicação
    subreddits.forEach(subreddit => createLane(subreddit));

    // --- FUNÇÕES DE ARMAZENAMENTO LOCAL ---

    /**
     * Carrega a lista de subreddits do localStorage.
     * @returns {string[]} Lista de nomes de subreddits.
     */
    function loadSubreddits() {
        try {
            const stored = localStorage.getItem('redditClientSubreddits');
            return stored ? JSON.parse(stored) : ['learnprogramming', 'javascript'];
        } catch (e) {
            console.error("Erro ao carregar localStorage:", e);
            return ['learnprogramming', 'javascript']; // Retorna padrão em caso de erro
        }
    }

    /**
     * Salva a lista atual de subreddits no localStorage.
     */
    function saveSubreddits() {
        localStorage.setItem('redditClientSubreddits', JSON.stringify(subreddits));
    }


    // --- FUNÇÕES DE COMUNICAÇÃO COM A API ---

    /**
     * Busca posts de uma subreddit.
     * @param {string} subredditName - O nome da subreddit.
     * @returns {Promise<Object[]|null>} Array de posts ou null em caso de erro.
     */
    async function fetchRedditPosts(subredditName) {
        const url = `https://www.reddit.com/r/${subredditName}.json`;
        
        try {
            const response = await fetch(url);

            // O Reddit retorna 404 se a subreddit não existir.
            if (!response.ok) {
                // Tenta ler o JSON para erros mais específicos (se disponível)
                try {
                    const errorJson = await response.json();
                    if (errorJson.error === 404) {
                        return null; // Subreddit não existe
                    }
                } catch (e) {
                    // Ignora erro de parsing se a resposta não for JSON
                }
                
                // Erro de rede ou outro erro de status
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Mapeia os dados para uma estrutura mais simples
            return data.data.children.map(child => ({
                id: child.data.id,
                title: child.data.title,
                author: child.data.author,
                score: child.data.score,
                url: `https://www.reddit.com${child.data.permalink}`
            }));
            
        } catch (error) {
            console.error(`Erro ao buscar ${subredditName}:`, error);
            // Retorna uma lista vazia ou lança o erro para ser tratado pela UI
            throw new Error('Falha ao buscar dados. Verifique o console.');
        }
    }


    // --- FUNÇÕES DE RENDERIZAÇÃO DA UI ---

    /**
     * Cria e retorna o elemento DOM de um post.
     * @param {Object} post - Objeto de post do Reddit.
     * @returns {HTMLElement} O elemento 'div' do post.
     */
    function createPostElement(post) {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        postCard.setAttribute('data-id', post.id);

        // Estrutura do post (baseada na imagem de referência)
        postCard.innerHTML = `
            <div class="post-votes">
                <span class="upvote-icon">^</span>
                <span>${post.score}</span>
            </div>
            <div class="post-content">
                <h4>${post.title}</h4>
                <p>Posted by u/${post.author}</p>
            </div>
        `;
        
        // Adiciona evento para visitar o post
        postCard.addEventListener('click', () => {
            window.open(post.url, '_blank');
        });

        return postCard;
    }

    /**
     * Cria e renderiza uma nova coluna (lane) para uma subreddit.
     * @param {string} subredditName - O nome da subreddit.
     */
    async function createLane(subredditName) {
        const laneId = `lane-${subredditName}`;
        let laneElement = document.getElementById(laneId);

        // Se o elemento já existe (para refresh), apenas atualiza
        if (laneElement) {
            refreshLane(laneElement, subredditName);
            return;
        }

        laneElement = document.createElement('div');
        laneElement.className = 'subreddit-lane';
        laneElement.id = laneId;
        
        // Cabeçalho da coluna com menu de opções
        laneElement.innerHTML = `
            <div class="lane-header">
                <span class="lane-title">/r/${subredditName}</span>
                <div class="lane-options">
                    <span class="options-icon"><i class="fas fa-ellipsis-v"></i></span>
                    <div class="options-menu">
                        <button class="refresh-btn">Refresh</button>
                        <button class="delete-btn">Delete</button>
                    </div>
                </div>
            </div>
            <div class="lane-posts">
                <p class="loading">Loading posts...</p>
            </div>
        `;

        appContainer.appendChild(laneElement);
        
        // Adiciona listeners para os botões e menu
        const optionsIcon = laneElement.querySelector('.options-icon');
        const optionsMenu = laneElement.querySelector('.options-menu');
        
        optionsIcon.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita fechar imediatamente
            optionsMenu.classList.toggle('show-menu');
        });

        laneElement.querySelector('.refresh-btn').addEventListener('click', () => {
            refreshLane(laneElement, subredditName);
            optionsMenu.classList.remove('show-menu');
        });

        laneElement.querySelector('.delete-btn').addEventListener('click', () => {
            deleteLane(subredditName);
            optionsMenu.classList.remove('show-menu');
        });
        
        // Fecha o menu se clicar fora dele
        document.addEventListener('click', (e) => {
            if (!laneElement.contains(e.target) && optionsMenu.classList.contains('show-menu')) {
                 optionsMenu.classList.remove('show-menu');
            }
        });


        // Busca e popula os posts
        populateLanePosts(laneElement, subredditName);
    }
    
    /**
     * Deleta uma coluna da UI e do estado.
     * @param {string} subredditName - O nome da subreddit a ser deletada.
     */
    function deleteLane(subredditName) {
        const laneElement = document.getElementById(`lane-${subredditName}`);
        if (laneElement) {
            // Remove da UI
            laneElement.remove();
            
            // Remove do estado e salva
            subreddits = subreddits.filter(s => s !== subredditName);
            saveSubreddits();
        }
    }
    
    /**
     * Atualiza o conteúdo de uma coluna (refresh).
     * @param {HTMLElement} laneElement - O elemento DOM da coluna.
     * @param {string} subredditName - O nome da subreddit.
     */
    function refreshLane(laneElement, subredditName) {
        // Encontra o contêiner de posts
        const postsContainer = laneElement.querySelector('.lane-posts');
        postsContainer.innerHTML = '<p class="loading">Refreshing posts...</p>';
        populateLanePosts(laneElement, subredditName);
    }

    /**
     * Busca os posts e injeta-os no contêiner da coluna.
     * @param {HTMLElement} laneElement - O elemento DOM da coluna.
     * @param {string} subredditName - O nome da subreddit.
     */
    async function populateLanePosts(laneElement, subredditName) {
        const postsContainer = laneElement.querySelector('.lane-posts');
        
        try {
            const posts = await fetchRedditPosts(subredditName);

            if (posts === null) {
                // Subreddit não encontrada (404)
                postsContainer.innerHTML = `<p class="error-text">Subreddit /r/${subredditName} not found.</p>`;
                
                // Automaticamente remove o subreddit do estado e da UI
                deleteLane(subredditName); 
                return;
            }

            postsContainer.innerHTML = ''; // Limpa o estado de loading ou erro

            if (posts.length === 0) {
                postsContainer.innerHTML = '<p class="loading">No posts found.</p>';
                return;
            }

            posts.forEach(post => {
                postsContainer.appendChild(createPostElement(post));
            });

        } catch (error) {
            // Outro erro de API/Rede
            postsContainer.innerHTML = `<p class="error-text">Error fetching posts for /r/${subredditName}.</p>`;
        }
    }


    // --- LISTENERS DE EVENTOS ---

    // 1. Mostrar Modal ao clicar no botão '+'
    addLaneBtn.addEventListener('click', () => {
        addLaneModal.style.display = 'block';
        subredditInput.value = '';
        errorMessage.textContent = '';
        subredditInput.focus();
    });

    // 2. Fechar Modal ao clicar fora
    window.addEventListener('click', (event) => {
        if (event.target === addLaneModal) {
            addLaneModal.style.display = 'none';
        }
    });
    
    // 3. Submissão do Formulário (Adicionar Subreddit)
    addLaneForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const subredditName = subredditInput.value.trim().toLowerCase();
        errorMessage.textContent = '';

        if (!subredditName) return;

        // Verifica se já existe
        if (subreddits.includes(subredditName)) {
            errorMessage.textContent = 'This subreddit is already displayed.';
            return;
        }

        // Simula o loading antes de validar
        errorMessage.textContent = 'Verifying and loading...';
        
        // Verifica se o subreddit existe (fazendo uma busca)
        const posts = await fetchRedditPosts(subredditName);
        
        if (posts === null) {
            errorMessage.textContent = `Subreddit /r/${subredditName} does not exist.`;
            return;
        }
        
        // Tudo OK: Adiciona, renderiza e salva
        subreddits.push(subredditName);
        saveSubreddits();
        createLane(subredditName); // Cria a nova coluna com os posts já buscados
        
        // Fecha o modal
        addLaneModal.style.display = 'none';
    });
});