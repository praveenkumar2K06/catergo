import type { Transition, Variants } from "motion/react";

export const fadeAnimation = {
	initial: { opacity: 0, scale: 0.8 },
	animate: { opacity: 1, scale: 1 },
	exit: { opacity: 0, scale: 0.8 },
	transition: {
		duration: 0.3,
		ease: "linear",
		type: "spring",
	} as Transition,
};

export const containerPage = {
	hidden: { opacity: 0, y: 8 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			staggerChildren: 0.08,
			when: "beforeChildren",
		},
	},
} as Variants;

export const itemPage = {
	hidden: { opacity: 0, y: 6, scale: 0.995 },
	show: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			type: "spring",
			stiffness: 300,
			damping: 24,
		},
	},
} as Variants;
