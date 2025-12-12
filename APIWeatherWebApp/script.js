// **IMPORTANTE:** Substitua 'SUA_API_KEY_AQUI' pela sua chave real da Visual Crossing
const API_KEY = 'your_api_key';
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';

// Elementos do DOM
const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const refreshButton = document.getElementById('refreshButton');
const weatherDisplay = document.getElementById('weather-display');
const loadingIndicator = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const hourlyList = document.getElementById('hourly-list');



// Funções Auxiliares de Exibição
// 🚀 Função showLoading (Com Animação Motion One)
function showLoading() {
    weatherDisplay.style.display = 'none';
    errorMessage.style.display = 'none';
    
    // Anima o indicador de carregamento
    loadingIndicator.style.display = 'flex';
    
    // Anima o texto de carregamento com uma rotação infinita
    const spinner = loadingIndicator.querySelector('.spinner');
    if (spinner) {
        // Usa o Motion One para uma animação mais suave do spinner
        animate(spinner, { rotate: 360 }, { 
            duration: 1, 
            repeat: Infinity, 
            ease: "linear" 
        });
    }
}

function hideLoading() {
    loadingIndicator.style.display = 'none';
}

function displayError(message = 'Erro ao buscar dados.') {
    hideLoading();
    weatherDisplay.style.display = 'none';
    errorMessage.querySelector('p').textContent = message;
    errorMessage.style.display = 'block';
}

function formatLocationName(resolvedAddress) {
    // Tenta obter uma localização mais limpa, se possível
    const parts = resolvedAddress.split(',');
    return parts.length > 1 ? parts[0].trim() : resolvedAddress;
}

// Função Principal para Buscar o Clima
async function fetchWeather(location, useGeolocation = false) {
    if (!location && !useGeolocation) {
        displayError('Por favor, digite uma localização.');
        return;
    }

    showLoading();

    try {
        let apiUrl = '';
        let address = location;

        if (useGeolocation) {
            // Requisito: Exibir clima da localização atual por padrão (Stretch Goal)
            address = await getCurrentGeolocation(); // Obtém lat,long
        }
        
        // Parâmetros da API para obter:
        // - 'current': Condições atuais
        // - 'hours': Dados horários (inclui 24h passadas e futuras, se não especificar datas)
        // - 'metric': Unidades métricas (C, km/h, mm)
        // - 'lang=pt-br': Para condições em português (se suportado pela API)
        
        // A API Timeline da Visual Crossing com o endereço/lat,long sem datas retorna:
        // - currentConditions (condições atuais)
        // - days[0].hours (previsão horária, que inclui as 24 horas passadas e futuras)

        apiUrl = `${BASE_URL}${address}?unitGroup=metric&key=${API_KEY}&contentType=json&include=current,hours&lang=pt-br`;

        const response = await axios.get(apiUrl);
        const data = response.data;

        hideLoading();
        displayWeather(data);
    } catch (error) {
        console.error('Erro na requisição Axios:', error);
        displayError('Erro ao buscar dados do clima. Verifique a localização e a chave da API.');
    }
}

// Função para obter Geolocation (Stretch Goal)
function getCurrentGeolocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Retorna no formato lat,long
                    resolve(`${position.coords.latitude},${position.coords.longitude}`);
                },
                (error) => {
                    console.error('Erro de geolocalização:', error);
                    alert('Não foi possível obter a localização atual. Digite a localização manualmente.');
                    // Em caso de erro, resolve com uma localização padrão ou rejeita.
                    // Para este exemplo, vou rejeitar, forçando o usuário a digitar.
                    reject(new Error('Geolocation not available or denied.'));
                }
            );
        } else {
            reject(new Error('Geolocation is not supported by this browser.'));
        }
    });
}

// 🚀 Função displayWeather (Com Animação Motion One)
function displayWeather(data) {
    const current = data.currentConditions;
    const todayData = data.days[0]; 

    if (!current || !todayData) {
        displayError('Dados de clima incompletos.');
        return;
    }

    // 1. Preenchimento dos dados do DOM (igual ao código anterior)
    document.getElementById('locationName').textContent = formatLocationName(data.resolvedAddress);
    document.getElementById('currentTemp').textContent = `${Math.round(current.temp)}°C`;
    document.getElementById('currentConditions').textContent = current.conditions;
    document.getElementById('currentWindSpeed').textContent = `${current.windspeed} km/h`;
    const precipProb = todayData.precipprob !== undefined ? todayData.precipprob : (current.precip > 0 ? 100 : 0);
    document.getElementById('currentPrecipProb').textContent = `${precipProb}%`;

    // 2. Previsão Horária (criação dos elementos)
    hourlyList.innerHTML = ''; 
    const hourlyItems = [];
    todayData.hours.forEach(hour => {
        // ... (criação do item, igual ao código anterior) ...
        const item = document.createElement('div');
        item.classList.add('hourly-item');
        const hourTime = hour.datetime.substring(0, 5); 
        const precipProbHour = hour.precipprob !== undefined ? hour.precipprob : (hour.precip > 0 ? 100 : 0);
        item.innerHTML = `
            <strong>${hourTime}</strong><br>
            ${Math.round(hour.temp)}°C<br>
            ${hour.conditions}<br>
            Vento: ${hour.windspeed} km/h<br>
            Chuva: ${precipProbHour}%
        `;
        hourlyList.appendChild(item);
        hourlyItems.push(item);
    });

    // 3. 🎬 Aplica Animações do Motion One

    // A. Animação de entrada do bloco principal (Fade-in e Slide-up)
    weatherDisplay.style.display = 'block';
    animate(weatherDisplay, 
        { opacity: [0, 1], y: [20, 0] }, // Anima opacidade de 0 para 1 e y de 20px para 0
        { duration: 0.6, easing: spring() } // Usa a suavização spring para um toque mais "premium"
    );

    // B. Animação em cascata (Stagger) para os itens horários
    animate(hourlyItems, 
        { opacity: [0, 1], x: [10, 0] }, 
        { 
            delay: stagger(0.05), // Atraso de 50ms entre o início da animação de cada item
            duration: 0.3 
        }
    );

    errorMessage.style.display = 'none';
}

// 3. Adicionar Listeners de Eventos
searchButton.addEventListener('click', () => {
    const location = locationInput.value.trim();
    fetchWeather(location);
});

refreshButton.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) {
        fetchWeather(location);
    } else {
        // Se não houver localização digitada, tenta atualizar com a localização atual (se o stretch goal for implementado)
        // Se não, pede para o usuário digitar
        try {
            fetchWeather('', true); // Tenta usar geolocalização
        } catch (e) {
            displayError('Digite uma localização ou habilite a geolocalização.');
        }
    }
});

// Stretch Goal: Carregar o clima da localização atual por padrão
document.addEventListener('DOMContentLoaded', () => {
    // Tenta carregar o clima atual por geolocalização
    // Se falhar (rejeitado ou não suportado), o usuário terá que digitar.
    fetchWeather('', true).catch(error => {
        console.log("Falha ao carregar a geolocalização. Usuário deve inserir a localização.");
        hideLoading(); // Garante que a tela de carregamento seja ocultada
    });
});