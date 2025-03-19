// src/components/Terminal.tsx

import React, { useEffect, useRef, useState } from 'react';
import { Box, VStack, Text, Collapse, IconButton } from '@chakra-ui/react';
import { eventEmitter, AuditReport, processCommandOutput } from '@/utils';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { CommandPromptIcon, SystemOperator } from '@/features/terminal';
import { Safety, isApprovalRequired } from '@/features/safety';

interface TerminalEntry {
  id: string;
  command: string;
  description: string;
  output: string;
  error: string;
  result?: boolean;
  report?: AuditReport;
  isExpanded?: boolean;
  isRunning: boolean;
  requiresApproval: boolean; // Indicates if command execution requires approval
  parsedOutput: string[];
  parsedError: string[];
}

const Terminal: React.FC = () => {
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [cmdStopped, setCmdStopped] = useState<boolean>(false);
  const startOfTerminalRef = useRef<HTMLDivElement>(null);
  const endOfTerminalRef = useRef<HTMLDivElement>(null);
  const terminalContainerRef = useRef<HTMLDivElement>(null); // Ref for the terminal container
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);  // State to track auto-scrolling
  const [isTerminalVisible, setIsTerminalVisible] = useState<boolean>(false);  // State to track visibility

  useEffect(() => {
    const handleNewCommand = (
      id: string,
      command: string,
      description: string,
      stdout: string,
      stderr: string,
      success?: boolean,
      report?: AuditReport
    ) => {
      setEntries((prevEntries) => {
        const requiresApproval = isApprovalRequired(report);
        const isRunning = success == null && !requiresApproval;
        const existingEntryIndex = prevEntries.findIndex((entry) => entry.id === id);

        if (existingEntryIndex !== -1) {
          const updatedEntries = [...prevEntries];
          const updatedEntry = updatedEntries[existingEntryIndex];
          // Append new output or error to existing entry
          if (stdout) {
            updatedEntry.output += stdout;
            updatedEntry.parsedOutput = processCommandOutput(updatedEntry.output ?? '').split('\n');
          }
          if (stderr) {
            updatedEntry.error += stderr;
            updatedEntry.parsedError = processCommandOutput(updatedEntry.error ?? '').split('\n');
          }
          // Update the result status if the command execution is completed
          if (success !== undefined) {
            updatedEntry.result = success;
            setCmdStopped(true);
          }
          updatedEntry.isRunning = isRunning;
          updatedEntries[existingEntryIndex] = updatedEntry;
          return updatedEntries;
        } else {
          setCmdStopped(true);
          const isExpanded = false;
          setAutoScroll(true);  // Enable auto-scrolling for new command
          setIsTerminalVisible(true);

          return [
            ...prevEntries,
            {
              id,
              command,
              description,
              output: stdout || '',
              error: stderr || '',
              result: success,
              report,
              isExpanded,
              isRunning,
              requiresApproval,
              parsedOutput: stdout != null ? processCommandOutput(stdout ?? '').split('\n') : [],
              parsedError: stderr != null ? processCommandOutput(stderr ?? '').split('\n') : [],
            },
          ];
        }
      });
    };

    const handleClearTerminal = () => {
      setEntries([]);
      setCmdStopped(false);
      setHoveredId(null);
      setAutoScroll(true);  // Enable auto-scrolling when terminal is cleared
    };

    eventEmitter.on('terminalCommand', handleNewCommand);
    eventEmitter.on('clearTerminal', handleClearTerminal);

    return () => {
      eventEmitter.off('terminalCommand', handleNewCommand);
      eventEmitter.off('clearTerminal', handleClearTerminal);
    };
  }, []);

  useEffect(() => {
    if (autoScroll && cmdStopped) {
      endOfTerminalRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [cmdStopped, entries, autoScroll]);

  useEffect(() => {
    const terminalElement = terminalContainerRef.current;
    if (!terminalElement) return;

    const onScroll = () => {
      const isAtBottom =
        terminalElement.scrollHeight - terminalElement.scrollTop ===
        terminalElement.clientHeight;
      setAutoScroll(isAtBottom);
    };

    if (isTerminalVisible) {
      terminalElement.addEventListener('scroll', onScroll);
    } else {
      terminalElement.removeEventListener('scroll', onScroll);
    }

    return () => {
      terminalElement.removeEventListener('scroll', onScroll);
    };
  }, [isTerminalVisible]);

  const handleCancel = async (id: string, isRunning: boolean) => {
    if (!isRunning) return;
    console.log('Cabcel:', id);
    const systemOperator = await SystemOperator.getInstance();
    await systemOperator.terminal.killProcess(id);
  };

  // Toggle error collapse
  const toggleError = (index: number) => {
    setEntries((prevEntries) => {
      const updatedEntries = [...prevEntries];
      updatedEntries[index].isExpanded = !updatedEntries[index].isExpanded;
      return updatedEntries;
    });
  };

  // Approve of decline command execution
  const approveExecution = (id: string, result: 'approve' | 'decline') => {
    eventEmitter.emit(`${result}-${id}`);  // Emit the approval or decline event
    setEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === id ? { ...entry, requiresApproval: false } : entry
      )
    );
  };

  if (entries.length === 0) {
    return null;
  }

  const styles = {
    '@keyframes shimmer': {
      '0%': { opacity: 0.3 },
      '50%': { opacity: 1 },
      '100%': { opacity: 0.3 },
    },
    '@keyframes flip': {
      '0%': { transform: 'rotateY(0)' },
      '50%': { transform: 'rotateY(90deg)', opacity: 0 },
    },
  };

  return (
    <Box position="relative" width="100%" height="100%" css={styles}>
      <VStack
        ref={terminalContainerRef}
        spacing={3}
        p={5}
        bg="gray.800"
        color="white"
        fontFamily="monospace"
        width="100%"
        height="100%"
        overflowY="auto"
      >
        {entries.slice(-30).map((entry, index) => (
          <Box key={index} width="100%" whiteSpace="pre">
            <div ref={startOfTerminalRef} />
            <Text color="green.600">{`# ${entry.description}`}</Text>
            <Text as="span" display="flex" alignItems="center">
              <CommandPromptIcon
                isRunning={entry.isRunning}
                hoveredId={hoveredId}
                entryId={entry.id}
                onMouseEnter={() => setHoveredId(entry.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleCancel(entry.id, entry.isRunning)}
              />
              <Safety
                requiresApproval={entry.requiresApproval}
                command={entry.command}
                description={entry.description}
                report={entry.report}
                onApprove={entry.report ? () => approveExecution(entry.id, 'approve') : undefined}
                onDecline={entry.report ? () => approveExecution(entry.id, 'decline') : undefined}
              />
              {`${entry.command}`}
            </Text>
            {entry.parsedOutput.slice(-50).map((line, i) => (
              <Text key={i}>{line}</Text>
            ))}
            {entry.error && (
              <>
                <Text color="red.400" display="flex" alignItems="center">
                  {entry.parsedError.filter((e) => e.trim().length > 0).length > 1 && (
                    <IconButton
                      aria-label={entry.isExpanded ? 'Collapse Error' : 'Expand Error'}
                      icon={entry.isExpanded ? <HiChevronUp /> : <HiChevronDown />}
                      variant="unstyled" // Use unstyled variant for no background or border
                      size="sx"
                      colorScheme="red.400"
                      onClick={() => toggleError(index)}
                      ml={0}
                      mr={1}
                      minW="unset"
                      fontSize="1em"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        height: '1em',
                        width: '1em',
                        color: 'red.400',
                        _hover: {
                          color: 'red.500',
                        },
                      }}
                    />
                  )}
                  {entry.error.split('\n')[0]}
                </Text>
                <Collapse in={entry.isExpanded} style={{ overflowY: 'unset', overflowX: 'unset' }}>
                  {entry.parsedError
                    .filter(e => e.trim().length > 0)
                    .slice(1) // TODO: reduce some data in the middle
                    .map((line, i) => (
                      <Text key={i} color="red.400" ml="calc(1em + var(--chakra-space-1))">
                        {line}
                      </Text>
                    ))}
                </Collapse>
              </>
            )}
            <div ref={endOfTerminalRef} />
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default Terminal;
