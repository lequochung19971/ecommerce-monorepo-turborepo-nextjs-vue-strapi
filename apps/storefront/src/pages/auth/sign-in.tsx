import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
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
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';

import AppLogo from '@/common/components/AppLogo';
import { AppRoute } from '@/common/enums/appRoute';
import { withAuth } from '@/common/HOCs';
import { useAppToast } from '@/common/hooks';
import httpStatusMessage from '@/common/json/httpStatusMessage.json';
import { OAuthButtonGroup, PasswordField } from '@/modules/auth';

type HttpStatusMessage = typeof httpStatusMessage;
const SignIn: NextPage = () => {
  const router = useRouter();
  const toast = useAppToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit, getValues } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const toastByStatusCode = (status: string) => {
    if (status.toString()[0] === '2') {
      toast({
        status: 'success',
        title: 'Success',
        description: httpStatusMessage[status as keyof HttpStatusMessage],
      });
    }

    if (status.toString()[0] === '4') {
      toast({
        status: 'error',
        title: 'Error',
        description: httpStatusMessage[status as keyof HttpStatusMessage],
      });
    }
  };

  const doSubmit = async () => {
    const formValue = getValues();
    onOpen();
    const response = await signIn('credentials', {
      redirect: false,
      email: formValue.email,
      password: formValue.password,
      callbackUrl: '/',
    });
    onClose();

    toastByStatusCode(response?.status.toString() ?? '');
    if (response?.ok) router.push('/');
  };

  // Google Handler function
  async function handleGoogleSignIn() {
    signIn('google', { callbackUrl: window.location.origin });
  }

  return (
    <Box maxWidth="100%" width="100%" height="100%" bg="gray.200">
      <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
        <Stack spacing="8">
          <Stack spacing="6" alignItems="center">
            <AppLogo />
            <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
              <Heading size={useBreakpointValue({ base: 'xs', md: 'sm', lg: 'lg' })}>Log in to your account</Heading>
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
                  <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input {...register('email')} id="email" type="email" />
                  </FormControl>
                  <PasswordField {...register('password')} />
                </Stack>
                <HStack justify="space-between">
                  <Checkbox>Remember me</Checkbox>
                  <Button variant="link" as={Link} href={AppRoute.AUTH_FORGOT_PASSWORD} size="sm">
                    Forgot password?
                  </Button>
                </HStack>
                <Stack spacing="6">
                  <Button type="submit" variant="solid" colorScheme="blue" isLoading={isOpen}>
                    Sign in
                  </Button>
                </Stack>
                <HStack>
                  <Divider />
                  <Text fontSize="sm" whiteSpace="nowrap" color="muted">
                    or continue with
                  </Text>
                  <Divider />
                </HStack>
                <OAuthButtonGroup onGoogleSignIn={handleGoogleSignIn} />
              </Stack>
            </form>
          </Box>
          <HStack spacing="1" justify="center">
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

export default withAuth(SignIn);
