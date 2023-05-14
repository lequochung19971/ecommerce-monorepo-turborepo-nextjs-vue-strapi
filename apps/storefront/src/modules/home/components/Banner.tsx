import { Box, Image } from '@chakra-ui/react';
import styled from '@emotion/styled';
import type { ReactImageGalleryItem } from 'react-image-gallery';
import ImageGallery from 'react-image-gallery';

const Container = styled(Box)`
  width: 100%;

  .image-gallery {
    width: 100%;
  }

  .image-gallery-icon {
    opacity: 0.2;
    &:hover {
      color: white;
      opacity: 1;
    }
  }
`;
const images: ReactImageGalleryItem[] = [
  {
    original:
      'https://img.freepik.com/free-vector/mega-sale-banner-your-online-store-realistic-style-with-phone-map-cart-bag-gift-vector-illustration_548887-132.jpg?w=2000&t=st=1674053840~exp=1674054440~hmac=00d125045ab73a013b93e2b6696c53533bd962c34f3e1110f27835a098ab77b9',
    thumbnail:
      'https://img.freepik.com/free-vector/mega-sale-banner-your-online-store-realistic-style-with-phone-map-cart-bag-gift-vector-illustration_548887-132.jpg?w=2000&t=st=1674053840~exp=1674054440~hmac=00d125045ab73a013b93e2b6696c53533bd962c34f3e1110f27835a098ab77b9',
  },
  {
    original:
      'https://img.freepik.com/premium-psd/online-shop-banner-template-with-orange-background_434471-888.jpg?w=2000',
    thumbnail:
      'https://img.freepik.com/premium-psd/online-shop-banner-template-with-orange-background_434471-888.jpg?w=2000',
  },
  {
    original:
      'https://img.freepik.com/premium-psd/ramadan-kareem-sale-banner-template-with-3d-online-shopping-mobile-applications_106244-1472.jpg?w=2000',
    thumbnail:
      'https://img.freepik.com/premium-psd/ramadan-kareem-sale-banner-template-with-3d-online-shopping-mobile-applications_106244-1472.jpg?w=2000',
  },
];

export const Banner: React.FunctionComponent = () => {
  return (
    <Container>
      <ImageGallery
        items={images}
        additionalClass="test-hung"
        showPlayButton={false}
        renderItem={(item) => (
          <Box maxH="1000px" w="full">
            <Image src={item.original} width="full" alt="image" objectFit="cover" />
          </Box>
        )}
        showThumbnails={false}
        showFullscreenButton={false}
      />
    </Container>
  );
};

export default Banner;
