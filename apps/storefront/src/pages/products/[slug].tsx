import { Box, Card, Flex, Heading, Stack } from '@chakra-ui/react';
import type { Props, SingleValue } from 'chakra-react-select';
import { Select } from 'chakra-react-select';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import useSWR, { SWRConfig, unstable_serialize } from 'swr';
import useSWRInfinite from 'swr/infinite';

import { AppRoute } from '@/common/enums';
import { ApiUrl, getCategoriesEndpoint, getCategoryBySlugEndpoint, httpMethods } from '@/common/http';
import { getProductsEndpoint } from '@/common/http/endpoints/product';
import { httpFetcher } from '@/common/http/httpFetcher';
import type { Category, Product } from '@/modules/products';
import { ProductCard } from '@/modules/products/components';
type QueryParams = {
  slug: string;
  page?: number;
};

const generateGetProductsParams = ({ slug, page = 1 }: QueryParams) => {
  return {
    populate: '*',
    filters: {
      $or: [
        {
          categories: {
            slug: {
              $eq: slug,
            },
          },
        },
        {
          categories: {
            parentCategory: {
              slug: {
                $eq: slug,
              },
            },
          },
        },
      ],
    },
    pagination: {
      page,
      pageSize: 5,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async ({}) => {
  try {
    console.log('Hung Dep Trai');
    const childCategories = await getCategoriesEndpoint<{ data: Category[] }>({
      params: {
        populate: {
          0: 'childCategories',
          1: 'childCategories.childCategories',
        },
      },
    });
    console.log('childCategories', childCategories);

    const flattenCategories = childCategories.data.data.reduce((result, category) => {
      result.push(category);
      if (category.childCategories?.length) {
        result.push(...category.childCategories);
      }

      return result;
    }, [] as Category[]);

    return {
      paths: flattenCategories.map((d) => {
        return {
          params: {
            slug: d.slug,
          },
        };
      }),
      fallback: false,
    };
  } catch (error) {
    throw error;
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  console.log('getStaticProps');

  const response = await getProductsEndpoint({
    params: generateGetProductsParams({
      slug: params?.slug as string,
    }),
  });
  console.log('getStaticProps response', response);

  const categoryResponse = await getCategoryBySlugEndpoint(params?.slug as string);
  console.log('getCategoryBySlugEndpoint', categoryResponse);

  return {
    props: {
      params,
      category: categoryResponse.data,
      initialProducts: response.data.data,
      fallback: {
        [unstable_serialize(
          httpMethods.get(ApiUrl.PRODUCTS, {
            params: generateGetProductsParams({
              slug: params?.slug as string,
            }),
          }),
        )]: response.data,
      },
    },
  };
};

type ProductsCategoryPageProps = {
  params: {
    slug: string;
  };
  category?: Category;
  initialProducts: Product[];
};

const defaultQueryParams: QueryParams = {
  slug: '',
  page: 1,
};

const ProductsCategory: NextPage<ProductsCategoryPageProps> = ({ params, category, initialProducts }) => {
  const [queryParams, setQueryParams] = useState(() => ({
    ...defaultQueryParams,
    slug: params.slug,
  }));

  const upsertQueryParams = (qp = {} as Partial<QueryParams>) => {
    setQueryParams((prev) => ({ ...prev, ...qp }));
  };

  const router = useRouter();
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

  const currentCategory = categoryDataSource.find((c) => c.id === category?.id);

  const handleCategoryOnChange = (newValue: SingleValue<Category>) => {
    router.push(`${AppRoute.PRODUCTS}/${newValue?.slug}`);
  };

  const renderLoader = () => {
    if (isLoading) {
      return <h4>Loading...</h4>;
    }
    return null;
  };

  return (
    <InfiniteScroll
      dataLength={data?.length ?? 0}
      next={() => {
        setSize((prev) => prev + 1);
      }}
      hasMore
      loader={renderLoader()}
    >
      <Box p="8">
        <Heading fontSize="2xl" fontWeight="extrabold" mb="4" w="full">
          {category?.name}
        </Heading>
        <Card background="white" p="4">
          <Stack spacing={4} direction="row">
            {categoryDataSource.length && (
              <Box width={160}>
                <Select
                  value={currentCategory}
                  useBasicStyles
                  placeholder="Category"
                  options={categoryDataSource}
                  classNamePrefix="app"
                  onChange={handleCategoryOnChange}
                  size="md"
                />
              </Box>
            )}

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
          {products?.map((product: Product) => (
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
      <ProductsCategory {...restProps} />
    </SWRConfig>
  );
}
