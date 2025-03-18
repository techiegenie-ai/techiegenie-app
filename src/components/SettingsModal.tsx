import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Box,
  Text,
  Icon,
} from '@chakra-ui/react';
import { HiOutlineCog, HiOutlineCollection, HiOutlineShieldExclamation } from 'react-icons/hi';
import SafetySettings from './SafetySettings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader pb={2}>Settings</ModalHeader>
        <ModalCloseButton onClick={onClose} zIndex={10} />
        <ModalBody>
          <Tabs orientation="vertical" variant="unstyled" size="xs" align="start" defaultIndex={0}>
            <TabList alignItems="start">
              <Tab pl={2} pr={6} py={1} my={1} _selected={{ bg: 'gray.200', borderRadius: 'md' }}>
                <Icon as={HiOutlineCog} fontSize="1.6em" pr={2} /> General
              </Tab>
              <Tab pl={2} pr={6} py={1} my={1} _selected={{ bg: 'gray.200', borderRadius: 'md' }}>
                <Icon as={HiOutlineShieldExclamation} fontSize="1.6em" pr={2} /> Safety
              </Tab>
              <Tab pl={2} pr={6} py={1} my={1} _selected={{ bg: 'gray.200', borderRadius: 'md' }}>
                <Icon as={HiOutlineCollection} fontSize="1.6em" pr={2} /> History
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel pt={0}>
                <VStack align="start" spacing={4} pt={0}>
                  <Text fontSize="lg" fontWeight="bold">
                    General Settings
                  </Text>
                  <Box>
                    {/* Stub: Add general settings content here */}
                    <Text>General settings content goes here.</Text>
                  </Box>
                </VStack>
              </TabPanel>
              <TabPanel pt={0}>
                <SafetySettings />
              </TabPanel>
              <TabPanel pt={0}>
                <VStack align="start" spacing={4}>
                  <Text fontSize="lg" fontWeight="bold">
                    History Settings
                  </Text>
                  <Box>
                    {/* Stub: Add history settings content here */}
                    <Text>History settings content goes here.</Text>
                  </Box>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SettingsModal;
