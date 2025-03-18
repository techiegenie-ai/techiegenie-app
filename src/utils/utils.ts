import Environment from './Environment';
import eventEmitter from './eventEmitter';
import { closeWebSocket } from './websocket';

export async function clearChat() {
  // Emit event to clear chat messages
  eventEmitter.emit('clearChat');
  // Emit event to clear the terminal
  eventEmitter.emit('clearTerminal');
  // Reset the conversation ID
  const env = await Environment.getInstance();
  env.setConversationId('');
  await closeWebSocket();
  eventEmitter.emit('updateConsumption');
}
