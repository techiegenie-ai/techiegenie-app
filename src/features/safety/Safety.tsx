import React, { useState, useEffect } from 'react';
import {
  Box,
  Icon,
  Tooltip,
  Popover,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  Button,
  Text,
  PopoverFooter,
  Portal,
  ButtonGroup,
  IconProps,
  Code,
  PopoverTrigger,
  Fade,
} from '@chakra-ui/react';
import { HiShieldCheck, HiShieldExclamation } from 'react-icons/hi';
import { AuditReport } from '@/utils';
import { HiShieldMinus, HiShieldX } from '@/components/common';

interface SafetyIconProps extends IconProps {
  category?: AuditReport['category'];
}

interface SafetyProps {
  requiresApproval: boolean;
  command: string;
  description: string;
  report?: AuditReport;
  onApprove?: () => void;
  onDecline?: () => void;
}

const Safety: React.FC<SafetyProps> = ({
  requiresApproval,
  command,
  description,
  report,
  onApprove,
  onDecline,
}) => {
  const initRef = React.useRef<HTMLButtonElement>(null);

  // Add state to manage the visibility of the popover with delay
  const [showPopover, setShowPopover] = useState(false);

  const styles = {
    '@keyframes pulse': {
      '0%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.4)' },
      '100%': { transform: 'scale(1)' },
    },
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // Set a delay of 500ms before showing the popover
    if (requiresApproval) {
      timer = setTimeout(() => {
        setShowPopover(true);
      }, 500);
    } else {
      setShowPopover(false); // Hide immediately if not required
    }

    // Clear the timer if the component unmounts or requiresApproval changes
    return () => {
      clearTimeout(timer);
    };
  }, [requiresApproval]);

  return (
    <Box as="span" display="inline-flex" alignItems="center" mr={1} ml={1}>
      {showPopover && (
      <Fade in={showPopover && requiresApproval}>
          <Popover
            isLazy
            initialFocusRef={initRef}
            placement="top-start"
            closeOnBlur={false}
            closeOnEsc={false}
            isOpen={showPopover}
          >
            <PopoverTrigger>
              <Box cursor="pointer" display="flex" alignItems="center" css={styles}>
                <SafetyIcon category={report?.category} style={{animation: 'pulse 1.5s infinite'}} />
              </Box>
            </PopoverTrigger>
            <Portal>
              <PopoverContent
                color="var(--chakra-colors-gray-700)"
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif"
                whiteSpace="normal"
                p={0}
                width="26em"
              >
                <PopoverArrow />
                <PopoverHeader
                  border={0}
                  p={3}
                  fontWeight="bold"
                  display="flex"
                  alignItems="center"
                >
                  <SafetyIcon category={report?.category} boxSize="1.2em" mr={1} />
                  Approval Required
                </PopoverHeader>
                <PopoverBody border={0} p={3}>
                  <Text fontWeight="semibold">What's Happening:</Text>
                  <Text mb={2}>{description}</Text>
                  <Text fontWeight="semibold">Command:</Text>
                  <Code mb={2}>{command}</Code>
                  <Text fontWeight="semibold">Safety Check:</Text>
                  <Box as="ul" mb={2} paddingInlineStart="1em">
                    <Box as="li">
                      <Text display="inline" fontWeight="medium" pr={1}>
                        Rating:
                      </Text>
                      <Text display="inline">{report?.category}</Text>
                    </Box>
                    <Box as="li">
                      <Text display="inline" fontWeight="medium" pr={1}>
                        Why:
                      </Text>
                      <Text display="inline">{report?.reason}</Text>
                    </Box>
                  </Box>
                </PopoverBody>
                <PopoverFooter p={3} pb={2}>
                  <Text mb={3}>
                    Do you approve the execution of this command?
                  </Text>
                  <Box display="flex" justifyContent="flex-end">
                    <ButtonGroup size="sm">
                      <Button
                        colorScheme="red"
                        onClick={() => onApprove && onApprove()} // Ensure onApprove is defined before calling
                        mr={2}
                        ref={initRef}
                      >
                        Approve
                      </Button>
                      <Button onClick={() => onDecline && onDecline()} variant="ghost">
                        Decline
                      </Button>
                    </ButtonGroup>
                  </Box>
                </PopoverFooter>
              </PopoverContent>
            </Portal>
          </Popover>
      </Fade>
      )}
      {!showPopover && (
        <Tooltip
          label={report?.reason}
          aria-label="Safety Audit"
          isDisabled={!report}
        >
          <Box as='span' display='flex'>
            <SafetyIcon category={report?.category} />
          </Box>
        </Tooltip>
      )}
    </Box>
  );
};

const SafetyIcon: React.FC<SafetyIconProps> = ({ category, ...props }) => {
  switch (category) {
    case 'Safe':
      return <Icon as={HiShieldCheck} color="green.600" {...props} />;
    case 'Warning':
      return <Icon as={HiShieldExclamation} color="yellow.600" {...props} />;
    case 'Danger':
      return <Icon as={HiShieldX} color="red.600" {...props} />;
    default:
      return <Icon as={HiShieldMinus} color="gray.600" {...props} />;
  }
};
SafetyIcon.displayName = 'SafetyIcon';

export default Safety;
