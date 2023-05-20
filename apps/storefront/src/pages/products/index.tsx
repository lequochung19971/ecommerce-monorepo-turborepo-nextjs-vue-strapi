// import { Box, Flex, Heading } from '@chakra-ui/react';
// import type { GetStaticProps, NextPage } from 'next';
// import { useEffect, useState } from 'react';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import { SWRConfig, unstable_serialize } from 'swr';
// import useSWRInfinite from 'swr/infinite';

// import { ApiUrl, getCategoriesEndpoint, getProductsEndpoint, httpMethods } from '@/common/http';
// import { httpFetcher } from '@/common/http/httpFetcher';
// import { ProductCard } from '@/modules/products/components';
// import type { Category, Product } from '@/modules/products/types';
// import type { ProductQueryParams } from '@/modules/products/types/productQueryParams';

// const generateGetProductsParams = ({ page = 1 }: ProductQueryParams) => {
//   return {
//     populate: '*',
//     pagination: {
//       page,
//       pageSize: 5,
//     },
//   };
// };

// // export const getStaticPaths: GetStaticPaths = async ({}) => {
// //   return {
// //     paths: ['all'],
// //     fallback: false,
// //   };
// // };

// export const getStaticProps: GetStaticProps = async () => {
//   const response = await getProductsEndpoint({
//     params: generateGetProductsParams({ page: 1 }),
//   });

//   const categoriesResponse = await getCategoriesEndpoint<{ data: Category[] }>({
//     params: {
//       populate: {
//         0: 'childCategories',
//         1: 'childCategories.childCategories',
//       },
//     },
//   });

//   return {
//     props: {
//       categories: categoriesResponse.data.data,
//       initialProducts: response.data.data,
//       fallback: {
//         [unstable_serialize(
//           httpMethods.get(ApiUrl.PRODUCTS, {
//             params: {
//               populate: '*',
//             },
//           }),
//         )]: response.data,
//       },
//     },
//   };
// };

// const defaultQueryParams: ProductQueryParams = {
//   page: 1,
// };

// type ProductsCategoryPage = {
//   categories: Category[];
//   initialProducts: Product[];
// };
// const ProductsPage: NextPage<ProductsCategoryPage> = ({ initialProducts }) => {
//   const [queryParams, setQueryParams] = useState(() => defaultQueryParams);
//   const [isFetching, setIsFetching] = useState(false);
//   // const { data } = useSWR(
//   //   httpMethods.get(ApiUrl.PRODUCTS, {
//   //     params: {
//   //       populate: '*',
//   //     },
//   //   }),
//   //   httpFetcher<{
//   //     data: Product[];
//   //   }>(),
//   // );
//   const {
//     data = [],
//     setSize,
//     isLoading,
//   } = useSWRInfinite(
//     (index: number, previousPageData) => {
//       if (previousPageData && !previousPageData?.data?.length) return null;

//       return httpMethods.get(ApiUrl.PRODUCTS, {
//         params: generateGetProductsParams({
//           ...queryParams,
//           page: index + 1,
//         }),
//       }); // SWR key
//     },
//     httpFetcher<{ data: Product[] }>(),
//     {
//       fallbackData: [
//         {
//           data: initialProducts,
//         },
//       ],
//     },
//   );

//   const products = data.reduce((res, d) => {
//     return res.concat(d.data);
//   }, [] as Product[]);

//   const renderLoader = () => {
//     if (isFetching) {
//       return <h4>Loading...</h4>;
//     }
//     return null;
//   };

//   useEffect(() => {
//     if (data.length) {
//       setIsFetching(false);
//     }
//   }, [data]);

//   return (
//     <InfiniteScroll
//       dataLength={data?.length ?? 0}
//       next={() => {
//         setIsFetching(true);
//         setSize((prev) => prev + 1);
//       }}
//       hasMore
//       loader={renderLoader()}
//     >
//       <Box p="8">
//         <Heading fontSize="2xl" fontWeight="extrabold" mb="4" w="full" ml="4">
//           Shopping Cart ({products.length ?? 0} items)
//         </Heading>
//         <Flex flexWrap="wrap" w="full" justifyContent="center">
//           {products.map((product) => (
//             <Flex
//               w="full"
//               key={product?.id}
//               alignItems="center"
//               justifyContent="center"
//               padding="4"
//               width={{ base: '100%', md: '50%', lg: 100 / 3 + '%', xl: 100 / 4 + '%' }}
//             >
//               <ProductCard data={product} />
//             </Flex>
//           ))}
//         </Flex>
//       </Box>
//     </InfiniteScroll>
//   );
// };

