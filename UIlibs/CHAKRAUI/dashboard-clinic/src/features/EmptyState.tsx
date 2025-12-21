import { VStack, Text, Button } from "@chakra-ui/react";
import { CalendarX } from "lucide-react";

interface Props {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "Nenhum dado encontrado",
  description = "Quando houver informações, elas aparecerão aqui.",
  actionLabel,
  onAction,
}: Props) {
  return (
    <VStack.prototype py={10} spacing={4} textAlign="center">
      <CalendarX size={32} />
      
      <Text fontWeight="medium">{title}</Text>

      {description && (
        <Text fontSize="sm" color="fg.muted">
          {description}
        </Text>
      )}

      {actionLabel && onAction && (
        <Button size="sm" colorScheme="teal" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </VStack.prototype>
  );
}
