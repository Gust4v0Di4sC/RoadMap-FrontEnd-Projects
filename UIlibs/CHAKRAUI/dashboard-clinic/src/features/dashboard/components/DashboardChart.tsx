
import { Box, Heading } from "@chakra-ui/react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { name: "Jan", appointments: 140 },
  { name: "Feb", appointments: 165 },
  { name: "Mar", appointments: 195 },
  { name: "Apr", appointments: 175 },
  { name: "May", appointments: 210 },
  { name: "Jun", appointments: 235 },
];

export function AppointmentTrendsCard() {
  return (
    <Box
      bg="white"
      borderRadius="22px"
      p={{ base: 5, md: 6 }}
      boxShadow="0 10px 24px rgba(20,60,120,0.10)"
      border="1px solid rgba(210,230,255,0.6)"
    >
      <Heading size="md" mb={4} color="#0B1B33">
        Appointment Trends
      </Heading>

      <Box h="320px">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="appointments" strokeWidth={3} dot />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
