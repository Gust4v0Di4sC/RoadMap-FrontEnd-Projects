const Controls = ({ onNext, onPrev, onFlip, isFlipped, hasNext, hasPrev }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex justify-between items-center">
      <button 
        onClick={onPrev}
        disabled={!hasPrev}
        className={`flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-lg transition-colors
          ${!hasPrev 
            ? 'text-gray-300 cursor-not-allowed' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-black'}`}
      >
        <ChevronLeft size={20} />
        Anterior
      </button>

      <button 
        onClick={onFlip}
        className="text-sm font-bold text-black hover:bg-gray-100 px-6 py-2 rounded-lg transition-colors"
      >
        {isFlipped ? 'Ver Pergunta' : 'Mostrar Resposta'}
      </button>

      <button 
        onClick={onNext}
        disabled={!hasNext}
        className={`flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-lg transition-colors
          ${!hasNext
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:bg-gray-100 hover:text-black'}`}
      >
        Próximo
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Controls;