import { Skeleton, SimpleGrid } from "@chakra-ui/react";

export function KpiSkeleton() {
  return (
    <SimpleGrid columns={{ base: 1, md: 4 }} gap={4}>
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} height="90px" borderRadius="md" />
      ))}
    </SimpleGrid>
  );
}
