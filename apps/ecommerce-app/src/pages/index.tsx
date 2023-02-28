import { Box } from '@chakra-ui/react';
import type { GetServerSideProps } from 'next';

import { withAuth } from '@/common/HOCs';
import { Banner } from '@/modules/home/components';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

const Home: React.FunctionComponent = () => {
  return (
    <Box w="100%" height="100%">
      <Banner />
    </Box>
  );
};

export default withAuth(Home);
