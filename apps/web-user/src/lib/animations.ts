import type { Transition } from "motion/react";

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
