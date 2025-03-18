export function processCommandOutput(rawOutput: string): string {
  if (rawOutput == null) return ''
  let finalOutput = '';  // To store the final output
  let currentLine = '';  // To store the current line being processed

  let i = 0;
  const length = rawOutput.length;

  while (i < length) {
    const char = rawOutput[i];

    if (char === '\r') {
      // Carriage return detected: Reset the current line only if it's not the last character
      if (i !== length - 1) {
        currentLine = '';
      }
    } else if (char === '\n') {
      // Newline detected: Add current line to final output and reset it
      finalOutput += currentLine + '\n';
      currentLine = '';
    } else {
      // Append character to the current line
      currentLine += char;
    }

    i++;
  }

  // Append any remaining text in currentLine to the final output
  finalOutput += currentLine;

  return finalOutput;
}

// Example usage
// const commandOutput = "Starting\nDownloading file... 0%\rDownloading file... 1%\rDownloading file... 2%\r...\rDownloading file... 100%\n";
// const finalString = processCommandOutput(commandOutput);

// console.log(finalString);  // Output: "Starting\nDownloading file... 100%"
