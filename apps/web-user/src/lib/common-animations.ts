import { stagger, type Variants } from "motion/react";

export const ANIMATION_DELAYS = {
	STAGGER: 0.08,
	SPRING_CONFIG: { stiffness: 300, damping: 24 },
} as const;

export const commonAnimations = {
	container: {
		hidden: { opacity: 0, y: 8 },
		show: {
			opacity: 1,
			y: 0,
			transition: {
				delayChildren: stagger(ANIMATION_DELAYS.STAGGER),
				when: "beforeChildren",
			},
		},
	} as Variants,

	item: {
		hidden: { opacity: 0, y: 6, scale: 0.995 },
		show: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				type: "spring",
				...ANIMATION_DELAYS.SPRING_CONFIG,
			},
		},
	} as Variants,

	hoverScale: {
		scale: 1.01,
		transition: {
			type: "spring",
			...ANIMATION_DELAYS.SPRING_CONFIG,
		},
	},
};
