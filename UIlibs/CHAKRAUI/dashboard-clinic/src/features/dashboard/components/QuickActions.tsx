import React from "react";
import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { UserPlus, CalendarPlus, FileText, Pill } from "lucide-react";

function ActionTile({
  title,
  icon: Icon,
  gradient,
  gradientF,
  gradientT
}: {
  title: string;
  icon: React.ElementType;
  gradient: string;
  gradientF?: string;
  gradientT?: string;
}) {
  return (
    <Box
      bg="#F6FBFF"
      border="1px solid rgba(210,230,255,0.8)"
      borderRadius="18px"
      p={5}
      textAlign="center"
      _hover={{ transform: "translateY(-2px)", boxShadow: "0 12px 24px rgba(20,60,120,0.12)" }}
      transition="all 0.2s ease"
    >
      <Box
        mx="auto"
        mb={3}
        w="54px"
        h="54px"
        borderRadius="999px"
        bgGradient={gradient}
        gradientFrom={gradientF}
        gradientTo={gradientT}
        display="grid"
        placeItems="center"
        color="white"
        boxShadow="0 10px 20px rgba(20,60,120,0.18)"
      >
        <Icon size={22} />
      </Box>
      <Text fontWeight="700" color="#0B1B33">
        {title}
      </Text>
    </Box>
  );
}

export function QuickActionsCard() {
  return (
    <Box
      bg="white"
      borderRadius="22px"
      p={{ base: 5, md: 6 }}
      boxShadow="0 10px 24px rgba(20,60,120,0.10)"
      border="1px solid rgba(210,230,255,0.6)"
       h="full"
  display="flex"
      flexDir="column"
    >
      <Heading size="md" mb={4} color="#0B1B33">
        Quick Actions
      </Heading>

      <SimpleGrid columns={{ base: 2 }} gap={4}>
        <ActionTile title="New Patient" icon={UserPlus} gradient="to-r" gradientF="#0B5BFF" gradientT="#00B3C8" />
        <ActionTile title="Schedule" icon={CalendarPlus} gradient="to-r" gradientF="#2F6BFF" gradientT="#4F46E5" />
        <ActionTile title="Records" icon={FileText} gradient="to-r" gradientF="#7C3AED" gradientT="#4F46E5" />
        <ActionTile title="Prescriptions" icon={Pill} gradient="to-r" gradientF="#EC4899" gradientT="#8B5CF6" />
      </SimpleGrid>
    </Box>
  );
}
