import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

type DeltaType = "up" | "down" | "neutral";
type Accent = "blue" | "indigo" | "purple" | "pink";

const accentMap: Record<Accent, { bg: string; shadow: string }> = {
  blue: { bg: "linear-gradient(135deg,#0B5BFF,#00B3C8)", shadow: "0 10px 20px rgba(11,91,255,0.25)" },
  indigo: { bg: "linear-gradient(135deg,#2F6BFF,#4F46E5)", shadow: "0 10px 20px rgba(79,70,229,0.25)" },
  purple: { bg: "linear-gradient(135deg,#7C3AED,#4F46E5)", shadow: "0 10px 20px rgba(124,58,237,0.25)" },
  pink: { bg: "linear-gradient(135deg,#EC4899,#8B5CF6)", shadow: "0 10px 20px rgba(236,72,153,0.25)" },
};



export function KpiCard({
  title,
  value,
  delta,
  deltaType,
  icon: Icon,
  accent = "blue",
}: {
  title: string;
  value: string;
  delta: string;
  deltaType: DeltaType;
  icon: React.ElementType;
  accent?: Accent;
}) {
  const deltaColor =
    deltaType === "up" ? "#16A34A" : deltaType === "down" ? "#DC2626" : "#64748B";

  return (
    <Box
      bg="white"
      borderRadius="18px"
      p={5}
      boxShadow="0 10px 24px rgba(20,60,120,0.10)"
      border="1px solid rgba(210,230,255,0.6)"
    >
      <Flex justify="space-between" align="flex-start" gap={4}>
        <Box>
          <Text color="#5C6B82" fontSize="sm" fontWeight="600">
            {title}
          </Text>
          <Text mt={2} fontSize="2xl" fontWeight="800" color="#0B1B33">
            {value}
          </Text>
          <Text mt={2} fontSize="sm" color={deltaColor} fontWeight="600">
            {delta}
          </Text>
        </Box>

        <Box
          w="52px"
          h="52px"
          borderRadius="16px"
          bgGradient={accentMap[accent].bg}
          boxShadow={accentMap[accent].shadow}
          display="grid"
          placeItems="center"
          color="white"
        >
          <Icon size={22} />
        </Box>
      </Flex>
    </Box>
  );
}
