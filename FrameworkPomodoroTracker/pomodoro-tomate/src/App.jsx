import { useState,useEffect,useRef,useCallback } from 'react'
import './App.css'
import { Play, Pause, RotateCcw, Settings, X, Coffee, Brain, Armchair  } from 'lucide-react';
import TomatoBackground from './components/TomatoBackground';

const ALARM_SOUND_URL = "https://actions.google.com/sounds/v1/alarms/beep_short.ogg";



function App() {
  // --- Estados de Configuração ---
  const [config, setConfig] = useState({
    work: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
  });

  // --- Estados da Aplicação ---
  const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [timeLeft, setTimeLeft] = useState(config.work * 60);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Referência para o áudio
  const audioRef = useRef(new Audio(ALARM_SOUND_URL));

  // --- Lógica do Timer ---
  
  // Função para tocar som
  const playSound = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(e => console.error("Audio play failed", e));
  };

  // Switch de modos
  const switchMode = useCallback((newMode) => {
    const duration = config[newMode] * 60;
    setMode(newMode);
    setTimeLeft(duration);
    setIsActive(false); // Pausa automaticamente ao trocar de modo
  }, [config]);

  // Efeito principal do Timer
  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Efeito para lidar com o fim do timer
  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      playSound();

      setTimeout(() => {
        setIsActive(false);

        if (mode === 'work') {
          setCycles((prevCycles) => {
            const newCycles = prevCycles + 1;
            if (newCycles % config.longBreakInterval === 0) {
              switchMode('longBreak');
            } else {
              switchMode('shortBreak');
            }
            return newCycles;
          });
        } else {
          switchMode('work');
        }
      }, 0);
    }
  }, [timeLeft, isActive, mode, config.longBreakInterval, switchMode]);


  // --- Handlers ---

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(config[mode] * 60);
  };

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: parseInt(value) || 1, // Evita 0 ou NaN
    }));
  };

  // Formatação de Tempo (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // --- Cores e Temas ---
  const getThemeColors = () => {
    switch (mode) {
      case 'work':
        return 'bg-red-500 text-white'; // Tomate maduro
      case 'shortBreak':
        return 'bg-teal-500 text-white'; // Folha verde
      case 'longBreak':
        return 'bg-blue-500 text-white'; // Água/Descanso
      default:
        return 'bg-red-500 text-white';
    }
  };

  const getProgress = () => {
    const totalTime = config[mode] * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ease-in-out ${getThemeColors()} font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden`}>
      
      {/* Adiciona o componente de fundo */}
      <TomatoBackground />

      {/* Container Principal */}
      <main className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 z-10">
        
        {/* Cabeçalho */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍅</span>
            <h1 className="text-xl font-bold tracking-wide">TomateTimer</h1>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-full hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Configurações"
          >
            <Settings size={24} />
          </button>
        </header>

        {/* Seleção de Modo (Tabs) */}
        <nav className="flex justify-center gap-2 mb-8 bg-black/10 p-1 rounded-full" role="tablist">
          {[
            { id: 'work', label: 'Foco', icon: Brain },
            { id: 'shortBreak', label: 'Pausa Curta', icon: Coffee },
            { id: 'longBreak', label: 'Pausa Longa', icon: Armchair },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => switchMode(item.id)}
              role="tab"
              aria-selected={mode === item.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                mode === item.id ? 'bg-white text-gray-800 shadow-md' : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <item.icon size={16} />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Display do Timer */}
        <div className="text-center mb-8 relative">
          <div className="text-[6rem] leading-none font-bold tracking-tighter drop-shadow-lg font-mono" role="timer" aria-live="polite">
            {formatTime(timeLeft)}
          </div>
          <p className="text-lg opacity-90 mt-2 font-medium uppercase tracking-widest">
            {mode === 'work' ? (isActive ? 'Mantenha o Foco' : 'Pronto para Focar?') : 'Relaxe um pouco'}
          </p>
        </div>

        {/* Controles */}
        <div className="flex justify-center items-center gap-6 mb-8">
          <button
            onClick={toggleTimer}
            className={`h-24 w-24 rounded-3xl flex items-center justify-center shadow-lg transform transition-all active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/50 ${isActive ? 'bg-white text-red-500' : 'bg-red-600 text-white border-4 border-white'}`}
            aria-label={isActive ? "Pausar Timer" : "Iniciar Timer"}
            style={{ color: isActive ? 'inherit' : '#fff' }} // Force white icon on start
          >
            {isActive ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
          </button>

          {isActive && (
             <button
             onClick={resetTimer}
             className="absolute right-8 p-3 rounded-full hover:bg-white/20 transition-all text-white/80 hover:text-white"
             aria-label="Reiniciar Timer"
           >
             <RotateCcw size={24} />
           </button>
          )}
        </div>

        {/* Rodapé / Status */}
        <div className="text-center text-white/80 bg-black/10 py-3 rounded-xl backdrop-blur-sm">
          <p>Sessões Completas: <span className="font-bold text-xl ml-1 text-white">{cycles}</span></p>
          <div className="text-xs mt-1 opacity-70">Pausa longa em {config.longBreakInterval - (cycles % config.longBreakInterval)} sessões</div>
        </div>

      </main>

      {/* Barra de Progresso no Topo da Página (Visual) */}
      <div className="fixed top-0 left-0 w-full h-2 bg-black/10 z-20">
        <div 
          className="h-full bg-white transition-all duration-1000 ease-linear"
          style={{ width: `${getProgress()}%` }}
        />
      </div>

      {/* Modal de Configurações */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
          <div className="bg-white text-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Settings size={18} /> Configurações
              </h2>
              <button onClick={() => setIsSettingsOpen(false)} className="p-1 hover:bg-gray-200 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tempo (em minutos)</h3>
                
                <div className="flex justify-between items-center">
                  <label htmlFor="work" className="font-medium">Foco (Tomate)</label>
                  <input
                    id="work"
                    name="work"
                    type="number"
                    value={config.work}
                    onChange={handleConfigChange}
                    className="w-20 p-2 border border-gray-300 rounded-lg text-center font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <label htmlFor="shortBreak" className="font-medium">Pausa Curta</label>
                  <input
                    id="shortBreak"
                    name="shortBreak"
                    type="number"
                    value={config.shortBreak}
                    onChange={handleConfigChange}
                    className="w-20 p-2 border border-gray-300 rounded-lg text-center font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <label htmlFor="longBreak" className="font-medium">Pausa Longa</label>
                  <input
                    id="longBreak"
                    name="longBreak"
                    type="number"
                    value={config.longBreak}
                    onChange={handleConfigChange}
                    className="w-20 p-2 border border-gray-300 rounded-lg text-center font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

               <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Regras</h3>
                 <div className="flex justify-between items-center">
                  <label htmlFor="longBreakInterval" className="font-medium">Intervalo Pausa Longa</label>
                  <input
                    id="longBreakInterval"
                    name="longBreakInterval"
                    type="number"
                    value={config.longBreakInterval}
                    onChange={handleConfigChange}
                    className="w-20 p-2 border border-gray-300 rounded-lg text-center font-mono focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
               </div>
            </div>

            <div className="p-4 bg-gray-50 text-center">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors"
              >
                Pronto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App
