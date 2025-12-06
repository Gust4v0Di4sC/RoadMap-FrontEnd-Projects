import React from "react";

interface ConfigModalProps {
  handleClick: () => void;
  icones: {
    principal: React.ElementType;
    acao?: React.ElementType;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  config: {
    work: number;
    shortBreak: number;
    longBreak: number;
    longBreakInterval: number;
  };
}

const ConfigModal: React.FC<ConfigModalProps> = ({
  icones,
  handleClick,
  handleChange,
  config,
}) => {
  const { principal: IconePrincipal, acao: IconeAcao } = icones;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white text-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <IconePrincipal size={18} /> Configurações
          </h2>
          <div>
            {IconeAcao && (
              <button
                onClick={handleClick}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <IconeAcao size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Tempo (em minutos)
            </h3>

            <div className="flex justify-between items-center">
              <label htmlFor="work" className="font-medium">
                Foco (Tomate)
              </label>
              <input
                id="work"
                name="work"
                type="number"
                value={config.work}
                onChange={handleChange}
                className="w-20 p-2 border border-gray-300 rounded-lg text-center font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-between items-center">
              <label htmlFor="shortBreak" className="font-medium">
                Pausa Curta
              </label>
              <input
                id="shortBreak"
                name="shortBreak"
                type="number"
                value={config.shortBreak}
                onChange={handleChange}
                className="w-20 p-2 border border-gray-300 rounded-lg text-center font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-between items-center">
              <label htmlFor="longBreak" className="font-medium">
                Pausa Longa
              </label>
              <input
                id="longBreak"
                name="longBreak"
                type="number"
                value={config.longBreak}
                onChange={handleChange}
                className="w-20 p-2 border border-gray-300 rounded-lg text-center font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Regras
            </h3>
            <div className="flex justify-between items-center">
              <label htmlFor="longBreakInterval" className="font-medium">
                Intervalo Pausa Longa
              </label>
              <input
                id="longBreakInterval"
                name="longBreakInterval"
                type="number"
                value={config.longBreakInterval}
                onChange={handleChange}
                className="w-20 p-2 border border-gray-300 rounded-lg text-center font-mono focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 text-center">
          <button
            onClick={handleClick}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors"
          >
            Pronto
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigModal;
