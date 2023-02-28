import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useColorModeValue as colorMode,
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import Image from 'next/image';
import * as React from 'react';

import masterIcon from '@/common/assets/mastercard.svg';
import visaIcon from '@/common/assets/visa.svg';
import { CartItem, formatPrice, OrderSummaryItem } from '@/modules/checkout/components';

export const cartData = [
  {
    id: '1',
    price: 39.99,
    currency: 'GBP',
    name: 'Ferragamo bag',
    description: 'Tan, 40mm',
    quantity: 3,
    imageUrl:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80',
  },
  {
    id: '2',
    price: 39.99,
    currency: 'GBP',
    name: 'Bamboo Tan',
    description: 'Tan, 40mm',
    quantity: 3,
    imageUrl:
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=774&q=80',
  },
  {
    id: '3',
    price: 39.99,
    currency: 'GBP',
    name: 'Yeezy Sneakers',
    description: 'Tan, 40mm',
    quantity: 3,
    imageUrl:
      'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1770&q=80',
  },
  {
    id: '3',
    price: 39.99,
    currency: 'GBP',
    name: 'Yeezy Sneakers',
    description: 'Tan, 40mm',
    quantity: 3,
    imageUrl:
      'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1770&q=80',
  },
  {
    id: '4',
    price: 39.99,
    currency: 'GBP',
    name: 'Yeezy Sneakers',
    description: 'Tan, 40mm',
    quantity: 3,
    imageUrl:
      'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1770&q=80',
  },
  {
    id: '5',
    price: 39.99,
    currency: 'GBP',
    name: 'Yeezy Sneakers',
    description: 'Tan, 40mm',
    quantity: 3,
    imageUrl:
      'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1770&q=80',
  },
];
const PaymentPage: NextPage = () => (
  <Box mx="auto" p={{ base: '4', md: '8' }} h="full">
    <Stack direction={{ base: 'column', lg: 'row' }} align={{ lg: 'flex-start' }} spacing={{ base: '4', md: '8' }}>
      <Stack flex="1" spacing={{ base: '4', md: '8' }}>
        <Card background="white" padding="5">
          <Heading fontSize="2xl" fontWeight="extrabold" mb="4">
            Shopping Cart (3 items)
          </Heading>
          <Stack display="flex" flexDirection="row" flexWrap="wrap" gap={4}>
            <FormControl>
              <FormLabel htmlFor="full-name">Full name</FormLabel>
              <Input id="full-name" placeholder="Full name" />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="street-address">Street address</FormLabel>
              <Input id="street-address" placeholder="Street address" />
            </FormControl>
            <FormControl flex="15%">
              <FormLabel htmlFor="zip-code">Zip code</FormLabel>
              <Input id="zip-code" placeholder="Zip code" />
            </FormControl>
            <FormControl flex="80%">
              <FormLabel htmlFor="city">City</FormLabel>
              <Input id="city" placeholder="City" />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email-address">Email address</FormLabel>
              <Input type="email" id="email-address" placeholder="Email address" />
            </FormControl>
          </Stack>
        </Card>
        <Card background="white" padding="5">
          <Heading fontSize="2xl" fontWeight="extrabold" mb="4">
            Shipping Methods
          </Heading>
          <RadioGroup>
            <Stack direction="row">
              <Radio flex="1" value="1" size="lg">
                <Stack spacing="0">
                  <Box as="span" fontSize="lg" fontWeight="semibold">
                    Express
                  </Box>
                  <Box as="span" color={colorMode('gray.600', 'gray.400')}>
                    Dispatcher in 25 hours
                  </Box>
                </Stack>
              </Radio>
              <Radio flex="1" value="2" size="lg">
                <Stack spacing="0">
                  <Box as="span" fontSize="lg" fontWeight="semibold">
                    Standard
                  </Box>
                  <Box as="span" color={colorMode('gray.600', 'gray.400')}>
                    Dispatcher in 1 - 2 days
                  </Box>
                </Stack>
              </Radio>
            </Stack>
          </RadioGroup>
        </Card>

        <Card background="white" padding="5">
          <Stack flex="1" spacing={{ base: '4', md: '8' }}>
            <Heading fontSize="2xl" fontWeight="extrabold" mb="4">
              Payment Methods
            </Heading>
            <RadioGroup>
              <Stack direction="row">
                <Radio flex="1" value="1" size="lg">
                  <Stack spacing="0">
                    <Box as="span" fontSize="lg" fontWeight="semibold">
                      Pay in cash
                    </Box>
                    <Box as="span" color={colorMode('gray.600', 'gray.400')}>
                      Pay when receiving the orders
                    </Box>
                  </Stack>
                </Radio>
                <Radio flex="1" value="2" size="lg">
                  <Stack spacing="0">
                    <Box as="span" fontSize="lg" fontWeight="semibold">
                      Credit Card
                    </Box>
                    <Box as="span" color={colorMode('gray.600', 'gray.400')}>
                      Pay with credit card
                    </Box>
                    <Stack direction="row">
                      <Image src={visaIcon} alt="visa" height="32" />
                      <Image src={masterIcon} alt="master-card" height="32" />
                    </Stack>
                  </Stack>
                </Radio>
              </Stack>
            </RadioGroup>
            <Flex display="flex" flexDirection="row" flexWrap="wrap" gap={4}>
              <FormControl flex="49%">
                <FormLabel htmlFor="credit-card-number">Credit card number</FormLabel>
                <Input id="credit-card-number" placeholder="Credit card number" />
              </FormControl>
              <FormControl flex="49%">
                <FormLabel htmlFor="name-of-card">Card name</FormLabel>
                <Input id="name-of-card" placeholder="Card name" />
              </FormControl>
              <FormControl flex="49%">
                <FormLabel htmlFor="expiry-date">Expiry date</FormLabel>
                <Input id="expiry-date" placeholder="Expiry date" type="date" />
              </FormControl>
              <FormControl flex="49%">
                <FormLabel htmlFor="cvc">CVV/CVC</FormLabel>
                <Input id="cvc" placeholder="CVV/CVC" />
              </FormControl>
            </Flex>
          </Stack>
        </Card>
      </Stack>

      <Stack minW="350px" position={{ base: 'static', xl: 'sticky' }} top="90px">
        <Card background="white" padding="5">
          <Stack direction="column" flex="1" spacing="4">
            <Heading size="md">Order Summary</Heading>
            <Accordion allowToggle defaultIndex={[0]}>
              <AccordionItem border="0">
                <AccordionButton role="group" px="0" bg="white" _hover={{ bg: 'white', colorScheme: 'blue' }}>
                  <Box
                    as="span"
                    fontWeight="medium"
                    color={colorMode('gray.600', 'gray.400')}
                    flex="1"
                    textAlign="left"
                    fontSize="sm"
                    _groupHover={{ color: 'blue.500' }}
                  >
                    Items
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel p="0">
                  <Stack spacing="6" maxHeight="500px" overflow="auto">
                    {cartData.map((item) => (
                      <CartItem key={item.id} {...item} mode="view" />
                    ))}
                  </Stack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <Divider />
            <OrderSummaryItem label="Subtotal" value={formatPrice(597)} />
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
                {formatPrice(597)}
              </Text>
            </Flex>
            <Button colorScheme="blue" size="lg" fontSize="md">
              Place order
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Stack>
  </Box>
);

export default PaymentPage;
