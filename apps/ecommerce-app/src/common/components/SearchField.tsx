import type { InputGroupProps, InputProps } from '@chakra-ui/react';
import { IconButton, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { throttle } from 'lodash';
import { useRef } from 'react';
import { FaSearch } from 'react-icons/fa';

type SearchFieldProps = InputProps & {
  timeout?: number;
  inputGroupProps?: InputGroupProps;
};
export const SearchField: React.FunctionComponent<SearchFieldProps> = ({
  onChange,
  timeout = 250,
  inputGroupProps = {},
  ...restProps
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const onChangeThrottle = useRef(onChange && throttle(onChange, timeout));
  return (
    <InputGroup {...inputGroupProps} transition="width 0.25s ease">
      <InputRightElement>
        <IconButton variant="link" icon={<FaSearch />} aria-label="search" onClick={() => inputRef.current?.focus()} />
      </InputRightElement>
      <Input {...restProps} ref={inputRef} onChange={onChangeThrottle.current} />
    </InputGroup>
  );
};

export default SearchField;
