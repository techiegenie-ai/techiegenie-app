// src/components/ChatWindow.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Box, HStack, Textarea, Button, Flex, useToast } from '@chakra-ui/react';
import eventEmitter from '../utils/eventEmitter';
import { sendMessage } from '../utils/websocket';
import { UserMessage, TechieError } from '../utils/protocol';
import { HiOutlinePaperAirplane } from 'react-icons/hi';
import Chat, { ConversationMessage } from './Chat';
import ExampleQueries from './ExampleQueries';
import Terminal from './Terminal';
import SudoPasswordModal from './SudoPasswordModal';
import Toolbar from './Toolbar';
import Environment from '../utils/Environment';
import PlanBanner from './PlanBanner';
import { UserPlanResponse } from './PlanModal';
import { SystemOperator } from '../utils/SystemOperator';

const ChatWindow: React.FC<{ planData: UserPlanResponse | null }> = ({ planData }) => {
  const [message, setMessage] = useState('');
  const [sudoPassword, setSudoPassword] = useState('');
  const [sudoMessage, setSudoMessage] = useState('');
  const [chatEmpty, setChatEmpty] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [systemOperator, setSystemOperator] = useState<SystemOperator | undefined>(undefined);
  const toast = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const setupSystemOperator = async () => {
      try {
        const operator = await SystemOperator.getInstance();
        setSystemOperator(operator);
      } catch (error) {
        console.error('Failed to initialize SystemOperator:', error);
        toast({
          title: 'Initialization Error',
          description: 'Could not initialize system operator. Some features may not work.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    };
    setupSystemOperator();

    const handleSudoRequest = (message: string) => {
      setSudoMessage(message);
    };

    eventEmitter.on('requestSudoPassword', handleSudoRequest);

    return () => {
      eventEmitter.off('requestSudoPassword', handleSudoRequest);
    };
  }, []);

  useEffect(() => {
    const handleSudoResponse = (result: boolean) => {
      if (result) {
        setSudoPassword('');
        setSudoMessage('');
      } else {
        setSudoMessage('Password is incorrect, please try again.');
      }
    };

    eventEmitter.on('sudoPasswordResponse', handleSudoResponse);
    return () => {
      eventEmitter.off('sudoPasswordResponse', handleSudoResponse);
    };
  }, []);

  useEffect(() => {
    const handleNewMessage = () => {
      setChatEmpty(false);
    };

    const handleClearChat = () => {
      setChatEmpty(true);
      eventEmitter.once('newMessage', handleNewMessage);
    };

    eventEmitter.once('newMessage', handleNewMessage);
    eventEmitter.on('clearChat', handleClearChat);
    return () => {
      eventEmitter.off('clearChat', handleClearChat);
    };
  }, []);

  useEffect(() => {
    const handleTechieError = (error: TechieError) => {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        position: 'top-right',
        duration: 9000,
        isClosable: true,
      });
      eventEmitter.emit('cleanTyping');
      setIsSending(false);
    };

    const handleTechieMessage = ({ source }: ConversationMessage) => {
      setIsSending(source !== 'server');
    };

    eventEmitter.on('techieError', handleTechieError);
    eventEmitter.on('newMessage', handleTechieMessage);

    return () => {
      eventEmitter.off('techieError', handleTechieError);
      eventEmitter.off('newMessage', handleTechieMessage);
    };
  }, []);

  const handleMessageSend = async (msg?: string) => {
    const currentMessage = msg ?? message;
    if ((currentMessage ?? '').length === 0) return;
    const env = await Environment.getInstance();
    const conversation_id = env.getConversationId();
    const userMessage: UserMessage = {
      conversation_id, // Use the saved conversationId
      type: 'message',
      message: currentMessage.slice(0, 8 * 1024),
    };
    setIsSending(true);
    eventEmitter.emit('newMessage', { source: 'user', message: userMessage });
    await sendMessage(userMessage);
    setMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'var(--input-height)'; // Reset the height to auto
    }
    textareaRef.current?.focus();
  };

  const handleExampleClick = async (example: string) => {
    setMessage(example);
    await handleMessageSend(example);
  };

  const handleSudoPasswordSubmit = async () => {
    if (!systemOperator) {
      toast({
        title: 'Error',
        description: 'System operator not initialized. Cannot process sudo password.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    try {
      const result = await systemOperator.processSudoPassword(sudoPassword);
      eventEmitter.emit('sudoPasswordResponse', result);
    } catch (error) {
      console.error('Failed to process sudo password:', error);
      eventEmitter.emit('sudoPasswordResponse', false);
      toast({
        title: 'Sudo Error',
        description: 'Failed to process sudo password.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleSudoPasswordCancel = () => {
    setSudoPassword('');
    setSudoMessage('');
    eventEmitter.emit('sudoPasswordResponse', false);
  };

  const handleKeyPress = async (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey && !isSending) {
      event.preventDefault();
      await handleMessageSend();
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'var(--input-height)';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 144)}px`; // Set the height based on the scroll height, max 6 lines
    }
  };

  return (
    <>
      {/* Conditionally show the PlanBanner if the user has insufficient credits */}
      {planData && !planData.has_credits && <PlanBanner />}
      <Toolbar />
      <Flex direction="column" height="calc(100vh - 4.5rem)" p={5} pt={0} gap={2} maxWidth="38em" marginLeft="auto" marginRight="auto" width="100%">
        <Box flex={1} overflowY="auto">
          <Flex flex={1} overflowY="auto" justifyContent="flex-end" height="100%" display={chatEmpty ? 'none' : 'flex'}>
            <Chat />
          </Flex>
          {chatEmpty && <ExampleQueries onExampleClick={handleExampleClick} isDisabled={!(planData?.has_credits)} />}
        </Box>
        <Box height="200px" overflowY="auto" borderRadius="md" display={chatEmpty ? 'none' : 'block'}>
          <Terminal />
        </Box>
        {!sudoMessage && (
          <Box width="100%">
            <HStack spacing={2} alignItems="flex-end">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={handleInput}
                placeholder="Type your message here"
                onKeyPress={handleKeyPress}
                flex={1}
                resize="none"
                minHeight="40px"
                maxHeight="144px"
                overflowY="auto"
                focusBorderColor="inherited"
                _focusVisible={{
                  shadow: 'none',
                }}
                disabled={isSending || !planData?.has_credits}
              />
              <Button
                aria-label="Send"
                leftIcon={<HiOutlinePaperAirplane />}
                onClick={async () => await handleMessageSend()}
                isDisabled={isSending || !planData?.has_credits}
              >
                Send
              </Button>
            </HStack>
          </Box>
        )}
        <SudoPasswordModal
          isOpen={!!sudoMessage}
          sudoMessage={sudoMessage}
          sudoPassword={sudoPassword}
          setSudoPassword={setSudoPassword}
          handleSudoPasswordSubmit={handleSudoPasswordSubmit}
          handleSudoPasswordCancel={handleSudoPasswordCancel}
        />
      </Flex>
    </>
  );
};

export default ChatWindow;
