import { Box, Icon, IconButton, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';

import { AppRoute } from '../enums';

export const ShoppingCart: React.FunctionComponent = () => {
  return (
    <Box cursor="pointer" role="group" as={Link} href={AppRoute.CHECKOUT_SHOPPING_CART}>
      <Text
        colorScheme="blue"
        sx={{
          borderRadius: '30px',
          background: '#3182ce',
          color: 'white',
          position: 'absolute',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 5,
          height: 5,
          fontSize: '12px',
          fontWeight: 'bold',
          top: '2px',
          right: '6px',
          zIndex: 2,
        }}
      >
        10
      </Text>
      <IconButton icon={<Icon as={FaShoppingCart} width="5" height="5" />} aria-label={''} />
    </Box>
  );
};

export default ShoppingCart;
