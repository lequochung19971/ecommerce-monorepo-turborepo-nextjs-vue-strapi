import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Icon,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

import type { NavItem } from '@/common/types';

const DesktopSubNav = ({ label, href, subLabel, children }: NavItem) => {
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');
  return (
    <Popover trigger={'hover'} placement="left-start">
      <PopoverTrigger>
        <Link
          p={2}
          href={href}
          role={'group'}
          display={'block'}
          rounded={'md'}
          _hover={{ bg: useColorModeValue('blue.50', 'gray.900') }}
          className="app-desktop-sub-nav"
        >
          <Stack direction={'row'} align={'center'}>
            <Box>
              <Text transition={'all .3s ease'} _groupHover={{ color: 'blue.400' }} fontWeight={500}>
                {label}
              </Text>
              <Text fontSize={'sm'}>{subLabel}</Text>
            </Box>
            {!!children?.length && (
              <Flex
                transition={'all .3s ease'}
                transform={'translateX(-5px)'}
                opacity={0.5}
                _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
                justify={'flex-end'}
                align={'center'}
                flex={1}
              >
                <Icon _groupHover={{ color: 'blue.400' }} w={5} h={5} as={ChevronRightIcon} />
              </Flex>
            )}
          </Stack>
        </Link>
      </PopoverTrigger>
      {!!children?.length && (
        <PopoverContent border={0} boxShadow={'xl'} bg={popoverContentBgColor} minW={'xs'} p="2">
          <Box>
            {children.map((child) => (
              <DesktopSubNav key={child.label} {...child} />
            ))}
          </Box>
        </PopoverContent>
      )}
    </Popover>
  );
};

type DesktopNavProps = {
  items: NavItem[];
};

export const DesktopNav: React.FunctionComponent<DesktopNavProps> = ({ items }) => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');
  return (
    <Stack direction={'row'} className="app-desktop-nav">
      {items.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href ?? '#'}
                display="flex"
                alignItems="center"
                fontSize={'sm'}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
                {!!navItem.children?.length && <Icon w={5} h={5} as={ChevronDownIcon} transition="all .3s ease" />}
              </Link>
            </PopoverTrigger>

            {!!navItem.children?.length && (
              <PopoverContent border={0} boxShadow={'xl'} bg={popoverContentBgColor} minW={'xs'} p="2">
                <Box>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Box>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

export default DesktopNav;
