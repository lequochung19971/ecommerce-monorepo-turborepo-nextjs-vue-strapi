import { ChevronDownIcon, Icon } from '@chakra-ui/icons';
import { Collapse, Flex, Link, Stack, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';

import type { NavItem } from '@/common/types';

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack w="full">
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
        onClick={children && onToggle}
        className="app-mobile-nav-item"
      >
        <Text fontWeight={600} color={useColorModeValue('gray.600', 'gray.200')}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse
        in={isOpen}
        animateOpacity
        style={{ marginTop: '0!important' }}
        className="app-mobile-nav-item__collapse"
      >
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map((child) => {
              if (child.children?.length) {
                return <MobileNavItem key={child.label} {...child} />;
              }

              return (
                <Link key={child.label} py={2} href={child.href}>
                  {child.label}
                </Link>
              );
            })}
        </Stack>
      </Collapse>
    </Stack>
  );
};

type MobileNavProps = {
  items: NavItem[];
};

export const MobileNav: React.FunctionComponent<MobileNavProps> = ({ items }) => {
  return (
    <Stack bg={useColorModeValue('white', 'gray.800')} p={4} display={{ md: 'none' }} className="app-mobile-nav">
      {items.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};
