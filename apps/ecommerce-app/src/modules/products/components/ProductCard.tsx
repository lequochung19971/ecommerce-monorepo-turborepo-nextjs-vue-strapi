import { Badge, Box, Card, chakra, Flex, Icon, Image, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { FiShoppingCart } from 'react-icons/fi';

import type { Product } from '../types/product';

interface RatingProps {
  rating: number;
  numReviews: number;
}

function Rating({ rating, numReviews }: RatingProps) {
  return (
    <Box display="flex" alignItems="center">
      {Array(5)
        .fill('')
        .map((_, i) => {
          const roundedRating = Math.round(rating * 2) / 2;
          if (roundedRating - i >= 1) {
            return <BsStarFill key={i} style={{ marginLeft: '1' }} color={i < rating ? 'teal.500' : 'gray.300'} />;
          }
          if (roundedRating - i === 0.5) {
            return <BsStarHalf key={i} style={{ marginLeft: '1' }} />;
          }
          return <BsStar key={i} style={{ marginLeft: '1' }} />;
        })}
      <Box as="span" ml="2" color="gray.600" fontSize="xs">
        {numReviews} review{numReviews > 1 && 's'}
      </Box>
    </Box>
  );
}
type ProductCardProps = {
  data: Product;
};
export const ProductCard: React.FunctionComponent<ProductCardProps> = (props) => {
  const { data } = props;
  return (
    <Card bg={useColorModeValue('white', 'gray.800')} shadow="lg" position="relative" w="full">
      <Box height={400}>
        <Image
          objectFit="contain"
          width="full"
          height="full"
          src={`${process.env.NEXT_PUBLIC_API_URL}${data.media?.[0].url}`}
          alt={`Picture of ${data.name}`}
          roundedTop="md"
        />
      </Box>

      <Box p="4">
        <Box display="flex" alignItems="baseline">
          {true && (
            <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="red">
              New
            </Badge>
          )}
        </Box>

        <Flex mt="1" justifyContent="space-between" alignContent="center">
          <Box fontSize="xl" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
            {data.name}
          </Box>
          <Tooltip label="Add to cart" placement={'top'}>
            <chakra.a href={'#'} display={'flex'}>
              <Icon as={FiShoppingCart} h={7} w={7} alignSelf={'center'} />
            </chakra.a>
          </Tooltip>
        </Flex>

        <Flex justifyContent="space-between" alignContent="center">
          <Rating rating={4} numReviews={10} />
          <Box fontSize="xl" color={useColorModeValue('gray.800', 'white')}>
            <Box as="span" color={'gray.600'} fontSize="lg">
              £
            </Box>
            {(+data.price).toFixed(2)}
          </Box>
        </Flex>
      </Box>
    </Card>
  );
};

export default ProductCard;
