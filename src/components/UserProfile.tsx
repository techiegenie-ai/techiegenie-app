import React, { Suspense } from 'react';
import {
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  MenuDivider,
  useDisclosure,
} from '@chakra-ui/react';
import { HiLogout, HiOutlineBadgeCheck, HiOutlineCog, HiOutlineUser } from 'react-icons/hi';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

// Lazy load the PlanModal component
const PlanModal = React.lazy(() => import('./PlanModal'));
const SettingsModal = React.lazy(() => import('./SettingsModal'));
const TopUpModal = React.lazy(() => import('./TopUpModal'));

const UserProfile: React.FC = () => {
  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose,
  } = useDisclosure();
  const {
    isOpen: isPlanOpen,
    onOpen: onPlanOpen,
    onClose: onPlanClose,
  } = useDisclosure();
  const {
    isOpen: isTopUpOpen,
    onOpen: onTopUpOpen,
    onClose: onTopUpClose,
  } = useDisclosure();

  const openTopUpAndClosePlan = () => {
    onTopUpOpen();
    onPlanClose();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <Menu isLazy>
        <MenuButton
          as={IconButton}
          aria-label="User Menu"
          icon={<Avatar size="sm" icon={<HiOutlineUser fontSize="1.5rem" />} bg="var(--chakra-colors-teal-600)" />}
          variant="ghost"
          color="var(--chakra-colors-teal-600)"
          _hover={{ bg: 'unset' }}
        />
        <MenuList color="gray.700">
          <MenuItem p={3} px={5} icon={<HiOutlineBadgeCheck fontSize="1.5rem" />} onClick={onPlanOpen}>
            My plan
          </MenuItem>
          <MenuItem p={3} px={5} icon={<HiOutlineCog fontSize="1.5rem" />} onClick={onSettingsOpen}>
            Settings
          </MenuItem>
          <MenuDivider m={0} />
          <MenuItem p={3} px={5} icon={<HiLogout fontSize="1.5rem" />} onClick={handleLogout}>
            Log out
          </MenuItem>
        </MenuList>
      </Menu>

      <Suspense fallback={<div>Loading...</div>}>
        {isSettingsOpen && <SettingsModal isOpen={isSettingsOpen} onClose={onSettingsClose} />}
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        {isPlanOpen && <PlanModal isOpen={isPlanOpen} onClose={onPlanClose} onTopUpOpen={openTopUpAndClosePlan} />}
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        {isTopUpOpen && <TopUpModal isOpen={isTopUpOpen} onClose={onTopUpClose} />}
      </Suspense>
    </>
  );
};

export default UserProfile;
