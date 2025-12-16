import { Box, List, ListItem, Badge, Text, } from '@chakra-ui/react';

const appointments = [
  { id: 1, patient: 'João Silva', time: '10:00', professional: 'Dr. Carlos', status: 'confirmado' },
  { id: 2, patient: 'Maria Oliveira', time: '11:00', professional: 'Dr. Ana', status: 'aguardando' },
  { id: 3, patient: 'Carlos Souza', time: '14:00', professional: 'Dr. Marcos', status: 'confirmado' },
  { id: 4, patient: 'Juliana Lima', time: '15:00', professional: 'Dr. José', status: 'confirmado' },
];

const AppointmentsList = () => {
  return (
    <Box>
      <List.Root >
        {appointments.map((appointment) => (
          <ListItem key={appointment.id} p={4} borderWidth={1} borderRadius="md">
            <Text fontWeight="bold">{appointment.patient}</Text>
            <Text>{appointment.time} - {appointment.professional}</Text>
            <Badge colorScheme={appointment.status === 'confirmado' ? 'green' : 'yellow'}>
              {appointment.status}
            </Badge>
          </ListItem>
        ))}
      </List.Root>
    </Box>
  );
};

export default AppointmentsList;
