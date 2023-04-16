import { Box, Image, Stack, Text } from '@chakra-ui/react';
import * as React from 'react';

export type CartProductMetaProps = {
  name: string;
  image: string;
  mode?: 'view' | 'edit';
};

export const CartProductMeta = (props: CartProductMetaProps) => {
  const { image, name, mode = 'edit' } = props;
  return (
    <Stack direction="row" spacing="5" width="full">
      <Image
        rounded="lg"
        width="120px"
        height="120px"
        fit="cover"
        src={image}
        alt={name}
        draggable="false"
        loading="lazy"
      />
      <Box pt="4">
        <Stack spacing="0.5">
          <Text fontWeight="medium">{name}</Text>
          {/* <Text color={colorMode('gray.600', 'gray.400')} fontSize="sm">
            {description}
          </Text> */}
        </Stack>
        {/* {isGiftWrapping && mode === 'edit' && (
          <HStack spacing="1" mt="3" color={colorMode('gray.600', 'gray.400')}>
            <Icon as={FiGift} boxSize="4" />
            <Link fontSize="sm" textDecoration="underline">
              Add gift wrapping
            </Link>
          </HStack>
        )} */}
      </Box>
    </Stack>
  );
};

export default CartProductMeta;
