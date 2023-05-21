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
import { useRouter } from 'next/router';
import * as React from 'react';
import { useMemo } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import useSWR, { useSWRConfig } from 'swr';
import type { CreateOrderDetailRequest } from 'types';

import masterIcon from '@/common/assets/mastercard.svg';
import visaIcon from '@/common/assets/visa.svg';
import SelectController from '@/common/components/controllers/SelectController';
import { AppRoute } from '@/common/enums';
import { useAppToast } from '@/common/hooks';
import { ApiUrl, httpClient, httpMethods } from '@/common/http';
import { postOrderDetailEndpoint } from '@/common/http/endpoints/cart-detail/post';
import { httpFetcher } from '@/common/http/httpFetcher';
import httpStatusMessage from '@/common/json/httpStatusMessage.json';
import type { QueryResponse } from '@/common/types';
import type { CityModel } from '@/common/types/cityModel';
import type { DistrictModel } from '@/common/types/districtModel';
import type { WardModel } from '@/common/types/wardModel';
import { formatPrice } from '@/common/utilts/formatPrice';
import { getCities, getDistricts, getWards } from '@/common/utilts/vietnamAddress';
import type { CartItem } from '@/modules/checkout';
import { PaymentMethod } from '@/modules/checkout';
import { CartItemComponent, OrderSummaryItem } from '@/modules/checkout/components';

const cities = getCities().map((c) => ({
  ...c,
  value: c.id,
  label: c.name,
}));

const districts = getDistricts().map((d) => ({
  ...d,
  value: d.id,
  label: d.name,
}));

const wards = getWards().map((ward) => ({
  ...ward,
  value: ward.id,
  label: ward.name,
}));

const countries = [
  {
    value: '84',
    label: 'Vietnam',
  },
];

type OrderDetailHookForm = {
  fullName: string;
  phoneNumber: string;
  email: string;
  city: CityModel | null;
  district: DistrictModel | null;
  ward: WardModel | null;
  address1: string;
  country: string;
  paymentMethod: PaymentMethod;
};

