import { Command, Child } from '@tauri-apps/plugin-shell';
import eventEmitter from './eventEmitter';
import { invoke } from '@tauri-apps/api/core';

class TerminalManager {
  private password: string | null = null;
  private processes: Map<string, Child> = new Map();
  private shell: string = 'execute-sh';
  private isWindows: boolean = false;

  constructor(isWindows: boolean, shell: string) {
    this.isWindows = isWindows;
    this.shell = shell;
  }

  static async getInstance(): Promise<TerminalManager> {
    const osPlatform = await invoke<string>('get_platform');
    const isWindows = osPlatform === 'windows';
    let shell: string;
    switch (osPlatform) {
      case 'macos':
        shell = 'execute-zsh'
        break;
        case 'linux':
        shell = 'execute-sh'
        break;
      case 'windows':
        shell = 'execute-cmd'
        break;
      default:
        console.warn('Unsupported platform');
        shell = 'execute-sh'
        break;
    }
    return new TerminalManager(isWindows, shell);
  }

  public async setPassword(pwd: string): Promise<boolean> {
    if (this.isWindows) throw new Error('Not implemented for Windows');
    if (!pwd) throw new Error('Password cannot be blank');
    const fullCommand = 'sudo -S -v';
    const args = [this.isWindows ? '/c' : '-c', fullCommand]
    console.log('Executing command:', { shell: this.shell, args: args });
    const cmd = Command.create(this.shell, args);
    const child = await cmd.spawn();
    await child.write(pwd + '\n');
    return new Promise((resolve) => {

      cmd.on('close', (data) => {
        resolve(data.code === 0 ? (this.password = pwd, true) : (this.password = null, false));
      });
      cmd.on('error', () => {
        resolve(false);
      });
    });
  }

  public async executeCommand(
    command: string,
    id: string,
    silent = false,
  ): Promise<{ stdout: string; stderr: string; code: number; result: boolean }> {
    command = command.trim();
    let fullCommand = command;
    if (command.startsWith('sudo')) {
      if (!this.password) return { stdout: '', stderr: 'sudo: no password provided', code: 1, result: false };
      fullCommand = `sudo -S ${command.slice(5)}`;
    }
    const args = [this.isWindows ? '/c' : '-c', fullCommand]
    console.log('Executing command:', { shell: this.shell, args: args });
    const cmd = Command.create(this.shell, args);
    const child = await cmd.spawn();
    this.processes.set(id, child);
    if (command.startsWith('sudo')) await child.write(this.password + '\n');

    let stdout = '';
    let stderr = '';
    cmd.stdout.on('data', (data) => {
      stdout += data;
      if (!silent) eventEmitter.emit('terminalCommand', id, undefined, undefined, data, undefined, undefined, undefined);
    });
    cmd.stderr.on('data', (data) => {
      stderr += data;
      if (!silent) eventEmitter.emit('terminalCommand', id, undefined, undefined, undefined, data, undefined, undefined);
    });

    return new Promise((resolve, reject) => {
      cmd.on('close', (data) => {
        if (!silent) eventEmitter.emit('terminalCommand', id, undefined, undefined, undefined, undefined, true, undefined);
        this.processes.delete(id);
        const result = data.signal === null;
        if (!result) stderr += '\n^C';
        resolve({ stdout, stderr, code: data.code ?? 0, result });
      });
      cmd.on('error', (error) => {
        this.processes.delete(id);
        if (!silent) eventEmitter.emit('terminalCommand', id, undefined, undefined, undefined, undefined, false, undefined);
        console.log('Error:', error)
        reject(error);
      });
    });
  }

  public async killProcess(id: string): Promise<void> {
    const child = this.processes.get(id);
    if (!child || !child.pid) {
      console.log(`No process found with ID: ${id}`);
      this.processes.delete(id);
      return;
    }

    const pid = child.pid;

    try {
      let args: string[];
      if (this.isWindows) {
        // Forcefully terminate the process and its subtree on Windows
        args = ['/c', 'taskkill /PID ' + pid.toString() + ' /F /T']
      } else {
        // Use SIGKILL on Unix-like systems
        args = ['-c', 'kill -9 ' + pid.toString()]
      }
      const killCommand = Command.create(this.shell, args);

      const killResult = await killCommand.execute();
      if (killResult.code === 0) {
        console.log(`Process ${pid} terminated successfully`);
      } else {
        console.error(`Failed to terminate process ${pid}: ${killResult.stderr}`);
      }

      // Clean up regardless of kill success to avoid stale entries
      this.processes.delete(id);

      // Attempt the original kill as a fallback
      await child.kill().catch((e) => console.log(`Fallback kill failed: ${e.message}`));
    } catch (error) {
      console.error(`Error terminating process ${pid}:`, error);
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
