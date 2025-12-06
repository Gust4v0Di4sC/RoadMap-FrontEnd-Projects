import { Settings } from "lucide-react";
import Button from "./Button";

interface HeaderProps {
  handleClick: () => void;
}

const Header: React.FC<HeaderProps> = ({handleClick}) => {
  return (
    <header className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🍅</span>
        <h1 className="text-xl font-bold tracking-wide">TomateTimer</h1>
      </div>
      <Button className="p-2 rounded-full hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Configurações" handleClick={handleClick} Icone={Settings}/>
    </header>
  );
};

export default Header;
