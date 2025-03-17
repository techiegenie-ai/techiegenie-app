import { Command, Child } from '@tauri-apps/plugin-shell';
import { platform } from '@tauri-apps/plugin-os';
import eventEmitter from './eventEmitter';

class TerminalManager {
  private password: string | null = null;
  private processes: Map<string, Child> = new Map();
  private shell: string = 'execute-sh';
  private isWindows: boolean = false;

  constructor() {
    this._initShell();
  }

  private async _initShell() {
    const osPlatform = platform();
    this.isWindows = osPlatform === 'windows';
    this.shell = this.isWindows ? 'execute-cmd' : 'execute-sh';
  }

  public async setPassword(pwd: string): Promise<boolean> {
    if (this.isWindows) throw new Error('Not implemented for Windows');
    if (!pwd) throw new Error('Password cannot be blank');
    const fullCommand = 'sudo -S -v';
    const cmd = Command.create(this.shell, [fullCommand]);
    const child = await cmd.spawn();
    await child.write(pwd + '\n');
    return new Promise((resolve) => {
      cmd.on('close', (data) => resolve(data.code === 0 ? (this.password = pwd, true) : (this.password = null, false)));
      cmd.on('error', () => resolve(false));
    });
  }

  public async executeCommand(
    command: string,
    id: string
  ): Promise<{ stdout: string; stderr: string; code: number; result: boolean }> {
    if (this.isWindows) throw new Error('Not implemented for Windows');
    command = command.trim();
    let fullCommand = command;
    if (command.startsWith('sudo')) {
      if (!this.password) return { stdout: '', stderr: 'sudo: no password provided', code: 1, result: false };
      fullCommand = `sudo -S ${command.slice(5)}`;
    }
    const cmd = Command.create(this.shell, [fullCommand]);
    const child = await cmd.spawn();
    this.processes.set(id, child);
    if (command.startsWith('sudo')) await child.write(this.password + '\n');

    let stdout = '';
    let stderr = '';
    cmd.stdout.on('data', (data) => {
      stdout += data;
      eventEmitter.emit('terminalOutput', { id, stdout: data });
    });
    cmd.stderr.on('data', (data) => {
      stderr += data;
      eventEmitter.emit('terminalOutput', { id, stderr: data });
    });

    return new Promise((resolve) => {
      cmd.on('close', (data) => {
        this.processes.delete(id);
        const result = data.signal === null;
        if (!result) stderr += '\n^C';
        resolve({ stdout, stderr, code: data.code ?? 0, result });
      });
      cmd.on('error', (error) => resolve({ stdout, stderr: error, code: 1, result: false }));
    });
  }

  public async killProcess(id: string): Promise<void> {
    const child = this.processes.get(id);
    if (child) {
      await child.kill();
      this.processes.delete(id);
    }
  }

  public async killAllProcesses(): Promise<void> {
    for (const child of this.processes.values()) await child.kill();
    this.processes.clear();
  }

  public hasRunningProcesses(): boolean {
    return this.processes.size > 0;
  }

  public isPasswordProvided(): boolean {
    return this.password !== null;
  }
}

export { TerminalManager };
