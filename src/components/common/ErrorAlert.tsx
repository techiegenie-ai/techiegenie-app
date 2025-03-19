import React, { useEffect, useState } from 'react';
import { Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton, Box, ScaleFade } from '@chakra-ui/react';
import { TechieError } from '@/utils';

interface ErrorAlertProps {
  error: TechieError;
  onClose: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 9000);
    const closeTimer = setTimeout(onClose, 10000);
    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  return (
    <Box position="fixed" top="1em" right="1em" borderRadius="md" zIndex="9999" maxWidth="60%">
      <ScaleFade initialScale={0.9} in={show} unmountOnExit>
        <Alert status="error" variant="solid" borderRadius="md">
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>Error:</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Box>
          <CloseButton onClick={() => setShow(false)} position="absolute" right="0.5em" top="0.5em" />
        </Alert>
      </ScaleFade>
    </Box>
  );
};

export default ErrorAlert;
