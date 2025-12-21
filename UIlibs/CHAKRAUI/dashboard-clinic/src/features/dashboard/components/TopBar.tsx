import {
  Box,
  Flex,
  HStack,
  Text,
  Avatar,
  Button,
  Input,
} from "@chakra-ui/react";
import { Bell, Search } from "lucide-react";

export function TopBar() {
  return (
    <Box
      bgGradient="to-r"
      gradientFrom="#0B5BFF"
      gradientTo="#00B3C8"
      color="white"
      px={{ base: 4, md: 8 }}
      py={4}
      boxShadow="md"
    >
      <Flex align="center" justify="space-between" gap={4}>
        {/* Left */}
        <HStack gap={3} minW="fit-content">
          <Box
            w="40px"
            h="40px"
            borderRadius="12px"
            bg="rgba(255,255,255,0.18)"
            display="grid"
            placeItems="center"
            fontWeight="800"
            letterSpacing="0.5px"
          >
            HC
          </Box>

          <Box>
            <Text fontWeight="800" lineHeight="1.1">
              HealthCare Clinic
            </Text>
            <Text fontSize="sm" opacity={0.9}>
              Dashboard
            </Text>
          </Box>
        </HStack>

        {/* Search */}
        <Box
          flex="1"
          maxW="520px"
          display={{ base: "none", md: "block" }}
          position="relative"
        >
          <Box
            position="absolute"
            left="12px"
            top="50%"
            transform="translateY(-50%)"
            opacity={0.9}
          >
            <Search size={18} />
          </Box>

          <Input
            placeholder="Search patients, appointments..."
            bg="rgba(255,255,255,0.14)"
            border="1px solid rgba(255,255,255,0.25)"
            color="white"
            _placeholder={{ color: "rgba(255,255,255,0.85)" }}
            ps="40px" // Chakra v3: prefira ps (padding-start) em vez de pl
            borderRadius="14px"
            h="40px"
          />
        </Box>

        {/* Right */}
        <HStack gap={3}>
          {/* Notificações (v3-safe) */}
          <Button
            variant="ghost"
            color="white"
            _hover={{ bg: "rgba(255,255,255,0.14)" }}
            px={2}
            aria-label="Notifications"
          >
            <Bell size={18} />
          </Button>

          <HStack gap={3}>
            <Box textAlign="right" display={{ base: "none", md: "block" }}>
              <Text fontWeight="800" lineHeight="1.1">
                Dr. Sarah Mitchell
              </Text>
              <Text fontSize="sm" opacity={0.9}>
                General Practitioner
              </Text>
            </Box>

            {/* Avatar (Chakra v3) */}
            <Avatar.Root size="sm">
              <Avatar.Fallback name="Sarah Mitchell" />
            </Avatar.Root>
          </HStack>
        </HStack>
      </Flex>
    </Box>
  );
}
