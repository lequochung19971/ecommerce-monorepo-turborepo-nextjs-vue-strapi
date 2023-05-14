import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { AxiosError } from 'axios';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import AppLogo from '@/common/components/AppLogo';
import { AppRoute } from '@/common/enums/appRoute';
import { useAppToast } from '@/common/hooks';
import { ApiUrl, httpClient } from '@/common/http';
import httpStatusMessage from '@/common/json/httpStatusMessage.json';
import { PasswordField } from '@/modules/auth';

type HttpStatusMessage = typeof httpStatusMessage;
const ResetPassword: NextPage = () => {
  const toast = useAppToast();
  const { register, handleSubmit, getValues } = useForm({
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const doSubmit = async () => {
    const formValue = getValues();
    try {
      onOpen();
      await httpClient.post(ApiUrl.AUTH_RESET_PASSWORD, {
        ...formValue,
        code: router.query.code,
      });
      toast({
        status: 'success',
        title: 'Success',
        description: 'Please check your email to reset your password.',
      });
      router.push(AppRoute.AUTH_SIGN_IN);
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
              <Heading size={useBreakpointValue({ base: 'xs', md: 'sm', lg: 'lg' })}>Reset Password</Heading>
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
                  <PasswordField isRequired {...register('password')} />
                  <PasswordField isRequired label="Password Confirmation" {...register('passwordConfirmation')} />
                </Stack>

                <Stack spacing="6">
                  <Button type="submit" variant="solid" colorScheme="blue" isLoading={isOpen}>
                    Reset password
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

export default ResetPassword;
