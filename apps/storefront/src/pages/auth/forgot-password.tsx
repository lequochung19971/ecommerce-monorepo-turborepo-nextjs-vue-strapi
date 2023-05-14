import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { AxiosError } from 'axios';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import AppLogo from '@/common/components/AppLogo';
import { AppRoute } from '@/common/enums/appRoute';
import { useAppToast } from '@/common/hooks';
import { ApiUrl, httpClient } from '@/common/http';
import httpStatusMessage from '@/common/json/httpStatusMessage.json';

type HttpStatusMessage = typeof httpStatusMessage;

const ForgotPassword: NextPage = () => {
  const toast = useAppToast();
  const { register, handleSubmit, getValues } = useForm({
    defaultValues: {
      email: '',
    },
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const doSubmit = async () => {
    const formValue = getValues();
    try {
      onOpen();
      await httpClient.post(ApiUrl.AUTH_LOCAL_PASSWORD, formValue);
      toast({
        status: 'success',
        title: 'Success',
        description: 'Please check your email to reset your password.',
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          status: 'error',
          title: 'Error',
          description: httpStatusMessage[error.code as keyof HttpStatusMessage],
        });
      }
    } finally {
      onClose();
    }
  };

  return (
    <Box maxWidth="100%" width="100%" height="100%" bg="gray.200">
      <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
        <Stack spacing="8">
          <Stack spacing="6" alignItems="center">
            <AppLogo />
            <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
              <Heading size={useBreakpointValue({ base: 'xs', md: 'sm', lg: 'lg' })}>Forgot Password</Heading>
              <HStack spacing="1" flexDirection="column" textAlign="left">
                <Text color="muted">
                  Enter the email address associated with your account adn we'll send you a link to reset your password.
                </Text>
              </HStack>
            </Stack>
          </Stack>
          <Box
            py={{ base: '0', sm: '8' }}
            px={{ base: '4', sm: '10' }}
            bg={useBreakpointValue({ base: 'transparent', sm: 'white' })}
            boxShadow={{ base: 'none', sm: useColorModeValue('md', 'md-dark') }}
            borderRadius={{ base: 'none', sm: 'xl' }}
          >
            <form onSubmit={handleSubmit(doSubmit)}>
              <Stack spacing="6">
                <Stack spacing="5">
                  <FormControl isRequired>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input {...register('email')} id="email" type="email" />
                  </FormControl>
                </Stack>

                <Stack spacing="6">
                  <Button type="submit" variant="solid" colorScheme="blue" isLoading={isOpen}>
                    Continue
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Box>
          <HStack spacing="1" display="flex" flexDirection="column" justifyContent="center">
            <Text color="muted">
              If you have a account. Please click{' '}
              <Button variant="link" as={Link} href={AppRoute.AUTH_SIGN_IN} colorScheme="blue">
                Sign in
              </Button>
              .
            </Text>
            <Text color="muted">
              Don't have an account?{' '}
              <Button variant="link" as={Link} href={AppRoute.AUTH_SIGN_UP} colorScheme="blue">
                Sign up
              </Button>
            </Text>
          </HStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
