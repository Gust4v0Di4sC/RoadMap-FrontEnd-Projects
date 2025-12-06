
interface ButtonProps {
    handleClick: () => void;
    Icone: React.ElementType;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({handleClick,Icone,className}) => {
    return(
        <button
        onClick={handleClick}
        className={className}
      >
        <Icone />
      </button>
    );
};

export default Button;