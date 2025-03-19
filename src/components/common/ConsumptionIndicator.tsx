import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { ConsumptionData, eventEmitter } from '@/utils';

const ConsumptionIndicator: React.FC = () => {
  const [consumption, setConsumption] = useState<ConsumptionData | null>(null);

  useEffect(() => {
    const updateConsumption = (data: ConsumptionData) => {
      setConsumption(data);
    };

    eventEmitter.on('updateConsumption', updateConsumption);

    return () => {
      eventEmitter.off('updateConsumption', updateConsumption);
    };
  }, []);

  if (!consumption) {
    return null;
  }

  return (
    <Box fontSize="sm" fontWeight="semibold" mr={3} color="gray.700">
      {`${consumption.prompt_tokens}/${consumption.completion_tokens}`}
    </Box>
  );
};

export default ConsumptionIndicator;
