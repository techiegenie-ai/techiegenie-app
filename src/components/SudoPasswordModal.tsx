import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, HStack, Text } from '@chakra-ui/react';

interface SudoPasswordModalProps {
  isOpen: boolean;
  sudoMessage: string;
  sudoPassword: string;
  setSudoPassword: (password: string) => void;
  handleSudoPasswordSubmit: () => void;
  handleSudoPasswordCancel: () => void;
}

const SudoPasswordModal: React.FC<SudoPasswordModalProps> = ({
  isOpen,
  sudoMessage,
  sudoPassword,
  setSudoPassword,
  handleSudoPasswordSubmit,
  handleSudoPasswordCancel
}) => {
  const initialRef = React.useRef(null);

  // useEffect(() => {
  //   if (isOpen) {
  //     // Focus on the input when modal opens
  //     const input = document.getElementById('sudo-password-input') as HTMLInputElement;
  //     input?.focus();
  //   }
  // }, [isOpen]);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSudoPasswordSubmit();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleSudoPasswordCancel} isCentered closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Enter Sudo Password</ModalHeader>
        <ModalBody>
          <Text mb={3}>{sudoMessage}</Text>
          <Input
            id="sudo-password-input"
            type="password"
            value={sudoPassword}
            onChange={(e) => setSudoPassword(e.target.value)}
            placeholder="Enter sudo password"
            onKeyPress={handleKeyPress}
            ref={initialRef}
          />
        </ModalBody>
        <ModalFooter>
          <HStack spacing={2}>
            <Button colorScheme="blue" mr={2} onClick={handleSudoPasswordSubmit}>
              OK
            </Button>
            <Button variant='ghost' onClick={handleSudoPasswordCancel}>
              Cancel
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SudoPasswordModal;
