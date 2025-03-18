import React, { Suspense } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/hooks';

const TopUpModal = React.lazy(() => import('./TopUpModal'));

const PlanBanner: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg="yellow.400" color="black" p={3} textAlign="center">
      <Text fontSize="lg" fontWeight="bold">You're out of credits – time to top up and keep going!</Text>
      <Text>Top up your credits to continue using the service without interruption.</Text>
      <Button mt={2} colorScheme="teal" onClick={onOpen}>Top Up Credits</Button>
      <Suspense fallback={<div>Loading...</div>}>
        {isOpen && <TopUpModal isOpen={isOpen} onClose={onClose} />}
      </Suspense>
    </Box>
  );
};

export default PlanBanner;