const PaymentPage: NextPage = () => {
  const toast = useAppToast();
  const router = useRouter();
  const hookForm = useForm<OrderDetailHookForm>({
    mode: 'all',
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      email: '',
      city: null as CityModel | null,
      district: null as DistrictModel | null,
      ward: null as WardModel | null,
      address1: '',
      country: '84',
      paymentMethod: PaymentMethod.PAY_IN_CASH,
    },
  });
  const { register, control, setValue, handleSubmit, getValues } = hookForm;
  const { mutate } = useSWRConfig();

  const city = useWatch({ control, name: 'city' });
  const district = useWatch({ control, name: 'district' });

  const cityOptions = cities;
  const districtOptions = useMemo(() => districts.filter((d) => d.parentId === city?.id), [city?.id]);
  const wardOptions = useMemo(() => wards.filter((d) => d.parentId === district?.id), [district?.id]);

  const { data: response } = useSWR(
    httpMethods.get(ApiUrl.CART_ITEMS, {
      params: {
        populate: ['product.media'],
        sort: ['createdAt'],
      },
    }),
    httpFetcher<QueryResponse<CartItem[]>>(),
  );

  const cartItems = response?.data ?? [];
  const totalOfCartItem = cartItems.reduce((total, cart) => {
    total = total + +cart.product.price * cart.quantity;
    return total;
  }, 0);

  const onSave = async () => {
    const values = getValues();
    const request: CreateOrderDetailRequest = {
      address: {
        address1: values.address1,
        city: values.city?.id ?? '',
        country: values.country ?? '84',
        district: values.district?.id ?? '',
        ward: values.ward?.id ?? '',
      },
      email: values.email,
      itemIds: cartItems.map((item) => item.id),
      phoneNumber: values.phoneNumber,
    };
    try {
      await postOrderDetailEndpoint(request);
      toast({
        status: 'success',
        title: 'Success',
        description: 'Create order successful',
      });
      mutate(httpMethods.get(ApiUrl.SHOPPING_SESSION_ITEMS_QUANTITY));
      mutate(
        httpMethods.get(ApiUrl.CART_ITEMS, {
          params: {
            populate: ['product.media'],
            sort: ['createdAt'],
          },
        }),
      );
      router.push(AppRoute.CHECKOUT_SHOPPING_CART);
    } catch (error) {
      toast({
        status: 'error',
        title: 'Error',
        description: 'Create order error',
      });
    }
  };

  return (
    <FormProvider {...hookForm}>
      <form onSubmit={handleSubmit(onSave)}>
        <Box mx="auto" p={{ base: '4', md: '8' }} h="full">
          <Stack
            direction={{ base: 'column', lg: 'row' }}
            align={{ lg: 'flex-start' }}
            spacing={{ base: '4', md: '8' }}
          >
            <Stack flex="1" spacing={{ base: '4', md: '8' }}>
              <Card background="white" padding="5">
                <Heading fontSize="2xl" fontWeight="extrabold" mb="4">
                  Shipment Details
                </Heading>
                <Stack display="flex" flexDirection="row" flexWrap="wrap" gap={4}>
                  <FormControl>
                    <FormLabel htmlFor="full-name">Full name</FormLabel>
                    <Input id="full-name" placeholder="Full name" {...register('fullName')} />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="Phone">Phone</FormLabel>
                    <Input id="phone" placeholder="Phone" maxLength={10} {...register('phoneNumber')} />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="email-address">Email address</FormLabel>
                    <Input type="email" id="email-address" placeholder="Email address" {...register('email')} />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="city">Country</FormLabel>
                    <SelectController
                      id="country"
                      placeholder="Country"
                      modelToView={(value: string) => countries.find((v) => v.value === value)}
                      viewToModel={(option: { value: string; label: string }) => option.value}
                      isDisabled
                      options={countries}
                      name="country"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="city">City</FormLabel>
                    <SelectController
                      id="city"
                      placeholder="City"
                      options={cityOptions}
                      onChange={() => {
                        setValue('district', null);
                        setValue('ward', null);
                      }}
                      name="city"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="district">District</FormLabel>
                    <SelectController
                      isDisabled={!city}
                      id="district"
                      placeholder="District"
                      name="district"
                      options={districtOptions}
                      onChange={() => {
                        setValue('ward', null);
                      }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="ward">Ward</FormLabel>
                    <SelectController
                      isDisabled={!district}
                      id="ward"
                      name="ward"
                      placeholder="Ward"
                      options={wardOptions}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="address">Address</FormLabel>
                    <Input id="address" placeholder="Address" {...register('address1')} />
                  </FormControl>
                </Stack>
              </Card>
              {/* <Card background="white" padding="5">
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
              </Card> */}

              <Card background="white" padding="5">
                <Stack flex="1" spacing={{ base: '4', md: '8' }}>
                  <Heading fontSize="2xl" fontWeight="extrabold" mb="4">
                    Payment Methods
                  </Heading>
                  <Controller
                    control={control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <RadioGroup {...field}>
                        <Stack direction="row">
                          <Radio flex="1" value="payInCash" size="lg">
                            <Stack spacing="0">
                              <Box as="span" fontSize="lg" fontWeight="semibold">
                                Pay in cash
                              </Box>
                              <Box as="span" color={colorMode('gray.600', 'gray.400')}>
                                Pay when receiving the orders
                              </Box>
                            </Stack>
                          </Radio>
                          <Radio flex="1" value="creditCard" size="lg">
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
                    )}
                  ></Controller>
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
                          {cartItems.map((item) => (
                            <CartItemComponent key={item.id} {...item} mode="view" />
                          ))}
                        </Stack>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                  <Divider />
                  <OrderSummaryItem label="Subtotal" value={formatPrice(totalOfCartItem)} />
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
                      {formatPrice(totalOfCartItem)}
                    </Text>
                  </Flex>
                  <Button type="submit" colorScheme="blue" size="lg" fontSize="md">
                    Place order
                  </Button>
                </Stack>
              </Card>
            </Stack>
          </Stack>
        </Box>
      </form>
    </FormProvider>
  );
};

export default PaymentPage;
