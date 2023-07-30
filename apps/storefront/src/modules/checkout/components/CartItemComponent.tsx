import type { NumberInputProps } from '@chakra-ui/react';
import {
  CloseButton,
  Flex,
  Link,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import * as React from 'react';

import { MotionFlex } from '@/common/components';

import type { CartItem as CartItemModel } from '../types';
import CartProductMeta from './CartProductMeta';
import { PriceTag } from './PriceTag';

type CartItemComponentProps = {
  currency?: string;
  mode?: 'view' | 'edit';
  onChangeQuantity?: (id: string, quantity: number) => void;
  onClickGiftWrapping?: () => void;
  onClickDelete?: (id: string) => void;
} & CartItemModel;

const QuantityInput: React.FunctionComponent<NumberInputProps> = (props) => {
  return (
    <NumberInput {...props}>
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
};

export const CartItemComponent = (props: CartItemComponentProps) => {
  const { id, quantity, currency = 'USD', onChangeQuantity, onClickDelete, mode = 'edit', product } = props;
  return (
    <MotionFlex
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      direction={{ base: 'column', md: 'row' }}
      justify="space-between"
      align="center"
    >
      <CartProductMeta
        name={product.name}
        image={`${process.env.NEXT_PUBLIC_API_URL}${product.media?.[0].url}`}
        mode={mode}
      />

      {mode === 'edit' && (
        <>
          {/* Desktop */}
          <Flex width="full" justify="space-between" display={{ base: 'none', md: 'flex' }}>
            <QuantityInput
              width="5rem"
              min={1}
              value={quantity}
              onChange={(_valueAsString, valueAsNumber) => {
                onChangeQuantity?.(id, valueAsNumber);
              }}
            />
            <PriceTag price={+product.price * quantity} currency={currency} />
            <CloseButton aria-label={`Delete ${name} from cart`} onClick={() => onClickDelete?.(id)} />
          </Flex>

          {/* Mobile */}
          <Flex mt="4" align="center" width="full" justify="space-between" display={{ base: 'flex', md: 'none' }}>
            <Link fontSize="sm" textDecor="underline">
              Delete
            </Link>
            <QuantityInput
              width="5rem"
              min={1}
              max={100}
              value={quantity}
              onChange={(_valueAsString, valueAsNumber) => {
                onChangeQuantity?.(id, valueAsNumber);
              }}
            />
            <PriceTag price={+product.price} currency={currency} />
          </Flex>
        </>
      )}
    </MotionFlex>
  );
};
export default CartItemComponent;
