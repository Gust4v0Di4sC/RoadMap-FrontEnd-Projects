import { useState } from "react";
import "./App.css";
import ProgressBar from "./components/ProgressBar";
import FlashCard from "./components/FlashCard";
import Controls from "./components/Controls";

const questionsData = [
  {
    id: 1,
    question: "Qual a diferença entre var, let e const?",
    answer:
      "Var tem escopo de função e pode ser redeclarada. Let tem escopo de bloco e pode ser reatribuída. Const tem escopo de bloco e não pode ser reatribuída.",
  },
  {
    id: 2,
    question: "O que é o Virtual DOM no React?",
    answer:
      "É uma representação leve do DOM real em memória. O React usa isso para detectar mudanças e atualizar apenas o necessário no DOM real, melhorando a performance.",
  },
  {
    id: 3,
    question: "Para que serve o hook useState?",
    answer:
      "Permite adicionar estado a componentes funcionais. Ele retorna um par: o valor do estado atual e uma função para atualizá-lo.",
  },
  {
    id: 4,
    question: "O que são Props?",
    answer:
      "Props (propriedades) são entradas que passamos para componentes React. São imutáveis (somente leitura) e permitem a comunicação de pai para filho.",
  },
  {
    id: 5,
    question: "O que é JSX?",
    answer:
      "Uma extensão de sintaxe para JavaScript que permite escrever HTML dentro do código JS. O React transforma JSX em chamadas de função JavaScript.",
  },
];

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const totalCards = questionsData.length;
  const currentCard = questionsData[currentIndex];

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev - 1), 150);
    }
  };

  const handleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div>
        <Container>
          <div className="text-center">
            <h1>Flash Cards</h1>
          </div>
          <ProgressBar current={currentIndex + 1} total={totalCards} />
          <FlashCard
            data={currentCard}
            isFlipped={isFlipped}
            onFlip={handleFlip}
          />
          <Controls
            onNext={handleNext}
            onPrev={handlePrev}
            onFlip={handleFlip}
            isFlipped={isFlipped}
            hasNext={currentIndex < totalCards - 1}
            hasPrev={currentIndex > 0}
          />
        </Container>
    </div>
  );
}

export default App;
