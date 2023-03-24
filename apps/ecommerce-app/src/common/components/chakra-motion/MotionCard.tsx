import type { CardProps } from '@chakra-ui/react';
import { Card } from '@chakra-ui/react';
import { motion } from 'framer-motion';

export const MotionCard = motion<Omit<CardProps, 'transition'>>(Card);
