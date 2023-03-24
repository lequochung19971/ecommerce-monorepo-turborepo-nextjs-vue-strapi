import type { BoxProps } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

export const MotionBox = motion<Omit<BoxProps, 'transition'>>(Box);
