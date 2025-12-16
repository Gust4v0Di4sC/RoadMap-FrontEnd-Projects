import { Box, Card } from '@chakra-ui/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Seg', atendimentos: 10 },
  { name: 'Ter', atendimentos: 30 },
  { name: 'Qua', atendimentos: 45 },
  { name: 'Qui', atendimentos: 60 },
  { name: 'Sex', atendimentos: 55 },
  { name: 'Sáb', atendimentos: 70 },
  { name: 'Dom', atendimentos: 90 },
];

const DashboardChart = () => {
  return (
    <Box>
      <Card.Root>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="atendimentos" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </Card.Root>
    </Box>
  );
};

export default DashboardChart;
