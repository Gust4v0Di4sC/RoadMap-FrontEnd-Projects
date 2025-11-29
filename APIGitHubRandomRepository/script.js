// --- URLs e Elementos DOM ---
const LANGUAGES_API_URL = 'https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json';

const languageSelect = document.getElementById('language-select');
const statusOrRepositoryArea = document.getElementById('status-or-repository-area');
const refreshButton = document.getElementById('refresh-button');

// --- Funções de Estado (Permanecem as mesmas) ---

/** Exibe o estado inicial VAZIO. */
function showEmptyState() {
    statusOrRepositoryArea.className = 'state-container state-empty';
    statusOrRepositoryArea.innerHTML = `<p>Please select a language</p>`;
    refreshButton.style.display = 'none';
    languageSelect.disabled = false;
}

/** Exibe o estado de CARREGAMENTO. */
function showLoadingState() {
    statusOrRepositoryArea.className = 'state-container state-loading';
    statusOrRepositoryArea.innerHTML = `<p>Loading, please wait...</p>`;
    refreshButton.style.display = 'none';
}

/** Exibe o estado de ERRO com um botão de retry. */
function showErrorState(message = 'Error fetching repositories', language) {
    statusOrRepositoryArea.className = 'state-container state-error';
    statusOrRepositoryArea.innerHTML = `
        <p>${message}</p>
        <button class="retry-button" id="retry-button">Click to retry</button>
    `;
    refreshButton.style.display = 'none';

    // Adiciona o listener para o botão de Retry
    const retryButton = document.getElementById('retry-button');
    if (retryButton) {
        retryButton.addEventListener('click', () => {
            if (language) {
                fetchRepository(language);
            } else {
                // Se for um erro no carregamento da lista de linguagens, tenta carregar de novo
                fetchLanguagesAndInit();
            }
        });
    }
}

/** Exibe o repositório encontrado (Estado de SUCESSO). */
function showSuccessState(repo) {
    statusOrRepositoryArea.className = 'state-container';
    statusOrRepositoryArea.innerHTML = `
        <div class="repository-card">
            <h2><a href="${repo.html_url}" target="_blank">${repo.name}</a></h2>
            <p>${repo.description || 'No description provided.'}</p>
            <div class="repo-stats">
                <span class="language-tag">${repo.language || 'N/A'}</span>
                <span class="star-count">${repo.stargazers_count.toLocaleString()}</span>
                <span class="fork-count">${repo.forks_count.toLocaleString()}</span>
                <span class="issue-count">${repo.open_issues_count.toLocaleString()}</span>
            </div>
        </div>
    `;
    refreshButton.style.display = 'block';
}

// --- Funções de API ---

/** * Preenche o seletor com as linguagens obtidas via fetch. 
 * @param {Array<Object>} fetchedLanguages - Array de objetos {name, urlParam}
 */
function populateLanguageSelect(fetchedLanguages) {
    fetchedLanguages.forEach(lang => {
        const option = document.createElement('option');
        // Usamos 'urlParam' (ex: javascript) como valor para a API do GitHub
        option.value = lang.title; 
        // Usamos 'name' (ex: JavaScript) para exibição
        option.textContent = lang.value; 
        languageSelect.appendChild(option);
    });
}


/**
 * Busca um repositório aleatório para a linguagem selecionada.
 * @param {string} language - O parâmetro de URL da linguagem de programação.
 */
async function fetchRepository(language) {
    if (!language) return;

    showLoadingState();

    // q=language:[LINGUAGEM]+stars:>100 (Busca por repos populares)
    const apiUrl = `https://api.github.com/search/repositories?q=language:${language}+stars:>100&sort=stars&order=desc&per_page=100`;
    
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            // Se a API do GitHub retornar um erro (ex: rate limit)
            throw new Error('GitHub API responded with an error or rate limit exceeded.');
        }

        const data = await response.json();
        
        if (data.items.length === 0) {
            showErrorState(`No popular repositories found for ${language}.`, language);
            return;
        }

        // Seleciona um repositório aleatório
        const randomIndex = Math.floor(Math.random() * data.items.length);
        const randomRepo = data.items[randomIndex];

        showSuccessState(randomRepo);

    } catch (error) {
        console.error('Fetch error:', error);
        showErrorState('Error fetching repositories. Please try again.', language);
    }
}

/** * Busca a lista de linguagens e popula o seletor na inicialização.
 */
async function fetchLanguagesAndInit() {
    showLoadingState();
    languageSelect.disabled = true; // Desabilita o seletor enquanto carrega
    languageSelect.innerHTML = '<option value="" disabled selected>Loading Languages...</option>';

    try {
        const response = await fetch(LANGUAGES_API_URL);
        
        if (!response.ok) {
            throw new Error('Failed to load language list from external source.');
        }
        
        const languagesData = await response.json();
        
        // Limpa e repopula o seletor com a lista carregada
        languageSelect.innerHTML = '<option value="" disabled selected>Select a Language</option>';
        populateLanguageSelect(languagesData);
        
        languageSelect.disabled = false; // Habilita o seletor
        showEmptyState(); // Volta para o estado Vazio

    } catch (error) {
        console.error('Error loading languages:', error);
        // Exibe erro crítico, desabilitando o seletor
        languageSelect.innerHTML = '<option value="" disabled selected>Error Loading</option>';
        showErrorState('Failed to load programming languages list. Check the console for details.', null);
    }
}

// --- Listeners de Eventos ---

// 1. Quando uma nova linguagem é selecionada, busca um repositório.
languageSelect.addEventListener('change', (event) => {
    const selectedLanguage = event.target.value;
    fetchRepository(selectedLanguage);
});

// 2. O botão de Refresh apenas chama a função de busca novamente.
refreshButton.addEventListener('click', () => {
    const selectedLanguage = languageSelect.value;
    if (selectedLanguage) {
        fetchRepository(selectedLanguage);
    }
});

// 3. Inicia o aplicativo.
document.addEventListener('DOMContentLoaded', () => {
    fetchLanguagesAndInit(); // Começa buscando a lista de linguagens
});