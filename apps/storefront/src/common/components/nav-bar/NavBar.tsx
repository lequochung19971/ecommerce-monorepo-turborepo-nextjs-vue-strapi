import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { FaBoxOpen, FaSignOutAlt, FaUserAlt } from 'react-icons/fa';
import useSWR from 'swr';
import { ApiUrl } from 'types';

import { AppRoute } from '@/common/enums';
import { httpMethods } from '@/common/http';
import { httpFetcher } from '@/common/http/httpFetcher';
import type { NavItem } from '@/common/types';
import type { Category } from '@/modules/products/types';

import AppLogo from '../AppLogo';
import SearchField from '../SearchField';
import ShoppingCart from '../ShoppingCart';
import DesktopNav from './DesktopNav';
import { MobileNav } from './MobileNav';

function generateProductNavItemsFromCategories(categories: Category[]): NavItem[] {
  return categories.map((category) => {
    return {
      label: category.name,
      href: `${AppRoute.COLLECTIONS}/${category.slug}`,
      children: generateProductNavItemsFromCategories(category.childCategories ?? []),
    } as NavItem;
  });
}

export const NavBar: React.FunctionComponent = () => {
  const { data } = useSWR(
    httpMethods.get(ApiUrl.CATEGORIES, {
      params: {
        populate: {
          0: 'childCategories',
          1: 'childCategories.childCategories',
        },
      },
    }),
    httpFetcher<{
      data: Category[];
    }>(),
  );

  const navItems = useMemo(() => {
    return [
      {
        label: 'Home',
        href: AppRoute.HOME,
      },
      {
        label: 'Products',
        href: AppRoute.COLLECTIONS,
        children: generateProductNavItemsFromCategories(data?.data ?? []),
      },
      {
        label: 'About',
        href: '#',
      },
      {
        label: 'Contact',
        href: AppRoute.CONTACT,
      },
    ];
  }, [data]);

  const { isOpen, onToggle } = useDisclosure();
  const session = useSession();
  const router = useRouter();
  return (
    <Box className="app-navbar" position="fixed" top="0" w="full" zIndex="9999">
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
      >
        <Flex flex={{ base: 1, md: 'auto' }} ml={{ base: -2 }} display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <AppLogo
            width="100px"
            height="auto"
            fontSize="16px"
            cursor="pointer"
            onClick={() => router.push(AppRoute.HOME)}
          />
          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav items={navItems} />
          </Flex>
        </Flex>
        <Box mr="4" display={{ base: 'none', md: 'block' }}>
          <SearchField
            timeout={250}
            variant="filled"
            placeholder="What are you looking for?"
            inputGroupProps={{
              width: 300,
            }}
          />
        </Box>

        <Stack flex={{ base: 1, md: 0 }} justify="flex-end" alignItems="center" direction={'row'} spacing={4}>
          {!session.data ? (
            <>
              <Button
                fontSize={'sm'}
                fontWeight={600}
                textDecoration="none"
                onClick={() => router.push(AppRoute.AUTH_SIGN_IN)}
              >
                Sign In
              </Button>
              <Button
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'sm'}
                fontWeight={600}
                color={'white'}
                bg={'blue.400'}
                onClick={() => router.push(AppRoute.AUTH_SIGN_UP)}
                _hover={{
                  bg: 'blue.300',
                }}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <Flex alignItems={'center'}>
              <Menu>
                <MenuButton as={Button} rounded={'full'} variant={'link'} cursor={'pointer'} minW={0}>
                  <Avatar size={'sm'} bg="gray.400" />
                </MenuButton>
                <MenuList>
                  <MenuItem>
                    <Icon w={5} as={FaUserAlt} mr="4" />
                    <Text>Profile</Text>
                  </MenuItem>
                  <MenuItem>
                    <Icon w={5} as={FaBoxOpen} mr="4" />
                    <Text>My orders</Text>
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={() => signOut()}>
                    <Icon w={5} as={FaSignOutAlt} mr="4" />
                    <Text>Logout</Text>
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          )}
          <ShoppingCart />
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav items={navItems} />
      </Collapse>
    </Box>
  );
};
export default NavBar;
