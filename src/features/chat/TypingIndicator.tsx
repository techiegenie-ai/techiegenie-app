import React from 'react';
import { HStack, Circle } from '@chakra-ui/react';

const TypingIndicator: React.FC = () => {
  return (
    <HStack spacing={1}>
      <Circle size="8px" bg="gray.500" animation="typing 1s infinite" />
      <Circle size="8px" bg="gray.500" animation="typing 1s infinite 0.3s" />
      <Circle size="8px" bg="gray.500" animation="typing 1s infinite 0.6s" />
      <style>
        {`
          @keyframes typing {
            0% { opacity: 0.2; }
            20% { opacity: 1; }
            100% { opacity: 0.2; }
          }
        `}
      </style>
    </HStack>
  );
};

export default TypingIndicator;
