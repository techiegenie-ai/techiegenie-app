import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  VStack,
} from '@chakra-ui/react';

interface CloseConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const CloseConfirmationDialog: React.FC<CloseConfirmationDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Exit</ModalHeader>
        <ModalBody>
          <VStack spacing={4} align="stretch">
              <Text>There are running processes that will be terminated. Are you sure you want to quit?</Text>
            <Text fontSize="sm" color="gray.600">
              All running processes will be stopped if you quit the application.
            </Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant='solid' mr={3} onClick={onConfirm}>
            Quit
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
