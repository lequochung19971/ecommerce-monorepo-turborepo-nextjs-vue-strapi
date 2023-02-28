import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { AppRoute } from '@/common/enums';
import type { NextPageWithLayout } from '@/common/types';

export const withAuth = (Component: NextPageWithLayout) => {
  const Auth: NextPageWithLayout = (props) => {
    const session = useSession();
    const router = useRouter();

    useEffect(() => {
      if (router.pathname === AppRoute.AUTH_SIGN_IN && session.data) {
        router.push(AppRoute.HOME);
      }
    }, [router, session.data]);

    // If user is logged in, return original component
    return <Component {...props} />;
  };

  // Copy getInitial props so it will run as well
  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  if (Component.getLayout) {
    Auth.getLayout = Component.getLayout;
  }

  return Auth;
};

export default withAuth;
