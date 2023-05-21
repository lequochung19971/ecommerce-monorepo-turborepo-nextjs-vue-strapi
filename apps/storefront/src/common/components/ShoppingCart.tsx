import { Box, Icon, IconButton, Text, Tooltip } from '@chakra-ui/react';
import type { AnimationProps } from 'framer-motion';
import { useAnimation } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import useSWR from 'swr';

import { AppRoute } from '../enums';
import { ApiUrl, httpMethods } from '../http';
import { httpFetcher } from '../http/httpFetcher';
import { MotionBox } from './chakra-motion/MotionBox';

const variants: AnimationProps['variants'] = {
  start: () => {
    return {
      rotate: [-15, 20, 0],
      transition: {
        delay: 0,
        duration: 0.2,
      },
    };
  },
  reset: {
    rotate: 0,
  },
};

export const ShoppingCart: React.FunctionComponent = () => {
  const { data = 0 } = useSWR(httpMethods.get(ApiUrl.SHOPPING_SESSION_ITEMS_QUANTITY), httpFetcher());
  const controls = useAnimation();
  const numberOfItemsPrevious = useRef(data);

  useEffect(() => {
    if (numberOfItemsPrevious.current !== data) {
      numberOfItemsPrevious.current = data;
      controls.start('start');
    }
  }, [controls, data]);

  return (
    <Tooltip label="Shopping Cart" placement="top">
      <MotionBox
        cursor="pointer"
        position="relative"
        role="group"
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 17,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        variants={variants}
        animate={controls}
      >
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
            fontSize: '0.75rem',
            fontWeight: 'bold',
            top: '-8px',
            right: '-8px',
            zIndex: 2,
          }}
        >
          {data >= 100 ? '99+' : data}
        </Text>
        <Box href={AppRoute.CHECKOUT_SHOPPING_CART} as={Link}>
          <IconButton icon={<Icon as={FaShoppingCart} width="5" height="5" />} aria-label={''} />
        </Box>
      </MotionBox>
    </Tooltip>
  );
};

export default ShoppingCart;
