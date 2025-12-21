import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
import { TopBar }  from "./features/dashboard/components/TopBar";
import { KpiCard } from "./features/dashboard/components/KpiCard";

import { QuickActionsCard } from "./features/dashboard/components/QuickActions";
import { Users, CalendarDays, Activity, HeartPulse } from "lucide-react";
import { AppointmentsList } from "./features/dashboard/components/AppointmentsList";
import { AppointmentTrendsCard } from "./features/dashboard/components/AppointmentTrendsCard";
import { KpiSkeleton } from "./features/dashboard/components/KpiSkeleton";

const trends = [
  { name: "Jan", appointments: 140 },
  { name: "Feb", appointments: 165 },
  { name: "Mar", appointments: 195 },
  { name: "Apr", appointments: 175 },
  { name: "May", appointments: 210 },
  { name: "Jun", appointments: 235 },
];

const isLoading = false;

export default function DashboardPage() {
  return (
    <Box minH="100vh" bg="#F3F8FF">
      <TopBar />

      <Container maxW="container.xl" py={{ base: 6, md: 10 }}>
        {/* Welcome */}
        <Box mb={8}>
          <Heading size="lg" color="#0B1B33">
            Welcome back, Dr. Mitchell
          </Heading>
          <Text mt={2} color="#5C6B82">
            Here's what's happening with your clinic today.
          </Text>
        </Box>

        {/* KPI Grid */}
        {isLoading ? (<KpiSkeleton />):(
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={6} mb={8}>
          <KpiCard
            title="Total Patients"
            value="1,284"
            delta="+12.5% vs last month"
            deltaType="up"
            icon={Users}
            accent="blue"
          />
          <KpiCard
            title="Today's Appointments"
            value="24"
            delta="+5.2% vs last month"
            deltaType="up"
            icon={CalendarDays}
            accent="indigo"
          />
          <KpiCard
            title="Active Cases"
            value="156"
            delta="-3.1% vs last month"
            deltaType="down"
            icon={Activity}
            accent="purple"
          />
          <KpiCard
            title="Patient Satisfaction"
            value="98.5%"
            delta="+2.3% vs last month"
            deltaType="up"
            icon={HeartPulse}
            accent="pink"
          />
        </SimpleGrid>
        )}
        

        {/* Main area */}
        <Flex gap={6} direction={{ base: "column", lg: "row" }} >
          <Box flex="2">
            <AppointmentTrendsCard data={trends} isLoading={false}/>
          </Box>
          <Box flex="1">
            <QuickActionsCard />
          </Box>
        </Flex>
        <Flex mt={6} gap={6} direction={{ base: "column", lg: "row" }}>
           <Box flex="1">
            <AppointmentsList
              isLoading={false}
              items={[
                {
                  id: 1,
                  patientName: "Sarah Johnson",
                  reason: "General Checkup",
                  timeLabel: "09:00 AM",
                  status: "confirmed",
                },
                {
                  id: 2,
                  patientName: "Michael Chen",
                  reason: "Follow-up",
                  timeLabel: "10:30 AM",
                  status: "confirmed",
                },
                {
                  id: 3,
                  patientName: "Emily Davis",
                  reason: "Lab Results",
                  timeLabel: "11:00 AM",
                  status: "pending",
                },
                {
                  id: 4,
                  patientName: "James Wilson",
                  reason: "Consultation",
                  timeLabel: "02:00 PM",
                  status: "confirmed",
                },
                {
                  id: 5,
                  patientName: "Lisa Anderson",
                  reason: "Physical Exam",
                  timeLabel: "03:30 PM",
                  status: "completed",
                },
              ]}
            />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
