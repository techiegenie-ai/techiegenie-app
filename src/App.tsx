import React, { useEffect, useState } from 'react';
import { ChakraProvider, Flex } from '@chakra-ui/react';
import ChatWindow from './components/ChatWindow';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebaseConfig';
import AuthScreen from './components/AuthScreen';
import { UserPlanResponse } from './components/PlanModal';
import Environment from './utils/Environment';
import eventEmitter from './utils/eventEmitter';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [planData, setPlanData] = useState<UserPlanResponse | null>(null); // State for storing plan data

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await currentUser.reload(); // Refresh the user's data
        if (currentUser.emailVerified) {
          setUser(currentUser);
          setLoading(false);
          eventEmitter.emit('checkCredits'); // Fetch user's plan and credits
        } else {
          setUser(null);
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Polling for email verification status every 5 seconds
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (!user) {
      interval = setInterval(async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
          await currentUser.reload();
          if (currentUser.emailVerified) {
            setUser(currentUser);
            if (interval) {
              clearInterval(interval);
            }
          }
        }
      }, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [user]);

  useEffect(() => {
    const handleCheckCredits = () => {
      fetchUserPlanData();
    };
    eventEmitter.on('checkCredits', handleCheckCredits);
    return () => {
      eventEmitter.off('checkCredits', handleCheckCredits);
    };
  }, [])

  const fetchUserPlanData = async () => {
    try {
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

      if (response.ok) {
        const data: UserPlanResponse = await response.json();
        setPlanData(data);
      } else {
        console.error('Failed to fetch plan data');
      }
    } catch (error) {
      console.error('Error fetching plan data:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ChakraProvider>
      <Flex direction="column" height="100vh">
        {user ? <ChatWindow planData={planData} /> : <AuthScreen />}
      </Flex>
    </ChakraProvider>
  );
};

export default App;
