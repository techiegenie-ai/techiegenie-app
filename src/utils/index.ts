export { default as Environment } from './Environment';
export { default as eventEmitter } from './eventEmitter';
export { processCommandOutput } from './processCommandOutput';
export { clearChat } from './utils';
export { sendMessage, closeWebSocket } from './websocket';
export { handleTechieMessage, handleTechieTools, handleTechieDone, handleTechieError, fetchAndStoreConsumptionData } from './wsHandlers';
export type { ProfileData, ConsumptionData } from './Environment';
export type { 
  TechieBase,
  UserBase,
  ToolBase,
  UserMessage,
  UserHandshake,
  TechieHandshake,
  TechieMessage,
  TechieDone,
  TechieSudo,
  UserSudo,
  TechieTerminal,
  UserTerminal,
  TechieToolsInner,
  TechieTools,
  UserToolsInner,
  UserTools,
  UserMessages,
  TechieMessages,
  TechieError,
  AuditReport
} from './protocol';
