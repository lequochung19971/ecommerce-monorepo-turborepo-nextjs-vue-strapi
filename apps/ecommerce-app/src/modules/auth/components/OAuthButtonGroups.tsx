import { Button, ButtonGroup, VisuallyHidden } from '@chakra-ui/react';

import { AuthProvider } from '../enums';
import { GoogleIcon } from './ProviderIcons';

const providers = [
  { value: AuthProvider.GOOGLE, name: 'Google', icon: <GoogleIcon boxSize="5" /> },
  // { value: AuthProvider.GITHUB, name: 'Facebook', icon: <FacebookIcon boxSize="5" /> },
];
type OAuthButtonGroupProps = {
  onGoogleSignIn?: () => void;
  onFacebookSignIn?: () => void;
};

export const OAuthButtonGroup: React.FunctionComponent<OAuthButtonGroupProps> = (props) => {
  const { onGoogleSignIn, onFacebookSignIn } = props;

  return (
    <ButtonGroup variant="outline" spacing="4" width="full">
      {providers.map(({ value, name, icon }) => (
        <Button
          key={name}
          onClick={() => {
            switch (value) {
              case AuthProvider.GOOGLE: {
                onGoogleSignIn?.();
                break;
              }

              case AuthProvider.FACEBOOK: {
                onFacebookSignIn?.();
                break;
              }
              default:
                break;
            }
          }}
          width="full"
        >
          <VisuallyHidden>Sign in with {name}</VisuallyHidden>
          {icon}
        </Button>
      ))}
    </ButtonGroup>
  );
};
