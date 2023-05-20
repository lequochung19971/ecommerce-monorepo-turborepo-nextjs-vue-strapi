// import { Box, Card, Flex, Heading, Stack } from '@chakra-ui/react';
// import type { Props, SingleValue } from 'chakra-react-select';
// import { Select } from 'chakra-react-select';
// import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
// import { useRouter } from 'next/router';
// import { useState } from 'react';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import useSWR, { SWRConfig, unstable_serialize } from 'swr';
// import useSWRInfinite from 'swr/infinite';

// import { AppRoute } from '@/common/enums';
// import { ApiUrl, getCategoriesEndpoint, getCategoryBySlugEndpoint, httpMethods } from '@/common/http';
// import { getProductsEndpoint } from '@/common/http/endpoints/product';
// import { httpFetcher } from '@/common/http/httpFetcher';
// import type { Category, Product } from '@/modules/products';
// import { ProductCard } from '@/modules/products/components';
// type QueryParams = {
//   slug: string;
//   page?: number;
// };

// const generateGetProductsParams = ({ slug, page = 1 }: QueryParams) => {
//   return {
//     populate: '*',
//     filters: {
//       $or: [
//         {
//           categories: {
//             slug: {
//               $eq: slug,
//             },
//           },
//         },
//         {
//           categories: {
//             parentCategory: {
//               slug: {
//                 $eq: slug,
//               },
//             },
//           },
//         },
//       ],
//     },
//     pagination: {
//       page,
//       pageSize: 5,
//     },
//   };
// };

// export const getStaticPaths: GetStaticPaths = async ({}) => {
//   try {
//     console.log('Hung Dep Trai');
//     const childCategories = await getCategoriesEndpoint<{ data: Category[] }>({
//       params: {
//         populate: {
//           0: 'childCategories',
//           1: 'childCategories.childCategories',
//         },
//       },
//     });
//     console.log('childCategories', childCategories);

//     const flattenCategories = childCategories.data.data.reduce((result, category) => {
//       result.push(category);
//       if (category.childCategories?.length) {
//         result.push(...category.childCategories);
//       }

//       return result;
//     }, [] as Category[]);

//     return {
//       paths: flattenCategories.map((d) => {
//         return {
//           params: {
//             slug: d.slug,
//           },
//         };
//       }),
//       fallback: false,
//     };
//   } catch (error) {
//     throw error;
//   }
// };

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   console.log('getStaticProps');

//   const response = await getProductsEndpoint({
//     params: generateGetProductsParams({
//       slug: params?.slug as string,
//     }),
//   });
//   console.log('getStaticProps response', response);

//   const categoryResponse = await getCategoryBySlugEndpoint(params?.slug as string);
//   console.log('getCategoryBySlugEndpoint', categoryResponse);

//   return {
//     props: {
//       params,
//       category: categoryResponse.data,
//       initialProducts: response.data.data,
//       fallback: {
//         [unstable_serialize(
//           httpMethods.get(ApiUrl.PRODUCTS, {
//             params: generateGetProductsParams({
//               slug: params?.slug as string,
//             }),
//           }),
//         )]: response.data,
//       },
//     },
//   };
// };

// type ProductsCategoryPageProps = {
//   params: {
//     slug: string;
//   };
//   category?: Category;
//   initialProducts: Product[];
// };

// const defaultQueryParams: QueryParams = {
//   slug: '',
//   page: 1,
// };

// const ProductsCategory: NextPage<ProductsCategoryPageProps> = ({ params, category, initialProducts }) => {
//   const [queryParams, setQueryParams] = useState(() => ({
//     ...defaultQueryParams,
//     slug: params.slug,
//   }));

//   const upsertQueryParams = (qp = {} as Partial<QueryParams>) => {
//     setQueryParams((prev) => ({ ...prev, ...qp }));
//   };

//   const router = useRouter();
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

//   const { data: categoriesResponse } = useSWR(
//     httpMethods.get(ApiUrl.CATEGORIES, {
//       params: {
//         filters: {
//           parentCategory: {
//             slug: params?.slug,
//           },
//         },
//         populate: ['childCategories'],
//       },
//     }),
//     httpFetcher<{
//       data: Category[];
//     }>(),
//   );

//   const categoryDataSource =
//     categoriesResponse?.data.map((c) => ({
//       ...c,
//       value: c.id,
//       label: c.name,
//     })) ?? [];

//   const sortDataSource = [
//     {
//       value: 'newest',
//       label: 'Newest',
//     },
//   ];

//   const currentCategory = categoryDataSource.find((c) => c.id === category?.id);

//   const handleCategoryOnChange = (newValue: SingleValue<Category>) => {
//     router.push(`${AppRoute.PRODUCTS}/${newValue?.slug}`);
//   };

//   const renderLoader = () => {
//     if (isLoading) {
//       return <h4>Loading...</h4>;
//     }
//     return null;
//   };

//   return (
//     <InfiniteScroll
//       dataLength={data?.length ?? 0}
//       next={() => {
//         setSize((prev) => prev + 1);
//       }}
//       hasMore
//       loader={renderLoader()}
//     >
//       <Box p="8">
//         <Heading fontSize="2xl" fontWeight="extrabold" mb="4" w="full">
//           {category?.name}
//         </Heading>
//         <Card background="white" p="4">
//           <Stack spacing={4} direction="row">
//             {categoryDataSource.length && (
//               <Box width={160}>
//                 <Select
//                   value={currentCategory}
//                   useBasicStyles
//                   placeholder="Category"
//                   options={categoryDataSource}
//                   classNamePrefix="app"
//                   onChange={handleCategoryOnChange}
//                   size="md"
//                 />
//               </Box>
//             )}

//             <Box width={160}>
//               <Select
//                 useBasicStyles
//                 defaultValue={sortDataSource[0].value}
//                 options={sortDataSource as Props['options']}
//                 classNamePrefix="app"
//                 size="md"
//               />
//             </Box>
//           </Stack>
//         </Card>

//         <Flex flexWrap="wrap" justifyContent="center" marginX={-4}>
//           {products?.map((product: Product) => (
//             <Flex
//               key={product.id}
//               alignItems="center"
//               justifyContent="center"
//               padding="4"
//               width={{ base: '100%', md: '50%', lg: '25%' }}
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
//       <ProductsCategory {...restProps} />
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
