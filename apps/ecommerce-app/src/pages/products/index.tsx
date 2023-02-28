import { Box, Flex, Heading } from '@chakra-ui/react';
import type { GetServerSideProps, NextPage } from 'next';
import useSWR, { SWRConfig, unstable_serialize } from 'swr';

import { ApiUrl, httpClient, httpMethods } from '@/common/http';
import { httpFetcher } from '@/common/http/httpFetcher';
import { ProductCard } from '@/modules/products/components';
import type { Product } from '@/modules/products/types';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const response = await httpClient.get(ApiUrl.PRODUCTS, {
    params: {
      populate: '*',
    },
  });
  return {
    props: {
      fallback: {
        [unstable_serialize(
          httpMethods.get(ApiUrl.PRODUCTS, {
            params: {
              populate: '*',
            },
          }),
        )]: response.data,
      },
    },
  };
};

type ProductsCategoryPage = {};
const ProductsPage: NextPage<ProductsCategoryPage> = () => {
  const { data } = useSWR(
    httpMethods.get(ApiUrl.PRODUCTS, {
      params: {
        populate: '*',
      },
    }),
    httpFetcher<{
      data: Product[];
    }>(),
  );
  return (
    <Box p="8">
      <Heading fontSize="2xl" fontWeight="extrabold" mb="4" w="full" ml="4">
        Shopping Cart ({data?.data.length ?? 0} items)
      </Heading>
      <Flex flexWrap="wrap" w="full" justifyContent="center">
        {data?.data.map((product) => (
          <Flex
            w="full"
            key={product.id}
            alignItems="center"
            justifyContent="center"
            padding="4"
            width={{ base: '100%', md: '50%', lg: '25%' }}
          >
            <ProductCard data={product} />
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};

export default function Page({ fallback, ...restProps }: any) {
  return (
    <SWRConfig
      value={{
        fallback,
      }}
    >
      <ProductsPage {...restProps} />
    </SWRConfig>
  );
}
