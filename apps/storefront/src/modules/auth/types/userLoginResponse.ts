export type UserLoginResponse = {
  jwt: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
};
