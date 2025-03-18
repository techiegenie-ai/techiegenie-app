// src/utils/SystemOperator.ts
import { invoke } from '@tauri-apps/api/core';
import { homeDir } from '@tauri-apps/api/path';
import { TerminalManager } from './TerminalManager';
import { UserHandshake } from './protocol';

class SystemOperator {
  public terminal: TerminalManager;
  public system_info: string;
  public shell_info: Promise<string>;
  public username: Promise<string>;
  public home: Promise<string>;
  public osName: Promise<string>;
  public conversation_id?: string;

  constructor(terminal: TerminalManager, system_info: string) {
    this.terminal = terminal;
    this.system_info = system_info;
    this.shell_info = this._getShellInfo();
    this.username = this._getUsername();
    this.home = this._getUserHome();
    this.osName = this._getOsName();
  }

  /** Creates an instance of SystemOperator with initialized system info */
  static async getInstance(): Promise<SystemOperator> {
    const terminal = await TerminalManager.getInstance();
    const system_info = await SystemOperator._getSystemInfo(terminal);
    return new SystemOperator(terminal, system_info);
  }

  /** Retrieves system information using a platform-specific command */
  static async _getSystemInfo(terminal: TerminalManager): Promise<string> {
    const currentPlatform = await invoke<string>('get_platform');
    const command = currentPlatform === 'windows' ? 'systeminfo' : 'uname -a';
    const res = await terminal.executeCommand(command, 'system-info');
    return res.stdout ? res.stdout.trim() : res.stderr.trim() || '';
  }

  /** Gets the default shell path, optionally returning only the name */
  private async _getShellInfo(onlyName = false): Promise<string> {
    const shellPath = await invoke<string>('get_shell');
    if (onlyName) {
      const parts = shellPath.split(/[\\/]/);
      const fileName = parts[parts.length - 1];
      return fileName.split('.')[0];
    }
    return shellPath;
  }

  /** Gets the current user's username */
  private async _getUsername(): Promise<string> {
    return await invoke<string>('get_username');
  }

  /** Gets the user's home directory */
  private async _getUserHome(): Promise<string> {
    return await homeDir();
  }

  /** Gets a formatted OS name */
  private async _getOsName(): Promise<string> {
    const plat = await invoke<string>('get_platform');
    const osType = await invoke<string>('get_os_type');
    const osArch = await invoke<string>('get_arch');
    return `${plat} ${osType} (${osArch})`;
  }

  /** Returns a handshake object with system details */
  public async getHandshake(conversation_id = ''): Promise<UserHandshake> {
    return {
      conversation_id,
      system_info: this.system_info,
      shell_info: await this.shell_info,
      username: await this.username,
      os: await this.osName,
      home: await this.home,
      type: 'handshake',
    };
  }

  /** Executes a command via the terminal manager */
  public async executeCommand(
    cmd: string,
    _desc: string,
    id: string
  ): Promise<{ stdout: string; stderr: string; result?: boolean }> {
    const result = await this.terminal.executeCommand(cmd, id);
    return {
      stdout: result.stdout,
      stderr: result.stderr,
      result: result.result,
    };
  }

  /** Processes a sudo password for terminal operations */
  public async processSudoPassword(pwd: string): Promise<boolean> {
    return await this.terminal.setPassword(pwd);
  }
}

export { SystemOperator };
