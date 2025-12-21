import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  Stack,
  Skeleton,
} from "@chakra-ui/react";
import { Clock, User } from "lucide-react";

type AppointmentStatus = "confirmed" | "pending" | "completed" | "cancelled";

export interface AppointmentItem {
  id: string | number;
  patientName: string;
  reason: string; // "General Checkup", "Follow-up"...
  timeLabel: string; // "09:00 AM"
  status: AppointmentStatus;
}

function statusStyles(status: AppointmentStatus) {
  switch (status) {
    case "confirmed":
      return {
        label: "Confirmed",
        bg: "#D7F3FF",
        color: "#0B7EA8",
        border: "1px solid rgba(11,126,168,0.18)",
      };
    case "pending":
      return {
        label: "Pending",
        bg: "#FFF3D6",
        color: "#B45309",
        border: "1px solid rgba(180,83,9,0.18)",
      };
    case "completed":
      return {
        label: "Completed",
        bg: "#DCFCE7",
        color: "#15803D",
        border: "1px solid rgba(21,128,61,0.18)",
      };
    case "cancelled":
    default:
      return {
        label: "Cancelled",
        bg: "#FEE2E2",
        color: "#B91C1C",
        border: "1px solid rgba(185,28,28,0.18)",
      };
  }
}

function AppointmentRow({ item }: { item: AppointmentItem }) {
  const s = statusStyles(item.status);

  return (
    <Flex
      align="center"
      justify="space-between"
      bg="white"
      borderRadius="14px"
      px={{ base: 4, md: 5 }}
      py={{ base: 4, md: 4 }}
      border="1px solid rgba(210,230,255,0.8)"
      boxShadow="0 6px 14px rgba(20,60,120,0.06)"
      gap={4}
    >
      {/* Left: avatar + text */}
      <Flex align="center" gap={4} minW={0}>
        <Box
          w="44px"
          h="44px"
          borderRadius="999px"
          bgGradient="to-r"
          gradientFrom="#0B5BFF"
          gradientTo="#00B3C8"
          display="grid"
          placeItems="center"
          color="white"
          boxShadow="0 10px 18px rgba(11,91,255,0.18)"
          flexShrink={0}
        >
          <User size={18} />
        </Box>

        <Box minW={0}>
          <Text fontWeight="700" color="#0B1B33" lineClamp={1}>
            {item.patientName}
          </Text>
          <Text fontSize="sm" color="#5C6B82" lineClamp={1}>
            {item.reason}
          </Text>
        </Box>
      </Flex>

      {/* Right: time + status */}
      <Flex align="center" gap={{ base: 3, md: 4 }} flexShrink={0}>
        <Flex align="center" gap={2} color="#3B4B63">
          <Clock size={16} />
          <Text fontSize="sm" fontWeight="600">
            {item.timeLabel}
          </Text>
        </Flex>

        <Badge
          px={3}
          py={1}
          borderRadius="999px"
          fontWeight="700"
          fontSize="xs"
          textTransform="none"
          bg={s.bg}
          color={s.color}
          border={s.border}
        >
          {s.label}
        </Badge>
      </Flex>
    </Flex>
  );
}

function AppointmentsSkeleton() {
  return (
    <Stack gap={4}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} height="78px" borderRadius="14px" />
      ))}
    </Stack>
  );
}

export function AppointmentsList({
  title = "Today's Appointments",
  items,
  isLoading,
  emptyState,
}: {
  title?: string;
  items: AppointmentItem[];
  isLoading: boolean;
  emptyState?: React.ReactNode;
}) {
  return (
    <Box
      bg="#F6FBFF"
      borderRadius="18px"
      p={{ base: 4, md: 6 }}
      border="1px solid rgba(210,230,255,0.7)"
      boxShadow="0 14px 28px rgba(20,60,120,0.10)"
    >
      <Heading size="md" color="#0B1B33" mb={4}>
        {title}
      </Heading>

      {isLoading ? (
        <AppointmentsSkeleton />
      ) : items.length === 0 ? (
        emptyState ?? (
          <Box
            bg="white"
            borderRadius="14px"
            p={6}
            border="1px solid rgba(210,230,255,0.8)"
          >
            <Text fontWeight="700" color="#0B1B33">
              Nenhum atendimento hoje
            </Text>
            <Text mt={1} fontSize="sm" color="#5C6B82">
              Assim que houver agendamentos, eles aparecerão aqui.
            </Text>
          </Box>
        )
      ) : (
        <Stack gap={4}>
          {items.map((item) => (
            <AppointmentRow key={item.id} item={item} />
          ))}
        </Stack>
      )}
    </Box>
  );
}
