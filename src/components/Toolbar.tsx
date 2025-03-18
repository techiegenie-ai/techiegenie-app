import React from 'react';
import { Flex, IconButton, Tooltip } from '@chakra-ui/react';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import UserProfile from './UserProfile';
import ConsumptionIndicator from './ConsumptionIndicator';
import { clearChat } from '../utils/utils';

const Toolbar: React.FC = () => {
  const handleNewChat = async () => {
    await clearChat();
  };

  return (
    <Flex
      as="header"
      width="100%"
      height="4.5rem"
      padding={4}
      backgroundColor="var(--chakra-colors-chakra-body-bg)"
      alignItems="center"
      justifyContent="space-between"
      color="var(--chakra-colors-teal-600)"
    >
      <Tooltip label="New Chat" hasArrow openDelay={400}>
        <IconButton
          aria-label="New Chat"
          icon={<HiOutlinePencilAlt fontSize="1.5rem" />}
          onClick={handleNewChat}
          variant="ghost"
          color="var(--chakra-colors-teal-600)"
        />
      </Tooltip>
      <Flex alignItems="center">
        <ConsumptionIndicator />
        <UserProfile />
      </Flex>
    </Flex>
  );
};

export default Toolbar;
