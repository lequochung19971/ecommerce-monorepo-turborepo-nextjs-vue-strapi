import { Box, Card, Flex, Heading, HStack, Link, Stack, useColorModeValue as mode } from '@chakra-ui/react';
import produce from 'immer';
import { set } from 'lodash';
import type { NextPage } from 'next';
import * as React from 'react';
import useSWR from 'swr';

import { ApiUrl, httpMethods } from '@/common/http';
import { putCartItem } from '@/common/http/endpoints/cart-item';
import { httpFetcher } from '@/common/http/httpFetcher';
import type { QueryResponse } from '@/common/types';
import { CartItemComponent, CartOrderSummary } from '@/modules/checkout/components';
import type { CartItem } from '@/modules/checkout/types/cartItem';

const ShoppingCartPage: NextPage = () => {
  const { data: response, mutate: mutateQueryCartItems } = useSWR(
    httpMethods.get(ApiUrl.CART_ITEMS, {
      params: {
        populate: ['product.media'],
        sort: ['createdAt'],
      },
    }),
    httpFetcher<QueryResponse<CartItem[]>>(),
  );
  const { data: itemsQuantity = 0, mutate: mutateGetItemsQuantity } = useSWR(
    httpMethods.get(ApiUrl.SHOPPING_SESSION_ITEMS_QUANTITY),
    httpFetcher(),
  );

  const handleOnChangeQuantity = async (id: string, quantity: number) => {
    const cartItemIndex = response?.data?.findIndex((cartItem) => cartItem.id === id) ?? -1;
    const currentCartItem = response?.data[cartItemIndex];
    const previousQuantity = currentCartItem?.quantity ?? 0;
    if (quantity === previousQuantity) return;
    try {
      mutateQueryCartItems(
        produce(response, (draft) => {
          if (!draft) return;

          if (cartItemIndex > -1) {
            set(draft?.data[cartItemIndex], 'quantity', quantity);
          }
        }),
        {
          revalidate: false,
        },
      );

      // Update quantity of this cart item
      await putCartItem<{ data: CartItem }>(id, {
        data: {
          quantity,
        },
      });
      mutateGetItemsQuantity(itemsQuantity - previousQuantity + quantity);
    } catch (error) {
      // Reverse quantity of this cart item when an error happens
      mutateQueryCartItems(
        produce(response, (draft) => {
          if (!draft) return;

          if (cartItemIndex > -1) {
            set(draft?.data[cartItemIndex], 'quantity', previousQuantity);
          }
        }),
        {
          revalidate: false,
        },
      );
      throw error;
    }
  };

  return (
    <Box mx="auto" p={{ base: '4', md: '8' }} h="full">
      <Stack direction={{ base: 'column', lg: 'row' }} align={{ lg: 'flex-start' }} spacing={{ base: '4', md: '8' }}>
        <Stack flex="1">
          <Card background="white" padding="5">
            <Heading fontSize="2xl" fontWeight="extrabold" mb="4">
              {` Shopping Cart (${response?.data?.length ?? 0}) item(s)`}
            </Heading>

            <Stack spacing="6">
              {(response?.data ?? []).map((item) => (
                <CartItemComponent key={item.id} {...item} currency="VND" onChangeQuantity={handleOnChangeQuantity} />
              ))}
            </Stack>
          </Card>
        </Stack>

        <Stack minW="350px" position={{ base: 'static', xl: 'sticky' }} top="90px">
          <Card background="white" padding="5">
            <Flex direction="column" align="center" flex="1">
              <CartOrderSummary />
              <HStack mt="6" fontWeight="semibold">
                <p>or</p>
                <Link color={mode('blue.500', 'blue.200')}>Continue shopping</Link>
              </HStack>
            </Flex>
          </Card>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ShoppingCartPage;
