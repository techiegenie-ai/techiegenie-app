// src/utils/wsHandlers.ts

import { TechieError, TechieMessage, TechieTerminal, TechieTools, UserSudo, UserTerminal, UserTools, UserToolsInner } from './protocol';
import eventEmitter from './eventEmitter';
import { sendMessage } from './websocket';
import { isApprovalRequired } from './isApprovalRequired';
import Environment from './Environment';
import { processCommandOutput } from './processCommandOutput';
import { clearChat } from './utils';
import { SystemOperator } from './SystemOperator';

/**
 * Handles a Techie message by emitting it to the chat UI and updating consumption data.
 */
export async function handleTechieMessage(message: TechieMessage) {
  eventEmitter.emit('newMessage', { source: 'server', message });
  await fetchAndStoreConsumptionData();
}

/**
 * Handles tool calls from Techie, executing commands or requesting sudo as needed.
 */
export async function handleTechieTools(toolCalls: TechieTools) {
  const toolResults: UserToolsInner = [];
  const systemOperator = await SystemOperator.getInstance();

  for (const tool of toolCalls.tools) {
    if (tool.type === 'cmd') {
      eventEmitter.emit('terminalCommand', tool.id, tool.cmd, tool.desc, '', '', undefined, tool.report);

      if (isApprovalRequired(tool.report)) {
        // Wait for user approval or decline
        await new Promise<void>((resolve) => {
          const approveListener = async () => {
            await executeCommand(tool, systemOperator);
            resolve();
            eventEmitter.off(`decline-${tool.id}`, declineListener);
          };

          const declineListener = () => {
            toolResults.push(createDeclinedResult(tool.id));
            eventEmitter.emit('terminalCommand', tool.id, tool.cmd, tool.desc, '', 'Command execution was declined.', undefined, tool.report);
            resolve();
            eventEmitter.off(`approve-${tool.id}`, approveListener);
          };

          eventEmitter.once(`approve-${tool.id}`, approveListener);
          eventEmitter.once(`decline-${tool.id}`, declineListener);
        });
      } else {
        // Execute the command directly if no approval is required
        await executeCommand(tool, systemOperator);
      }
    } else if (tool.type === 'sudo') {
      // Emit an event to request sudo password from the UI
      eventEmitter.emit('requestSudoPassword', tool.message);
      const sudo = await new Promise<boolean>((resolve) => {
        eventEmitter.once('sudoPasswordResponse', (result: boolean) => {
          console.log('sudoPasswordResponse:', result);
          resolve(result);
        });
      });
      const toolResult: UserSudo = {
        sudo,
        id: tool.id,
        type: 'sudo',
      };
      toolResults.push(toolResult);
    }
  }

  const response: UserTools = {
    conversation_id: toolCalls.conversation_id,
    tools: toolResults,
    type: 'tool',
  };

  await sendMessage(response);
  await fetchAndStoreConsumptionData();

  /**
   * Executes a command using SystemOperator and processes the result.
   */
  async function executeCommand(tool: TechieTerminal, sysOp: SystemOperator) {
    const result = await sysOp.executeCommand(tool.cmd, tool.desc, tool.id);

    const toolResult: UserTerminal = {
      out: processCommandOutput(result.stdout).slice(0, 4 * 1024), // Limit to 4KB
      err: processCommandOutput(result.stderr).slice(0, 4 * 1024), // Limit to 4KB
      exit_code: result.code,
      result: result.result ?? true,
      id: tool.id,
      type: 'cmd',
    };
    toolResults.push(toolResult);
  }

  /**
   * Creates a result object for a declined command.
   */
  function createDeclinedResult(id: string): UserTerminal {
    return {
      out: '',
      err: 'Command execution was declined by the user.',
      exit_code: 1,
      result: false,
      id,
      type: 'cmd',
    };
  }
}

/**
 * Handles the 'done' message from Techie.
 */
export async function handleTechieDone() {
  console.log('done');
}

/**
 * Handles error messages from Techie, updating the environment or UI as needed.
 */
export async function handleTechieError(message: TechieError) {
  switch (message.code) {
    case 'ConversationNotFound': {
      const env = await Environment.getInstance();
      env.setConversationId('');
      break;
    }
    case 'NotEnoughCredits': {
      eventEmitter.emit('checkCredits');
      break;
    }
    case 'InternalServerError': {
      message.message = 'Internal Server Error';
      break;
    }
    case 'InvalidRequestError': {
      message.message = 'Invalid request error. Please repeat the message.';
      await clearChat();
      break;
    }
    default:
      console.error(message);
      break;
  }
  eventEmitter.emit('techieError', message);
}

/**
 * Fetches and stores consumption data for the current conversation.
 */
export async function fetchAndStoreConsumptionData() {
  const env = await Environment.getInstance();
  const conversationId = env.getConversationId();
  if (conversationId) {
    try {
      const consumptionData = await env.fetchConsumption(conversationId);
      eventEmitter.emit('updateConsumption', consumptionData);
    } catch (error) {
      console.error('Failed to fetch consumption data:', error);
    }
  }
}
