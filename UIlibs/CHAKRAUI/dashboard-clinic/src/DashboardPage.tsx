
import { Grid, Container } from '@chakra-ui/react';
import DashboardHeader from './features/dashboard/components/DashboardHeader';
import KpiGrid from './features/dashboard/components/KpiGrid';
import DashboardChart from './features/dashboard/components/DashboardChart';
import AppointmentsList from './features/dashboard/components/AppointmentsList';

const DashboardPage = () => {
  return (
    <Container maxW="container.xl" p={4}>
      <DashboardHeader />
      <KpiGrid />
      <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={6}>
        <DashboardChart />
        <AppointmentsList />
      </Grid>
    </Container>
  );
};

export default DashboardPage;
