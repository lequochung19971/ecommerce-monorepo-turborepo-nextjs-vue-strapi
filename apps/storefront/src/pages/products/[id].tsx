import { Box, Card, Flex } from '@chakra-ui/react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { SWRConfig } from 'swr';

import { getProductEndpoint, getProductsEndpoint } from '@/common/http';

export const getStaticPaths: GetStaticPaths = async (a) => {
  const response = await getProductsEndpoint({
    params: {
      populate: '*',
      pagination: {
        limit: -1,
      },
    },
  });
  return {
    paths: response.data.data.map((product) => {
      return {
        params: {
          id: product.id.toString(),
        },
      };
    }),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params = {} }) => {
  const { id } = params;
  const response = await getProductEndpoint(id as string, {
    params: {
      populate: '*',
    },
  });
  console.log(response.data.data);
  return {
    props: {},
  };
};
const ProductDetailPage = () => {
  return (
    <Box p="8">
      <Card background="white" padding="5" w="100%" h="500px">
        <Flex direction="row" h="100%">
          <Box className="product-detail__gallery" flex="1">
            Gallery
          </Box>
          <Box className="product-detail__info" flex="1">
            Info
          </Box>
        </Flex>
      </Card>
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
      <ProductDetailPage {...restProps} />
    </SWRConfig>
  );
}
