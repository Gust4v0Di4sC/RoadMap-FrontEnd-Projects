
const ProgressBar = ({ current, total }) => {
  const progressPercentage = (current / total) * 100;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
      <div className="flex justify-between text-sm font-semibold text-gray-600 mb-2">
        <span>Progresso</span>
        <span>{current} de {total}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gray-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className="text-sm font-bold text-black w-10 text-right">
          {Math.round(progressPercentage)}%
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;