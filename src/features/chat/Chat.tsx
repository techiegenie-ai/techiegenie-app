import React, { useEffect, useRef, useState } from 'react';
import { Box, Code, Heading, Link, List, ListItem, VStack, Text, Image } from '@chakra-ui/react';
import { UserMessage, TechieMessage, eventEmitter } from '@/utils';
import ReactMarkdown from 'react-markdown';
import { TypingIndicator } from '@/features/chat';

export interface ConversationMessage {
  source: 'user' | 'server' | 'typing';
  message?: UserMessage | TechieMessage;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const typingTimeouts = useRef<NodeJS.Timeout[]>([]);  // Replacing useState with useRef
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update the chat UI when a new message is received
    const handleNewMessage = ({ source, message }: ConversationMessage) => {
      // The typing message can be only one, so remove any existing occurrences in history
      setMessages((prevMessages) => [
        ...prevMessages.filter(m => m.source !== 'typing'), 
        { source, message }
      ]);
    };

    const handleBeginTyping = () => {
      typingTimeouts.current.push(
        setTimeout(() => {
          eventEmitter.emit('newMessage', { source: 'typing' });
        }, 2000)
      );
    };

    const handleEndTyping = () => {
      const timeout = typingTimeouts.current.shift();
      if (timeout) clearTimeout(timeout);
      // Remove any existing occurrences of 'typing' in history
      setMessages((prevMessages) => prevMessages.filter(m => m.source !== 'typing'));
    };

    const handleCleanTyping = () => {
      typingTimeouts.current.forEach(clearTimeout);
      typingTimeouts.current = [];
      // Remove any existing occurrences of 'typing' in history
      setMessages((prevMessages) => prevMessages.filter(m => m.source !== 'typing'));
    };

    const handleClearChat = () => {
      setMessages([]);
    };

    eventEmitter.on('newMessage', handleNewMessage);
    eventEmitter.on('startTyping', handleBeginTyping);
    eventEmitter.on('stopTyping', handleEndTyping);
    eventEmitter.on('cleanTyping', handleCleanTyping);
    eventEmitter.on('clearChat', handleClearChat);

    return () => {
      eventEmitter.off('newMessage', handleNewMessage);
      eventEmitter.off('startTyping', handleBeginTyping);
      eventEmitter.off('stopTyping', handleEndTyping);
      eventEmitter.off('cleanTyping', handleCleanTyping);
      eventEmitter.off('clearChat', handleClearChat);
    };
  }, []);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isUserMessage = (message: ConversationMessage): boolean => {
    return message.source === 'user';
  };

  const isTypingMessage = (message: ConversationMessage): boolean => {
    return message.source === 'typing';
  };

  const chakraMarkdownComponents = {
    h1: (props: any) => <Heading as="h1" size="xl" mb={4} mt={5} {...props} />,
    h2: (props: any) => <Heading as="h2" size="lg" mb={4} mt={5} {...props} />,
    h3: (props: any) => <Heading as="h3" size="md" mb={2} mt={3} {...props} />,
    h4: (props: any) => <Heading as="h4" size="sm" mb={2} mt={3} {...props} />,
    h5: (props: any) => <Heading as="h5" size="xs" mb={1} mt={2} {...props} />,
    h6: (props: any) => <Heading as="h6" size="xs" mb={1} mt={2} {...props} />,
    p: (props: any) => <Text {...props} />,
    a: (props: any) => <Link color="teal.500" {...props} />,
    ul: (props: any) => <List styleType="disc" pl={4} {...props} />,
    ol: (props: any) => <List styleType="decimal" pl={4} {...props} />,
    li: (props: any) => <ListItem {...props} />,
    code: (props: any) => <Code {...props} />,
    img: (props: any) => <Image {...props} />,
  };

  return (
    <VStack spacing={3} width="100%" marginTop="auto">
      {messages.map((msg, index) => (
        <Box
          key={index}
          bg={isUserMessage(msg) ? "blue.100" : "transparent"}
          p={3}
          borderRadius="md"
          maxWidth={isUserMessage(msg) ? "60%" : "100%"}
          alignSelf={isUserMessage(msg) ? "flex-end" : "flex-start"}
          width="auto"
          color="gray.700"
        >
          {isTypingMessage(msg) ? (
            <TypingIndicator />
          ) : (
            <ReactMarkdown components={chakraMarkdownComponents} children={msg.message?.message ?? ''} />
          )}
        </Box>
      ))}
      <div ref={messagesEndRef} />
    </VStack>
  );
};

export default Chat;
