const TomatoBackground = () => {
  // Cria um array com um número fixo de elementos para renderizar os tomates
  const tomatoes = Array.from({ length: 20 });

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {tomatoes.map((_, index) => {
        // Gera valores aleatórios para a posição inicial, duração e atraso da animação
        const left = `${Math.random() * 100}%`;
        const top = `${Math.random() * 100}%`;
        const animationDuration = `${Math.random() * 20 + 10}s`; // Entre 10s e 30s
        const animationDelay = `${Math.random() * 10}s`; // Atraso de até 10s
        const size = `${Math.random() * 2 + 1}rem`; // Tamanho entre 1rem e 3rem

        return (
          <div
            key={index}
            className="absolute text-4xl opacity-10 animate-float"
            style={{
              left,
              top,
              fontSize: size,
              animationDuration,
              animationDelay,
            }}
          >
            🍅
          </div>
        );
      })}
      {/* Correção: Removido o atributo 'jsx' que causava o aviso na consola */}
      <style>{`
        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(100px, 100px) rotate(180deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }
        .animate-float {
          animation-name: float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};

export default TomatoBackground;