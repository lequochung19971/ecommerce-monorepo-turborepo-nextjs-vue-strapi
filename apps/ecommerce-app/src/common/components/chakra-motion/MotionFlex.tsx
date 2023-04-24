import type { FlexProps } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import { motion } from 'framer-motion';

export const MotionFlex = motion<Omit<FlexProps, 'transition'>>(Flex);
