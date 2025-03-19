import React from 'react';
import { Box, useRadio, UseRadioProps, Flex, Icon, Divider } from '@chakra-ui/react';
import { IconType } from 'react-icons';

interface RadioCardProps extends UseRadioProps {
  icon: IconType;
  color: string;
  label: string;
  description: string;
  example: string;
}

const RadioCard: React.FC<RadioCardProps> = ({ icon, label, description, example, color, ...props }) => {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label" width="100%">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: 'teal.600',
          color: 'white',
          borderColor: 'teal.600',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={4}
        py={2}
        width="100%"
      >
        <Flex align="center">
          <Icon as={icon} boxSize={6} color={color} mr={3} />
          <Box>
            <Box fontWeight="bold" mb={1}>{label}</Box>
            <Box fontSize="sm">{description}</Box>
            <Divider my={2} />
            <Box fontSize="sm" mb={1}>{example}</Box>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default RadioCard;
