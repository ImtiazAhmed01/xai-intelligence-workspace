'use client';
import { motion } from 'framer-motion';

export default function Button({ children, ...props }: any) {
    return (
        <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="px-8 py-4 bg-white text-black rounded-2xl font-medium text-lg transition-all active:bg-gray-200"
            {...props}
        >
            {children}
        </motion.button>
    );
}