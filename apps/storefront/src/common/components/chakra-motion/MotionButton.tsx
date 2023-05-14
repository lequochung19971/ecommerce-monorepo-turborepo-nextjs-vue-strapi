import type { ButtonProps } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';

export const MotionButton = motion<Omit<ButtonProps, 'transition'>>(Button);
