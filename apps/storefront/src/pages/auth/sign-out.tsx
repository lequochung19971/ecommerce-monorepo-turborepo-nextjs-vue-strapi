import { Box, Button, Container, Flex, Text, useBreakpointValue, useColorModeValue } from '@chakra-ui/react';
import type { NextPage } from 'next';

const SignOut: NextPage = () => {
  return (
    <Box maxWidth="100%" width="100%" height="100%" bg="gray.200">
      <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
        <Flex
          minHeight="300px"
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={useBreakpointValue({ base: 'transparent', sm: 'white' })}
          boxShadow={{ base: 'none', sm: useColorModeValue('md', 'md-dark') }}
          borderRadius={{ base: 'none', sm: 'xl' }}
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Text fontSize="32px" fontWeight="bold">
            Sign Out
          </Text>
          <Text mb="24px">Are you sure you want to sign out?</Text>
          <Button type="submit" variant="solid" colorScheme="blue">
            Yes
          </Button>
        </Flex>
      </Container>
    </Box>
  );
};

export default SignOut;
