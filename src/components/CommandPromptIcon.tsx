import React from 'react';
import { Box, Text, Icon } from '@chakra-ui/react';
import { HiStop } from 'react-icons/hi';

interface CommandPromptIconProps {
  isRunning: boolean;
  hoveredId: string | null;
  entryId: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

const CommandPromptIcon: React.FC<CommandPromptIconProps> = ({
  isRunning,
  hoveredId,
  entryId,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  return (
    <span
      style={{
        animationDuration: '2s',
        animation: isRunning && hoveredId !== entryId ? 'shimmer 1.5s infinite' : 'none',
        transition: 'transform 0.3s ease-in-out',
        cursor: isRunning ? 'pointer' : 'default',
        color: hoveredId === entryId && isRunning ? 'red.600' : 'inherit',
        transform: hoveredId === entryId && isRunning ? 'rotateY(180deg)' : 'none',
        display: 'inline-flex',
        alignItems: 'center'
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {hoveredId === entryId && isRunning ? (
        <Box as="span" display="inline-flex" alignItems="center" mr={0} ml={0}>
          <Icon as={HiStop} color="red.600" />
        </Box>
      ) : (
        <Text as="span" width="1em" align="center">
          <b>$</b>
        </Text>
      )}
    </span>
  );
};

export default CommandPromptIcon;
