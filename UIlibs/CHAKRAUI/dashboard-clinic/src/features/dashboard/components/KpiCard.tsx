import React from 'react';
import { Card, CardBody, Stat, StatLabel, StatHelpText, StatValueText } from '@chakra-ui/react';

interface KpiCardProps {
  label: string;
  value: string;
  helperText: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, helperText }) => {
  return (
    <>
     <Card.Root>
      <CardBody>
        <Stat.Root>
          <StatLabel>{label}</StatLabel>
          <StatValueText>{value}</StatValueText>
          <StatHelpText>{helperText}</StatHelpText>
        </Stat.Root>
      </CardBody>
    </Card.Root>
    </>
  );
};

export default KpiCard;
