import type { UseToastOptions } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';

export const useAppToast = (defaultOptions?: UseToastOptions) => {
  return useToast({
    ...(defaultOptions ?? {}),
    position: 'bottom-left',
    isClosable: true,
  });
};
