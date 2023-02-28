import type { NextApiRequest, NextApiResponse } from 'next';
import type { AuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { ApiUrl, httpClient } from '@/common/http';
import type { UserLoginResponse } from '@/modules/auth';
import { AuthProvider } from '@/modules/auth/enums';

const options: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'test@mail.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // eslint-disable-next-line no-useless-catch
        try {
          const { data } = await httpClient.post<UserLoginResponse>(ApiUrl.AUTH_LOCAL, {
            identifier: credentials?.email,
            password: credentials?.password,
          });
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.username,
            accessToken: data.jwt,
          };
          // eslint-disable-next-line no-useless-catch
        } catch (e) {
          throw e;
          // console.log('caught error');
          // const errorMessage = e.response.data.message
          // Redirecting to the login page with error message          in the URL
          // throw new Error(errorMessage + '&email=' + credentials.email)
        }
      },
    }),
  ],
  pages: {
    // signIn: '/auth/signIn',
    // signOut: '/auth/signOut',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/signUp', // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  callbacks: {
    // Getting the JWT token from API response
    jwt: async (response) => {
      const { token, user, account } = response;
      const isSignIn = !!user;
      const updatedToken = token;
      if (isSignIn) {
        switch (account?.provider) {
          case AuthProvider.GOOGLE: {
            const { data } = await httpClient.get<UserLoginResponse>(
              `${ApiUrl.AUTH_GOOGLE_CALLBACK}?access_token=${account?.access_token}`,
            );
            updatedToken.accessToken = data.jwt;
            updatedToken.id = data.user?.id;
            updatedToken.name = data.user?.username;
            updatedToken.email = data.user?.email;
            break;
          }

          default: {
            // CREDENTIALS
            updatedToken.accessToken = user?.accessToken;
            updatedToken.id = user?.id;
            updatedToken.name = user?.name;
            updatedToken.email = user?.email;
            break;
          }
        }
      }
      return Promise.resolve(updatedToken);
    },

    // session: async ({ session, user }) => {
    //   session.jwt = user?.jwt;
    //   session.id = user?.user?.id;
    //   return Promise.resolve(session);
    // },
  },
};

const nextAuth = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);
export default nextAuth;
// export default NextAuth(options);
