import { Flex, Heading, Link, Stack, Text, useColorModeValue as mode } from '@chakra-ui/react';
import type { Variants } from 'framer-motion';
import { useRouter } from 'next/router';
import * as React from 'react';
import { FaArrowRight } from 'react-icons/fa';

import { MotionBox, MotionButton } from '@/common/components';
import { AppRoute } from '@/common/enums';
import { formatPrice } from '@/common/utilts/formatPrice';

type OrderSummaryItemProps = {
  label: string;
  value?: string;
  children?: React.ReactNode;
};

export const OrderSummaryItem = (props: OrderSummaryItemProps) => {
  const { label, value, children } = props;
  return (
    <Flex justify="space-between" fontSize="sm">
      <Text fontWeight="medium" color={mode('gray.600', 'gray.400')}>
        {label}
      </Text>
      {value ? <Text fontWeight="medium">{value}</Text> : children}
    </Flex>
  );
};

type CartOrderSummaryProps = {
  subTotal: number;
  total: number;
};
const variants: Variants = {
  rest: {
    x: 0,
    transition: {
      duration: 0.3,
      type: 'tween',
      ease: 'easeIn',
    },
  },

  hover: {
    x: 10,
    transition: {
      duration: 0.4,
      type: 'tween',
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeOut',
    },
  },
};
export const CartOrderSummary: React.FunctionComponent<CartOrderSummaryProps> = (props) => {
  const { subTotal, total } = props;
  const router = useRouter();
  return (
    <Stack spacing="8" width="full">
      <Heading size="md">Order Summary</Heading>

      <Stack spacing="6">
        <OrderSummaryItem label="Subtotal" value={formatPrice(subTotal)} />
        <OrderSummaryItem label="Shipping + Tax">
          <Link href="#" textDecor="underline">
            Calculate shipping
          </Link>
        </OrderSummaryItem>
        <OrderSummaryItem label="Coupon Code">
          <Link href="#" textDecor="underline">
            Add coupon code
          </Link>
        </OrderSummaryItem>
        <Flex justify="space-between">
          <Text fontSize="lg" fontWeight="semibold">
            Total
          </Text>
          <Text fontSize="xl" fontWeight="extrabold">
            {formatPrice(total)}
          </Text>
        </Flex>
      </Stack>
      <MotionButton
        initial="rest"
        animate="rest"
        whileHover="hover"
        colorScheme="blue"
        size="lg"
        fontSize="md"
        rightIcon={
          <MotionBox variants={variants}>
            <FaArrowRight />
          </MotionBox>
        }
        onClick={() => router.push(AppRoute.CHECKOUT_PAYMENT)}
      >
        Checkout
      </MotionButton>
    </Stack>
  );
};
export default CartOrderSummary;
