import React, { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Button,
  Text,
  HStack,
  Link,
  SkeletonText,
} from '@chakra-ui/react';
import Environment from '../utils/Environment';
import { auth } from '../firebaseConfig';
import eventEmitter from '../utils/eventEmitter';
import CheckoutModal from './CheckoutModal'; // Import CheckoutModal

interface CreditPackage {
  package_id: string;
  credits: number;
  price: {
    currency: string;
    amount: number;
  };
}

const TopUpModal: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
  const [packages, setPackages] = useState<CreditPackage[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false); // State to manage CheckoutModal visibility
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null); // State to manage selected packageId
  const [isCheckoutComplete, setIsCheckoutComplete] = useState<boolean>(false); // State to manage a behaviour of close btn

  useEffect(() => {
    if (isOpen) {
      const fetchPackages = async () => {
        try {
          const env = await Environment.getInstance();
          const profile = env.getProfileData();
          const currentUser = auth.currentUser;
          if (!currentUser) throw new Error('User not authenticated');
          const token = await currentUser.getIdToken();
          const response = await fetch(`${profile.checkout}/checkout/packages`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch top-up packages');
          }
          const data = await response.json();
          setPackages(data.packages);
        } catch (err) {
          setError((err as Error).message);
        }
      };

      fetchPackages();
    }
  }, [isOpen]);

  const onComplete = useCallback(async () => {
    console.log('Checkout complete');
    setIsCheckoutComplete(true);
  }, []);

  const handlePurchase = (pkg: CreditPackage) => {
    setSelectedPackageId(pkg.package_id); // Set the selected packageId
    setIsCheckoutOpen(true); // Open CheckoutModal
  };

  const handleCheckoutClose = () => {
    setIsCheckoutOpen(false); // Close CheckoutModal
    setSelectedPackageId(null); // Reset selected packageId
    // if checkout has been completed, close the topup dialog also
    if (isCheckoutComplete) onClose();
    eventEmitter.emit('checkCredits');
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Top-Up Credits</ModalHeader>
          <ModalCloseButton zIndex={10} />
          <ModalBody>
            {error ? (
              <Text color="red.500">Error: {error}</Text>
            ) : (
                <>
                  <Box>
                    <Text>Need more Task Credits?</Text>
                    <Text pt={2}>Choose a package below to top up your credits and keep using TechieGenie without interruptions!</Text>
                  </Box>
                  <HStack spacing={4} width="100%" my={6}>
                    {!packages || false ? (
                      <>
                        <SkeletonText p={4} noOfLines={5} spacing='2' skeletonHeight='5' width="100%" />
                        <SkeletonText p={4} noOfLines={5} spacing='2' skeletonHeight='5' width="100%" />
                        <SkeletonText p={4} noOfLines={5} spacing='2' skeletonHeight='5' width="100%" />
                      </>
                    ) : (

                      packages?.map((pkg) => (
                        <Box key={pkg.package_id} p={4} width="100%" borderWidth="1px" borderRadius="md">
                          <Text fontSize="lg" fontWeight="bold" py={1}>{`${pkg.credits} Task Credits`}</Text>
                          <Text fontSize="lg">{`${pkg.price.currency.toUpperCase()} $${pkg.price.amount}`}</Text>
                    <Button
                      mt={5}
                      mb={2}
                      colorScheme="teal"
                      width="100%"
                      onClick={() => handlePurchase(pkg)}
                    >
                      {`Buy ${pkg.credits} Credits`}
                    </Button>
                  </Box>
                ))
                    )}
                  </HStack>
                  <Box mb={4} color="gray.700">
                    <Text fontSize="xs" pb={1}>All credits are instantly added to your account and do not expire.</Text>
                    <Text fontSize="xs" py={0}>Payments are securely processed via Stripe. Have questions or need help? <Link fontWeight="semibold">Contact Support</Link></Text>
                  </Box>
                </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Checkout Modal */}
      {selectedPackageId && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={handleCheckoutClose}
          packageId={selectedPackageId}
          onComplete={onComplete}
        />
      )}
    </>
  );
};

export default TopUpModal;
