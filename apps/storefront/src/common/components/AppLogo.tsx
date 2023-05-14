import type { FlexProps } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';

export const AppLogo: React.FunctionComponent<FlexProps> = (props) => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      width="200px"
      height="60px"
      fontWeight="bold"
      fontSize="3xl"
      border="3px solid black"
      {...props}
    >
      LOGO
    </Flex>
  );
};

export default AppLogo;
