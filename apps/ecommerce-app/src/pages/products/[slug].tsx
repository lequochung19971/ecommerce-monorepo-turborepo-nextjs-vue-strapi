import { Box, Card, Flex, Heading, Stack } from '@chakra-ui/react';
import type { Props } from 'chakra-react-select';
import { Select } from 'chakra-react-select';
import type { GetServerSideProps, NextPage } from 'next';
import useSWR, { SWRConfig, unstable_serialize } from 'swr';

import { ApiUrl, httpClient, httpMethods } from '@/common/http';
import { httpFetcher } from '@/common/http/httpFetcher';
import type { Category, Product } from '@/modules/products';
import { ProductCard } from '@/modules/products/components';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const response = await httpClient.get(ApiUrl.PRODUCTS, {
    params: {
      filters: {
        categories: {
          slug: {
            $eq: params?.slug,
          },
        },
      },
    },
  });
  return {
    props: {
      params,
      fallback: {
        [unstable_serialize(
          httpMethods.get(ApiUrl.PRODUCTS, {
            params: {
              filters: {
                categories: {
                  slug: {
                    $eq: params?.slug,
                  },
                },
              },
            },
          }),
        )]: response.data,
      },
    },
  };
};

type ProductsCategoryPage = {
  params: Record<string, string>;
};

const ProductsCategory: NextPage<ProductsCategoryPage> = ({ params }) => {
  const { data } = useSWR(
    httpMethods.get(ApiUrl.PRODUCTS, {
      params: {
        populate: '*',
        filters: {
          categories: {
            slug: {
              $eq: params?.slug,
            },
          },
        },
      },
    }),
    httpFetcher<{
      data: Product[];
    }>(),
  );
  const { data: categoriesResponse } = useSWR(
    httpMethods.get(ApiUrl.CATEGORIES, {
      params: {
        filters: {
          parentCategory: {
            slug: params?.slug,
          },
        },
        populate: ['childCategories'],
      },
    }),
    httpFetcher<{
      data: Category[];
    }>(),
  );

  const categoryDataSource =
    categoriesResponse?.data.map((c) => ({
      ...c,
      value: c.id,
      label: c.name,
    })) ?? [];

  const sortDataSource = [
    {
      value: 'newest',
      label: 'Newest',
    },
  ];

  return (
    <Box p="8">
      <Heading fontSize="2xl" fontWeight="extrabold" mb="4" w="full">
        Product
      </Heading>
      <Card background="white" p="4">
        <Stack spacing={4} direction="row">
          <Box width={160}>
            <Select
              useBasicStyles
              placeholder="Category"
              options={categoryDataSource}
              classNamePrefix="app"
              size="md"
            />
          </Box>
          <Box width={160}>
            <Select
              useBasicStyles
              defaultValue={sortDataSource[0].value}
              options={sortDataSource as Props['options']}
              classNamePrefix="app"
              size="md"
            />
          </Box>
        </Stack>
      </Card>
      <Flex flexWrap="wrap" justifyContent="center" marginX={-4}>
        {data?.data.map((product) => (
          <Flex
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
      <ProductsCategory {...restProps} />
    </SWRConfig>
  );
}
