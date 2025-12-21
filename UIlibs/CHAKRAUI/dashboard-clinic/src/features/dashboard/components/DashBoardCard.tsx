import { Card, CardBody } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  variant?: "default" | "success" | "warning";
}

export function DashboardCard({ children, variant = "default" }: Props) {
  const variants = {
    default: {},
    success: { borderColor: "green.400" },
    warning: { borderColor: "orange.400" },
  };

  return (
    <Card.Root borderWidth="1px" {...variants[variant]}>
      <CardBody>{children}</CardBody>
    </Card.Root>
  );
}
