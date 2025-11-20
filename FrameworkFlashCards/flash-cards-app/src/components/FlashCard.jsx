const FlashCard = ({ data, isFlipped, onFlip }) => {
  return (
    <div 
      className="relative w-full h-80 [perspective:1000px] cursor-pointer group mb-4"
      onClick={onFlip}
    >
      <div 
        className={`relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] shadow-lg rounded-2xl ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        {/* Frente */}
        <div className="absolute inset-0 w-full h-full bg-white rounded-2xl border-2 border-gray-100 flex flex-col items-center justify-center p-8 text-center [backface-visibility:hidden]">
          <div className="mb-4 text-gray-400 text-sm uppercase tracking-wide font-bold">Pergunta</div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
            {data.question}
          </h2>
          <p className="mt-8 text-gray-400 text-xs flex items-center gap-1">
            <RotateCw size={12} /> Clique para ver a resposta
          </p>
        </div>

        {/* Verso */}
        <div className="absolute inset-0 w-full h-full bg-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div className="mb-4 text-blue-300 text-sm uppercase tracking-wide font-bold">Resposta</div>
          <p className="text-xl text-white leading-relaxed font-medium">
            {data.answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlashCard;