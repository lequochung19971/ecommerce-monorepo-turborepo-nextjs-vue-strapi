import type { FormControlProps, InputProps } from '@chakra-ui/react';
import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
  useMergeRefs,
} from '@chakra-ui/react';
import * as React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

type PasswordFieldProps = InputProps & {
  label?: string;
} & Pick<FormControlProps, 'isRequired'>;
export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>((props, ref) => {
  const { label = 'Password', isRequired, ...restProps } = props;
  const { isOpen, onToggle } = useDisclosure();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const mergeRef = useMergeRefs(inputRef, ref);
  const onClickReveal = () => {
    onToggle();
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  };

  return (
    <FormControl isRequired={isRequired}>
      <FormLabel htmlFor="password">{label}</FormLabel>
      <InputGroup>
        <InputRightElement>
          <IconButton
            variant="link"
            aria-label={isOpen ? 'Mask password' : 'Reveal password'}
            icon={isOpen ? <FaEyeSlash /> : <FaEye />}
            onClick={onClickReveal}
          />
        </InputRightElement>
        <Input
          id={label.toLowerCase()}
          ref={mergeRef}
          type={isOpen ? 'text' : 'password'}
          autoComplete="current-password"
          required
          {...restProps}
        />
      </InputGroup>
    </FormControl>
  );
});

PasswordField.displayName = 'PasswordField';
