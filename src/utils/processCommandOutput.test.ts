// src/utils/processCommandOutput.test.ts
import { processCommandOutput } from './processCommandOutput';

describe('processCommandOutput', () => {
  it('should handle simple string without newline or carriage return', () => {
    const input = 'Hello, World!';
    const expectedOutput = 'Hello, World!';
    expect(processCommandOutput(input)).toBe(expectedOutput);
  });

  it('should handle input with a newline character', () => {
    const input = 'Hello,\nWorld!\n\n';
    const expectedOutput = 'Hello,\nWorld!\n\n';
    expect(processCommandOutput(input)).toBe(expectedOutput);
  });

  it('should handle input with a carriage return character', () => {
    const input = 'Hello,\rWorld!';
    const expectedOutput = 'World!';
    expect(processCommandOutput(input)).toBe(expectedOutput);
  });

  it('should handle input with both newline and carriage return characters', () => {
    const input = 'Hello,\rWorld!\nWelcome!';
    const expectedOutput = 'World!\nWelcome!';
    expect(processCommandOutput(input)).toBe(expectedOutput);
  });

  it('should handle input with multiple carriage returns', () => {
    const input = 'Line 1\rLine 2\rFinal Line\n';
    const expectedOutput = 'Final Line\n';
    expect(processCommandOutput(input)).toBe(expectedOutput);
  });

  it('should handle input with a mix of carriage returns and newlines', () => {
    const input = 'Downloading... 0%\rDownloading... 50%\rDownloading... 100%\nDone!';
    const expectedOutput = 'Downloading... 100%\nDone!';
    expect(processCommandOutput(input)).toBe(expectedOutput);
  });

  it('should return an empty string for empty input', () => {
    const input = '';
    const expectedOutput = '';
    expect(processCommandOutput(input)).toBe(expectedOutput);
  });

  it('should handle input with only carriage returns and no newlines', () => {
    const input = 'Reset 1\rReset 2\rReset 3\r';
    const expectedOutput = 'Reset 3';
    expect(processCommandOutput(input)).toBe(expectedOutput);
  });

  it('should handle very long input strings', () => {
    const input = 'Start\rProgress\rEnd\n'.repeat(1000);
    const expectedOutput = 'End\n'.repeat(1000);
    expect(processCommandOutput(input)).toBe(expectedOutput);
  });
});
