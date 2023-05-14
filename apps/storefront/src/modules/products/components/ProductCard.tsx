import type { ImageProps } from '@chakra-ui/react';
import { Box, Flex, Icon, Image, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { MdAddShoppingCart } from 'react-icons/md';
import useSWR from 'swr';

import { MotionBox, MotionCard } from '@/common/components';
import { useUser } from '@/common/hooks';
import { ApiUrl, httpMethods } from '@/common/http';
import { addProductToShoppingCartEndpoint } from '@/common/http/endpoints/shopping-session';
import { httpFetcher } from '@/common/http/httpFetcher';
import { PriceTag } from '@/modules/checkout';

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

const useHover = () => {
  const [isHover, setIsHover] = useState(false);

  return useMemo(
    () => ({
      onMouseEnter: () => setIsHover(true),
      onMouseLeave: () => setIsHover(false),
      isHover,
    }),
    [isHover],
  );
};

const MotionImage = motion<Omit<ImageProps, 'transition'>>(Image);

export const ProductCard: React.FunctionComponent<ProductCardProps> = (props) => {
  const { data } = props;
  const { isHover, ...hoverActions } = useHover();
  const currentUser = useUser();
  const amountOfMedias = data.media?.length ?? 0;
  const { data: itemsQuantity = 0, mutate } = useSWR(
    httpMethods.get(ApiUrl.SHOPPING_SESSION_ITEMS_QUANTITY),
    httpFetcher(),
  );
  const addProductToShoppingCart = async () => {
    await addProductToShoppingCartEndpoint({
      userId: currentUser?.id,
      productId: data.id,
    });
    mutate(itemsQuantity + 1, {
      rollbackOnError: true,
    });
  };

  const renderImage = () => {
    if (amountOfMedias > 1) {
      return (
        <>
          {isHover ? (
            <MotionImage
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.5,
              }}
              objectFit="contain"
              width="full"
              height="full"
              src={`${process.env.NEXT_PUBLIC_API_URL}${data.media?.[0].url}`}
              alt={`Picture of ${data.name}`}
              roundedTop="md"
            />
          ) : (
            <MotionImage
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.5,
              }}
              objectFit="contain"
              width="full"
              height="full"
              src={`${process.env.NEXT_PUBLIC_API_URL}${data.media?.[1].url}`}
              alt={`Picture of ${data.name}`}
              roundedTop="md"
            />
          )}
        </>
      );
    }

    return (
      <MotionImage
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.5,
        }}
        objectFit="contain"
        width="full"
        height="full"
        src={`${process.env.NEXT_PUBLIC_API_URL}${data.media?.[0].url}`}
        alt={`Picture of ${data.name}`}
        roundedTop="md"
      />
    );
  };

  return (
    <MotionCard
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
      whileHover={{ scale: 1.02 }}
      shadow="lg"
      position="relative"
      w="full"
      bg={useColorModeValue('white', 'gray.800')}
    >
      <Box height={400} position="relative" {...hoverActions} role="group">
        {renderImage()}

        {isHover && (
          <Tooltip label="Add to cart" placement="top">
            <MotionBox
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              boxShadow="lg"
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 17,
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 1 }}
              sx={{
                cursor: 'pointer',
                _groupHover: { display: 'flex' },
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                height: '3.5rem',
                width: '3.5rem',
                borderRadius: '30px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'gray.50',
              }}
              onClick={addProductToShoppingCart}
            >
              <Icon as={MdAddShoppingCart} h={7} w={7} />
            </MotionBox>
          </Tooltip>
        )}
      </Box>

      <Box p="5">
        {/* <Box display="flex" alignItems="baseline">
          {true && (
            <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="red">
              New
            </Badge>
          )}
        </Box> */}

        <Flex mt="1" justifyContent="space-between" alignContent="center">
          <Tooltip label={data.name} placement={'top'}>
            <Box fontSize="xl" fontWeight="semibold" lineHeight="tight" isTruncated>
              {data.name}
            </Box>
          </Tooltip>
        </Flex>

        <Flex justifyContent="space-between" alignContent="center">
          {/* <Rating rating={4} numReviews={10} /> */}
          <PriceTag currency="VND" price={+data.price} />
          {/* <Box fontSize="xl" color={useColorModeValue('gray.800', 'white')}>
            {+data.price.toLocaleString()}
            <Box as="span" color={'gray.600'} fontSize="lg">
              ₫
            </Box>
          </Box> */}
        </Flex>
      </Box>
    </MotionCard>
  );
};

export default ProductCard;
