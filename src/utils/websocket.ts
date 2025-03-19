// src/utils/websocket.ts

import { parseTechieMessage, UserMessages, TechieMessages, TechieError } from './protocol';
import eventEmitter from './eventEmitter';
import { handleTechieDone, handleTechieError, handleTechieMessage, handleTechieTools } from './wsHandlers';
import Environment from './Environment';
import { auth } from '../config/firebaseConfig';
import { SystemOperator } from '../features/terminal/SystemOperator';

export let socket: WebSocket | null = null;
let pendingMessage: UserMessages | null = null;

/**
 * Creates a WebSocket connection to the server using Firebase authentication.
 * Sets up event listeners for connection lifecycle and message handling.
 */
const createWebSocket = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.error("User is not authenticated.");
    return;
  }
  const env = await Environment.getInstance();
  const token = await user.getIdToken();
  const wsUrl = env.getWebSocketEndpoint();
  socket = new WebSocket(`${wsUrl}?token=${token}`);

  socket.onopen = () => {
    console.log('WebSocket is connected.');
    sendHandshake();
  };

  socket.onmessage = async (event) => {
    const data = JSON.parse(event.data);
    try {
      const message: TechieMessages | TechieError = parseTechieMessage(data);
      console.log('Message from Techie:', message);
      const env = await Environment.getInstance();

      switch (message.type) {
        case 'handshake':
          eventEmitter.emit('stopTyping');
          env.setConversationId(message.conversation_id);
          console.log(`Conversation ID received: ${message.conversation_id}`);
          if (pendingMessage) {
            pendingMessage.conversation_id = message.conversation_id;
            await sendMessage(pendingMessage);
            pendingMessage = null;
          }
          break;
        case 'tool':
          eventEmitter.emit('stopTyping');
          await handleTechieTools(message);
          break;
        case 'message':
          eventEmitter.emit('stopTyping');
          handleTechieMessage(message);
          break;
        case 'done':
          await handleTechieDone();
          break;
        case 'error':
          eventEmitter.emit('stopTyping');
          await handleTechieError(message);
          break;
        default:
          console.warn(`Unhandled message type: ${(message as TechieMessages).type}`);
          break;
      }
    } catch (error) {
      console.error('Failed to parse Techie message:', error);
    }
  };

  socket.onclose = () => {
    console.log('WebSocket is closed now.');
  };

  socket.onerror = (error) => {
    console.log('WebSocket error: ', error);
  };
};

/**
 * Sends a handshake message to the server using SystemOperator.
 */
const sendHandshake = async () => {
  try {
    const env = await Environment.getInstance();
    const conversationId = env.getConversationId();
    const systemOperator = await SystemOperator.getInstance();
    const handshake = await systemOperator.getHandshake(conversationId);
    await sendMessage(handshake);
  } catch (error) {
    console.error('Failed to send handshake:', error);
  }
};

/**
 * Sends a message to the server over the WebSocket.
 * If the socket is not open, queues the message and initiates a new connection.
 * @param message The message to send.
 */
export const sendMessage = async (message: UserMessages) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log('Message to Techie:', message);
    const token = await auth.currentUser?.getIdToken();
    if (!token) {
      console.error('No token available for sending message.');
      return;
    }
    const action = 'sendmessage';
    eventEmitter.emit('startTyping');
    socket.send(JSON.stringify({ ...message, token, action }));
  } else {
    pendingMessage = message;
    await createWebSocket();
  }
};

/**
 * Closes the WebSocket connection if it exists.
 */
export const closeWebSocket = async () => {
  if (socket != null) {
    socket.close();
  }
};
