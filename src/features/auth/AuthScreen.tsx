import React, { useState } from 'react';
import { Button, Input, VStack, Text, Divider, Icon, HStack, InputGroup, InputRightElement, IconButton } from '@chakra-ui/react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail, AuthError, AuthErrorCodes, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/config/firebaseConfig';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { GoogleIcon } from '@/components/common';
import validator from 'validator';

const AuthScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = React.useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showResetOption, setShowResetOption] = useState(false);

  const handleAuth = async () => {
    if (!validator.isEmail(email)) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        setAuthError('Verification email sent. Please check your inbox.');
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          setAuthError('Email not verified. Please check your inbox.');
          await auth.signOut();
        }
      }
    } catch (error) {
      const code = (error as AuthError).code;
      switch (code) {
        case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
          setAuthError('Invalid credential. Would you like to reset password?');
          setShowResetOption(true);
          break;
        case AuthErrorCodes.INVALID_PASSWORD:
          setAuthError('Incorrect password. Would you like to reset it?');
          setShowResetOption(true);
          break;
        case AuthErrorCodes.INVALID_EMAIL:
          setAuthError('Invalid credential. Would you like to reset password?');
          break;
        default:
          setAuthError((error as AuthError).message);
          setShowResetOption(false);
          break;
      }
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      setAuthError('Google Sign-In Error: ' + (error as AuthError).message);
      setShowResetOption(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setAuthError('Password reset email sent. Please check your inbox.');
      setShowResetOption(false);
    } catch (error) {
      setAuthError('Error sending password reset email: ' + (error as AuthError).message);
      setShowResetOption(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        setAuthError('Verification email resent. Please check your inbox.');
      }
    } catch (error) {
      setAuthError('Error resending verification email: ' + (error as AuthError).message);
    }
  };

  const handleKeyPress = async (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      await handleAuth();
    }
  };

  return (
    <VStack width={64} spacing={4} align="center" mx="auto" mt="20vh" color="gray.700" gap="4">
      <Text fontSize="2xl" fontWeight="bold">
        {isSignUp ? "Create an account" : "Welcome back"}
      </Text>
      <Input
        placeholder="Email address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        variant="outline"
        size="lg"
        fontSize="md"
      />
      <InputGroup>
        <Input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPwd ? 'text' : 'password'}
          variant="outline"
          size="lg"
          fontSize="md"
          onKeyPress={handleKeyPress}
        />
        <InputRightElement mr={1} height="var(--chakra-sizes-12)">
          <IconButton
            aria-label={showPwd ? 'Hide password' : 'Show password'}
            icon={showPwd ? <HiOutlineEyeOff fontSize="1.4em" /> : <HiOutlineEye fontSize="1.4em" />}
            size='sm'
            onClick={() => setShowPwd(!showPwd)}
            variant="ghost"
            color='gray.500'
            _hover={{ bg: 'unset' }}
          >
            {showPwd ? 'Hide' : 'Show'}
          </IconButton>
        </InputRightElement>
      </InputGroup>
      {authError && (
        <Text mt={1} size="sm" color="red.600">
          {authError}
        </Text>
      )}
      {showResetOption && (
        <Button
          variant="link"
          colorScheme="teal"
          size="sm"
          onClick={handlePasswordReset}
        >
          Reset Password
        </Button>
      )}
      {!isSignUp && authError === 'Email not verified. Please check your inbox.' && (
        <Button
          variant="link"
          colorScheme="teal"
          size="sm"
          onClick={handleResendVerification}
        >
          Resend Verification Email
        </Button>
      )}
      <Button width="100%" colorScheme="teal" size="lg" fontWeight="normal" fontSize="md" onClick={handleAuth}>
        Continue
      </Button>
      <Text fontSize="sm">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
        <Button variant="link" fontWeight="normal" onClick={() => setIsSignUp(!isSignUp)} colorScheme="teal" size="1em">
          {isSignUp ? "Log in" : "Sign up"}
        </Button>
      </Text>
      <HStack width="100%">
        <Divider orientation="horizontal" />
          <Text fontSize="xs">OR</Text>
        <Divider orientation="horizontal" />
      </HStack>
      <Button
        leftIcon={<Icon as={GoogleIcon} color="gray.700" fontSize="1.4em" mr={2}/>}
        onClick={handleGoogleSignIn}
        colorScheme="gray"
        variant="outline"
        width="100%"
        size="lg"
        fontWeight="normal"
        fontSize="md"
        color="gray.700"
      >
        Continue with Google
      </Button>
    </VStack>
  );
};

export default AuthScreen;
