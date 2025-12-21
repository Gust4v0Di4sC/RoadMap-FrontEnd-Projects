import { IconButton } from "@chakra-ui/react";
import { useColorMode } from "../components/ui/color-mode";
import {Moon, Sun } from "lucide-react"; 

export function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="Alternar tema"
      onClick={toggleColorMode}
      variant="ghost"
      size="sm"
    >
      {colorMode === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </IconButton>
  );
}
