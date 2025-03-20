// src/components/Updater.tsx
import React, { useEffect, useState } from 'react';
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Text } from '@chakra-ui/react';

const Updater: React.FC = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [updateVersion, setUpdateVersion] = useState<string | null>(null);

  useEffect(() => {
    const performUpdate = async () => {
      try {
        const update = await check();
        if (update) {
          console.log(`Found update ${update.version}`);
          setUpdateVersion(update.version);

          await update.downloadAndInstall((event) => {
            switch (event.event) {
              case 'Started':
                console.log(`Started downloading ${event.data.contentLength} bytes`);
                break;
              case 'Progress':
                console.log(`Downloaded chunk of ${event.data.chunkLength} bytes`);
                break;
              case 'Finished':
                console.log('Download and installation finished');
                setIsInstalled(true);
                break;
            }
          });
        }
      } catch (error) {
        console.error('Error during update process:', error);
      }
    };

    performUpdate();
  }, []);

  const handleRelaunch = async () => {
    await relaunch();
  };

  const handleClose = () => {
    setIsInstalled(false); // Allow user to dismiss the modal, app continues running
  };

  return (
    <>
      {isInstalled && (
        <Modal isOpen={true} onClose={handleClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update Installed</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>A new version ({updateVersion}) has been installed. Restart the app to apply the update?</Text>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={handleClose}>
                Later
              </Button>
              <Button colorScheme="blue" onClick={handleRelaunch}>
                Restart Now
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default Updater;
