// src/utils/protocol.ts

interface TechieBase {
  conversation_id: string;
}

interface UserBase {
  conversation_id: string;
  // token: string; // add token only before sending
}

interface ToolBase {
  id: string;
}

interface UserMessage extends UserBase {
  type: 'message';
  message: string;
}

interface UserHandshake extends UserBase {
  type: 'handshake';
  system_info: string;
  shell_info: string;
  username: string;
  home: string;
  os: string;
}

interface TechieHandshake extends TechieBase {
  type: 'handshake';
}

interface TechieMessage extends TechieBase {
  type: 'message';
  message: string;
}

interface TechieDone extends TechieBase {
  type: 'done';
}

interface TechieSudo extends ToolBase {
  type: 'sudo';
  message: string;
}

interface UserSudo extends ToolBase {
  type: 'sudo';
  sudo: boolean;
}

interface TechieTerminal extends ToolBase {
  type: 'cmd';
  cmd: string;
  desc: string;
  report?: AuditReport;
}

export type AuditReport = {
  category: 'Safe' | 'Warning' | 'Danger'
  reason: string
}

interface UserTerminal extends ToolBase {
  type: 'cmd';
  result: boolean;
  out: string;
  err: string;
  exit_code: number;
}

type TechieToolsInner = (TechieSudo | TechieTerminal)[];

interface TechieTools extends TechieBase {
  type: 'tool';
  tools: TechieToolsInner;
}

type UserToolsInner = (UserSudo | UserTerminal)[];

interface UserTools extends UserBase {
  type: 'tool';
  tools: UserToolsInner;
}

type UserMessages = UserMessage | UserHandshake | UserTools;
type TechieMessages = TechieMessage | TechieHandshake | TechieTools | TechieDone;

interface TechieError {
  type: 'error';
  code: string;
  message: string;
}

const parseUserMessage = (data: UserMessages): UserMessages => {
  switch (data.type) {
    case 'message':
      return data as UserMessage;
    case 'handshake':
      return data as UserHandshake;
    case 'tool':
      return data as UserTools;
    default:
      throw new Error(`Unknown type: ${data['type']}`);
  }
};

const parseTechieMessage = (data: TechieMessages | TechieError): TechieMessages | TechieError => {
  switch (data.type) {
    case 'message':
      return data as TechieMessage;
    case 'handshake':
      return data as TechieHandshake;
    case 'tool':
      return data as TechieTools;
    case 'done':
      return data as TechieDone;
    case 'error':
      return data as TechieError;
    default:
      throw new Error(`Unknown type: ${data['type']}`);
  }
};

const isError = (data: TechieError): boolean => {
  return data.type === 'error';
};

export {
  parseUserMessage,
  parseTechieMessage,
  isError
};

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
  TechieError
};

