interface FooterProps {
  cycles: number;
  config: {
    work: 25;
    shortBreak: 5;
    longBreak: 15;
    longBreakInterval: 4;
  };
}

const Footer : React.FC<FooterProps> = ({cycles, config}) => {
  return (
    <div className="text-center text-white/80 bg-black/10 py-3 rounded-xl backdrop-blur-sm">
      <p>
        Sessões Completas:{" "}
        <span className="font-bold text-xl ml-1 text-white">{cycles}</span>
      </p>
      <div className="text-xs mt-1 opacity-70">
        Pausa longa em{" "}
        {config.longBreakInterval - (cycles % config.longBreakInterval)} sessões
      </div>
    </div>
  );
};

export default Footer;
