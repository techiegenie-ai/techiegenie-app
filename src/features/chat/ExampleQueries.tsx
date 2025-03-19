// src/components/ExampleQueries.tsx

import React from 'react';
import { Button, Flex, Wrap, WrapItem } from '@chakra-ui/react';

const exampleQueries = [
  "Show system status",
  "Check disk space",
  "If I compress all my PNG files in the downloads to webp, how much space will I save?",
  "Check memory usage",
  "I can't remember my wifi password. But I now connected to it. Can you help me?",
  "Check network status",
  "How much space do the temporary files occupy?"
];

interface ExampleQueriesProps {
  onExampleClick: (query: string) => void;
  isDisabled: boolean;
}

const ExampleQueries: React.FC<ExampleQueriesProps> = ({ onExampleClick, isDisabled = true }) => {
  return (
    <Flex height="100%" alignItems="center" justifyContent="center">
      <Wrap justify="center" spacing={4}>
        {exampleQueries.map((query, index) => (
          <WrapItem key={index}>
            <Button
              size="md"
              colorScheme="teal"
              variant='outline'
              onClick={() => onExampleClick(query)}
              whiteSpace="pre-line"
              px={4}
              py={2}
              height='auto'
              maxWidth="16rem"
              isDisabled={isDisabled}
            >
              {query}
            </Button>
          </WrapItem>
        ))}
      </Wrap>
    </Flex>
  );
};

export default ExampleQueries;
