import React from "react";
import { Box, Flex, Heading, Text, Skeleton, Badge } from "@chakra-ui/react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export type TrendsPoint = {
  name: string; // "Jan", "Feb"...
  appointments: number;
};

function CardShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      bg="white"
      borderRadius="22px"
      p={{ base: 5, md: 6 }}
      boxShadow="0 10px 24px rgba(20,60,120,0.10)"
      border="1px solid rgba(210,230,255,0.6)"
    >
      <Flex align="start" justify="space-between" gap={4} mb={4}>
        <Box>
          <Heading size="md" color="#0B1B33">
            {title}
          </Heading>
          {subtitle ? (
            <Text mt={1} fontSize="sm" color="#5C6B82">
              {subtitle}
            </Text>
          ) : null}
        </Box>

        <Badge
          px={3}
          py={1}
          borderRadius="999px"
          fontWeight="700"
          fontSize="xs"
          textTransform="none"
          bg="#EEF6FF"
          color="#1D4ED8"
          border="1px solid rgba(29,78,216,0.14)"
        >
          Last 6 months
        </Badge>
      </Flex>

      {children}
    </Box>
  );
}

function EmptyChartState({
  title = "Sem dados para exibir",
  description = "Quando houver movimentação, o gráfico aparecerá aqui.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Box
      borderRadius="16px"
      bg="#F6FBFF"
      border="1px dashed rgba(140,170,210,0.55)"
      p={6}
      textAlign="center"
      color="#5C6B82"
    >
      <Text fontWeight="700" color="#0B1B33">
        {title}
      </Text>
      <Text mt={1} fontSize="sm">
        {description}
      </Text>
    </Box>
  );
}

function DefaultTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const value = payload[0]?.value;

  return (
    <Box
      bg="white"
      border="1px solid rgba(210,230,255,0.9)"
      boxShadow="0 10px 24px rgba(20,60,120,0.10)"
      borderRadius="12px"
      px={3}
      py={2}
    >
      <Text fontSize="xs" color="#5C6B82" fontWeight="700">
        {label}
      </Text>
      <Text fontSize="sm" color="#0B1B33" fontWeight="800">
        {value} appointments
      </Text>
    </Box>
  );
}

export function AppointmentTrendsCard({
  data,
  isLoading,
  subtitle = "Appointments volume over time",
}: {
  data: TrendsPoint[];
  isLoading: boolean;
  subtitle?: string;
}) {
  return (
    <CardShell title="Appointment Trends" subtitle={subtitle}>
      {isLoading ? (
        <Skeleton height="340px" borderRadius="16px" />
      ) : data.length === 0 ? (
        <EmptyChartState />
      ) : (
        <Box h="340px" borderRadius="16px" overflow="hidden">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 14, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 6" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                style={{ fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                style={{ fontSize: 12 }}
              />
              <Tooltip content={<DefaultTooltip />} />

              {/* linha principal (sem definir cor aqui, Recharts usa default) */}
              <Line
                type="monotone"
                dataKey="appointments"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}

      {/* legenda simples (igual ao print) */}
      {!isLoading && data.length > 0 ? (
        <Flex mt={3} justify="center">
          <Text fontSize="sm" color="#0B5BFF" fontWeight="700">
            • Appointments
          </Text>
        </Flex>
      ) : null}
    </CardShell>
  );
}
