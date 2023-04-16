import { Box, Flex, Heading } from '@chakra-ui/react';
import type { GetStaticProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { SWRConfig, unstable_serialize } from 'swr';
import useSWRInfinite from 'swr/infinite';

import { ApiUrl, getCategoriesEndpoint, getProductsEndpoint, httpMethods } from '@/common/http';
import { httpFetcher } from '@/common/http/httpFetcher';
import { ProductCard } from '@/modules/products/components';
import type { Category, Product } from '@/modules/products/types';
import type { ProductQueryParams } from '@/modules/products/types/productQueryParams';

const generateGetProductsParams = ({ page = 1 }: ProductQueryParams) => {
  return {
    populate: '*',
    pagination: {
      page,
      pageSize: 5,
    },
  };
};

// export const getStaticPaths: GetStaticPaths = async ({}) => {
//   return {
//     paths: ['all'],
//     fallback: false,
//   };
// };

export const getStaticProps: GetStaticProps = async () => {
  const response = await getProductsEndpoint({
    params: generateGetProductsParams({ page: 1 }),
  });

  const categoriesResponse = await getCategoriesEndpoint<{ data: Category[] }>({
    params: {
      populate: {
        0: 'childCategories',
        1: 'childCategories.childCategories',
      },
    },
  });

  return {
    props: {
      categories: categoriesResponse.data.data,
      initialProducts: response.data.data,
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

const defaultQueryParams: ProductQueryParams = {
  page: 1,
};

type ProductsCategoryPage = {
  categories: Category[];
  initialProducts: Product[];
};
const ProductsPage: NextPage<ProductsCategoryPage> = ({ initialProducts }) => {
  const [queryParams, setQueryParams] = useState(() => defaultQueryParams);
  const [isFetching, setIsFetching] = useState(false);
  // const { data } = useSWR(
  //   httpMethods.get(ApiUrl.PRODUCTS, {
  //     params: {
  //       populate: '*',
  //     },
  //   }),
  //   httpFetcher<{
  //     data: Product[];
  //   }>(),
  // );
  const {
    data = [],
    setSize,
    isLoading,
  } = useSWRInfinite(
    (index: number, previousPageData) => {
      if (previousPageData && !previousPageData?.data?.length) return null;

      return httpMethods.get(ApiUrl.PRODUCTS, {
        params: generateGetProductsParams({
          ...queryParams,
          page: index + 1,
        }),
      }); // SWR key
    },
    httpFetcher<{ data: Product[] }>(),
    {
      fallbackData: [
        {
          data: initialProducts,
        },
      ],
    },
  );

  const products = data.reduce((res, d) => {
    return res.concat(d.data);
  }, [] as Product[]);

  const renderLoader = () => {
    if (isFetching) {
      return <h4>Loading...</h4>;
    }
    return null;
  };

  useEffect(() => {
    if (data.length) {
      setIsFetching(false);
    }
  }, [data]);

  return (
    <InfiniteScroll
      dataLength={data?.length ?? 0}
      next={() => {
        setIsFetching(true);
        setSize((prev) => prev + 1);
      }}
      hasMore
      loader={renderLoader()}
    >
      <Box p="8">
        <Heading fontSize="2xl" fontWeight="extrabold" mb="4" w="full" ml="4">
          Shopping Cart ({products.length ?? 0} items)
        </Heading>
        <Flex flexWrap="wrap" w="full" justifyContent="center">
          {products.map((product) => (
            <Flex
              w="full"
              key={product?.id}
              alignItems="center"
              justifyContent="center"
              padding="4"
              width={{ base: '100%', md: '50%', lg: 100 / 3 + '%', xl: 100 / 4 + '%' }}
            >
              <ProductCard data={product} />
            </Flex>
          ))}
        </Flex>
      </Box>
    </InfiniteScroll>
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
