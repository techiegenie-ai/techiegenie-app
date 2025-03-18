import React, { useState, useEffect } from 'react';
import { VStack, Text, useRadioGroup, Box, Divider } from '@chakra-ui/react';
import { HiShieldCheck, HiShieldExclamation } from 'react-icons/hi';
import RadioCard from './RadioCard';
import { getSafetyLevel, setSafetyLevel } from '../utils/isApprovalRequired';
import { HiShieldX } from './CustomIcons';

export enum SafetyLevel {
  Basic = 0,
  Cautious = 1,
  Critical = 2,
}

const safetyOptions = [
  {
    level: SafetyLevel.Basic,
    label: 'Basic Actions',
    description: 'Approve all commands, including the safest ones.',
    example: 'Viewing files, listing directories, checking system status.',
    icon: HiShieldCheck,
    color: "green.500",
  },
  {
    level: SafetyLevel.Cautious,
    label: 'Cautious Actions',
    description: 'Approve commands that might require some caution.',
    example: 'Changing file permissions, installing non-critical updates.',
    icon: HiShieldExclamation,
    color: "yellow.500",
  },
  {
    level: SafetyLevel.Critical,
    label: 'Critical Actions',
    description: 'Approve only high-risk commands.',
    example: 'Deleting system files, formatting disks, executing risky scripts.',
    icon: HiShieldX,
    color: "red.500",
  },
];

const SafetySettings: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<SafetyLevel>(SafetyLevel.Basic);

  useEffect(() => {
    // Load safety level from local storage
    const savedLevel = getSafetyLevel();
    setSelectedLevel(savedLevel);
  }, []);

  const handleSafetyLevelChange = (level: SafetyLevel) => {
    setSelectedLevel(level);
    setSafetyLevel(level);
  };

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'safetyLevel',
    value: selectedLevel.toString(),
    onChange: (value) => handleSafetyLevelChange(Number(value) as SafetyLevel),
  });

  const group = getRootProps();

  return (
    <VStack align="start" spacing={4}>
      <Text fontSize="lg" fontWeight="bold">
        Safety Settings
      </Text>
      <Text>
        Select the level of commands you want to approve before execution.
        This helps ensure you maintain control over potentially risky operations.
      </Text>
      <VStack {...group} align="start" spacing={4} width="100%">
        {safetyOptions.map(({ level, label, description, example, icon, color }) => {
          const radio = getRadioProps({ value: level.toString() });
          return (
            <RadioCard
              key={level}
              icon={icon}
              label={label}
              description={description}
              example={example}
              color={color}
              {...radio}
            />
          );
        })}
      </VStack>
      <Box>
        <Divider my={0} />
        <Text mt={2}>{getSummary(selectedLevel)}</Text>
      </Box>
    </VStack>
  );
};

const getSummary = (level: SafetyLevel): string => {
  switch (level) {
    case SafetyLevel.Basic:
      return 'You will need to approve every command, including Basic Actions.';
    case SafetyLevel.Cautious:
      return 'Only Cautious and Critical Actions will require approval. Basic Actions will run automatically.';
    case SafetyLevel.Critical:
      return 'Only Critical Actions will need approval. Basic and Cautious Actions will run automatically.';
    default:
      return '';
  }
};

export default SafetySettings;
