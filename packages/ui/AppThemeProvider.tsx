import type { ChakraProviderProps } from '@chakra-ui/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({});

export type AppThemeProviderProps = ChakraProviderProps;

export const AppThemeProvider: React.FunctionComponent<AppThemeProviderProps> = (props) => {
  const { children } = props;
  return (
    <ChakraProvider theme={theme} {...props}>
      {children}
    </ChakraProvider>
  );
};

export default AppThemeProvider;
