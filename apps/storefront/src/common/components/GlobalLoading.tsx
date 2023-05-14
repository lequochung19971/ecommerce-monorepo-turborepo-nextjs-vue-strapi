import { Box, Flex, Spinner } from '@chakra-ui/react';

export const GlobalLoading: React.FunctionComponent = () => {
  return (
    <Flex justifyContent="center" alignItems="center" position="fixed" top="0" bottom="0" right="0" left="0">
      <Box
        height="full"
        width="full"
        backgroundColor="gray"
        position="fixed"
        top="0"
        bottom="0"
        right="0"
        left="0"
        opacity="0.2"
      />
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" colorScheme="blue" size="xl" />
    </Flex>
  );
};
