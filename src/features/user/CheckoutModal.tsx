import React, { useCallback } from 'react';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Environment } from '@/utils';
import { auth } from '@/config/firebaseConfig';

const stripePromise = loadStripe('pk_test_51NxYN8H3Z9Fj8AUwS8ZSDrbfc8ynrkufVE1iwlUzWOw6b0epu1xZ6yuPUTowFgJLsFfYm2ricBvpM0KoNx3omUUt00Cr9V4eGv');

const CheckoutModal: React.FC<{ isOpen: boolean, onClose: () => void, packageId: string, onComplete: () => void; }> = ({ isOpen, onClose, packageId, onComplete }) => {

  const fetchClientSecret = useCallback(async () => {
    const env = await Environment.getInstance();
    const profile = env.getProfileData();
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');
    const token = await currentUser.getIdToken();
    // Create a Checkout Session
    const response = await fetch(`${profile.checkout}/checkout/topup`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ package_id: packageId })
    });
    const data = await response.json();
    return data.clientSecret as string;
  }, [packageId]);

  const options = { fetchClientSecret, onComplete };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent backgroundColor="#525f7f">
        <ModalHeader color="#fff">Top-Up Credits</ModalHeader>
        <ModalCloseButton zIndex={10} color="#fff"/>
        <ModalBody p={0}>
          <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CheckoutModal;
