import {
  Flex,
  Heading,
  Button,
  Text,
  Dialog,
  Portal,
  CloseButton,
} from "@chakra-ui/react";
import { format } from "date-fns";

const DashboardHeader = () => {
  return (
    <Flex justify="space-between" align="center" mb={6}>
      <Heading size="lg">Clínica ABC</Heading>

      <Text>{format(new Date(), "dd/MM/yyyy")}</Text>

      <Dialog.Root size={{ mdDown: "full", md: "lg" }}>
        <Dialog.Trigger asChild>
          <Button colorScheme="teal">
            Novo Atendimento
          </Button>
        </Dialog.Trigger>

        <Portal>
          <Dialog.Backdrop />

          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Novo Atendimento</Dialog.Title>
              </Dialog.Header>

              <Dialog.Body>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </Dialog.Body>

              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancelar</Button>
                </Dialog.ActionTrigger>

                <Button colorScheme="teal">Salvar</Button>
              </Dialog.Footer>

              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Flex>
  );
};

export default DashboardHeader;
