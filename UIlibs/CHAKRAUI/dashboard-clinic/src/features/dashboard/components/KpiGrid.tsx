
import { SimpleGrid,} from '@chakra-ui/react';
import KpiCard from './KpiCard';

const KpiGrid = () => {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }}  mb={8}>
      <KpiCard label="Atendimentos Hoje" value="150" helperText="+20% do mês passado" />
      <KpiCard label="Pacientes Atendidos" value="1200" helperText="Crescimento de 10%" />
      <KpiCard label="Faturamento" value="R$ 15.000" helperText="+5% do mês anterior" />
      <KpiCard label="Taxa de Ocupação" value="80%" helperText="Média mensal" />
    </SimpleGrid>
  );
};

export default KpiGrid;