// export default function Page({ fallback, ...restProps }: any) {
//   return (
//     <SWRConfig
//       value={{
//         fallback,
//       }}
//     >
//       <ProductsPage {...restProps} />
//     </SWRConfig>
//   );
// }
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  Textarea,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { BsDiscord, BsGithub, BsPerson } from 'react-icons/bs';
import { MdEmail, MdFacebook, MdLocationOn, MdOutlineEmail, MdPhone } from 'react-icons/md';

export default function contact() {
  return (
    <Container bg="#9DC4FB" maxW="full" mt={0} centerContent overflow="hidden" height="full" justifyContent="center">
      <Box bg="#02054B" color="white" borderRadius="lg" m={{ sm: 4, md: 16, lg: 8 }} p={{ sm: 5, md: 5, lg: 16 }}>
        <Box p={4}>
          <Wrap spacing={{ base: 20, sm: 3, md: 5, lg: 20 }}>
            <WrapItem>
              <Box>
                <Heading>Contact</Heading>
                <Text mt={{ sm: 3, md: 3, lg: 5 }} color="gray.500">
                  Fill up the form below to contact
                </Text>
                <Box py={{ base: 5, sm: 5, md: 8, lg: 10 }}>
                  <VStack pl={0} spacing={3} alignItems="flex-start">
                    <Button
                      size="md"
                      height="48px"
                      width="200px"
                      variant="ghost"
                      color="#DCE2FF"
                      _hover={{ border: '2px solid #3182ce' }}
                      _active={{ color: '#3182ce' }}
                      leftIcon={<MdPhone color="#3182ce" size="20px" />}
                    >
                      +91-988888888
                    </Button>
                    <Button
                      size="md"
                      height="48px"
                      width="200px"
                      variant="ghost"
                      color="#DCE2FF"
                      _hover={{ border: '2px solid #3182ce' }}
                      leftIcon={<MdEmail color="#3182ce" size="20px" />}
                      _active={{ color: '#3182ce' }}
                    >
                      hello@abc.com
                    </Button>
                    <Button
                      size="md"
                      height="48px"
                      width="200px"
                      variant="ghost"
                      color="#DCE2FF"
                      _hover={{ border: '2px solid #3182ce' }}
                      _active={{ color: '#3182ce' }}
                      leftIcon={<MdLocationOn color="#3182ce" size="20px" />}
                    >
                      Karnavati, India
                    </Button>
                  </VStack>
                </Box>
                <HStack mt={{ lg: 10, md: 10 }} spacing={5} px={5} alignItems="flex-start">
                  <IconButton
                    aria-label="facebook"
                    variant="ghost"
                    size="lg"
                    isRound={true}
                    _hover={{ bg: '#3182ce' }}
                    icon={<MdFacebook size="28px" />}
                  />
                  <IconButton
                    aria-label="github"
                    variant="ghost"
                    size="lg"
                    isRound={true}
                    _hover={{ bg: '#3182ce' }}
                    icon={<BsGithub size="28px" />}
                  />
                  <IconButton
                    aria-label="discord"
                    variant="ghost"
                    size="lg"
                    isRound={true}
                    _hover={{ bg: '#3182ce' }}
                    icon={<BsDiscord size="28px" />}
                  />
                </HStack>
              </Box>
            </WrapItem>
            <WrapItem>
              <Box bg="white" borderRadius="lg">
                <Box m={8} color="#0B0E3F">
                  <VStack spacing={5}>
                    <FormControl id="name">
                      <FormLabel>Your Name</FormLabel>
                      <InputGroup borderColor="#E0E1E7">
                        <InputLeftElement pointerEvents="none">
                          <BsPerson color="gray.800" />
                        </InputLeftElement>
                        <Input type="text" size="md" />
                      </InputGroup>
                    </FormControl>
                    <FormControl id="name">
                      <FormLabel>Mail</FormLabel>
                      <InputGroup borderColor="#E0E1E7">
                        <InputLeftElement pointerEvents="none">
                          <MdOutlineEmail color="gray.800" />
                        </InputLeftElement>
                        <Input type="text" size="md" />
                      </InputGroup>
                    </FormControl>
                    <FormControl id="name">
                      <FormLabel>Message</FormLabel>
                      <Textarea
                        borderColor="gray.300"
                        _hover={{
                          borderRadius: 'gray.300',
                        }}
                        placeholder="message"
                      />
                    </FormControl>
                    <FormControl id="name" float="right">
                      <Button variant="solid" colorScheme="blue" color="white">
                        Send Message
                      </Button>
                    </FormControl>
                  </VStack>
                </Box>
              </Box>
            </WrapItem>
          </Wrap>
        </Box>
      </Box>
    </Container>
  );
}
