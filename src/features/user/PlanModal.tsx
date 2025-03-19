import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Text,
  HStack,
  Button,
  Divider,
  Center,
  Flex,
  Skeleton,
  Link,
} from '@chakra-ui/react';
import { Environment } from '@/utils';
import { auth } from '@/config/firebaseConfig';

export type UserPlanResponse = {
  plans: Plan[];
  current_plan: 'free' | 'pro';
  credits: CreditInfo;
  can_top_up: boolean;
  top_up_price: TopUpPrice;
  has_credits: boolean;
  next_billing_date: number;
};

type Plan = {
  plan: 'free' | 'pro';
  monthly_limit: number;
};

type CreditInfo = {
  used: number;
  purchased_remaining: number;
};

type TopUpPrice = {
  currency: string;
  amount_per_credit: number;
};


const PlanModal: React.FC<{ isOpen: boolean, onClose: () => void, onTopUpOpen: () => void; }> = ({ isOpen, onClose, onTopUpOpen }) => {
  const [planData, setPlanData] = useState<UserPlanResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchPlanData = async () => {
        try {
          setLoading(true);
          const env = await Environment.getInstance();
          const profile = env.getProfileData();
          const currentUser = auth.currentUser;
          if (!currentUser) throw new Error('User not authenticated');
          const token = await currentUser.getIdToken();
          const response = await fetch(`${profile.user}/user/plan`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch plan data');
          }
          const data: UserPlanResponse = await response.json();
          setPlanData(data);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      };

      fetchPlanData();
    }
  }, [isOpen]);

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    });
  };

  const currentPlanDescription =
    (
    <>
        {planData?.current_plan === 'free' ? (
        <>
            <Skeleton isLoaded={!!planData} fitContent={true} mb={2}><Text>You are currently on the Free Plan.</Text></Skeleton>
            <Skeleton isLoaded={!!planData} fitContent={true} my={2}><Text>Enjoy basic access to TechieGenie with {planData?.plans.find(plan => plan.plan === 'free')?.monthly_limit + planData?.credits.purchased_remaining - planData.credits.used} Task Credits left out of {planData?.plans.find(plan => plan.plan === 'free')?.monthly_limit + planData?.credits.purchased_remaining} this month.</Text></Skeleton>
            <Skeleton isLoaded={!!planData} fitContent={true} my={2} mt={2}><Text mt={2}>Your credits will refresh on <Text as="span" fontWeight="semibold">{formatDate(planData?.next_billing_date)}</Text>. Keep the tasks rolling!</Text></Skeleton>
        </>
      ) : (
        <>
              <Skeleton isLoaded={!!planData} fitContent={true} mb={2} ><Text>You are currently on the Pro Plan.</Text></Skeleton>
              <Skeleton isLoaded={!!planData} fitContent={true} my={2}><Text>With {planData?.plans.find(plan => plan.plan === 'pro')?.monthly_limit + planData?.credits.purchased_remaining - planData?.credits.used} of your {planData?.plans.find(plan => plan.plan === 'pro')?.monthly_limit + planData?.credits.purchased_remaining} purchased Task Credits remaining.</Text></Skeleton>
              <Skeleton isLoaded={!!planData} fitContent={true} my={2} mt={2}><Text mt={2}>Your credits will refresh on <Text as="span" fontWeight="semibold">{formatDate(planData?.next_billing_date)}</Text>. Keep the tasks rolling!</Text></Skeleton>
        </>
      )}
    </>
    );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>My Plan</ModalHeader>
        <ModalCloseButton zIndex={10} />
        <ModalBody>
          <Box mb={6}>
            {currentPlanDescription}
          </Box>
          <HStack align="start" spacing={4} width="100%" alignItems="stretch">
            {/* Free Plan Section */}
            <Flex
              direction="column"
              justify="space-between"
              width="100%"
              p={6}
              borderWidth="1px"
              borderRadius="md"
            >
              <Box flex="1" fontSize="sm">
                <Text fontWeight="bold" fontSize="lg">
                  Free Plan
                </Text>
                <Text mb={3} fontSize="md">$0/month</Text>
                  <>
                  <Skeleton isLoaded={!!planData} my={2}>
                    <Text>
                      Included: {planData?.plans.find(plan => plan.plan === 'free')?.monthly_limit} Task Credits per month.
                    </Text>
                  </Skeleton>
                  <Skeleton isLoaded={!!planData} my={2}>
                    <Text>
                      You've used {planData?.credits.used} of {planData?.plans.find(plan => plan.plan === 'free')?.monthly_limit + planData?.credits.purchased_remaining} Task Credits.
                    </Text>
                  </Skeleton>
                </>
              </Box>
              <Divider mt={4} />
              <Box mt={4} flex="1">
                <Text fontWeight="bold" mb={1}>Need more Task Credits?</Text>
                <Text>Purchase additional credits as needed to keep using TechieGenie without interruption.</Text>
              </Box>
              <Button
                mt={4}
                colorScheme="teal"
                width="100%"
                alignSelf="flex-end"
                onClick={onTopUpOpen}
                isDisabled={!planData?.can_top_up || loading}
              >
                {/* {loading ? <Spinner size="sm" /> : `Top-Up Credits (${planData?.top_up_price.currency.toUpperCase()} ${planData?.top_up_price.amount_per_credit}/credit)`} */}
                Top-Up Credits
              </Button>
            </Flex>

            {/* Pro Plan Section */}
            <Flex
              direction="column"
              justify="space-between"
              width="100%"
              p={6}
              borderWidth="1px"
              borderRadius="md"
              bg="white"
              position="relative"
            >
              <Box flex="1" fontSize="sm">
                <Text fontWeight="bold" fontSize="lg">
                  Pro Plan
                </Text>
                <Text mb={3} fontSize="md">{`$20/month`}</Text>
                <>
                  <Skeleton isLoaded={!!planData} my={2}>
                    <Text>
                      Included: {planData?.plans.find(plan => plan.plan === 'pro')?.monthly_limit} Task Credits per month.
                    </Text>
                  </Skeleton>
                  <Skeleton isLoaded={!!planData} my={2}>
                    <Text>
                      Remaining: {planData?.plans.find(plan => plan.plan === 'pro')?.monthly_limit + planData?.credits.purchased_remaining - planData?.credits.used} credits.
                    </Text>
                  </Skeleton>
                </>
              </Box>
              <Button mt={4} colorScheme="blue" width="100%" alignSelf="flex-end">
                Upgrade to Pro Plan
              </Button>

              <Center
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="rgba(255, 255, 255, 0.8)"
                backdropFilter="blur(2px)"
                borderRadius="md"
                zIndex="10"
              >
                <Text colorScheme="red" fontWeight="bold" fontSize="lg" color="gray.700" pb="4em">
                  Coming Soon
                </Text>
              </Center>
            </Flex>
          </HStack>
          <Box my={4} color="gray.700">
            <Text fontSize="xs">Payments are securely processed via Stripe. Have questions or need help? <Link fontWeight="semibold">Contact Support</Link></Text>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PlanModal;
