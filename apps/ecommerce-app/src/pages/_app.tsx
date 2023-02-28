import '../styles/globals.css';

import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import type { ReactElement } from 'react';
import MainLayout from 'src/layouts/MainLayout';

import { AppThemeProvider } from '@/common/components';
import type { NextPageWithLayout } from '@/common/types/next-auth/nextPageWithLayout';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const getDefaultLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? getDefaultLayout;
  return (
    <AppThemeProvider>
      <SessionProvider>{getLayout(<Component {...pageProps} />)}</SessionProvider>
    </AppThemeProvider>
  );
}

export default App;
